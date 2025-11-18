// ____________________________  ZOOM-IN MAP ELEMENTS  ____________________________  

    
    function showPopup(id) {
        document.getElementById(id).style.display = 'block';
    }
    function hidePopup(id) {
        document.getElementById(id).style.display = 'none';
    }
    // Hide zoomin-text only on mobile and tablet
    if (window.innerWidth < 1024) {
        document.getElementById('zoomin-text').style.display = 'none';
    }
    // Hide legend_mobile on page load
    document.getElementById('legend_mobile').style.display = 'none';

    // Open popups
    document.getElementById('toggle-info').addEventListener('click', () => {
        hidePopup('people-text');
        hidePopup('legend_mobile');
        showPopup('zoomin-text');
    });
    document.getElementById('toggle-people').addEventListener('click', () => {
        hidePopup('zoomin-text');
        hidePopup('legend_mobile');
        showPopup('people-text');
    });
    
    //LEGEND BUTTON ON MOBILE
    document.getElementById('legend-toggle').addEventListener('click', function () {
        const legend = document.getElementById('legend_mobile');
        legend.style.display = 'block';
        hidePopup('people-text');
        hidePopup('zoomin-text');
    });

    // Close popups 
    document.querySelector('#zoomin-text .close-btn').addEventListener('click', () => {
        hidePopup('zoomin-text');
    });
    document.querySelector('#people-text .close-btn').addEventListener('click', () => {
        hidePopup('people-text');
    });
    document.querySelector('#legend_close').addEventListener('click', () => {
        hidePopup('legend_mobile');
    });

    // Close popups when clicking anywhere on the map
    map.on('click', () => {
        hidePopup('zoomin-text');
        hidePopup('people-text');
    });

    function showZoominUI() {

    const zoominText = document.getElementById('zoomin-text');
    // Only show zoomin-text if not on mobile or tablet
    if (window.innerWidth >= 1024) {
        zoominText.style.display = 'block';
    }
    else{
    //INFO BUTTON
    zoominText.style.display = 'none';}
    toggleBtn.style.display = "block";
    //PEOPLE BUTTON
    togglePpl.style.display = "block";
    }

    function hideZoominUI() {
    zoominText.style.display = 'none'; // Hide the text
    toggleBtn.style.display = "none";   // Hide the toggle button
    }

    //map data load
    $(document).ready(function () {
        $.ajax({
        type: "GET",
        url:'../assets/videos.csv',
        dataType: "text",
        success: function (csvData) { makeGeoJSON(csvData); }
        });


function makeGeoJSON(csvData) {
        csv2geojson.csv2geojson(csvData, {
            latfield: 'Latitude',
            lonfield: 'Longitude',
            delimiter: ','
        }, function (err, data) {
            
            map.on('load', function () {
                
            map.addLayer({
                'id': 'csvData',
                'type': 'circle',
                'source': {
                    'type': 'geojson',
                    'data': data
                },
                'paint': {
                    'circle-radius': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        5, 2,      // zoom level 5 → radius 2px
                        10, 7,     // zoom level 10 → radius 7px
                        15, 10,     // zoom level 15 → radius 10px
                        18, 25     // zoom level 18 → radius 25px
                    ],
                    'circle-color': '#EB6047',
                    'circle-opacity': 1
                }
            });

            // When a click event occurs on a feature in the csvData layer, open a popup at the
            // location of the feature, with description HTML from its properties.
            
            map.on('click', 'csvData', function (e) {
                var coordinates = e.features[0].geometry.coordinates.slice();
                var description =  `<div class="popup-container">
                                    <div class="video">
                                        <div class="video-wrapper" style="padding-bottom:` + e.features[0].properties.padding + `">
                                            <div style="width:100%;">                                            
                                            <iframe width="100%" height="100%" 
                                            src="https://www.youtube.com/embed/` + e.features[0].properties.videoID + 
                                            `?autoplay=1&modestbranding=1&showinfo=0&modestbranding=1&rel=0&color=white&iv_load_policy=3&loop=1&playlist=` + e.features[0].properties.videoID + e.features[0].properties.subtitles + 
                                            `"frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                                            allowfullscreen></iframe>   
                                            </div>
                                        </div>
                                    </div>`
                                + `<div class="text">
                                    <h2>` + e.features[0].properties.title + `</h2>`
                                +   `<p>` + e.features[0].properties.description + `</p>
                                  </div></div>`;
                
                // Center Popup on mobile and tablet
                if (window.innerWidth < 1024) {
                    map.easeTo({
                        center: coordinates,
                        zoom: Math.max(map.getZoom(), 16),
                        offset: [0, 200]
                    });
                }                
                while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                    coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
                }     
                //add Popup to map
                new mapboxgl.Popup()
                .setLngLat(coordinates)
                .setHTML(description)
                .addTo(map);
            }); 
            });
            
            // ADDING ICONS AND TEXTS TO THE MAP
            
            // 1. ENTRANCE ICON
                map.loadImage('../assets/entrance.png', function(error, image) {
                if (error) throw error;
                if (!map.hasImage('custom-icon')) {
                    map.addImage('custom-icon', image);
                }

                map.addLayer({
                    id: 'entrance',
                    type: 'symbol',
                    source: {
                    type: 'geojson',
                    data: {
                        type: 'FeatureCollection',
                        features: [
                        {
                            type: 'Feature',
                            geometry: {
                            type: 'Point',
                            coordinates: [36.019773, 32.499620]       
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                            type: 'Point',
                            coordinates: [36.022815, 32.497503]
                            }
                        },
                        {
                            type: 'Feature',
                            geometry: {
                            type: 'Point',
                            coordinates: [36.0382478, 32.5075051]
                            }
                        }
                        ]
                    }
                    },
                    layout: {
                    'icon-image': 'custom-icon',
                    'icon-size': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],     // zoom level 5 → radius 2px
                        6, 0.1,     // zoom level 10 → radius 7px
                        15, 0.25,     // zoom level 15 → radius 10px
                        18, 0.7    // zoom level 18 → radius 25px
                    ],
                    'icon-allow-overlap': true
                    }
                });
                });
            // 1. END

            // 2. PLACE LABELS

            const placeLabels = {
            type: 'FeatureCollection',
            features: [
                { type: 'Feature', properties: { title: 'The Main\nEntrance', "anchor": "top", "offset": [0, 3]}, geometry: { type: 'Point', coordinates: [36.0201, 32.4999] }},
                { type: 'Feature', properties: { title: 'Poultry traders', "anchor": "top-left", "offset": [1, -1]}, geometry: { type: 'Point', coordinates: [36.0241472, 32.5055748] }},
                { type: 'Feature', properties: { title: 'Fish vendors', "anchor": "top", "offset": [0, -2.5]}, geometry: { type: 'Point', coordinates: [36.0253275, 32.5062520] }},
                { type: 'Feature', properties: { title: 'Clothing and beauty salon', "anchor": "top", "offset": [0, -3.5]}, geometry: { type: 'Point', coordinates: [36.0217374, 32.5054057] }},
                { type: 'Feature', properties: { title: 'Phase II Market', "anchor": "right", "offset": [-1, 0]}, geometry: { type: 'Point', coordinates: [36.0183840, 32.5048516] }},
                { type: 'Feature', properties: { title: 'The Warehouse Quarter', "anchor": "top-left", "offset": [0, -2.2]}, geometry: { type: 'Point', coordinates: [36.032564, 32.506582] }},
                { type: 'Feature', properties: { title: 'Money Transfer Office', "anchor": "top-left", "offset": [-0.5, -2.5]}, geometry: { type: 'Point', coordinates: [36.0211240, 32.4997588] }},
                { type: 'Feature', properties: { title: 'Workers’ Centre', "anchor": "top", "offset": [0, 1]}, geometry: { type: 'Point', coordinates: [36.0295716, 32.5051489] }},
                { type: 'Feature', properties: { title: 'The Factory Canteen', "anchor": "top-left", "offset": [0, -2.2]}, geometry: { type: 'Point', coordinates: [36.0259886, 32.4999871] }},
                { type: 'Feature', properties: { title: 'End of\nFactory Shifts', "anchor": "left", "offset": [1, 0]}, geometry: { type: 'Point', coordinates: [36.0236333, 32.5029417] }},
                { type: 'Feature', properties: { title: 'Rubina Hostels', "anchor": "right", "offset": [-1, 0]}, geometry: { type: 'Point', coordinates: [36.0192351, 32.4935061] }},
                { type: 'Feature', properties: { title: 'The Dormitory', "anchor": "top-left", "offset": [1, -0.5]}, geometry: { type: 'Point', coordinates: [36.0244020, 32.4961195] }},
                { type: 'Feature', properties: { title: 'Subcontracting Factory', "anchor": "top-left", "offset": [-0.5, -2.5]}, geometry: { type: 'Point', coordinates: [36.0233175, 32.4983430] }},
                { type: 'Feature', properties: { title: 'Exporting Factory', "anchor": "top", "offset": [0, -2.5]}, geometry: { type: 'Point', coordinates: [36.0299977, 32.4948314] }},
                { type: 'Feature', properties: { title: 'Crossing    the Wall', "anchor": "right", "offset": [-0.5, -2]}, geometry: { type: 'Point', coordinates: [36.0280514, 32.507] }}
            ]
            };

            map.addSource('place-labels', {
            type: 'geojson',
            data: placeLabels
            });

            map.addLayer({
            id: 'place-labels',
            type: 'symbol',
            source: 'place-labels',
            minzoom: 15,
            maxzoom: 20,
            layout: {
                'text-field': ['get', 'title'],
                'text-font': ['Source Code Pro Semibold'],
                'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                15, 16,
                18, 23
                ],
            'text-anchor': ['get', 'anchor'],
            'text-offset': ['get', 'offset'],
            },
            paint: {
            'text-color': '#000000',
            'text-halo-color': '#ffffff',
            'text-halo-width': 3,
            'text-halo-blur': 5
            }
            });
            // 2. END

            // 3. CRICKET LABEL
            map.addSource('cricket-label', {
            type: 'geojson',
            data: {
                type: 'FeatureCollection',
                features: [{type: 'Feature', properties: {name: 'Cricket\nPitch'}, geometry: {type: 'Point', coordinates: [36.019614, 32.505617]}}
                ]
            }
            });

            map.addLayer({
            id: 'cricket-label-layer',
            type: 'symbol',
            source: 'cricket-label',
            layout: {
                'text-field': ['get', 'name'],
                'text-font': ['Source Code Pro Light'],
                'text-size': [
                'interpolate',
                ['linear'],
                ['zoom'],
                14.5, 15,
                18, 27
                ],
                'text-anchor': 'center',
                'text-offset': [0, 0]
            },
            paint: {
                'text-color': '#000'
            },
            minzoom: 15,
            maxzoom: 20
            });
        });
        };    
    });
        
    // ZOOM
        map.addControl(new mapboxgl.NavigationControl(), 'top-right'); 

        document.getElementById("custom-zoom-in").addEventListener("click", () => {
        map.zoomIn();
        });

        document.getElementById("custom-zoom-out").addEventListener("click", () => {
        map.zoomOut();
        });

//   ____________________________  END ZOOM-IN MAP ELEMENTS  ____________________________  