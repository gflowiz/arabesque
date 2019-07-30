import * as turf from "@turf/turf"
import {transform, get as getProjection} from 'ol/proj.js';
import {testLinkDataFilter,applyNodeDataFilter} from './filter.js'
import {groupLinksByOD} from './layer.js'
import JSZip from 'jszip'
import {saveAs} from 'file-saver';

export function computeMinStatNode(nodes, links, id_ori, id_dest, id_vol){
  var keys = Object.keys(nodes)
  // 
  for(var p = 0; p< keys.length; p++){
    nodes[keys[p]].properties = Object.assign({"weigthed indegree": 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({"weigthed outdegree": 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({"weigthed degree": 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({"weigthed balance": 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({"indegree": 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({"outdegree": 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({"degree": 0}, nodes[keys[p]].properties)
    nodes[keys[p]].properties = Object.assign({balance: 0}, nodes[keys[p]].properties)

  }

  var len = links.length

  for(var p = 0; p< len; p++){
    nodes[links[p][id_dest]].properties.indegree = 1   + nodes[links[p][id_dest]].properties.indegree 
    nodes[links[p][id_ori]].properties.outdegree = 1   + nodes[links[p][id_ori]].properties.outdegree 

    nodes[links[p][id_dest]].properties.degree = 1 + nodes[links[p][id_dest]].properties.degree 
    nodes[links[p][id_ori]].properties.degree  = 1 + nodes[links[p][id_ori]].properties.degree 

    nodes[links[p][id_dest]].properties["weigthed balance"] =   nodes[links[p][id_dest]].properties["weigthed balance"] + Number(links[p][id_vol])
    nodes[links[p][id_ori]].properties["weigthed balance"]  =   nodes[links[p][id_ori]].properties["weigthed balance"]  - Number(links[p][id_vol]) 


    nodes[links[p][id_dest]].properties.balance =   nodes[links[p][id_dest]].properties.balance + 1
    nodes[links[p][id_ori]].properties.balance  =   nodes[links[p][id_ori]].properties.balance  - 1

    nodes[links[p][id_dest]].properties["weigthed indegree"] = Number(links[p][id_vol])   + nodes[links[p][id_dest]].properties["weigthed indegree"] 
    nodes[links[p][id_ori]].properties["weigthed outdegree"] = Number(links[p][id_vol])   + nodes[links[p][id_ori]].properties["weigthed outdegree"] 

    nodes[links[p][id_dest]].properties["weigthed degree"] = Number(links[p][id_vol]) + nodes[links[p][id_dest]].properties["weigthed degree"] 
    nodes[links[p][id_ori]].properties["weigthed degree"]  = Number(links[p][id_vol]) + nodes[links[p][id_ori]].properties["weigthed degree"] 
  }


}

export function computeReduceMinStatNode(nodes, links, id_ori, id_dest, id_vol){
  var keys = Object.keys(nodes)
  // 
  for(var p = 0; p< keys.length; p++){
    nodes[keys[p]].properties["weigthed indegree"] = 0
    nodes[keys[p]].properties["weigthed outdegree"] = 0
    nodes[keys[p]].properties.balance = 0
    nodes[keys[p]].properties["weigthed degree"] = 0

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

export function computeTotalVolume(links, id_vol, global_data_){

  var totalSum = 0
  for(var p=0; p<links.length;p++){
      totalSum = totalSum + Number(links[p][id_vol])
  }
  global_data_.totalSum = totalSum
}


export function checkIDLinks(links, nodes_list, id_ori, id_dest, error_node_message){
  // var list_id_ori
  // var list_id_dest
  var list_of_links = [];
  var has_link_removed = false;
  var filtered_links = [];
  var n = 0;
  for(var p=0; p<links.length;p++){
    if(nodes_list.includes(links[p][id_ori]) && nodes_list.includes(links[p][id_dest])){
      filtered_links.push(links[p])
    }
    else{
      list_of_links.push(p)
      n++;
      has_link_removed = true;
    }
  }

  if(has_link_removed){
    alert(error_node_message+"\n\n"+n+" Links have been removed. No equivalent nodes have been found. \n The links number  " + list_of_links.toString() +" were removed \n")
  }
  else if (error_node_message.length !== 0){
    
    alert(error_node_message)
  }
return filtered_links
}

export function computeDistance(nodes, links, id_ori, id_dest,isCSV,  unit){
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

export function exportLinksAndNodes(data, filter, conf) { 
// get Filter ID links and nodes
    var id_links = testLinkDataFilter(filter.link, data)
    var selected_nodes = applyNodeDataFilter(data.hashedStructureData)
    var removed_nodes = selected_nodes[1]
    var list_nodes = Object.keys(selected_nodes[0])
    var ODlinks = groupLinksByOD(data.links, id_links, conf.ids.linkID[0], conf.ids.linkID[1])
    var oriIDS = Object.keys(ODlinks);
    var linksListToExport = [];
    for (var j = 0; j < oriIDS.length; j++) {
        var Dlinks =  Object.keys(ODlinks[oriIDS[j]])
        for (var i = 0; i < Dlinks.length ; i++) {
                if((list_nodes.includes(oriIDS[j]) || list_nodes.includes(Dlinks[i]) ) && !(removed_nodes.includes(Dlinks[i]) || removed_nodes.includes(oriIDS[j]))){
                var listLinksOD = ODlinks[oriIDS[j]][Dlinks[i]]
                for(var p = 0; p < listLinksOD.length; p++){
                  linksListToExport.push(data.links[listLinksOD[p]])
                }
            }
        }
    }

console.log(linksListToExport)
  // var zip = new JSZip();

  // zip.file("links.json", JSON.stringify(linksListToExport));
  // // zip.file("nodes.json", JSON.stringify(global_data));
  // zip.generateAsync({
  //     type: "blob"
  //   })
  //   .then(function (content) {
  //     // see FileSaver.js
  //     saveAs(content, "Save_GFlowiz_Map.zip");
  //   });

  // addLegendToMap()
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
  // 
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




