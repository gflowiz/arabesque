import {getNameVariables} from "./control.js"
import {setupMaxAndMin} from "./semiology.js"
import {getNameLayers} from "./projection.js"

import {addNodeLayer, addLinkLayer} from "./layer.js";

import 'bootstrap-select'

export function addSelectFilterLink(dataset){


  var nameData = document.getElementById('valueTofilter').value;
  var type = typeof dataset[0][nameData];

  if(type === "string"){
    addNodeStringFilters()
  }
  else if(type === "number"){
    addNodeNumberFilters()
  }
  else {
    refreshFilterModal();
  }
}

export function addSelectFilterNode(dataset){


  var nameData = document.getElementById('valueTofilter').value;
  var type = typeof dataset.features[0].properties[nameData];
  
  if(type === "string"){
    addNodeStringFilters()
  }
  else if(type === "number"){
    addNodeNumberFilters()
  }
  else {
    refreshFilterModal();
  }

}

function addNodeNumberFilters(){
  $('#filterLayerBody>div').append($('<div>')
                                .attr("class","col-md-4")
                                .attr("id","selectFilter")
                                .append($('<select>')
                                  .attr('class','custom-select')
                                  .attr("id","selectedFilter")
                                  .append($("<option selected>"))
                                  .append($("<option>" , {text:"Numeral", value:'Num'}))
                                  .append($("<option>" , {text:"Categories", value:'single'}))
                                  )

                                );
}

function addNodeStringFilters(){
  $('#filterLayerBody>div').append($('<div>')
                                .attr("class","col-md-4")
                                .attr("id","selectFilter")
                                .append($('<select>')
                                  .attr('class','custom-select')
                                  .attr("id","selectedFilter")
                                  .append($("<option selected>"))
                                  .append($("<option>" , {text:"Categories", value:'single'}))
                                  .append($("<option>" , {text:"Numeral", value:'Num'}))
                                  )

                                );
}

function addFilter(name, dataset){
  if(document.getElementById('selectFilter') !== null){
    $('#selectFilter').remove();
  }

  if(name==='node'){
    addSelectFilterNode(dataset.nodes);
  }
  else if (name ==='link'){
    addSelectFilterLink(dataset.links);
  }
}

export function refreshFilterModal(){
  $('#filterLayerBody>div').remove()
}

export function addFilterToScreen(){

var name_layer = document.getElementById('filteredLayer').value;
var name_variable = document.getElementById('valueTofilter').value;
var name_filter = document.getElementById('selectedFilter').value;




if(name_filter === 'Num'){
  addNumFilter(name_layer, name_variable);
  refreshFilterModal();
  return;  
}
if(name_filter === 'single'){
  addSingleCatFilter(name_layer, name_variable);
  refreshFilterModal();
  return;  
}

}


function removeFilter(var_to_remove){
  var id = var_to_remove.split(' ').join('').replace(/[^\w\s]/gi, ''); 
  $("#filter"+id).parent().remove();
  for(var p=0; p<global_data.filter.length; p++){
    if(global_data.filter[p].variable === var_to_remove){
      global_data.filter.splice(p, 1);
        refreshFilterFeaturesLayers();
        return;
    }
  }

}

function removeCatFilter(var_to_remove){
  var id = var_to_remove.split(' ').join('').replace(/[^\w\s]/gi, ''); 
  $("#filter"+id).parent().parent().parent().remove();
  for(var p=0; p<global_data.filter.length; p++){
    if(global_data.filter[p].variable === var_to_remove){
      global_data.filter.splice(p, 1);
        refreshFilterFeaturesLayers();
        return;
    }
  }

}
function addSingleCatFilter(name_layer,name_variable){

  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')
$('#filterDiv').append($('<div>')
                          .attr("class","row align-items-center m-3")
                          .append($("<label>", {text:name_layer+": "+name_variable})
                                  .attr('for',"filter"+id)
                                  .attr('class',"h5")
                                  )
                          .append($('<div>')
                            .attr("class","col-sm-10 align-items-center p-0")
                            .attr("id","filterCat")

                          .append($('<select multiple>')
                            .attr('class',"selectpicker")
                            // .attr('data-toggle','dropdown')
                            // .attr('searchable',"Search here..")
                            .attr("id","filter"+id)
                            // .attr("onchange","changeCatFilterArray('"+name_layer+"','"+name_variable+"','evaluateSingleCat' ,'#filter"+id+"')")
                            // .append('<option disabled selected>Choose your variables</option>')
                              )
                          ).append($('<div>')
                                  .attr("class","col-sm-1 center-block p-0")
                                  .append($('<button>')
                                    .attr("type","button")
                                    .attr("id", "removeCatFilterButton"+id)
                                    .attr("class","close center-block")
                                    .attr("aria-label",'Close')                               
                                    .append('<img class="icon" src="assets/svg/si-glyph-trash.svg"/>')
                                    
                                  )
                                )
                          );
document.getElementById("removeCatFilterButton"+id).addEventListener("click", function(){removeCatFilter(name_variable)});  

document.getElementById("filter"+id).addEventListener("change", function(){
  changeCatFilterArray(name_layer,name_variable,'evaluateSingleCat' ,'#filter'+id);

});
  if(name_layer==='node'){
    var keysToShow = [... new Set(data.nodes.features.map(function(item){return item.properties[name_variable]}))]
  }
  else if (name_layer ==='link'){
    var keysToShow = [... new Set(data.links.map(function(item){return item[name_variable]}))]
  }
  for(var p=0; p<keysToShow.length; p++){
    $('#filter'+id).append($('<option>', {text:String(keysToShow[p]) })
                        .attr("value",keysToShow[p])
                        );
                      
    }
$("#filter"+id).selectpicker();
return;
}

export function loadSingleCatFilter(name_layer,name_variable,values){

  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')


  addSingleCatFilter(name_layer,name_variable)
  $("#filter"+id).selectpicker("val", values);
return;
}


function getRange(name_layer, name_variable){

  if(name_layer === 'node'){
    var mappedVariable = data.nodes.features.map(function(item){return item.properties[name_variable]})
  }
  else if(name_layer === "link"){
    var mappedVariable = data.links.map(function(item){return item[name_variable]})
  }

  return [Math.min(...mappedVariable), Math.max(...mappedVariable)]
}


export function checkDataToFilter(){
 
  $('#filterLayerBody').append($('<div>')
                        .attr('class','row')
                        .append($("<div>")
                          .attr("class","col-md-4")
                          .append($("<select>")
                            .attr("class","custom-select")
                            .attr("id","filteredLayer")
                            .append($("<option selected>" , {text:"Choose ..."}))
                            .append($("<option>" , {text:"Link", value:'link'}))
                            .append($("<option>" , {text:"Node", value:'node'}))
                            )
                          )
                        )
document.getElementById("filteredLayer").addEventListener("change", function(){addValuesToFilter()});    
}



 function addValuesToFilter(){

    var  sel = document.getElementById("filteredLayer");
    var iLayer = sel.options[ sel.selectedIndex ].value;
 

    var keysToShow = getNameVariables(iLayer);

    if(document.getElementById('valueTofilter') !== null){
      $('#valueTofilter').parent().remove();
    }
    if(document.getElementById('selectFilter') !== null){
      $('#selectFilter').remove();
    }

    if(keysToShow)
    $('#filterLayerBody>div').append($('<div>')
                                .attr("class","col-md-4")
                                .append($('<select>')
                                  .attr('class','custom-select')
                                  .attr("id","valueTofilter")
                                  )
                                );

    for(var p=0; p<keysToShow.length; p++){
    $('#valueTofilter').append($('<option>', {text:keysToShow[p] })
                        .attr("value",keysToShow[p])
                        );
                      
    }   
    document.getElementById("valueTofilter").addEventListener("change", function(){addFilter(iLayer, data)});                   
}


 export function loadNumFilter(name_layer, name_variable, values){
  
    var  id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '');    // get range and How slae min/2 

    $('#filterDiv').append($('<div>')
                                .attr("class","row align-items-center m-3")
                                .append($("<label>", {text:name_layer+": "+name_variable})
                                  .attr('for',"filter"+id)
                                  .attr('class',"h5")
                                  )
                                .append($('<div>')
                                  .attr("class","col-sm-10 p-0")
                                  .attr("id","filter"+id)
                                  )
                                .append($('<div>')
                                  .attr("class","col-sm-1 p-0")
                                  .append($('<button>')
                                    .attr("type","button")
                                    .attr("class","close center-block")
                                    .attr("id","buttonFilter"+id)
                                    .attr("aria-label",'Close')                             
                                    .append('<img class="icon" src="assets/svg/si-glyph-trash.svg"/>')
                                    )
                                  )
                                );
    document.getElementById("buttonFilter"+id).addEventListener("click", function(){removeFilter(name_variable)});    
    addD3NumFilter(name_layer, name_variable,values);

}


function addNumFilter(name_layer, name_variable){
  
    var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '');    // get range and How slae min/2 
    
    $('#filterDiv').append($('<div>')
                                .attr("class","row align-items-center m-3")
                                .append($("<label>", {text:name_layer+": "+name_variable})
                                  .attr('for',"filter"+id)
                                  .attr('class',"h5")
                                  )
                                .append($('<div>')
                                  .attr("class","col-sm-10 p-0")
                                  .attr("id","filter"+id)
                                  )
                                .append($('<div>')
                                  .attr("class","col-sm-1 p-0")
                                  .append($('<button>')
                                    .attr("type","button")
                                    .attr("class","close center-block")
                                    .attr("id","buttonFilter"+id)
                                    .attr("aria-label",'Close')                             
                                    .append('<img class="icon" src="assets/svg/si-glyph-trash.svg"/>')
                                    )
                                  )
                                );
    document.getElementById("buttonFilter"+id).addEventListener("click", function(){removeFilter(name_variable)});    
    addD3NumFilter(name_layer, name_variable,setupMaxAndMin(name_variable,name_layer));

}

function addD3NumFilter(name_layer, name_variable,values){

  var color = "steelblue";
    // get range and How slae min/2 
  if(name_layer === 'node'){
   var data_histo = data.nodes.features.map(function(item){return item.properties[name_variable]});
  }
  else if(name_layer === "link"){
   var  data_histo = data.links.map(function(item){return item[name_variable]});
  }
 // data = d3.range(1000).map(d3.randomBates(10));
var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')
var formatCount = d3.format(",.0f");

var svg = d3.select("#filter"+id).append('svg'),
    margin = {top: 10, right: 15, bottom: 5, left: 15},
    width = $("#filter"+id).width() - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom - 5;
    svg.attr('width',$("#filter"+id).width() ).attr('height',130).attr('onchange',"alert()");
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.scaleLinear().domain([Math.min(...data_histo),Math.max(...data_histo) + 0.0001])
    .rangeRound([0, width]);

var bins = d3.histogram()
    .domain(x.domain())
    .thresholds(40)
    (data_histo);
var y = d3.scaleLinear()
    .domain([0, d3.max(bins, function(d) { return d.length; })])
    .range([height, 0]);

let xBand = d3.scaleBand().domain(d3.range(-1, bins.length)).range([0, width])

let xAxis2 = d3.axisBottom(x)
let yAxis2 = d3.axisLeft(y)

var bar = g.selectAll(".bar")
  .data(bins)
  .enter().append("g")
    .attr("class", "bar")
    .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + Math.round(y(d.length)) + ")"; });

bar.append("rect")
    .attr("x", 1)
    .attr("width",  function(d) { return x(d.x1) - x(d.x0) - 1; })
    .attr("height", function(d) { return height - y(d.length); });

// bar.append("text")
//     .attr("dy", ".75em")
//     .attr("y", 6)
//     .attr("x", (x(bins[0].x1) - x(bins[0].x0)) / 2)
//     .attr("text-anchor", "middle")
//     .text(function(d) { return formatCount(d.length); });

g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform","rotate(45)");

var brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on('end', brushed)


var brsuh_to_setup = g.append('g')
      .attr('class', 'brush')
      .call(brush)
      .call(brush.move, x.range())

brsuh_to_setup.call(brush.move, [x(values[0]), x(values[1])]);


  function brushed() {
  var s = d3.event.selection || x.range()
  // console.log(s.map(x.invert, x));
  changeNumgFilterArray(name_layer, name_variable, "evaluateRange", s.map(x.invert, x))

}
}


function evaluateRange(data_value, range_filter){

  return Number(data_value) >= Number(range_filter[0]) && Number(data_value) <= range_filter[1];
}

function evaluateSingleCat(data_value, cat_value){
  return cat_value.includes(data_value);
}
window.evaluateSingleCat = evaluateSingleCat
window.evaluateRange = evaluateRange
// toFilterLink = function(link){
//   //var bool = true
//   if(global_data.filter.length === 0 ) return true;
//   for(i = 0; i < global_data.filter.length; i++){
//     if(global_data.filter[i].layer === 'link'){
//       //var varL = global_data.filter[i].variable
//       if  (!window[global_data.filter[i].filter](link[global_data.filter[i].variable],global_data.filter[i].values)){
//         return false;
//       }
//     } 
//   };
//   return true;
// }

function toFilterNode(node){

  if(global_data.filter.length === 0 ) return true;
  for(var i = 0; i < global_data.filter.length; i++){
    if(global_data.filter[i].layer === 'node'){
      //var varL = global_data.filter[i].variable
      if  (!window[global_data.filter[i].filter](node.properties[global_data.filter[i].variable],global_data.filter[i].values)){
        // console.log(window[global_data.filter[i].filter](node.properties[global_data.filter[i].variable],global_data.filter[i].values))
        return false;
      }
    } 
  };
  return true;
}

function toFilterLink(link){
  //var bool = true
  if(global_data.filter.length === 0 ) return true;
  for(var i = 0; i < global_data.filter.length; i++){
    if(global_data.filter[i].layer === 'link'){
      //var varL = global_data.filter[i].variable
      if  (!window[global_data.filter[i].filter](link[global_data.filter[i].variable],global_data.filter[i].values)){
        return false;
      }
    } 
  };
  return true;
}


export function applyLinkDataFilter(links,filter_nodes,full_nodes){

  var filtered_id = Object.keys(filter_nodes);

  var filteredlinkData = [];

  var len = links.length;
  for(var p = 0; p<len; p++){
    
    if(filtered_id.includes(links[p][global_data.ids.linkID[0]]) || filtered_id.includes(links[p][global_data.ids.linkID[1]]) ){
      if(toFilterLink(links[p])){
        filteredlinkData.push(links[p])
      }
    }
  }
  return filteredlinkData;
}

export function applyNodeDataFilter(data){
  var filteredNodeData = {};
  var keys =Object.keys(data)
  var len = keys.length;
  for(var p = 0; p<len; p++){
    if(toFilterNode(data[keys[p]])){
    filteredNodeData[keys[p]] = data[keys[p]];
    }
  }

  
  return filteredNodeData;
}



function refreshFilterFeaturesLayers(){

  var layerNames = getNameLayers(global_data.layers.features);
  var LEN = layerNames.length;
  for(var m=0; m<LEN;m++){
    
    var Zindex = global_data.layers.features[layerNames[m]].getZIndex()
    if(layerNames[m] === "link"){
      map.removeLayer(global_data.layers.features[layerNames[m]]);
      global_data.layers.features[layerNames[m]]= addLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1])

      global_data.layers.features[layerNames[m]].setZIndex(Zindex)
    }else if (layerNames[m] === "node"){
      map.removeLayer(global_data.layers.features[layerNames[m]]);
     global_data.layers.features[layerNames[m]]= addNodeLayer(map, data.links, data.hashedStructureData, global_data.style)

      global_data.layers.features[layerNames[m]].setZIndex(Zindex)
    }
  }

      
}





function changeCatFilterArray(name_layer, name_variable, filter, id){

    var value = Array.from($(id).find(':selected')).map(function(item){
    return $(item).text();
});

  var i = -1;
  if(global_data.filter.length !== 0){
  for(var p=0; p<global_data.filter.length; p++){
    if( global_data.filter[p].variable === name_variable && global_data.filter[p].layer === name_layer && global_data.filter[p].filter === filter){
      i = p;
      global_data.filter[p].values = value;
      break;
    }
  }
}
  if(i === -1){
  global_data.filter.push({
    layer: name_layer, 
    variable: name_variable,
    values:value,
    filter:filter
    })
  }  

  refreshFilterFeaturesLayers()
}

function changeNumgFilterArray(name_layer, name_variable, filter, value){
  



//console.log(value);
  var i = -1;
  if(global_data.filter.length !== 0){
  for(var p=0; p<global_data.filter.length; p++){
    if( global_data.filter[p].variable === name_variable && global_data.filter[p].layer === name_layer && global_data.filter[p].filter === filter){
      i = p;
      global_data.filter[p].values = value;
      break;
    }
  }
}
  if(i === -1){
  global_data.filter.push({
    layer: name_layer, 
    variable: name_variable,
    values:value,
    filter:filter
    })
  }  

  refreshFilterFeaturesLayers()
}



// D3 example
// ****************************************
// Brush functions
// ****************************************

// function brushmove() {
//     y.domain(x.range()).range(x.domain());
//     b = brush.extent();

//     var localBrushYearStart = (brush.empty()) ? brushYearStart : Math.ceil(y(b[0])),
//         localBrushYearEnd = (brush.empty()) ? brushYearEnd : Math.ceil(y(b[1]));

//     // Snap to rect edge
//     d3.select("g.brush").call((brush.empty()) ? brush.clear() : brush.extent([y.invert(localBrushYearStart), y.invert(localBrushYearEnd)]));

//     // Fade all years in the histogram not within the brush
//     d3.selectAll("rect.bar").style("opacity", function(d, i) {
//       return d.x >= localBrushYearStart && d.x < localBrushYearEnd || brush.empty() ? "1" : ".4";
//     });
// }

// function brushend() {

//   var localBrushYearStart = (brush.empty()) ? brushYearStart : Math.ceil(y(b[0])),
//       localBrushYearEnd = (brush.empty()) ? brushYearEnd : Math.floor(y(b[1]));

//     d3.selectAll("rect.bar").style("opacity", function(d, i) {
//       return d.x >= localBrushYearStart && d.x <= localBrushYearEnd || brush.empty() ? "1" : ".4";
//     });

//   // Additional calculations happen here...
//   // filterPoints();
//   // colorPoints();
//   // styleOpacity();

//   // Update start and end years in upper right-hand corner of the map
//   d3.select("#brushYears").text(localBrushYearStart == localBrushYearEnd ? localBrushYearStart : localBrushYearStart + " - " + localBrushYearEnd);

// }

// function resetBrush() {
//   brush
//     .clear()
//     .event(d3.select(".brush"));
// }