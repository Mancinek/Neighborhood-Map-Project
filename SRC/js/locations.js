/* jshint ignore:start */
"use strict";
/* jshint ignore:end */

// below is placed initial array that contains the name of place, its city, id and coordinates
/* the id is used in function clickedMapMarker (vm.js) when we need to compare currently clicked element on
list with element in this array to show marker on map */
var cities = ko.observableArray([{
    name: "Berlin, Brandenburg Gate",
    city: "Berlin",
    id: "1",
    lat: 52.5162778,
    lon: 13.3755153
}, {
    name: "Warsaw, Palace of Culture",
    city: "Warsaw",
    id: "2",
    lat: 52.2318413,
    lon: 21.0038063
}, {
    name: "Moscow, Red Square",
    city: "Moscow",
    id: "3",
    lat: 55.7539333,
    lon: 37.6186063
}, {
    name: "Hamburg, Townhall",
    city: "Hamburg",
    id: "4",
    lat: 53.5503866,
    lon: 9.9901799
}, {
    name: "Paris, Notre-Dame",
    city: "Paris",
    id: "5",
    lat: 48.8529717,
    lon: 2.3477134
}, {
    name: "Milan, Sforzesco Castle",
    city: "Milan",
    id: "6",
    lat: 45.4704799,
    lon: 9.1771438
}, {
    name: "Rome, St. Peter's Basilica",
    city: "Rome",
    id: "7",
    lat: 41.9021707,
    lon: 12.451748
}, {
    name: "Madrid, Palacio Cibeles",
    city: "Madrid",
    id: "8",
    lat: 40.4189975,
    lon: -3.6942011
}, {
    name: "Barcelona, Sagrada Familia",
    city: "Barcelona",
    id: "9",
    lat: 41.4036339,
    lon: 2.1721671
}, {
    name: "London, Big Ben",
    city: "London",
    id: "10",
    lat: 51.5007325,
    lon: -0.1268141
}, {
    name: "Vienna, Schonbrunn Palace",
    city: "Vienna",
    id: "11",
    lat: 48.1848684,
    lon: 16.3100511
}]);