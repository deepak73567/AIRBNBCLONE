
   

    mapboxgl.accessToken = mapToken;

// Assuming coordinates is an array containing [longitude, latitude]


const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/mapbox/streets-v12',
    center: listing.geometry.coordinates,
    zoom: 9
});


const marker = new mapboxgl.Marker({ color: 'black' })
    .setLngLat(listing.geometry.coordinates)
    .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h4>${listing.location}</h4><p>Exact Location after booking</p>`))
    .addTo(map);
