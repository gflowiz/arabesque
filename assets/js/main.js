
import {refreshFilterModal, addFilterToScreen, checkDataToFilter } from "./filter.js"
import {addOSMLayer, addNewLayer} from "./layer.js";
import {loadMapFromPresetSave} from "./save.js";
import {getCentroid, changeProjection} from "./projection.js";
import {computeMinStatNode, computeDistance, checkIDLinks} from "./stat.js";


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

$("#strokeColorpicker").spectrum({
    color: "#1E90FF"
});
$("#fillColorpicker").spectrum({
    color: "aliceblue"
});

var select = document.getElementById("projection"); 
for(var i=0; i<Proj.length; i++){
 proj4.defs(Proj[i].name, Proj[i].proj4);


    var el = document.createElement("option");
    el.textContent = Proj[i].name;
    el.value = i;
    select.appendChild(el);
}
register(proj4);


global.data = {hashedStructureData:{}}
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
              "text":null
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
    "filter":[],
    "ids":{
      "nodeID":null,
      "linkID":[null,null],
      "vol":"count",
      "long":"lat",
      "lat":"lon"
    },
    "projection":{}
};
console.log(setupStyleAndAddLayer)
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
// Main Page -- filter
document.getElementById('selectFilterButton').addEventListener("click", function(){checkDataToFilter()}); 
// Modal -- Add
document.getElementById('addNewLayerButton').addEventListener("click", function(){addNewLayer(map, global_data.layers)}); 
document.getElementById('baseLayerButton').addEventListener("click", function(){errorModal()}); 
// Modal -- Filter
document.getElementById('refreshFilterButton').addEventListener("click", function(){refreshFilterModal()}); 
document.getElementById('addFilterButton').addEventListener("click", function(){addFilterToScreen()}); 
// Modal -- Semio
document.getElementById('featureChosenAdd').addEventListener("change", function(){showSemioParameter()}); 
document.getElementById('refreshSemioButton').addEventListener("click", function(){refreshSemioModal()}); 
document.getElementById('addSemioButton').addEventListener("click", function(){setupStyleAndAddLayer(global_data.style)});
// Modal -- import 
document.getElementById('importIdButton').addEventListener("click", function(){importData()}); 
// Modal -- Change
// Button -- right
// console.log(document.getElementById('removeFilterLayout'))
// document.getElementById('removeFilterLayout').addEventListener("click", function(){
 
// })


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


var select = document.getElementById("layers"); 
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

  var len = data.nodes.features.length;
  for(var p=0; p<len; p++){

    data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]] = data.nodes.features[p];
    
    var centroid = getCentroid(data.nodes.features[p], global_data.projection.name)
    data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]].properties["centroid"] = centroid   
    data.hashedStructureData[data.nodes.features[p].properties[global_data.ids.nodeID]].properties[global_data.ids.vol] = 0

    

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


document.getElementById("addFilterButton").disabled = false;

$("#featureCard").toggle();
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