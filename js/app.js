useWebkit = false;
var transition;
var transitionEnd;

function resizeWindow() {
	var fh = parseInt(jQuery('#site-footer').css('height'));
	jQuery('#site-main').css({'height': (jQuery(window).innerHeight()-fh) + 'px'});
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

		if(hasdescript === true) {
			var th = parseInt(jQuery('#site-main').height() * 0.3);
			var tw = parseInt(jQuery('#site-main').width() * 0.3);
		} else {
			var th = parseInt( jQuery('#site-main').height() * 0.073 );
			var tw = parseInt( jQuery('#site-main').width() * 0.14 );
		}

		var hide = jQuery('<div class="fsbb-org-title"></div>');
		inner.clone().appendTo(hide);
		hide.wrap('<div id="fsbb-org-dummy"></div>');
		var dummy = hide.parent();
		if(hasdescript === true) {
			hide.width(tw);
			hide.addClass('has-description');
		} else {
			hide.height(th);
		}
		dummy.appendTo('body');
		
		tw = hide.find('.inner').actual('width');
		th = hide.find('.inner').actual('height');

		dummy.remove();

		fsbbc.appendTo('#site-main');
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
		jQuery('.sewol-timeline').sewoltm('init', { tag : tg, mode: 'overlay', eventHandle : true } )
		jQuery('#article-flip').fsbb('init', {
			mode: 'quart',
			title : '.fsbb-org-title',
			title_pos : {
				'left' : parseInt( (jQuery('#site-main').width() - tw ) / 2),
				'top' : parseInt( (jQuery('#site-main').height() - th ) / 2)
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
					jQuery('#chapter'+chl+'-item .sewol-timeline').sewoltm('activeElement',activeI);
					jQuery('#chapter'+chl+'-item .sewol-timeline').sewoltm('hoverContentTitle',activeI,activeC);
					jQuery('#chapter'+chl+'-item .sewol-timeline').sewoltm('showContent',activeI,activeC,'opacity');
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
			jQuery('#marsa_structure .wrapper').bind(transitionEnd, function(e) {
				jQuery('#marsa_structure').marsado('init');
				if(!jQuery(this).hasClass('perfect-scroll')) {
					jQuery(this).addClass('perfect-scroll');
					jQuery(this).perfectScrollbar();
				} else {
					jQuery(this).find('.wrapper').perfectScrollbar('update');
				}
				jQuery(this).unbind(transitionEnd);
			});
		}, 10);
	}

	function hide_marsa_structure(callback) {
		jQuery('#marsa_structure').marsado('stop');
		jQuery('#marsa_structure .wrapper').removeClass('active');
		jQuery('#marsa_structure .wrapper').bind(transitionEnd, function(e) {
			jQuery('#site-main').removeClass('infographic');
			if(callback !== 'undefined' && typeof(callback) == 'function') {
				callback();
			};
			jQuery(this).unbind(transitionEnd);
		});
	}
	
	jQuery('#article-flip').fsbb({
		title: '#headline_title',
		background: './images/background.jpg',
		bb_before: function(chapter) {
			var fsbbc = jQuery('.fsbb-org-title');
			if(fsbbc.length > 0) {
				close_org_fs_mode(fsbbc);
			}
		},
		bb_after: function(chapter) {
			if(chapter) {
				jQuery('.chapter-item').each(function() {
					var d = jQuery(this).data('chapter');
					if(d == chapter) {
						jQuery('.chapter'+chapter+'-item .sewol-timeline').sewoltm('init', { eventHandle : true } );
						jQuery('.chapter'+chapter+'-item .organize').each(function() {
							if(jQuery(this).data('activated') !== true) {
								jQuery(this).hover(function() {
									var r = parseInt( jQuery(this).width() / Math.sqrt(2) );
									jQuery(this).find('.btn .after').css('height',r+'px');
									},
									function() {
										jQuery(this).find('.btn .after').css('height','0%');
									}
								);
								jQuery(this).data('activated',true);
								jQuery(this).bind('click.sewol',function(e) {
									org_fs_mode(this);
								});
							}
						});
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
			var d = jQuery(obj).find('.description');
			d.addClass('perfect-scroll');
			if(d.data('perfect-scroll') === true) {
				d.perfectScrollbar('update');
			} else {
				d.perfectScrollbar();
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

	jQuery('#marsa_structure').marsado({
		root : '#marsa',
		eventHandle : false,
		background: './images/background.jpg',
		onAfter: function() {
			if(SUPPORTS_TOUCH) {
				jQuery('#marsa_structure .org').bind('touchstart.marsado',function(e) {
					if(jQuery(this).hasClass('active')) {
						org_fs_mode(this);
					}
				});
			} else {
				jQuery('#marsa_structure .org').click(function(e) {
					if(jQuery(this).hasClass('active')) {
						org_fs_mode(this);
					}
				});
			}
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
