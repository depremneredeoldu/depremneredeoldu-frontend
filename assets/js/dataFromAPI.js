var myGeocode;

let url = "https://api.depremneredeoldu.com/earthquakes";

var xhr = new XMLHttpRequest();

function loadJSON(url) {
    // async==False beacause we want to store the data fetched into a js variable
    xhr.open("GET", url, false);
    xhr.send(null);

    // set json data into a global variable
    myGeocode = JSON.parse(xhr.responseText);
}

loadJSON(url);
