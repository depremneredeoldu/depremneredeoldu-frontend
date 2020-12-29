function writeImportantQuakes(listFeaturesImportantQuakes, rangeValue) {

    if (listFeaturesImportantQuakes.length == 0) {
        infoQuakesImportantBox.innerHTML = `<center><h5>Önemli Depremler</h5></center><hr>
                                            <p>Seçili ${rangeValue} deprem içinde 4 şiddetinin üstünde gösterilecek bir deprem yok.</p>`;

    }
    else {
        let htmlContent = "<center><h5>Önemli Depremler</h5></center><hr>"
        for (var key in listFeaturesImportantQuakes) {

            let coordinates = [parseFloat(listFeaturesImportantQuakes[key].longitude), parseFloat(listFeaturesImportantQuakes[key].latitude)];
            let informationPopup = `<strong>Lokasyon : ${listFeaturesImportantQuakes[key].location}</strong><br>\
                                    Şiddet : ${listFeaturesImportantQuakes[key].magnitude}<br>\
                                    Derinlik : ${listFeaturesImportantQuakes[key].depth}<br>\
                                    Tarih : ${listFeaturesImportantQuakes[key].time} - ${listFeaturesImportantQuakes[key].date}`


            htmlContent += `
            <a id="linkToFly" href="#" onclick="geoToFly(${listFeaturesImportantQuakes[key].longitude}, ${listFeaturesImportantQuakes[key].latitude}); toggleNav(); displayPopup([${coordinates}], '${informationPopup}');"><p>Lokasyon: ${listFeaturesImportantQuakes[key].location}</p></a>
            <b><p style=color:red;>Şiddet: ${listFeaturesImportantQuakes[key].magnitude}</p></b>
            <p>Derinlik: ${listFeaturesImportantQuakes[key].depth}</p>
            <p>Saat/Tarih: ${listFeaturesImportantQuakes[key].time} - ${listFeaturesImportantQuakes[key].date}</p><hr>
            `
        }
        
        infoQuakesImportantBox.innerHTML = htmlContent;
        
    }
}
function geoToFly(longitude, latitude) {
    map.flyTo(
        {
            center: [longitude, latitude],
            zoom: 8
        }
    )
};

// to display a popup when users click on the important quake in the right side menu
function displayPopup(coordinates, description) {
    
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
    });

    return popup.setLngLat(coordinates).setHTML(description).addTo(map);
};