import * as turf from "@turf/turf"
import {View} from 'ol';
import {addOSMLayer, addNewLayer, addLayerFromURLNoStyle, addNodeLayer, generateLinkLayer, addGeoJsonLayer, getLayerFromName, addLayerFromURL} from "./layer.js";
import {testLinkDataFilter, applyNodeDataFilter} from "./filter.js";


import * as d3proj from 'd3-geo-projection'

import * as d3rot from 'd3-geo/src/rotation.js'

import  proj4 from 'proj4';
import {getWidth, getCenter, applyTransform} from 'ol/extent.js';
import {transform, get as getProjection, addProjection, Projection, addCoordinateTransforms, getTransform} from 'ol/proj.js';
import {register} from 'ol/proj/proj4.js';

global.Proj = {
  "Mercator / EPSG:3857":{ name: "Mercator / EPSG:3857", proj4: "+proj=merc +a=6371000 +b=6371000 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +no_defs",extent:null , worldExtent:[-180.0,-85.06,180.0,85.06] ,center:[0.00,-0.00]},
  "Sphere Mollweide / ESRI:53009":{ name: "Sphere Mollweide / ESRI:53009", proj4: "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m +no_defs",extent:null, worldExtent:[-179, -89.99, 179, 89.99],center:[0,0]},
  "RGF93 / Lambert-93 -- France":{ name: "RGF93 / Lambert-93 -- France", proj4: "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",extent:[-378305.81,  6093283.21, 1212610.74, 7186901.68], worldExtent:[-9.86, 41.15, 10.38, 51.56],center:[489353.59, 6587552.20]},
  "ETRS89 / LAEA Europe":{ name: "ETRS89 / LAEA Europe", proj4: "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",extent:[1896628.62,  1507846.05, 4662111.45, 6829874.45], worldExtent:[-16.1 , 32.88, 40.18, 84.17],center:[4440049.08, 3937680.52]},
  "World Azimuthal Equidistant":{ name: "World Azimuthal Equidistant", proj4: "+proj=aeqd +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000  +units=m ",extent:null, worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
  "Transversal Mercator":{ name: "Transversal Mercator", proj4: '+proj=tmerc +lat_0=0 +lon_0=6 +k=1 +x_0=2500000 +y_0=0 +ellps=bessel +towgs84=598.1,73.7,418.2,0.202,0.045,-2.455,6.7 +units=m +no_defs',extent:[370753.1145, 6382922.7769, 739245.6000, 6624811.0577], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
  "Gnomonic":{ name: "Gnomonic", proj4: "+proj=gnom +lat_0=90 +lon_0=0 +x_0=6300000 +y_0=6300000 +ellps=WGS84 +datum=WGS84 +units=m +no_defs",extent:null, worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
  "United Kingdom / EPSG:27700":{ name: "EPSG:27700", proj4: "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 +units=m +no_defs",extent:[0, 0, 700000, 1300000], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
  "EPSG:23032":{ name: 'EPSG:23032', proj4: '+proj=utm +zone=32 +ellps=intl +towgs84=-87,-98,-121,0,0,0,0 +units=m +no_defs',extent:[-1206118.71, 4021309.92, 1295389.00, 8051813.28], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]}, 
  "EPSG:5479":{ name: "EPSG:5479", proj4: '+proj=lcc +lat_1=-76.66666666666667 +lat_2=-79.33333333333333 +lat_0=-78 +lon_0=163 +x_0=7000000 +y_0=5000000 ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',extent:[6825737.53, 4189159.80, 9633741.96, 5782472.71], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
  "SWITZERLAND /EPSG:21781":{ name: "SWITZERLAND/EPSG:21781", proj4: '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs',extent:[485071.54, 75346.36, 828515.78, 299941.84], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
  "NORTH POLE/ EPSG:3413":{ name: 'NORTH POLE/EPSG:3413', proj4: '+proj=stere +lat_0=90 +lat_ts=70 +lon_0=-45 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',extent:[-4194304, -4194304, 4194304, 4194304], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]}, 
  "World Mollweide / EPSG:54009":{ name: "World Mollweide / EPSG:54009", proj4: '+proj=moll +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs',extent:[-18e6, -9e6, 18e6, 9e6], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
  "Quadrilateralized Spherical Cube":{ name: "Quadrilateralized Spherical Cube", proj4: '+proj=qsc +units=m +ellps=WGS84  +lat_0=0 +lon_0=0',extent:null, worldExtent:null,center:[0,-0]},
 // "testdf":{ name: "testdf", proj4: null,extent:null, worldExtent:null,center:[0,-0]},
 "PeirceQuincuncial":{ name: "PeirceQuincuncial", proj4: null,extent:null, worldExtent:null,center:[0,-0]},

};
// console.log( d3proj.geoArmadillo().parallel(25))

function reprojectData(data, old_projection ,new_projection){

  var len = Object.keys(data).length;
  var keys = Object.keys(data);
  for(var j=0; j<len; j++){
  data[keys[j]].properties.centroid = getCentroid(data[keys[j]], new_projection);
}

return;
}

export function loadAllExtentProjection(){
for(var i in Proj){
    if(Proj[i].extent !== null){
      var projtt = getProjection(i);
      projtt.setExtent(Proj[i].extent);
  }
}
        // var cc = d3rot.default()
        //             var p = cc(0, 0)
 
      var projection = new Projection({
        code: 'testdf',
        // The extent is used to determine zoom level 0. Recommended values for a
        // projection's validity extent can be found at https://epsg.io/.
        units: 'm'
      });
      addProjection(projection);
      // 
      addCoordinateTransforms('EPSG:4326', projection,
                  function(coordinate) {
          return [
            WGStoCHy(coordinate[1], coordinate[0]),
            WGStoCHx(coordinate[1], coordinate[0])
          ];
        },
        function(coordinate) {
          return [
            CHtoWGSlng(coordinate[0], coordinate[1]),
            CHtoWGSlat(coordinate[0], coordinate[1])
          ];
        });
        

              var projection2 = new Projection({
        code: 'PeirceQuincuncial',
        // The extent is used to determine zoom level 0. Recommended values for a
        // projection's validity extent can be found at https://epsg.io/.
        units: 'm'
      });
      addProjection(projection2);
      // 
      var cc = d3proj.geoPeirceQuincuncial();
      addCoordinateTransforms('EPSG:4326', projection2,
                  function(coordinate) {
           
        
                    var p = cc([coordinate[0],coordinate[1]])
                    // console.log(p)
                   return [p[0],-p[1]];
        },
        function(coordinate) {
      // var cc = d3proj.geoAitoffRaw()
      //               // var cc = d3proj.geoAiryRaw(1)
      //               var p = cc.invert(coordinate[1], coordinate[0])
                   return coordinate;
        });
     
}
export function centerMap(){
  var view = map.getView()
  
  
  view.fit(getLayerFromName(map, 'link').getSource().getExtent())
  // view.setZoom( global_data.zoom) 
  // view.setCenter(transform(global_data.center,"EPSG:4326",global_data.projection.name)) 
}

function refreshBaseLayers(map,layers){

  for(var m in layers){
  
  map.removeLayer(getLayerFromName(map,m)); 
  // var oldStyle = getLayerFromName(map,m).getStyle();  
    // if(layers[m].added){
    //   var style = layers[m].style
    //   addGeoJsonLayer(map, data[m], m, style.opacity, style.stroke_color, style.fill_color);
    // }
    // else{
       addLayerFromURL(map, ListUrl[m],m,layers[m].attributions , layers[m].style.opacity, layers[m].style.stroke, layers[m].style.fill)
    // }
  // getLayerFromName(map,m).setStyle(oldStyle);
  }
  // applyBaseExtent(layers.base,global_data.projection.extent)
}


function refreshFeaturesLayers(map,layers, old_projection ,new_projection){
  // var layerNames = getNameLayers(layers.features);

  // var LEN = layerNames.length;
  reprojectData(data.hashedStructureData, old_projection ,new_projection);
  global_data.style.ratioBounds  = updateRatioBounds(data.hashedStructureData)
  
  var id_links = testLinkDataFilter(global_data.filter.link, data)
  var selected_nodes = applyNodeDataFilter(data.hashedStructureData)

  // for(var m=0; m<LEN;m++){
    
    // 
    if(getLayerFromName(map,'link') !== null){
      // map.removeLayer(getLayerFromName(map,'link'));
      generateLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1], id_links, selected_nodes)
      
    }
    if (getLayerFromName(map,'node') !== null){
      // map.removeLayer(getLayerFromName(map,'node'));
      addNodeLayer(map, data.links, data.hashedStructureData, global_data.style , id_links, selected_nodes)
    }
  centerMap()
  // applyExtent(layers.features,global_data.projection.extent)
}



export function getNameLayers(layers){
  return Object.keys(layers);
}

// function getLayerUrl(name){
//   
//   for(var p=0; p< ListUrl.length; p++){
//     if(ListUrl[p].name === name){
//       return [ListUrl[p].name, ListUrl[p].url];}
//   }
// }


export function getCentroid(feature,projection_name){

	
  if (feature.geometry.type == "MultiPolygon") {
    var maxArea = 0;
    var area = -1;
    var ll = feature.geometry.coordinates.length;
    for (var i = 0; i < ll; i++) {
      var polyg = turf.polygon(feature.geometry.coordinates[i]);
      var newArea = turf.area(polyg);
        if (area < newArea) {
          maxArea = i;
          area = newArea;
        }
    }
    var singlePoly = turf.polygon(feature.geometry.coordinates[maxArea])
    var centroid = turf.centroid(singlePoly);
    var projectedCentroid = transform(centroid.geometry.coordinates, 'EPSG:4326', projection_name)
    } else if (feature.geometry.type == "Point"){
      
    // 
      return transform(feature.geometry.coordinates, 'EPSG:4326', projection_name)
    }
    else
     {
      var centroid = turf.centroid(feature);
      var projectedCentroid = transform(centroid.geometry.coordinates, 'EPSG:4326', projection_name)
       
    } 
  return projectedCentroid
}


export function changeProjection(layers, center){

//TODO ADD the EPSG.io search

    //get the the new projection in the current implementlist

    var iPrj = document.getElementById("projection").value;

    var projName = Proj[iPrj].name;

  var newView = new View({
    projection: projName,
    center:transform(global_data.center, 'EPSG:4326',projName),
    // extent:Proj[iPrj].extent,
    zoom:map.getView().getZoom(),
    maxZoom:25,
    minZoom:-25
  });


    map.setView(newView);

refreshBaseLayers(map,layers.base);
refreshFeaturesLayers(map,layers, global_data.projection.name,projName);
// global_data.projection.name = projName;
  // if(Proj[iPrj].extent !== null){
  //   applyExtent(layers,projection.extent)
  // }

  global_data.projection = Proj[iPrj]
if(global_data.projection.extent !== null){

    // newView.setExtent(global_data.projection.extent)
    newView.setCenter(getCenter(global_data.projection.extent))
    newView.setZoom(0)
    applyExtent(layers,global_data.projection.extent)
    applyBaseExtent(global_data.layers.base,global_data.projection.extent)
    
    newView.fit(global_data.projection.extent);
  }
  

// applyExtent(layers,global_data.projection.extent)


        //map.render();
  //return;
}


export function changeZipProjection(layers, center, zoom){

  var newExtent =[]
  var newProj = getProjection(global_data.projection.name);

  var newView = new View({
    projection: global_data.projection.name,
    // center:transform(center,"EPSG:4326",global_data.projection.name),
    //extent:newExtent,
    // zoom:zoom,
    maxZoom:25,
    minZoom:-2
  });
    map.setView(newView);
    // newView.setExtent(global_data.projection.extent)
if(global_data.projection.extent !== null){
    // newView.setExtent(global_data.projection.extent)
    // newView.setCenter(getCenter(global_data.projection.extent))
    // newView.setZoom(0)
    // applyExtent(layers,global_data.projection.extent)
    // applyBaseExtent(global_data.layers.base,global_data.projection.extent)
    
    newView.fit(global_data.projection.extent);
  }
// applyExtent(layers,global
}

function applyExtent(layers, extent){
 if (getLayerFromName(map, 'node') !== null){
      getLayerFromName(map, 'node').setExtent(extent)
    }
    if (getLayerFromName(map, 'link') !== null){
      getLayerFromName(map, 'link').setExtent(extent)
    }
}
function applyBaseExtent(layers, extent){
 for(var i in layers){
      getLayerFromName(map, i).setExtent(extent)
 }
}

export function loadZipProjection(map, center, zoom){
  changeZipProjection(global_data.layers, center, zoom)
}


export function setNextProj( map, new_projName){
  
  // 
  // var newExtent =[]
  var newProj = getProjection(new_projName);
  // 
 // Proj[index_proj].extent = newExtent
  // newProj.setExtent(newExtent);
  var newView = new View({
    projection: new_projName,
    // center:transform(center, 'EPSG:4326',new_projName),
    //extent:newExtent,
    zoom:4,
    maxZoom:25,
    minZoom:-2
  });
    map.setView(newView);

    if(Proj[new_projName].extent !== null){
    newView.setExtent(global_data.projection.extent)
    applyExtent(layers,global_data.projection.extent)
    applyBaseExtent(global_data.layers.base,global_data.projection.extent)
    
    newView.fit(Proj[new_projName].extent);

    // newView.fit(newExtent);
  }
  
}

function setProjection(code, name, proj4def, bbox) {

      var resultSpan = document.getElementById('epsg-result');
        if (code === null || name === null || proj4def === null || bbox === null) {
          resultSpan.innerHTML = 'Nothing usable found, using EPSG:3857...';
          map.setView(new View({
            projection: 'EPSG:3857',
            center:transform(global_data.center, 'EPSG:4326','EPSG:3857'),
            zoom: 1,
            maxZoom:25,
            minZoom:-10
          }));

        refreshBaseLayers(map,global_data.layers.base);
        refreshFeaturesLayers(map,global_data.layers, global_data.projection.name,newProjCode);
        global_data.projection.name = newProjCode;
        global_data.projection.extent = bbox;
          return;
        }

        resultSpan.innerHTML = '(' + code + ') ' + name;

        var newProjCode = 'EPSG:' + code;
        proj4.defs(newProjCode, proj4def);
        register(proj4);
        var newProj = getProjection(newProjCode);
        var fromLonLat = getTransform('EPSG:4326', newProj);

        // very approximate calculation of projection extent
        var extent = applyTransform(
          [bbox[1], bbox[2], bbox[3], bbox[0]], fromLonLat);
        newProj.setExtent(extent);
        var newView = new View({
          projection: newProj,
          center:transform(global_data.center, 'EPSG:4326',newProjCode),
          maxZoom:25,
          minZoom:-10
        });
        map.setView(newView);
        newView.fit(extent);
        refreshBaseLayers(map,global_data.layers.base);
        refreshFeaturesLayers(map,global_data.layers, global_data.projection.name,newProjCode);
        global_data.projection.name = newProjCode;
        global_data.projection.extent = bbox;
      }


    export  function search(query) {
      var resultSpan = document.getElementById('epsg-result');
        resultSpan.innerHTML = 'Searching ...';
        fetch('https://epsg.io/?format=json&q=' + query).then(function(response) {
          return response.json();
        }).then(function(json) {
          var results = json['results'];
          if (results && results.length > 0) {
            for (var i = 0, ii = results.length; i < ii; i++) {
              var result = results[i];
              if (result) {
                var code = result['code'];
                var name = result['name'];
                var proj4def = result['proj4'];
                var bbox = result['bbox'];
                if (code && code.length > 0 && proj4def && proj4def.length > 0 &&
                    bbox && bbox.length == 4) {
                  setProjection(code, name, proj4def, bbox);
                  return;
                }
              }
            }
          }
          setProjection(null, null, null, null);
        });
      }

     // Convert WGS lat/long (° dec) to CH y
      function WGStoCHy(lat, lng) {

        // Converts degrees dec to sex
        lat = DECtoSEX(lat);
        lng = DECtoSEX(lng);

        // Converts degrees to seconds (sex)
        lat = DEGtoSEC(lat);
        lng = DEGtoSEC(lng);

        // Axiliary values (% Bern)
        var lat_aux = (lat - 169028.66) / 10000;
        var lng_aux = (lng - 26782.5) / 10000;

        // Process Y
        var y = 600072.37 +
            211455.93 * lng_aux -
            10938.51 * lng_aux * lat_aux -
            0.36 * lng_aux * Math.pow(lat_aux, 2) -
            44.54 * Math.pow(lng_aux, 3);

        return y;
      }

// The data must be in the new projection
function updateRatioBounds(nodes){
  var newRatioBounds = 0
  var maxX = - Infinity
  var minX = Infinity
  var maxY = - Infinity
  var minY = Infinity
  var centroid = []
    Object.keys(nodes).map(function (node) {
      
        centroid = nodes[node].properties.centroid
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
    })
  



  var lx = maxX - minX
  var ly = maxY - minY
  return Math.max(lx, ly) * 0.0002
}
      // Convert WGS lat/long (° dec) to CH x
      function WGStoCHx(lat, lng) {

        // Converts degrees dec to sex
        lat = DECtoSEX(lat);
        lng = DECtoSEX(lng);

        // Converts degrees to seconds (sex)
        lat = DEGtoSEC(lat);
        lng = DEGtoSEC(lng);

        // Axiliary values (% Bern)
        var lat_aux = (lat - 169028.66) / 10000;
        var lng_aux = (lng - 26782.5) / 10000;

        // Process X
        var x = 200147.07 +
            308807.95 * lat_aux +
            3745.25 * Math.pow(lng_aux, 2) +
            76.63 * Math.pow(lat_aux, 2) -
            194.56 * Math.pow(lng_aux, 2) * lat_aux +
            119.79 * Math.pow(lat_aux, 3);

        return x;

      }


      // Convert CH y/x to WGS lat
      function CHtoWGSlat(y, x) {

        // Converts militar to civil and  to unit = 1000km
        // Axiliary values (% Bern)
        var y_aux = (y - 600000) / 1000000;
        var x_aux = (x - 200000) / 1000000;

        // Process lat
        var lat = 16.9023892 +
            3.238272 * x_aux -
            0.270978 * Math.pow(y_aux, 2) -
            0.002528 * Math.pow(x_aux, 2) -
            0.0447 * Math.pow(y_aux, 2) * x_aux -
            0.0140 * Math.pow(x_aux, 3);

        // Unit 10000" to 1 " and converts seconds to degrees (dec)
        lat = lat * 100 / 36;

        return lat;

      }

      // Convert CH y/x to WGS long
      function CHtoWGSlng(y, x) {

        // Converts militar to civil and  to unit = 1000km
        // Axiliary values (% Bern)
        var y_aux = (y - 600000) / 1000000;
        var x_aux = (x - 200000) / 1000000;

        // Process long
        var lng = 2.6779094 +
            4.728982 * y_aux +
            0.791484 * y_aux * x_aux +
            0.1306 * y_aux * Math.pow(x_aux, 2) -
            0.0436 * Math.pow(y_aux, 3);

        // Unit 10000" to 1 " and converts seconds to degrees (dec)
        lng = lng * 100 / 36;

        return lng;

      }


      // Convert DEC angle to SEX DMS
      function DECtoSEX(angle) {

        // Extract DMS
        var deg = parseInt(angle, 10);
        var min = parseInt((angle - deg) * 60, 10);
        var sec = (((angle - deg) * 60) - min) * 60;

        // Result in degrees sex (dd.mmss)
        return deg + min / 100 + sec / 10000;

      }

      // Convert Degrees angle to seconds
      function DEGtoSEC(angle) {

        // Extract DMS
        var deg = parseInt(angle, 10);
        var min = parseInt((angle - deg) * 100, 10);
        var sec = (((angle - deg) * 100) - min) * 100;

        // Avoid rounding problems with seconds=0
        var parts = String(angle).split('.');
        if (parts.length == 2 && parts[1].length == 2) {
          min = Number(parts[1]);
          sec = 0;
        }

        // Result in degrees sex (dd.mmss)
        return sec + min * 60 + deg * 3600;

      }



  // function  testFoward(coordinate) {
  //         var projection = d3.geoEquirectangularRaw()
  //         return projection(coordinate);
  //       }
  // function testInvert(coordinate) {
  //         var projection = d3.geoEquirectangular()
  //         return projection.invert(coordinate);
  //       })