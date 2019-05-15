import {setNextProj, getCentroid} from "./projection.js"; 
import {getZoomFromVerticalBounds, createGeoJSON, prepareLinkData} from "./main.js"
import {addLayerGestionMenu} from "./control.js"
import {refreshFilterModal, addFilterToScreen, loadNumFilter, loadSingleCatFilter, checkDataToFilter,binDataNumValue, binDataRemoveValue, binDataCatValue } from "./filter.js"
import {addOSMLayer, addNewLayer, addLayerFromURL} from "./layer.js";
import {computeMinStatNode, computeDistance, checkIDLinks} from "./stat.js";
import {applyNewStyle, nodeOrderedCategory, linkOrderedCategory} from "./semiology.js";

import {parse as papaparse} from "papaparse"


function  loadMapFromSave(name_savedMap){
	saved_file = $.getJSON("./data/save/save_map.json")
	saveToUpload = saved_file.responseJSON[name_savedMap]
	setupGlobalVariablesFromSave(saveToUpload)
}

export function loadMapFromPresetSave(name_savedMap, map, global_var, datasets){ 


		$.getJSON("public/data/save/saved_example.json",function(json){    
		
        var save_para = json[name_savedMap];
		$.get(save_para.files.node,function(nodes){
			$.get(save_para.files.link, function(links){



 global_var.projection = loadPojection(save_para.projection);

 				setupGlobalVariablesFromSave(save_para, global_var);
 				loadDataForExample(save_para.files,links,nodes, datasets);
 				setupMapandHashData(map, datasets, global_var)
 				console.log(datasets.hashedStructureData)
 				computeMinStatNode(datasets.hashedStructureData , datasets.links, global_var.ids.linkID[0],global_var.ids.linkID[1], global_var.ids.vol);
 				datasets.links =prepareLinkData(datasets.links, global_var.ids.linkID[0],global_var.ids.linkID[1], datasets.hashedStructureData, global_var.ids.vol);

 				
 			    computeDistance(datasets.hashedStructureData , datasets.links, global_var.ids.linkID[0],global_var.ids.linkID[1], save_para.files.Ntype !== 'geojson' ,'kilometers');


				 loadFilter(save_para.filter)	 //TODO IMPORT  DATA FILTER

				 loadLayerData(save_para.base_layer, global_var.layers.base)

				 	if(save_para.style.link.color.cat==='categorical'){
				        linkOrderedCategory(global_var.style.link.color.var, global_var.style.link)
				      }
				     if(save_para.style.node.color.cat==='categorical'){
				        nodeOrderedCategory(global_var.style.node.color.var, global_var.style.node)
				      }

				 applyNewStyle("link")
				 applyNewStyle("node")
				document.getElementById("addFilterButton").disabled = false;
				$('.arrival').fadeOut(450, function(){ $(this).remove();});

				return
			})
			return
		})


		return
    })   

}


export function loadFilter(list_filter){
	var len_filter = list_filter.link.length
	for(var x = 0; x<len_filter; x++){

		var filter = list_filter.link[x];

		if(filter.filter === "numeral"){
			loadNumFilter('link', filter.variable, filter.values);
			binDataNumValue('link',filter.variable, data)
			
		}
		else if(filter.filter === "categorial"){
			loadSingleCatFilter('link', filter.variable, filter.values);
			binDataCatValue('link',filter.variable, data)
		}		
		else if(filter.filter === "remove"){
			loadSingleCatFilter('link', filter.variable, filter.values);
			binDataRemoveValue('link', filter.variable, data, '')
		}
	}
	var len_filter = list_filter.node.length
	for(var x = 0; x<len_filter; x++){

		var filter = list_filter.node[x];

		if(filter.filter === "numeral"){
			loadNumFilter('node', filter.variable, filter.values);
			
		}
		else if(filter.filter === "categorial"){
			loadSingleCatFilter('node', filter.variable, filter.values);
			
		}		
		else if(filter.filter === "remove"){
			loadSingleCatFilter('node', filter.variable, filter.values);
			
		}
	}
}



function setupGlobalVariablesFromSave(saved_Json, global_var){
	global_var.files = saved_Json.files
	global_var.filter = saved_Json.filter;
	global_var.style = saved_Json.style;
	global_var.ids = saved_Json.ids
}


function loadBaseLayerFromSaved(){
	console.log(data.nodes)
}

function loadDataForExample(file_json, data_link,data_geo, data){

	//Link Import
	//TODOREDO readdata.links
	if (file_json.Ltype === "csv"){
					data.links = papaparse(data_link,{header: true}).data
		
	}
	else{
			data.links = data_link		
	} 
	

	//Node Import
	if (file_json.Ntype === "geojson"){
			data.nodes = data_geo
	} 
	else if (file_json.Ntype === "json"){
			data.nodes = createGeoJSON(data_geo)
		
	}
	else if (file_json.Ntype === "csv")
	{
			data.nodes  = createGeoJSON(papaparse(data_geo,{header: true}).data)
	}


}

function loadPojection(savedProj){
	var byDefaultProjection = Proj[0]
	if(savedProj.proj4 === null)
		{
			//TODO ADD CHANGE PROJ
			for(var m = 0; m<Proj.length; m++){
				if (Proj[m].name === savedProj.name){
					console.log(Proj[m])
					setNextProj( map, m, savedProj.name)
					console.log(m)
					return Proj[m];
				}
			}
			

			
		}
	else{
		//TODO LOAD PROJ4 TO THE CURRENT PROJ AND SET THE EXTENT 
		return
	}
return byDefaultProjection;

}

function setupMapandHashData(map, data, global_var){

  
  var maxX = - Infinity;
  var minX = Infinity;

  var maxY = - Infinity;
  var minY = Infinity;


  var len = data.nodes.features.length;
  for(var p=0; p<len; p++){

    data.hashedStructureData[data.nodes.features[p].properties[global_var.ids.nodeID]] = data.nodes.features[p];
    var centroid = getCentroid(data.nodes.features[p], global_var.projection.name)
    data.hashedStructureData[data.nodes.features[p].properties[global_var.ids.nodeID]].properties["centroid"] = centroid   
    data.hashedStructureData[data.nodes.features[p].properties[global_var.ids.nodeID]].properties[global_var.ids.vol] = 0

    

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
global_var.style.ratioBounds = Math.max(lx,ly)* 0.0002
global_var.center =  [minX+lx/2,minY+ly/2]
data.links = checkIDLinks(data.links, Object.keys(data.hashedStructureData), global_var.ids.linkID[0], global_var.ids.linkID[1])
map.getView().setCenter(global_var.center)
map.getView().setZoom(getZoomFromVerticalBounds(ly));



}

function loadLayerData(base_layers, layers){

	for(var g= 0; g<base_layers.length;g++){
		var layer = base_layers[g]
		layers[layer.name] = {}
			console.log(layer.style)
		layers[layer.name].layer = addLayerFromURL(map, ListUrl[layer.name],layer.name, layer.style.opacity, layer.style.stroke, layer.style.fill)
		layers[layer.name].style = layer.style
		addLayerGestionMenu(layer.name);
	}
}

// SAVE PART//
function saveMap(name_map){
	if(existingSave(name_map)){
		return alert('Name already taken')
	}
}


function existingSave(name){
	savedNames = getSaveMapNames()
	return savedNames.includes(name);
}

function getSaveMapNames(){
	return Object.keys(allSavedMap)
}

