var myMap;
var lyrOSM;
var mrkCurrentLocation;
var popMinarEPakistan;
var ctlPan;
var ctlZoomSlider;

$(document).ready(function () {

    // create map object

    myMap = L.map('map_div',{center: [31.59261, 74.31008], zoom:13, zoomControl: false});

    // add basemap layer
    lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

    myMap.addLayer(lyrOSM);

    ctlPan = L.control.pan().addTo(myMap);
    ctlZoomSlider = L.control.zoomslider({position: 'topright'}).addTo(myMap);
    // popup for minar e pakistan
    popMinarEPakistan = L.popup();
    popMinarEPakistan.setLatLng([31.59248, 74.38966]);
    popMinarEPakistan.setContent("<h2>Minar E pakistan</h2>"+"<img src='img/minar-e-pakistan.jpg' width='300px' />");
    //popMinarEPakistan.openOp(myMap);
    // event handler on left click
    myMap.on('click' , function (e) {
        alert(e.latlng.toString());
        alert(myMap.getZoom());
    });

    // right click
    myMap.on('contextmenu', function (e) {
        L.marker(e.latlng).addTo(myMap).bindPopup(e.latlng.toString());
    })


    //call locate method
    myMap.on('keypress', function (e) {
        if(e.originalEvent.key = 'l'){
            myMap.locate();
        }
    });

    myMap.on('locationfound', function (e) {

        if(mrkCurrentLocation) {
            mrkCurrentLocation.remove();
        }
        mrkCurrentLocation = L.circleMarker(e.latlng).addTo(myMap);
        myMap.setView(e.latlng, 14);
    });

    myMap.on('locationerror', function (e) {
        alert("location was not found");
    });

    $('#get_user_location_id').click(function () {
        myMap.locate();
    });

    $('#go_to_id').click(function () {
        myMap.setView([31.59261, 74.31008], 18);
        myMap.openPopup(popMinarEPakistan);
    });

    //Zoom level
    myMap.on('zoomend', function () {
        // document.getElementById(elementld, 'zoom_level_id').innerHTML = 'minh'
        $("#zoom_level_id").html(myMap.getZoom());
    })

    //get map center
    myMap.on('moveend', function () {
        $('#map_center_id').html(lat_lng_to_string(myMap.getCenter()));
    })

    //get mouse location
    myMap.on('mousemove', function (e) {
        $('#mouse_location_id').html(lat_lng_to_string(e.latlng));
    })

    //custom functions
    function lat_lng_to_string(ll) {
        return "[" +ll.lat.toFixed(5)+","+ll.lng.toFixed(5)+"]";
    }
})
