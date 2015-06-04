var map;

$(function() {
  //add leaflet map and set maxview and minview;
  map = L.map('map').setView(new L.LatLng(-13.923404,-51.555177), 4);
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  map._layersMaxZoom= 8;
  map._layersMinZoom= 2;

  // add locate button
  L.control.locate().addTo(map);

// add search
var searchLayer = function(query, cb) {
var d = $.Deferred()
// [{"loc":[41.57573,13.002411],"title":"black"},{"loc":[41.807149,13.162994],"title":"blue"}]
//f.properies.XXXX, where XXXX defines what element search will be run on
var json = data.features.map(function(f) {
  return {loc: [f.geometry.coordinates[1], f.geometry.coordinates[0]], title: f.properties.Nome}
  })
  // return d.resolve(json)
  json = json.filter(function(result) {
    return RegExp(query.toLowerCase()).test(result.title.toLowerCase())
    })
    cb(json)
    };
    map.addControl( new L.Control.Search({ callData: searchLayer }) );

// gets data to display and automatically codes in geolocation for data display
$.getJSON('json/geodata.json').then(function(geoJSON) {
  var options = {
    onEachFeature: onEachFeature
    }
    L.geoJson(geoJSON, options).addTo(map);
    })

// set sidebar
var sidebar = L.control.sidebar('sidebar', {
  position: 'right'
  });
map.addControl(sidebar);
setTimeout(function () {
  sidebar.hide();
  }, 5000);

//set sidebar content and functioning
function onEachFeature (feature, layer) {
    layer.on("click", function() {
    $.when( $("#sidebar").load(feature.properties.file) ).done(function () {
      sidebar.show();
    })
  });

  //for hiding the sidebar
  map.on("click",function() {
    sidebar.hide();
    })

  //make the side bar disappear
  $("#sidebar").on("dblclick",function(){
    sidebar.hide();
    })
  } //onEachFeature
}); //main function
