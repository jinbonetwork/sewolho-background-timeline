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

	jQuery.MarsaDiagram = function( options, element ) {
		this.$el = jQuery( element );
		this.$wel = this.$el.find('.wrapper');
		this._init( options );
	};

	jQuery.MarsaDiagram.defaults = {
		root : '#marsa',
		eventHandle : true,
		stroke : { color : '#fff', hover : '#FBF59B' },
		background: '',
		effect: 'opacity',
		onBefore: function() { return false },
		onAfter: function() { return false }
	},

	jQuery.MarsaDiagram.prototype = {
		_init: function(options) {
			var self = this;

			this.options = $.extend( true, {}, jQuery.MarsaDiagram.defaults, options );
			this.$objs = {};
			this.$items = [];

			var transEndEventNames = {
				'WebkitTransition': 'webkitTransitionEnd',
				'MozTransition': 'transitionend',
				'OTransition': 'oTransitionEnd',
				'msTransition': 'MSTransitionEnd',
				'transition': 'transitionend'
			};
			this.transEndEventName = transEndEventNames[Modernizr.prefixed( 'transition' )] + '.marsado';
			// support css 3d transforms && css transitions && Modernizr.csstransformspreserve3d
			this.support = Modernizr.csstransitions && Modernizr.csstransforms3d && Modernizr.csstransformspreserve3d;

			this.$elWidth = jQuery(this.$el).width();
			jQuery(this.$el).height(this.$el.parent().height());
			this.$elHeight = jQuery(this.$el).height();

			this.$el.addClass('marsa-diagram');
			this.root = this.$el.find(this.options.root);
			this.tree = {};
			this.root.find('.point').each(function(i) {
				var item = jQuery(this);
				var id = item.attr('id');
				self.tree[id] = {};
				self.tree[id].item = item;
				self.tree[id].left = 0;
				self.tree[id].top = 0;
				self.tree[id].target = item.attr('data-tree').split(' ');
				self.tree[id].diagram = {};
				for(var j=0; j < self.tree[id].target.length; j++) {
					var orgin = jQuery('#'+self.tree[id].target[j]+'.element').attr('data-orgin');
					orgin = (orgin ? " " : "")+id; 
					jQuery('#'+self.tree[id].target[j]+'.element').attr('data-orgin',orgin);
					var svg = jQuery('<div id="'+id+'_'+self.tree[id].target[j]+'" class="connector '+id+' '+self.tree[id].target[j]+'"><svg width="0" height="0"><line class="straight" x1="0" y1="0" x2="0" y2="0" stroke="'+self.options.stroke.color+'" stroke-width="2" stroke-dasharray="2,2" fill="currentColor"></line><line class="oblique" x1="0" y1="0" x2="0" y2="0" stroke="'+self.options.stroke.color+'" stroke-width="2" stroke-dasharray="2,2" fill="currentColor"></line></svg></div>');
					self.remove_effect(svg);
					svg.appendTo(self.$wel);
					self.tree[id].diagram[self.tree[id].target[j]] = svg;
				}
			});

			this.rLeft = parseInt( (this.$elWidth - this.root.width()) / 2 );
			if(this.$elWidth < this.$elHeight)
				this.rTop = parseInt( this.$elHeight * 0.05 );
			else
				this.rTop = parseInt( this.$elHeight * 0.13 );
			this.root.css( {
				'left': this.rLeft + 'px',
				'top': this.rTop + 'px'
			} );

			var $items = this.$el.find('.element');
            $items.each(function(i) {
                var item = jQuery(this);
				self.remove_effect(item);
                var obj = {};
                var id = item.attr('id');
                obj.item = item;
                obj.id = id;
				obj.left = 0;
				obj.top = 0;
                self.$objs[id] = obj;
                self.$items.push(obj);
            });

			if(this.options.background) {
				this.$background = this.$el.find('img.background');
				if(this.$background.length < 1) {
					this.$background = jQuery('<img src="'+this.options.background+'" class="background" />');
					this.$background.prependTo(self.$el);
				}
				var hiddenImg = new Image();
                hiddenImg.onload = function() {
					var bl = parseInt((self.$el.outerWidth() - this.width) / 2);
					var bt = parseInt((self.$el.outerHeight() - this.height) / 2);
					self.$background.css({
						'left' : bl+'px',
						'top'  : bt+'px'
					});
				};
                hiddenImg.src = self.$background.attr('src');
			}

			if(this.options.eventHandle === true)
				this.init();
		},

		init: function() {
			this.resize();
			this.initEvent();
		},

		resize: function() {
			var self = this;
			this.$elWidth = jQuery(this.$el).width();
			jQuery(this.$el).height(this.$el.parent().height());
			this.$elHeight = jQuery(this.$el).height();
			this.rLeft = parseInt( (this.$elWidth - this.root.width()) / 2 );
			if(this.$elWidth < this.$elHeight)
				this.rTop = parseInt( this.$elHeight * 0.05 );
			else
				this.rTop = parseInt( this.$elHeight * 0.13 );
			this.root.css( {
				'left': this.rLeft + 'px',
				'top': this.rTop + 'px'
			} );
			jQuery.each(self.tree, function( key, obj ) {
				var ep = obj.item.attr('data-endpoint');
				if(ep == 'left') {
					obj.left = obj.item.offset().left;
					obj.top = obj.item.offset().top + parseInt( obj.item.outerHeight() / 2);
				} else if(ep == 'bottom') {
					obj.left = obj.item.offset().left + parseInt( obj.item.outerWidth() / 2);
					obj.top = obj.item.offset().top + obj.item.outerHeight();
				} else if(ep == 'right') {
					obj.left = obj.item.offset().left + obj.item.outerWidth();
					obj.top = obj.item.offset().top + parseInt( obj.item.outerHeight() / 2);
				} else if(ep == 'top') {
					obj.left = obj.item.offset().left + parseInt( obj.item.outerWidth() / 2);
					obj.top = obj.item.offset().top;
				}
			});

			this.marginTop = parseInt( this.$elHeight * 0.06 );

			self.set_politic('marsa-advisory');
			self.set_mof('marsa-sub-board');
			self.set_kst('marsa-sub-board');
			self.set_navy('marsa-sub-board');
			self.set_umi('marsa-sub-chief');
			self.set_kcg('marsa-sub-chief');
			self.set_haewon('marsa-sub-chief');
			self.set_shipowners('marsa-sub-chief');
			self.set_kr('marsa-sub-chief');

			if(this.options.background) {
				var bl = parseInt((this.$el.outerWidth() - this.$background.width()) / 2);
                var bt = parseInt((this.$el.outerHeight() - this.$background.height()) / 2);
				this.$background.css({
					'left' : bl+'px',
					'top'  : bt+'px'
                });
			}
		},

		apply_effect: function(obj) {
			switch(this.options.effect) {
				case 'opacity':
					obj.css( { 'opacity' : '1' } );
					break;
				default:
					break;
			}
		},
		remove_effect: function(obj) {
			switch(this.options.effect) {
				case 'opacity':
					obj.css( { 'opacity' : '0' } );
					break;
				default:
					break;
			}
		},

		set_politic: function(rootId) {
			var self = this;
			
			var item = this.$objs['politic'];
			var obj = item.item;
			var w = obj.outerWidth();

			this.apply_effect(obj);
			if(w < this.rLeft) {
				var l = parseInt( ( this.rLeft - w ) * 0.33 );
				var t = parseInt( this.$elHeight * 0.048 );
				obj.css({
					'left' : l + 'px',
					'top' : t + 'px'
				});
				var pl = l + obj.outerWidth();
				var pt = t + parseInt( obj.outerHeight() / 2 );
			} else {
				var l = parseInt( this.$elWidth * 0.05 );
				var t = this.rTop + this.root.outerHeight() + 20;
				obj.css({
					'left' : l + 'px',
					'top' : t + 'px'
				});
				var pl = l + parseInt(obj.outerWidth() / 2);
				var pt = t;
			}
			this.$objs['politic'].left = l;
			this.$objs['politic'].top = t;
			var svg = this.tree[rootId].diagram['politic'];
			var direct = this.tree[rootId].item.attr('data-endpoint');

			this.draw_svg(svg,direct,this.tree[rootId].left,this.tree[rootId].top,pl,pt);
		},

		set_umi: function(rootId) {
			var self = this;
			
			var item = this.$objs['umi'];
			var obj = item.item;
			var w = obj.outerWidth();

			var politic = this.$objs['politic'];
			var mof = this.$objs['mof'];
			var navy = this.$objs['navy'];

			this.apply_effect(obj);

			var l = Math.min( parseInt(this.$elWidth * 0.17), ( politic.left + parseInt(politic.item.outerWidth() * 0.5) ) );
			l = Math.min( (this.$elWidth - w), l);
			if( ( l + w + 20 ) > navy.left ) {
				var t = navy.top + navy.item.outerHeight() + this.marginTop;
			} else {
				var t = politic.top + politic.item.outerHeight() + this.marginTop;
			}
			obj.css({
				'left' : l + 'px',
				'top' : t + 'px'
			});
			if(this.$elWidth > 990) {
				var pl = l + obj.outerWidth();
				var pt = t + parseInt( obj.outerHeight() / 2 );
			} else {
				var pl = l + parseInt( obj.outerWidth() / 2 );
				var pt = t;
			}

			this.$objs['umi'].left = l;
			this.$objs['umi'].top = t;
			var svg = this.tree[rootId].diagram['umi'];
			var direct = this.tree[rootId].item.attr('data-endpoint');

			this.draw_svg(svg,direct,this.tree[rootId].left,this.tree[rootId].top,pl,pt);
		},

		set_kcg: function(rootId) {
			var self = this;
			
			var item = this.$objs['kcg'];
			var obj = item.item;
			var w = obj.outerWidth();

			var umi = this.$objs['umi'];
			var kst = this.$objs['kst'];

			this.apply_effect(obj);

			var t = 0;
			var l = Math.min( parseInt(this.$elWidth * 0.24), ( umi.left + parseInt(umi.item.outerWidth() * 0.45) ) );
			if(this.tree[rootId].item.offset().left > w) {
				l = Math.min( ( this.tree[rootId].item.offset().left - w ), l);
			}
			l = Math.min( (this.$elWidth - w), l);
			if((l + obj.width + 20) > kst.left) {
				l = kst.left - (obj.width + 20);
				if(l < parseInt( ( this.rLeft - w ) * 0.33 ) ) {
					l = parseInt( ( this.rLeft - w ) * 0.33 );
					t = kst.top + kst.item.outerHeight() + this.marginTop;
				}
			}
			if(!t)
				var t = umi.top + umi.item.outerHeight() + this.marginTop;
			obj.css({
				'left' : l + 'px',
				'top' : t + 'px'
			});
			var pl = l + parseInt( obj.outerWidth() / 2 );
			var pt = t;

			this.$objs['kcg'].left = l;
			this.$objs['kcg'].top = t;
			var svg = this.tree[rootId].diagram['kcg'];
			var direct = this.tree[rootId].item.attr('data-endpoint');

			this.draw_svg(svg,direct,this.tree[rootId].left,this.tree[rootId].top,pl,pt);
		},

		set_haewon: function(rootId) {
			var self = this;
			
			var item = this.$objs['haewon'];
			var obj = item.item;
			var w = obj.outerWidth();

			var kcg = this.$objs['kcg'];
			var shipowners = this.$objs['shipowners'];
			var umi = this.$objs['umi'];
			var navy = this.$objs['navy'];

			this.apply_effect(obj);

			if ( ( kcg.left + kcg.item.outerWidth() + w + parseInt( this.$elWidth * 0.04 ) ) < navy.left ) {
				var l = kcg.left + kcg.item.outerWidth() + parseInt( this.$elWidth * 0.02 );
				var t = umi.top + umi.item.outerHeight();
				if( navy.top < t ) {
					t = navy.top + 20;
				}
			} else if ( ( umi.left + umi.item.outerWidth() + w + parseInt( this.$elWidth * 0.04 ) + navy.item.outerWidth() ) < this.$elWidth ) {
				var l = umi.left + umi.item.outerWidth() + parseInt( this.$elWidth * 0.02 );
				var t = kcg.top - 20 - obj.outerHeight();
			} else {
				var t = kcg.top + kcg.item.outerHeight() + this.marginTop;
				var l = parseInt( (this.$elWidth - w) / 2);
			}
			obj.css({
				'left' : l + 'px',
				'top' : t + 'px'
			});
			var pl = l + parseInt( obj.outerWidth() / 2 );
			var pt = t;

			this.$objs['haewon'].left = l;
			this.$objs['haewon'].top = t;
			var svg = this.tree[rootId].diagram['haewon'];
			var direct = this.tree[rootId].item.attr('data-endpoint');

			this.draw_svg(svg,direct,this.tree[rootId].left,this.tree[rootId].top,pl,pt);
		},

		set_shipowners: function(rootId) {
			var self = this;
			
			var item = this.$objs['shipowners'];
			var obj = item.item;
			var w = obj.outerWidth();

			var kcg = this.$objs['kcg'];
			var haewon = this.$objs['haewon'];
			var navy = this.$objs['navy'];

			this.apply_effect(obj);

			var l = Math.min( (this.$elWidth - w), ( haewon.left + parseInt( haewon.item.outerWidth() * 0.66 ) ) );
			var t = haewon.top + haewon.item.outerHeight() + 25;
			if( t < ( navy.top + navy.item.outerHeight() ) ) {
				t = navy.top + navy.item.outerHeight() + this.marginTop;
			}
			obj.css({
				'left' : l + 'px',
				'top' : t + 'px'
			});
			var pl = l + parseInt( obj.outerWidth() / 2 );
			var pt = t;

			this.$objs['shipowners'].left = l;
			this.$objs['shipowners'].top = t;
			var svg = this.tree[rootId].diagram['shipowners'];
			var direct = this.tree[rootId].item.attr('data-endpoint');

			this.draw_svg(svg,direct,this.tree[rootId].left,this.tree[rootId].top,pl,pt);
		},

		set_kr: function(rootId) {
			var self = this;
			
			var item = this.$objs['kr'];
			var obj = item.item;
			var w = obj.outerWidth();

			var shipowners = this.$objs['shipowners'];
			var haewon = this.$objs['haewon'];
			var navy = this.$objs['navy'];

			this.apply_effect(obj);

			if( ( shipowners.left + shipowners.item.outerWidth() + parseInt( this.$elWidth * 0.02 ) + w ) < this.$elWidth) {
				var l = shipowners.left + shipowners.item.outerWidth() + parseInt( this.$elWidth * 0.02 );
				var t = shipowners.top - 22;
				if( ( navy.top + navy.item.outerHeight() + this.marginTop ) > t ) {
					t = navy.top + navy.item.outerHeight() + this.marginTop;
				}
			} else {
				var l = Math.min( (this.$elWidth - w), ( shipowners.left + parseInt( shipowners.item.outerWidth() * 0.33 ) ) );
				var t = shipowners.top + shipowners.item.outerHeight() + 25;
			}
			obj.css({
				'left' : l + 'px',
				'top' : t + 'px'
			});
			var pl = l + parseInt( obj.outerWidth() / 2 );
			var pt = t;

			this.$objs['kr'].left = l;
			this.$objs['kr'].top = t;
			var svg = this.tree[rootId].diagram['kr'];
			var direct = this.tree[rootId].item.attr('data-endpoint');

			this.draw_svg(svg,direct,this.tree[rootId].left,this.tree[rootId].top,pl,pt);
		},

		set_mof: function(rootId) {
			var self = this;
			
			var item = this.$objs['mof'];
			var obj = item.item;
			var w = obj.outerWidth();

			var politic = this.$objs['politic'];

			this.apply_effect(obj);

			if(w < ( this.$elWidth - this.rLeft - this.root.outerWidth() ) ) {
				var l = this.rLeft + this.root.outerWidth() + parseInt( ( this.$elWidth - this.rLeft - this.root.outerWidth() - w ) * 0.5 );
				var t = this.rTop;
				obj.css({
					'left' : l + 'px',
					'top' : t + 'px'
				});
				var pl = l;
				var pt = t + parseInt( obj.outerHeight() / 2 );
			} else {
				var l = Math.min( ( this.$elWidth - w ),  parseInt( this.$elWidth * 0.75 ) );
				if( ( politic.left + politic.item.outerWidth() + w + 25 ) > this.$elWidth) {
					var t = politic.top + politic.item.outerHeight() + 20;
				} else {
					var t = this.rTop + this.root.outerHeight() + 20;
				}
				obj.css({
					'left' : l + 'px',
					'top' : t + 'px'
				});
				if( ( this.tree[rootId].left + 60 ) > l) {
					var pl = l + parseInt( w / 2 );
					var pt = t;
				} else {
					var pl = l;
					var pt = t + parseInt( obj.outerHeight() / 2 );
				}
			}

			this.$objs['mof'].left = l;
			this.$objs['mof'].top = t;
			var svg = this.tree[rootId].diagram['mof'];
			var direct = this.tree[rootId].item.attr('data-endpoint');

			this.draw_svg(svg,direct,this.tree[rootId].left,this.tree[rootId].top,pl,pt);
		},

		set_kst: function(rootId) {
			var self = this;
			
			var item = this.$objs['kst'];
			var obj = item.item;
			var w = obj.outerWidth();

			var mof = this.$objs['mof'];

			this.apply_effect(obj);

			var t = mof.top + mof.item.outerHeight() + this.marginTop;
			var l = Math.min( ( this.$elWidth - w ), ( mof.left + parseInt( mof.item.outerWidth() * 0.06 ) ) );

			obj.css({
				'left' : l + 'px',
				'top' : t + 'px'
			});

			if( ( this.tree[rootId].left + 60 ) > l) {
				var pl = l + parseInt( w / 2 );
				var pt = t;
			} else {
				var pl = l;
				var pt = t + parseInt( obj.outerHeight() / 2 );
			}

			this.$objs['kst'].left = l;
			this.$objs['kst'].top = t;
			var svg = this.tree[rootId].diagram['kst'];
			var direct = this.tree[rootId].item.attr('data-endpoint');

			this.draw_svg(svg,direct,this.tree[rootId].left,this.tree[rootId].top,pl,pt);
		},

		set_navy: function(rootId) {
			var self = this;
			
			var item = this.$objs['navy'];
			var obj = item.item;
			var w = obj.outerWidth();

			var kst = this.$objs['kst'];

			this.apply_effect(obj);

			var t = kst.top + kst.item.outerHeight() + this.marginTop;
			var l = Math.min( ( this.$elWidth - w ), ( kst.left - parseInt( kst.item.outerWidth() * 0.3 ) ) );

			obj.css({
				'left' : l + 'px',
				'top' : t + 'px'
			});

			if( ( this.tree[rootId].left + 60 ) > l) {
				var pl = l + parseInt( w / 2 );
				var pt = t;
			} else {
				var pl = l;
				var pt = t + parseInt( obj.outerHeight() / 2 );
			}

			this.$objs['navy'].left = l;
			this.$objs['navy'].top = t;
			var svg = this.tree[rootId].diagram['navy'];
			var direct = this.tree[rootId].item.attr('data-endpoint');

			this.draw_svg(svg,direct,this.tree[rootId].left,this.tree[rootId].top,pl,pt);
		},

		draw_svg: function(connector,direct,rleft,rtop,oleft,otop) {
			var svg_w = Math.abs(rleft - oleft);
			var svg_h = Math.abs(rtop - otop);
			var svg = connector.find('svg');
			svg.attr('width',svg_w);
			svg.attr('height',svg_h);
			this.apply_effect(connector);
			connector.css({
				'top' : ( (otop < rtop) ? otop : rtop ) + 'px'
			});

			var straight = svg.find('line.straight');
			var oblique = svg.find('line.oblique');

			switch(direct){
				case 'left':
					connector.css({
						'left' : ( (rleft - 60 < oleft) ? rleft - 60 : oleft) + 'px'
					});
					if( ( ( rleft - 60 ) < oleft ) ) {
						svg_w = 60;
						svg.attr('width',svg_w);
						straight.attr('x1', 0 );
						straight.attr('x2', 60 );
					} else {
						straight.attr('x1', svg_w - 60);
						straight.attr('x2', svg_w);
					}
					if(otop < rtop) {
						straight.attr('y1', svg_h );
						straight.attr('y2', svg_h );
					} else {
						straight.attr('y1', 0 );
						straight.attr('y2', 0 );
					}
					oblique.attr('x1', 0 );
					oblique.attr('x2', svg_w - 60 );
					if(otop < rtop) {
						oblique.attr('y1', 0);
						oblique.attr('y2', svg_h );
					} else {
						oblique.attr('y1', svg_h );
						oblique.attr('y2', 0 );
					}
					break;
				case 'top':
					break;
				case 'bottom':
					connector.css({
						'left' : ( (rleft < oleft) ? rleft : oleft) + 'px'
					});
					if(rleft > oleft) {
						straight.attr('x1', svg_w);
						straight.attr('x2', svg_w);
					} else {
						straight.attr('x1', 0);
						straight.attr('x2', 0);
					}
					straight.attr('y1', 0);
					straight.attr('y2', 60);

					oblique.attr('x1', 0);
					oblique.attr('x2', svg_w);
					if(rleft > oleft) {
						oblique.attr('y1', svg_h);
						oblique.attr('y2', 60);
					} else {
						oblique.attr('y1', 60);
						oblique.attr('y2', svg_h);
					}
					break;
				case 'right':
					connector.css({
						'left' : ( (rleft > oleft) ? oleft : rleft) + 'px'
					});
					straight.attr('x1', 0);
					straight.attr('x2', 60);
					if(otop < rtop) {
						straight.attr('y1', svg_h );
						straight.attr('y2', svg_h );
					} else {
						straight.attr('y1', 0);
						straight.attr('y2', 0);
					}
					oblique.attr('x1', 60);
					oblique.attr('x2', svg_w);
					if(otop < rtop) {
						oblique.attr('y1', svg_h);
						oblique.attr('y2', 0 );
					} else {
						oblique.attr('y1', 0 );
						oblique.attr('y2', svg_h );
					}
					break;
			}
		},

		initEvent: function() {
			var self = this;
			this.enableEvent = true;

			this.root.find('.point').hover(
				function() {
					var cl = jQuery(this).attr('id');
					if(self.enableEvent == true) {
						jQuery(this).addClass('hover');
						jQuery(this).siblings().removeClass('hover');
						self.$el.find('.connector').each(function() {
							var id = jQuery(this).attr('id').split('_')[1];
							if(jQuery(this).hasClass(cl)) {
								jQuery(this).addClass('active');
								self.$el.find('#'+id+'.element').addClass('active');
								jQuery(this).find('line').attr('stroke',self.options.stroke.hover);
							} else {
								jQuery(this).removeClass('active');
								self.$el.find('#'+id+'.element').removeClass('active');
								jQuery(this).find('line').attr('stroke',self.options.stroke.color);
							}
						});
					}
				},
				function() {
				}
			);

			for(var i=0; i<this.$items.length; i++) {
				this.$items[i].item.bind('mouseenter.marsado touchstart.marsado', function(e) {
					if(self.enableEvent == true) {
						var id = jQuery(this).attr('id');
						var orgin = jQuery(this).attr('data-orgin').split(' ');
						if(orgin.length > 0) {
							self.root.find('.point').removeClass('hover');
							self.$el.find('.element').removeClass('active');
							self.$el.find('.connector').removeClass('active').find('line').attr('stroke',self.options.stroke.color);
							for(var j=0; j<orgin.length; j++) {
								self.tree[orgin[j]].item.addClass('hover');
							}
						}
						jQuery(this).addClass('active');
						self.$el.find('.connector.'+id).addClass('active').find('line').attr('stroke',self.options.stroke.hover);
					}
				});
			}

			this.options.onAfter();

			$window.bind('resize.marsado',function(e) {
                if(self.enableEvent === true) {
                    self.resize();
                }
            });
		},

		stop: function() {
			var self = this;
			this.enableEvent = false;
			for(var i=0; i<this.$items.length; i++) {
				this.remove_effect(this.$items[i].item);
			}
			this.$el.find('.connector').each(function() {
				self.remove_effect(jQuery(this));
			});
		}
	};

	jQuery.fn.marsado = function( options ) {
		if ( typeof options === 'string' ) {
			var args = Array.prototype.slice.call( arguments, 1 );
			this.each(function() {
				var instance = $.data( this, 'marsado' );
				if ( !instance ) {
					console.log( "cannot call methods on marsado prior to initialization; " +
					"attempted to call method '" + options + "'" );
					return;
				}
				if ( !jQuery.isFunction( instance[options] ) || options.charAt(0) === "_" ) {
					console.log( "no such method '" + options + "' for marsado instance" );
					return;
				}
				instance[ options ].apply( instance, args );
			});
		}
		else {
			this.each(function() {
				var instance = jQuery.data( this, 'marsado' );
				if ( instance ) {
					instance._init();
				}
				else {
					instance = jQuery.data( this, 'marsado', new jQuery.MarsaDiagram( options, this ) );
				}
			});
		}
		return this;
	};
} )( jQuery, window );
