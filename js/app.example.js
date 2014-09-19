useWebkit = false;
oChapterWidth = 0;
var transition;
var transitionEnd;
var pageMode = 'main';
var BBPage;

function resizeWindow() {
	var fh = parseInt(jQuery('#site-footer').css('height'));
	jQuery('#site-main').css({'height': (jQuery(window).height()-fh) + 'px'});
	if(pageMode == 'main') {
		jQuery('img.background').css({
			'left' : parseInt((jQuery('#site-main').outerWidth() - jQuery('img.background').width()) / 2)+'px',
			'top' : parseInt((jQuery('#site-main').outerHeight() - jQuery('img.background').height()) / 2)+'px'
		});
		var s_m_width = parseInt((jQuery('#site-main').width() / 2) * 0.8);
		if(useWebkit) {
			var m_svg_w = parseInt(jQuery('#chapter3-content h2 svg').attr('width'));
		} else {
			var m_svg_w = jQuery('#chapter3-content h2').width();
		}
		if((m_svg_w > s_m_width) || ( (oChapterWidth > m_svg_w) && (m_svg_w < s_m_width) )) {
			var ratio = 1 - ((m_svg_w - s_m_width) / m_svg_w);
			if(useWebkit) {
				jQuery('.four-slide h2 svg').each(function(i) {
					var w = parseInt(jQuery(this).attr('width'));
					var h = parseInt(jQuery(this).attr('height'));
					var r_w = parseInt(w * ratio);
					var r_h = parseInt(h * ratio);
					jQuery(this).attr('width',r_w);
					jQuery(this).attr('height',r_h);
				});
			}
		}
		if(useWebkit) {
			var h = jQuery('#site-header h1');
			var l = parseInt((jQuery('#site-main').width() - h.outerWidth()) / 2);
			var t = parseInt((jQuery('#site-main').height() - h.outerHeight()) / 2);
			h.css({
				'left': l+'px',
				'top' : t+'px'
			});
			var vl = jQuery('#site-header .vertical-wrap');
			vl.css({
				'height': (jQuery(window).height()-fh) + 'px',
				'left'	: parseInt((jQuery('#site-main').width() - vl.outerWidth()) / 2)+'px'
			});
			jQuery('#site-header .vertical-wrap .line').css({'height' : vl.height()+'px'});
			var hl = jQuery('#site-header .horizontal-wrap');
			hl.css({
				'top'	: parseInt((jQuery('#site-main').height() - hl.outerHeight()) / 2)+'px'
			});
			jQuery('#site-header .horizontal-wrap .line').css({'width' : hl.width()+'px'});
		} else {
			var h = jQuery('#site-header h1');
			var l = parseInt((jQuery('#site-main').width() - h.outerWidth()) / 2);
			var t = parseInt((jQuery('#site-main').height() - h.outerHeight()) / 2);
			h.css({
				'left': l+'px',
				'top' : t+'px'
			});
			var vl = jQuery('#site-header .vertical-wrap');
			vl.css('left', parseInt((jQuery('#site-main').width() - vl.outerWidth()) / 2)+'px');
			jQuery('#site-header .vertical-wrap .line').css({'height' : vl.height()+'px'});
			var hl = jQuery('#site-header .horizontal-wrap');
			hl.css('top', parseInt((jQuery('#site-main').height() - hl.outerHeight()) / 2)+'px');
			jQuery('#site-header .horizontal-wrap .line').css({'width' : hl.width()+'px'});
		}
	}
}

function FourSlideInit() {
	if(pageMode == 'bookblock') clearBB();
	pageMode = 'main';
	jQuery('#site-main').addClass('hasbackground');
	jQuery('#content-container').addClass('no-navi');
	jQuery('#site-header .vertical-wrap').css('display','block').removeClass('active');
	jQuery('#site-header .horizontal-wrap').css('display','block').removeClass('active');
	jQuery('#article-flip').addClass('four-slide');
	jQuery('#article-flip > div').addClass('four-item');

	resizeWindow();
	if(useWebkit) {
		jQuery('#site-header .horizontal-wrap .line').bind(transitionEnd,function(e) {
			jQuery('.four-slide .four-item').addClass('show');
			jQuery(this).unbind(transitionEnd);
		});
	} else {
		jQuery('.four-slide .four-item').addClass('show');
	}

	jQuery('.four-slide .four-item').bind('touchstart',function(e) {
		jQuery(this).find('.item-wrapper').addClass('hover');
		jQuery(this).siblings().find('.item-wrapper').removeClass('hover');
	});
	jQuery('.four-slide h2').bind('click touchstart',function(e) {
		var p = jQuery(this).parent().attr('id').split('-')[0];
		var cl = p+'-active';
		var h = jQuery('#site-header h1');
		if(p == 'chapter1' || p == 'chapter3') {
			h.css({ 'left': jQuery('#site-main').width()+'px' });
		} else {
			h.css({ 'left': '-'+h.outerWidth()+'px' });
		}
		var vw = jQuery('#site-header .vertical-wrap');
		var hw = jQuery('#site-header .horizontal-wrap');
		vw.addClass('active');
		hw.addClass('active');
		if(p == 'chapter1' || p == 'chapter3')
			vw.css({'left': jQuery('#site-main').width()+'px'});
		else
			vw.css({'left': '-'+vw.width()+'px'});
		if(p == 'chapter1' || p == 'chapter2')
			hw.css({'top': jQuery('#site-main').height()+'px'});
		else
			hw.css({'top': '-'+hw.height()+'px'});
		jQuery('#article-flip.four-slide').addClass('active');
		jQuery('#article-flip.four-slide').addClass(cl);
		var initP = parseInt(p.replace(/chapter/i,''));
		setTimeout(function() {
			clearFourSlide();
			BBInit(initP);
		}, 1200);
	});
}

function clearFourSlide() {
	jQuery('#site-main').removeClass('hasbackground');
	jQuery('#content-container').removeClass('no-navi');
	jQuery('#site-header .vertical-wrap').css('display','none');
	jQuery('#site-header .vertical-wrap .line').css({'height' : 0});
	jQuery('#site-header .horizontal-wrap').css('display','none');
	jQuery('#site-header .horizontal-wrap .line').css({'width' : 0});
	jQuery('.four-slide h2').unbind('click touchstart');
	jQuery('.four-slide .four-item').removeClass('four-item')
		.removeClass('show');
	jQuery('#article-flip').removeClass('four-slide')
		.removeClass('active')
		.removeClass('chapter1-active')
		.removeClass('chapter2-active')
		.removeClass('chapter3-active')
		.removeClass('chapter4-active');
}

function BBInit(page) {
	pageMode = 'bookblock';
	jQuery('.four-slide .four-item').removeClass('four-item');
	jQuery('#article-flip').addClass('bb-bookblock');
	jQuery('#article-flip > div').addClass('bb-item');

	BBPage = (function() {
		var config = {
			$bookBlock : $( '#article-flip' ),
			$page1 : jQuery( '#nav-page-1' ),
			$page2 : jQuery( '#nav-page-2' ),
			$page3 : jQuery( '#nav-page-3' ),
			$page4 : jQuery( '#nav-page-4' ),
		},
		init = function() {
			config.$bookBlock.bookblock( {
				startPage : page,
				speed : 1000,
				shadowSides : 0.8,
				shadowFlip : 0.4
			} );
			initEvents();
		},
		initEvents = function() {
			var $slides = config.$bookBlock.children();

			config.$page1.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'jump' , 1);
				return false;
			} );
			config.$page2.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'jump' , 2);
				return false;
			} );
			config.$page3.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'jump' , 3);
				return false;
			} );
			config.$page4.on( 'click touchstart', function() {
				config.$bookBlock.bookblock( 'jump' , 4);
				return false;
			} );

			$slides.on( {
				'swipeleft' : function( event ) {
					config.$bookBlock.bookblock( 'next' );
					return false;
				},
				'swiperight' : function( event ) {
					config.$bookBlock.bookblock( 'prev' );
					return false;
				}
			} );

			$( document ).keydown( function(e) {
				var keyCode = e.keyCode || e.which,
				arrow = {
					left : 37,
					up : 38,
					right : 39,
					down : 40
				};

				switch (keyCode) {
					case arrow.left:
						config.$bookBlock.bookblock( 'prev' );
						break;
					case arrow.right:
						config.$bookBlock.bookblock( 'next' );
						break;
				}
			} );
		},
		destroy = function() {
			config.$bookBlock.bookblock( 'destroy' );
			config.$bookBlock.removeData( 'bookblock' );
		};

		return { init : init , destroy : destroy };

	})();

	BBPage.init();
}

function clearBB() {
	BBPage.destroy();
	jQuery('.bb-bookblock .bb-item').removeClass('bb-item');
	jQuery('#article-flip').removeClass('bb-bookblock')
	pageMode = '';
	BBPage = null;
}

function naviInit() {
	jQuery('#site-footer #go-home').click(function() {
		if(pageMode != 'main')
			FourSlideInit();
	});
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
	
	if(useWebkit) {
		oChapterWidth = parseInt(jQuery('#chapter3-content h2 svg').attr('width'));
	}

	var pl = jQuery('#page_preloading .loading');
	pl.css({
		'left': parseInt((jQuery(window).width() - pl.width()) / 2)+'px',
		'top': parseInt((jQuery(window).height() - pl.height()) / 2)+'px',
	});
	var hiddenImg = new Image();
	hiddenImg.onload = function() {
		jQuery('#page_preloading').remove();
		FourSlideInit();
	};
	hiddenImg.src = jQuery('#site-main img.background').attr('src');

	naviInit();

	jQuery(window).resize(function(e) {
		resizeWindow();
	});
});
