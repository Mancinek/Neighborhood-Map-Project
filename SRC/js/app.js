/* jshint ignore:start */
"use strict";
/* jshint ignore:end */

// errror handling if map is not loaded
function googleMapError() {
    alert("Ups! An error occured! Map has not been loaded. Try again later.");
}

// initialization of new google map and call for markers creation (initMarkers())
function initMap() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 48.1848684,
            lng: 17.3100511
        },
        scrollwheel: true,
        zoom: 5

    });

    initMarkers(map);
}

/*initMarkers is a function that handles everything concerning markers:
- creating new marker for each city in cities array
- creating new infoWindow with Wikipedia content (opening and closing infoWindow)
- handling click event on each marker (boucing animation and opening/closing infoWindow)*/

/*Many thanks to thread: https://discussions.udacity.com/t/separating-ko-from-google-map/161496
It helped me to rebuild my concept of connecting knockout ViewModel and Google Map functions (setting markers and click handlers as properties of city objects)*/

function initMarkers(resultsMap) {
    // for each object in cities array new markers and info windows are created and function properties are assigned
    cities().forEach(function(cityData) {
        // variable holding the coordinates of marker on Google Map
        var coordinates = new google.maps.LatLng(cityData.lat, cityData.lon);
        // new marker creation
        var marker = new google.maps.Marker({
            map: resultsMap, // place marker on the initialized Google Map
            animation: google.maps.Animation.DROP, // animatation of droping markers on map on initial call
            title: cityData.name, //hover on marker to see its name
            position: coordinates // place markres on defined coordinates
        });
        // new empty info window varialbe is set
        var infoWindow;

        // ajax call to wikipedia to get the city description
        $.ajax({
            // with below URL we are getting the extract with descritpion about searched city
            url: ("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&indexpageids&titles=" + cityData.city),
            dataType: "jsonp",
            success: function(wikiData) {
                    // getting the right part of JSON - the first id of the page
                    var pageID = wikiData.query.pageids[0];
                    // extract of wiki JSON, that holds the pure info about city, is set as a property of cityData
                    cityData.contentString = wikiData.query.pages[pageID].extract;

                }
                // if the AJAX call runs without errors then starts function (.done)
        }).done(function() {
            // the new info window object is created
            infoWindow = new google.maps.InfoWindow({
                // with content get from AJAX call
                content: "<div class='infowindow'> <div class='wikipedia'> Source: Wikipedia </div>" + cityData.contentString + "</div"
            });
            // the look of info window is customized with setMargins function
            setMargins(infoWindow);
            // if AJAX call to Wikipedia has failed, then new info window content is set the error message
        }).fail(function() {
            infoWindow = new google.maps.InfoWindow({
                content: "<div class='infowindow'> Ups! An error occured! There was a problem with connection to Wikipedia API. Try again later. </div"
            });
            setMargins(infoWindow);
        });

        // setting marker object as a property of city
        cityData.markerProperty = marker;

        // creating a click listener on marker (binds functions that are called after marker is clicked)
        marker.addListener('click', function(event) {
            // when marker is clicked then start clickedOpen function
            cityData.clickedOpen(marker);
            // searching in cities array appropriate object to call functions on it
            cities().forEach(function(city) {
                // if currently clicked marker has matching name to the city name in cities array then the info window is opened
                if (cityData.name === city.name) {
                    // call for infoWindowOpen function (opens info window and starts bouncing animation)
                    city.infoWindowOpen();
                } else {
                    // else the info window is closed and animamation is stopped
                    city.infoWindowClose();
                }
            });
        });

        // point for centering the map on marker when clicked
        var pt = new google.maps.LatLng(cityData.lat, cityData.lon);

        /*setting the property function on cityData depending on created marker.
        this function opens the info window, starts the marker to bounce and centers the map on clicked marker*/
        cityData.clickedOpen = function(marker) {
            infoWindow.open(resultsMap, marker);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            // center the map on point
            resultsMap.setCenter(pt);
        }.bind(this);

        // adding a listener when map (not marker) is clicked
        resultsMap.addListener('click', function() {
            cities().forEach(function(city) {
                // this function closes all info windows
                city.infoWindowClose();
            });
        });

        // a function property that closes info window and stops the marker animation
        cityData.infoWindowClose = function() {
            infoWindow.close(resultsMap, marker);
            marker.setAnimation(null);
        }.bind(this);

        // a function that opens the info window
        cityData.infoWindowOpen = function() {
            infoWindow.open(resultsMap, marker);
        }.bind(this);

        // an event listener for window when it is loaded (or reloaded) to set the center of map and its bounds, depending on window size
        google.maps.event.addDomListener(window, 'load', function() {
            // setting the point of map center
            var pt = new google.maps.LatLng(48.1848684, 17.3100511);
            // centering the map
            resultsMap.setCenter(pt);

            // setting bounds of map that should be always visible (if it's necessary the map will be zoomed)
            var bounds = new google.maps.LatLngBounds({
                lat: 45.794727,
                lng: 3.115216
            }, {
                lat: 54.692391,
                lng: 31.136735
            });
            resultsMap.fitBounds(bounds);
        });

        // an event listener for window when it is resized
        google.maps.event.addDomListener(window, 'resize', function() {
            // when window is resized then map is centered in the initial position
            var pt = new google.maps.LatLng(48.1848684, 17.3100511);
            resultsMap.setCenter(pt);

            // setting bounds of map that should be always visible (if it's necessary the map will be zoomed)
            var bounds = new google.maps.LatLngBounds({
                lat: 45.794727,
                lng: 3.115216
            }, {
                lat: 54.692391,
                lng: 31.136735
            });
            resultsMap.fitBounds(bounds);
        });

    });

}

// setting css margins for infoWindow to none (thanks to: http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html)
function setMargins(infoWindow) {
    // when DOM is ready the listener event is set that changes margins of info windows
    google.maps.event.addListener(infoWindow, 'domready', function() {

        // Reference to the DIV which receives the contents of the infowindow using jQuery
        var iwOuter = $('.gm-style-iw');

        /* The DIV we want to change is above the .gm-style-iw DIV.
         * So, we use jQuery and create a iwBackground variable,
         * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
         */
        var iwBackground = iwOuter.prev();

        // Remove the background shadow DIV
        iwBackground.children(':nth-child(2)').css({
            'display': 'none'
        });

        // Remove the white background DIV
        iwBackground.children(':nth-child(4)').css({
            'display': 'none'
        });
    });
}

// HAMBURGER menu is a rebuild and customized concept of this code http://codepen.io/corysimmons/pen/KbFcg
// below function adds classes "expanded" and bootstrap "col-..." to the DOM elements and starts animation of sliding
$("#toggle").click(function() {
    $(this).toggleClass("expanded");
    $("ul").toggleClass("expanded").toggle("slide");

    $(".form-container").toggleClass("col-xs-2").toggle("slide");
    $(".hamburger").toggleClass("col-xs-2").toggle("slide");

    $(".rightBurger").toggleClass("col-xs-12");
    $(".rightBurger").toggleClass("col-xs-10");

    // changing size of map container (don't know why toggle("slide") doesn't work?)
    $("#map").toggleClass("col-xs-12");
    $("#map").toggleClass("col-xs-10");
});