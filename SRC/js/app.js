/* jshint ignore:start */
"use strict";
/* jshint ignore:end */

// errror handling if map is not loaded
function googleMapError() {
	alert("Ups! An error occured! Map has not been loaded. Try again later.")
};

// initialization of new google map and call for markers creation (initMarkers())
function initMap()  {

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

// function that handles everything concerning markers:
// - creating new marker for each city in cities array
// - creating new infoWindow with Wikipedia content (opening and closing infoWindow)
// - handling click event on each marker (boucing animation and opening/closing infoWindow)

// Many thanks to thread: https://discussions.udacity.com/t/separating-ko-from-google-map/161496
// It helped me to rebuild my concept of connecting knockout ViewModel and Google Map functions (setting markers and click handlers as properties of city objects)

function initMarkers(resultsMap) {

	cities().forEach(function(cityData){

		// ---------  changing address to geocoded longitude and latitude --------------
		var coordinates = new google.maps.LatLng(cityData.lat, cityData.lon);

		var marker = new google.maps.Marker({
			map: resultsMap,
			animation: google.maps.Animation.DROP,
			title: cityData.name,
			position: coordinates
		});
	    // --------- creation of infowindow for marker --------------
	    var infoWindow;


	    // ajax call to wikipedia to get the city description
		$.ajax({
	        url: ("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&indexpageids&titles=" + cityData.city),
	        dataType: "jsonp",
	        success: function (wikiData) {
	        	// to clear the timeout function in case of successful loading the links
	            //clearTimeout(setTimer);
	        	// first id of the page
	        	var pageID = wikiData.query.pageids[0];
	        	// extract of wiki object that holds the info about city

	            cityData.contentString = wikiData.query.pages[pageID].extract;

			}
    	}).done(function(){
    		infoWindow = new google.maps.InfoWindow({
			content: "<div class='infowindow'>" + cityData.contentString + "</div"
			});
			setMargins(infoWindow);
    	}).fail(function() {
    		infoWindow = new google.maps.InfoWindow({
			content: "<div class='infowindow'> Ups! An error occured! There was a problem with connection to Wikipedia API. Try again later. </div"
			});
			setMargins(infoWindow);
    	});

	    // setting marker object as a property of city
	    cityData.markerProperty = marker;

	    // click on marker functionality
	    marker.addListener('click', function(event) {
	    	cityData.clickedOpen(marker);

	    	cities().forEach(function(city) {

	    		// jesli klikniety przed chwila marker (cityData) jest taki jak city name to otworz infowindow
				if (cityData.name === city.name) {
					city.infoWindowOpen();
				} else {
					city.infoWindowClose();
				}
      		});
	    });

	    cityData.clickedOpen = function(marker) {
	    	infoWindow.open(resultsMap, marker);
	    	marker.setAnimation(google.maps.Animation.BOUNCE);
	    	//highlightList(true);
	    }.bind(this);

		resultsMap.addListener('click', function() {
			cities().forEach(function(city) {
				city.infoWindowClose();
			});
		});

		cityData.infoWindowClose = function() {
			infoWindow.close(resultsMap, marker);
			marker.setAnimation(null);
		}.bind(this);

		cityData.infoWindowOpen = function() {
			infoWindow.open(resultsMap, marker);
		}.bind(this);

	});

}

// setting css margins for infoWindow to none (thanks to: http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html)
function setMargins(infoWindow) {
	google.maps.event.addListener(infoWindow, 'domready', function() {

	   // Reference to the DIV which receives the contents of the infowindow using jQuery
	   var iwOuter = $('.gm-style-iw');

	   /* The DIV we want to change is above the .gm-style-iw DIV.
	    * So, we use jQuery and create a iwBackground variable,
	    * and took advantage of the existing reference to .gm-style-iw for the previous DIV with .prev().
	    */
	   var iwBackground = iwOuter.prev();

	   // Remove the background shadow DIV
	   iwBackground.children(':nth-child(2)').css({'display' : 'none'});

	   // Remove the white background DIV
	   iwBackground.children(':nth-child(4)').css({'display' : 'none'});

	});
};

/*function highlightList(flag) {

	//	var newDiv = document.createElement('div');
		if (flag) {
			$("#addressDiv").style.background = "#e7e7e7";
		}
};*/

// HAMBURGER menu is a rebuild and customized concept of this code http://codepen.io/corysimmons/pen/KbFcg
// below function adds classes "expanded" and bootstrap "col-..." to the DOM elements and starts animation of sliding
$("#toggle").click(function() {
  $(this).toggleClass("expanded");
  $("ul").toggleClass("expanded").toggle("slide");

  $(".form-container").toggleClass("col-xs-2").toggle("slide");
  $(".menuTitle").toggleClass("expanded").toggle("slide");
  $(".hamburger").toggleClass("col-xs-2").toggle("slide");

  // burger does'nt change class ???
  $(".rightBurger").toggleClass("col-xs-12");
  $(".rightBurger").toggleClass("col-xs-10");

  // changing size of map container (don't know why toggle("slide") does'nt work?)
  $("#map").toggleClass("col-xs-12");
  $("#map").toggleClass("col-xs-10");

});
