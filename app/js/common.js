$(function() {

	$('#my-menu').mmenu({
		extensions: ['widescreen', 'theme-black', 'effect-menu-slide', 'pagedim-black'],
		navbar: {
			title: '<img src="/img/@1x/logo.svg">'
		},
		offCanvas: {
			position: 'right'
		}

	});

	var api = $('#my-menu').data('mmenu');
	api.bind('opened', function(){
		$('.hamburger').addClass('is-active');
	}).bind('closed', function(){
		$('.hamburger').removeClass('is-active');
	});

	//CAROUSEL

	$('.carousel-services').on('initialized.owl.carousel', function() {
		setTimeout(function() {
			carouselService()
		}, 100);
		
	});

	$('.carousel-services').owlCarousel({
		loop: true,
		nav: true,
		smartSpeed: 700,
		navText: ['<i class="fa fa-angle-double-left"></i>', '<i class="fa fa-angle-double-right"></i>'],
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			800: {
				items: 2
			},
			1100: {
				items: 3
			}
		}
	});


	function carouselService() {
		$('.carousel-services-item').each(function(){
			var ths = $(this),
			thsHeight = ths.find('.carousel-services-content').outerHeight();

			ths.find('.carousel-services-image').css('min-height', thsHeight);
		});
	} carouselService();

	$('.carousel-services-composition .h3').each(function(){
		var ths = $(this);
		ths.html(ths.html().replace(/(\S+)\s*$/, '<span>$1</span>'));
	});


	//equalHeights. Выравнивание боксов по высоте при их неравности
	function onResize() {
		$('.carousel-services-content').equalHeights();
	}onResize();
	// window.onresize = function() {onResize()};


	$('section h2').each(function() {
		var ths = $(this);
		// 	//регулярное выражение выделяет только первое слово из строки и возвращает его, оборачивая в данном случае в спан
		ths.html(ths.html().replace(/^(\S+)/, '<span>$1</span>'));
	});

	// selectize
	$('select').selectize({
		create: true,

	});

	//E-mail Ajax Send
	$("form.callback").submit(function() { //Change
		var th = $(this);
		$.ajax({
			type: "POST",
			url: "mail.php", //Change
			data: th.serialize()
		}).done(function() {
			$(th).find('.success').addClass('active').css('display', 'flex').hide().fadeIn();
			// alert("Thank you!");
			setTimeout(function() {
				$(th).find('.success').removeClass('active').fadeOut();
				// Done Functions
				th.trigger("reset");
			}, 3000);
		});
		return false;
	});

	//CAROUSEL REVIEWS

	// $('.reviews').on('initialized.owl.carousel', function() {
	// 	setTimeout(function() {
	// 		carouselService()
	// 	}, 100);
		
	// });

	$('.reviews').owlCarousel({
		loop: true,
		items: 1,
		nav: false,
		smartSpeed: 700,
		// autoHeight: true
	});

	// $('.partners').on('initialized.owl.carousel', function() {
	// 	setTimeout(function() {
	// 		carouselService()
	// 	}, 100);
		
	// });

	$('.partners').owlCarousel({
		loop: true,
		items: 4,
		nav: true,
		smartSpeed: 700,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsiveClass: true,
		responsive: {
			0: {
				items: 1
			},
			768: {
				items: 2
			},
			992: {
				items: 3
			},
			1200: {
				items: 4
			}
		}
	});


	// функция прокрутки
	$(window).scroll(function(){
		if ($(this).scrollTop() > $(this).height()) {
			$('.top').addClass('active');
		} else {
			$('.top').removeClass('active');
		}
	});

	$('.top').click(function(){
		$('html, body').stop().animate({scrollTop:0}, 'slow', 'swing');
	});


	//
	$(window).on('load', function(){

		$('.preloader').delay(1000).fadeOut('slow');

	});


});

