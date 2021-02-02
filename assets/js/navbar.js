var rangeInput = document.getElementById("myRange").value;
let infoNavbar = document.getElementById("infoNavbar");

function updateValues(newVal) {
    rangeInput = newVal;
    infoNavbar.innerHTML = `Son ${newVal} deprem görüntüleniyor. Yan taraftan güncelleyebilirsiniz.`;

    // to filter all quakes with the magnitude by adding a color on pulsing dots.

    allFeaturesQuakes = getFilteredEarthquakes(listFeatures, rangeInput);

    var newGeoJSONForGreen = {
        type: "FeatureCollection",
        features: allFeaturesQuakes.green_features,
    };

    var newGeoJSONForYellow = {
        type: "FeatureCollection",
        features: allFeaturesQuakes.yellow_features,
    };

    var newGeoJSONForRed = {
        type: "FeatureCollection",
        features: allFeaturesQuakes.red_features,
    };

    // set all of them in the map to update
    map.getSource("points_green").setData(newGeoJSONForGreen);
    map.getSource("points_yellow").setData(newGeoJSONForYellow);
    map.getSource("points_red").setData(newGeoJSONForRed);

    // update the list which contains all importants quakes with a range value given by user
    listFeaturesImportantQuakes = getImportantQuakes(
        myGeocode,
        listFeaturesImportantQuakes,
        rangeInput
    );

    // to write the data on a div box on html page
    writeImportantQuakes(listFeaturesImportantQuakes, rangeInput);

    // update last quakes with a range value given by user
    writeLastQuakes(detailsOfAllQuakes, rangeInput);
}
