import * as turf from "@turf/turf"
import {transform, get as getProjection} from 'ol/proj.js';
import {View} from 'ol';
import {addOSMLayer, addNewLayer, addLayerFromURLNoStyle, addNodeLayer, generateLinkLayer, addGeoJsonLayer} from "./layer.js";


global.Proj = [
  { name: "EPSG:3857", proj4: "+proj=merc +a=6378137 +b=6378137 +lat_ts=0.0 +lon_0=0.0 +x_0=0.0 +y_0=0 +k=1.0 +units=m +nadgrids=@null +wktext  +no_defs",extent:[-4*20026376.39, -2*20048966.10, 2*20026376.39,20048966.10]  , worldExtent:[-180.0,-85.06,180.0,85.06] ,center:[0.00,-0.00]},
  { name: "ESRI:53009", proj4: "+proj=moll +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000 +units=m no_defs",extent:[-2*9009954.605703328, -9009954.605703328,
    9009954.605703328* 2, 9009954.605703328], worldExtent:[-179, -89.99, 179, 89.99],center:[0,0]},
 { name: "RGF93 / Lambert-93 -- France", proj4: "+proj=lcc +lat_1=49 +lat_2=44 +lat_0=46.5 +lon_0=3 +x_0=700000 +y_0=6600000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",extent:[-378305.81,  6093283.21, 1212610.74, 7186901.68], worldExtent:[-9.86, 41.15, 10.38, 51.56],center:[489353.59, 6587552.20]},
 { name: "ETRS89 / LAEA Europe", proj4: "+proj=laea +lat_0=52 +lon_0=10 +x_0=4321000 +y_0=3210000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",extent:[1896628.62,  1507846.05, 4662111.45, 6829874.45], worldExtent:[-16.1 , 32.88, 40.18, 84.17],center:[4440049.08, 3937680.52]},
   { name: "eck6", proj4: "+proj=aeqd +lat_0=0 +lon_0=0 +x_0=0 +y_0=0 +a=6371000 +b=6371000  +units=m ",extent:[-2*9009954.605703328, -9009954.605703328,
    9009954.605703328* 2, 9009954.605703328], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
      { name: "UTM", proj4: "+proj=cass +lat_0=10.44166666666667 +lon_0=-61.33333333333334 +x_0=86501.46392052001 +y_0=65379.0134283 +a=6378293.645208759 +b=6356617.987679838 +towgs84=-61.702,284.488,472.052,0,0,0,0 +to_meter=0.3047972654 +no_defs ",extent:[-2*9009954.605703328, -9009954.605703328,
    9009954.605703328* 2, 9009954.605703328], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
          { name: "t3", proj4: "+proj=cass +lat_0=22.31213333333334 +lon_0=114.1785555555556 +x_0=40243.57775604237 +y_0=19069.93351512578 +a=6378293.645208759 +b=6356617.987679838 +units=m +no_defs",extent:[-2*9009954.605703328, -9009954.605703328,
    9009954.605703328* 2, 9009954.605703328], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},
      { name: "t4", proj4: "+proj=sterea +lat_0=46.5 +lon_0=-66.5 +k=0.999912 +x_0=2500000 +y_0=7500000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",extent:[-2*9009954.605703328, -9009954.605703328,
    9009954.605703328* 2, 9009954.605703328], worldExtent:[-179, -89.99, 179, 89.99],center:[0,-0]},

];


function reprojectData(data, old_projection ,new_projection){

  var len = Object.keys(data).length;
  var keys = Object.keys(data);
  for(var j=0; j<len; j++){
  data[keys[j]].properties.centroid = getCentroid(data[keys[j]], new_projection);
}

return;
}



function refreshBaseLayers(map,layers){
  var layerNames = getNameLayers(layers.base);

  console.log(layerNames);
  var LEN = layerNames.length;
  for(var m=0; m<LEN;m++){

  map.removeLayer(layers.base[layerNames[m]].layer); 
  var oldStyle = layers.base[layerNames[m]].layer.getStyle();  
    if(layers.base[layerNames[m]].added){
      var style = layers.base[layerNames[m]].style
      layers.base[layerNames[m]].layer =  addGeoJsonLayer(map, data[layerNames[m]], layerNames[m], style.opacity, style.stroke_color, style.fill_color);
    }
    else{
      layers.base[layerNames[m]].layer = addLayerFromURLNoStyle(map,ListUrl[layerNames[m]],layerNames[m]);
    }
  layers.base[layerNames[m]].layer.setStyle(oldStyle);
  }
}


function refreshFeaturesLayers(map,layers, old_projection ,new_projection){
  var layerNames = getNameLayers(layers.features);

  var LEN = layerNames.length;
  reprojectData(data.hashedStructureData, old_projection ,new_projection);


  for(var m=0; m<LEN;m++){
    
    // console.log(data);
    if(layerNames[m] === "link"){
      map.removeLayer(layers.features[layerNames[m]]);
      layers.features[layerNames[m]] = generateLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1])
    }else if (layerNames[m] === "node"){
      map.removeLayer(layers.features[layerNames[m]]);
     layers.features[layerNames[m]]= addNodeLayer(map, data.links, data.hashedStructureData, global_data.style)
    }
  }
  applyExtent(layers.features,global_data.projection.extent)
}



export function getNameLayers(layers){
  return Object.keys(layers);
}

// function getLayerUrl(name){
//   console.log(ListUrl.length);
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
    } else {
      var centroid = turf.centroid(feature);
      var projectedCentroid = transform(centroid.geometry.coordinates, 'EPSG:4326', projection_name)
       
    } 
  return projectedCentroid
}


export function changeProjection(layers, center){

//TODO ADD the EPSG.io search

    //get the the new projection in the current implementlist

    var sel = document.getElementById("projection");
    var iPrj = sel.options[ sel.selectedIndex ].value;

    var projName = Proj[iPrj].name;

    //console.log(ol.proj.get(projName));
    var newProj = getProjection(projName);
    
console.log(projName)
console.log(newProj)
  // very approximate calculation of projection extent
  var newExtent =[]
for (var p = 0; p< Proj[iPrj].worldExtent.length; p++){
	newExtent.push(transform([Proj[iPrj].worldExtent[p],0],"EPSG:4326", projName)[0])
}
 Proj[iPrj].extent = newExtent
  newProj.setExtent(newExtent);
  var newView = new View({
    projection: newProj,
    center:transform(center,global_data.projection.name, projName),
    //extent:newExtent,
    zoom:map.getView().getZoom(),
    maxZoom:25,
    minZoom:-2
  });
    map.setView(newView);
    // newView.fit(newExtent);


console.log(global_data.projection.name)
console.log("===============")
console.log(projName)
global_data.projection = Proj[iPrj];
refreshBaseLayers(map,layers);
refreshFeaturesLayers(map,layers, global_data.projection.name,projName);


//applyExtent(layers,projection.extent)


        //map.render();
  //return;
}

function applyExtent(layers, extent){
  var keys = Object.keys(layers);
  for(var p=0; p<keys.length; p++){
    layers[keys[p]].setExtent(extent);
  };
}


export function setNextProj( map, index_proj, new_projName){
  console.log(new_projName)
  console.log(index_proj)
  var newExtent =[]
  var newProj = getProjection(new_projName);
  for (var p = 0; p< Proj[index_proj].worldExtent.length; p++){
  newExtent.push(transform([Proj[index_proj].worldExtent[p],0],"EPSG:4326", new_projName)[0])
}
 Proj[index_proj].extent = newExtent
  newProj.setExtent(newExtent);
  var newView = new View({
    projection: newProj,
    // center:center,
    //extent:newExtent,
    zoom:4,
    maxZoom:25,
    minZoom:-2
  });
    map.setView(newView);
    newView.fit(newExtent);
}