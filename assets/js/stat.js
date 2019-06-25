import * as turf from "@turf/turf"
import {transform, get as getProjection} from 'ol/proj.js';

export function computeMinStatNode(nodes, links, id_ori, id_dest, id_vol){
  var keys = Object.keys(nodes)
  // console.log(nodes)
  for(var p = 0; p< keys.length; p++){
    nodes[keys[p]].properties = Object.assign({outdegree: 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({indegree: 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({degree: 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({balance: 0}, nodes[keys[p]].properties)

  }

  var len = links.length

  for(var p = 0; p< len; p++){
    nodes[links[p][id_dest]].properties.indegree = Number(links[p][id_vol])   + nodes[links[p][id_dest]].properties.indegree 
    nodes[links[p][id_ori]].properties.outdegree = Number(links[p][id_vol])   + nodes[links[p][id_ori]].properties.outdegree 

    nodes[links[p][id_dest]].properties.degree = Number(links[p][id_vol]) + nodes[links[p][id_dest]].properties.degree 
    nodes[links[p][id_ori]].properties.degree  = Number(links[p][id_vol]) + nodes[links[p][id_ori]].properties.degree 

    nodes[links[p][id_dest]].properties.balance =   nodes[links[p][id_dest]].properties.balance + Number(links[p][id_vol])
    nodes[links[p][id_ori]].properties.balance  =   nodes[links[p][id_ori]].properties.balance  - Number(links[p][id_vol]) 
  }


}



// export isStatMinMustBeCompute(nodes, links, id_ori, id_dest, id_vol, size_var){
//   if (['degree','balance', 'indegree', 'outdegree'].includes(size_var)){
//     computeReduceMinStatNode(nodes, links, id_ori, id_dest, id_vol)
//   }
// }

export function computeReduceMinStatNode(nodes, links, id_ori, id_dest, id_vol){
  var keys = Object.keys(nodes)
  // console.log(nodes)
  for(var p = 0; p< keys.length; p++){
    nodes[keys[p]].properties.indegree = 0
    nodes[keys[p]].properties.outdegree = 0
    nodes[keys[p]].properties.balance = 0
    nodes[keys[p]].properties.degree = 0

  }

  var len = links.length

  for(var p = 0; p< len; p++){
    nodes[data.links[links[p]][id_dest]].properties.indegree = Number(data.links[links[p]][id_vol])   + nodes[data.links[links[p]][id_dest]].properties.indegree 
    nodes[data.links[links[p]][id_ori]].properties.outdegree = Number(data.links[links[p]][id_vol])   + nodes[data.links[links[p]][id_ori]].properties.outdegree 

    nodes[data.links[links[p]][id_dest]].properties.degree = Number(data.links[links[p]][id_vol]) + nodes[data.links[links[p]][id_dest]].properties.degree 
    nodes[data.links[links[p]][id_ori]].properties.degree  = Number(data.links[links[p]][id_vol]) + nodes[data.links[links[p]][id_ori]].properties.degree 

    nodes[data.links[links[p]][id_dest]].properties.balance =   nodes[data.links[links[p]][id_dest]].properties.balance + Number(data.links[links[p]][id_vol])
    nodes[data.links[links[p]][id_ori]].properties.balance  =   nodes[data.links[links[p]][id_ori]].properties.balance  - Number(data.links[links[p]][id_vol]) 
  }


}
// export function checkIDLinks(nodes_list, ids, file_type){
//   // var list_id_ori
//   // var list_id_dest
//   var has_link_removed = false;
//   var filtered_links = [];
//   var n = 0;
//   for(var p=0; p<links.length;p++){
//     if(nodes_list.includes(links[p][id_ori]) && nodes_list.includes(links[p][id_dest])){
//       filtered_links.push(links[p])
//     }
//     else{
//       n++;
//       has_link_removed = true;
//     }
//   }
//   console.log('-----------------------------------')

//   console.log(n)
//   if(has_link_removed){
//     alert(n+" Links have been removed. No equivalent nodes have been found.")
//   }
// return filtered_links
// }

export function checkIDLinks(links, nodes_list, id_ori, id_dest){
  // var list_id_ori
  // var list_id_dest
  var has_link_removed = false;
  var filtered_links = [];
  var n = 0;
  for(var p=0; p<links.length;p++){
    if(nodes_list.includes(links[p][id_ori]) && nodes_list.includes(links[p][id_dest])){
      filtered_links.push(links[p])
    }
    else{
      n++;
      has_link_removed = true;
    }
  }
  console.log('-----------------------------------')

  console.log(n)
  if(has_link_removed){
    alert(n+" Links have been removed. No equivalent nodes have been found.")
  }
return filtered_links
}

export function computeDistance
(nodes, links, id_ori, id_dest,isCSV,  unit){
  var len = links.length
  for(var p = 0; p< len; p++){
    if(isCSV){
      links[p].distance = turf.distance(nodes[links[p][id_ori]], nodes[links[p][id_dest]], {units: unit})
    }
    else{
      links[p].distance = turf.distance(getTurfCentroid(nodes[links[p][id_ori]]),getTurfCentroid(nodes[links[p][id_dest]]),{units: unit})
    }
  }
}


function getTurfCentroid(feature){


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
   return turf.centroid(turf.polygon(feature.geometry.coordinates[maxArea]))
 } 
 else if (feature.geometry.type == "Point"){
      return feature.geometry.coordinates
    }
 else {
     return turf.centroid(feature) 
    } 
 
}

function median(values) {

    values.sort( function(a,b) {return a - b;} );

    var half = Math.floor(values.length/2);

    if(values.length % 2)
        return values[half];
    else
        return (values[half-1] + values[half]) / 2.0;
}

export function getAggregateValue(list_value_link){
  var aggrFunction = global_data.files.aggr;
  // console.log(aggrFunction)
  return window[aggrFunction](list_value_link)
}

function mean(values){
  const add = (a, b) =>  a + b
  return values.reduce(add)/ values.length
}

function sum(values){
  const add = (a, b) =>  a + b
  return values.reduce(add)
}


function max(values){
  return Math.max(...values)
}

function min(values){
  return Math.min(...values)
}

window.min = min
window.max = max
window.sum = sum
window.median = median
window.mean = mean
