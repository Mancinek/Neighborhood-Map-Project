
// TODO: Use of geocoding function
var cities = ko.observableArray([
			{name: "Berlin, Brandenburg Gate", city:"Berlin", id: "1", lat: 52.5162778, lon: 13.3755153},
			{name: "Warsaw, Palace of Culture", city:"Warsaw", id: "2", lat: 52.2318413, lon: 21.0038063},
			{name: "Moscow, Red Square", city:"Moscow", id: "3",  lat: 55.7539333, lon: 37.6186063},
			{name: "Hamburg, Townhall", city:"Hamburg", id: "4", lat: 53.5503866, lon: 9.9901799},
			{name: "Paris, Notre-Dame", city:"Paris", id: "5",  lat: 48.8529717, lon: 2.3477134},
			{name: "Milan, Sforzesco Castle", city:"Milan", id: "6", lat: 45.4704799, lon: 9.1771438},
			{name: "Rome, St. Peter's Basilica", city:"Rome", id: "7", lat: 41.9021707, lon: 12.451748},
			{name: "Madrid, Palacio Cibeles", city:"Madrid", id: "8", lat: 40.4189975, lon: -3.6942011},
			{name: "Barcelona, Sagrada Familia", city:"Barcelona", id: "9", lat: 41.4036339, lon: 2.1721671},
			{name: "London, Big Ben", city:"London", id: "10", lat: 51.5007325, lon: -0.1268141},
			{name: "Vienna, Schonbrunn Palace", city:"Vienna", id: "11", lat: 48.1848684, lon: 16.3100511}
		]);

function initMap()  {

	var map = new google.maps.Map(document.getElementById('map'), {
	center: {
      lat: 48.1848684,
      lng: 17.3100511
    },
    scrollwheel: true,
	zoom: 5

	// errror handling if map is not loaded

	});

	initMarkers(map);
}

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
	    var infoWindow; //= new google.maps.InfoWindow({content: "<div class='infowindow'>" + wiki(city.name) + "</div"});


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

	            //return cityDescription;

			}
    	}).done(function(){
    		infoWindow = new google.maps.InfoWindow({
			content: "<div class='infowindow'>" + cityData.contentString + "</div"
			});
			setMargins(infoWindow);
    	}).fail(function() {
    		infoWindow = new google.maps.InfoWindow({
			content: "<div class='infowindow'> Error loading infowindow</div"
			});
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

// setting css margins to none (thanks to: http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html)
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

// HAMBURGER menu is a rebuild and customized concept of this code http://codepen.io/corysimmons/pen/KbFcg
// below function adds class expanded to the DOM elements and starts animation of sliding
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

function ViewModel() {
	var self = this;

	self.addressList = ko.observableArray([]);

	cities().forEach(function(cityData) {
 		cityData.visible = ko.observable(true);
		self.addressList.push(cityData);
	});

	self.clickedMapMarker = function(name, event) {
		cities().forEach(function(cityData) {
			if (event.target.id === cityData.id) { // id is used because clickedMapMarker() uses name as passed value and we need other value to use
				cityData.clickedOpen(cityData.markerProperty);
			} else {
				cityData.infoWindowClose();
			}
		});
	};

	self.filterText = ko.observable("");

	// filteredAddresses sets the visibility of addresses on list
	self.filteredAddresses = ko.computed(function() {

	cities().forEach(function(cityData) {

		var inputText = self.filterText().toLowerCase();
		var searchedCity = cityData.name.toLowerCase();

	  // Set visible binding to the folowing boolean. Filters on type.
		cityData.visible(searchedCity.indexOf(inputText) >= 0);

	  // Have to add check for existence of mapMarker since on initial render,
	  // the marker doesn't yet exist by the time filteredAddresses() is called / built.
	  // FILTER THE MARKERS ON MAP
	 	if (cityData.markerProperty) {
			cityData.markerProperty.setVisible(searchedCity.indexOf(inputText) >= 0);
		}

		// start clickedOpen on markers when filtering on addresses list
		if (cityData.visible() && inputText && cityData.markerProperty) {
			cityData.clickedOpen(cityData.markerProperty);
			cityData.infoWindowClose();
		} else if (cityData.markerProperty) {
			// Close all infowindows if the filter doesn't have a match.
			cityData.infoWindowClose();
		}
	})

  	}, this);


}

var vm = new ViewModel;
ko.applyBindings(vm);










