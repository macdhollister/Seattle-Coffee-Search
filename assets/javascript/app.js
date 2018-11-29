let map;
let subHoods = [];

const nHoodsLocations = {
    "Northgate" : {lat: 47.708142 , lng: -122.327329},
    "Lake City": { lat: 47.717412, lng: -122.296243},
    "Greenwood": { lat: 47.690768, lng: -122.355337},
    "Roosevelt": { lat: 47.677311, lng: -122.317383},
    "Ravenna": { lat: 47.675796, lng: -122.306529},
    "Sandpoint": { lat: 47.681558, lng: -122.262278},
    "Ballard": { lat: 47.675965, lng: -122.379027},
    "Greenlake": { lat: 47.679638, lng: -122.334963},
    "University District": { lat: 47.661215, lng: -122.311804},
    "Wallingford": { lat: 47.661355, lng: -122.335859},
    "Fremont": { lat: 47.656084, lng: -122.353975},
    "Phinney Ridge": { lat: 47.675949, lng: -122.354673},
    "Magnolia": { lat: 47.640527, lng: -122.399536},
    "Interbay": { lat: 47.648482, lng: -122.378003},
    "Queen Anne": { lat: 47.632016, lng: -122.357072},
    "Eastlake": { lat: 47.642079, lng: -122.325845},
    "South Lake Union": { lat: 47.623162, lng: -122.336420},
    "Capitol Hill": { lat: 47.619905, lng: -122.320868},
    "Montlake": { lat: 47.640297, lng: -122.302942},
    "Madison": { lat: 47.632587, lng: -122.291663},
    "Central District": { lat: 47.604304, lng: -122.302240},
    "Belltown": { lat: 47.615330, lng: -122.343963},
    "Downtown": { lat: 47.610372, lng: -122.336615},
    "Pioneer Square": { lat: 47.601144, lng: -122.332315},
    "International District": { lat: 47.597484, lng: -122.323778},
    "SODO": { lat: 47.580476, lng: -122.334284},
    "Beacon Hill": { lat: 47.565133, lng: -122.311002},
    "MT Baker": { lat: 47.578270, lng: -122.288029},
    "Columbia City": { lat: 47.559462, lng: -122.285971},
    "Georgetown": { lat: 47.546533, lng: -122.325232},
    "Rainier Valley": { lat: 47.536876, lng: -122.270445},
    "Delridge": { lat: 47.537796, lng: -122.355200},
    "West Seattle": { lat: 47.570165, lng: -122.387439},
    "South Park": { lat: 47.527776, lng: -122.325293},
    "Seward Park": { lat: 47.551145, lng: -122.265555},
    "Rainier Beach": { lat: 47.513288, lng: -122.259159},
};

$(document).on('click', '.nHood', function() {
    let neighborhood = $(this).attr('name');
    console.log(neighborhood);

    $('.nHood').toggle();
    $('#mapContainer').toggle();

    newNeighborhood(neighborhood);
    // Build google map with selected neighborhood
})

$(document).on('click', '#pickAnother', function() {
    $('#mapContainer').toggle();
    $('.nHood').toggle();
})

// Returns an array of coordinate bounds for the matching neighborhood string
function getCoordinates(district) {
    let indeces = [];
    for (let i = 0; i < neighborhoods.features.length; i++) {
        if (neighborhoods.features[i].id.includes(district)) {
            indeces.push(
                formatCoordinates(neighborhoods.features[i].geometry.coordinates[0])
            );
        }
    }
    return indeces;
}

// Formats input coordinate array into latitude/longitude objects
function formatCoordinates(coords) {
    let formattedCoords = [];

    for (let coord of coords) {
        formattedCoords.push({lat: coord[1], lng: coord[0]});
    }

    return formattedCoords;
}

// Initiates Google Map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.605877, lng: -122.329723},
        zoom: 11,
    });

    // On click, logs true for inside the neighborhood, false for outside
    // This will be changed away from a 'click' function eventually
    google.maps.event.addListener(map, 'click', function(e) {
        let inHood = false;
        for (let i = 0; i < subHoods.length; i++) {
            if (google.maps.geometry.poly.containsLocation(e.latLng, subHoods[i])) {
                inHood = true;
            }
        }
        console.log(inHood);
    })
}

// changes Map display to input neighborhood
function newNeighborhood(name) {
    map.setZoom(13);
    map.setCenter(nHoodsLocations[name]);

    for (let i = 0; i < subHoods.length; i++) {
        subHoods[i].setMap(null);
    }

    let formattedCoords = getCoordinates(name);

    subHoods = [];
    for (let i = 0; i < formattedCoords.length; i++) {
        subHoods.push(
            new google.maps.Polygon({
                paths: formattedCoords[i],
                clickable: false,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0
            })
        )
        subHoods[i].setMap(map);
    }
}