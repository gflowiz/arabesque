//TODO remove all funciton in other files like import files 
import {refreshFilterModal, addFilterToScreen, checkDataToFilter, testLinkDataFilter, applyNodeDataFilter } from "./filter.js"
import {addOSMLayer, addBaseLayer, addGeoJsonLayer, addNodeLayer, generateLinkLayer, addLegendToMap, showTileLayersName, addTileLayer, getTileUrl} from "./layer.js";
import {loadMapFromPresetSave, loadFilter, loadZippedMap} from "./save.js";
import {getCentroid, changeProjection} from "./projection.js";
import {computeMinStatNode, computeDistance, checkIDLinks} from "./stat.js";
import {addLayerGestionMenu} from './control.js';
import {showGeometryParameter,setupArrowParameter, setupHead} from './geometry.js';
import {setupStyleAndAddLayer , showSemioParameter, generatePaletteMultiHue2, changeSemioParameter } from './semiology.js'

import * as turf from "@turf/turf"

import CanvasScaleLine from 'ol-ext/control/CanvasScaleLine'
import Print from 'ol-ext/control/Print'
import 'ol-ext/control/Print.css'

import {register} from 'ol/proj/proj4.js';
import {Map, View } from 'ol';
      // import {} from 'ol/control.js';
      // import {defaults as defaultControls, FullScreen} from 'ol/control.js';
import {ScaleLine, defaults as defaultControls, Control, FullScreen} from 'ol/control.js';
import {click, pointerMove} from 'ol/events/condition.js';
import Select from 'ol/interaction/Select.js';

import WebGLMap from 'ol/WebGLMap.js';
import * as wbg from 'ol/webgl.js';

import Hover from 'ol-ext/interaction/Hover'
import Popup from "ol-ext/overlay/Popup"
import CanvasTitle from "ol-ext/control/CanvasTitle"
// import OLButton from "ol-ext/control/Button"ew ol.control.CanvasTitle();
import "ol-ext/overlay/Popup.css"

import {parse as papaparse} from "papaparse"
import JSZip from 'jszip'
import html2canvas from 'html2canvas'
import jsPDF from 'jsPDF';
import { saveAs } from 'file-saver';

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';

import 'spectrum-colorpicker/spectrum.js'
import 'spectrum-colorpicker/spectrum.css'

import "../css/control.css"

import  proj4 from 'proj4';

      import WKT from 'ol/format/WKT.js';


    $("#strokeColorpickerAdd").spectrum({
        color: "#1E90FF"
    });
    $("#fillColorpickerAdd").spectrum({
        color: "aliceblue"
    });

    $("#strokeColorpickerGeoJson").spectrum({
        color: "#1E90FF"
    });
    $("#fillColorpickerGeoJson").spectrum({
        color: "aliceblue"
    });

  var heighttokeep = $(".container-fluid").height()
  document.getElementById('map').style.height=heighttokeep +"px"

document.getElementById('removeFilterLayout').addEventListener("click", function(){
  var el = document.getElementById('removeFilterLayout')

// document.getElementById("LoadZipMapButton").disabled = false;

  var widthlayout = $("#filterDiv").outerWidth() 
  if(el.style.right === "0px"){

    var newSize = $('#map').outerWidth()-widthlayout ;
    var widthlayout = $("#filterDiv").outerWidth() 
    $('#removeFilterLayout').animate({ 
        right: widthlayout+"px",
      }, 1000 );
    

    $("#filterDiv").animate(
      {
        right: "0px",
      }, 1000);

    $("#map").animate(
      {
        width: newSize +"px",
        right: widthlayout+"px",
      }, 1000, function(){map.updateSize()});


    $('.right_icon').remove()
    $('#removeFilterLayout').append('<img src="assets/svg/si-glyph-arrow-right.svg" class="right_icon"></img>')
    // map.updateSize()
  }
  else{
    
    var newSize =$('#map').outerWidth()+widthlayout ;

    $('#removeFilterLayout').animate({ 
        right: "0px",
              }, 1000 );
    $("#filterDiv").animate(
      {
        right: "-"+widthlayout+"px",
      }, 1000);

    $("#map").animate(
      {
        width: newSize +"px",
        right: "0px",
      }, 1000, function(){map.updateSize()});


    $('.right_icon').remove()

    $('#removeFilterLayout').append('<img src="assets/svg/si-glyph-arrow-left.svg" class="right_icon"></img>')
    // map.updateSize()
}
  });


document.getElementById('removeLayerLayout').addEventListener("click", function(){
  var el = document.getElementById('removeLayerLayout')
  var widthlayout = $("#layerLayout").outerWidth() 
  var buttonLeft =  $("#layerLayout").outerWidth() 
  if(el.style.left === "0px"){
    document.getElementById('map').style.position = 'absolute'
    var newSize = $('#map').outerWidth()-widthlayout ;
    

    $('#removeLayerLayout').animate({ 
        left: buttonLeft+"px",
      }, 1000 );
    
    $("#layerLayout").animate(
      {
        left: "0px",
      }, 1000);
    $("#map").animate(
      {
        width: newSize +"px",
        left: "0px",
      }, 1000, function(){map.updateSize()});

    $('.left_icon').remove()
    $('#removeLayerLayout').append('<img src="assets/svg/si-glyph-arrow-left.svg" class="left_icon"></img>')
     
  }
  else{

    document.getElementById('map').style.position = 'absolute'
    var newSize =$('#map').outerWidth()+widthlayout ;
    // el.style.right = '0px' ;


    $('#removeLayerLayout').animate({ 
        left: "0px",
              }, 1000 );
    $("#layerLayout").animate(
      {
        left: "-"+widthlayout+"px",
      }, 1000);

    $("#map").animate(
      {
        width: newSize +"px",
        left: "-"+widthlayout+"px",
      }, 1000, function(){map.updateSize()});


    $('.left_icon').remove()

    $('#removeLayerLayout').append('<img src="assets/svg/si-glyph-arrow-right.svg" class="left_icon"></img>')
    // map.updateSize()
}

  });

var widthlayout = $("#layerLayout").outerWidth() ;
document.getElementById("removeLayerLayout").style.left = widthlayout + 'px' ;

var widthlayout = $("#filterDiv").outerWidth() ;
document.getElementById("removeFilterLayout").style.right = widthlayout + 'px' ;


generatePaletteMultiHue2()



var select = document.getElementById("projection"); 
for(var i=0; i<Proj.length; i++){
 proj4.defs(Proj[i].name, Proj[i].proj4);


    var el = document.createElement("option");
    el.textContent = Proj[i].name;
    el.value = i;
    select.appendChild(el);
}
register(proj4);


global.data = {
    hashedStructureData:{},
    filter:{link:{}, node:{}}
  }

global.global_data = {
  "files":{
      "node":null,
      "link": null,
      "Ltype":null,
      "Ntype":null,
      "aggr":"sum"
    },
  "layers":{
    features:{},
    base:{},
    osm:{}
  },
  "style":{
      "link":{
            "color":{
              "palette":null,
              "cat":null,
              "var":null,
              "max":null,
              "min":null
            },          
            "opa":{
              "cat": null,
              "var":null,
              "max":null,
              "min":null,
              "vmax":null
              },
            "size":{
                "cat":null,
                "var":null,
                "max":null,
                "min":null,
                "ratio":null
              },
            "geometry":{
                "oriented":true,
                "type": null,
                "head":{
                  "height":null,
                  "width":null
                  },
                "place":{
                  "base":null,
                  "height": null
                  }
              }
            },

      "node":{
        "color":{
            "palette":null,
            "cat":null,
            "var":null,
            "max":null,
            "min":null
          },
          "size":{
              "cat":null,
              "ratio":null,
              "var":null,
              "max":null,
              "min":null
            },
          "opa":{
              "cat":null,
              "var":null,
              "vmax":null,
              "max":null,
              "min":null
            },
        "text":null,
        "ratioBounds":null
        }
    },
    "filter":{"link":[],
              "node": []},
    "ids":{
      "nodeID":null,
      "linkID":[null,null],
      "vol":"count",
      "long":"lat",
      "lat":"lon"
    },
    "projection":{},
    "legend":{
        "link":{
          "legend":null,
          "color": null,
          "opa": null
          },
        "node":{
          "legend":null,
          "color": null,
          "opa": null
          }}
};

global_data.projection = Proj[0]
// Add listener to all button of application
// onclick properties did'nt work with webpack so button must be update manually by adding an event listener

// Home Page loadZippedMap
document.getElementById('importDataButton').addEventListener("click", function(){importFlowToMap()}); 
document.getElementById('localMap').addEventListener("click", function(){loadMapFromPresetSave('local', map, global_data, data)}); 
document.getElementById('countryMap').addEventListener("click", function(){loadMapFromPresetSave('country', map, global_data, data)}); 
document.getElementById('worldMap').addEventListener("click", function(){loadMapFromPresetSave('world', map, global_data, data)}); 
document.getElementById('LoadZipMapButton').addEventListener("click", function(){loadZippedMap()}); 
// Main Page -- Layer
// document.getElementById('OSMbutton').addEventListener("click", function(){}); 
document.getElementById('buttonProjection').addEventListener("click", function(){changeProjection(global_data.layers, global_data.center)}); 
document.getElementById('addNewNodeFeaturesButton').addEventListener("click", function(){showSemioParameter('Node')}); 
document.getElementById('addNewLinkFeaturesButton').addEventListener("click", function(){
  showSemioParameter('Link')
  showGeometryParameter()
}); 

document.getElementById('arrowtype').addEventListener("change", function(){setupArrowParameter()}); 
document.getElementById('arrowData').addEventListener("change", function(){setupHead()}); 
// Main Page -- filter
document.getElementById('selectFilterButton').addEventListener("click", function(){
  refreshFilterModal();
  checkDataToFilter()
}); 
// Modal -- AddaddNewTileLayerButtonAdd
document.getElementById('addNewLayerButtonAdd').addEventListener("click", function(){addBaseLayer(map, global_data.layers, 'Add')}); 
document.getElementById('tileLayersAdd').addEventListener("change", function(){showTileLayersName(document.getElementById('tileLayersAdd').value)}); 
document.getElementById('OSMbutton').addEventListener("click", function(){
  // 
  showTileLayersName(document.getElementById('tileLayersAdd').value)
}); 
document.getElementById('addNewTileLayerButtonAdd').addEventListener("click", function(){
  var url  = getTileUrl()
  addTileLayer(map, global_data.layers.osm, url, document.getElementById('tileLayersNameSelectorOptions').value)
}); 
// Modal -- Filter
// document.getElementById('refreshFilterButton').addEventListener("click", function(){refreshFilterModal()}); 
document.getElementById('addFilterButton').addEventListener("click", function(){addFilterToScreen()}); 
// // Modal -- SemioaddSemioButton
// document.getElementById('featureChosenAddLink').addEventListener("change", function(){showSemioParameter('Link')}); 
// document.getElementById('featureChosenAddNode').addEventListener("change", function(){showSemioParameter('Node')}); 
// document.getElementById('refreshSemioButton').addEventListener("click", function(){refreshSemioModal()}); 
document.getElementById('addSemioButtonLink').addEventListener("click", function(){setupStyleAndAddLayer(global_data.style, 'Link')});
document.getElementById('addSemioButtonNode').addEventListener("click", function(){setupStyleAndAddLayer(global_data.style, 'Node')});
// Modal -- Import
document.getElementById('addNewLayerButtonGeoJson').addEventListener("click", function(){
  var layer_name = document.getElementById("nameGeoJson").value;
  var opacity = document.getElementById("opacityGeoJson").value;
  var stroke_color = $("#strokeColorpickerGeoJson").spectrum('get').toHexString();
  var fill_color = $("#fillColorpickerGeoJson").spectrum('get').toHexString();
  global_data.layers.base[layer_name] = {}
  global_data.layers.base[layer_name].layer = addGeoJsonLayer(map, data.geoJson, layer_name, opacity, stroke_color, fill_color)
  global_data.layers.base[layer_name].style = { stroke: stroke_color, 
        fill: fill_color,
        opacity:opacity};
  global_data.layers.base[layer_name].added = true
  data[layer_name] = data.geoJson
  reduceDataset(data.geoJson)
  addLayerGestionMenu(layer_name)
});

// Modal -- import 

// document.getElementById('importFileLocationButton').addEventListener("click", function(){importFlowToMap()}); 
document.getElementById('importPresetLocationButton').addEventListener("click", function(){
  importIDSFlow()
  useExistingNodes()
});
document.getElementById('importUserLocationButton').addEventListener("click", function(){
  importIDSFlow()
});  
document.getElementById('importPresetMapButton').addEventListener("click", function(){importFlowAndPresetNodes()}); 
document.getElementById('importedFileLocationButton').addEventListener("click", function(){
  importFlowAndUserNodes()
});  

// document.getElementById('layerControlList').addEventListener("mouseleave", function(){
//   $("#layerControlList").removeAttr("data-tooltip")
// console.log('FFFFFFFFFFFFFFFFFFFFFFFFF')
// }

//   ); 
// Modal -- Change
// Button -- right
// console.log(document.getElementById('removeFilterLayout'))
// document.getElementById('removeFilterLayout').addEventListener("click", function(){
 
// })
document.getElementById("importDataButton").disabled = true;
document.getElementById("LoadZipMapButton").disabled = true;

// document.getElementById('importIdButton').addEventListener("click", function(){

//   importData()
// }); 


(function(){
    
    function onChange(event) {
      // console.log(save.loadMapFromPresetSave)
        var reader = new FileReader();
        reader.onload = onReaderLoad;

        reader.readAsText(event.target.files[0]);
        global_data.files.Ntype = event.target.files[0].name.split('.')[event.target.files[0].name.split('.').length - 1]
        document.getElementById("Node").disabled = true;
        document.getElementById("label_node").innerHTML = event.target.files[0].name;  
        console.log(global_data.files.Ntype)
        // data.nodes = readData(data.rawStructureData, global_data.files.Ntype);
        // showParameterIDSNodes()

    // document.getElementById("importDataButton").disabled = false;
    
  }

    function onReaderLoad(event){
        data.rawStructureData = event.target.result;
    
        data.nodes = readData(data.rawStructureData,global_data.files.Ntype);
        showParameterIDSNodes()
    }
    

    document.getElementById('Node').addEventListener('change', onChange);

}());

(function(){
    
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;

        reader.readAsText(event.target.files[0]);
        document.getElementById("label_geoJson").innerHTML = event.target.files[0].name;  
  }

    function onReaderLoad(event){
        data.geoJson = JSON.parse(event.target.result);
        
    }
    

    document.getElementById('geoJson').addEventListener('change', onChange);

}());

(function(){
    
    function onChange(event) {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);
        //console.log(event.target.files[0])
        global_data.files.Ltype = event.target.files[0].name.split('.')[event.target.files[0].name.split('.').length - 1]
        document.getElementById("Link").disabled = true; 
        document.getElementById("label_link").innerHTML = event.target.files[0].name;

       document.getElementById("importDataButton").disabled = false;
    }

    function onReaderLoad(event){
        data.rawLinkData = event.target.result;
        // console.log(event.target)
        
    }
    

    document.getElementById('Link').addEventListener('change', onChange);
    
}());


(function(){
    
    function onChange(event) {
      // console.log(save.loadMapFromPresetSave)
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        // console.log(event.target.files[0].name;)
        reader.readAsArrayBuffer(event.target.files[0]);
        // global_data.files.Ntype = event.target.files[0].name.split('.')[event.target.files[0].name.split('.').length - 1]
        
        document.getElementById("label_loadSavedZipMap").innerHTML = event.target.files[0].name;  
        // console.log(global_data.files.Ntype)
        // data.nodes = readData(data.rawStructureData, global_data.files.Ntype);
        // showParameterIDSNodes()

    // document.getElementById("importDataButton").disabled = false;
    
  }

    function onReaderLoad(event){
      var new_zip = new JSZip();
      JSZip.loadAsync(event.target.result).then(function (zip) {
        // new_zip.file("conf.json").async("string");
         // console.log(zip.files["dd.json"]);
          zip.files["conf.json"].async('string').then(function (fileData) {
            global_data = JSON.parse(fileData)
              global_data.legend =   {
                "link":{
                  "legend":null,
                  "color": null,
                  "opa": null
                  },
                "node":{
                  "legend":null,
                  "color": null,
                  "opa": null
                }
              }
            // console.log(JSON.parse(fileData)) // These are your file contents      
          })
          zip.files["data.json"].async('string').then(function (fileData) {
            data = JSON.parse(fileData) // These are your file contents      
          })
      })
      document.getElementById("LoadZipMapButton").disabled = false;
        // console.log(event.target.result);
    
        // data.nodes = readData(data.rawStructureData,global_data.files.Ntype);
        // showParameterIDSNodes()
    }
    

    document.getElementById('loadSavedZipMap').addEventListener('change', onChange);

}());


var select = document.getElementById("layersAdd"); 
var list_nameLayer = Object.keys(ListUrl)
for(var i=0; i<list_nameLayer.length; i++){
     
    var el = document.createElement("option");
    el.textContent = list_nameLayer[i];
    el.value = list_nameLayer[i];
    select.appendChild(el);
    //console.log(ListUrl[i].name)
}


global.map = new Map({
   controls: defaultControls().extend([
          new FullScreen()
        ]),
          renderer:'webgl',
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
      maxZoom: 30
          })
        });
map.addControl(new CanvasScaleLine());
// $('.ol-scale-line').css('left', '');
// document.getElementsByClassName("ol-scale-line")[0].style.left = ""
// document.getElementsByClassName("ol-scale-line")[0].style.right = "8px"

// var printControl = new Print()
// map.addControl(printControl);
    // CanvasTitle control
    var titleControl = new CanvasTitle();
    map.addControl(titleControl);
    document.getElementById('titleMap').addEventListener("change", function () { 
      // console.log(this.value)
      global_data.title = this.value
      titleControl.setTitle(this.value); });


// Display the style on select
  var popup = new Popup({ popupClass: 'tooltips', offsetBox:15 });
  map.addOverlay(popup);
  var hover = new Hover();
  map.addInteraction(hover);
  hover.on('leave', function(e) {
    popup.hide();
  });
  hover.on('hover', function(e) {

  var nodes_used = ["fixed"]
  var link_used = ["fixed"]
    if('link' === e.layer.get('name')){
      // console.log(e)    
      var str_to_show = '<b>'+e.feature.get('ori')+' => '+ e.feature.get('dest')+'</b><br/>'
      if (!link_used.includes(global_data.ids.vol)){
        str_to_show = str_to_show + global_data.ids.vol+" : "+e.feature.get(global_data.ids.vol)
      +"<br/>";
        link_used.push(global_data.ids.vol)
      }      
      if (!link_used.includes(e.feature.get('size').name)){
        str_to_show = str_to_show + e.feature.get('size').name+" : "+e.feature.get('size').value
      +"<br/>";
        link_used.push(e.feature.get('size').name)
      }    
      if (!link_used.includes(e.feature.get('color').name)){
        str_to_show = str_to_show + e.feature.get('color').name+" : "+e.feature.get('color').value
      +"<br/>";
        link_used.push(e.feature.get('color').name)
      }      
      if (!link_used.includes(e.feature.get('opa').name)){
        str_to_show = str_to_show + e.feature.get('opa').name+" : "+e.feature.get('opa').value
      +"<br/>";
        link_used.push(e.feature.get('opa').name)
      }
          popup.show(e.coordinate, str_to_show)
    }
    else if('node' === e.layer.get('name')){
      var str_to_show =  '<b>'+e.feature.get(global_data.ids.nodeID) +'</b>'
      +"<br/>"
      if (!nodes_used.includes(global_data.style.node.size.var)){
      str_to_show = str_to_show +global_data.style.node.size.var+" : "+e.feature.get(global_data.style.node.size.var)
      +"<br/>"
        nodes_used.push(global_data.style.node.size.var)
      }  
      if (!nodes_used.includes(global_data.style.node.color.var)){
      str_to_show = str_to_show +global_data.style.node.color.var+" : "+e.feature.get(global_data.style.node.color.var)
      +"<br/>"
        nodes_used.push(global_data.style.node.color.var)
      } 
      if (!nodes_used.includes(global_data.style.node.opa.var)){
      str_to_show = str_to_show +global_data.style.node.opa.var+" : "+e.feature.get(global_data.style.node.opa.var)
      +"<br/>"
        nodes_used.push(global_data.style.node.opa.var)
      }     
          popup.show(e.coordinate, str_to_show)
    }
    else  {
      popup.hide();
    }

      // +'<br/>'
      // +e.feature.get('pop').toLocaleString()+' hab.')
  });

    // map.on('click', function(event) {
    //     var features = map.getFeaturesAtPixel(event.pixel);
    //     console.log(features)
    //   });

      var exportZipMap = (function (Control) {
        function exportZipMap(opt_options) {
          var options = opt_options || {};

          var button = document.createElement('button');
          button.innerHTML = "<img class='icon-button-ol' src='assets/svg/si-glyph-floppy-disk.svg'/>";

          var element = document.createElement('div');
          element.className = 'rotate-north ol-unselectable ol-control';
          element.appendChild(button);

          Control.call(this, {
            element: element,
            target: options.target
          });

          button.addEventListener('click', this.handleExport.bind(this), false);
        }

        if ( Control ) exportZipMap.__proto__ = Control;
        exportZipMap.prototype = Object.create( Control && Control.prototype );
        exportZipMap.prototype.constructor = exportZipMap;

        exportZipMap.prototype.handleExport = function handleExport () {
          exportDataAndConf()
        };

        return exportZipMap;
      }(Control));
      map.addControl(
          new exportZipMap()
        )

function exportDataAndConf(){
  var zip = new JSZip();
  global_data.center = map.getView().getCenter()
  global_data.zoom = map.getView().getZoom()
  delete global_data.legend

  zip.file("data.json", JSON.stringify(data));
  zip.file("conf.json", JSON.stringify(global_data));
  // console.log(isCyclic(global_data))

  zip.generateAsync({type:"blob"})
    .then(function(content) {
        // see FileSaver.js
        saveAs(content, "Save_GFlowiz_Map.zip");
    });

  global_data.legend =   {
        "link":{
          "legend":null,
          "color": null,
          "opa": null
          },
        "node":{
          "legend":null,
          "color": null,
          "opa": null
          }}
    addLegendToMap()
}



      var printPNGMap = (function (Control) {
        function printPNGMap(opt_options) {
          var options = opt_options || {};

          var button = document.createElement('button');
          button.innerHTML = "<img class='icon-button-ol' src='assets/svg/si-glyph-print.svg'/>";

          var element = document.createElement('div');
          element.className = 'rotate-print ol-unselectable ol-control';
          element.appendChild(button);

          Control.call(this, {
            element: element,
            target: options.target
          });

          button.addEventListener('click', this.handlePrint.bind(this), false);
        }

        if ( Control ) printPNGMap.__proto__ = Control;
        printPNGMap.prototype = Object.create( Control && Control.prototype );
        printPNGMap.prototype.constructor = printPNGMap;

        printPNGMap.prototype.handlePrint = function handlePrint () {
          printMyMaps()
        };

        return printPNGMap;
      }(Control));
      map.addControl(
          new printPNGMap()
        )

function printMyMaps(){


    if(document.getElementsByClassName('ol-legend')[0].classList.toggle('ol-collapsed') === true)
    {
      document.getElementsByClassName('ol-legend')[0].classList.toggle('ol-collapsed')
    }   


    html2canvas(document.getElementsByClassName('ol-legend')[0]).then(canvas => {
      // document.body.appendChild(canvas)
      var mapCanvas = $('canvas')[0]
      var newCanvas = document.createElement('canvas')
      newCanvas.width = Math.max(mapCanvas.width, canvas.width)
      newCanvas.height = mapCanvas.height + canvas.height
      var ctx = newCanvas.getContext('2d')
      
      var gg = ctx.createImageData(mapCanvas.width, mapCanvas.height)
      var test = mapCanvas.getContext('2d').getImageData(0,0,mapCanvas.width, mapCanvas.height)


      ctx.drawImage(mapCanvas, 0 , 0)
      ctx.drawImage(canvas, 0 , mapCanvas.height)

      newCanvas.toBlob(function(blob) {
        saveAs(blob, 'map.png');
      }, 'image/webp',1);

    });
    map.renderSync();
}




map.on('moveend', function(e) {
// 
// console.log(map.getView().getResolution() )
  if(global_data.legend.node.legend !== null){
    global_data.legend.node.legend.refresh({force:true})
    global_data.legend.link.legend.refresh({force:true})
  }
});




export function readData(data, ext){

  
  if(ext === 'json'){
    return JSON.parse(data);
  }
  else if(ext === "csv"){
    return papaparse(data,{header: true}).data
  }  
  else if(ext === "geojson"){
    return JSON.parse(data);
  }

}

function useExistingNodes(){
  
  document.getElementById('label_nodes').innerHTML = "Levels"
  $.getJSON("public/data/save/saved_nodes.json",function(json){  
    console.log(json)
   data.saved_nodes = json
  var keys = Object.keys(json)
console.log(keys)
    for (var p = 0; p < keys.length; p++) {
      $('#importIDStruct').append($('<option>', {
          text: keys[p]
        })
        .attr("value", keys[p]))
    }
    console.log(data.saved_nodes)
    document.getElementById('importIDStruct').addEventListener("change", function(){setupRegions()});     
    setupRegions()
    // setupNodes()
  }) 
    console.log(data.saved_nodes)
}

function setupRegions(){
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
console.log(keys)
    for (var p = 0; p < keys.length; p++) {
      $('#importSubRegionsStruct').append($('<option>', {
          text: keys[p]
        })
        .attr("value", keys[p]))
    }
    document.getElementById('importSubRegionsStruct').addEventListener("change", function(){setupNodes()});
    setupNodes()
}

function setupNodes(){
  if (document.getElementById('importNodesStruct') !== null) {
    // $('#importSubRegionsStruct').parent().parent().remove()
    $('#importNodesStruct').parent().parent().remove()
  }
  var submap = document.getElementById('importIDStruct').value
  var region = document.getElementById('importSubRegionsStruct').value
  var keys = Object.keys(data.saved_nodes[submap][region])
  var text = '"- Categorial => qualitative selector'+data.saved_nodes[submap][region]+'  "'
console.log(keys)
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
    $("#buttonTypeMapToLoad").attr("data-content","Used ID : "+data.saved_nodes[submap][region][mapnodes].code)
    $('[data-toggle="popover"]').popover()

    document.getElementById('importNodesStruct').addEventListener("change", function(){
      var submap = document.getElementById('importIDStruct').value
      var region = document.getElementById('importSubRegionsStruct').value
      var mapnodes = document.getElementById('importNodesStruct').value
      $("#buttonTypeMapToLoad").attr("data-content","Used ID : "+data.saved_nodes[submap][region][mapnodes].code)
      $('[data-toggle="popover"]').popover()
    });
}


function importFlowToMap(){
  data.links = readData(data.rawLinkData, global_data.files.Ltype);
console.log(data.links)
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
export function getZoomFromVerticalBounds(distance){
// y1 = ol.proj.transform([0,89.9], 'EPSG:4326', projection.name)
// y2 = ol.proj.transform([0,-89.9], 'EPSG:4326', projection.name)
var bounds = 50000
if(distance < bounds){
  return 13;
}
else if (distance < bounds*5){
  return 8;
}
else if (distance < bounds*25){
  return 6;
}
else if (distance < bounds*125){
  return 3;
}
else{
  return 1;
}
}


// convertCSV_JSON()
export function createGeoJSON(Json_data)
{
  var len = Json_data.length
  var points = [];
  for(var p = 0; p < len; p++ ){
    var point = turf.point([Number(Json_data[p][global_data.ids.lat]),Number(Json_data[p][global_data.ids.long])], Json_data[p]);
    points.push(point)
  }
  
  return turf.featureCollection(points)
}

function importIDSFlow(){

  global_data.ids.linkID[0] = document.getElementById('importIDOri').value
  global_data.ids.linkID[1] = document.getElementById('importIDDest').value
  global_data.ids.vol = document.getElementById('importIDVol').value
  global_data.files.aggr = document.getElementById('importAggrFun').value
}

function importFlowAndUserNodes(){
  
    global_data.ids.nodeID = document.getElementById('importNodeID').value
    if(global_data.files.Ntype === 'csv'){

      global_data.ids.long = document.getElementById('importLatStruct').value
      global_data.ids.lat = document.getElementById('importLonStruct').value
      data.nodes = createGeoJSON(data.nodes);

    }
    importData()
  }

function importFlowAndPresetNodes(){

    global_data.files.Ntype  = "geojson"
    var region = document.getElementById('importIDStruct').value
    var subregion = document.getElementById('importSubRegionsStruct').value
    var map_nodes = document.getElementById('importNodesStruct').value
    var path = data.saved_nodes[region][subregion][map_nodes].file
    global_data.ids.nodeID = data.saved_nodes[region][subregion][map_nodes].id
    $.getJSON(path,function(json){  
      data.nodes = json;
      importData();
    }) 
}

function importData(){

  data.rawLinkData = null;
  data.rawStructureData = null;

  var maxX = - Infinity
  var minX = Infinity
  var maxY = - Infinity
  var minY = Infinity

var len = data.links.length;
var used_nodes = []

for(var i = 0; i<len; i++)
  {
    if (!used_nodes.includes(data.links[i][global_data.ids.linkID[0]])){
      used_nodes.push(data.links[i][global_data.ids.linkID[0]])
    }
    if (!used_nodes.includes(data.links[i][global_data.ids.linkID[1]])){
      used_nodes.push(data.links[i][global_data.ids.linkID[1]])
    }
  }

var list_id_nodes = []
var list_doublon_nodes = []
var len = data.nodes.features.length;
  for(var p=0; p<len; p++){

    if (!list_id_nodes.includes(data.nodes.features[p].properties[global_data.ids.nodeID]) && used_nodes.includes(data.nodes.features[p].properties[global_data.ids.nodeID])){
      data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]] = data.nodes.features[p];
      
      var centroid = getCentroid(data.nodes.features[p], global_data.projection.name)
      // console.log(centroid)
      data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]].properties["centroid"] = centroid   
      data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]].properties[global_data.ids.vol] = 0

      list_id_nodes.push(data.nodes.features[p].properties[global_data.ids.nodeID])

      if(maxX < centroid[0]){
        maxX = centroid[0]
      }
      if(minX > centroid[0]){
        minX = centroid[0]  
      }
      if(maxY < centroid[1]){
        maxY = centroid[1] 
      }
      if(minY > centroid[1]){
        minY = centroid[1]  
      }
    }
    else{
      list_doublon_nodes.push(data.nodes.features[p].properties[global_data.ids.nodeID])
    }

  }

  if(list_doublon_nodes.length !== 0){
    alert(list_doublon_nodes.length +"nodes have been removed.")
  }

  var lx = maxX - minX
  var ly = maxY - minY
  global_data.style.ratioBounds = Math.max(lx,ly)* 0.0002
  var newCenter = [minX+lx/2,minY+ly/2]
  global_data.center = newCenter

  map.getView().setCenter(newCenter)
  map.getView().setZoom(getZoomFromVerticalBounds(ly));

data.links = checkIDLinks(data.links, Object.keys(data.hashedStructureData), global_data.ids.linkID[0], global_data.ids.linkID[1])

computeMinStatNode(data.hashedStructureData , data.links, global_data.ids.linkID[0],global_data.ids.linkID[1], global_data.ids.vol);

data.links = prepareLinkData(data.links, global_data.ids.linkID[0],global_data.ids.linkID[1], data.hashedStructureData, global_data.ids.vol);

//TODO ADD GESTION OF UNDEFINED NODES REMOVE OR 0/0
var isCSV = global_data.files.Ntype !== 'geojson'
computeDistance(data.hashedStructureData , data.links, global_data.ids.linkID[0],global_data.ids.linkID[1],isCSV,'kilometers');

      console.log('AYAYAYAY')
document.getElementById("addFilterButton").disabled = false;

$("#featureCard").toggle();

applyPreselectMap(global_data, global_data.ids.vol, data)

$('.arrival').fadeOut(450, function(){ $(this).remove();});


}

function errorModal(){

  // showSemioParameter()
  $('#semio').modal({
  // keyboard: false,
  // backdrop: false,
  show:true

})

}

function progressBarLoading(id, value){
  console.log(value)
  $("#"+id).attr("aria-valuenow", value)
  document.getElementById(id).style.width = value + "%";
}

export function prepareLinkData (links, id_ori, id_dest, hash_nodes, id_vol){
  var len = links.length;
  var newLinkData = [];
  for(var p=0; p<len;p++){
    if(links[p][id_ori] === links[p][id_dest]){
      hash_nodes[links[p][id_ori]].properties[id_vol] = links[p][id_vol]
      
    }
    else{
    newLinkData.push(links[p])
    }
  }
  return newLinkData;
}


function applyPreselectMap(main_object, id_volume, data){
  setupPresetMapStyleLink(main_object.style.link, id_volume, data.links)
  setupPresetMapFilterLink(main_object.filter.link, id_volume, data.links)
  setupPresetMapStyleNode(main_object.style.node, id_volume, data.hashedStructureData)

  loadFilter(main_object.filter)

  var id_links = testLinkDataFilter(global_data.filter.link, data)
  var selected_nodes = applyNodeDataFilter(data.hashedStructureData)
  
  main_object.layers.features.node = addNodeLayer(map, data.links, data.hashedStructureData, main_object.style, id_links, selected_nodes)
  main_object.layers.features.link = generateLinkLayer(map,  data.links, data.hashedStructureData, main_object.style, main_object.ids.linkID[0], main_object.ids.linkID[1], id_links, selected_nodes)
  main_object.layers.features.node.setZIndex(1)
  addLegendToMap()
}

function  setupPresetMapStyleLink(style, id_volume, links){
  var arrayVolume = links.map(function(link){return link[id_volume]})
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


function  setupPresetMapStyleNode(style, id_volume, nodes){

  var arrayVolume = Object.keys(nodes).map(function(node){return nodes[node].properties["balance"]})
   style.color = {
      "palette": "RdYlGn",
      "cat": "number",
      "var": "balance",
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
  var arrayVolume = Object.keys(nodes).map(function(node){return nodes[node].properties["degree"]})
    style.size = {
      "cat": "Linear",
      "ratio": "100",
      "var": "degree",
      "max": Math.max(...arrayVolume),
      "min": Math.min(...arrayVolume)
    }
    style.text = "Choose..."

}

function  setupPresetMapFilterLink(filter, id_volume, links){
  var arrayVolume = links.map(function(link){return link[id_volume]}).sort(function(a, b) {
  return b - a;
})
   filter.push (  
    {
      "variable": id_volume,
      "values": [
          arrayVolume[parseInt(arrayVolume.length * 0.1)],
         Math.max(...arrayVolume)
      ],
      "filter": "numeral"
    }
  )

}

  function reduceDataset(geojson){
    
  var geo = geojson.features
  console.log(geo)
  var len = geo.length
  var gg = []
  for(var i = 0; i<len; i++){
    if(geo[i].geometry !== null){
    geo[i] = turf.point(getCentroid(geo[i],"EPSG:4326"), geo[i].properties)
  }
  }
  console.log(geojson)
  return geojson
}