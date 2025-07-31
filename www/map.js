let map;
let centerCordinates = { lat: 35.455851, lng: 139.35875 };
let placeTitle = "displayName";
async function initMap(op) {
    const { Map } = await google.maps.importLibrary("maps");
    //centerCordinates = { lat: 37.4161493, lng: -122.0812166 };
    map = new Map(document.getElementById('map'), {
        center: centerCordinates,
        zoom: 16,
        mapId: 'DEMO_MAP_ID',
    });
    switch (op) {
        case 1: findPlaces();
        case 2: getPlaceDetails();
    }
}


async function findPlaces() {
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    const request = {
        textQuery: document.getElementById('keyWord').value,
        fields: ['displayName', 'location', 'formattedAddress', 'addressComponents'],
        //includedType: 'restaurant',
        //locationBias: { lat: 37.4161493, lng: -122.0812166 },
        //isOpenNow: true,
        language: 'ja',
        maxResultCount: 3,
        minRating: 3.2,
        region: 'jp',
        useStrictTypeFiltering: false,
    };
    //@ts-ignore
    //request.textQuery = prompt("enter key word");
    const { places } = await Place.searchByText(request);
    if (places.length) {
        console.log(places);
        const { LatLngBounds } = await google.maps.importLibrary("core");
        const bounds = new LatLngBounds();
        // Loop through and get all the results.
        places.forEach((place) => {
            const markerView = new AdvancedMarkerElement({
                map,
                position: place.location,
                title: place.displayName,
            });
            bounds.extend(place.location);
            let form = document.forms["createUser"];
            let value = place.displayName;
            console.log(value);
            document.getElementById("poiNameInputId").value = value;
            form.elements["poiName"].value = value;
            value = place.location.lat();
            value = Math.round(value * 1000000) / 1000000;
            console.log(value);
            form.elements["latitude"].value = value;
            value = place.location.lng();
            value = Math.round(value * 1000000) / 1000000;
            console.log(value);
            form.elements["longtitude"].value = value;
            let length = place.addressComponents.length;
            value = place.addressComponents[length - 1].Eg;
            console.log(value);
            form.elements["zip"].value = value;
            value = place.addressComponents[length - 3].Eg;
            console.log(value);
            form.elements["address1"].value = value;
            value = place.addressComponents[length - 4].Eg;
            console.log(value);
            form.elements["address2"].value = value;
            value = place.addressComponents[length - 5].Eg;
            console.log(value);
            form.elements["address3"].value = value;
            document.getElementById("addressInputId").value = place.formattedAddress;

        });
        map.fitBounds(bounds);
        map.setZoom(18);
    }
    else {
        alert('No results');
    }
}
//initMap();

//let centerCoordinates = { lat: 37.4161493, lng: -122.0812166 };
/*
async function initMap2() {
    const { Map } = await google.maps.importLibrary("maps");
    map = new Map(document.getElementById('map'), {
        center: centerCoordinates,
        zoom: 14,
        // ...
    });
    getPlaceDetails();
}
*/

async function getPlaceDetails() {
    const { Place } = await google.maps.importLibrary("places");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    /*
    // Use place ID to create a new Place instance.
    const place = new Place({
        id: 'ChIJ-ZTr7QQAGWARHbjixokJelo',
        requestedLanguage: 'ja', // optional
    });
    // Call fetchFields, passing the desired data fields.
    await place.fetchFields({ fields: ['displayName', 'formattedAddress', 'location'] });
    // Log the result
    console.log(place.displayName);
    console.log(place.formattedAddress);
    */
    // Add an Advanced Marker
    const marker = new AdvancedMarkerElement({
        map,
        position: centerCordinates,
        title: placeTitle,
    });
}

function showPlace(elem) {
    console.log("showPlace()");
    let lat = Number(elem.parentElement.parentElement.children[3].innerText);
    let lng = Number(elem.parentElement.parentElement.children[4].innerText);
    centerCordinates.lat = lat;
    centerCordinates.lng = lng;
    placeTitle = elem.parentElement.parentElement.children[2].innerText;
    initMap(2);
}