let map = L.map('map').setView([56.324676, 44.0174], 15);
var geojson;

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community'
}).addTo(map);

function getColor(d){
  return d == 0 ?  '#606A64' :
         d == 1 ? '#EC0B43' :
         d == 2 ? '#FFBF46' :
         d == 3 ? '#13505B' :
         d == 9 ?  '#6F085C' :
         'white';
}

function myStyle(feature) {
  return {
    "color": getColor(feature.properties.TYPE),
    "weight": 5,
    "opacity": 0.7
  };
}


function highlightFeature(e) {
  let layer = e.target;

  layer.setStyle({
    "opacity": 1,
  });

  //info.update(layer.feature.properties);
}


function resetHighlight(e) {
  geojson.resetStyle(e.target);

  //info.update();
}

function displayInfo(e){
  info.update(e.target.feature.properties)
}

function onEachFeature(feature, layer){
  //layer.bindPopup(feature.properties.name);
  layer.on({
    mouseover: highlightFeature,
    mouseout: resetHighlight,
    click: displayInfo
});
}



var info = L.control({position: 'topleft'});
info.onAdd = function(map){
  this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
  this.update();
  return this._div;
}

info.update = function (props) {
  console.log(props);
  this._div.innerHTML = (props ?
      /*html*/`<h4 class="fancyText"><b>${props.PS_NAME}</b></h4>
      <h4 class="ordinaryText">${props.PRE_SOVIET}</h4>${props.PRE_SOVIET ? '<br>' : ''} 
      <h4 class="fancyText"><b>${props.S_NAME}</b></h4>
      <h4 class="ordinaryText">${props.SOVIET}</h4>${props.PRE_SOVIET ? '<br>' : ''} 
      <h4 class="fancyText"><b>${props.ND_NAME}</b></h4>
      <h4 class="ordinaryText">${props.NOWDAYS}</h4>`
      : 'Выберите улицу');
};

info.addTo(map);

let legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    let div = L.DomUtil.create('div', 'info legend'),
        types = [0, 1, 2, 3, 9],
        labels = ['неизвестно', 'нижегородцев', 'некоторое время живших в городе', 
          'мест, зданий или событий города', 'не имеющего отношения к городу'];
    div.innerHTML += '<h3>Улицы, названные в честь:</h3>'
    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < types.length; i++) {
        div.innerHTML += 
            /*html*/'<div class = "legendText"><i style="height: 5px; margin-top: 7px; background:' 
            + getColor(types[i]) + '"></i> ' + labels[i] + '<br></div>';
    }

    return div;
};

legend.addTo(map);

geojson = L.geoJSON(strs, {
  style: myStyle,
  onEachFeature: onEachFeature
}).addTo(map);


