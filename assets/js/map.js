// array with all the quakes.
var listFeatures = [];

for (var key in myGeocode.earthquakes) {
    const feature = {
        type: "Feature",
        properties: {
            description: `<strong>Lokasyon : ${myGeocode["earthquakes"][key].location}</strong><br>
                Büyüklük : ${myGeocode["earthquakes"][key].magnitude}<br>
                Derinlik : ${myGeocode["earthquakes"][key].depth}<br>
                Tarih : ${myGeocode["earthquakes"][key].time} - ${myGeocode["earthquakes"][key].date}`,
            infoAboutMagnitude: parseFloat(
                `${myGeocode["earthquakes"][key].magnitude}`
            ),
        },
        geometry: {
            type: "Point",
            coordinates: [
                myGeocode["earthquakes"][key].longitude,
                myGeocode["earthquakes"][key].latitude,
            ],
        },
    };

    listFeatures.push(feature);
}

// array with all quakes of today --> the features to show on map
var listFeaturesToday = [];

// all today's earthquake to show the details in the box
var detailsTodayQuakes = [];

var detailsOfAllQuakes = [];

var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; // because getMonth begin from 0. really sad !
var yyyy = today.getFullYear();

today = yyyy + "." + mm + "." + dd;

for (var key in myGeocode.earthquakes) {
    const feature = {
        type: "Feature",
        properties: {
            description: `<strong>Lokasyon : ${myGeocode["earthquakes"][key].location}</strong><br>
                        Büyüklük : ${myGeocode["earthquakes"][key].magnitude}<br>
                        Derinlik : ${myGeocode["earthquakes"][key].depth}<br>
                        Tarih : ${myGeocode["earthquakes"][key].time} - ${myGeocode["earthquakes"][key].date}`,
        },
        geometry: {
            type: "Point",
            coordinates: [
                myGeocode["earthquakes"][key].longitude,
                myGeocode["earthquakes"][key].latitude,
            ],
        },
    };

    const quakeDetail = {
        location: myGeocode.earthquakes[key].location,
        magnitude: myGeocode.earthquakes[key].magnitude,
        depth: myGeocode.earthquakes[key].depth,
        date: myGeocode.earthquakes[key].date,
        time: myGeocode.earthquakes[key].time,
        latitude: myGeocode.earthquakes[key].latitude,
        longitude: myGeocode.earthquakes[key].longitude,
    };

    detailsOfAllQuakes.push(quakeDetail);

    if (myGeocode.earthquakes[key].date == today) {
        const quakeToday = {
            location: myGeocode.earthquakes[key].location,
            magnitude: myGeocode.earthquakes[key].magnitude,
            depth: myGeocode.earthquakes[key].depth,
            date: myGeocode.earthquakes[key].date,
            time: myGeocode.earthquakes[key].time,
            latitude: myGeocode.earthquakes[key].latitude,
            longitude: myGeocode.earthquakes[key].longitude,
        };

        // append details of quake into our array
        detailsTodayQuakes.push(quakeToday);

        // append the features into our array to show on map with pulsing dot
        listFeaturesToday.push(feature);
    }
}

// array with all important quakes --> it's about the quakes details to show in a box.
// important quakes with a range value !

var listFeaturesImportantQuakes;
var detailsOfAllEarthquakes;

function getImportantQuakes(
    myGeocode,
    listFeaturesImportantQuakes,
    rangeValue
) {
    listFeaturesImportantQuakes = [];

    for (var key in myGeocode.earthquakes.slice(null, rangeValue)) {
        if (parseFloat(myGeocode.earthquakes[key].magnitude) >= 4.0) {
            const importantQuake = {
                location: myGeocode.earthquakes[key].location,
                magnitude: myGeocode.earthquakes[key].magnitude,
                depth: myGeocode.earthquakes[key].depth,
                date: myGeocode.earthquakes[key].date,
                time: myGeocode.earthquakes[key].time,
                latitude: myGeocode.earthquakes[key].latitude,
                longitude: myGeocode.earthquakes[key].longitude,
            };

            listFeaturesImportantQuakes.push(importantQuake);
        }
    }

    return listFeaturesImportantQuakes;
}

listFeaturesImportantQuakes = getImportantQuakes(
    myGeocode,
    listFeaturesImportantQuakes,
    defaultRangeValue
);

// call function to initialize the map with the features as parameters.

//private key for the domain depremneredeoldu.com
mapboxgl.accessToken =
    "pk.eyJ1IjoiYWxpY2FueXVrc2VsIiwiYSI6ImNrajIxZzk1azBvdnUzMHA4a2l6ZDRuaHgifQ.h2r1WhCZ9tJ9AIBIt3lLwQ";
var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/alicanyuksel/ckf7kg2t70iah19np73mhnx48", // stylesheet location
    center: [37.870625, 38.867298], // starting position [lng, lat]
    zoom: 5, // starting zoom
});

// dot !!!
var size = 200;

// implementation of CustomLayerInterface to draw a pulsing dot icon on the map
// see https://docs.mapbox.com/mapbox-gl-js/api/#customlayerinterface for more info
var pulsingDot_red = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // get rendering context for the map canvas when layer is added to the map
    onAdd: function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
    },

    // called once before every frame where the icon will be used
    render: function (color) {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = "rgba(255, 200, 200," + (1 - t) + ")";
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(255, 100, 100, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
    },
};

var pulsingDot_green = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // get rendering context for the map canvas when layer is added to the map
    onAdd: function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
    },

    // called once before every frame where the icon will be used
    render: function (color) {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = "rgba(77, 175, 124," + (1 - t) + ")";
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(77, 175, 124, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
    },
};

var pulsingDot_yellow = {
    width: size,
    height: size,
    data: new Uint8Array(size * size * 4),

    // get rendering context for the map canvas when layer is added to the map
    onAdd: function () {
        var canvas = document.createElement("canvas");
        canvas.width = this.width;
        canvas.height = this.height;
        this.context = canvas.getContext("2d");
    },

    // called once before every frame where the icon will be used
    render: function (color) {
        var duration = 1000;
        var t = (performance.now() % duration) / duration;

        var radius = (size / 2) * 0.3;
        var outerRadius = (size / 2) * 0.7 * t + radius;
        var context = this.context;

        // draw outer circle
        context.clearRect(0, 0, this.width, this.height);
        context.beginPath();
        context.arc(
            this.width / 2,
            this.height / 2,
            outerRadius,
            0,
            Math.PI * 2
        );
        context.fillStyle = "rgba(247, 202, 24," + (1 - t) + ")";
        context.fill();

        // draw inner circle
        context.beginPath();
        context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
        context.fillStyle = "rgba(247, 202, 24, 1)";
        context.strokeStyle = "white";
        context.lineWidth = 2 + 4 * (1 - t);
        context.fill();
        context.stroke();

        // update this image's data with data from the canvas
        this.data = context.getImageData(0, 0, this.width, this.height).data;

        // continuously repaint the map, resulting in the smooth animation of the dot
        map.triggerRepaint();

        // return `true` to let the map know that the image was updated
        return true;
    },
};

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
