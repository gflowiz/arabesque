import {setNextProj, getCentroid, loadZipProjection} from "./projection.js"; 
import {getZoomFromVerticalBounds, createGeoJSON, prepareLinkData} from "./main.js"
import {addLayerGestionMenu, addLayerImportGestionMenu} from "./control.js"
import {refreshFilterModal, addFilterToScreen, loadNumFilter, loadSingleCatFilter, loadRemoveFilter, checkDataToFilter,loadBinFilterData, loadTemporalFilter, loadTimeLapseFilter} from "./filter.js"
import {addOSMLayer, addNewLayer, addLayerFromURL, addTileLayer, addGeoJsonLayer,getLayerFromName} from "./layer.js";
import {computeMinStatNode, computeDistance, checkIDLinks, computeTotalVolume} from "./stat.js";
import {applyNewStyle, nodeOrderedCategory, linkOrderedCategory} from "./semiology.js";

import {parse as papaparse} from "papaparse"
import {transform} from 'ol/proj.js';


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

 				datasets.links =prepareLinkData(datasets.links, global_var.ids.linkID[0],global_var.ids.linkID[1], datasets.hashedStructureData, global_var.ids.vol);
 				computeMinStatNode(datasets.hashedStructureData , datasets.links, global_var.ids.linkID[0],global_var.ids.linkID[1], global_var.ids.vol);
 				

 			
 				
 			    computeDistance(datasets.hashedStructureData , datasets.links, global_var.ids.linkID[0],global_var.ids.linkID[1], save_para.files.Ntype !== 'geojson' ,'kilometers');
				 loadFilter(save_para.filter)	 //TODO IMPORT  DATA FILTER

				 loadLayerData(save_para.base_layer, global_var.layers.base)

				 	if(save_para.style.link.color.cat==='categorical'){
				        linkOrderedCategory(global_var.style.link.color.var, global_var.style.link)
				      }
				      
				     if(save_para.style.node.color.cat==='categorical'){
				        nodeOrderedCategory(global_var.style.node.color.var, global_var.style.node)
				        
				      }

  				 computeTotalVolume(datasets.links, global_var.ids.vol, global_var)
				 applyNewStyle("link")
				 applyNewStyle("node")

 				map.getView().fit(getLayerFromName(map, 'link').getSource().getExtent())
 				if (document.getElementsByClassName('ol-legend')[0].classList.toggle('ol-collapsed') === true) {
				    document.getElementsByClassName('ol-legend')[0].classList.toggle('ol-collapsed')
				  }
				document.getElementById("addFilterButton").disabled = false;
				$('.arrival').hide(50);

				return
			})
			return
		})


		return
    })   

}


export function loadFilter(list_filter){
	var len_filter = list_filter.link.length


	for(var c = 0;  c<len_filter;  c++){
		var filter = list_filter.link[c];

	    loadBinFilterData('link', filter.variable, filter, data);
	}


	for(var c = 0;  c<len_filter;  c++){
		var filter = list_filter.link[c];
		if(filter.filter === "numeral"){
			// loadBinFilterData('link',filter.variable,filter, data);
			loadNumFilter('link', filter.variable, filter.values);
			
		}
		else if(filter.filter === "categorial"){

			// loadBinFilterData('link',filter.variable, filter, data);
			loadSingleCatFilter('link', filter.variable, filter.values);
		}		
		else if(filter.filter === "remove"){

			// loadBinFilterData('link', filter.variable, filter, data);
			loadRemoveFilter('link', filter.variable, filter.values);
		}		
		else if(filter.filter === "temporal"){

			// loadBinFilterData('link', filter.variable, filter, data);
			loadTemporalFilter('link', filter.variable, filter.values);
		}		
		else if(filter.filter === "timeLapse"){
			// loadBinFilterData('link', filter.variable, filter, data);
			loadTimeLapseFilter('link', filter.variable, filter.values);
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
			loadRemoveFilter('node', filter.variable, filter.values);
			
		}		
		else if(filter.filter === "temporal"){
			loadRemoveFilter('link', filter.variable, filter.values);
			// binDataRemoveValue('link', filter.variable, data, '')
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

function loadPojection(savedProj, center){
	
	setNextProj( map, savedProj.name , center);
return savedProj
}

export function loadZippedMap(){

// loadZipProjection
	
	loadZipProjection(map, global_data.projection, global_data.center, global_data.zoom)
	loadFilter(global_data.filter)
	loadBaseZipLayerData(global_data.layers.base)
	loadImportZipLayerData(global_data.layers.import)
	loadZipOSMLayerData(global_data.layers.osm)

		applyNewStyle("link")
		applyNewStyle("node")
		map.getView().setCenter(transform(global_data.center, 'EPSG:4326',global_data.projection.name))
		map.getView().setZoom(global_data.zoom)
		// loadZipProjection(map, global_data.projection, global_data.center, global_data.zoom)
  $("#featureCard").toggle();
    $('.arrival').hide(50)

}

function setupMapandHashData(map, dataset, global_var){

  console.log(dataset)
  var maxX = - Infinity;
  var minX = Infinity;

  var maxY = - Infinity;
  var minY = Infinity;
	var len = dataset.links.length;
  var used_nodes = []
  for(var i = 0; i<len; i++)
  {
    if (!used_nodes.includes(dataset.links[i][global_data.ids.linkID[0]])){
      used_nodes.push(dataset.links[i][global_data.ids.linkID[0]])
    }
    if (!used_nodes.includes(dataset.links[i][global_data.ids.linkID[1]])){
      used_nodes.push(dataset.links[i][global_data.ids.linkID[1]])
    }
  }
	var list_id_nodes =[]
  var len = dataset.nodes.features.length;
  console.log(len)
  for(var p=0; p<len; p++){
 	if (!list_id_nodes.includes(dataset.nodes.features[p].properties[global_data.ids.nodeID]) && used_nodes.includes(dataset.nodes.features[p].properties[global_data.ids.nodeID])){
    dataset.hashedStructureData[dataset.nodes.features[p].properties[global_var.ids.nodeID]] = dataset.nodes.features[p];
    var centroid = getCentroid(dataset.nodes.features[p], global_var.projection.name)
    dataset.hashedStructureData[dataset.nodes.features[p].properties[global_var.ids.nodeID]].properties["centroid"] = centroid   
    dataset.hashedStructureData[dataset.nodes.features[p].properties[global_var.ids.nodeID]].properties[global_var.ids.vol] = 0

      list_id_nodes.push(dataset.nodes.features[p].properties[global_data.ids.nodeID])


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

}

var lx = maxX - minX
var ly = maxY - minY
global_var.style.ratioBounds = Math.max(lx,ly)* 0.0002
global_var.center =  [minX+lx/2,minY+ly/2]
  

data.links = checkIDLinks(dataset.links, list_id_nodes, global_var.ids.linkID[0], global_var.ids.linkID[1], "")
map.getView().setCenter(global_var.center)
global_var.center = transform(global_var.center,global_data.projection.name,"EPSG:4326")
map.getView().setZoom(getZoomFromVerticalBounds(ly));
global_var.zoom = getZoomFromVerticalBounds(ly)

return dataset.hashedStructureData
}

function loadLayerData(base_layers, layers){

	for(var g= 0; g<base_layers.length;g++){
		var layer = base_layers[g]
		layers[layer.name] = {}
			
		addLayerFromURL(map, ListUrl[layer.name],layer.name, layer.attributions, layer.style.opacity, layer.style.stroke, layer.style.fill)
		layers[layer.name].style = layer.style
		// 
		addLayerGestionMenu(layer.name);
	}
}

function loadBaseZipLayerData(layers){

	for(var g in layers){
		addLayerFromURL(map, ListUrl[g],g,layers[g].attributions, layers[g].style.opacity, layers[g].style.stroke, layers[g].style.fill)
		addLayerGestionMenu(g);
	}
}

function loadImportZipLayerData(layers){

	for(var g in layers){
		addGeoJsonLayer(map, data[g],g, layers[g].style.opacity, layers[g].style.stroke, layers[g].style.fill)
		addLayerImportGestionMenu(g);
	}
}

function loadZipOSMLayerData(layers){

	for(var g in layers){
		addTileLayer(map, layers, layers[g].url, g, layers[g].attributions)
		// layers[layer.name].style = layer.style
		// addLayerGestionMenu(g);
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

