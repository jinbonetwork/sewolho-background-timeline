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

	function org_fs_mode(obj) {
		var text = jQuery(obj).parents('.text');
		var chap_i = jQuery(obj).parents('.chapter-item');

		var c = jQuery(obj).clone();
		c.wrap('<div class="fsbb-org-title"></div>');
		var fsbbc = c.parent();
		c.append('<div class="icon-close" title="돌아가기"><span>돌아가기</span></div>');

		var tg = jQuery(obj).attr('data-tag');
		var t = jQuery(obj).offset().top;
		var l = jQuery(obj).offset().left;
		var cw = fsbbc.width();
		var ch = fsbbc.height();

		fsbbc.appendTo('#site-main');
		fsbbc.css( { 'left': l+'px', 'top': t+'px' } );
		fsbbc.addClass('animate');
		var th = 80;
		var tw = parseInt(cw * th / ch);
		jQuery('.sewol-timeline').sewoltm('init', { tag : tg, mode: 'overlay', eventHandle : true } )
		jQuery('#article-flip').fsbb('init', {
			mode: 'quart',
			title : '.fsbb-org-title',
			title_pos : {
				'left' : parseInt( (jQuery('.fsbb-wrapper').width() - tw ) / 2),
				'top' : parseInt( (jQuery('.fsbb-wrapper').height() - th ) / 2)
			}
		});
		fsbbc.css( { 'width' : tw + 'px', 'height' : th + 'px' } );

		var cbutton = fsbbc.find('.icon-close');
		cbutton.data('chapter',chap_i.data('chapter'));
		cbutton.data('data-item',text.attr('data-item'));
		cbutton.data('data-items',text.attr('data-items'));

		cbutton.bind('click',function(e) {
			var chl = jQuery(this).data('chapter');
			var activeI = jQuery(this).data('data-item');
			var activeC = jQuery(this).data('data-items');
			jQuery('#article-flip').fsbb('bb_activate',{
				chapter : chl,
				bb_after : function() {
					jQuery('#chapter'+ch+'-item .timeline-item').sewoltm('activeElement',activeI);
					jQuery('#chapter'+ch+'-item .timeline-item').sewoltm('hoverContentTitle',activeI,activeC);
					jQuery('#chapter'+ch+'-item .timeline-item').sewoltm('showContent',activeI,activeC,'opacity');
				}
			});
			fsbbc.css({
				'left' : l + 'px',
				'top' : t + 'px',
				'width' : cw + 'px',
				'height' : ch + 'px'
			});
			if(useWebkit) {
				fsbbc.bind(transitionEnd,function(e) {
					jQuery('.fsbb-org-title').remove();
				});
			} else {
				jQuery('.fsbb-org-title').remove();
			}
		});
	}
	
	jQuery('#article-flip').fsbb({
		title: '#headline_title',
		background: './images/background.jpg',
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
	/* site navi */
	jQuery('#site-footer #foot-logo').click(function(e) {
		jQuery('.fsbb-org-title').remove();
		jQuery('.chapter-item.hover').removeClass('hover');
		jQuery('.overlay').removeClass('overlay');
		jQuery('.quart').removeClass('quart');
		jQuery('#article-flip').fsbb('init',{});
		jQuery('.sewol-timeline').sewoltm('stop');
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

	jQuery(window).resize(function(e) {
		resizeWindow();
	});
	resizeWindow();
});
