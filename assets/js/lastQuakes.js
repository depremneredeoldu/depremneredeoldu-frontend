function writeLastQuakes(detailsOfAllQuakes, rangeValue) {    

    let htmlContent = `<center><h5>Son ${rangeValue} Depremler</h5><p class="copyright">\u24D8 Kaynak: Kandilli Rasathanesi</p></center>
                       <hr>`
    for (var key in detailsOfAllQuakes.slice(null, rangeValue)) {
        
        let coordinates = [parseFloat(detailsOfAllQuakes[key].longitude), parseFloat(detailsOfAllQuakes[key].latitude)];
        let informationPopup = `<strong>Lokasyon : ${detailsOfAllQuakes[key].location}</strong><br>\
                                Şiddet : ${detailsOfAllQuakes[key].magnitude}<br>\
                                Derinlik : ${detailsOfAllQuakes[key].depth}<br>\
                                Tarih : ${detailsOfAllQuakes[key].time} - ${detailsOfAllQuakes[key].date}`
        

        if (detailsOfAllQuakes[key].magnitude > 0 && detailsOfAllQuakes[key].magnitude <= 2) {
            htmlContent += `
            <a id="linkToFly" href="#" onclick="geoToFly(${detailsOfAllQuakes[key].longitude}, ${detailsOfAllQuakes[key].latitude}); toggleNav(); displayPopup([${coordinates}], '${informationPopup}');"><p>Lokasyon: ${detailsOfAllQuakes[key].location}</p></a>
            <b><p style=color:#4daf7c;>Şiddet: ${detailsOfAllQuakes[key].magnitude}</p></b>
            <p>Derinlik: ${detailsOfAllQuakes[key].depth}</p>
            <p>Saat/Tarih: ${detailsOfAllQuakes[key].time} - ${detailsOfAllQuakes[key].date}</p><hr>`
        }
        else if (detailsOfAllQuakes[key].magnitude >= 2 && detailsOfAllQuakes[key].magnitude < 4) {
            htmlContent += `
            <a id="linkToFly" href="#" onclick="geoToFly(${detailsOfAllQuakes[key].longitude}, ${detailsOfAllQuakes[key].latitude}); toggleNav(); displayPopup([${coordinates}], '${informationPopup}');"><p>Lokasyon: ${detailsOfAllQuakes[key].location}</p></a>
            <b><p style=color:#F7CA18;>Şiddet: ${detailsOfAllQuakes[key].magnitude}</p></b>
            <p>Derinlik: ${detailsOfAllQuakes[key].depth}</p>
            <p>Saat/Tarih: ${detailsOfAllQuakes[key].time} - ${detailsOfAllQuakes[key].date}</p><hr>`
        }
        else if (detailsOfAllQuakes[key].magnitude >= 4) {
            htmlContent += `
            <a id="linkToFly" href="#" onclick="geoToFly(${detailsOfAllQuakes[key].longitude}, ${detailsOfAllQuakes[key].latitude}); toggleNav(); displayPopup([${coordinates}], '${informationPopup}');"><p>Lokasyon: ${detailsOfAllQuakes[key].location}</p></a>
            <b><p style=color:red;>Şiddet: ${detailsOfAllQuakes[key].magnitude}</p></b>
            <p>Derinlik: ${detailsOfAllQuakes[key].depth}</p>
            <p>Saat/Tarih: ${detailsOfAllQuakes[key].time} - ${detailsOfAllQuakes[key].date}</p><hr>`
        }    
    }

    lastQuakesBox.innerHTML = htmlContent;

}

function geoToFly(longitude, latitude) {
    map.flyTo(
        {
            center: [longitude, latitude],
            zoom: 8
        }
    )
};

// to display a popup when users click on any quake in the right side menu
function displayPopup(coordinates, description) {
    
    var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: true
    });

    return popup.setLngLat(coordinates).setHTML(description).addTo(map);
};