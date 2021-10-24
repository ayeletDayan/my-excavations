'use strict'

var gPlaces = [];
console.log(gPlaces);

function addFavSpot(position, spotName) {
    let currSpot = createSpot(position, spotName);
    console.log(currSpot);
    if (!gPlaces.length) gPlaces[0] = currSpot
    else gPlaces.push(currSpot);
    saveToStorage('placesData', gPlaces);
    return currSpot
}


// createSpot({ lat: 31.798668995926, lng: 34.704623285599226 }, 'A-8357');
function createSpot(position, spotName) {
    return {
        id: makeId(),
        lat: position.lat,
        lng: position.lng,
        name: spotName,
    }
}

function getPlacesToShow() {
    let places = loadFromStorage('placesData') || [];
    if (places) gPlaces = places;
    return gPlaces;
}

function removeItem(itemId) {
    let itemIdx = findItemIdx(itemId);
    // console.log(itemIdx);
    console.log(gPlaces[itemIdx])
    gPlaces.splice(itemIdx, 1);
    saveToStorage('placesData', gPlaces);
}

function findItemIdx(itemId) {
    return gPlaces.findIndex((place => itemId === place.id));
}