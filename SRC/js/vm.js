/* jshint ignore:start */
"use strict";
/* jshint ignore:end */

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