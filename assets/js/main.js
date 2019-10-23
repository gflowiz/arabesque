

//TODO remove all funciton in other files like import files 
import {  refreshFilterModal,  addFilterToScreen,  checkDataToFilter,  testLinkDataFilter,  applyNodeDataFilter} from "./filter.js"
import {  addOSMLayer,  addBaseLayer,  addGeoJsonLayer,  addNodeLayer,  generateLinkLayer,  addLegendToMap,  showTileLayersName,  addTileLayer,  getTileData,  addBaseUrlLayer, getLayerFromName} from "./layer.js";
import {  loadMapFromPresetSave,  loadFilter,  loadZippedMap} from "./save.js";
import {  getCentroid,  changeProjection,  loadAllExtentProjection, search, centerMap} from "./projection.js";
import {  computeMinStatNode,  computeDistance,  checkIDLinks, computeTotalVolume, exportLinksAndNodes} from "./stat.js";
import {  addLayerGestionMenu,  addLayerImportGestionMenu} from './control.js';
import {  showGeometryParameter,  setupArrowParameter,  setupHead} from './geometry.js';
import {  setupStyleAndAddLayer,  showSemioParameter,  generatePaletteMultiHue2,  changeSemioParameter, changeArrowGeometryAndReloadMap} from './semiology.js'

import * as turf from "@turf/turf"

import CanvasScaleLine from 'ol-ext/control/CanvasScaleLine'
//import Print from 'ol-ext/control/Print'
//import 'ol-ext/control/Print.css'
import {transform} from 'ol/proj.js';

import {  register} from 'ol/proj/proj4.js';
import {  Map,  View} from 'ol';
// import {} from 'ol/control.js';
// import {defaults as defaultControls, FullScreen} from 'ol/control.js';
import {  ScaleLine,  defaults as defaultControls,  Control,  FullScreen,  Attribution} from 'ol/control.js';
import {  click,  pointerMove} from 'ol/events/condition.js';
import Select from 'ol/interaction/Select.js';
// import {click, pointerMove, altKeyOnly} from 'ol/events/condition.js';

import WebGLMap from 'ol/WebGLMap.js';
import * as wbg from 'ol/webgl.js';
import Overlay from 'ol/Overlay.js';
// import * as d3proj from 'd3-geo-projection'

import Hover from 'ol-ext/interaction/Hover'
import Popup from "ol-ext/overlay/Popup"
import CanvasTitle from "ol-ext/control/CanvasTitle"
// import OLButton from "ol-ext/control/Button"ew ol.control.CanvasTitle();
import "ol-ext/overlay/Popup.css"

import {  parse as papaparse} from "papaparse"
import JSZip from 'jszip'
import html2canvas from 'html2canvas'
// import jsPDF from 'jsPDF';
import {  saveAs} from 'file-saver';
// import C2S frolm 'canvas'

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';

import 'spectrum-colorpicker/spectrum.js'
import 'spectrum-colorpicker/spectrum.css'

import "../css/control.css"

import proj4 from 'proj4';

import WKT from 'ol/format/WKT.js';


// $(window).scroll(function() {
// // 
// // 
//     //After scrolling 100px from the top...
//     if ( $(window).scrollTop() >= (screen.height/2 ) ) {
//         // document.getElementById(main-navbar).style
//          $('#main-navbar').css('background-color', '#D2B48C');
//         $('#main-navbar>a').css('color', 'white');
//         // $('#main-navbar').css('padding', '1em');
//     //Otherwise remove inline styles and thereby revert to original stying
//     } else {
//         $('#main-navbar').css('background-color', '');         
//         $('#main-navbar>a').css('color', '');
//         // $('#main-navbar').css('padding', '8px');

//     }
// });

var heighttokeep = $(".container-fluid").height()
document.getElementById('map').style.height = heighttokeep + "px"

document.getElementById('removeFilterLayout').addEventListener("click", function () {
  var el = document.getElementById('removeFilterLayout')

  // document.getElementById("LoadZipMapButton").disabled = false;

  var widthlayout = $("#filterDiv").outerWidth()
  if (el.style.right === "0px") {

    var newSize = $('#map').outerWidth() - widthlayout;
    var widthlayout = $("#filterDiv").outerWidth()
    $('#removeFilterLayout').animate({
      right: widthlayout + "px",
    }, 1000);


    $("#filterDiv").animate({
      right: "0px",
    }, 1000);

    $("#map").animate({
      width: newSize + "px",
      right: widthlayout + "px",
    }, 1000, function () {
      map.updateSize()
    });


    $('.right_icon').remove()
    $('#removeFilterLayout').append('<img src="assets/svg/si-glyph-arrow-right.svg" class="right_icon"></img>')
    // map.updateSize()
  } else {

    var newSize = $('#map').outerWidth() + widthlayout;

    $('#removeFilterLayout').animate({
      right: "0px",
    }, 1000);
    $("#filterDiv").animate({
      right: "-" + widthlayout + "px",
    }, 1000);

    $("#map").animate({
      width: newSize + "px",
      right: "0px",
    }, 1000, function () {
      map.updateSize()
    });


    $('.right_icon').remove()

    $('#removeFilterLayout').append('<img src="assets/svg/si-glyph-arrow-left.svg" class="right_icon"></img>')
    // map.updateSize()
  }
});


document.getElementById('removeLayerLayout').addEventListener("click", function () {
  var el = document.getElementById('removeLayerLayout')
  var widthlayout = $("#layerLayout").outerWidth()
  var buttonLeft = $("#layerLayout").outerWidth()
  if (el.style.left === "0px") {
    document.getElementById('map').style.position = 'absolute'
    var newSize = $('#map').outerWidth() - widthlayout;


    $('#removeLayerLayout').animate({
      left: buttonLeft + "px",
    }, 1000);

    $("#layerLayout").animate({
      left: "0px",
    }, 1000);
    $("#map").animate({
      width: newSize + "px",
      left: "0px",
    }, 1000, function () {
      map.updateSize()
    });

    $('.left_icon').remove()
    $('#removeLayerLayout').append('<img src="assets/svg/si-glyph-arrow-left.svg" class="left_icon"></img>')

  } else {

    document.getElementById('map').style.position = 'absolute'
    var newSize = $('#map').outerWidth() + widthlayout;
    // el.style.right = '0px' ;


    $('#removeLayerLayout').animate({
      left: "0px",
    }, 1000);
    $("#layerLayout").animate({
      left: "-" + widthlayout + "px",
    }, 1000);

    $("#map").animate({
      width: newSize + "px",
      left: "-" + widthlayout + "px",
    }, 1000, function () {
      map.updateSize()
    });


    $('.left_icon').remove()

    $('#removeLayerLayout').append('<img src="assets/svg/si-glyph-arrow-right.svg" class="left_icon"></img>')
    // map.updateSize()
  }

});

var widthlayout = $("#layerLayout").outerWidth();
document.getElementById("removeLayerLayout").style.left = widthlayout + 'px';

var widthlayout = $("#filterDiv").outerWidth();
document.getElementById("removeFilterLayout").style.right = widthlayout + 'px';


generatePaletteMultiHue2()


var select = document.getElementById("projection");
for (var i in Proj) {
  if (Proj[i].proj4 !== null) {
    proj4.defs(i, Proj[i].proj4);
  }


  var el = document.createElement("option");
  el.textContent = Proj[i].name;
  el.value = i;
  select.appendChild(el);
}

try {
  register(proj4);
  loadAllExtentProjection()
  
} catch (error) {
  console.error(error);
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}
// loadAllExtentProjection()

global.data = {
  hashedStructureData: {},
  filter: {
    link: {},
    node: {}
  }
}

global.global_data = {
  "files": {
    "node": null,
    "link": null,
    "Ltype": null,
    "Ntype": null,
    "aggr": "sum"
  },
  "layers": {
    features: {},
    base: {},
    osm: {},
    import: {}
  },
  "style": {
    "link": {
      "color": {
        "palette": null,
        "cat": null,
        "var": null,
        "max": null,
        "min": null
      },
      "opa": {
        "cat": null,
        "var": null,
        "max": null,
        "min": null,
        "vmax": null
      },
      "size": {
        "cat": null,
        "var": null,
        "max": null,
        "min": null,
        "ratio": null
      },
      "geometry": {
        "oriented": true,
        "type": null,
        "head": {
          "height": null,
          "width": null
        },
        "place": {
          "base": null,
          "height": null
        }
      }
    },

    "node": {
      "color": {
        "palette": null,
        "cat": null,
        "var": null,
        "max": null,
        "min": null
      },
      "size": {
        "cat": null,
        "ratio": null,
        "var": null,
        "max": null,
        "min": null
      },
      "opa": {
        "cat": null,
        "var": null,
        "vmax": null,
        "max": null,
        "min": null
      },
      "text": null,
      "ratioBounds": null
    }
  },
  "filter": {
    "link": [],
    "node": []
  },
  "ids": {
    "nodeID": null,
    "linkID": [null, null],
    "vol": "count",
    "long": "lat",
    "lat": "lon"
  },
  "projection": {},
  "legend": {
    "link": {
      "legend": null,
      "color": null,
      "opa": null
    },
    "node": {
      "legend": null,
      "color": null,
      "opa": null
    }
  }
};

global_data.projection = Proj["Mercator / EPSG:3857"]
// Add listener to all button of application
// onclick properties did'nt work with webpack so button must be update manually by adding an event listener

// Home Page loadZippedMap
document.getElementById('importDataButton').addEventListener("click", function () {
  importFlowToMap()
});
document.getElementById('localMap').addEventListener("click", function () {
  loadMapFromPresetSave('local', map, global_data, data)
});
document.getElementById('countryMap').addEventListener("click", function () {
  loadMapFromPresetSave('country', map, global_data, data)
});
document.getElementById('worldMap').addEventListener("click", function () {
  loadMapFromPresetSave('world', map, global_data, data)
});
document.getElementById('LoadZipMapButton').addEventListener("click", function () {
  loadZippedMap()
});
// Main Page -- Layer
// document.getElementById('OSMbutton').addEventListener("click", function(){}); 
document.getElementById('buttonProjection').addEventListener("click", function () {
  changeProjection(global_data.layers, global_data.center)
  if (global_data.projection.name === "Mercator / EPSG:3857") {
    document.getElementById("OSMbutton").disabled = false;
  } else {
    document.getElementById("OSMbutton").disabled = true;
  }
});
document.getElementById('epsg-search').addEventListener("click", function () {
      var queryInput = document.getElementById('epsg-query');
      search(queryInput.value);
});

document.getElementById('addNewNodeFeaturesButton').addEventListener("click", function () {
  showSemioParameter('node')
});
document.getElementById('addNewLinkFeaturesButton').addEventListener("click", function () {
  showSemioParameter('link')
  showGeometryParameter()
});

document.getElementById('arrowtypeChange').addEventListener("change", function () {
  setupArrowParameter('Change')
});
document.getElementById('arrowDataChange').addEventListener("change", function () {
  setupHead('Change')
});

document.getElementById('arrowtype').addEventListener("change", function () {
  setupArrowParameter()
});
document.getElementById('arrowData').addEventListener("change", function () {
  setupHead()
});
// Main Page -- filter
document.getElementById('selectFilterButton').addEventListener("click", function () {
  refreshFilterModal();
  checkDataToFilter()
});
// Modal -- AddaddNewTileLayerButtonAdd
document.getElementById('addNewLayerButtonAdd').addEventListener("click", function () {
  addBaseLayer(map, global_data.layers, 'Add', 'Made with <a href="https://www.naturalearthdata.com">Natural Earth.</a>')
});
document.getElementById('addNewURLLayerButtonGeoJson').addEventListener("click", function () {
  addBaseUrlLayer(map, global_data.layers)
});
document.getElementById('tileLayersAdd').addEventListener("change", function () {
  showTileLayersName(document.getElementById('tileLayersAdd').value)
});
document.getElementById('OSMbutton').addEventListener("click", function () {
  // 
  showTileLayersName(document.getElementById('tileLayersAdd').value)
});
document.getElementById('addNewTileLayerButtonAdd').addEventListener("click", function () {
  var dataTile = getTileData()
  addTileLayer(map, global_data.layers.osm, dataTile.url, document.getElementById('tileLayersNameSelectorOptions').value, dataTile.attributions)
});
document.getElementById('addNewTileLayerURL').addEventListener("click", function () {
  addTileLayer(map, global_data.layers.osm, document.getElementById('URLTileLayer').value, document.getElementById('NameTileLayer').value, document.getElementById('ContributorsTileLayer').value)
});
// Modal -- Filter
// document.getElementById('refreshFilterButton').addEventListener("click", function(){refreshFilterModal()}); 
document.getElementById('addFilterButton').addEventListener("click", function () {
  addFilterToScreen()
});
// // Modal -- SemioaddSemioButton
// document.getElementById('featureChosenAddLink').addEventListener("change", function(){showSemioParameter('Link')}); 
// document.getElementById('featureChosenAddNode').addEventListener("change", function(){showSemioParameter('Node')}); 
// document.getElementById('refreshSemioButton').addEventListener("click", function(){refreshSemioModal()}); 
document.getElementById('addGeometryButtonLink').addEventListener("click", function () {
  changeArrowGeometryAndReloadMap(global_data.style)
});
document.getElementById('addSemioButtonLink').addEventListener("click", function () {
  setupStyleAndAddLayer(global_data.style, 'link')
});
document.getElementById('addSemioButtonNode').addEventListener("click", function () {
  setupStyleAndAddLayer(global_data.style, 'node')
});
// Modal -- Import
document.getElementById('addNewLayerButtonGeoJson').addEventListener("click", function () {
  var layer_name = document.getElementById("nameGeoJson").value;
  var opacity = document.getElementById("opacityGeoJson").value;
  var stroke_color = document.getElementById("strokeColorpickerGeoJson").value;
  var fill_color = document.getElementById("fillColorpickerGeoJson").value;

  
  addGeoJsonLayer(map, data.geoJson, layer_name, opacity, stroke_color, fill_color)


  global_data.layers.import[layer_name] = {}
  global_data.layers.import[layer_name].style = {
    stroke: stroke_color,
    fill: fill_color,
    opacity: opacity
  };
  // global_data.layers.import[layer_name].added = true
  data[layer_name] = data.geoJson

  // reduce is here to create dataset to import into the application
  // reduceDataset(data.geoJson)

  addLayerImportGestionMenu(layer_name)
});

// Modal -- quit 
document.getElementById('saveAndQuitButton').addEventListener("click", function () {
  exportDataAndConf()
  refreshMapAndGoBack()
});
document.getElementById('QuitButton').addEventListener("click", function () {
  refreshMapAndGoBack()
});

// document.getElementById('importFileLocationButton').addEventListener("click", function(){importFlowToMap()}); 
document.getElementById('importPresetLocationButton').addEventListener("click", function () {
  importIDSFlow()
  useExistingNodes()
});
document.getElementById('importUserLocationButton').addEventListener("click", function () {
  importIDSFlow()
});
document.getElementById('importPresetMapButton').addEventListener("click", function () {
  importFlowAndPresetNodes()
});
document.getElementById('importedFileLocationButton').addEventListener("click", function () {
  importFlowAndUserNodes()
});

// document.getElementById('layerControlList').addEventListener("mouseleave", function(){
//   $("#layerControlList").removeAttr("data-tooltip")
// 
// }

//   ); 
// Modal -- Change
// Button -- right
// 
// document.getElementById('removeFilterLayout').addEventListener("click", function(){

// })
document.getElementById("importDataButton").disabled = true;
document.getElementById("LoadZipMapButton").disabled = true;

// document.getElementById('importIdButton').addEventListener("click", function(){

//   importData()
// }); 




(function () {

  function onChange(event) {
    // 
    var reader = new FileReader();
    reader.onload = onReaderLoad;

    reader.readAsText(event.target.files[0]);
    global_data.files.Ntype = event.target.files[0].name.split('.')[event.target.files[0].name.split('.').length - 1]
    // document.getElementById("Node").disabled = true;
    document.getElementById("label_node").innerHTML = event.target.files[0].name;
    
    // data.nodes = readData(data.rawStructureData, global_data.files.Ntype);
    // showParameterIDSNodes()

    document.getElementById("importDataButton").disabled = false;

  }

  function onReaderLoad(event) {
    data.rawStructureData = event.target.result;

    data.nodes = readData(data.rawStructureData, global_data.files.Ntype);
    showParameterIDSNodes()
  }


  document.getElementById('Node').addEventListener('change', onChange);

}());

(function () {

  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;

    reader.readAsText(event.target.files[0]);
    document.getElementById("label_geoJson").innerHTML = event.target.files[0].name;
  }

  function onReaderLoad(event) {
    data.geoJson = JSON.parse(event.target.result);
    $("#geoJsonModalBody").append('<hr>' +
      '<div class="row">' +
      '<div class="col-md-12">' +
      '<label class="text-muted h5" for="customRange3">Opacity</label>' +
      '<input type="range" class="custom-range" min="0" max="1" step="0.05" id="opacityGeoJson">' +
      '</div>' +
      '</div>' +
      '<hr>' +
      ' <div class="row">' +
      '<div class="col-md-6">' +
      '<label class="text-muted h5" for="customRange3">Fill</label>' +
      '<input type="color" id="fillColorpickerGeoJson" onchange="clickColor(0, -1, -1, 5)" value="#ff0000">' +
      '</div>' +
      '<div class="col-md-6">' +
      '<label  class="text-muted h5" for="customRange3">Stroke</label>' +
      '<input type="color" id="strokeColorpickerGeoJson" onchange="clickColor(0, -1, -1, 5)" value="#ff0000">' +
      '</div>' +
      '</div>')

  }


  document.getElementById('geoJson').addEventListener('change', onChange);

}());

(function () {

  function onChange(event) {
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(event.target.files[0]);
    //
    global_data.files.Ltype = event.target.files[0].name.split('.')[event.target.files[0].name.split('.').length - 1]
    // document.getElementById("Link").disabled = true; 
    document.getElementById("label_link").innerHTML = event.target.files[0].name;

    document.getElementById("importDataButton").disabled = false;
  }

  function onReaderLoad(event) {
    data.rawLinkData = event.target.result;
    // 

  }


  document.getElementById('Link').addEventListener('change', onChange);

}());


(function () {

  function onChange(event) {
    // 
    var reader = new FileReader();
    reader.onload = onReaderLoad;
    // 
    reader.readAsArrayBuffer(event.target.files[0]);
    // global_data.files.Ntype = event.target.files[0].name.split('.')[event.target.files[0].name.split('.').length - 1]

    document.getElementById("label_loadSavedZipMap").innerHTML = event.target.files[0].name;
    // 
    // data.nodes = readData(data.rawStructureData, global_data.files.Ntype);
    // showParameterIDSNodes()

    // document.getElementById("importDataButton").disabled = false;

  }

  function onReaderLoad(event) {
    var new_zip = new JSZip();
    JSZip.loadAsync(event.target.result).then(function (zip) {
      // new_zip.file("conf.json").async("string");
      // 
      zip.files["conf.json"].async('string').then(function (fileData) {
        global_data = JSON.parse(fileData)
        global_data.legend = {
          "link": {
            "legend": null,
            "color": null,
            "opa": null
          },
          "node": {
            "legend": null,
            "color": null,
            "opa": null
          }
        }
        // 
      })
      zip.files["data.json"].async('string').then(function (fileData) {
        data = JSON.parse(fileData) // These are your file contents      
      })
    })
    document.getElementById("LoadZipMapButton").disabled = false;
    // 

    // data.nodes = readData(data.rawStructureData,global_data.files.Ntype);
    // showParameterIDSNodes()
  }


  document.getElementById('loadSavedZipMap').addEventListener('change', onChange);

}());


var select = document.getElementById("layersAdd");
var list_nameLayer = Object.keys(ListUrl)
for (var i = 0; i < list_nameLayer.length; i++) {

  var el = document.createElement("option");
  el.textContent = list_nameLayer[i];
  el.value = list_nameLayer[i];
  select.appendChild(el);
  //
}

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');


var overlay = new Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
          duration: 250
        }
      });


var attribution = new Attribution({
  collapsible: false
});
global.map = new Map({
  controls: defaultControls({
    attribution: false
  }).extend([attribution]),
  // overlays: [overlay],   
  //      ]),
  renderer: 'webgl',
  // pixelRatio:5,
  //renderer:'webgl',
  target: 'map',
  loadTilesWhileAnimating: true,
  loadTilesWhileInteracting: true,
  view: new View({
    center: [0.00, -0.00],
    //projection:projection.name,
    zoom: 0,
    minZoom: -2,
    maxZoom: 50
  })
});

/*var selectClick = new Select({
  layers:function (layer) {
          return layer.get('name') === 'link' || layer.get('name') === 'node';
        },
});*/

var selectHover = new Select({
  condition: function(mapBrowserEvent){
    // console.log(mapBrowserEvent)
    return pointerMove(mapBrowserEvent)
  },
  layers:function (layer) {
          return layer.get('name') === 'link' || layer.get('name') === 'node';
        },
});
var selectClick = new Select({
  layers:function (layer) {
          return layer.get('name') === 'link' || layer.get('name') === 'node';
        },
});

selectHover.on('select', function(e) { 
  var feat = selectHover.getOverlay().getSource().getFeatures()[0]

  if(feat.get('layer') === 'node'){
    var featToShow = getFeaturesLinksToNode(feat.get(global_data.ids.nodeID))
    // console.log(featToShow)
    selectHover.getOverlay().getSource().addFeatures(featToShow)
  }
})
// selectHover.handleEvent(function(mapBrowserEvent){console.log('dsfgqsfdgqsg')})
// console.log(select)selectHover.addFeature_
map.addInteraction(selectHover); 
// map.handleMapBrowserEvent(function(mapBrowserEvent){console.log(mapBrowserEvent)})
function isNodeInFeatures(features){
  var feature = null
  features.forEach(function(feat){if(feat.get('layer') === 'node'){ feature = feat}})
  return feature
}
function getFeaturesLinksToNode(id_node){
  // console.log(id_node)
  var layer = getLayerFromName(map, 'link')
  if(layer === null){
    return
  }
  var featuresToOverlay = []
  var features = layer.getSource().getFeatures()
  // console.log(features)
  features.forEach(function(feature){

    if(feature.get('ori') === id_node || feature.get('dest') === id_node){
      featuresToOverlay.push(feature)
    }
  })

  return featuresToOverlay
}


map.addInteraction(selectClick);      

map.on('singleclick', function(evt) {
        select.getFeatures().clear();
        var features = map.getFeaturesAtPixel(evt.pixel)
        // var hdms = toStringHDMS(toLonLat(coordinate));
 // console.log(features)
        var networkFeature;
        for(var p in features){
          // console.log(features[p].get('layer'))
          if (['node','Node', 'link'].includes(features[p].get('layer'))){
            networkFeature = features[p]
            break
          }
        }
        // console.log(networkFeature.get('layer'))
        if(typeof networkFeature !== 'undefined'){
          if(networkFeature.get('layer') === 'link'){
             content.innerHTML = showLinkPopup(networkFeature)
             overlay.setPosition(evt.coordinate);
          }
          else if(networkFeature.get('layer') === 'node')
            content.innerHTML = showNodePopup(networkFeature)
            overlay.setPosition(evt.coordinate);
        }
        else {
                overlay.setPosition(undefined);
              }

      });

function showLinkPopup(feature){
  var link_used = ["fixed"]
   var str_to_show = '<b>' + feature.get('ori') + ' <img class="popup-icon" src="assets/svg/si-glyph-triangle-right.svg"/> ' + feature.get('dest') + '</b><br/>'
    if (!link_used.includes(global_data.ids.vol)) {
      str_to_show = str_to_show + global_data.ids.vol + " : " + e.feature.get(global_data.ids.vol) +
        "<br/>";
      link_used.push(global_data.ids.vol)
    }
    if (!link_used.includes(feature.get('size').name)) {
      str_to_show = str_to_show + e.feature.get('size').name + " : " + e.feature.get('size').value +
        "<br/>";
      link_used.push(feature.get('size').name)
    }
    if (!link_used.includes(e.feature.get('color').name)) {
      str_to_show = str_to_show + e.feature.get('color').name + " : " + e.feature.get('color').value +
        "<br/>";
      link_used.push(feature.get('color').name)
    }
    if (!link_used.includes(feature.get('opa').name)) {
      str_to_show = str_to_show + e.feature.get('opa').name + " : " + e.feature.get('opa').value +
        "<br/>";
      link_used.push(feature.get('opa').name)
    }
  return str_to_show
}

function showNodePopup(feature){
  var nodes_used = ["fixed"]
  var str_to_show = '<b>' + feature.get(global_data.ids.nodeID) + '</b>' +
      "<br/>"
    if (!nodes_used.includes(global_data.style.node.size.var)) {
      str_to_show = str_to_show + global_data.style.node.size.var+" : " + feature.get(global_data.style.node.size.var) +
        "<br/>"
      nodes_used.push(global_data.style.node.size.var)
    }
    if (!nodes_used.includes(global_data.style.node.color.var)) {
      str_to_show = str_to_show + global_data.style.node.color.var+" : " + feature.get(global_data.style.node.color.var) +
        "<br/>"
      nodes_used.push(global_data.style.node.color.var)
    }
    if (!nodes_used.includes(global_data.style.node.opa.var)) {
      str_to_show = str_to_show + global_data.style.node.opa.var+" : " + feature.get(global_data.style.node.opa.var) +
        "<br/>"
      nodes_used.push(global_data.style.node.opa.var)
    }
  return str_to_show
}


// var select = null; // ref to currently selected interaction


var scaleLineControl = new ScaleLine();
map.addControl(scaleLineControl);
map.addControl(new FullScreen());
// map.addControl(attribution);
// $('.ol-scale-line').css('left', '');
// document.getElementsByClassName("ol-scale-line")[0].style.left = ""
// document.getElementsByClassName("ol-scale-line")[0].style.right = "8px"

// var printControl = new Print()
// map.addControl(printControl);
// CanvasTitle control
var titleControl = new CanvasTitle();
map.addControl(titleControl);
document.getElementById('titleMap').addEventListener("change", function () {
  // 
  global_data.title = this.value
  titleControl.setTitle(this.value);
});


// Display the style on select
/*var popup = new Popup({
  popupClass: 'tooltips',
  offsetBox: 15
});
map.addOverlay(popup);
var hover = new Hover();
map.addInteraction(hover);
hover.on('leave', function (e) {
  popup.hide();
});
hover.on('hover', function (e) {

  var nodes_used = ["fixed"]
  var link_used = ["fixed"]
  if ('link' === e.layer.get('name')) {
    // 
    var str_to_show = '<b>' + e.feature.get('ori') + ' <img class="popup-icon" src="assets/svg/si-glyph-triangle-right.svg"/> ' + e.feature.get('dest') + '</b><br/>'
    if (!link_used.includes(global_data.ids.vol)) {
      str_to_show = str_to_show + global_data.ids.vol + " : " + e.feature.get(global_data.ids.vol) +
        "<br/>";
      link_used.push(global_data.ids.vol)
    }
    if (!link_used.includes(e.feature.get('size').name)) {
      str_to_show = str_to_show + e.feature.get('size').name + " : " + e.feature.get('size').value +
        "<br/>";
      link_used.push(e.feature.get('size').name)
    }
    if (!link_used.includes(e.feature.get('color').name)) {
      str_to_show = str_to_show + e.feature.get('color').name + " : " + e.feature.get('color').value +
        "<br/>";
      link_used.push(e.feature.get('color').name)
    }
    if (!link_used.includes(e.feature.get('opa').name)) {
      str_to_show = str_to_show + e.feature.get('opa').name + " : " + e.feature.get('opa').value +
        "<br/>";
      link_used.push(e.feature.get('opa').name)
    }
    popup.show(e.coordinate, str_to_show)
  } else if ('node' === e.layer.get('name')) {
    var str_to_show = '<b>' + e.feature.get(global_data.ids.nodeID) + '</b>' +
      "<br/>"
    if (!nodes_used.includes(global_data.style.node.size.var)) {
      str_to_show = str_to_show + global_data.style.node.size.var+" : " + e.feature.get(global_data.style.node.size.var) +
        "<br/>"
      nodes_used.push(global_data.style.node.size.var)
    }
    if (!nodes_used.includes(global_data.style.node.color.var)) {
      str_to_show = str_to_show + global_data.style.node.color.var+" : " + e.feature.get(global_data.style.node.color.var) +
        "<br/>"
      nodes_used.push(global_data.style.node.color.var)
    }
    if (!nodes_used.includes(global_data.style.node.opa.var)) {
      str_to_show = str_to_show + global_data.style.node.opa.var+" : " + e.feature.get(global_data.style.node.opa.var) +
        "<br/>"
      nodes_used.push(global_data.style.node.opa.var)
    }
    popup.show(e.coordinate, str_to_show)
  } else {
    popup.hide();
  }

  // +'<br/>'
  // +e.feature.get('pop').toLocaleString()+' hab.')
});*/

// map.on('click', function(event) {
//     var features = map.getFeaturesAtPixel(event.pixel);
//     
//   });

var exportZipMap = (function (Control) {
  function exportZipMap(opt_options) {
    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = "<img class='icon-button-ol' rel='tooltip' title='Save the map as save file' data-placement='right' src='assets/svg/si-glyph-floppy-disk.svg'/>";

    var element = document.createElement('div');
    element.className = 'rotate-north ol-unselectable ol-control';
    element.appendChild(button);

    Control.call(this, {
      element: element,
      target: options.target
    });

    button.addEventListener('click', this.handleExport.bind(this), false);
  }

  if (Control) exportZipMap.__proto__ = Control;
  exportZipMap.prototype = Object.create(Control && Control.prototype);
  exportZipMap.prototype.constructor = exportZipMap;

  exportZipMap.prototype.handleExport = function handleExport() {
    exportDataAndConf()
  };

  return exportZipMap;
}(Control));
map.addControl(
  new exportZipMap()
)

function exportDataAndConf() {
  var zip = new JSZip();
  // global_data.center = map.getView().getCenter()
  // global_data.zoom = map.getView().getZoom()
  let saveLegend = global_data.legend
  delete global_data.legend

  zip.file("data.json", JSON.stringify(data));
  zip.file("conf.json", JSON.stringify(global_data));
  // 

  zip.generateAsync({
      type: "blob"
    })
    .then(function (content) {
      // see FileSaver.js
      saveAs(content, "Save_GFlowiz_Map.zip");
    });

  global_data.legend = saveLegend
  // addLegendToMap()
}


var printPNGMap = (function (Control) {
  function printPNGMap(opt_options) {
    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = "<img class='icon-button-ol'  rel='tooltip' title='Print the map as png with legend' data-placement='right' src='assets/svg/si-glyph-print.svg'/>";

    var element = document.createElement('div');
    element.className = 'rotate-print ol-unselectable ol-control';
    element.appendChild(button);

    Control.call(this, {
      element: element,
      target: options.target
    });

    button.addEventListener('click', this.handlePrint.bind(this), false);
  }

  if (Control) printPNGMap.__proto__ = Control;
  printPNGMap.prototype = Object.create(Control && Control.prototype);
  printPNGMap.prototype.constructor = printPNGMap;

  printPNGMap.prototype.handlePrint = function handlePrint() {
    printMyMaps()
  };

  return printPNGMap;
}(Control));
map.addControl(
  new printPNGMap()
)

function printMyMaps() {


  if (document.getElementsByClassName('ol-legend')[0].classList.toggle('ol-collapsed') === true) {
    document.getElementsByClassName('ol-legend')[0].classList.toggle('ol-collapsed')
  }


  html2canvas(document.getElementsByClassName('ol-legend')[0]).then(canvas => {
    html2canvas(document.getElementsByClassName('ol-attribution')[0]).then(attributions => {
      html2canvas(document.getElementsByClassName('ol-scale-line')[0]).then(scale => {
      // document.body.appendChild(canvas)
      // var ctx = new C2S(500,500);


      var mapCanvas = $('canvas')[0]
      var newCanvas = document.createElement('canvas')
      newCanvas.width = Math.max(mapCanvas.width, canvas.width)
      newCanvas.height = mapCanvas.height + canvas.height
      var ctx = newCanvas.getContext('2d')

      // var gg = ctx.createImageData(mapCanvas.width, mapCanvas.height)
      var test = mapCanvas.getContext('2d').getImageData(0, 0, mapCanvas.width, mapCanvas.height)


      ctx.drawImage(mapCanvas, 0, 0)
      ctx.drawImage(canvas, 0, mapCanvas.height)
      ctx.drawImage(attributions, newCanvas.width - attributions.width, mapCanvas.height - attributions.height )
      ctx.drawImage(scale, 5, mapCanvas.height - scale.height - 5 )

      // newCanvas.toBlob(function (blob) {
      //   saveAs(blob, 'map.png');
      // }, 'image/png', 1);
      var dataURL = newCanvas.toDataURL(1,{ pixelRatio: 150 });
          saveAs(dataURL, 'stage.png');

      });
    });
  });
  map.renderSync();
}

var centerMyMap = (function (Control) {
  function centerMyMap(opt_options) {
    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = "<img class='icon-button-ol'  rel='tooltip' title='Center the map around the current links' data-placement='right' src='assets/svg/si-glyph-screen-ful.svg'/>";

    var element = document.createElement('div');
    element.className = 'rotate-center ol-unselectable ol-control';
    element.appendChild(button);

    Control.call(this, {
      element: element,
      target: options.target
    });

    button.addEventListener('click', this.handleCenter.bind(this), false);
  }

  if (Control) centerMyMap.__proto__ = Control;
  centerMyMap.prototype = Object.create(Control && Control.prototype);
  centerMyMap.prototype.constructor = centerMyMap;

  centerMyMap.prototype.handleCenter = function handleCenter() {
    
    centerMap()
  };  
  return centerMyMap;
}(Control));
map.addControl(
  new centerMyMap()
)

var refreshMap = (function (Control) {
  function refreshMap(opt_options) {
    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = "<img class='icon-button-ol'  rel='tooltip' title='Export data as geojson' data-placement='right'  src='assets/svg/si-glyph-backward-page.svg'/>";

    var element = document.createElement('div');
    element.className = 'rotate-refresh ol-unselectable ol-control';
    element.appendChild(button);

    Control.call(this, {
      element: element,
      target: options.target
    });

    button.addEventListener('click', this.handlerefresh.bind(this), false);
  }

  if (Control) refreshMap.__proto__ = Control;
  refreshMap.prototype = Object.create(Control && Control.prototype);
  refreshMap.prototype.constructor = refreshMap;

  refreshMap.prototype.handlerefresh = function handlerefresh() {
    exportLinksAndNodes(data, global_data.filter, global_data)
  }  
  return refreshMap;
}(Control));
map.addControl(
  new refreshMap()
)

function refreshMapAndGoBack(){
  $('.arrival').show(50)

    const layers = [...map.getLayers().getArray()]
    layers.forEach((layer) => map.removeLayer(layer))

    map.setView(new View({
      center: [0.00, -0.00],
      //projection:projection.name,
      zoom: 0,
      minZoom: -2,
      maxZoom: 25
    }))
  $('#importIDOri').children().remove()
  $('#importIDDest').children().remove()
  $('#importIDVol').children().remove()
  $('#importNodeID').children().remove()
  if ($("#importIDImportStructComplement") !== null) {
    $("#importIDImportStructComplement").parent().remove();
  }

  delete global_data.filter.node
  global_data.filter.node = []
  delete global_data.filter.link
  global_data.filter.link = []
  $('#accordionLayerControl').children().remove()
  
  
  $('#filterDiv').children().slice(3).remove()
  // $('#importIDImportStructComplement').remove()

}

map.on('moveend', function (e) {
  // 
  // 
  if (global_data.legend.node.legend !== null) {
    global_data.legend.node.legend.refresh({
      force: true
    })
    global_data.legend.link.legend.refresh({
      force: true
    })
  }
});




export function readData(data, ext) {


  if (ext === 'json') {
    return JSON.parse(data);
  } else if (ext === "csv") {
    return papaparse(data, {
      header: true
    }).data
  } else if (ext === "geojson") {
    return JSON.parse(data);
  }

}

function useExistingNodes() {

  document.getElementById('label_nodes').innerHTML = "Levels"
  $.getJSON("public/data/save/saved_nodes.json", function (json) {
    
    data.saved_nodes = json
    var keys = Object.keys(json)
    
    for (var p = 0; p < keys.length; p++) {
      $('#importIDStruct').append($('<option>', {
          text: keys[p]
        })
        .attr("value", keys[p]))
    }
    
    document.getElementById('importIDStruct').addEventListener("change", function () {
      setupRegions()
    });
    setupRegions()
    // setupNodes()
  })
  
}

function setupRegions() {
  if (document.getElementById('importSubRegionsStruct') !== null) {
    $('#importSubRegionsStruct').parent().parent().remove()
    $('#importNodesStruct').parent().parent().remove()
  }

  $('#importIDStruct').parent().parent().parent()
    .append($('<div>')
      .attr('class', 'col-md-4')
      .append($('<p>')
        .append($('<label>', {
            text: 'Region'
          })
          .attr('for', 'select')
        )
        .append($('<select>')
          .attr('class', 'custom-select')
          .attr('id', 'importSubRegionsStruct')
        )
      )
    )
  var submap = document.getElementById('importIDStruct').value
  var keys = Object.keys(data.saved_nodes[submap])
  
  for (var p = 0; p < keys.length; p++) {
    $('#importSubRegionsStruct').append($('<option>', {
        text: keys[p]
      })
      .attr("value", keys[p]))
  }
  document.getElementById('importSubRegionsStruct').addEventListener("change", function () {
    setupNodes()
  });
  setupNodes()
}

function setupNodes() {
  if (document.getElementById('importNodesStruct') !== null) {
    // $('#importSubRegionsStruct').parent().parent().remove()
    $('#importNodesStruct').parent().parent().remove()
  }
  var submap = document.getElementById('importIDStruct').value
  var region = document.getElementById('importSubRegionsStruct').value
  var keys = Object.keys(data.saved_nodes[submap][region])
  var text = '"- Categorial => qualitative selector' + data.saved_nodes[submap][region] + '  "'
  
  $('#importIDStruct').parent().parent().parent()
    .append($('<div>')
      .attr('class', 'col-md-4')
      .append($('<p>')
        .append('<label for="valueTofilter">Code <button  class="badge badge-pill badge-secondary"  id="buttonTypeMapToLoad" data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content="nothing"><img class="small-icon" src="assets/svg/si-glyph-info.svg"/></button></label>')
        .append($('<select>')
          .attr('class', 'custom-select')
          .attr('id', 'importNodesStruct')
        )
      )
    )
  // var keys = Object.keys(json)
  for (var p = 0; p < keys.length; p++) {
    $('#importNodesStruct').append($('<option>', {
        text: keys[p]
      })
      .attr("value", keys[p]))
  }

  var mapnodes = document.getElementById('importNodesStruct').value
  $("#buttonTypeMapToLoad").attr("data-content", "Used ID : " + data.saved_nodes[submap][region][mapnodes].code)
  $('[data-toggle="popover"]').popover()

  document.getElementById('importNodesStruct').addEventListener("change", function () {
    var submap = document.getElementById('importIDStruct').value
    var region = document.getElementById('importSubRegionsStruct').value
    var mapnodes = document.getElementById('importNodesStruct').value
    $("#buttonTypeMapToLoad").attr("data-content", "Used ID : " + data.saved_nodes[submap][region][mapnodes].code)
    $('[data-toggle="popover"]').popover()
  });
}


function importFlowToMap() {
  data.links = readData(data.rawLinkData, global_data.files.Ltype);
  
  var keys = Object.keys(data.links[0]);
  for (var p = 0; p < keys.length; p++) {
    $('#importIDOri').append($('<option>', {
        text: keys[p]
      })
      .attr("value", keys[p]))
    $('#importIDDest').append($('<option>', {
        text: keys[p]
      })
      .attr("value", keys[p]))
    $('#importIDVol').append($('<option>', {
        text: keys[p]
      })
      .attr("value", keys[p]))
  }
}


function showParameterIDSNodes() {


  if (document.getElementById('importLatStruct') !== null || global_data.files.Ntype === "geojson") {
    $('#importLatStruct').parent().parent().remove()
    $('#importLonStruct').parent().parent().remove()
  }

  if (document.getElementById('importIDNodeStruct') !== null) {
    $('#importIDNodeStruct').children().remove()
  }

  $('#importIDNodeStruct')
    .append($('<p>')
      .append($('<label>', {
          text: 'ID'
        })
        .attr('for', 'select')
      )
      .append($('<select>')
        .attr('class', 'custom-select')
        .attr('id', 'importNodeID')
      )
    )

  if (global_data.files.Ntype === 'csv') {


    $('#importIDImportStructComplement')
      .append($('<div>')
        .attr('class', 'col-md-6')
        .append($('<p>')
          .append($('<label>', {
              text: 'Lat'
            })
            .attr('for', 'select')
          )
          .append($('<select>')
            .attr('class', 'custom-select')
            .attr('id', 'importLatStruct')
          )
        )
      )


      .append($('<div>')
        .attr('class', 'col-md-6')
        .append($('<p>')
          .append($('<label>', {
              text: 'Long'
            })
            .attr('for', 'select')
          )
          .append($('<select>')
            .attr('class', 'custom-select')
            .attr('id', 'importLonStruct')
          )
        )
      )

  }

  if (global_data.files.Ntype === 'csv') {
    var keys = Object.keys(data.nodes[0]);
  } else {
    var keys = Object.keys(data.nodes.features[0].properties);
  }

  for (var p = 0; p < keys.length; p++) {
    $('#importNodeID').append($('<option>', {
        text: keys[p]
      })
      .attr("value", keys[p]))
    if (global_data.files.Ntype === 'csv') {
      $('#importLatStruct').append($('<option>', {
          text: keys[p]
        })
        .attr("value", keys[p]))
      $('#importLonStruct').append($('<option>', {
          text: keys[p]
        })
        .attr("value", keys[p]))
    }
  }


}

//TODO ADD BETTER SCALE
export function getZoomFromVerticalBounds(distance) {
  // y1 = ol.proj.transform([0,89.9], 'EPSG:4326', projection.name)
  // y2 = ol.proj.transform([0,-89.9], 'EPSG:4326', projection.name)
  var bounds = 50000
  if (distance < bounds) {
    return 13;
  } else if (distance < bounds * 5) {
    return 8;
  } else if (distance < bounds * 25) {
    return 6;
  } else if (distance < bounds * 125) {
    return 3;
  } else {
    return 1;
  }
}


// convertCSV_JSON()
export function createGeoJSON(Json_data) {
  try{
  var len = Json_data.length
  var points = [];
  for (var p = 0; p < len; p++) {
    // 
    var point = turf.point([Number(Json_data[p][global_data.ids.lat]), Number(Json_data[p][global_data.ids.long])], Json_data[p]);
    points.push(point)
  }

  return turf.featureCollection(points)
  }
  catch{
    alert("The nodes file is not well standardised \n Please check your file")
  }
}

function importIDSFlow() {

  global_data.ids.linkID[0] = document.getElementById('importIDOri').value
  global_data.ids.linkID[1] = document.getElementById('importIDDest').value
  global_data.ids.vol = document.getElementById('importIDVol').value
  global_data.files.aggr = document.getElementById('importAggrFun').value
}

function importFlowAndUserNodes() {

  global_data.ids.nodeID = document.getElementById('importNodeID').value
  if (global_data.files.Ntype === 'csv') {

    global_data.ids.long = document.getElementById('importLatStruct').value
    global_data.ids.lat = document.getElementById('importLonStruct').value
    data.nodes = createGeoJSON(data.nodes);

  }
  importData()
}

function importFlowAndPresetNodes() {

  global_data.files.Ntype = "geojson"
  var region = document.getElementById('importIDStruct').value
  var subregion = document.getElementById('importSubRegionsStruct').value
  var map_nodes = document.getElementById('importNodesStruct').value
  var path = data.saved_nodes[region][subregion][map_nodes].file
  global_data.ids.nodeID = data.saved_nodes[region][subregion][map_nodes].id
  $.getJSON(path, function (json) {
    data.nodes = json;
    importData();
  })
}

function importData() {

  data.rawLinkData = null;
  data.rawStructureData = null;

  var maxX = - Infinity
  var minX = Infinity
  var maxY = - Infinity
  var minY = Infinity

  var len = data.links.length;
  var used_nodes = []

  for (var i = 0; i < len; i++) {
    if (!used_nodes.includes(data.links[i][global_data.ids.linkID[0]])) {
      used_nodes.push(data.links[i][global_data.ids.linkID[0]])
    }
    if (!used_nodes.includes(data.links[i][global_data.ids.linkID[1]])) {
      used_nodes.push(data.links[i][global_data.ids.linkID[1]])
    }
  }

  var list_id_nodes = []
  var list_doublon_nodes = []
  var len = data.nodes.features.length;
  for (var p = 0; p < len; p++) {

    if (!list_id_nodes.includes(data.nodes.features[p].properties[global_data.ids.nodeID]) && used_nodes.includes(data.nodes.features[p].properties[global_data.ids.nodeID])) {
      data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]] = data.nodes.features[p];

      var centroid = getCentroid(data.nodes.features[p], global_data.projection.name)
      // 
      data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]].properties["centroid"] = centroid
      data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]].properties[global_data.ids.vol] = 0

      list_id_nodes.push(data.nodes.features[p].properties[global_data.ids.nodeID])

      if (maxX < centroid[0]) {
        maxX = centroid[0]
      }
      if (minX > centroid[0]) {
        minX = centroid[0]
      }
      if (maxY < centroid[1]) {
        maxY = centroid[1]
      }
      if (minY > centroid[1]) {
        minY = centroid[1]
      }
    } else {
      list_doublon_nodes.push(data.nodes.features[p].properties[global_data.ids.nodeID])
    }

  }



  var lx = maxX - minX
  var ly = maxY - minY
  global_data.style.ratioBounds = Math.max(lx, ly) * 0.0002
  var newCenter = [minX + lx / 2, minY + ly / 2]

  
  


  // map.getView().setCenter(newCenter)
  // map.getView().setZoom(getZoomFromVerticalBounds(ly));
  global_data.zoom = getZoomFromVerticalBounds(ly)
  newCenter = transform(newCenter,global_data.projection.name,"EPSG:4326")
  global_data.center = newCenter
  var error_message = ""
    if (list_doublon_nodes.length !== 0) {
    
    error_message = list_doublon_nodes.length + " nodes have been removed. \n No links have for origin or destination these nodes \n The removed nodes ID are "+list_doublon_nodes.toString()
  }
  data.links = checkIDLinks(data.links, Object.keys(data.hashedStructureData), global_data.ids.linkID[0], global_data.ids.linkID[1], error_message)

  computeMinStatNode(data.hashedStructureData, data.links, global_data.ids.linkID[0], global_data.ids.linkID[1], global_data.ids.vol);

  data.links = prepareLinkData(data.links, global_data.ids.linkID[0], global_data.ids.linkID[1], data.hashedStructureData, global_data.ids.vol);

  //TODO ADD GESTION OF UNDEFINED NODES REMOVE OR 0/0
  var isCSV = global_data.files.Ntype !== 'geojson'
  computeDistance(data.hashedStructureData, data.links, global_data.ids.linkID[0], global_data.ids.linkID[1], isCSV, 'kilometers');

  
  document.getElementById("addFilterButton").disabled = false;

  $("#featureCard").toggle();
  computeTotalVolume(data.links, global_data.ids.vol, global_data)
  applyPreselectMap(global_data, global_data.ids.vol, data)

  map.getView().fit(getLayerFromName(map, 'link').getSource().getExtent())
  if (document.getElementsByClassName('ol-legend')[0].classList.toggle('ol-collapsed') === true) {
    document.getElementsByClassName('ol-legend')[0].classList.toggle('ol-collapsed')
  }
  $('.arrival').hide(50)

  // $().children().remove()
  // $().children().remove()


}

function errorModal() {

  // showSemioParameter()
  $('#semio').modal({
    // keyboard: false,
    // backdrop: false,
    show: true

  })

}

function progressBarLoading(id, value) {
  
  $("#" + id).attr("aria-valuenow", value)
  document.getElementById(id).style.width = value + "%";
}

export function prepareLinkData(links, id_ori, id_dest, hash_nodes, id_vol) {
  var len = links.length;
  var newLinkData = [];
  for (var p = 0; p < len; p++) {
    if (links[p][id_ori] === links[p][id_dest]) {
      hash_nodes[links[p][id_ori]].properties[id_vol] = links[p][id_vol]

    } else {
      newLinkData.push(links[p])
    }
  }
  return newLinkData;
}


function applyPreselectMap(main_object, id_volume, data) {
  setupPresetMapStyleLink(main_object.style.link, id_volume, data.links)
  setupPresetMapFilterLink(main_object.filter.link, id_volume, data.links)
  setupPresetMapStyleNode(main_object.style.node, id_volume, data.hashedStructureData)

  loadFilter(main_object.filter)

  var id_links = testLinkDataFilter(global_data.filter.link, data)
  var selected_nodes = applyNodeDataFilter(data.hashedStructureData)

  addNodeLayer(map, data.links, data.hashedStructureData, main_object.style, id_links, selected_nodes)
  generateLinkLayer(map, data.links, data.hashedStructureData, main_object.style, main_object.ids.linkID[0], main_object.ids.linkID[1], id_links, selected_nodes)
  getLayerFromName(map,'node').setZIndex(1)
  addLegendToMap()
}

function setupPresetMapStyleLink(style, id_volume, links) {
  var arrayVolume = links.map(function (link) {
    return link[id_volume]
  })
  style.color = {
    "palette": "YlGnBu",
    "cat": "number",
    "var": id_volume,
    "max": Math.max(...arrayVolume),
    "min": Math.min(...arrayVolume)
  }

  style.opa = {
    "cat": null,
    "var": "fixed",
    "max": null,
    "min": null,
    "vmax": "0.85"
  }

  style.size = {
    "cat": "Linear",
    "var": id_volume,
    "max": Math.max(...arrayVolume),
    "min": Math.min(...arrayVolume),
    "ratio": "100"
  }

  style.geometry = {
    "oriented": "oriented",
    "type": "StraightArrow",
    "head": {
      "height": 0.5,
      "width": 0.5
    },
    "place": {
      "base": 0.5,
      "height": 0.5
    }
  }
}


function setupPresetMapStyleNode(style, id_volume, nodes) {

  var arrayVolume = Object.keys(nodes).map(function (node) {
    return nodes[node].properties["degree"]
  })
  style.color = {
    "palette": "OrRd",
    "cat": "number",
    "var": "degree",
    "max": Math.max(...arrayVolume),
    "min": Math.min(...arrayVolume)
  }

  style.opa = {
    "cat": null,
    "var": "fixed",
    "max": null,
    "min": null,
    "vmax": "0.85"
  }
  var arrayVolume = Object.keys(nodes).map(function (node) {
    return nodes[node].properties["degree"]
  })
  style.size = {
    "cat": "Linear",
    "ratio": "100",
    "var": "degree",
    "max": Math.max(...arrayVolume),
    "min": Math.min(...arrayVolume)
  }
  style.text = "Choose..."

}

function setupPresetMapFilterLink(filter, id_volume, links) {
  var arrayVolume = links.map(function (link) {
    return link[id_volume]
  }).sort(function (a, b) {
    return b - a;
  })
  filter.push({
    "variable": id_volume,
    "values": [
      arrayVolume[parseInt(arrayVolume.length * 0.1)],
      Math.max(...arrayVolume)
    ],
    "filter": "numeral"
  })

}


function reduceDataset(geojson) {

  var geo = geojson.features
  
  var len = geo.length
  var gg = []
  for (var i = 0; i < len; i++) {
    if (geo[i].geometry !== null) {
      geo[i] = turf.point(getCentroid(geo[i], "EPSG:4326"), geo[i].properties)
    }
  }
  
  return geojson
}

$('#carouselDraw').carousel()
$('#carouselFilter').carousel()
$('#carouselExampleInterval').carousel()

$(".arrival").css('overflow-y', 'visible')
// worker = new Worker("./worker/test_worker.js"); // Déclaration du worker
//  worker.onmessage = function(event) {
//   
//   
//     };

// worker.postMessage(["bonjour",2])
// // 

// var onmessage = function(e) {
//   
//   // var workerResult = 'Résultat : ' + (e.data[0] * e.data[1]);
//   
//   postMessage('e');
// }

// global.worker = new Worker(URL.createObjectURL(new Blob(['('+fn+')'])))

// worker.onmessage = function(e) {
//     
//   }
// worker.postMessage(["bonjour",2]);

// function run(fn) {
//   return new Worker(URL.createObjectURL(new Blob(['('+fn+')()'])));
// }

// const worker = run(function() {
  
//   postMessage('I am a worker!');
  
//   self.close();
// });

// worker.onmessage = (event) => 
