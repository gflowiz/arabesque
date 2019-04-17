import * as turf from "@turf/turf"

export function computeMinStatNode(nodes, links, id_ori, id_dest, id_vol){
  var keys = Object.keys(nodes)
  console.log(nodes)
  for(var p = 0; p< keys.length; p++){
    nodes[keys[p]].properties.outdegree = 0;
    nodes[keys[p]].properties.indegree = 0;
    nodes[keys[p]].properties.degree = 0;
    nodes[keys[p]].properties.balance = 0;
  }

  var len = links.length

  for(var p = 0; p< len; p++){
    nodes[links[p][id_dest]].properties.indegree = Number(links[p][id_vol])   + (nodes[links[p][id_dest]].properties.indegree || 0)
    nodes[links[p][id_ori]].properties.outdegree = Number(links[p][id_vol])   + (nodes[links[p][id_ori]].properties.outdegree || 0)

    nodes[links[p][id_dest]].properties.degree = Number(links[p][id_vol])+(nodes[links[p][id_dest]].properties.degree || 0)
    nodes[links[p][id_ori]].properties.degree = Number(links[p][id_vol])+(nodes[links[p][id_ori]].properties.degree || 0)

    nodes[links[p][id_dest]].properties.balance =   (nodes[links[p][id_dest]].properties.balance || 0) - Number(links[p][id_vol])
    nodes[links[p][id_ori]].properties.balance =   (nodes[links[p][id_ori]].properties.balance || 0) + Number(links[p][id_vol]) 
  }


}

export function computeDistance(nodes, links, id_ori, id_dest,isCSV,  unit){
  var len = links.length
  for(var p = 0; p< len; p++){
    // if(isCSV){
    links[p].distance = turf.distance(nodes[links[p][id_ori]], nodes[links[p][id_dest]], {units: unit})
    // }
    // else{
    //   if(typeof nodes[links[p][id_ori]] === 'undefined'){
    //     nodes[links[p][id_ori]] = turf.point([0,0])
    //   }
    //   if(typeof nodes[links[p][id_dest]] === 'undefined'){
    //     nodes[links[p][id_ori]] = turf.point([0,0])
    //   }
    //   links[p].distance = turf.distance(getTurfCentroid(nodes[links[p][id_ori]]),getTurfCentroid(nodes[links[p][id_dest]]),{units: unit})
    // }
  }
}


function getTurfCentroid(feature){


if (feature.geometry.type == "MultiPolygon") {
    var maxArea = 0;
    var area = -1;
    ll = feature.geometry.coordinates.length;
    for (i = 0; i < ll; i++) {
      polyg = turf.polygon(feature.geometry.coordinates[i]);
      var newArea = turf.area(polyg);
        if (area < newArea) {
          maxArea = i;
          area = newArea;
        }
    }
   return turf.centroid(turf.polygon(feature.geometry.coordinates[maxArea]))
 }
 else {
     return turf.centroid(feature) 
    } 
 
}