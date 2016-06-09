var ViewModel = function() {

	var self = this;

	self.cities = ko.observableArray([
			{cityName: "Berlin", cityStreet: "Kreuzberg", cityDesc: wiki(0, "Berlin")},
			{cityName: "Warsaw", cityStreet: "Mokotowska", cityDesc: wiki(1, "Warsaw")},
			{cityName: "Moscow", cityStreet: "The Mall", cityDesc: wiki(2, "Moscow")},
			{cityName: "Hamburg", cityStreet: "Neuer Wall", cityDesc: wiki(3, "Hamburg")},
			{cityName: "Paris", cityStreet: "Notre-Dame", cityDesc: wiki(4, "Paris")},
			{cityName: "Milan", cityStreet: "Hirschenplatz", cityDesc: wiki(5, "Milan")},
			{cityName: "Rome", cityStreet: "Hirschenplatz", cityDesc: wiki(6, "Rome")},
			{cityName: "Madrid", cityStreet: "Calle de Segovia", cityDesc: wiki(7, "Madrid")},
			{cityName: "Barcelona", cityStreet: "Calle de Segovia", cityDesc: wiki(8, "Barcelona")},
			{cityName: "London", cityStreet: "The Mall", cityDesc: wiki(9, "London")},
			{cityName: "Vienna", cityStreet: "Stephanplatz", cityDesc: wiki(10, "Vienna")}
		]);


	// computed array holding addresses (cityName + cityStreet) for each element from cities
	self.address = ko.computed(function() {
		self.wholeAddress = ko.observableArray([]);
		for(var i=0; i < self.cities().length; i++){
			self.wholeAddress().push(self.cities()[i].cityName + ", " + self.cities()[i].cityStreet);
		}
		return self.wholeAddress();
	}, self);


	self.filterText = ko.observable("");

	self.searchedList = ko.computed(function() {

		var setValue = self.filterText().toString().toLowerCase();

	    self.newList = ko.observableArray([]);

	    for(var x in self.address()) {
	      if(self.address()[x].toLowerCase().indexOf(setValue) >= 0) {
	        self.newList().push(self.address()[x]);
	      }

	    }
	    return self.newList();
	}, self);

	// a flag for <div> element - if it's false then div is not shown
	self.showImage = ko.observable(false);

	// the image url is now empty, but when you click on a list of cities it will be filled with current address url
	self.imgUrl = ko.observable("");
	self.clicked = ko.observable("");


	// when clicked on a list the clicker function is called
	self.clicker = function(currentCity) {
		// sets clicked as current city (if nothing on list of citities has been clicked)
		// in order to change css and highlight the chosen element
		// else (if something on city list has been clicked) it removes highlight by setting clicked variable to ""
		if (self.clicked() == "") {
			self.clicked(currentCity);
		} else {
			self.clicked(""); // --------------------->>>> DO zROBIENIA, podswietlenie klikając na marker, być może GLOBAL VAR że any marker isBouncing
		}
		// geting the index number of currently clicked city in address array
		var markerId = self.address().indexOf(currentCity);
		// using the above index to look for object (marker) in marker array
		var chosenMarker = markers[markerId];
		// using the above chosen marker to pass it to the function resposible for bouncing markers
		clicks.clickOnList(chosenMarker);
	}

	// this observable holds the number of addresses in address array
	self.numberOfaddresses = ko.observable(self.address().length);

	// calls the initMap function with array of addresses and length of this array (number of addresses)
	initMap(self.address(), self.numberOfaddresses());

}
var vm = new ViewModel();

ko.applyBindings(vm);


var map;

function initMap(addressOnMap, howManyAdresses)  {
	var myMarker = {lat: 48.957045, lng: 14.802978};

	map = new google.maps.Map(document.getElementById('map'), {
	    center: myMarker,
	    scrollwheel: true,
	    zoom: 4
  	});

	// loop through all addresses and pass address argument to the geocodeAddress to create markers
	for(var i=0; i<howManyAdresses; i++) {
		var geocoder = new google.maps.Geocoder();
		geocodeAddress(geocoder, map, addressOnMap[i]);
	}

};

var marker; // global variable that represents each following new marker that is being created by geocodeAddress()
var markers = []; // each new marker is pushed to this array by geocodeAddress()

// below function translates address to the map coordinates and creates new marker on map
function geocodeAddress(geocoder, resultsMap, addressOnMap) {

	geocoder.geocode({'address': addressOnMap}, function(results, status) {
		var markerOptions = {
			map: resultsMap,
			animation: google.maps.Animation.DROP,
			/*title: 'Hello World!',*/
			position: results[0].geometry.location
		};
		if (status === google.maps.GeocoderStatus.OK) {
			resultsMap.setCenter(results[0].geometry.location);
			marker = new google.maps.Marker(markerOptions);
			markers.push(marker);

			// bouncing of marker when clicked
			clicks.clickOnMarker(marker);

	    } else {
	     	alert('Geocode was not successful for the following reason: ' + status);
	    }

	});
};

// an obcject that holds all map bahavior concerning clicking on marker or on a list
var clicks = {
	// keeps track of currently clicked marker
	currentMarker: null,
	// position of current marker in markers array
	currentMarkerNumber: null,
	// starts animation of bouncing the marker
	startBounce : function(marker) {
		marker.setAnimation(google.maps.Animation.BOUNCE);
	},
	// stops animation of bouncing the marker
	stopBounce: function(marker) {
		marker.setAnimation(null);
	},
	// gets the state of animation (is marker bouncing or not)
	isBouncing: function(marker) {
		if (marker.getAnimation() !== null){
			return true;
		} else {
			return false;
		};
	},

	// bouncing marker when clicked
	clickOnMarker: function(marker) {
		marker.addListener('click', function() {

			//isAnyMarkerBouncing();
			//--------------------------------

			// if current marker is not null (so marker is clicked and assigned as current marker)
			if (clicks.currentMarker) {
				// if animation is running and marker is bouncing
				if (clicks.isBouncing(clicks.currentMarker)) {
					// stop animation
					clicks.stopBounce(clicks.currentMarker);
					// close the info window
					infoClose();
/*
					clicks.currentMarker = marker; //new
					clicks.startBounce(marker); //new
					infoOpen(clicks.currentMarker, clicks.currentMarkerNumber);//new*/


				// else if animation is not running
				} else {
					// set this marker to the currentMarker
					clicks.currentMarker = marker;
					// set the position of current marker in markers array
					clicks.currentMarkerNumber = markers.indexOf(clicks.currentMarker);
					// add a bounce to this marker
					clicks.startBounce(marker);
					// open info window
					infoOpen(clicks.currentMarker, clicks.currentMarkerNumber);

				}
			// else if current marker is null then assing new marker, start animation and open info window
			} else {
		        // set this marker to the currentMarker
		        clicks.currentMarker = marker;
		        // set the position of current marker in markers array
				clicks.currentMarkerNumber = markers.indexOf(clicks.currentMarker);
		        // add a bounce to this marker
		        clicks.startBounce(marker);
		        //open info window when clicked
		        infoOpen(clicks.currentMarker, clicks.currentMarkerNumber);
	        }
		});

			//--------------------------------
	},
	// the below function is a clone of clickOnMarker(), but without marker.addListener - it was created for using it by clicking on list of locations, instead of markers
	clickOnList: function(marker) {

		// if current marker is not null (so marker is clicked and assigned as current marker)
		if (clicks.currentMarker) {
			// if animation is running and marker is bouncing
			if (clicks.isBouncing(clicks.currentMarker)) {
				// stop animation
				clicks.stopBounce(clicks.currentMarker);
				// close the info window
				infoClose();
			// else if animation is not running
			} else {
				// set this marker to the currentMarker
				clicks.currentMarker = marker;
				// add a bounce to this marker
				clicks.startBounce(marker);
				// set the position of current marker in markers array
				clicks.currentMarkerNumber = markers.indexOf(clicks.currentMarker);
				// open info window
				infoOpen(clicks.currentMarker, clicks.currentMarkerNumber);
			}
		// else if current marker is null then assing new marker, start animation and open info window
		} else {
	        // set this marker to the currentMarker
	        clicks.currentMarker = marker;
			// set the position of current marker in markers array
			clicks.currentMarkerNumber = markers.indexOf(clicks.currentMarker);
	        // add a bounce to this marker
	        clicks.startBounce(marker);
	        //open info window when clicked
	        infoOpen(clicks.currentMarker, clicks.currentMarkerNumber);
        }
	}

};

function isAnyMarkerBouncing() {

	var testArray = [];

	for(var i=0; i<markers.length; i++) {
		if (clicks.isBouncing(markers[i]) === true) {
			testArray.push(true);
		} else {
			testArray.push(false);
		}
	};

	var lastAnswer = false;

	if (testArray.every(true)) {
		lastAnswer = true;
	} else {
		lastAnswer = false;
	}

	console.log(lastAnswer);



}

function wiki(numberOfcity, cityName) {

		// errpr handler - after 3 seconds cityDescription gets value of error string
		var setTimer = setTimeout(function() {
			var cityDescription = "Error: Failed to load city description"
			// city descritions are pushed to the infoWindows array with cityName and city number
			infoWindows.push({noCity: numberOfcity, city: cityName, cityDesc: cityDescription}); //
        	// infoWindows array is sorted with the numberOfCity in order to infoOpen function could properlny choose the current description of currently clicked marker
			infoWindows.sort(function(a, b) {
    			return a.noCity - b.noCity;
			});
    	}, 3000);

		$.ajax({
	        url: ("https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exintro=&indexpageids&titles=" + cityName),
	        dataType: "jsonp",
	        success: function (wikiData) {
	        	// to clear the timeout function in case of successful loading the links
	            clearTimeout(setTimer);
	        	// first id of the page
	        	var pageID = wikiData.query.pageids[0];
	        	// extract of wiki object that holds the info about city
	            var cityDescription = wikiData.query.pages[pageID].extract;
				// city descritions are pushed to the infoWindows array with cityName and city number
				infoWindows.push({noCity: numberOfcity, city: cityName, cityDesc: cityDescription}); //
				// infoWindows array is sorted with the numberOfCity in order to infoOpen() function could properlny choose
				// the current description of currently clicked marker
				infoWindows.sort(function(a, b) {
    				return a.noCity - b.noCity;
				});

			}
        });
};

// contains output from wiki request (cityName and cityDescritption)
var infoWindows = [];
// the empty object of new infoWindow, it gets value when new window is initiated (when infoOpen() runs)
var newInfoWindow = null;

// this function inits new infoWindow and opens it on map
// it takes two arguments, first is the marker that is currently selected (clicked) on map, and second is the number of the marker in markers array, which
// indicates the number of city
// this arguments are passed by clicks.clickOnMarker()
function infoOpen(marker, numberOfdescription) {
	// content of new info window, taken from infoWindows array holding description of cities
	var contentString = infoWindows[numberOfdescription].cityDesc;
	// creates new info window obcject
	newInfoWindow = new google.maps.InfoWindow({content: "<div class='infowindow'>" + contentString + "</div"});
	// open created info window on map over marker
	newInfoWindow.open(map, marker);

	setMargins();
}

// this function closes currently opened infoWindow
function infoClose(){
	newInfoWindow.close();
}

// setting css margins to none (thanks to: http://en.marnoto.com/2014/09/5-formas-de-personalizar-infowindow.html)
function setMargins() {
	google.maps.event.addListener(newInfoWindow, 'domready', function() {

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
