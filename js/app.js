useWebkit = false;
mobileMode = false;
var transition;
var transitionEnd;

function resizeWindow() {
	var fh = parseInt(jQuery('#site-footer').css('height'));
	jQuery('#site-main').css({'height': (jQuery(window).innerHeight()-fh) + 'px'});
	if(jQuery(window).width() <= 640) mobileMode = true;
	else mobileMode = false;

	var sa = jQuery('.sewol-content-slider.active');
	if(sa.length > 0) {
		if(jQuery(window).width() <= 1024) {
			var d = sa.find('.text-wrap');
			var ud = sa.find('.description');
		} else {
			var d = sa.find('.description');
			var ud = sa.find('.text-wrap');
		}
		if(d.hasClass('perfect-scroll')) {
			ud.perfectScrollbar('destroy');
			d.perfectScrollbar();
		} else {
			d.addClass('perfect-scroll');
			d.perfectScrollbar();
		}
		if(ud.hasClass('perfect-scroll')) {
			ud.perfectScrollbar('destroy');
			ud.removeClass('perfect-scroll');
		}
	}
}

jQuery(document).ready(function() {
	var ContainerStyle;
	function _getVendorPropertyName(prop) {
		var prefixes = ['Moz', 'Webkit', 'O', 'ms'];
		var prop_ = prop.charAt(0).toUpperCase() + prop.substr(1);

		for (var i=0; i<prefixes.length; ++i) {
			var vendorProp = prefixes[i] + prop_;
			if (vendorProp in ContainerStyle) { return '-'+prefixes[i]+'-'+prop_; }
		}
	}

	var TransitionEndeventNames = {
		'transition':			'transitionEnd',
		'-Moz-Transition':		'transitionend',
		'-O-Transition':		'oTransitionEnd',
		'-Webkit-Transition':	'webkitTransitionEnd',
		'-ms-Transition':		'msTransitionEnd'
	};

	var SUPPORTS_TOUCH = 'ontouchstart' in window;

	ContainerStyle = jQuery('#frame')[0].style;
	useWebkit = false;
	if(SUPPORTS_TOUCH || _getVendorPropertyName('transition')) {
		useWebkit = true;
		transition = _getVendorPropertyName('transition');
		transitionEnd = TransitionEndeventNames[transition] || null;
		if(transitionEnd) transitionEnd = transitionEnd+'.sewol';
	}

	function make_org_history() {
		var history = {};
		if(jQuery('#site-main').hasClass('infographic')) {
			history.mode = 'marsa_structure';
		} else {
			history.mode = 'fs_mode';
		}
		history.pageMode = jQuery('#article-flip').attr('attr-pagemode');
		history.chapter = jQuery('#article-flip').attr('data-currentchapter');
		history.activeI = jQuery('#chapter'+history.chapter+'-timeline').attr('data-active-item'); 
		history.activeC = jQuery('#chapter'+history.chapter+'-timeline').attr('data-active-items'); 

		if(history.pageMode == 'four-slide' && jQuery('.fsbb-wrapper').hasClass('cover')) {
			jQuery('h1.fsbb-title').hide();
			history.hide_title = true;
		} else {
			history.hide_title = false;
		}

		jQuery('#site-main').data('site-navy-history',history);
	}

	function org_fs_mode(obj) {
		make_org_history();

		if( jQuery(obj).hasClass('org') ) {
			var headline = jQuery(obj).find('h5').text();
			var tg = jQuery(obj).attr('id');
			var t = jQuery(obj).find('h5').offset().top - 5;
			var l = jQuery(obj).find('h5').offset().left - 10;
			var cw = jQuery(obj).find('h5').width() + 60;
			if(!jQuery(obj).hasClass('has-description')){
				cw = cw + 80;
			}
			var ch = jQuery(obj).find('h5').height() + 20;
		} else {
			var headline = jQuery(obj).find('.btn').text();
			var tg = jQuery(obj).attr('data-tag');
			var t = jQuery(obj).offset().top;
			var l = jQuery(obj).offset().left;
			var cw = jQuery(obj).width();
			var ch = jQuery(obj).height();
		}

		var fsbbc = jQuery('<div class="fsbb-org-title"><div class="wrapper"><div class="icon-close" title="돌아가기"><span>돌아가기</span></div><div class="inner"><div class="organize"><h2 class="">'+headline+'</h2></div></div></div></div>');
		var inner = fsbbc.find('.inner');
		var org = fsbbc.find('.organize');

		var hasdescript = false;
		if( jQuery(obj).find('.org-description').length > 0 ) {
			hasdescript = true;
			fsbbc.addClass('has-description');
			var d = jQuery(obj).find('.org-description').html();
			org.append('<div class="org-description">'+d+'</div>');
		}

		org.addClass(tg);

		if(mobileMode === true) {
			var tw = parseInt(jQuery('#article-flip').innerWidth() - 60)
		} else {
			if(hasdescript === true) {
				var th = parseInt(jQuery('#site-main').height() * 0.3);
				var tw = parseInt(jQuery('#site-main').width() * 0.3);
			} else {
				var th = parseInt( jQuery('#site-main').height() * 0.073 );
				var tw = parseInt( jQuery('#site-main').width() * 0.14 );
			}
		}

		var hide = jQuery('<div class="fsbb-org-title"></div>');
		inner.clone().appendTo(hide);
		hide.wrap('<div id="fsbb-org-dummy"></div>');
		var dummy = hide.parent();
		if(mobileMode === true) {
			hide.width(tw);
		} else {
			if(hasdescript === true) {
				hide.width(tw);
				hide.addClass('has-description');
			} else {
				hide.height(th);
			}
		}
		dummy.appendTo('body');
		
		tw = hide.find('.inner').actual('width');
		if(mobileMode === true) {
			th = hide.find('.inner').actual('height') + 26;
		} else {
			th = hide.find('.inner').actual('height');
		}

		dummy.remove();

		if(mobileMode === true) {
			fsbbc.prependTo('#article-flip');
		} else {
			fsbbc.appendTo('#site-main');
		}
		fsbbc.css( { 'left': l+'px', 'top': t+'px' } );
		inner.css( { 'width' : cw+'px', 'height' : ch+'px' } );
		if(hasdescript === true) {
			if( jQuery(obj).hasClass('org') ) {
				fsbbc.find('h2').css( { 'font-size' : '0.9em' } );
			} else {
				fsbbc.find('h2').css( { 'font-size' : '1.0em' } );
			}
		} else {
			if( jQuery(obj).hasClass('org') ) {
				fsbbc.find('h2').css( { 'font-size' : '0.9em' } );
			}
		}
		fsbbc.addClass('animate');
		jQuery('.sewol-content-slider').removeClass('active').removeClass('show');

		if( jQuery(obj).hasClass('org') ) {
			hide_marsa_structure(function() {
				animate_org_fs(fsbbc,tg,tw,th,hasdescript);
			});
			hide_marsa_structure();
		} else {
			animate_org_fs(fsbbc,tg,tw,th,hasdescript);
		}

		fsbbc.find('.icon-close').bind('click',function(e) {
			rollback_fsbb(fsbbc);
		});
	}

	function animate_org_fs(fsbbc,tg, tw, th,hasdescript) {
		jQuery('.sewol-timeline').sewoltm('init', { tag : tg, mode: 'overlay', multiple: true, eventHandle : true } )
		jQuery('#article-flip').fsbb('init', {
			mode: 'quart',
			title : '.fsbb-org-title',
			title_pos : {
				'left' : (mobileMode !== true ? parseInt( (jQuery('#site-main').width() - tw ) / 2) : 30),
				'top' : (mobileMode !== true ? parseInt( (jQuery('#site-main').height() - th ) / 2) : 30)
			}
		});
		var inner = fsbbc.find('.inner');
		inner.css( { 'width' : tw + 'px', 'height' : th + 'px' } );
		if(hasdescript === true) {
			fsbbc.find('h2').css( { 'font-size' : '1.25em' } );
		}
	}

	function close_org_fs_mode(fsbbc) {
		var inner = fsbbc.find('.inner');
		fsbbc.css({
			'left' : parseInt(jQuery('#site-main').width() / 2)+'px',
			'top' : parseInt(jQuery('#site-main').height() / 2)+'px',
			'opacity' : 0
		});
		inner.css({
			'width' : '0',
			'height' : '0'
		});
		if(inner.find('.org-description').length > 0) {
			fsbbc.find('h2').css( { 'font-size' : '0em' } );
		}
		if(useWebkit) {
			inner.bind(transitionEnd,function(e) {
				jQuery('.fsbb-org-title').remove();
			});
		} else {
			jQuery('.fsbb-org-title').remove();
		}
	}

	function rollback_fsbb(fsbbc) {
		var history = jQuery('#site-main').data('site-navy-history');
		if( history.pageMode == 'four-slide' ) {
			go_home();
			if(history.hide_title === true) {
				jQuery('h1.fsbb-title').show();
			}
			if(history.mode == 'marsa_structure') {
				setTimeout(function() {
					show_marsa_structure();
				}, 1000);
			}
		} else {
			var chl = history.chapter;
			var activeI = history.activeI;
			var activeC = history.activeC;
			jQuery('#article-flip').fsbb('bb_activate',{
				chapter : chl,
				bookblock_after : function() {
					jQuery('#chapter'+chl+'-item .sewol-timeline').sewoltm('activeElement',activeI,true);
					jQuery('#chapter'+chl+'-item .sewol-timeline').sewoltm('hoverContentTitle',activeI,activeC);
					jQuery('#chapter'+chl+'-item .sewol-timeline').sewoltm('showContent',activeI,activeC,'opacity');
					jQuery('#chapter'+chl+'-item .sewol-timeline').sewoltm('scrollTo',activeI);
				}
			});
			if(history.mode == 'marsa_structure') {
				setTimeout(function() {
					show_marsa_structure();
				}, 1010);
			}
		}
		close_org_fs_mode(fsbbc);
	}

	function show_marsa_structure() {
		jQuery('#site-main').addClass('infographic');
		setTimeout(function() {
			jQuery('#marsa_structure .wrapper').addClass('active');
			setTimeout(function() {
				var $this = jQuery('#marsa_structure .wrapper');
				if(jQuery('#site-main #marsa_structure .icon-close').data('clickEvent') !== true) {
					jQuery('#site-main #marsa_structure .icon-close').click(function(e) {
						hide_marsa_structure();
					});
					jQuery('#site-main #marsa_structure .icon-close').data('clickEvent',true);
				}
				jQuery('#marsa_structure').marsado('init');
				if(!$this.hasClass('perfect-scroll')) {
					$this.addClass('perfect-scroll');
					$this.perfectScrollbar();
				} else {
					$this.perfectScrollbar('destroy');
					$this.perfectScrollbar();
				}
			}, 600);
		}, 10);
	}

	function hide_marsa_structure(callback) {
		jQuery('#marsa_structure').marsado('stop');
		jQuery('#marsa_structure .wrapper').removeClass('active');
		setTimeout(function() {
			jQuery('#site-main').removeClass('infographic');
			if(callback !== 'undefined' && typeof(callback) == 'function') {
				callback();
			};
		}, 600);
	}
	
	jQuery('#article-flip').fsbb({
		title: '#headline_title',
		background: './images/background.jpg',
		Opening: '세월호는 왜.',
		bb_before: function(chapter) {
			var fsbbc = jQuery('.fsbb-org-title');
			if(fsbbc.length > 0) {
				close_org_fs_mode(fsbbc);
			}
			jQuery('#chapter'+parseInt(jQuery('#article-flip').attr('data-currentchapter'))+'-item .sewol-timeline').sewoltm('hideContent','opacity');
		},
		bb_after: function(chapter) {
			if(chapter) {
				jQuery('.chapter-item').each(function() {
					var d = jQuery(this).data('chapter');
					if(d == chapter) {
						jQuery('.chapter'+chapter+'-item .sewol-timeline').sewoltm('init', { eventHandle : true } );
					} else {
						jQuery('.chapter'+d+'-item .sewol-timeline').sewoltm('stop');
					}
				});
			}
		}
	});
	jQuery('.sewol-timeline').sewoltm({
		scrollElement: '.item-wrapper',
		eventHandle: false,
		onBefore: function() {
		},
		onShowContent: function(obj) {
			if(jQuery(window).width() <= 1024) {
				var d = jQuery(obj).find('.text-wrap');
				var ud = jQuery(obj).find('.description');
			} else {
				var d = jQuery(obj).find('.description');
				var ud = jQuery(obj).find('.text-wrap');
			}
			if(d.hasClass('perfect-scroll')) {
				d.perfectScrollbar('destroy');
				d.perfectScrollbar();
			} else {
				d.addClass('perfect-scroll');
				d.perfectScrollbar();
			}
			if(ud.hasClass('perfect-scroll')) {
				ud.perfectScrollbar('destroy');
				ud.removeClass('perfect-scroll');
			}
			jQuery(obj).find('.organize').each(function() {
				if(jQuery(this).data('activated') !== true) {
					jQuery(this).hover(
						function() {
							var r = parseInt( jQuery(this).width() / Math.sqrt(2) );
							jQuery(this).find('.btn .after').css('height',r+'px');
						},
						function() {
							jQuery(this).find('.btn .after').css('height','0%');
						}
					);
					jQuery(this).data('activated',true);
					jQuery(this).bind('click.sewol',function(e) {
//						if(jQuery(window).width() > 640) {
							org_fs_mode(this);
//						}
					});
				}
			});
		},
		onFirstContent: function(obj) {
			var btn = jQuery(obj).parents('.sewol-content-container').find('.navi.prev');
			if(btn.data('firstEvent') != true) {
				btn.bind('click.sewol',function(e) {
					var $this = jQuery(this);
					var cI = parseInt($this.parents('.sewol-content-slider').attr('data-active-item'));
					var cIs = parseInt($this.parents('.sewol-content-slider').attr('data-active-items'));
					if(cI == 0 && cIs == 0) {
						var cC = parseInt(jQuery('#article-flip').attr('data-currentchapter'));
						if(cC > 1) {
							jQuery('#article-flip').bookblock('jump', (cC - 1));
							setTimeout(function() {
								var li = jQuery('#chapter'+(cC - 1)+'-item .sewol-timeline .timeline-item:last');
								var tI = li.attr('data-item');
								var tIs = li.find('.item-content:last').attr('data-items');
								jQuery('#chapter'+(cC - 1)+'-item .sewol-timeline').sewoltm('activeElement',tI,false);
								jQuery('#chapter'+(cC - 1)+'-item .sewol-timeline').sewoltm('hoverContentTitle',tI,tIs);
								jQuery('#chapter'+(cC - 1)+'-item .sewol-timeline').sewoltm('showContent',tI,tIs,'opacity');
								jQuery('#chapter'+(cC - 1)+'-item .sewol-timeline').sewoltm('scrollTo',tI);
							},1520);
						}
					}
				});
				btn.data('firstEvent',true);
			}
		},
		onLastContent: function(obj) {
			var btn = jQuery(obj).parents('.sewol-content-container').find('.navi.next');
			if(btn.data('lastEvent') != true) {
				btn.bind('click.sewol',function(e) {
					var $this = jQuery(this);
					if($this.hasClass('unactive')) {
						var cC = parseInt(jQuery('#article-flip').attr('data-currentchapter'));
						if(cC < 4) {
							jQuery('#article-flip').bookblock('jump', (cC + 1));
							setTimeout(function() {
								jQuery('#chapter'+(cC + 1)+'-item .sewol-timeline').sewoltm('activeElement',0,false);
								jQuery('#chapter'+(cC + 1)+'-item .sewol-timeline').sewoltm('hoverContentTitle',0,0);
								jQuery('#chapter'+(cC + 1)+'-item .sewol-timeline').sewoltm('showContent',0,0,'opacity');
								jQuery('#chapter'+(cC + 1)+'-item .sewol-timeline').sewoltm('scrollTo',0);
							},1520);
						}
					}
				});
				btn.data('lastEvent',true);
			}
		}
	});

	function go_home() {
		jQuery('.fsbb-org-title').remove();
		jQuery('.chapter-item.hover').removeClass('hover');
		jQuery('.overlay').removeClass('overlay');
		jQuery('.quart').removeClass('quart');
		jQuery('#article-flip').fsbb('init',{});
		jQuery('.sewol-timeline').sewoltm('stop');
	}

	/* site navi */
	if(SUPPORTS_TOUCH) {
		jQuery('#site-footer #mobile-menu').bind('touchstart.sewol', function(e) {
			if(jQuery('#mobile-site-footer').hasClass('active')) {
				jQuery('#mobile-site-footer').removeClass('active');
			} else {
				jQuery('#mobile-site-footer').addClass('active');
			}
		});
	} else {
		jQuery('#site-footer #mobile-menu').bind('click.sewol', function(e) {
			if(jQuery('#mobile-site-footer').hasClass('active')) {
				jQuery('#mobile-site-footer').removeClass('active');
			} else {
				jQuery('#mobile-site-footer').addClass('active');
			}
		});
	}
	jQuery('#site-footer #foot-logo').click(function(e) {
		if(jQuery('#site-main').hasClass('infographic')) {
			hide_marsa_structure(function() {
				go_home();
			});
		} else {
			jQuery('h1.fsbb-title').show();
			go_home();
		}
	});
	jQuery('#site-footer #go-marsa').click(function(e) {
		if(!jQuery('#site-main').hasClass('infographic')) {
			var fsbbc = jQuery('.fsbb-org-title');
			if(fsbbc.length > 0) {
				rollback_fsbb(fsbbc);
				var history = jQuery('#site-main').data('site-navy-history');
				if(history.mode != 'marsa_structure') {
					if( history.pageMode == 'bookblock' ) {
						setTimeout(function() {
							show_marsa_structure();
						}, 1010);
					} else {
						show_marsa_structure();
					}
				}
			} else {
				show_marsa_structure();
			}
		} else {
			hide_marsa_structure();
		}
	});

	jQuery('#site-footer #go-marsa .icon-close').click(function(e) {
		hide_marsa_structure();
	});

	jQuery('#site-footer .nav .box-info').bind('click', function(e) {
		var id = jQuery(this).attr('for');
		var obj = jQuery('#site-footer .site-info #'+jQuery(this).attr('for'));
		if(obj.hasClass('active')) {
			obj.removeClass('active');
		} else {
			obj.addClass('active').siblings().removeClass('active');
		}
	});
	jQuery('#site-footer .site-info .icon-close').bind('click',function(e) {
		jQuery(this).parents('.boxinfo').removeClass('active');
	});
	jQuery('#site-footer #spin-off').click(function(e) {
		
		window.open('/','_blank');
	});

	jQuery('#mobile-site-footer .go-home').click(function(e) {
		jQuery('#mobile-site-footer').removeClass('active');
		if(jQuery('#site-main').hasClass('infographic')) {
			hide_marsa_structure(function() {
				go_home();
			});
		} else {
			jQuery('h1.fsbb-title').show();
			go_home();
		}
	});
	jQuery('#mobile-site-footer .go-chapter').click(function(e) {
		jQuery('#mobile-site-footer').removeClass('active');
		var chapter = jQuery(this).attr('data-chapter');
		if(jQuery('#site-main').hasClass('infographic')) {
			hide_marsa_structure(function() {
				if(jQuery('.fsbb-wrapper').hasClass('bb-mode')) {
					jQuery('#article-flip').bookblock('jump',chapter);
				} else {
					jQuery('#article-flip').fsbb('bb_activate',{
		                chapter : chapter
					});
				}
			});
		} else {
			if(jQuery('.fsbb-wrapper').hasClass('bb-mode')) {
				jQuery('#article-flip').bookblock('jump',chapter);
			} else {
				jQuery('#article-flip').fsbb('bb_activate',{
					chapter : chapter
				});
			}
		}
	});
	jQuery('#mobile-site-footer').on( {
		'swipeleft' : function( event ) {
			jQuery('#mobile-site-footer').removeClass('active');
		},
		'swiperight' : function( event ) {
			jQuery('#mobile-site-footer').addClass('active');
		}
	} );

	jQuery('#mobile-site-footer .go-marsa').click(function(e) {
		jQuery('#mobile-site-footer').removeClass('active');
		if(!jQuery('#site-main').hasClass('infographic')) {
			var fsbbc = jQuery('.fsbb-org-title');
			if(fsbbc.length > 0) {
				rollback_fsbb(fsbbc);
				var history = jQuery('#site-main').data('site-navy-history');
				if(history.mode != 'marsa_structure') {
					if( history.pageMode == 'bookblock' ) {
						setTimeout(function() {
							show_marsa_structure();
						}, 1010);
					} else {
						show_marsa_structure();
					}
				}
			} else {
				show_marsa_structure();
			}
		} else {
			hide_marsa_structure();
		}
	});
	jQuery('#mobile-site-footer .box-info').bind('click', function(e) {
		var id = jQuery(this).attr('for');
		var obj = jQuery('#site-footer .site-info #'+jQuery(this).attr('for'));
		if(obj.hasClass('active')) {
			obj.removeClass('active');
		} else {
			obj.addClass('active').siblings().removeClass('active');
		}
	});

	jQuery('#marsa_structure').marsado({
		root : '#marsa',
		eventHandle : false,
		background: './images/background.jpg',
		onAfter: function() {
			jQuery('#marsa_structure .org').click(function(e) {
				if(jQuery(this).hasClass('active')) {
					org_fs_mode(this);
				}
			});
			jQuery('#marsa.org h5').click(function(e) {
				org_fs_mode(jQuery(this).parent());
			});
		}
    });

	jQuery(window).resize(function(e) {
		resizeWindow();
	});
	resizeWindow();
});
