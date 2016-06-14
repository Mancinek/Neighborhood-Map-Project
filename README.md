#Neighborhood Map - Cities of Europe

The application shows **places in Europe I'd like to visit**. The list of cities is placed on Google Map as markers. This app gives also addtional info about this cities. This repository gives you basis to customize the map and set your own places.

##Contents

1. How to run
2. How to use it
3. Error handling
4. To Do's and Issues
5. How the code is organized


##How to run

To run this game [download](https://github.com/Mancinek/Neighborhood-Map-Project/archive/master.zip) the repository and open the `index.html` file in your browser - the app will start immediately.

##How to use it

On the page you'll find two spaces: the **list of places** in chosen cities and the **map with markers** on it.

To see the list, you have to click the "hamburger icon" - the list will slide in the screen. You can click on list to see on map where the clicked place is located. Also the info window will pop up over the selected place. In the info window you can read additional information from Wikipedia about the city, where the chosen place is located.

You can also click directly on marker on map. The selected marker will start to bounce and the info about city will be shown. To deactivate the chosen marker you can click on other place on list/map (the other place will be highlighted) or click on somewhere else on map, where is no marker placed (all locations will be deactivated).

The sliding menu, with places list, has addtional filter feature at the top - start typing some text in it to filter the locations. As you will typing, the locations will be filtered, both on list and on map.

You can use this application on any device, it is fully responsive and fitted to the device resolution.


## Error handling

The application uses API and in case of any errors with connection you will be notified:
- when Google Map will not be loaded, you'll see the alert window,
- when AJAX call to Wikipedia will fail, you'll see error message in info window.

## To Do's and Issues

At this moment clicking on list of addresses highlights the appropriate marker on map. To improve usability, it would be good to implement additional functionality that highlights the clicked list element (and also highligths the list element when marker is clicked).

There are also two slight issues with info windows:
- concerning content of info window - it does not show the whole description. There is some kind of issue with viewing to long text in info window. The work-around solution could be a getting only the first paragraph of the extract from Wikipedia, so the description would be shorter,
- the info window has invisible margins and sometimes they cover other markes on map, so they can't be clicked at the moment.

##How the code is organized

The application runs on basis of few _js_ files:

* `vm.js` that contains the ViewModel definition with list click handler and filter box handler,
* `app.js` implements all other funcions concerning map initialization, setting markers on map and handling click events on them, setting info windows with Wikipedia AJAX requests,
* `locations.js` containing the array with hardcoded locations used in the app,
* `jquery-2.2.3.min.js` library,
* `knockout-3.4.0.js` as a framework for the application.

The repository contains also other files like:

* `index.html` that loads the scripts on the page and defines bindings to ViewModel,
* `style.css` and `bootstrap.css` that define the style of html,
* images - texture for background and hamburger menu icon.

