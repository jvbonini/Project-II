// // Store our API endpoint inside queryUrl
var queryUrl = "/api/cities";

// An array which will be used to store created cityMarkers
var cityMarkers = [];
var cityMarkers2 = [];

// Perform a GET request to the query URL
d3.json(queryUrl, function (cities) {
    for (var i = 0; i < cities.length; i++) {
        var color = "";
        var fillColor = "";
        var location = cities[i].location.split(",");
        location[0] = parseFloat(location[0]);
        location[1] = parseFloat(location[1]);
        console.log(location);
        if (cities[i].result == "win") {
            color = "green";
            fillColor = "green"
        }
        else {
            color = "red";
            fillColor = "red"
        }
        if (cities[i].place == "at") {
            cityMarkers2.push(
                L.circle(location, {
                    fillOpacity: 1,
                    color: color,
                    fillColor: fillColor,
                    radius: 30000
                }).bindPopup("<h2>" + cities[i].opponent + " " + cities[i].place + " Navy </h2> <h4>" + cities[i].date + "</h4> <h4>" + cities[i].navyScore + " to " + cities[i].opponentScore + " Navy " + cities[i].result + "</h4>")
            );
        } else {
            // loop through the cities array, create a new marker, push it to the cityMarkers array
            cityMarkers.push(
                L.circle(location, {
                    fillOpacity: 1,
                    color: color,
                    fillColor: fillColor,
                    radius: 30000
                }).bindPopup("<h2>" + cities[i].opponent + " " + cities[i].place + " Navy </h2> <h4>" + cities[i].date + "</h4> <h4>" + cities[i].navyScore + " to " + cities[i].opponentScore + " Navy " + cities[i].result + "</h4>")
            );
        }
    };
    // Add all the cityMarkers to a new layer group.
    // Now we can handle them as one group instead of referencing each individually
    var cityLayer = L.layerGroup(cityMarkers);
    var cityLayer2 = L.layerGroup(cityMarkers2);


    // Define variables for our tile layers
    var light = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets-basic",
        accessToken: API_KEY
    });

    // Only one base layer can be shown at a time
    var baseMaps = {
        'Away Games': cityLayer,
        'Home Games (Competitor Location)': cityLayer2
    };

    // Overlays that may be toggled on or off
    var overlayMaps = {
    };

    // Create map object and set default layers
    var myMap = L.map("map", {
        center: [35.9013158, -78.5148069],
        zoom: 6,
        layers: [light, cityLayer]
    });

    // Pass our map layers into our layer control
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
});







