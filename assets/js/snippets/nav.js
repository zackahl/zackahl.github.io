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

document.write('<nav class="navbar navbar-fixed-top animated slideInDown">'
                +  '<div class="navbar-header">'
                +  '<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">'
                +  '<span class="sr-only">Toggle navigation</span>'
                +  '<span class="icon-bar"></span>'
                +  '<span class="icon-bar"></span>'
                +  '<span class="icon-bar"></span>'
                +  '</button>'
                +  '<a href="" onclick="location.reload();$(window).scrollTop(0);"><span id="nav-logo" class="glyphicon glyphicon-home"/></a>'
                +  '</div>'
                +  '<div class="collapse navbar-collapse animated fadeIn" id="navbar-collapse-1">'
                +  '<ul class="nav navbar-nav">'
                +  '<li class="dropdown">'
                +  '<a id="nav-about-me" href="#about-me" role="button">ABOUT ME</a>'
                +  '</li>'
                +  '<li class="dropdown">'
                +  '<a id="nav-skills" href="#skills" role="button">SKILLS</a>'
                +  '</li>'
                +  '<li class="dropdown">'
                +  '<a id="nav-projects" href="#projects" role="button">PROJECTS</a>'
                +  '<ul class="dropdown-menu animated fadeIn">'
                +  '<li><a href="#websites">WEBSITES</a></li>'
                +  '<li><a href="#apps">APPS</a></li>'
                +  '<li><a href="#graphics">GRAPHICS</a></li>'
                +  '</ul>'
                +  '</li>'
                +  '<li class="dropdown">'
                +  '<a id="nav-contact" href="#contact" role="button">CONTACT</a>'
                +  '</li>'
                +  '</ul>'
                +  '</div>'
                +  '<a href="#page-top" title="Scroll to Top"><span id="scroll" class="glyphicon glyphicon-circle-arrow-up"/></a>'
                +  '<!-- /.navbar-collapse -->'
                +  '<!-- /.container-fluid -->'
                +  '</nav>');