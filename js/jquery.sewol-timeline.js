;( function( $, window, undefined ) {

	'use strict';

	var $window = jQuery(window),
        Modernizr = window.Modernizr;

    // https://gist.github.com/edankwan/4389601
	Modernizr.addTest('csstransformspreserve3d', function () {
		var prop = Modernizr.prefixed('transformStyle');
		var val = 'preserve-3d';
		var computedStyle;
		if(!prop) return false;

		prop = prop.replace(/([A-Z])/g, function(str,m1){ return '-' + m1.toLowerCase(); }).replace(/^ms-/,'-ms-');

		Modernizr.testStyles('#modernizr{' + prop + ':' + val + ';}', function (el, rule) {
			computedStyle = window.getComputedStyle ? getComputedStyle(el, null).getPropertyValue(prop) : '';
		});

		return (computedStyle === val);
	});
	
	jQuery.SewolTimeline = function( options, element ) {
		this.$el = jQuery( element );
		this._init( options );
    };

	jQuery.SewolTimeline.defaults = {
		theme : 'sewol',
		mode : 'full',
		multiple : false,
		tag : '',
		scrollElement : '.item-wrapper',
		showContentAnimate : 'opacity',
		showContentOnHover : false,
		slideContentAnimate : 'horizontal-slide',
		eventHandle : 'true',
		autostart : false,
		onBefore: function() { return false },
		onShowContent: function(target) { return false; },
		onFirstContent: function(target) { return false; },
		onLastContent: function(target) { return false; },
		onResize: function(uniqueID) { return false; }
	};

	jQuery.SewolTimeline.prototype = {
		_init : function(options) {
			var self = this;

			this.options = $.extend( true, {}, jQuery.SewolTimeline.defaults, options );
			this.$items = [];
			var $items = this.$el.children('.timeline-item');
			this.uniqueID = this.unique_ID(6);
			this.$el.addClass(this.uniqueID);

			var transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'transition': 'transitionend'
			};
			this.transEndEventName = transEndEventNames[Modernizr.prefixed( 'transition' )] + '.sewoltm';
			// support css 3d transforms && css transitions && Modernizr.csstransformspreserve3d
			this.support = Modernizr.csstransitions && Modernizr.csstransforms3d && Modernizr.csstransformspreserve3d;
			
			this.$el.wrap('<div class="sewol-timeline-wrapper"></div>');
			this.$wel = this.$el.parent();
			this.$wel.addClass(this.options.theme);
			if(this.options.scrollElement) {
				this.$scrollElement = this.$el.parents(this.options.scrollElement);
			}

			this.$items = [];
			$items.each(function(i) {
				var obj = {};
				obj.item = jQuery(this);
				obj.item.attr('data-item',i);
				obj.pubdate = obj.item.find('.date');
				obj.pubdate.attr('data-item',i);
				obj.pubdate.append('<div class="clone"><span class="after"></span></div>');
				obj.items = [];
				var citems = obj.item.find('.item-content');
				citems.each(function(k) {
					var obj2 = {};
					obj2.item = jQuery(this);
					obj2.item.attr('data-item',i).attr('data-items',k);
					obj2.title = obj2.item.find('.headline');
					obj2.title.attr('data-item',i).attr('data-items',k);
					obj2.title.append('<div class="clone"><span>'+obj2.title.html()+'</span></div><div class="after"></div>');
					obj2.text = obj2.item.find('.text');
					obj2.text.attr('data-item',i).attr('data-items',k);
					var tags = obj2.item.attr('data-tags').split(' ');
					for(var j=0; j<tags.length; j++) {
						obj.item.addClass(tags[j]);
					}
					obj.items.push(obj2);
				});
				self.$items.push(obj);
			});

			this.$slider = jQuery('<div id="'+this.$el.attr('id')+'-slider'+'" class="sewol-content-slider"><div class="sewol-content-container"><div class="icon-close"><span>닫기</span></div><div class="sewol-content-wrapper"><div class="slide-item prev"></div><div class="slide-item current"></div><div class="slide-item next"></div></div><div class="navi prev"><span>이전</span></div><div class="navi next"><span>다음</span></div></div></div>');
			this.$slider.appendTo('body');
			this.$slider.attr('data-unique-id',this.uniqueID);
			this.$slider_prev_wrapper = '<div class="slide-item prev"></div>';
			this.$slider_next_wrapper = '<div class="slide-item next"></div>';

			this.init({'mode' : 'full'});
		},
		unique_ID: function(size) {

			var getRandomNumber = function(range) {
				return Math.floor(Math.random() * range);
			};

			var getRandomChar = function() {
				var chars = "abcdefghijklmnopqurstuvwxyzABCDEFGHIJKLMNOPQURSTUVWXYZ";
				return chars.substr( getRandomNumber(62), 1 );
			};

			var randomID = function(size) {
				var str = "";
				for(var i = 0; i < size; i++) {
					str += getRandomChar();
				}
				return str;
			};

			return randomID(size);
        },
		init: function(options) {
			var self = this;
			var opt = $.extend( true, {}, self.options, options );

			this.$tag = opt.tag;
			if(this.$el.data('mode')) {
				this.$wel.removeClass(this.$el.data('mode'));
				this.$slider.removeClass(this.$el.data('mode'));
			}
			this.$el.data('mode',opt.mode);
			this.$el.attr('data-mode',opt.mode);
			this.$wel.addClass(opt.mode);
			this.$slider.addClass(opt.mode);
			this.multiple = opt.multiple;

			self.resize();
			this.options.onBefore();
			if(opt.eventHandle === true || opt.eventHandle === 'true') {
				self.initEvent(opt.autostart);
			}
		},
		activeElement : function(idx,auto) {
			var self = this;
			if(!this.$items[idx].item.hasClass('active')) {
				this.$items[idx].item.addClass('active').siblings().each(function() {
					self.reactiveElement(jQuery(this).attr('data-item'));
				});
				this.$items[idx].pubdate.bind(self.transEndEventName, function(e) {
					var c = jQuery(this).find('.clone');
					c.addClass('active');
					jQuery(this).unbind(self.transEndEventName);
				});
				if(auto === true) {
					this.hoverContentTitle(idx,0);
					if(this.options.showContentOnHover === true && this.$el.data('mode') == 'full')
						this.showContent(idx,0,self.options.showContentAnimate,self.options.showContentAnimate);
				}
			}
		},
		reactiveElement : function(idx) {
			var self = this;
			if(this.$items[idx].item.hasClass('active')) {
				this.$items[idx].pubdate.find('.clone').removeClass('active');
				setTimeout(function() {
					self.$items[idx].item.removeClass('active');
				},300);
			}
		},
		checkReactivateElement : function(i) {
			if(this.currentActivate == i) return;
			var al = false;
			for(var l=0; l<this.$items[i].items.length; l++) {
				if(this.$items[i].items[l].item.hasClass('active')) {
					al = true;
					break;
				}
			}
			if(al === false) {
				this.reactiveElement(i);
			}
		},
		hoverContentTitle : function(i,j) {
			var self = this;
			if(this.$items[i].items[j].title.hasClass('hover')) return;
			this.$items[i].items[j].title.addClass('hover');
			for(var k=0; k<this.$items.length; k++) {
				for(var l=0; l<this.$items[k].items.length; l++) {
					if(k != i || l != j) {
						this.unhoverContentTitle(k,l);
					}
				}
			}
		},
		showContent : function(i,j,show_effect,slide_effect) {
			var self = this;

			if(this.multiple === true) {
				if(!this.$slider.hasClass('active')) {
					jQuery('.sewol-content-slider').each(function(i) {
						if(jQuery(this).attr('data-unique-id') != self.uniqueID) {
							jQuery('.'+jQuery(this).attr('data-unique-id')).sewoltm('hideContent','');
						}
					});
				}
			}

			if(this.$el.data('mode') == 'full') {
				this.$items[i].items[j].title.find('.after').addClass('hover');
			}
			this.$el.find('.headline .after').css({'width' : '0' });
			var s = this.$items[i].items[j].title.offset().left + this.$items[i].items[j].title.width();
			var e = parseInt(this.$slider.css('left'));
			this.$items[i].items[j].title.find('.after').css( { 'width' : ( e - s + 20) + 'px' } );

			var s_wrapper = this.$slider.find('.sewol-content-container');
			var cs_effect = s_wrapper.data('cur-effect');
			if(cs_effect && cs_effect != slide_effect) {
				s_wrapper.removeClass(cs_effect);
			}
			s_wrapper.addClass(slide_effect);
			s_wrapper.data('cur-effect',slide_effect);

			if(!this.$slider.hasClass('active')) {
				var c_effect = this.$slider.data('cur-effect');
				if(c_effect && c_effect != show_effect) {
					this.$slider.removeClass(c_effect);
				}
				this.$slider.addClass(show_effect);
				this.$slider.data('cur-effect',show_effect);
				this.$slider.find('.slide-item.current').html('').append(this.$items[i].items[j].text);
				this.$slider.addClass('active');
				if(show_effect) {
					setTimeout(function() {
						self.$slider.addClass('show');
					}, 10);
				} else {
					this.$slider.addClass('show');
				}
				this.$slider.find('.navi').unbind('click.sewoltm');
				this.$slider.find('.navi').bind('click.sewoltm',function(e) {
					var $this = jQuery(this);
					if($this.hasClass('unactive')) return;
					var curI = parseInt(self.$slider.attr('data-active-item'));
					var curJ = parseInt(self.$slider.attr('data-active-items'));
					if($this.hasClass('prev')) {
						self.prevContent(curI,curJ);
					} else if($this.hasClass('next')) {
						self.nextContent(curI,curJ);
					}
				});
			} else {
				var ci = this.$slider.attr('data-active-item');
				var cis = this.$slider.attr('data-active-items');
				if(ci > i) var dir = 'prev';
				else if(ci < i) var dir = 'next';
				else {
					if(cis > j) var dir = 'prev';
					else if(cis < j) var dir = 'next';
					else var dir = 'current';
				}
				if(dir != 'current')
					this.$slider.find('.slide-item.'+dir).html('').append(this.$items[i].items[j].text);
				if(dir == 'next') {
					this.$slider.find('.slide-item.prev').remove();
					this.$slider.find('.slide-item.current').removeClass('current').addClass('prev');
					this.$slider.find('.slide-item.next').removeClass('next').addClass('current');
					this.$slider.find('.sewol-content-wrapper').append(self.$slider_next_wrapper);
				} else if(dir == 'prev') {
					this.$slider.find('.slide-item.next').remove();
					this.$slider.find('.slide-item.current').removeClass('current').addClass('next');
					this.$slider.find('.slide-item.prev').removeClass('prev').addClass('current');
					this.$slider.find('.sewol-content-wrapper').prepend(self.$slider_prev_wrapper);
				}
			}

			this.$slider.attr('data-active-item',i);
			this.$slider.attr('data-active-items',j);
			this.$el.attr('data-active-item',i);
			this.$el.attr('data-active-items',j);

			if (i == (self.$items.length - 1) && j == (self.$items[i].items.length -1) ) {
				self.$slider.find('.navi.next').addClass('unactive');
			} else {
				self.$slider.find('.navi.next').removeClass('unactive');
			}
			if( i ==0 && j == 0) {
				self.$slider.find('.navi.prev').addClass('unactive');
			} else {
				self.$slider.find('.navi.prev').removeClass('unactive');
			}
			if(slide_effect) {
				setTimeout(function() {
					self.onShowContent(i,j);
				},810);
			} else {
				self.onShowContent(i,j);
			}
		},
		onShowContent: function(i,j) {
			this.options.onShowContent(this.$slider.find('.slide-item.current'));
			if( i ==0 && j == 0) {
				this.options.onFirstContent(this.$slider.find('.slide-item.current'));
			}
			if (i == (this.$items.length - 1) && j == (this.$items[i].items.length -1) ) {
				this.options.onLastContent(this.$slider.find('.slide-item.current'));
			}
		},
		unhoverContentTitle : function(i,j) {
			var self = this;
			if(typeof(i) == 'undefined' || typeof(j) == 'undefined') return;
			if(!this.$items[i].items[j].title.hasClass('hover')) return;
			this.$items[i].items[j].title.removeClass('show');
			this.$items[i].items[j].title.removeClass('hover');
			this.checkReactivateElement(i);
		},
		hideContent : function(effect) {
			var self = this;
			this.$slider.find('.navi').unbind('click.sewoltm');
			var i = this.$slider.attr('data-active-item');
			var j = this.$slider.attr('data-active-items');
			if(i != undefined && j != undefined) {
				this.$items[i].items[j].title.find('.after').css( { 'width' : '0' } ).removeClass('hover');
			}
			this.$slider.find('.perfect-scroll').each(function(i) {
				jQuery(this).perfectScrollbar('destroy');
				jQuery(this).removeClass('perfect-scroll');
			});
			this.$slider.removeClass('show');
			if(effect) {
				setTimeout(function() {
					self.$slider.removeClass('active');
				}, 800);
			} else {
				this.$slider.removeClass('active');
			}
			this.unhoverContentTitle(i,j);
			this.$el.attr('data-active-item',null);
			this.$el.attr('data-active-items',null);
		},
		prevContent: function(i,j) {
			if(i == 0 && j == 0) return;
			if(j == 0) {
				var pi = i - 1;
				var pj = this.$items[pi].items.length - 1;
				this.activeElement(pi,false);
			} else {
				var pi = i;
				var pj = j - 1;
			}
			this.currentActivate = pi;
			this.hoverContentTitle(pi,pj);
			this.showContent(pi,pj,this.options.showContentAnimate,this.options.slideContentAnimate);
			this.scrollTo(pi);
		},
		nextContent: function(i,j) {
			if( ( i == ( this.$items.length - 1 ) )
				&& ( j == ( this.$items[i].items.length - 1 ) ) ) return;
			if( j == ( this.$items[i].items.length - 1) ) {
				var ni = i + 1;
				var nj = 0;
				this.activeElement(ni,true);
				this.showContent(ni,nj,this.options.showContentAnimate,this.options.slideContentAnimate);
				this.currentActivate = ni;
			} else {
				var ni = i;
				var nj = j + 1;
				this.hoverContentTitle(ni,nj);
				this.showContent(ni,nj,this.options.showContentAnimate,this.options.slideContentAnimate);
			}
			this.scrollTo(ni);
		},
		scrollTo: function(idx) {
			var cT = this.$items[idx].item.position().top + this.$items[idx].items[0].title.outerHeight();
			var tT = parseInt(this.scrollHeight / 2);
			if(cT > tT) {
				this.$scrollElement.animate( {scrollTop : (cT - tT) + 'px' }, 800);
			} else {
				this.$scrollElement.animate( {scrollTop : '0' }, 800);
			}
			if(this.$scrollElement.hasClass('perfect-scroll')) {
				this.$scrollElement.perfectScrollbar('update');
			}
		},
		setStart: function(i,j) {
			this.$slider.attr('data-target-item',i);
			this.$slider.attr('data-target-items',j);
			this.gotoItem = true;
		},
		resize : function() {
			this.welWidth = this.$wel.width();
			this.welHeight = this.$wel.height();
			this.elWidth = this.$el.width();
			this.elHeight = this.$el.height();
			if(jQuery(window).width() <= 640) this.Mobile = true;
			else this.Mobile = false;
			this.scrollHeight = this.$scrollElement.height();
			this.offsetTop = parseInt(this.$el.offset().top - this.$scrollElement.offset().top);

			var max_headline = 0;
			for(var i=0; i<this.$items.length; i++) {
				for(var j=0; j<this.$items[i].items.length; j++) {
					var obj = this.$items[i].items[j];
					if( (obj.title.offset().left + obj.title.outerWidth() ) > max_headline ) max_headline = ( obj.title.offset().left + obj.title.outerWidth() );
				}
			}
			this.maxTitle = max_headline;
			this.$el.attr('data-maxTitle',this.maxTitle);

			var max_left = this.maxTitle + 30;
			if(this.$el.data('mode') == 'full') {
				if($window.width() <= 1024) {
					var tleft = Math.min( parseInt($window.width() * 0.4), max_left);
					var twidth = ($window.width() - tleft - 50);
				} else {
					var tleft = Math.max( parseInt(this.welWidth * 0.4), max_left);
					var twidth = (this.welWidth - tleft);
				}
				var theight = parseInt(this.scrollHeight * 0.8);
				var ttop = parseInt( (this.scrollHeight - theight) / 2 );
				if(this.Mobile == true) {
					this.$slider.css({ 'left' : '0', 'top' : '0', 'width' : '100%', 'height' : (this.$scrollElement ? this.scrollHeight+'px' : '100%') });
				} else {
					this.$slider.css({ 'left' : tleft + 'px', 'top' : ttop + 'px', 'width' : twidth + 'px', 'height' : theight + 'px' });
				}
			} else if(this.$el.data('mode') == 'overlay') {
				var twidth = jQuery(window).width() * 0.6;
				var tleft = parseInt((jQuery(window).width() - twidth) / 2);
				var theight = parseInt(jQuery(window).height() * 0.8);
				var ttop = parseInt( (jQuery(window).height() - theight) / 2 );
				if(this.Mobile == true) {
					this.$slider.css({ 'left' : '0', 'top' : '0', 'width' : '100%', 'height' : '100%' });
				} else {
					this.$slider.css({ 'left' : tleft + 'px', 'top' : ttop + 'px', 'width' : '60%', 'height' : theight + 'px' });
				}
			}
			this.options.onResize(this.uniqueID);
		},
		initEvent : function(autostart) {
			var self = this;
			this.enableEvent = true;
			if(this.options.showContentOnHover === true && this.$el.data('mode') == 'full') {
				this.hoverMode = true;
				var eleventList = "mouseenter.sewoltm touchstart.sewoltm";
			} else {
				this.hoverMode = false;
				var eleventList = "click.sewoltm touchstart.sewoltm";
			}
			for(var i=0; i<this.$items.length; i++) {
				var item = this.$items[i];
				this.reactiveElement(i);
				if(item.item.data('initevent') !== true) {
					item.item.bind('mouseenter.sewoltm click.sewoltm', function(e) {
						if(self.enableEvent !== true) return;
						self.activeElement(jQuery(this).attr('data-item'),false);
						self.currentActivate = jQuery(this).attr('data-item');
					});
					item.item.bind('mouseleave.sewoltm', function(e) {
						if(self.enableEvent !== true) return;
						self.checkReactivateElement(jQuery(this).attr('data-item'));
					});
					item.item.data('initevent',true);
				}
				if(this.$tag && !item.item.hasClass(self.$tag)) {
					item.item.addClass('hidden');
				} else {
					item.item.removeClass('hidden');
					for(var j=0; j < item.items.length; j++) {
						this.unhoverContentTitle(i,j);
						item.items[j].title.find('.after').css( { 'width' : '0' } );
						if(this.$tag && !item.items[j].item.hasClass(self.$tag)) {
							item.items[j].item.addClass('hidden');
						} else {
							item.items[j].item.removeClass('hidden');
							if( item.items[j].item.data('clickevent') !== true  ) {
								item.items[j].title.bind("mouseenter.sewoltm click.sewoltm touchstart.sewoltm", function(e) {
									if(self.enableEvent !== true) return;
									self.hoverContentTitle(jQuery(this).attr('data-item'),jQuery(this).attr('data-items'));
									if(self.hoverMode === true || e.type == 'click') {
										self.showContent(jQuery(this).attr('data-item'),jQuery(this).attr('data-items'),self.options.showContentAnimate,self.options.slideContentAnimate);
									}
								});
								item.items[j].title.bind('mouseleave.sewoltm', function(e) {
									if(self.enableEvent !== true) return;
									if( jQuery(this).attr('data-item') != self.$slider.attr('data-active-item') || jQuery(this).attr('data-items') != self.$slider.attr('data-active-items') ) {
										self.unhoverContentTitle(jQuery(this).attr('data-item'),jQuery(this).attr('data-items'));
									}
								});
								item.items[j].item.data('clickevent',true);
							}
						}
					}
				}
			}
			this.$el.bind('mouseleave.sewoltm', function(e) {
				if(self.$slider.hasClass('active')) {
					var i = self.$slider.attr('data-active-item');
					var j = self.$slider.attr('data-active-items');
					self.activeElement(i,false);
					self.currentActivate = i;
					self.hoverContentTitle(i,j);
				}
			});
			var s_i = -1;
			var s_j = -1;
			if(this.gotoItem == true) {
				s_i = this.$slider.attr('data-target-item');
				s_j = this.$slider.attr('data-target-items');
				this.gotoItem = false;
			} else if(autostart == true) {
				s_i = this.$slider.attr('data-active-item');
				if(isNaN(s_i)) s_i = 0;
				s_j = this.$slider.attr('data-active-items');
				if(isNaN(s_j)) s_j = 0;
			}
			if(s_i >= 0 && s_j >= 0) {
				this.activeElement(s_i,false);
				this.currentActivate = s_i;
				this.hoverContentTitle(s_i,s_j);
				this.showContent(s_i,s_j,this.options.showContentAnimate,this.options.slideContentAnimate);
				this.scrollTo(s_i);
			}

			this.$slider.find('.icon-close').bind('click.sewoltm touchstart.sewoltm', function(e) {
				self.hideContent(self.options.showContentAnimate);
			});

			if(this.multiple !== true) {
				jQuery(document).bind('keydown.'+self.uniqueID, function(e) {
					if(self.multiple === true) return;
					var keyCode = e.keyCode || e.which,
					arrow = {
						left : 37,
						up : 38,
						right : 39,
						down : 40
					};

					var s_i = self.$slider.attr('data-active-item');
					var s_j = self.$slider.attr('data-active-items');
					if( isNaN(s_i) || isNaN(s_j) ) {
						switch (keyCode) {
							case arrow.left:
							case arrow.up:
							case arrow.right:
							case arrow.down:
								self.activeElement(0,false);
								self.currentActivate = 0;
								self.hoverContentTitle(0,0);
								self.showContent(0, 0, self.options.showContentAnimate, self.options.slideContentAnimate);
								self.scrollTo(0);
								break;
						}
					} else if(!self.$slider.hasClass('active')) {
						switch (keyCode) {
							case arrow.left:
							case arrow.up:
							case arrow.right:
							case arrow.down:
								self.activeElement(s_i,false);
								self.currentActivate = s_i;
								self.hoverContentTitle(s_i,s_j);
								self.showContent(s_i, s_j, self.options.showContentAnimate, self.options.slideContentAnimate);
								self.scrollTo(s_i);
								break;
						}
					} else {
						switch (keyCode) {
							case arrow.left:
							case arrow.up:
								self.$slider.find('.navi.prev').click();
								break;
							case arrow.right:
							case arrow.down:
								self.$slider.find('.navi.next').click();
								break;
						}
					}
				});
			}

			this.$scrollElement.scroll(function(e){
				var self = this;
			});

			$window.bind('resize.'+this.uniqueID,function(e) {
				if(self.enableEvent === true) {
					self.resize();
				}
            });
		},
		disableEvent : function() {
			var self = this;
			this.enableEvent = false;
			for(var i=0; i<this.$items.length; i++) {
				var item = this.$items[i];
				if(item.item.data('initevent') === true) {
					item.item.unbind('mouseenter.sewoltm');
					item.item.unbind('mouseleave.sewoltm');
					item.item.unbind('click.sewoltm');
					item.item.data('initevent',false);
				}
				for(var j=0; j < item.items.length; j++) {
					if(item.items[j].item.data('initevent') === true) {
						item.items[j].title.unbind('mouseenter.sewoltm');
						item.items[j].title.unbind('touchstart.sewoltm');
						item.items[j].item.data('initevent',false);
					}
					if(item.items[j].item.data('clickevent') === true) {
						item.items[j].title.unbind('click.sewoltm');
						item.items[j].item.data('clickevent',false);
					}
				}
			}
			this.$el.unbind('mouseleave.sewoltm');
			this.$slider.find('.icon-close').unbind('click.sewoltm touchstart.sewoltm');
			this.$scrollElement.unbind('scroll');
			jQuery(document).unbind('keydown.'+this.uniqueID);
			$window.unbind('resize.'+this.uniqueID);
		},
		start : function(options) {
			this.init(options);
		},
		stop : function() {
			this.disableEvent();
			this.hideContent('');
			for(var i=0; i<this.$items.length; i++) {
				for(var j=0; j<this.$items[i].items.length; j++) {
					this.unhoverContentTitle(i,j);
				}
			}
		}
	};

	jQuery.fn.sewoltm = function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'sewoltm' );
				if ( !instance ) {
					console.log( "cannot call methods on sewoltm prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !jQuery.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					console.log( "no such method '" + options + "' for sewoltm instance" );
					return;
				}
				instance[ options ].apply( instance, args );
			});
		}
		else {
			this.each(function() {
				var instance = jQuery.data( this, 'sewoltm' );
				if ( instance ) {
					instance._init();
				}
				else {
					instance = jQuery.data( this, 'sewoltm', new jQuery.SewolTimeline( options, this ) );
				}
			});
		}
		return this;
    };

} )( jQuery, window );
