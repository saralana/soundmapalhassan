//  ____________________________  MAPS 1ST SETUPS  ____________________________  
var geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    mapboxgl: mapboxgl
});

var transformRequest = (url, resourceType) => {
    var isMapboxRequest =
    url.slice(8, 22) === "api.mapbox.com" ||
    url.slice(10, 26) === "tiles.mapbox.com";
    return {
    url: isMapboxRequest
        ? url.replace("?", "?pluginName=sheetMapper&")
        : url
    };
};
          
mapboxgl.accessToken = 'pk.eyJ1Ijoic2FyYWxnYyIsImEiOiJja2NjbTAyczkwNXA3Mnlscm5nbjN5OHZiIn0.yNcJkPBSugRlIeGkXDRlZw'; //Mapbox token 

//define the same zoom intro for both maps
let zoom_intro;
let center_intro;

//check if screen is super wide
const aspectRatio = window.innerWidth / window.innerHeight;
if (aspectRatio > 2) { 
    zoom_intro = 8;
    center_intro = [36.3,32.2]; 
} 
//otherwise define other zoom and center
else {
    if (window.innerWidth < 1024) { 
        zoom_intro = 7.7;
        center_intro = [36, 32.5]; 
    } else if (window.innerWidth < 1400) {
        zoom_intro = 6.4;
        center_intro = [37.1,31.3]; 
    } else if (window.innerWidth < 1600) {
        zoom_intro = 6.8;
        center_intro = [37.1,31.3]; 
    } else {
        zoom_intro = 7.7;
        center_intro = [37.1,31.3]; 
    }   
}


//define zoom in and the speed of flyTo animations
let zoom;
let speed;
if (window.innerWidth < 1024) { // mobile and tablet
    zoom = 14.2; speed = 32.5;
} else if (window.innerWidth < 1600) { // Notebooks
    zoom = 14.5; speed = 4.5;
} else { // Desktops
    zoom = 15.2; speed = 35.5;
}

// detect if is mobile width ≤ 600px
const isMobile = window.matchMedia("(max-width: 1024px)").matches;

// bounds zoom out map
const zoomoutBounds = [
    [32.959, 29.185], // southwest corner
    [41.8, 33.378]  // northeast corner
];

// Map 1 - zoom out style - map_zoomout
const map_zoomout = new mapboxgl.Map({
    container: 'map_zoomout',
    style: 'mapbox://styles/saralgc/cme6yvb7r00rp01sc7fti6e9h',
    center: center_intro,
    zoom: zoom_intro,
    maxBounds: zoomoutBounds,
    interactive: true
});


map_zoomout.scrollZoom.disable();       // disable mouse wheel zoom
map_zoomout.boxZoom.disable();          // disable box zoom
map_zoomout.doubleClickZoom.disable();  // disable double click zoom
map_zoomout.touchZoomRotate.disable();  // disable pinch zoom & rotate
map_zoomout.dragPan.enable();    


// Map 2 - zoom in style - map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/saralgc/cma8ug1iu00i201s3ck8y339n',
    center: [37.1,31.4],
    zoom: zoom_intro,
    maxZoom: 19,
}); 

// bounds zoom in map
const bounds = [
    [35.99145 , 32.485],// lng, lat Southwest coordinates
    [36.06145, 32.515] // lng, lat Northeast coordinates
];

//  ____________________________  END OF MAPS 1ST SETUPS  ____________________________ 

//   ____________________________  ELEMENTS ON BOTH MAPS  ____________________________ 

// Add scale control to the map
const scale = new mapboxgl.ScaleControl({
    maxWidth: 100,
    unit: 'metric' 
});
map.addControl(scale);

// Change the cursor to a pointer when the mouse is over the places layer.
map.on('mouseenter', 'csvData', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// Change it back to a pointer when it leaves.
map.on('mouseleave', 'csvData', () => {
    map.getCanvas().style.cursor = '';
});

//   ____________________________  END OFELEMENTS ON BOTH MAPS  ____________________________ 