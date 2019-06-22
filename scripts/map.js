//Global Variables
var vectorLayer;
var geojsonObject; 
var isMark = false;

var image = new ol.style.Circle({
  radius: 5,
  fill: null,
  stroke: new ol.style.Stroke({color: 'black', width: 1})
});

// Styles for drawing routes.
var styles = {
  'Point': new ol.style.Style({
    image: image
  }),
  'LineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 3
    })
  }),
  'MultiLineString': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 1
    })
  }),
  'MultiPoint': new ol.style.Style({
    image: image
  }),
  'MultiPolygon': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 1
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255, 255, 0, 0.1)'
    })
  }),
  'Polygon': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      lineDash: [4],
      width: 3
    }),
    fill: new ol.style.Fill({
      color: 'rgba(0, 0, 255, 0.1)'
    })
  }),
  'GeometryCollection': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'black'
    }),
    image: new ol.style.Circle({
      radius: 10,
      fill: null,
      stroke: new ol.style.Stroke({
        color: 'black'
      })
    })
  }),
  'Circle': new ol.style.Style({
    stroke: new ol.style.Stroke({
      color: 'black',
      width: 2
    }),
    fill: new ol.style.Fill({
      color: 'rgba(255,0,0,0.2)'
    })
  })
};

// Sample GPX Route.
var vector = new ol.layer.Vector({
  source: new ol.source.Vector({
    url: 'https://openlayers.org/en/v4.6.5/examples/data/gpx/fells_loop.gpx',
    format: new ol.format.GPX()
  }),
  style: function(feature) {
    return styles[feature.getGeometry().getType()];
  }
});

// Different options to centre the map onload.
var malahideSwords = ol.proj.transform([-6.219193, 53.460342], 'EPSG:4326', 'EPSG:3857');
var dublin = ol.proj.transform([-6.25832, 53.34786],'EPSG:4326', 'EPSG:3857');

// Center View on Dublin.
var view = new ol.View({
  //Not translated co-ordinates example.
  //center: [-7916041.528716288, 5228379.045749711],
  center: dublin,
  zoom: 11
});

//Setting inital layers.
/*var baselayer = new ol.layer.Tile({source: new ol.source.OSM(
	url: "../../../hot/{z}/{x}/{y}.png"
	}
)});*/
var baselayer = new ol.layer.Tile({source: new ol.source.OSM()});
var vectorLayer2 = new ol.layer.Vector({source: new ol.source.Vector() });

//Intial Map and controls.
var map = new ol.Map({
  layers: [
    baselayer,
    vectorLayer2, 
    vector
  ],
  target: 'map',
  controls: ol.control.defaults({
    attributionOptions: ({
      collapsible: false
    })
  }),
  view: view
});

// Pan to given location.
function pan(lat, lon, zoomAmount) {
  view.animate({
      center: ol.proj.transform([lon, lat], 'EPSG:4326', 'EPSG:3857'),
      duration: 2000,
      zoom: zoomAmount
  });
}

var styleFunction = function(feature, resolution) {
  return styles[feature.getGeometry().getType()];
};

// Icons for contextMenu.
var center_icon = './resources/OpenlayersContextMenu/Icons/center.png';
var pin_icon = './resources/OpenlayersContextMenu/Icons/pin_drop.png';
var weather_icon = './resources/OpenlayersContextMenu/Icons/weather2.png';

// contextMenu for Map.
var contextMenuItems = [
  {
    text: 'Add a Marker',
    icon: pin_icon,
    callback: marker
  },
  {
    text: 'Center Map Here',
    classname: 'bold',
    icon: center_icon,
    callback: center
  },
  {
    text: 'Get Weather Here',
    classname: 'bold',
    icon: weather_icon,
    callback: getWeatherHere
  },
  '-' // this is a separator
];

// Declare menu and determine size.
var contextmenu = new ContextMenu({
  width: 180,
  items: contextMenuItems
});

map.addControl(contextmenu);

var removeMarkerItem = {
  text: 'Remove this Marker',
  classname: 'marker',
  callback: removeMarker
};

contextmenu.on('open', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, ft => ft);
  
  if (feature && feature.get('type') === 'removable') {
    contextmenu.clear();
    removeMarkerItem.data = { marker: feature };
    contextmenu.push(removeMarkerItem);
  } else {
    contextmenu.clear();
    contextmenu.extend(contextMenuItems);
    contextmenu.extend(contextmenu.getDefaultItems());
  }
});

map.on('pointermove', function (e) {
  if (e.dragging) return;

  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);

  map.getTargetElement().style.cursor = hit ? 'pointer' : '';
});

// Remove given marker from map.
function removeMarker(obj) {
  vectorLayer2.getSource().removeFeature(obj.data.marker);
}

// Move and center on given location.
function center(obj) {
  view.animate({
    duration: 700,
    easing: elastic,
    center: obj.coordinate
  });
}

//Elastic bounce animation.
function elastic(t) {
  return Math.pow(2, -10 * t) * Math.sin((t - 0.075) * (2 * Math.PI) / 0.3) + 1;
}

function marker(obj) {

  var coord4326;
  //Get number of makers on map currrently.
  var featureLength = vectorLayer2.getSource().getFeatures().length;

  //If there's already 2 markers remove the first one.
  if(featureLength>1) vectorLayer2.getSource().removeFeature(vectorLayer2.getSource().getFeatures()[0]);

  if(isMark === false){
    isMark = true;
    startMarker();
    
  }else if(isMark === true){

    isMark = false;
    finishMarker();
  }

  // Draw the start marker.
  function startMarker(){
    coord4326 = ol.proj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326'),
      iconStyle = new ol.style.Style({
        image: new ol.style.Circle({ 
          fill: null,
          radius: 5,
          snapToPixel: true, 
          stroke: new ol.style.Stroke({ color: '#111', width: 2 })
        }),
        text: new ol.style.Text({
          offsetY: 25,
          text: ol.coordinate.format(coord4326, "Start", 2),
          font: '15px Open Sans,sans-serif',
          fill: new ol.style.Fill({ color: '#111' }),
          stroke: new ol.style.Stroke({ color: '#eee', width: 2 })
        })
      }),
      feature = new ol.Feature({
        type: 'removable',
        geometry: new ol.geom.Point(obj.coordinate)
      });
  }

  //Draw the finish marker.
  function finishMarker() {
    coord4326 = ol.proj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326'),
      template = 'Finish is ({x} | {y})',
      iconStyle = new ol.style.Style({
        image: new ol.style.Icon({ scale: .6, src: pin_icon }),
        text: new ol.style.Text({
          offsetY: 25,
          text: ol.coordinate.format(coord4326, template, 2),
          font: '15px Open Sans,sans-serif',
          fill: new ol.style.Fill({ color: '#111' }),
          stroke: new ol.style.Stroke({ color: '#eee', width: 2 })
        })
      }),
      feature = new ol.Feature({
        type: 'removable',
        geometry: new ol.geom.Point(obj.coordinate)
      });
  }

  feature.setStyle(iconStyle);
  vectorLayer2.getSource().addFeature(feature);
  center(obj);
  searchLatLon(obj);
  
}

// Get the weather at the given location.
function getWeatherHere(obj){
  var coord4326 = ol.proj.transform(obj.coordinate, 'EPSG:3857', 'EPSG:4326');
  getWeather(coord4326[1], coord4326[0], 0);
  pan(coord4326[1], coord4326[0], 15);
}