// call function to initialize the map with the features as parameters.

mapboxgl.accessToken = ACCESSTOKEN;

var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/alicanyuksel/ckf7kg2t70iah19np73mhnx48", // stylesheet location
    center: [37.870625, 38.867298], // starting position [lng, lat]
    zoom: 5, // starting zoom
});

function addPulsingDot(
    pulsingDotName,
    pulsingDotVariable,
    pixelRatio,
    layerId,
    sourceName,
    feature
) {
    map.on("load", function () {
        map.addImage(pulsingDotName, pulsingDotVariable, {
            pixelRatio: pixelRatio,
        });

        map.addSource(sourceName, {
            type: "geojson",
            data: {
                type: "FeatureCollection",
                features: feature,
            },
        });

        // Add a layer showing the places.
        map.addLayer({
            id: layerId,
            type: "symbol",
            source: sourceName,

            layout: {
                "icon-image": pulsingDotName,
                "icon-allow-overlap": true,
            },
        });
    });

    map.on("click", layerId, function (e) {
        map.flyTo({
            center: e.features[0].geometry.coordinates,
            zoom: 8,
        });
    });

    // Create a popup, but don't add it to the map yet.
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
    });

    map.on("mouseenter", layerId, function (e) {
        // Change the cursor style as a UI indicator.
        map.getCanvas().style.cursor = "pointer";

        var coordinates = e.features[0].geometry.coordinates.slice();
        var description = e.features[0].properties.description;

        // Ensure that if the map is zoomed out such that multiple
        // copies of the feature are visible, the popup appears
        // over the copy being pointed to.
        while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
        }

        // Populate the popup and set its coordinates
        // based on the feature found.
        popup.setLngLat(coordinates).setHTML(description).addTo(map);
    });

    map.on("mouseleave", layerId, function () {
        map.getCanvas().style.cursor = "";
        popup.remove();
    });
}

// filter listFeatures with the magnitude (red, yellow, green pulsing dot)
function getFilteredEarthquakes(listFeatures, defaultRangeValue) {
    var green_features = [];
    var yellow_features = [];
    var red_features = [];

    for (var key in listFeatures.slice(null, defaultRangeValue)) {
        if (
            listFeatures[key].properties.infoAboutMagnitude > 0 &&
            listFeatures[key].properties.infoAboutMagnitude < 2
        ) {
            green_features.push(listFeatures[key]);
        } else if (
            listFeatures[key].properties.infoAboutMagnitude >= 2 &&
            listFeatures[key].properties.infoAboutMagnitude < 4
        ) {
            yellow_features.push(listFeatures[key]);
        } else if (listFeatures[key].properties.infoAboutMagnitude >= 4) {
            red_features.push(listFeatures[key]);
        }
    }

    return {
        green_features,
        yellow_features,
        red_features,
    };
}

allFeaturesQuakes = getFilteredEarthquakes(listFeatures, defaultRangeValue);

addPulsingDot(
    "pulsing-dot-green",
    pulsingDot_green,
    6,
    "places_green",
    "points_green",
    allFeaturesQuakes.green_features
);
addPulsingDot(
    "pulsing-dot-yellow",
    pulsingDot_yellow,
    6,
    "places_yellow",
    "points_yellow",
    allFeaturesQuakes.yellow_features
);
addPulsingDot(
    "pulsing-dot-red",
    pulsingDot_red,
    4,
    "places_red",
    "points_red",
    allFeaturesQuakes.red_features
);
