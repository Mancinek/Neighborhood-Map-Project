/* jshint ignore:start */
"use strict";
/* jshint ignore:end */

function ViewModel() {

    var self = this;

    // observable created to hold cities objects
    self.addressList = ko.observableArray([]);

    // filling the above addressList with objects to bind their names in list box in HTML
    cities().forEach(function(cityData) {
        // setting the visibility property of the city object - initially set to true
        cityData.visible = ko.observable(true);
        // pushing objects to observable array
        self.addressList.push(cityData);
    });

    // click handler for list elements
    self.clickedMapMarker = function(name, event) {
        cities().forEach(function(cityData) {
            /*if id of clicked element (target) is like id of city object then function
            clickedOpen (city's property) is called, using marker proprerty of clicked address*/
            if (event.target.id === cityData.id) { // id is used because clickedMapMarker() uses name as passed value and we need to use other value
                cityData.clickedOpen(cityData.markerProperty);

            } else {
                // else just in case info window is closed
                cityData.infoWindowClose();
            }
        });
    };
    // the observable that is binded to the filter box in HTML. It holds the input value
    self.filterText = ko.observable("");

    // filtering the list and map markers depending on input text in filter box
    self.filteredAddresses = ko.computed(function() {

        cities().forEach(function(cityData) {

            var inputText = self.filterText().toLowerCase();
            var searchedCity = cityData.name.toLowerCase();

            // if input in filter box is a part of name of city then visibility of this city gets value true and is visible on list
            cityData.visible(searchedCity.indexOf(inputText) >= 0);

            // filtering markers on map
            // if marker on map exists
            if (cityData.markerProperty) {
                // then set this marker visible if the text typed in filter box is a part of name of the city
                cityData.markerProperty.setVisible(searchedCity.indexOf(inputText) >= 0);
            }

            // if city object visible property evaluates to true AND in text box is typed text AND the marker exists on map
            if (cityData.visible() && inputText && cityData.markerProperty) {
                // then start clickedOpen function this marker (bounce the marker and show info window)
                cityData.clickedOpen(cityData.markerProperty);
                /*if input text matches few locations than few info windows would be shown - this is why all info windows are closed
                 the info window will be shown IN THIS CASE only on click event*/
                cityData.infoWindowClose();
            } else if (cityData.markerProperty) {
                // close all infowindows if the filter text does not match the cities names
                cityData.infoWindowClose();
            }
        });

    }, this);

}
// initialize ViewMadel and apply bindings
var vm = new ViewModel();
ko.applyBindings(vm);