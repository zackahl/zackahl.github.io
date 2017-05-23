/*jslint browser: true*/
/*global
$
*/

// Loader
$(window).on('load', function () {
    // Animate loader off screen
    $(".loader").fadeOut("slow");
});

// Load images when they are needed
$(function() {
    $("img.lazy").lazyload({
        effect : "fadeIn"
    });
});

$(document).ready(function () {
	'use strict';
	
	// Add toggle to mobile views
	if ($(window).width() <= 768) {
		$('.nav > .dropdown > a').addClass('dropdown-toggle');
		$('.nav > .dropdown > a').attr('data-toggle', 'dropdown');
		$('.nav > .dropdown > a').attr('aria-haspopup', 'true');
		$('.nav > .dropdown > a').attr('aria-expanded', 'false');
    }

	// Hide / Show navbar on scroll
    var lastScrollTop = 0;
    window.addEventListener("scroll", function() {  
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if($(window).width() > 767) {
            // Show on scroll up
            if (st > lastScrollTop) {
				$('.navbar').removeClass("aos-animate");
				$('.navbar[data-aos]').data("fade-down");
				$('.navbar').css("opacity","0");
            // Hide on scroll down
            } else {
				$('.navbar').addClass("aos-animate");
				$('.navbar[data-aos]').data("fade-up");
				$('.navbar').css("opacity","1");
            }
        }
        lastScrollTop = st;
    }, false);
    // Hide collapsed navbar on mobile
    $('.nav>li>a').on('click', function() {
        $(".navbar-collapse").removeClass("in");
		$("#menu").removeClass("active");
    });
	
	// Add active class to menu icon on mobile
	$('#menu').on('click', function() {
        $(this).toggleClass('active');
    });

	// Smooth scroll to anchor on click
	$('body .ss').on('click', function(event) {
            event.preventDefault();
            $('body').animate({scrollTop:$(this.hash).offset().top}, 500);
	});
	
	// Navbar dropdown transition
	$('.navbar .dropdown').hover(function() {
		$(this).find('.dropdown-menu').slideDown("fast");
	}, function() {
		$(this).find('.dropdown-menu').slideUp("fast");
	});

	// Rating bar animation
	$('#html').hover(function(){$('#html-rating').css('width','90%');},function(){$('#html-rating').css('width','0%');});
	$('#css').hover(function(){$('#css-rating').css('width','90%');},function(){$('#css-rating').css('width','0%');});
	$('#javascript').hover(function(){$('#javascript-rating').css('width','80%');},function(){$('#javascript-rating').css('width','0%');});
	$('#jquery').hover(function(){$('#jquery-rating').css('width','80%');},function(){$('#jquery-rating').css('width','0%');});
	$('#sass').hover(function(){$('#sass-rating').css('width','70%');},function(){$('#sass-rating').css('width','0%');});
    $('#browsers').hover(function(){$('#browsers-rating').css('width','80%');},function(){$('#browsers-rating').css('width','0%');});
	$('#responsive').hover(function(){$('#responsive-rating').css('width','90%');},function(){$('#responsive-rating').css('width','0%');});
    $('#brackets').hover(function(){$('#brackets-rating').css('width','90%');},function(){$('#brackets-rating').css('width','0%');});
    $('#bootstrap').hover(function(){$('#bootstrap-rating').css('width','90%');},function(){$('#bootstrap-rating').css('width','0%');});
    $('#photoshop').hover(function(){$('#photoshop-rating').css('width','80%');},function(){$('#photoshop-rating').css('width','0%');});
    $('#illustrator').hover(function(){$('#illustrator-rating').css('width','60%');},function(){$('#illustrator-rating').css('width','0%');});
	$('#affinity').hover(function(){$('#affinity-rating').css('width','80%');},function(){$('#affinity-rating').css('width','0%');});

	// Add active class to dropdown and collapse siblings
    $('.panel-heading').on('click', function() {
		var group = $(this).closest(".panel-group");
		group.find(".panel-heading").removeClass("active");
		group.find(".panel-collapse").removeClass("in");
		$(this).addClass('active');
    });
    $('.year').on('click', function() {
        $(this).toggleClass('active');
    });

	// Tooltip
	$('[data-toggle="tooltip"]').tooltip();   
});