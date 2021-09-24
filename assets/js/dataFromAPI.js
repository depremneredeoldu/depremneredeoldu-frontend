var myGeocode;

// let url = "https://api.depremneredeoldu.com/earthquakes";
let url = "http://127.0.0.1:5000/earthquakes";


var xhr = new XMLHttpRequest();

function loadJSON(url) {
    // async==False beacause we want to store the data fetched into a js variable
    xhr.open("GET", url, false);
    xhr.send(null);

    // set json data into a global variable
    myGeocode = JSON.parse(xhr.responseText);
    // reverse for sorting the date
    myGeocode["earthquakes"].reverse();
}

loadJSON(url);
