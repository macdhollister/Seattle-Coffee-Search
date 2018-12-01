let map;
let subHoods = [];
let mapMarkers = [];
let businessData = {};
const nHoodsLocations = {
    "Northgate" : {lat: 47.708142 , lng: -122.327329},
    "Lake City": { lat: 47.717412, lng: -122.296243},
    "Greenwood": { lat: 47.690768, lng: -122.355337},
    "Roosevelt": { lat: 47.677311, lng: -122.317383},
    "Ravenna": { lat: 47.675796, lng: -122.306529},
    "Sandpoint": { lat: 47.681558, lng: -122.262278},
    "Ballard": { lat: 47.675965, lng: -122.379027},
    "Green Lake": { lat: 47.679638, lng: -122.334963},
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
    "Madison Park": { lat: 47.632587, lng: -122.291663},
    "Central District": { lat: 47.604304, lng: -122.302240},
    "Belltown": { lat: 47.615330, lng: -122.343963},
    "Downtown": { lat: 47.610372, lng: -122.336615},
    "Pioneer Square": { lat: 47.601144, lng: -122.332315},
    "International District": { lat: 47.597484, lng: -122.323778},
    "Sodo": { lat: 47.580476, lng: -122.334284},
    "Beacon Hill": { lat: 47.565133, lng: -122.311002},
    "Mount Baker": { lat: 47.578270, lng: -122.288029},
    "Columbia City": { lat: 47.559462, lng: -122.285971},
    "Georgetown": { lat: 47.546533, lng: -122.325232},
    "Rainier Valley": { lat: 47.536876, lng: -122.270445},
    "Delridge": { lat: 47.537796, lng: -122.355200},
    "West Seattle": { lat: 47.570165, lng: -122.387439},
    "South Park": { lat: 47.527776, lng: -122.325293},
    "Seward Park": { lat: 47.551145, lng: -122.265555},
    "Rainier Beach": { lat: 47.513288, lng: -122.259159},
    "Laurelhurst": { lat: 47.658700, lng: -122.279306},
    "Mount Baker": { lat: 47.583333, lng: -122.292917},
    "Admiral": { lat: 47.581194, lng:  -122.387151},
    "Alki": { lat: 47.575856, lng: -122.410591},
    "Fauntleroy": { lat: 47.523843, lng: -122.383132},
    "Junction": { lat: 47.561231, lng: -122.386808},
    "Madison Valley": { lat: 47.623325, lng: -122.296425},
    "Leschi": { lat: 47.599431, lng: -122.292540},
    "Madrona": { lat: 47.613299, lng: -122.289294},
    "First Hill": { lat: 47.609045, lng: -122.325034},
    "Denny-Blaine": { lat: 47.622426, lng: -122.285820},
    "Portage Bay": { lat: 47.648145, lng: -122.314553},
    "Blue Ridge": { lat: 47.699654, lng: -122.387422},
    "Crown Hill": { lat: 47.696849, lng: -122.371896},
    "Haller Lake": { lat: 47.719854, lng: -122.333871},
    "Lower Queen Anne": { lat: 47.623560, lng: -122.355767},
    "Westlake": { lat: 47.631750, lng: -122.341028},
    "Wedgwood": { lat: 47.691076, lng: -122.290732},
    "Maple Leaf": { lat: 47.695884, lng: -122.317588},
};

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 47.605877, lng: -122.329723},
        zoom: 11,
    });

    $(document).on('click touchstart', '.nHood', function() {
        let neighborhood = $(this).attr('name');
        console.log(neighborhood);
        removeMarkers();

        $('.nHood').toggle();
        $('#mapContainer').toggle();

        // Builds Map around selected neighborhood
        newNeighborhood(neighborhood);

        // Ajax call for getting data
        let lat = nHoodsLocations[neighborhood].lat;
        let lon = nHoodsLocations[neighborhood].lng;
        let queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=coffee&latitude=" + lat + "&longitude=" + lon + "&limit=50&sort_by=distance&radius=6440";

        $.ajax({
            url: queryURL,
            headers: {
                'Authorization': 'Bearer wserwb2f6DkPSrPHIvgg7Oai3KdprWqcORgEt_muTJl3rR_Dg12fU4vGUmQr5ANy1enRZsdBYV_Q8SQO1Mup_zPFjuwRqXyuXxEU_etmk4E3leNnxAEw5WdMXEvuW3Yx',
            },
            method: "GET",
        })
        .then(function (response) {
            for (let i = 0; i < response.businesses.length; i++) {
                let name = response.businesses[i].name;
                let rating = response.businesses[i].rating;
                let phone = response.businesses[i].phone;
                let address = response.businesses[i].location.address1;
                let foto = response.businesses[i].image_url;
                let closed = response.businesses[i].is_closed;
                let lat = response.businesses[i].coordinates.latitude;
                let lng = response.businesses[i].coordinates.longitude;
                let businessID = response.businesses[i].id;
                // let pic = response.business[i].photos[0];
                // console.log(pic);

                businessData[businessID] = {
                    ID : businessID,
                    name : name,
                    address : address,
                    yelpRating : rating,
                    phone : phone,
                    imageURL : foto,
                    isClosed : closed,
                    coordinates : {
                        lat: lat,
                        lng: lng
                    }
                }

                addMarker(businessData[businessID]);
            }
        });
    })

    // Checks if the given coordinates are inside the current neighborhood
    function inNeighborhood(coords) {
        let inHood = false;
        for (let i = 0; i < subHoods.length; i++) {
            if (google.maps.geometry.poly.containsLocation(coords, subHoods[i])) {
                inHood = true;
            }
        }

        return inHood;
    }

    google.maps.event.addListener(map, 'click', function(e) {
        let lat = e.latLng.lat();
        let lon = e.latLng.lng();
        console.log(lat, lon)
        let queryURL = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=coffee&latitude=" + lat + "&longitude=" + lon + "&limit=50&sort_by=distance&radius=6440";

        console.log(inNeighborhood(e.latLng));

        $.ajax({
            url: queryURL,
            headers: {
                'Authorization': 'Bearer wserwb2f6DkPSrPHIvgg7Oai3KdprWqcORgEt_muTJl3rR_Dg12fU4vGUmQr5ANy1enRZsdBYV_Q8SQO1Mup_zPFjuwRqXyuXxEU_etmk4E3leNnxAEw5WdMXEvuW3Yx',
            },
            method: "GET",
        })
        .then(function (response) {
            for (let i = 0; i < response.businesses.length; i++) {
                let name = response.businesses[i].name;
                let rating = response.businesses[i].rating;
                let phone = response.businesses[i].phone;
                let address = response.businesses[i].location.address1;
                let foto = response.businesses[i].image_url;
                let closed = response.businesses[i].is_closed;
                let lat = response.businesses[i].coordinates.latitude;
                let lng = response.businesses[i].coordinates.longitude;
                let businessID = response.businesses[i].id;

                businessData[businessID] = {
                    name : name,
                    address : address,
                    yelpRating : rating,
                    phone : phone,
                    imageURL : foto,
                    isClosed : closed,
                    coordinates : {
                        lat: lat,
                        lng: lng
                    }
                }

                addMarker(businessData[businessID]);
            }
        });
    })

    $(document).on('click', '#pickAnother', function() {
        $('#mapContainer').toggle();
        $('.nHood').toggle();
    })

    // Checks if the given coordinates are inside the current neighborhood
    function inNeighborhood(coords) {
        let inHood = false;
        for (let i = 0; i < subHoods.length; i++) {
            if (google.maps.geometry.poly.containsLocation(coords, subHoods[i])) {
                inHood = true;
            }
        }

        return inHood;
    }
}

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

// Adds a pushpin onto the map takes a {lat: num, lng: num2} object
function addMarker(business) {
    var marker = new google.maps.Marker({
        position:business.coordinates,
        map:map,
    });

    var infoWindow = new google.maps.InfoWindow({
        maxWidth: 180,
        content: `
        <div><strong>${business.name}</strong></div>
        <div>Rating: ${business.yelpRating}</div>
        <div>Address: ${business.address}</div>
        <div>Phone Number: ${business.phone}</div>
        <img class="businessImg" src="${business.imageURL}">
        <div data-ID="${business.ID}"></div>
        `
    })

    marker.addListener('click', function() {
        infoWindow.open(map, marker);
    });

    mapMarkers.push(marker);
}

// Removes all pushpins from the map
function removeMarkers() {
    for (let marker of mapMarkers) {
        marker.setMap(null);
    }

    mapMarkers = [];
}
