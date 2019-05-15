//TODO remove all funciton in other files like import files 
import {refreshFilterModal, addFilterToScreen, checkDataToFilter } from "./filter.js"
import {addOSMLayer, addBaseLayer, addGeoJsonLayer, addNodeLayer, generateLinkLayer} from "./layer.js";
import {loadMapFromPresetSave, loadFilter} from "./save.js";
import {getCentroid, changeProjection} from "./projection.js";
import {computeMinStatNode, computeDistance, checkIDLinks} from "./stat.js";
import {addLayerGestionMenu} from './control.js';
import {showGeometryParameter,setupArrowParameter, setupHead} from './geometry.js';
import {setupStyleAndAddLayer , showSemioParameter, generatePaletteMultiHue2, changeSemioParameter } from './semiology.js'

import * as turf from "@turf/turf"

import {register} from 'ol/proj/proj4.js';
import {Map, View } from 'ol';
import {ScaleLine} from 'ol/control.js';

import {parse as papaparse} from "papaparse"

import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';

import 'spectrum-colorpicker/spectrum.js'
import 'spectrum-colorpicker/spectrum.css'

import '../css/control.css'

import  proj4 from 'proj4';


$("#layerControlList").tooltip({placement:"right",
title:"Drag and drop layers to change Z-index"
})
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
      "Ntype":null
    },
  "layers":{
    features:{},
    base:{}
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
    "projection":{}
};

global_data.projection = Proj[0]
// Add listener to all button of application
// onclick properties did'nt work with webpack so button must be update manually by adding an event listener

// Home Page
document.getElementById('importDataButton').addEventListener("click", function(){importDataToMap()}); 
document.getElementById('localMap').addEventListener("click", function(){loadMapFromPresetSave('local', map, global_data, data)}); 
document.getElementById('countryMap').addEventListener("click", function(){loadMapFromPresetSave('country', map, global_data, data)}); 
document.getElementById('worldMap').addEventListener("click", function(){loadMapFromPresetSave('world', map, global_data, data)}); 
// Main Page -- Layer
document.getElementById('OSMbutton').addEventListener("click", function(){addOSMLayer(map, global_data.layers.base)}); 
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
// Modal -- Add
document.getElementById('addNewLayerButtonAdd').addEventListener("click", function(){addBaseLayer(map, global_data.layers, 'Add')}); 
// document.getElementById('baseLayerButton').addEventListener("click", function(){errorModal()}); 
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
  addLayerGestionMenu(layer_name)
});
// Modal -- import 
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

document.getElementById('importIdButton').addEventListener("click", function(){importData()}); 


(function(){
    
    function onChange(event) {
      // console.log(save.loadMapFromPresetSave)
        var reader = new FileReader();
        reader.onload = onReaderLoad;

        reader.readAsText(event.target.files[0]);
        global_data.files.Ntype = event.target.files[0].name.split('.')[event.target.files[0].name.split('.').length - 1]
        document.getElementById("Node").disabled = true;
        document.getElementById("label_node").innerHTML = event.target.files[0].name;  


            if (document.getElementById("Node").disabled && document.getElementById("Link").disabled){
    document.getElementById("importDataButton").disabled = false;
    
  }}

    function onReaderLoad(event){
        data.rawStructureData = event.target.result;
        
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

        if (document.getElementById("Node").disabled && document.getElementById("Link").disabled){
            document.getElementById("importDataButton").disabled = false;
        }
    }

    function onReaderLoad(event){
        data.rawLinkData = event.target.result;
        //console.log(event.target)
        
    }
    

    document.getElementById('Link').addEventListener('change', onChange);
    
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
          renderer:'webgl',
         
          //renderer:'webgl',
          target: 'map',
          view: new View({
            center: [0.00, -0.00],
            //projection:projection.name,
                      zoom: 0,
      minZoom: -2,
      maxZoom: 30
          })
        });
map.addControl(new ScaleLine());





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




function importDataToMap() {
  // console.log(d3.csv)
//   d3.csv("public/data/swissFlow.csv", function(error, data) {
//   if(error) throw error;
//   console.log('ayyayayaya')
// console.log(data)
// });
  // if (!ctr.hasData()) return;


  //CSV TO JSON
  data.links = readData(data.rawLinkData, global_data.files.Ltype);
  data.nodes = readData(data.rawStructureData, global_data.files.Ntype);

  if (document.getElementById('importLatStruct') !== null) {
    $('#importLatStruct').parent().parent().remove()
    $('#importLonStruct').parent().parent().remove()
  }

  if (document.getElementById('importIDStruct') !== null) {
    $('#importIDStruct').children().remove()
    $('#importIDDest').children().remove()
    $('#importIDOri').children().remove()
    $('#importIDVol').children().remove()
  }


  if (global_data.files.Ntype === 'csv') {


    $('#importIDStruct').parent().parent().parent()
      .append($('<div>')
        .attr('class', 'col-md-4')
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
        .attr('class', 'col-md-4')
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
    $('#importIDStruct').append($('<option>', {
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

  keys = Object.keys(data.links[0]);
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
  data.rawLinkData = null;
  data.rawStructureData = null;

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

function importData(){
progressBarLoading("waitLoad", 15)
  var maxX = - Infinity
  var minX = Infinity
  var maxY = - Infinity
  var minY = Infinity

  global_data.ids.nodeID = document.getElementById('importIDStruct').value
  global_data.ids.linkID[0] = document.getElementById('importIDOri').value
  global_data.ids.linkID[1] = document.getElementById('importIDDest').value
  global_data.ids.vol = document.getElementById('importIDVol').value

  if(global_data.files.Ntype === 'csv'){

    global_data.ids.long = document.getElementById('importLatStruct').value
    global_data.ids.lat = document.getElementById('importLonStruct').value
    data.nodes = createGeoJSON(data.nodes);
  }
progressBarLoading("waitLoad", 35)
  var list_id_nodes = []
  var list_doublon_nodes = []
  var len = data.nodes.features.length;
  for(var p=0; p<len; p++){

    if (!list_id_nodes.includes(data.nodes.features[p].properties[global_data.ids.nodeID])){
    data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]] = data.nodes.features[p];
    
    var centroid = getCentroid(data.nodes.features[p], global_data.projection.name)
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

progressBarLoading("waitLoad", 65)
var lx = maxX - minX
var ly = maxY - minY
global_data.style.ratioBounds = Math.max(lx,ly)* 0.0002
var newCenter = [minX+lx/2,minY+ly/2]
global_data.center = newCenter
map.getView().setCenter(newCenter)
map.getView().setZoom(getZoomFromVerticalBounds(ly));

data.links = checkIDLinks(data.links, Object.keys(data.hashedStructureData), global_data.ids.linkID[0], global_data.ids.linkID[1])
// data.links = checkIDNodes(data.links, Object.keys(data.hashedStructureData), global_data.ids, global_data.files.Ntype)
progressBarLoading("waitLoad", 75)

computeMinStatNode(data.hashedStructureData , data.links, global_data.ids.linkID[0],global_data.ids.linkID[1], global_data.ids.vol);
progressBarLoading("waitLoad", 85)
data.links = prepareLinkData(data.links, global_data.ids.linkID[0],global_data.ids.linkID[1], data.hashedStructureData, global_data.ids.vol);

//TODO ADD GESTION OF UNDEFINED NODES REMOVE OR 0/0
var isCSV = global_data.files.Ntype !== 'geojson'
  computeDistance(data.hashedStructureData , data.links, global_data.ids.linkID[0],global_data.ids.linkID[1],isCSV,'kilometers');

progressBarLoading("waitLoad", 100)
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
  progressBarLoading("waitLoad", 95)
  return newLinkData;
}


function applyPreselectMap(main_object, id_volume, data){
  setupPresetMapStyleLink(main_object.style.link, id_volume, data.links)
  setupPresetMapFilterLink(main_object.filter.link, id_volume, data.links)
  setupPresetMapStyleNode(main_object.style.node, id_volume, data.hashedStructureData)

  loadFilter(main_object.filter)

  main_object.layers.features.node = addNodeLayer(map, data.links, data.hashedStructureData, main_object.style)
  main_object.layers.features.link = generateLinkLayer(map,  data.links, data.hashedStructureData, main_object.style, main_object.ids.linkID[0], main_object.ids.linkID[1])
  main_object.layers.features.node.setZIndex(1)

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