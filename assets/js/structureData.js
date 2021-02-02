// array with all the quakes.
// earthquakes array to show on the map with pulsing dots
var listFeatures = [];

// earthquakes details to show on pop-up
var detailsOfAllQuakes = [];

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
    listFeatures.push(feature);
}

// array with all important quakes --> it's about the quakes details to show in a box.
// important quakes with a range value !

var listFeaturesImportantQuakes;

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
