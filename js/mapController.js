'use strict'

var gMap;
var gMarkers = [];

function onInit(page) {
    renderPlaces();
}

function initMap() {
    const myLatlng = { lat: 31.799264, lng: 34.704731 }
    gMap = new google.maps.Map(document.getElementById("map"), {
        center: myLatlng,
        zoom: 12,
    });
    // Create the initial InfoWindow.
    let infoWindow = new google.maps.InfoWindow({
        content: "Click the map to mark a spot",
        position: myLatlng,
    });
    infoWindow.open(gMap);

    const locations = getPlacesToShow();
    gMarkers = locations.map((location) => {
        return new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: gMap,
            title: location.name,
            id: location.id
        });
    })
    gMap.addListener("click", (mapsMouseEvent) => {
        let spotName = prompt('What is the name of the location you want to save?');
        let clickedPos = mapsMouseEvent.latLng.toJSON();

        const spot = addFavSpot(clickedPos, spotName);
        const marker = new google.maps.Marker({
            position: clickedPos,
            map: gMap,
            title: spotName,
            id: spot.id
        });
        gMarkers.push(marker)
        renderPlaces();
    });
}

function getPosition() {
    if (!navigator.geolocation) {
        alert("HTML5 Geolocation is not supported in your browser.");
        return;
    }

    // One shot position getting or continus watch
    navigator.geolocation.getCurrentPosition(showLocation, handleLocationError);
    // navigator.geolocation.watchPosition(showLocation, handleLocationError);
}

function showLocation({ coords }) {
    let myLatlng = new google.maps.LatLng(coords.latitude, coords.longitude)
    console.log(coords.latitude, coords.longitude)
    // map.setCenter(myLatlng)
    gMap.setCenter({ lat: coords.latitude, lng: coords.longitude })
}

function handleLocationError(error) {
    var locationError = document.getElementById("locationError");

    switch (error.code) {
        case 0:
            locationError.innerHTML = "There was an error while retrieving your location: " + error.message;
            break;
        case 1:
            locationError.innerHTML = "The user didn't allow this page to retrieve a location.";
            break;
        case 2:
            locationError.innerHTML = "The browser was unable to determine your location: " + error.message;
            break;
        case 3:
            locationError.innerHTML = "The browser timed out before retrieving the location.";
            break;
    }
}

function renderPlaces() {
    let places = getPlacesToShow();
    if (!places) return;
    console.log(places);
    var strHtmls = places.map(function (place) {
        return `<li onclick="moveTo('${place.lat}', '${place.lng}')">${place.name} <i style="font-size: 15px" class="fa fa-trash" onclick="onRemoveItem('${place.id}')"></i></li>`
    });

    document.querySelector('.fav-spots').innerHTML = strHtmls.join('');
}

function onRemoveItem(itemId) {
    const marker = gMarkers.find((marker) => { return marker.id === itemId })
    marker.setMap(null);
    removeItem(itemId);
    renderPlaces();
}

function moveTo(lat, lng) {
    gMap.setCenter({ lat: +lat, lng: +lng })
}

