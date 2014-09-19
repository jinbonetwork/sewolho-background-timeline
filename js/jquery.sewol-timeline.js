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
		tag : '',
		scrollElement : '.item-wrapper',
		showContentAnimate : 'opacity',
		eventHandle : 'true',
		onBefore: function() { return false },
		onShowContent: function(target) { return false; }
	};

	jQuery.SewolTimeline.prototype = {
		_init : function(options) {
			var self = this;

			this.options = $.extend( true, {}, jQuery.SewolTimeline.defaults, options );
			this.$items = [];
			var $items = this.$el.children('.timeline-item');

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
					var clb = jQuery('<div class="close" data-item="'+i+'" data-items="'+k+'"><span class="icon-close">Close</span></div>');
					clb.appendTo(obj2.text);
					obj2.text.wrap('<div class="text-position-wrapper"></div>');
					clb.bind('click.sewoltm touchstart.sewoltm',function(e) {
						self.hideContent(jQuery(this).attr('data-item'),jQuery(this).attr('data-items'),self.options.showContentAnimate);
						self.unhoverContentTitle(jQuery(this).attr('data-item'),jQuery(this).attr('data-items'));
					});
					var tags = obj2.item.attr('data-tags').split(' ');
					for(var j=0; j<tags.length; j++) {
						obj.item.addClass(tags[j]);
					}
					obj.items.push(obj2);
				});
				self.$items.push(obj);
			});
			this.options.onBefore();
			this.init({'mode' : 'full'});
		},
		init: function(options) {
			var self = this;
			var opt = $.extend( true, {}, self.options, options );

			this.$tag = opt.tag;
			if(this.$el.data('mode')) this.$wel.removeClass(this.$el.data('mode'));
			this.$el.data('mode',opt.mode);
			this.$el.attr('data-mode',opt.mode);
			this.$wel.addClass(opt.mode);

			self.resize();
			if(opt.eventHandle === true || opt.eventHandle === 'true')
				self.initEvent();
		},
		activeElement : function(idx) {
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
				this.hoverContentTitle(idx,0);
				if(this.$el.data('mode') == 'full')
					this.showContent(idx,0,self.options.showContentAnimate);
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
			if(this.$el.data('mode') == 'full') {
				this.$items[i].items[j].title.find('.after').addClass('hover');
				this.$items[i].items[j].title.find('.clone').bind(self.transEndEventName+'.hover', function(e) {
					var s = self.$items[i].items[j].title.offset().left + self.$items[i].items[j].title.width();
					var e = self.$items[i].items[j].text.offset().left;
					self.$items[i].items[j].title.find('.after').css( { 'width' : ( e - s ) + 'px' } );
					jQuery(this).unbind(self.transEndEventName);
				});
			}
			for(var k=0; k<this.$items.length; k++) {
				for(var l=0; l<this.$items[k].items.length; l++) {
					if(k != i || l != j) {
						this.unhoverContentTitle(k,l);
					}
				}
			}
		},
		showContent : function(i,j,effect) {
			var self = this;
			switch(effect) {
				case 'opacity':
					this.$items[i].items[j].text.css( { 'opacity' : '0' } );
					this.$items[i].items[j].text.addClass('effect').addClass('show');
					this.$items[i].items[j].item.addClass('active');
					setTimeout(function() {
						self.$items[i].items[j].text.css( { 'opacity' : '1' } );
						self.$items[i].items[j].text.bind(self.transEndEventName, function(e) {
							if(jQuery(this).hasClass('show')) {
								jQuery(this).removeClass('effect');
								self.options.onShowContent(self.$items[i].items[j].item);
							}
						});
					}, 10);
				default:
					this.$items[i].items[j].item.addClass('active');
					this.options.onShowContent(this.$items[i].items[j].item);
					break;
			}
			for(var k=0; k<this.$items.length; k++) {
				for(var l=0; l<this.$items[k].items.length; l++) {
					if(k != i || l != j) {
						this.hideContent(k,l,'');
					}
				}
			}
		},
		unhoverContentTitle : function(i,j) {
			var self = this;
			if(!this.$items[i].items[j].title.hasClass('hover')) return;
			if(this.$el.data('mode') == 'full' && this.transEndEventName) {
				this.$items[i].items[j].title.find('.after').css( { 'width' : '0' } ).removeClass('hover');
				if(parseInt(this.$items[i].items[j].title.find('.after').css('width')) > 0) {
					this.$items[i].items[j].title.find('.after').bind(self.transEndEventName+'.unhover', function(e) {
						if(!jQuery(this).hasClass('hover')) {
							self.$items[i].items[j].title.removeClass('hover');
							jQuery(this).unbind(self.transEndEventName);
						}
					});
				} else {
					this.$items[i].items[j].title.removeClass('hover');
				}
			} else {
				this.$items[i].items[j].title.removeClass('hover');
			}
			this.checkReactivateElement(i);
		},
		hideContent : function(i,j,effect) {
			var self = this;
			switch(effect) {
				case 'opacity':
					this.$items[i].items[j].text.addClass('effect').removeClass('show');
					this.$items[i].items[j].text.css( { 'opacity' : '0' } );
					this.$items[i].items[j].text.bind(self.transEndEventName, function(e) {
						if(!jQuery(this).hasClass('show')) {
							self.$items[i].items[j].item.removeClass('active');
							jQuery(this).removeClass('effect');
							jQuery(this).css( { 'opacity' : '1' } );
							//jQuery(this).unbind(self.transEndEventName);
						}
					});
					break;
				default:
					this.$items[i].items[j].item.removeClass('active');
					break;
			}
		},
		resize : function() {
			this.welWidth = this.$wel.width();
			this.welHeight = this.$wel.height();
			this.elWidth = this.$el.width();
			this.elHeight = this.$el.height();
			this.scrollHeight = this.$scrollElement.height();

			var max_headline = 0;
			for(var i=0; i<this.$items.length; i++) {
				for(var j=0; j<this.$items[i].items.length; j++) {
					var obj = this.$items[i].items[j];
					if( (obj.title.offset().left + obj.title.outerWidth() ) > max_headline ) max_headline = ( obj.title.offset().left + obj.title.outerWidth() );
				}
			}
			this.maxTitle = max_headline;
			this.$el.attr('data-maxTitle',this.maxTitle);

			for(var i=0; i<this.$items.length; i++) {
				for(var j=0; j<this.$items[i].items.length; j++) {
					var obj = this.$items[i].items[j];
					if(this.$el.data('mode') == 'full') {
						var max_left = this.maxTitle + 30;
						if($window.width() <= 1024) {
							var tleft = Math.max( parseInt($window.width() * 0.4), max_left);
							var twidth = ($window.width() - tleft - 50);
						} else {
							var tleft = Math.max( parseInt(this.welWidth * 0.4), max_left);
							var twidth = (this.welWidth - tleft);
						}
						obj.text.css({ 'left' : tleft + 'px', 'width' : twidth + 'px'});
					} else if(this.$el.data('mode') == 'overlay') {
						var twidth = jQuery(window).width() * 0.4;
						var tleft = parseInt((jQuery(window).width() - twidth) / 2);
						obj.text.css({ 'left' : tleft + 'px', 'width' : '40%'});
					}
				}
			}
		},
		initEvent : function() {
			var self = this;
			this.enableEvent = true;
			for(var i=0; i<this.$items.length; i++) {
				var item = this.$items[i];
				this.reactiveElement(i);
				if(item.item.data('initevent') !== true) {
					item.item.hover(
						function(e) {
							if(self.enableEvent !== true) return;
							self.activeElement(jQuery(this).attr('data-item'));
							self.currentActivate = jQuery(this).attr('data-item');
						},
						function(e) {
							if(self.enableEvent !== true) return;
							self.checkReactivateElement(jQuery(this).attr('data-item'));
						}
					);
					item.item.data('initevent',true);
				}
				if(this.$tag && !item.item.hasClass(self.$tag)) {
					item.item.addClass('hidden');
				} else {
					item.item.removeClass('hidden');
					for(var j=0; j < item.items.length; j++) {
						this.unhoverContentTitle(i,j);
						item.items[j].title.find('.after').css( { 'width' : '0' } );
						this.hideContent(i,j,'');
						if(this.$tag && !item.items[j].item.hasClass(self.$tag)) {
							item.items[j].item.addClass('hidden');
						} else {
							item.items[j].item.removeClass('hidden');
							if(item.items[j].item.data('hoverevent') !== true) {
								item.items[j].title.hover(
									function(e) {
										if(self.enableEvent !== true) return;
										self.hoverContentTitle(jQuery(this).attr('data-item'),jQuery(this).attr('data-items'));
										if(self.$el.data('mode') == 'full') {
											self.showContent(jQuery(this).attr('data-item'),jQuery(this).attr('data-items'),self.options.showContentAnimate);
										}
									},
									function(e) {
										if(self.enableEvent !== true) return;
										if(!self.$items[jQuery(this).attr('data-item')].items[jQuery(this).attr('data-items')].item.hasClass('active')) {
											self.unhoverContentTitle(jQuery(this).attr('data-item'),jQuery(this).attr('data-items'));
										}
									}
								);
								item.items[j].item.data('hoverevent',true);
							}
							if(this.$el.data('mode') == 'full') {
								item.items[j].title.unbind('click.sewoltm');
								item.items[j].item.data('clickevent',false);
							} else if(this.$el.data('mode') == 'overlay') {
								if(item.items[j].item.data('clickevent') !== true) {
									item.items[j].title.bind('click.sewoltm',function(e) {
										if(self.enableEvent !== true) return;
										self.showContent(jQuery(this).attr('data-item'),jQuery(this).attr('data-items'),self.options.showContentAnimate);
									});
									item.items[j].item.data('clickevent',true);
								}
							}
						}
					}
				}
			}
			this.$scrollElement.scroll(function(e){
				var self = this;
			});
			$window.bind('resize.sewoltm',function(e) {
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
					item.item.off('hover');
					item.item.data('initevent',false);
				}
				for(var j=0; j < item.items.length; j++) {
					if(item.items[j].item.data('initevent') === true) {
						item.items[j].title.off('hover');
						item.items[j].item.data('initevent',false);
					}
				}
			}
			this.$scrollElement.unbind('scroll');
//			$window.off('resize.sewoltm');
		},
		start : function(options) {
			this.init(options);
		},
		stop : function() {
			this.disableEvent();
			for(var i=0; i<this.$items.length; i++) {
				for(var j=0; j<this.$items[i].items.length; j++) {
					this.unhoverContentTitle(i,j);
					this.hideContent(i,j,'');
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
