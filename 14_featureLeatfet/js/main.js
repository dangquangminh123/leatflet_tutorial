var myMap;
var lyrOSM;
var lyrOpenTopoMap;
var lyrWorldImagery;
var baseLayers;
var overlays;
var lyrFields;
var mrkField;
var lineField;
var polyField;
var fgLayer;

var mrkCurrentLocation;
var popMinarEPakistan;
var ctlPan;
var ctlZoomSlider;
var ctlMousePosition;
var ctlMeasure;
var ctlEasyButton;
var ctlSidebar;

$(document).ready(function () {

    // create map object

    myMap = L.map('map_div',{center: [29.66542,72.63678], zoom:13, zoomControl: false});
    


    //basemap layers
    // add basemap layer
    //lyrOSM = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
    lyrOSM = L.tileLayer.provider('OpenStreetMap.Mapnik');
    lyrOpenTopoMap = L.tileLayer.provider('OpenTopoMap');
    lyrWorldImagery = L.tileLayer.provider('Esri.WorldImagery');
    myMap.addLayer(lyrWorldImagery);

    //add image overlays
    lyrFields = L.imageOverlay('img/fields.png', [[29.66542,72.63678],[29.66328,72.64834]], {opacity: 0.6}).addTo(myMap);

    var latlngs = [
        [
            [29.66534,72.64021],
            [29.66535,72.63819],
            [29.66376,72.63817],
            [29.66372,72.63749],
            [29.66352,72.63749],
            [29.66352,72.63749],
            [29.66353,72.63713]
        ],
        [
            [29.66536,72.63683],
            [29.66373,72.63681],
            [29.66372,72.63714],
            [29.66353,72.63713]
        ]
    ];

    //polygon
    polyField =  L.polygon([[[29.66536,72.63683],[29.66322,72.63681],[29.66324,72.64023],[29.66534,72.64023]],[[29.66403,72.63885],[29.66401,72.6395],[29.66373,72.63949],[29.66374,72.63885]]],
        {color:"red" , fillColor:"yellow", fillOpacity:0.6}).addTo(myMap);
    
    //polyline
    lineField = L.polyline(latlngs, {color: 'blue', weight: 5}).addTo(myMap);

    //Point
    mrkField = L.marker([29.66350,72.63713], {draggable:true});
    mrkField.bindTooltip('Field No. 6');

    fgLayer = L.featureGroup([polyField, lineField]).bindPopup('Hello World').addTo(myMap);

    baseLayers = {
        "OpenStreetMap": lyrOSM,
        "OpenTopoMap": lyrOpenTopoMap,
        "Esri.WorldImagery": lyrWorldImagery
    };
    
    overlays = {
        // "OpenStreetMap": lyrOSM,
        // "OpenTopoMap": lyrOpenTopoMap,
        // "Esri.WorldImagery": lyrWorldImagery,
        "FieldsData": fgLayer
    };
    
    L.control.layers(baseLayers, overlays).addTo(myMap);

    //plugin
    ctlPan = L.control.pan().addTo(myMap);
    ctlZoomSlider = L.control.zoomslider({position: 'topright'}).addTo(myMap);
    ctlMousePosition = L.control.mousePosition().addTo(myMap);
    ctlMeasure = L.control.polylineMeasure().addTo(myMap);

    ctlSidebar = L.control.sidebar('side-bar').addTo(myMap);
    ctlEasyButton = L.easyButton('fa-exchange', function () {
        ctlSidebar.toggle();
    }).addTo(myMap);

    // popup for minar e pakistan
    popMinarEPakistan = L.popup();
    popMinarEPakistan.setLatLng([31.59248, 74.38966]);
    popMinarEPakistan.setContent("<h2>Minar E pakistan</h2>"+"<img src='img/minar-e-pakistan.jpg' width='300px' />");
    //popMinarEPakistan.openOp(myMap);
    // event handler on left click
    // myMap.on('click' , function (e) {
    //     alert(e.latlng.toString());
    //     alert(myMap.getZoom());
    // });

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

    //set opacity on image
    $('#change_opacity').on('change', function () {
        $('#img_opacity_display').html(this.value);
        lyrFields.setOpacity(this.value);
    })

    mrkField.on('dragend', function () {
        mrkField.setTooltipContent('Current Location:' + mrkField.getLatLng().toString());
    })

    $('#go_to_backFieldSix').click(function () {
        myMap.setView([29.66542,72.63678], 17);
        mrkField.setLatLng([29.66542,72.63678]);
        mrkField.setTooltipContent('Welcome back to Field Six');
    })

    $('#go_to_line_field').click(function () {
        myMap.fitBounds(lineField.getBounds());
    })

    $('#add_point_id').click(function () {
        if(fgLayer.hasLayer(mrkField)) {
            fgLayer.removeLayer(mrkField);
            $('#add_point_id').html('Add Marker to Layer Group');
        }
        else {
            fgLayer.addLayer(mrkField);
            $('#add_point_id').html('Remove Marker from Layer Group');
        }
    });

    $('#setstyle_id').click(function () {
        fgLayer.setStyle({color: 'green', fillColor: 'red', fillOpacity: 0.9});
    })


    //custom functions
    function lat_lng_to_string(ll) {
        return "[" +ll.lat.toFixed(5)+","+ll.lng.toFixed(5)+"]";
    }
})
