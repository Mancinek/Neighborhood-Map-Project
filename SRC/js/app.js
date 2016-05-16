
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var street = $("#street").val();
    var city = $("#city").val();
    //var googleApiKey = 'key=AIzaSyBS0rS4yU2Lnbmu-z3njq46VF7JkFnJ3-U';

    // creation of location variable dependant on filling street box
    if(street==="") {
        var location = city;
    } else {
        var location =  street + ", " + city;
    }

    var imgUrl = "https://maps.googleapis.com/maps/api/streetview?size=600x300&" + "location=" + location // + "&" + googleApiKey;
    $body.append("<img class='bgimg' src='" + imgUrl + "' alt='My location'></img>");

    $greeting.text("So you want to live in " + location);

    // NY Times articles

    $.getJSON( "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + location + "&api-key=a56ca515f5c043379fedf389bd5a6e1d", function( data ) {

        $nytHeaderElem.text("New York Times Articles about " + location);

        var articles = data.response.docs;

        for(var i=0; i<articles.length; i++){
            $nytElem.append("<li id='NYTarticle'>" + "<a href='" + articles[i].web_url + "'>" + articles[i].headline.main + "</a>" + "<p>" + articles[i].snippet + "</p></li>");
        }
    })
    // at the end of getJSON is attached error handler function
    .error(function(){
        $nytHeaderElem.text("New York Times Articles could not be loaded");
    });

    // WIKIPEDIA ARTICLES

    var wikiUrl = "https://n.wiipedia.org/w/api.php?action=opensearch&search=" + location + "&format=json&callback=wikiCallback";

    // in case if failure in loading links we start timeout function that will change the text in place of links
    var wikiRequestTimeout = setTimeout(function() {
        $wikiElem.text("Failed to load links");
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function (response) {
           var articleList = response[1];

           for (var i=0; i<articleList.length; i++) {
                articleStr = articleList[i];
                var url = "http://en.wikipedia.org/wiki/" + articleStr;
                $wikiElem.append("<li><a href='" + url + "'>" + articleStr + "</a></li>");
           }

           clearTimeout(wikiRequestTimeout); // to clear the timeout function in case of successful loading the links
        }
        })

    return false;
};

$('#form-container').submit(loadData);
