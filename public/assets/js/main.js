(function(window) {

	'use strict';

	$.exists = function (selector) {
		return ($(selector).length > 0);
	}
	
    window.onpageshow = function(event) {
		if (event.persisted) {
		  window.location.reload();
		}
    };
	
	// All Funtions
	PageTransition();
	ParallaxHero();
	SmoothScroll();
	Testimonials();
	WorkSlider();
	Masonry();
	Gallery();
	StickyMenu();
	ShareBtn();
	NavMenu();
	BackToTop();
	ValidForm();

})(window);

	/*------------------
	Page Transition
	-------------------*/
		function PageTransition() {
			
			setTimeout(function() {
				$('.ms-preloader').addClass('is-hidden');
				show_items();
			}, 300);
			setTimeout(function() {
				$('.ms-hero__title').addClass('is-visible');
			}, 1400);

			$('body').on('click', '[data-type="page-transition"]', function(event){
				event.preventDefault();
		        var url = $(this).attr('href');
		        if (url != '#' && url != '') {
		            setTimeout(function() {
		                $('body').addClass('page-leave');
		            }, 100);
		            setTimeout(function() {
		                window.location.href = url;
		            }, 1000);
		        }
			});

			function show_items() {
				var relativeOffset = anime.timeline();
				relativeOffset
					.add({
				  		targets: '.ms-nav-item, .ms-logo, .nav__btn',
						opacity: [0, 1],
						duration: 800,
						easing: 'easeInOutQuad',
						offset: 800						
					})
					.add({
				  		targets: '.ms-hero__title-poster, .down-btns, .ms-hero__image .box-overlay, .ms-hero__links',
						easing: 'easeInOutQuad',
						opacity: [0, 1],
						duration: 400,
						offset: 800,
					})
					.add({
				  		targets: '.ms-section__block:not(.section__content), .ms-footer, .filtr-btn li',
						easing: 'easeInOutCubic',
						opacity: [0, 1],
						duration: 400,
						offset: 1400,
					})
					.add({
				  		targets: '.anime-item',
						easing: 'easeInOutQuad',
						scale: 1,
						rotateX: [25, 1],
						rotateY: [45, 1],
						opacity: [0, 1],
						translateY: [150, 0],
						duration: 400,
						offset: 1400,
					  	delay: function(el, i, l) {	return i * 80;	},
					})
					.add({
				  		targets: '.box-img',
						easing: 'easeInOutQuad',
						opacity: 1,
						duration: 400,
						offset: 2000,
						delay: function(el, i, l) {	return i * 80;	},
						 complete: function(anim) {
						 	$('.box-overlay, .article-content .box-inner, .article-date').css('opacity', '1');
						 }
					})
					.add({
				  		targets: '.box',
						easing: 'easeInOutQuad',
						backgroundColor: '#fff',
						duration: 400,
						offset: 2100,
						delay: function(el, i, l) {	return i * 80;	}
					})
			}
		}

	/*------------------
	Parallax Hero
	-------------------*/
		function ParallaxHero() {

			//Hero simple text
			$(window).scroll(function(){
			var wScroll = $(this).scrollTop();
			var opacity = 1 - (wScroll / 20) / 20;
		  	$('.ms-hero__caption').css({
		              '-webkit-transform' : 'translate(0px, '+ wScroll / 2.5 + 'px)',
		              '-moz-transform'    : 'translate(0px, '+ wScroll / 2.5 + 'px)',
		              '-ms-transform'     : 'translate(0px, '+ wScroll / 2.5 + 'px)',
		              '-o-transform'      : 'translate(0px, '+ wScroll / 2.5 + 'px)',
		              'transform'         : 'translate(0px, '+ wScroll / 2.5 + 'px)',
		              'opacity'           : opacity
		          });
			});

			//Hero with image box
			if ($.exists('.ms-hero.ms-hero__poster')) {
				$('html,body').animate({ scrollTop: 0 }, 0);
				// add listener to disable scroll when page loaded
				$(window).disablescroll();
				$(window).bind('mousewheel', function(e) {
				    if (e.originalEvent.wheelDelta >= 0) {
				    	//empty
				    } else { 
				    	remove_freeze_cover();
				    	$('.section__content').addClass('is-visible');				    	
				    }
				});
				function add_freeze_cover() {
					$('.ms-hero.ms-hero__poster').removeClass('cover-closed');
					// add listener to disable scroll
					$(window).disablescroll();
				}
				function remove_freeze_cover() {
					setTimeout(function() {
						// Remove listener to disable scroll
						$(window).disablescroll('undo');	
					}, 1000);
					setTimeout(function() {
						$('.ms-hero.ms-hero__poster').addClass('cover-closed');
					}, 50);
				}
				// Trigger to click
				$('.down-btns').on('click', function(){
					setTimeout(function() {
						if ($.exists('.cover-closed')) {
							$('.section__content').removeClass('is-visible');
							$('html,body').animate({ scrollTop: 0 }, 300);
							setTimeout(function() {
								add_freeze_cover();
							}, 300);
						} else { 
							remove_freeze_cover();
							$('.section__content').addClass('is-visible');
						}
					}, 0);
				});
			}

		}

	/*------------------
	Smooth Scroll
	-------------------*/
		function SmoothScroll() {

			var isChromium = window.chrome;
			if(isChromium){
				$('html').easeScroll({ 
					stepSize: 120,
					animationTime: 1000,
					pulseScale: 12,
				}); 
			}

		}

	/*------------------
	Testimonials
	-------------------*/
		function Testimonials() {

			var mySwiper = new Swiper ('.ms-testimonials__list', {
				loop: true,
				autoHeight: true,
				slidesPerView: 1,
				spaceBetween: 50,
				centeredSlides: true,
				pagination: {
					el: '.slider-pagination',
					type: 'fraction',
				},
				navigation: {
					nextEl: '.slider-next',
					prevEl: '.slider-prev',
				},
			})

		}

	/*------------------
	Work Slider
	-------------------*/
		function WorkSlider() {

			var mySwiper = new Swiper ('.ms-work-slider', {
 			slidesPerView: 'auto',
				spaceBetween: 90,
				pagination: {
					el: '.slider-pagination',
					type: 'fraction',
				},
				navigation: {
					nextEl: '.slider-next',
					prevEl: '.slider-prev',
				},
				breakpoints: {
					1024: {
						spaceBetween: 50,
					},
				768: {
						spaceBetween: 30,
					},
				640: {
					spaceBetween: 20,
					},
				320: {
					spaceBetween: 10,
					}
				}
			})
		}

	/*------------------
	Masonry
	-------------------*/
		function Masonry() {

	        if ($.exists('.ms-grid')) {
	            var $grid = jQuery('.ms-grid');
	            $grid.imagesLoaded( function() {
	                $grid.isotope({
	                    itemSelector: '.grid-item',
	                    percentPosition: true,
                      	masonry: {
					    columnWidth: '.grid-sizer'
					  }
	                });   
	            });
	            $('.filtr-btn').on( 'click', 'li', function() {
					var filterValue = $(this).attr('data-filter');
					$grid.isotope({ filter: filterValue });
					$('.filtr-btn li').removeClass('active');
					$(this).addClass('active');
				});
	        }

		}

	/*------------------
	Gallery
	-------------------*/
		function Gallery() {

			if ($.exists('.ms-gallery')) {

	            var $grid = jQuery('.ms-gallery');
	            $grid.imagesLoaded( function() {
	                $grid.isotope({
	                    itemSelector: '.gallery-item',
	                    percentPosition: true,
                      	masonry: {
					    columnWidth: '.grid-sizer'
					  }
	                });   
	            });

				$('.grid-item__img').magnificPopup({
				  	type: 'image',
					mainClass: 'mfp-with-zoom',	
					gallery: {
					  enabled:true
					},		
					zoom: {
						enabled: true, 			
						duration: 300, 
						easing: 'ease-in-out', 
						opener: function(openerElement) {
							return openerElement.is('img') ? openerElement : openerElement.find('img');
						}
					}	
					
				}).magnificPopup('open').magnificPopup('close');
			}

		}

	/*------------------
	Sticky menu
	-------------------*/
		function StickyMenu() {

	        if ($.exists('#sticker')) {
	        	$("#sticker").sticky({topSpacing:0});
	        }

		}

	/*------------------
	Share button
	-------------------*/
		function ShareBtn() {

	        if ($.exists('.social-share')) {				    
				$('.hide .social-share__list').css('visibility', 'hidden');
	        	$('.share-btn').on('click', function() {
	        		$('.social-share').toggleClass('show').toggleClass('hide');
	        		$('.show .social-share__list').css('visibility', 'visible');
				if ($.exists('.show')) {
	        		var share_anim = anime({
				  		targets: '.social-share__list li',
						easing: 'easeInOutQuad',
						opacity: [0, 1],
						rotateX: [25, 1],
						rotateY: [45, 1],
						duration: 300,
						delay: function(el, i, l) { return i * 80; },
				    });
				    $('.share-btn span').css({
				    	'opacity'    : '0',
				    	'visibility' : 'hidden'
				    });
				} 
				if ($.exists('.hide')) {					
	        		var share_anim = anime({
				  		targets: '.social-share__list li',
						easing: 'easeInOutQuad',
						opacity: [1, 0],
						rotateX: [1, 25],
						rotateY: [1, 45],
						duration: 300,
						delay: function(el, i, l) { return i * 80; },
						complete: function(share_anim) {
							$('.hide .social-share__list').css('visibility', 'hidden');
							$('.share-btn span').css({
								'opacity'    : '1',
								'visibility' : 'visible'
							});
						}
						
				    });
				}

	        	});
	        }

		}

	/*------------------
	Navigation Menu
	-------------------*/
		function NavMenu() {

			if ($.exists('.nav__btn')) {
				$('.nav__btn').on('click', function(){
					$(this).toggleClass('nav-is-open');
					$('.ms-navbar').toggleClass('is-visible');
					$('body').toggleClass('disable-scroll');
				});
				$('.ms-nav-item').on('click', function(){
					$(this).children('ul.ms-submenu').toggleClass('open');
				});
			}

		}

	/*------------------
	Back To Top
	-------------------*/
	    function BackToTop() {

			if ($.exists('.back-top')) {
				if ($('.back-top').length) {
				    var scrollTrigger = 1000, // px
				        backToTop = function () {
				            var scrollTop = $(window).scrollTop();
				            if (scrollTop > scrollTrigger) {
				                $('.back-top').addClass('back-top-is-visible');
				            } else {
				                $('.back-top').removeClass('back-top-is-visible');
				            }
				        };
				    backToTop();
				    $(window).on('scroll', function () {
				        backToTop();
				    });
				    $('.back-top').on('click', function (e) {
				        e.preventDefault();
						setTimeout(function() {
					        $('html,body').animate({
					            scrollTop: 0
					        }, 700);	
						}, 100);
				    });
				}
			}

	    }

	/*------------------
	Validate form
	-------------------*/
		function ValidForm() {

			if ($.exists('.form-control')) {
		        $('.form-control').focus(function() {
		          $(this).prev('.control-label').addClass('active');
		        });
		        $('.form-control').focusout(function() {
		          $(this).prev('.control-label').removeClass('active');
		        });
		        $("#validForm").validate({
		            ignore: ":hidden",
		            rules:{
		                name:{
		                    required: true,
		                    minlength: 2,
		                    maxlength: 16,
		                },
		                    email:{
		                    required: true,
		                    email: true,
		                },
		                subject:{
		                    required: true,
		                    minlength: 4,
		                    maxlength: 32,
		                },
		                    message:{
		                    required: true,
		                    minlength: 16,
		                },
		            },
		            messages:{
		                name:{
		                    required: "<span>Please enter your name</span>",
		                    minlength: "<span>Your name must consist of at least 2 characters</span>",
		                    maxlength: "<span>The maximum number of characters - 24</span>",
		                },
		                email:{
		                    required: "<span>Please enter your email</span>",
		                    email: "<span>Please enter a valid email address.</span>",
		                },
		                subject:{
		                    required: "<span>Please enter your subject</span>",
		                    minlength: "<span>Your name must consist of at least 2 characters</span>",
		                    maxlength: "<span>The maximum number of characters - 16</span>",
		                },
		                message:{
		                    required: "<span>Please write me message</span>",
		                    minlength: "<span>Your message must consist of at least 16 characters</span>",
		                    maxlength: "<span>The maximum number of characters - 100 </span>",
		                },
		            },
		            submitHandler: function (form) {
		            $.ajax({
		                type: "POST",
		                url: "contact.php",
		                data: $(form).serialize(),
		                beforeSend: function() {
		                    $('.ms-btn').addClass('sanding').attr("disabled", true);
		                    $('.ms-btn input').val('Sending');
		                },
		                success: function (data) {
		                    if (data == "Email sent!");
		                    $('input, textarea').val('');
	                     	$('.form-group').blur();
	                        $('.ms-btn input').val('Contact Us');
	                        $('.ms-btn').removeClass('sanding').attr("disabled", false);
		                }
		            });
		            return false;
		            }
		        });
			}
		}