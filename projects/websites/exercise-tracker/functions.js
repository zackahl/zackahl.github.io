/*jslint browser: true*/
/*global $, google, moment*/

// Loader
$(window).on('load', function () {
    // Animate loader off screen
    $(".loader").fadeOut("slow");
});

// Load the google maps API
var x = document.createElement('script');
x.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDMpPOmKlPN9xoweLbzA5e4WbDK-KDE6yM&callback=initMap';
document.getElementsByTagName("head")[0].appendChild(x);

// Create objects for the google map, creat global variables
var MAP = {
    mapCanvas: $("#map").get(0), // == $document.getElementById('map')
    mapOptions: {}
};
var marker;
var markers = [];
var draw = false;
var polyLine;
var polyPath;
var previousDistance = [];
var meters = 0;
var kilometers = 0;
var miles = 0;
var closedRoute = false;
var normalStyle = [{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]}];
var lightStyle = [{"elementType":"geometry","stylers":[{"color":"#f5f5f5"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#f5f5f5"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"road","elementType":"geometry","stylers":[{"color":"#ffffff"}]},{"featureType":"road.arterial","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#dadada"}]},{"featureType":"road.highway","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"transit.line","elementType":"geometry","stylers":[{"color":"#e5e5e5"}]},{"featureType":"transit.station","elementType":"geometry","stylers":[{"color":"#eeeeee"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#c9c9c9"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]}];
var darkStyle = [{"elementType":"geometry","stylers":[{"color":"#212121"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#212121"}]},{"featureType":"administrative","elementType":"geometry","stylers":[{"color":"#757575"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"color":"#9e9e9e"}]},{"featureType":"administrative.land_parcel","stylers":[{"visibility":"off"}]},{"featureType":"administrative.locality","elementType":"labels.text.fill","stylers":[{"color":"#bdbdbd"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"poi.park","elementType":"geometry","stylers":[{"color":"#181818"}]},{"featureType":"poi.park","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"poi.park","elementType":"labels.text.stroke","stylers":[{"color":"#1b1b1b"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"color":"#2c2c2c"}]},{"featureType":"road","elementType":"labels.text.fill","stylers":[{"color":"#8a8a8a"}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#373737"}]},{"featureType":"road.highway","elementType":"geometry","stylers":[{"color":"#3c3c3c"}]},{"featureType":"road.highway.controlled_access","elementType":"geometry","stylers":[{"color":"#4e4e4e"}]},{"featureType":"road.local","elementType":"labels.text.fill","stylers":[{"color":"#616161"}]},{"featureType":"transit","elementType":"labels.text.fill","stylers":[{"color":"#757575"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"}]},{"featureType":"water","elementType":"labels.text.fill","stylers":[{"color":"#3d3d3d"}]},{"featureType":"poi","stylers":[{"visibility":"off"}]},{"featureType":"transit","stylers":[{"visibility":"off"}]}];

// Initialise the map -------------------------------------------------------------------
function initMap() {
    'use strict';
    MAP.mapOptions = {
        draggableCursor: 'crosshair',
        scaleControl: true,
        zoom: 2,
        minZoom: 2,
        maxZoom: 16,
        center: new google.maps.LatLng(-24.345, 134.46), // Australia
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        },
        streetViewControl: false,
        rotateControl: true,
        fullscreenControl: false,
        zoomControl: true,
        zoomControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
        disableDoubleClickZoom: true,
        clickableIcons: false
    };
    // Create google map
    var map = new google.maps.Map(MAP.mapCanvas, MAP.mapOptions);
    map.set('styles', normalStyle);
    
    // HTML5 zoom in on user's location -------------------------------------------------
    /*if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setZoom(12);
            map.setCenter(pos);
        });
    } 
    else {
        alert("Could not find location.");
    }*/

    // Find location based on user input using geolocater -------------------------------
    function geocodeAddress(geocoder, resultsMap) {
        var address = $('#address').val();
        var delay = 3000;
        geocoder.geocode({'address': address}, function(results, status) {
            // Successful search
            if (status === 'OK') {
                // Center and zoom in on location 
                resultsMap.setCenter(results[0].geometry.location);
                var position = results[0].geometry.location;
                map.setZoom(12);
                map.panTo(position);
                // Colour green if valid
                $("#address").css("background-color", "#a3ffca");
                setTimeout(function() {
                    $("#address").css("background-color", "#FFFFFF");   
                }, delay);
                // Update current location
                $("#currentLocation").text(results[0].formatted_address);
                document.getElementById("address").value = results[0].formatted_address;
            } 
            // Empty or no results display error messsage
            else if(status === "ZERO_RESULTS") {
                if(address === "") {
                    status = "No address entered.";    
                }
                else {
                    status = "No results found.";   
                }
                document.getElementById("address").value = status;
                // Colour red if invalid
                $("#address").css("background-color", "#f79797");
                setTimeout(function() {
                    $("#address").css("background-color", "#FFFFFF");
                    document.getElementById("address").value = address; 
                }, delay);
            }
        });
    }
    // Find location on click
    var geocoder = new google.maps.Geocoder();
    $('#findLocation').bind('click', function() {
        geocodeAddress(geocoder, map);
    });
    // Find location on enter key press
    $('#address').on('keyup', function (e) {
        if (e.keyCode == 13) {
            geocodeAddress(geocoder, map);
        }
    });
    
    // Clear route ----------------------------------------------------------------------
    var clear = function() {
        // Remove all polylines and markers
        polyLine.setMap(null);
        var l = markers.length;
        for (var i = 0; i < l; i++ ) {
            markers.pop().setMap(null);
        }
        markers.length = 0;
        // Reset distance
        kilometers = 0;
        miles = 0;
        $('#distance').html(kilometers.toFixed(2) + ' km | ' + miles.toFixed(2) + ' miles');
        // Reset speed
        $("#speed").html("0.00 kph | 0.00 mph");
        // Reset duration
        $('#duration').val("");
        // Reset energy 
        $('#energy').text("0 Cal | 0 kJ");
        // Clear all event listeners on map
        google.maps.event.clearListeners(map);
        // Reset event listeners
        drawRoute();
    };
    
    // Undo last point ------------------------------------------------------------------
    var undo = function() {
        // If path empty clear all
        if(markers.length === 1 || markers.length === 0) {
            clear();
        } 
        else {
            // Remove last marker
            markers[markers.length-1].setMap(null);
            markers.length -= 1;
            // Remove last polyline
            polyPath.removeAt((polyPath.length-1));
            // Revert to previous distance
            kilometers = previousDistance[previousDistance.length-2];
            previousDistance.length -= 1;
            miles = (kilometers / 1.60934).toFixed(2);
            $('#distance').html(kilometers + ' km | ' + miles + ' miles');
            // Revert to previous speed
            getSpeed();
            // Reset energy 
            $('#energy').text("0 Cal | 0 kJ");
        }
    };
    
    // Start the route ------------------------------------------------------------------
    var start = function() {
        if(markers.length !== 0) {
            clear();
        }
        draw = true;
        document.getElementById("start").disabled = true;
        document.getElementById("stop").disabled = false;
        drawRoute();
    };
        
    // End the route --------------------------------------------------------------------
    var stop = function() {
        draw = false;
        document.getElementById("stop").disabled = true;
        document.getElementById("start").disabled = false;
        // Clear all event listeners
        google.maps.event.clearListeners(map);
    };
    
    // Bind functions to controls -------------------------------------------------------
    $("#clear").bind('click', function() {
        clear();
    });
    $("#undo").bind('click', function() {
        undo();
    });
    $("#start").bind('click', function() {
        start();
    });
    $("#stop").bind('click', function() {
        stop();
    });
    
    // Style buttons --------------------------------------------------------------------
    $("#normalStyle").bind('click', function() {
        map.set('styles', normalStyle);
        polyLine.setOptions({strokeColor:'#4A4A4A'});
    });
    $("#lightStyle").bind('click', function() {
        map.set('styles', lightStyle);
        polyLine.setOptions({strokeColor:'#4A4A4A'});
    });
    $("#darkStyle").bind('click', function() {
        map.set('styles', darkStyle);
        polyLine.setOptions({strokeColor:'#FFFFFF'});
    });
     
    // Draw the route -------------------------------------------------------------------
    function drawRoute() {
        // If drawing is enabled (start button clicked)
        if(draw === true) {
            // Place new marker on click
            var placeMarker = function(location) {
                    marker = new google.maps.Marker({
                    position: location, 
                    map: map,
                    draggable: false,
                    icon: 'http://maps.gstatic.com/mapfiles/ms2/micons/lightblue.png',
                    clickable: false,
                    title: ""
                });
                // Add to markers array
                markers.push(marker);
                // Modify origin marker
                markers[0].icon = 'http://maps.gstatic.com/mapfiles/ms2/micons/green.png';
                markers[0].clickable = true;
                markers[0].title = "Close route";
                // If route is closed change marker to red
                if(closedRoute === true) {
                    markers[markers.length-1].icon = 'http://maps.gstatic.com/mapfiles/ms2/micons/red.png';
                    closedRoute = false;
                }
            };
            google.maps.event.addListener(map, 'click', function(event) {
                placeMarker(event.latLng);
            });

            // Create new polyline
            polyLine = new google.maps.Polyline({
                map: map,
                path: [],
                geodesic: true,
                strokeColor: '#4A4A4A',
                strokeOpacity: 1.0,
                strokeWeight: 2,
                clickable: false,
                icons: [{
                    icon: {path: google.maps.SymbolPath.FORWARD_OPEN_ARROW},
                    offset: '100px',
                    repeat: '100px'
                }]
            });
                        
            // Calculate and update distance of path
            var getDistance = function() {
                meters = google.maps.geometry.spherical.computeLength(polyLine.getPath());
                kilometers = (meters / 1000).toFixed(2);
                miles = (kilometers / 1.60934).toFixed(2);
                previousDistance.push(kilometers);
                $('#distance').html(kilometers + ' km | ' + miles + ' miles');
            };

            // Update path and stats on map click
            google.maps.event.addListener(map, 'click', function(evt) {
                // Get existing path
                polyPath = polyLine.getPath();
                // Add new point (use the position from the click event)
                polyPath.push(new google.maps.LatLng(evt.latLng.lat(), evt.latLng.lng()));
                // Update the polyline with the new path
                polyLine.setPath(polyPath);
                getDistance();
                
                // Close path when origin marker is clicked
                marker.addListener('click', function() {
                    polyPath.push(new google.maps.LatLng(markers[0].getPosition().lat(), 
                                                         markers[0].getPosition().lng()));
                    closedRoute = true;
                    placeMarker(evt.latLng);
                    getDistance();
                });
            });   
        }
    }
    
    // Convert duration time to seconds -------------------------------------------------
    function timeToSeconds(time) {
        time = time.split(/:/);
        var hours = time[0] * 3600;
        var minutes = time[1] * 60;
        var seconds = time[2];
        time = hours + minutes + seconds * 1;
        return time;
    }
    
    // Calculate and display the speed --------------------------------------------------
    function getSpeed() {
        // Get kmph and mph
        var kmph = kilometers / ((timeToSeconds($('#duration').val())) / 3600);
        var mph = miles / ((timeToSeconds($('#duration').val())) / 3600);
        // Display speed
        $("#speed").html(kmph.toFixed(2) + " kph | " + mph.toFixed(2) + " mph");
        // If empty
        if($('#duration').val().length === 0) {
            $("#speed").html("0.00 kph | 0.00 mph");   
        }
        else if(isNaN(kmph) || isNaN(mph)) {
            $("#speed").html("Incorrect time input."); 
        }
    }
    // Get speed on click
    $('#getSpeed').bind('click', function() {
        getSpeed();
    });
    // Get speed on enter key press
    $('#duration').on('keyup', function (f) {
        if (f.keyCode == 13) {
            getSpeed();
        }
    });
       
    // Duration input validation --------------------------------------------------------
    document.getElementById("duration").addEventListener('keyup', function() {
        // If correct time format colour green
        if($('#duration').val().match(/([0-9]?[0-9]):([0-5][0-9]):([0-5][0-9])/)) {
            $("#duration").css("background-color", "#a3ffca");
            var delay = 3000;
            setTimeout(function() {
                $("#duration").css("background-color", "#FFFFFF");   
            }, delay);
        }
        // Else colour red
        else {
            $("#duration").css("background-color", "#f79797");
        }
        // If field is empty
        if($('#duration').val().length === 0) {
            $("#duration").css("background-color", "#FFFFFF"); 
        }
    });
    
    // Energy calculator ---------------------------------------------------------------
    var exerciseType = "";
    var cal = 0;
    var kJ = 0;
    $("#walk").bind('click', function() {
        exerciseType = "walk";
        kJ = kilometers * 190;
        cal = kJ * 0.239006;
        $('#energy').text(Math.ceil(cal) + " Cal | " + Math.ceil(kJ) + " kJ");
    });
    $("#run").bind('click', function() {
        exerciseType = "run";
        kJ = kilometers * 272;
        cal = kJ * 0.239006;
        $('#energy').text(Math.ceil(cal) + " Cal | " + Math.ceil(kJ) + " kJ");
    });
    $("#cycle").bind('click', function() {
        exerciseType = "cycle";
        kJ = kilometers * 110;
        cal = kJ * 0.239006;
        $('#energy').text(Math.ceil(cal) + " Cal | " + Math.ceil(kJ) + " kJ");
    });
    
    // Date and clock -------------------------------------------------------------------
    function update() {
        $('#date').html(moment().format('DD/MM/YYYY'));
        $('#clock').html(moment().format('h:mm:ss a'));  
    }
    setInterval(update, 1000); 
}