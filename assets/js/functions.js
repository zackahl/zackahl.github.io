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

// Add toggle to mobile views
$(document).ready(function () {
	'use strict';
	if ($(window).width() <= 768) {
		$('.nav > .dropdown > a').addClass('dropdown-toggle');
		$('.nav > .dropdown > a').attr('data-toggle', 'dropdown');
		$('.nav > .dropdown > a').attr('aria-haspopup', 'true');
		$('.nav > .dropdown > a').attr('aria-expanded', 'false');
    }
});

// Hide / Show navbar on scroll
$(document).ready(function () {
    var lastScrollTop = 0;
    window.addEventListener("scroll", function() {  
        var st = window.pageYOffset || document.documentElement.scrollTop;
        if($(window).width() > 767) {
            // Show on scroll up
            if (st > lastScrollTop) {
                $(".collapse").addClass("fadeOut");
                $(".dropdown-menu").removeClass("fadeIn");
                $(".navbar").removeClass("slideInDown");
                $(".navbar").addClass("slideOutUp");
                $(".navbar").css({"background":"transparent","border-bottom":"0px"});
            // Hide on scroll down
            } else {
                $(".collapse").removeClass("fadeOut");
                $(".collapse").addClass("fadeIn");
                $(".navbar").removeClass("slideOutUp");
                $(".navbar").addClass("slideInDown");
                $(".navbar").css({"background":"black","border-bottom":"4px solid white"});
            }
            // Remove style at page top
            if(st < 100) {
                $(".navbar").css({"background":"transparent","border-bottom":"0px solid transparent"});
            }
        }
        lastScrollTop = st;
    }, false);
    // Hide collapsed navbar on mobile
    $('.nav>li>a').on('click', function() {
        $(".navbar-collapse").removeClass("in");
    });
});

// Smooth scroll to anchor
$(document).ready(function () {
	$('body a').on('click', function(event) {
        // If anchor is not external
        if (!$(this).hasClass("external")) {
            event.preventDefault();
            $('body').animate({scrollTop:$(this.hash).offset().top}, 500);
        }
	});
});

// Fade in feature items
$(document).ready(function() {
    if($(window).width() > 767) {
        // Every time the window is scrolled
        $(window).scroll( function() {
            // Check the location of each desired element
            $('.info-group').each( function() {
                var bottom_of_object = $(this).offset().top + ($(this).outerHeight()/1.5);
                var bottom_of_window = $(window).scrollTop() + $(window).height();
                // If the object is one third visible in the window, fade it it
                if( bottom_of_window > bottom_of_object ) {
                    $(this).animate({'opacity':'1'},500);
                }
            }); 
        });
    }
});

// Rating bar animation
$(document).ready(function() {
	$('#html').hover(function(){$('#html-rating').css('width','90%');},function(){$('#html-rating').css('width','0%');});
	$('#css').hover(function(){$('#css-rating').css('width','90%');},function(){$('#css-rating').css('width','0%');});
	$('#javascript').hover(function(){$('#javascript-rating').css('width','80%');},function(){$('#javascript-rating').css('width','0%');});
	$('#jquery').hover(function(){$('#jquery-rating').css('width','80%');},function(){$('#jquery-rating').css('width','0%');});
	$('#sass').hover(function(){$('#sass-rating').css('width','70%');},function(){$('#sass-rating').css('width','0%');});
    $('#browsers').hover(function(){$('#browsers-rating').css('width','80%');},function(){$('#browsers-rating').css('width','0%');});
	$('#responsive').hover(function(){$('#responsive-rating').css('width','100%');},function(){$('#responsive-rating').css('width','0%');});
    $('#brackets').hover(function(){$('#brackets-rating').css('width','100%');},function(){$('#brackets-rating').css('width','0%');});
    $('#bootstrap').hover(function(){$('#bootstrap-rating').css('width','90%');},function(){$('#bootstrap-rating').css('width','0%');});
    $('#photoshop').hover(function(){$('#photoshop-rating').css('width','80%');},function(){$('#photoshop-rating').css('width','0%');});
    $('#illustrator').hover(function(){$('#illustrator-rating').css('width','60%');},function(){$('#illustrator-rating').css('width','0%');});
});

// Add active class to dropdown
$(document).ready(function() {
    $('.panel-heading').on('click', function() {
        $(this).toggleClass('active');
    });
});
