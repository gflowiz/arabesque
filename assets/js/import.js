
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

  global_data.ids.linkID[0] = document.getElementById('importIDOri').value
  global_data.ids.linkID[1] = document.getElementById('importIDDest').value
  global_data.ids.vol = document.getElementById('importIDVol').value
  
  global_data.ids.nodeID = document.getElementById('importIDStruct').value
  if(global_data.files.Ntype === 'csv'){

    global_data.ids.long = document.getElementById('importLatStruct').value
    global_data.ids.lat = document.getElementById('importLonStruct').value
    data.nodes = createGeoJSON(data.nodes);
  }

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
console.log(used_nodes)
progressBarLoading("waitLoad", 35)
  var list_id_nodes = []
  var list_doublon_nodes = []
  var len = data.nodes.features.length;
  for(var p=0; p<len; p++){

    if (!list_id_nodes.includes(data.nodes.features[p].properties[global_data.ids.nodeID]) && used_nodes.includes(data.nodes.features[p].properties[global_data.ids.nodeID])){
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



// var indexNodes =  Object.keys(data.hashedStructureData)

// var len = data.links.length;

// var  diagTable =   Array(indexNodes.length).fill(null).map(() => Array(indexNodes.length).fill(null).map(() => []));
  
// var len = data.links.length;
// for(var i = 0; i<len; i++)
// {
//   diagTable[indexNodes.indexOf(data.links[i][global_data.ids.linkID[0]])][indexNodes.indexOf(data.links[i][global_data.ids.linkID[1]])].push(i)
//     // console.log(diagTable[value][indexNodes.indexOf(data.links[i][global_data.ids.linkID[0]])][indexNodes.indexOf(data.links[i][global_data.ids.linkID[1]])])
// }
// console.log(diagTable)
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