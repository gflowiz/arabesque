import {getNameVariables, refreshZindex} from "./control.js"
import {setupMaxAndMin} from "./semiology.js"
import {getNameLayers} from "./projection.js"

import {computeReduceMinStatNode} from "./stat.js";
import {addNodeLayer, generateLinkLayer} from "./layer.js";

import 'bootstrap-select'

// export function addSelectFilterLink(dataset){


//   var nameData = document.getElementById('valueTofilter').value;
//   var type = typeof dataset[0][nameData];

//   if(type === "categorial"){
//     addNodeStringFilters()
//   }
//   else if(type === "numeral"){
//     addNodeNumberFilters()
//   }
//   else {
//     refreshFilterModal();
//   }
// }

// export function addSelectFilterNode(dataset){


//   var nameData = document.getElementById('valueTofilter').value;
//   var type = typeof dataset.features[0].properties[nameData];
  
//   if(type === "categorial"){
//     addNodeStringFilters()
//   }
//   else if(type === "numeral"){
//     addNodeNumberFilters()
//   }
//   else {
//     refreshFilterModal();
//   }

// }



function addNodeStringFilters(){
    if(document.getElementById('selectedTimeFilter') !== null){
    $('#selectedTimeFilter').parent().remove();
  }
  var text = '"- Categorial => qualitative selector <br /> -Remove => qualitative removal <br /> - One Category => quick selector of one category <br />  - Numeral => quantitative selector <br /> Temporal => Select time area (must precise a time format)"'
  $('#filterLayerBody>div').append($('<div>')
                                .attr("class","col-md-4")
                                .append('<label for="selectedFilter">Type <a role="button" class="badge badge-pill badge-secondary"  tabindex="0" data-trigger="focus" data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content='+text+' title="Select the type of filter:"><img class="small-icon" src="assets/svg/si-glyph-info.svg"/></append></label>')
                                .append($('<select>')
                                  .attr('class','custom-select')
                                  .attr("id","selectedFilter")
                                  .append($("<option selected>"))
                                  .append($("<option>" , {text:"Numeral", value:'numeral'}))
                                  .append($("<option>" , {text:"Categories", value:'categorial'}))
                                  .append($("<option>" , {text:"Remove", value:'remove'}))
                                  .append($("<option>" , {text:"One Category", value:'temporal'}))
                                  // .append($("<option>" , {text:"Temporal", value:'timeLapse'}))
                                  )

                                );
    document.getElementById('selectedFilter').addEventListener("change", function(){addTimeSelector()
  }); 
      $('[data-toggle="popover"]').popover({
  trigger: 'focus'
})
  
}

function addLinkFilters(){
  if(document.getElementById('selectedTimeFilter') !== null){
    $('#selectedTimeFilter').parent().remove();
  }
  var text = '"- Categorial => qualitative selector  <br />- Remove => qualitative removal <br /> - One Category => quick selector of one category <br />  - Numeral => quantitative selector <br /> Temporal => Select time area (must precise a time format)"'
  $('#filterLayerBody>div').append($('<div>')
                                .attr("class","col-md-4")
                                .append('<label for="selectedFilter">Type <button  class="badge badge-pill badge-secondary"  data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content='+text+' title="Select the type of filter:"><img class="small-icon" src="assets/svg/si-glyph-info.svg"/></button></label>')
                                .append($('<select>')
                                  .attr('class','custom-select')
                                  .attr("id","selectedFilter")
                                  .append($("<option selected>"))
                                  .append($("<option>" , {text:"Categorial", value:'categorial'}))
                                  .append($("<option>" , {text:"Numeral", value:'numeral'}))
                                  .append($("<option>" , {text:"Remove", value:'remove'}))
                                  .append($("<option>" , {text:"One Category", value:'temporal'}))
                                  .append($("<option>" , {text:"Temporal", value:'timeLapse'}))
                                  )

                                );
  document.getElementById('selectedFilter').addEventListener("change", function(){addTimeSelector()
  }); 
    $('[data-toggle="popover"]').popover()
  
}

function addTimeSelector(){

  if (document.getElementById('selectedFilter').value === "timeLapse"){
    $('#filterLayerBody>div').append($('<div>')
                                .attr("class","col-md-4")
                                .append('<label for="selectedTimeFilter">Type Time</label>')
                                .append($('<select>')
                                  .attr('class','custom-select')
                                  .attr("id","selectedTimeFilter")
                                  .append($("<option>", {text:"Date", value:'DateTime'}))
                                  .append($("<option>" , {text:"Hours", value:'HoursTime'}))
                                  .append($("<option>" , {text:"TimeStamp", value:'TimeStamp'}))
                                  )
                                );
  }
  else{
    $('#selectedTimeFilter').parent().remove();
  }
}

function addFilter(name, dataset){
  if(document.getElementById('selectedFilter') !== null){
    $('#selectedFilter').parent().remove();
  }

  if(name==='node'){
    addNodeStringFilters();
  }
  else if (name ==='link'){
    addLinkFilters();
  }
}

export function refreshFilterModal(){
  $('#filterLayerBody>div').remove()
}

export function addFilterToScreen(){

  var name_layer = document.getElementById('filteredLayer').value;
  var name_variable = document.getElementById('valueTofilter').value;
  var name_filter = document.getElementById('selectedFilter').value;

  if (name_layer ==='link'){
    // console.log('button')
    prepareBinFilterData(name_layer, name_variable, name_filter, data)
    console.log(name_filter)
  }


  if(name_filter === 'numeral'){
    addNumFilter(name_layer, name_variable);
    console.log("fffffffffffffff")
    refreshFilterModal();
    return;  
  }
  if(name_filter === 'categorial'){
    addSingleCatFilter(name_layer, name_variable);
    refreshFilterModal();
    return;  
  }
  if(name_filter === 'remove'){
    addRemoveFilter(name_layer, name_variable);
    // prepareBinCatDataFilter(name_layer, name_variable, data.filter[name_layer], data)
    refreshFilterModal();
    return;  
  }
  if(name_filter === 'temporal'){
    addTemporalFilter(name_layer, name_variable);
    var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')
    changeTemporalFilterArray(name_layer,name_variable,'temporal' ,'temporalfilter'+id);
    // console.log('button')
    // prepareBinCatDataFilter(name_layer, name_variable, data.filter[name_layer], data)
    refreshFilterModal();
    return;  
  }
  if(name_filter === 'timeLapse'){
    addTimeLapseFilter(name_layer, name_variable);
    // console.log('button')
    // prepareBinCatDataFilter(name_layer, name_variable, data.filter[name_layer], data)
    refreshFilterModal();
    return;  
  }
}

function addTimeLapseFilter(name_layer, name_variable){
  var timeFormat = document.getElementById('selectedTimeFilter').value 
  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '');    // get range and How slae min/2 
    
    $('#filterDiv').append($('<div>')
                                .attr("class","row align-items-center m-3")
                                
                                .append($('<div>')
                                  .attr("class","col-sm-10 p-0")
                                  .attr("id","filterTime"+id)
                                  .append($("<label>", {text:name_layer+": "+name_variable})
                                    .attr('for',"filterTime"+id)
                                    .attr('class',"h5")
                                  )
                                  )
                                .append($('<div>')
                                  .attr("class","col-sm-1 p-0")
                                  .append($('<button>')
                                    .attr("type","button")
                                    .attr("class","close center-block")
                                    .attr("id","buttonTimeFilter"+id)
                                    .attr("aria-label",'Close')                             
                                    .append('<img class="icon" src="assets/svg/si-glyph-trash.svg"/>')
                                    )
                                  )
                                );
    document.getElementById("buttonTimeFilter"+id).addEventListener("click", function(){timeRemoveCatFilter(name_variable, name_layer)});    
    addD3TimeFilter(name_layer, name_variable,[25,50]);

}

function addD3TimeFilter(name_layer, name_variable,values){

  var color = "steelblue";

 // var format = data.filter.link[name_variable].timeLapse.format
 var index_data = data.filter.link[name_variable].timeLapse.order
 var sum_data = index_data.map(function(item){return data.filter.link[name_variable].timeLapse.index[item].length})
 var bins = [] 
 for(var i = 0; i<index_data.length; i++){
  bins.push({date:index_data[i], value:sum_data[i]})
 }

 // console.log(bins)
 // data = {y:sum_data,
 //        x:index_data}
 // data = d3.range(1000).map(d3.randomBates(10));
 var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')
// var formatCount = d3.format(",.0f");

var svg = d3.select("#filterTime"+id).append('svg'),
    margin = {top: 10, right: 15, bottom: 5, left: 15},
    width = parseInt($("#filterTime"+id).width() - margin.left - margin.right),
    height = parseInt(100 - margin.top - margin.bottom );
    svg.attr('width',parseInt($("#filterTime"+id).width()) ).attr('height',150);
    // svg.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
bins = bins.map((d) => { d.value = +d.value;
   return d;  
        });
var x = d3.scaleBand().domain(bins.map(function(d) { return d.date; })).rangeRound([0, width]).padding(0.1);
var y = d3.scaleLinear().rangeRound([height, 0]);
// console.log(x)
var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  y=       y.domain([0, d3.max(bins, function(d) { return d.value; })]);
// console.log(width)
// console.log(d3.max(bins, function(d) { return d.value; }))
// // console.log(x(bins[1].date))
 g.append("g")
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))          
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");


        // g.append("g")
        //     .attr("class", "axis axis--y")
        //     .call(d3.axisLeft(y).tickSize(0))
          

        g.selectAll(".bar")
          .data(bins)
          .enter().append("rect")
            .attr("fill","grey")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.date); })
            .attr("y", function(d) { return y(d.value); })
            .attr("width", x.bandwidth() )
            .attr("height", function(d) { return height - y(d.value); });
    
var brush = d3.brushX()
    .extent([[0, 0], [width, height]])
    .on('end', brushed)


var brsuh_to_setup = g.append('g')
      .attr('class', 'brush')
      .call(brush)
      // .call(brush.move, x.domain())

  
console.log(values)
try {

  d3.select("#filterTime"+id).select(".brush").call(brush.move, [x(values[0]), x(values[1]) + x.bandwidth()]);
}
catch(error) {
  console.error(error);
  // expected output: ReferenceError: nonExistentFunction is not defined
  // Note - error messages will vary depending on browser
}
  function brushed() {
    if (d3.event.sourceEvent.type === 'end' || typeof d3.event.sourceEvent === null) return;
    console.log(d3.event.sourceEvent)
  var k = d3.event.selection || x.range()
    // d3.select(".brush").call(brush.move, x.range().map(s.invert, s));
    // var min = Infinity;
    // var max = 0;
    var j = bins.filter(function(d) {
        var x0 = x(d.date), //  start of the corresponding band 
            x1 = x0 +  x.bandwidth(); // end of the corresponding band 

        // check if the start of the brush is before the band 
        // and if the end of the brush is after the end of the band
        // if(k[0] <= x0 && k[1] >= x1){
        //   min = Math.min(x0, min)
        //   max = Math.max(x1, max)
        // }
        return (k[0]- x.bandwidth()/2) <= x0  && (k[1]+ x.bandwidth()/2) >= x1  ;
    });
    // brsuh_to_setup.call(brush.move, [min, max]);
    if(j.length !== 0){
    d3.select("#filterTime"+id).select(".brush").call(brush.move, [x(j[0].date), x(j[j.length - 1].date) + x.bandwidth()]);
    console.log(j);
  }
    changeTimeFilterArray(name_layer, name_variable, "timeLapse", j.map(function(d) {return d.date}))

}

}

export function binDataRemoveValue(name_layer, name_var, data){
  if(typeof data.filter[name_layer][name_var] === 'undefined'){
    data.filter[name_layer][name_var] = {remove:{}}
  }
  else{
    data.filter[name_layer][name_var].remove = {}
  }
  var list_value = []
  var data_to_bin = data.filter[name_layer][name_var].remove;
  var len = data.links.length;
  for(var i = 0; i<len; i++)
  {
    var value = data.links[i][name_var].toString()
    if(!list_value.includes(value)){
      list_value.push(value)
      data_to_bin[value] = []
      data_to_bin[value].push(i)
    }
    else{
      data_to_bin[value].push(i)
    }
  }
}

export function binTemporalRemoveValue(name_layer, name_var, data){  

  if(typeof data.filter[name_layer][name_var] === 'undefined'){
    data.filter[name_layer][name_var] = {temporal:{}}
  }
  else{
    data.filter[name_layer][name_var].temporal = {}
  }

  var len = data.links.length;

  var list_value = []
  data.filter[name_layer][name_var].temporal.data = {};
  var data_to_bin = data.filter[name_layer][name_var].temporal.data

  for(var i = 0; i<len; i++)
  {
    var value = data.links[i][name_var].toString()
    if(!list_value.includes(value)){
      list_value.push(value)
      data_to_bin[value] = []
      data_to_bin[value].push(i)
    }
    else{
      data_to_bin[value].push(i)
    }
  }
  data.filter[name_layer][name_var].temporal.index = Object.keys(data_to_bin)
}

export function binTimeLapseRemoveValue(name_layer, name_var, data, format){
 
  var timeFormat = format;
  if(typeof data.filter[name_layer][name_var] === 'undefined'){
    data.filter[name_layer][name_var] = {timeLapse:{}}
  }
  else{
    data.filter[name_layer][name_var].timeLapse = {}
  }
  var arrayTime = [... new Set(data.links.map(function(item){return item[name_var]}))]
  data.filter[name_layer][name_var].timeLapse.order = getOrderedDate(arrayTime, timeFormat)
  // console.log(getOrderedDate(arrayTime, timeFormat))
  data.filter[name_layer][name_var].timeLapse.index = {}
  data.filter[name_layer][name_var].timeLapse.format = timeFormat
  var list_value = []
  var data_to_bin = data.filter[name_layer][name_var].timeLapse.index
  var len = data.links.length;
  for(var i = 0; i<len; i++)
  {
    var value = data.links[i][name_var].toString()
    if(!list_value.includes(value)){
      list_value.push(value)
      data_to_bin[value] = []
      data_to_bin[value].push(i)
    }
    else{
      data_to_bin[value].push(i)
    }
  }
  // data.filter[name_layer][name_var].timeLapse.index = Object.keys(data_to_bin)
}

function getOrderedDate(dates, format){

  if(format === 'HoursTime'){
    return dates.sort(function (a, b) {  return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b)});
  }
  if(format === 'TimeStamp'){ 
    return dates.sort(function(a, b){return Number(a) - Number(b)});
  }
  if(format === 'DateTime'){
    return  dates.sort(function (a, b) {  return new Date(a.toString()) - new Date(b.toString())});
  }
}

function parseTime(date, format){
  // console.log(dates)
  // console.log(format)
  if(format === 'HoursTime'){
    return  new Date('1970/01/01 ' + date);
  }
  if(format === 'TimeStamp'){ 
    return new Date(Number(date));
  }
  if(format === 'DateTime'){
    return new Date(date.toString());
  }
}

export function binDataCatValue(name_layer, name_var, data){
  if(typeof data.filter[name_layer][name_var] === 'undefined'){
    data.filter[name_layer][name_var] = {categorial:{}}
  }
  else{
    data.filter[name_layer][name_var].categorial = {}
  }
  var list_value = []
  var data_to_bin = data.filter[name_layer][name_var].categorial;
  var len = data.links.length;
  for(var i = 0; i<len; i++)
  {
    var value = data.links[i][name_var].toString()
    if(!list_value.includes(value)){
      list_value.push(value)
      data_to_bin[value] = []
      data_to_bin[value].push(i)
    }
    else{
      data_to_bin[value].push(i)
    }
  }
}

export function binDataNumValue(name_layer, name_var, data){
  if(typeof data.filter[name_layer][name_var] === 'undefined'){
    data.filter[name_layer][name_var] = {numeral:{
                                      index: [],
                                      minima: []
                                      }
                                    }
  }
  else{
    data.filter[name_layer][name_var].numeral = {
                                      index: [],
                                      minima: []
                                      }
  }

  for(var p = 0; p < 150; p++){
    data.filter[name_layer][name_var].numeral.index.push([])
  }
  var ArrayToBin = data.links.map(function(item){return Number(item[name_var])})
  
  var bin_scale = (Math.max(...ArrayToBin) - Math.min(...ArrayToBin)) / 150
  var min = Math.min(...ArrayToBin)
  
  data.filter[name_layer][name_var].numeral.minima = [min, Math.max(...ArrayToBin)]
  var data_to_bin = data.filter[name_layer][name_var].numeral;
  var len = data.links.length

  for(var i = 0; i<len; i++)
  {
    var value = Number(data.links[i][name_var])

    for(var p = 0; p < 150; p++){
      
      if (value <= (min + (p+1) * bin_scale) && value >= (min + p * bin_scale)){
        data_to_bin.index[p].push(i)
        break
      }
    }
  }
}


export function loadBinFilterData(name_layer, name_variable, filter, data){
  if(filter.filter === 'numeral'){
    binDataNumValue(name_layer,name_variable, data)
  }
  if(filter.filter === 'categorial'){
    binDataCatValue(name_layer,name_variable, data)
  }
  if(filter.filter === 'remove'){
    binDataRemoveValue(name_layer,name_variable, data)
  }
   if(filter.filter === 'temporal'){
    binTemporalRemoveValue(name_layer,name_variable, data)
  }
   if(filter.filter === 'timeLapse'){
    binTimeLapseRemoveValue(name_layer,name_variable, data, filter.format)
  }
}

export function prepareBinFilterData(name_layer, name_variable, filter, data){
  if(filter === 'numeral'){
    binDataNumValue(name_layer,name_variable, data)
  }
  if(filter === 'categorial'){
    binDataCatValue(name_layer,name_variable, data)
  }
  if(filter === 'remove'){
    binDataRemoveValue(name_layer,name_variable, data)
  }
   if(filter === 'temporal'){
    binTemporalRemoveValue(name_layer,name_variable, data)
  }
   if(filter === 'timeLapse'){
    binTimeLapseRemoveValue(name_layer,name_variable, data, document.getElementById('selectedTimeFilter').value)
  }
}

function removeFilter(var_to_remove, name_layer){
  var id = var_to_remove.split(' ').join('').replace(/[^\w\s]/gi, ''); 
  $("#filter"+id).parent().parent().remove();
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if(global_data.filter[name_layer][p].variable === var_to_remove){
      global_data.filter[name_layer].splice(p, 1);
        refreshFilterFeaturesLayers();
        return;
    }
  }

}

function removeNumFilter(var_to_remove, name_layer){
  var id = var_to_remove.split(' ').join('').replace(/[^\w\s]/gi, ''); 
  $("#filterNum"+id).parent().remove();
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if(global_data.filter[name_layer][p].variable === var_to_remove){
      global_data.filter[name_layer].splice(p, 1);
        refreshFilterFeaturesLayers();
        return;
    }
  }

}

// prepareBinCatDataFilter(name_layer, name_variable, data)

function removeCatFilter(var_to_remove, name_layer){
  var id = var_to_remove.split(' ').join('').replace(/[^\w\s]/gi, ''); 
  $("#filter"+id).parent().parent().parent().remove();
  console.log($("#filter"+id).parent())
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if(global_data.filter[name_layer][p].variable === var_to_remove){
      global_data.filter[name_layer].splice(p, 1);
        refreshFilterFeaturesLayers();
        return;
    }
  }

}


function removeRemoveCatFilter(var_to_remove, name_layer){
  var id = var_to_remove.split(' ').join('').replace(/[^\w\s]/gi, ''); 
  $("#removefilter"+id).parent().parent().parent().remove();
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if(global_data.filter[name_layer][p].variable === var_to_remove){
      global_data.filter[name_layer].splice(p, 1);
        refreshFilterFeaturesLayers();
        return;
    }
  }

}
function timeRemoveCatFilter(var_to_remove, name_layer){
  var id = var_to_remove.split(' ').join('').replace(/[^\w\s]/gi, ''); 
  $("#filterTime"+id).parent().remove();
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if(global_data.filter[name_layer][p].variable === var_to_remove){
      global_data.filter[name_layer].splice(p, 1);
        refreshFilterFeaturesLayers();
        return;
    }
  }

}


function temporalRemoveCatFilter(var_to_remove, name_layer){
  var id = var_to_remove.split(' ').join('').replace(/[^\w\s]/gi, ''); 
  $("#temporalfilter"+id).parent().parent().parent().remove();
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if(global_data.filter[name_layer][p].variable === var_to_remove){
      global_data.filter[name_layer].splice(p, 1);
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
                                  .attr('for',"filterCat")
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
  document.getElementById("removeCatFilterButton"+id).addEventListener("click", function(){removeCatFilter(name_variable, name_layer)});  

  document.getElementById("filter"+id).addEventListener("change", function(){
    changeCatFilterArray(name_layer,name_variable,'categorial' ,'#filter'+id);

  });
    if(name_layer==='node'){

      var keysToShow = [... new Set(Object.keys(data.hashedStructureData).map(function(item){return data.hashedStructureData[item].properties[name_variable]}))]
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

function addTemporalFilter(name_layer,name_variable){
  if(name_layer === 'link'){
  var len = data.filter[name_layer][name_variable].temporal.index.length
  }
  else{
    var len = [... new Set(Object.keys(data.hashedStructureData).map(function(item){return data.hashedStructureData[item].properties[name_variable]}))].length
  }
  // var len = 50;
  // console.log(len)
  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')
  $('#filterDiv').append($('<div>')
                          .attr("class","row align-items-center m-3")
                          .append($("<label>", {text:name_layer+": "+name_variable})
                                  .attr('class',"h5")
                                  )
                          .append($('<div>')
                            .attr("class","col-md-11 align-items-center p-0")
                            .attr("id","temporalfilterCat")
                          .append($('<div>')
                            .attr("class","col-md-12")
                          .append($('<input>')
                            .attr('class',"selectpicker")
                            .attr('min','0')
                            .attr('max',len -1 )
                            .attr('step',1)
                            .attr("id","temporalfilter"+id)
                            .attr("type","range")                          
                              )
                            // .append('<option disabled selected>Choose your variables</option>')
                              )
                          .append($("<label>", {text:"PUT VALUE HERE"})
                            .attr('class',"h6")
                            .attr('id',"h6_remove"+id)
                            )
                          ).append($('<div>')
                                  .attr("class","col-sm-1 center-block p-0")
                                  .append($('<button>')
                                    .attr("type","button")
                                    .attr("id", "temporalCatFilterButton"+id)
                                    .attr("class","close center-block")
                                    .attr("aria-label",'Close')                               
                                    .append('<img class="icon" src="assets/svg/si-glyph-trash.svg"/>')
                                    
                                  )
                                )
                            );
  showTemporalValue(name_variable,"h6_remove"+id,"temporalfilter"+id ,name_layer)


  document.getElementById("temporalCatFilterButton"+id).addEventListener("click", function(){temporalRemoveCatFilter(name_variable, name_layer)});  

  document.getElementById("temporalfilter"+id).addEventListener("change", function(){
    changeTemporalFilterArray(name_layer,name_variable,'temporal' ,'temporalfilter'+id);

  });
    document.getElementById("temporalfilter"+id).addEventListener("change", function(){
    showTemporalValue(name_variable,"h6_remove"+id,"temporalfilter"+id ,name_layer);

  });

  return;
}

function showTemporalValue(name_variable, id, value_id, name_layer){
// console.log(name_layer)
  if(name_layer === 'link'){
  document.getElementById(id).innerHTML = data.filter[name_layer][name_variable].temporal.index[Number(document.getElementById(value_id).value)]
  }
  else{
    document.getElementById(id).innerHTML = [... new Set(Object.keys(data.hashedStructureData).map(function(item){return data.hashedStructureData[item].properties[name_variable]}))][Number(document.getElementById(value_id).value)]
  }
}

function addRemoveFilter(name_layer,name_variable){

  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')
  $('#filterDiv').append($('<div>')
                          .attr("class","row align-items-center m-3")
                          .append($("<label>", {text:name_layer+": "+name_variable})
                                  .attr('for',"filter"+id)
                                  .attr('class',"h5")
                                  )
                          .append($('<div>')
                            .attr("class","col-sm-10 align-items-center p-0")
                            .attr("id","removefilterCat")

                          .append($('<select multiple>')
                            .attr('class',"selectpicker")
                            // .attr('data-toggle','dropdown')
                            // .attr('searchable',"Search here..")
                            .attr("id","removefilter"+id)
                            // .attr("onchange","changeCatFilterArray('"+name_layer+"','"+name_variable+"','evaluateSingleCat' ,'#filter"+id+"')")
                            // .append('<option disabled selected>Choose your variables</option>')
                              )
                          ).append($('<div>')
                                  .attr("class","col-sm-1 center-block p-0")
                                  .append($('<button>')
                                    .attr("type","button")
                                    .attr("id", "removeRemoveCatFilterButton"+id)
                                    .attr("class","close center-block")
                                    .attr("aria-label",'Close')                               
                                    .append('<img class="icon" src="assets/svg/si-glyph-trash.svg"/>')
                                    
                                  )
                                )
                          );
  document.getElementById("removeRemoveCatFilterButton"+id).addEventListener("click", function(){removeRemoveCatFilter(name_variable, name_layer)});  

  document.getElementById("removefilter"+id).addEventListener("change", function(){
    changeCatFilterArray(name_layer,name_variable,'remove' ,'#removefilter'+id);

  });
  if(name_layer==='node'){
    var keysToShow = [... new Set(Object.keys(data.hashedStructureData).map(function(item){return data.hashedStructureData[item].properties[name_variable]}))]
  }
  else if (name_layer ==='link'){
    var keysToShow = [... new Set(data.links.map(function(item){return item[name_variable]}))]
  }
  for(var p=0; p<keysToShow.length; p++){
    $('#removefilter'+id).append($('<option>', {text:String(keysToShow[p]) })
                        .attr("value",keysToShow[p])
                        );
                      
      }
  $("#removefilter"+id).selectpicker();
  return;
}



export function loadSingleCatFilter(name_layer,name_variable,values){

  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')


  addSingleCatFilter(name_layer,name_variable)
  $("#filter"+id).selectpicker("val", values);
return;
}

export function loadRemoveFilter(name_layer,name_variable,values){

  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')


  addRemoveFilter(name_layer,name_variable)
  $("#removefilter"+id).selectpicker("val", values);
return;
}

export function loadTemporalFilter(name_layer,name_variable,values){

  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')

  addTemporalFilter(name_layer,name_variable)
  console.log(data.filter[name_layer][name_variable].temporal.index.indexOf(values))
  $("#temporalfilter"+id).prop('value', data.filter[name_layer][name_variable].temporal.index.indexOf(values));
  showTemporalValue(name_variable,"h6_remove"+id,"temporalfilter"+id ,name_layer);
  changeTemporalFilterArray(name_layer,name_variable,'temporal' ,'temporalfilter'+id);
return;
}
export function loadTimeLapseFilter(name_layer,name_variable,values){

  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')


  
  var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '');    // get range and How slae min/2 
    
    $('#filterDiv').append($('<div>')
                                .attr("class","row align-items-center m-3")
                                
                                .append($('<div>')
                                  .attr("class","col-sm-10 p-0")
                                  .attr("id","filterTime"+id)
                                  .append($("<label>", {text:name_layer+": "+name_variable})
                                    .attr('for',"filterTime"+id)
                                    .attr('class',"h5")
                                  )
                                  )
                                .append($('<div>')
                                  .attr("class","col-sm-1 p-0")
                                  .append($('<button>')
                                    .attr("type","button")
                                    .attr("class","close center-block")
                                    .attr("id","buttonTimeFilter"+id)
                                    .attr("aria-label",'Close')                             
                                    .append('<img class="icon" src="assets/svg/si-glyph-trash.svg"/>')
                                    )
                                  )
                                );
    document.getElementById("buttonTimeFilter"+id).addEventListener("click", function(){timeRemoveCatFilter(name_variable, name_layer)});    
    addD3TimeFilter(name_layer, name_variable,[values[0],values[values.length - 1]]);

return;
}


function getRange(name_layer, name_variable){

  if(name_layer === 'node'){
    var mappedVariable = Object.keys(data.hashedStructureData).map(function(item){return data.hashedStructureData[item].properties[name_variable]})
  }
  else if(name_layer === "link"){
    var mappedVariable = data.links.map(function(item){return item[name_variable]})
  }

  return [Math.min(...mappedVariable), Math.max(...mappedVariable)]
}


export function checkDataToFilter(){
  var text  = '"Choose the layer to filter"'
  $('#filterLayerBody').append($('<div>')
                        .attr('class','row')
                        .append($("<div>")
                          .attr("class","col-md-4")
                          .append('<label for="filteredLayer">Layer <button  class="badge badge-pill badge-secondary"  data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content='+text+'><img class="small-icon" src="assets/svg/si-glyph-info.svg"/></button></label>')
                          .append($("<select>")
                            .attr("class","custom-select")
                            .attr("id","filteredLayer")
                            .append($("<option selected>" , {text:"Choose ..."}))
                            .append($("<option>" , {text:"Link", value:'link'}))
                            .append($("<option>" , {text:"Node", value:'node'}))
                            )
                          )
                        )
  $('[data-toggle="popover"]').popover()
  document.getElementById("filteredLayer").addEventListener("change", function(){addValuesToFilter()});    
}



function addValuesToFilter(){

    var  sel = document.getElementById("filteredLayer");
    var iLayer = sel.options[ sel.selectedIndex ].value;
    var text = '"Choose the variable to filter"'

    var keysToShow = getNameVariables(iLayer);

    if(document.getElementById('valueTofilter') !== null){
      $('#valueTofilter').parent().remove();
    }
    if(document.getElementById('selectedFilter') !== null){
      $('#selectedFilter').parent().remove();
    }

    if(keysToShow)
    $('#filterLayerBody>div').append($('<div>')
                                .attr("class","col-md-4")
                                .append('<label for="valueTofilter">Variable <button  class="badge badge-pill badge-secondary"  data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content='+text+'><img class="small-icon" src="assets/svg/si-glyph-info.svg"/></button></label>')
                                .append($('<select>')
                                  .attr('class','custom-select')
                                  .attr("id","valueTofilter")
                                  .append("<option selected>Choose...</option>")
                                  )
                                );

    $('[data-toggle="popover"]').popover()
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
                                  .attr('for',"filterNum"+id)
                                  .attr('class',"h5")
                                  )
                                .append($('<div>')
                                  .attr("class","col-sm-10 p-0")
                                  .attr("id","filterNum"+id)
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
    document.getElementById("buttonFilter"+id).addEventListener("click", function(){removeNumFilter(name_variable, name_layer)});    
    addD3NumFilter(name_layer, name_variable,values);

}


function addNumFilter(name_layer, name_variable){
  
    var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '');    // get range and How slae min/2 
    
    $('#filterDiv').append($('<div>')
                                .attr("class","row align-items-center m-3")
                                .append($("<label>", {text:name_layer+": "+name_variable})
                                  .attr('for',"filterNum"+id)
                                  .attr('class',"h5")
                                  )
                                .append($('<div>')
                                  .attr("class","col-sm-10 p-0")
                                  .attr("id","filterNum"+id)
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
    document.getElementById("buttonFilter"+id).addEventListener("click", function(){removeNumFilter(name_variable, name_layer)});    
    addD3NumFilter(name_layer, name_variable,setupMaxAndMin(name_variable,name_layer));

}

function addD3NumFilter(name_layer, name_variable,values){

  var color = "steelblue";
    // get range and How slae min/2 
  if(name_layer === 'node'){
   var data_histo = Object.keys(data.hashedStructureData).map(function(item){return data.hashedStructureData[item].properties[name_variable]})
  }
  else if(name_layer === "link"){
   var  data_histo = data.links.map(function(item){return item[name_variable]});
  }
 // data = d3.range(1000).map(d3.randomBates(10));
var id = name_variable.split(' ').join('').replace(/[^\w\s]/gi, '')
var formatCount = d3.format(",.0f");

var svg = d3.select("#filterNum"+id).append('svg'),
    margin = {top: 10, right: 15, bottom: 5, left: 15},
    width = $("#filterNum"+id).width() - margin.left - margin.right,
    height = 100 - margin.top - margin.bottom - 5;
    svg.attr('width',$("#filterNum"+id).width() ).attr('height',130).attr('onchange',"alert()");
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
    .attr("transform", function(d) { 
      // console.log(d)
      return "translate(" + x(d.x0) + "," + Math.round(y(d.length)) + ")"; });

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
  changeNumgFilterArray(name_layer, name_variable, "numeral", s.map(x.invert, x))

}
}




function numeral(data_value, range_filter){

  return Number(data_value) >= Number(range_filter[0]) && Number(data_value) <= range_filter[1];
}

function categorial(data_value, cat_value){
  return cat_value.includes(data_value);
}

function remove(data_value, cat_value){
  return !cat_value.includes(data_value);
}

function temporal(data_value, cat_value){
  return cat_value.includes(data_value);
}


window.temporal = temporal
window.remove = remove
window.categorial = categorial
window.numeral = numeral

// toFilterLink = function(link){
//   //var bool = true
//   if(global_data.filter.length === 0 ) return true;
//   for(var i = 0; i < global_data.filter.length; i++){
//     if(global_data.filter[i].layer === 'link'){
//       //var varL = global_data.filter[i].variable
//       if  (!window[global_data.filter[i].filter](link[global_data.filter[i].variable],global_data.filter[i].values)){
//         return false;
//       }
//     } 
//   };
//   return true;
// }

// export function getRemoveNode(){

// }

// export function getRemoveLink(){

//  return 
// }
function toRemoveFilterNode(node){

  if(global_data.filter.node.length === 0 ) return true;
  for(var i = 0; i < global_data.filter.node.length; i++){

      //var varL = global_data.filter[i].variablevale
      if (global_data.filter.node[i].filter === 'remove'){
        if  (!window[global_data.filter.node[i].filter](node.properties[global_data.filter.node[i].variable],global_data.filter.node[i].values)){
        console.log("AAYAYAYUAUYAUAU")
        return true;
        
      }
    } 
  };
  return false;
}

function toFilterNode(node){

  if(global_data.filter.node.length === 0 ) return true;
  for(var i = 0; i < global_data.filter.node.length; i++){

      //var varL = global_data.filter[i].variable
      // console.log(node.properties[global_data.filter.node[i].variable])
      if  (!window[global_data.filter.node[i].filter](node.properties[global_data.filter.node[i].variable],global_data.filter.node[i].values)){
        // console.log(window[global_data.filter[i].filter](node.properties[global_data.filter[i].variable],global_data.filter[i].values))
        return false;
      
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



export function getAllNodesToShow(links,nodes, filter_nodes){
  
  var filtered_id = Object.keys(filter_nodes);

  var selected_nodes = {};
  var testtedNodes = []
  var len = links.length;
  for(var p = 0; p<len; p++){
    
    if(filtered_id.includes(links[p][global_data.ids.linkID[0]]) || filtered_id.includes(links[p][global_data.ids.linkID[1]]) ){
      if(!testtedNodes.includes(links[p][global_data.ids.linkID[0]])){
        testtedNodes.push(links[p][global_data.ids.linkID[0]])
        selected_nodes[links[p][global_data.ids.linkID[0]]] = nodes[links[p][global_data.ids.linkID[0]]];
      }
      if(!testtedNodes.includes(links[p][global_data.ids.linkID[1]])){
        testtedNodes.push(links[p][global_data.ids.linkID[1]])
        selected_nodes[links[p][global_data.ids.linkID[1]]] = nodes[links[p][global_data.ids.linkID[1]]];
      }
    }
  }

  return selected_nodes
}


export function applyLinkDataFilter(links,filter_nodes, listToRemove){

  var filtered_id = Object.keys(filter_nodes);

  var filteredlinkData = [];
  var len = links.length;
  for(var p = 0; p<len; p++){
    
    if((filtered_id.includes(links[p][global_data.ids.linkID[0]]) || filtered_id.includes(links[p][global_data.ids.linkID[1]])) && !(listToRemove.includes(links[p][global_data.ids.linkID[0]]) || listToRemove.includes(links[p][global_data.ids.linkID[1]])) ){
      if(toFilterLink(links[p])){
        filteredlinkData.push(links[p])
      }
    }
  }
  return filteredlinkData;
}

export function testLinkDataFilter(list_filter, data){
 var index = Array.from(Array(data.links.length).keys())
  if(list_filter.length === 0){
    return Array.from(Array(data.links.length).keys())
  }
  index = new Set(index)
  var len = list_filter.length;
  for(var i = 0; i<len; i++){
    if (list_filter[i].filter !== "remove"){
      var  selected_index = new Set(getIndexFromFilter(list_filter[i], data, 'link'))
      index = new Set([...index].filter(x => selected_index.has(x)));
    }
    else{
      var  selected_index = new Set(getIndexFromFilter(list_filter[i], data, 'link'))
      index = new Set([...index].filter(x => !selected_index.has(x)));
    }
  }
  computeReduceMinStatNode(data.hashedStructureData, [...index], global_data.ids.linkID[0], global_data.ids.linkID[1], global_data.ids.vol)
  return [...index]
}

export function getIndexFromFilter(filter, data, layer){
  if(filter.filter === 'numeral'){
    return getIndexFromNumeralFilter(filter, data, layer)
  }
  else if(filter.filter === 'temporal'){
    return getTemporalIndexFromCategorialFilter(filter, data, layer)
  }
  else if(filter.filter === 'timeLapse'){
    return getTimeIndexFromCategorialFilter(filter, data, layer)
  }
  else{
    return getIndexFromCategorialFilter(filter, data, layer)
  }
  
}

function getIndexFromNumeralFilter(filter, data, layer){
  var list_index = []
console.log(data.filter[layer])
  var len = filter.values.length;
  var scale = (data.filter[layer][filter.variable][filter.filter].minima[1] - data.filter[layer][filter.variable][filter.filter].minima[0]) /150
  var min = data.filter[layer][filter.variable][filter.filter].minima[0]

  // console.log(len)
  for(var m = 0; m<150; m++){
    if(filter.values[0] <= min + scale*m && filter.values[1] >= min + scale*(m+1)){
      
        list_index =list_index.concat(data.filter[layer][filter.variable][filter.filter].index[m])
    }
    else if(filter.values[0] >= min + scale*m && filter.values[0] <= min + scale*(m+1)){
        list_index =list_index.concat(getMinValidId(data.filter[layer][filter.variable][filter.filter].index[m],data.links,filter.values[0], filter.variable))
    }
    else if(filter.values[1] >= min + scale*m && filter.values[1] <= min + scale*(m+1)){
        list_index = list_index.concat(getMaxValidId(data.filter[layer][filter.variable][filter.filter].index[m],data.links,filter.values[1], filter.variable))
     }
  }
  // console.log(list_index)
  return [...new Set([...list_index])]
}

function getMaxValidId(list_index_toFilter, links, max_value, name_var){
  var selected_index = []
  for (var p = 0; p< list_index_toFilter.length; p++){
    if(Number(links[list_index_toFilter[p]][name_var])<= max_value)
      selected_index.push(list_index_toFilter[p])
  }
  return selected_index
}

function getMinValidId(list_index_toFilter, links, min_value, name_var){
  var selected_index = []
  for (var p = 0; p< list_index_toFilter.length; p++){
    if(Number(links[list_index_toFilter[p]][name_var])>= min_value)
      selected_index.push(list_index_toFilter[p])
  }
  return selected_index
}

function getIndexFromCategorialFilter(filter, data, layer){
  var list_index = data.filter[layer][filter.variable][filter.filter][filter.values[0]]
  for(var m = 1; m<filter.values.length; m++){
  var list_index = [...new Set([...list_index, ...data.filter[layer][filter.variable][filter.filter][filter.values[m]]])];
  }
  return list_index
}

function getTimeIndexFromCategorialFilter(filter, data, layer){
  var list_index = data.filter[layer][filter.variable][filter.filter].index[filter.values[0]]
  // console.log(list_index)
  for(var m = 1; m<filter.values.length; m++){
    list_index = [...new Set([...list_index, ...data.filter[layer][filter.variable][filter.filter].index[filter.values[m]]])];
  }
  return list_index
}



function sortOnlyHoursArray(hours){ 

  return hours.sort(function (a, b) {
      return new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b);
    });
}

function getTemporalIndexFromCategorialFilter(filter, data, layer){
  // var list_index = data.filter[filter.variable][filter.filter].data[filter.values[0]]
  // console.log(list_index)
  // for(var m = 1; m<filter.values.length; m++){
  // var list_index = [...new Set([...list_index, ...data.filter[filter.variable][filter.filter].data[filter.values[m]]])];
  // }
  return  data.filter[layer][filter.variable][filter.filter].data[filter.values]
}

export function applyNodeDataFilter(data){
  var filteredNodeData = {};
  var filteredRemoveNodeData = [];
  var keys =Object.keys(data)
  var len = keys.length;
  for(var p = 0; p<len; p++){
    if(toFilterNode(data[keys[p]])){
      filteredNodeData[keys[p]] = data[keys[p]];
    }
    if(toRemoveFilterNode(data[keys[p]]) && global_data.filter.node.length>0){
      console.log('AUYAYAYAYAY')
      filteredRemoveNodeData.push(keys[p]);
    }
  }

  
  return [filteredNodeData,filteredRemoveNodeData] ;
}




function refreshFilterFeaturesLayers(){

  var layerNames = getNameLayers(global_data.layers.features);
  var LEN = layerNames.length;
  console.log(layerNames)
  if(LEN !== 0){
  var id_links = testLinkDataFilter(global_data.filter.link, data)
  var selected_nodes = applyNodeDataFilter(data.hashedStructureData)
}
  for(var m=0; m<LEN;m++){
    
    var Zindex = global_data.layers.features[layerNames[m]].getZIndex()
    if(layerNames[m] === "link"){
      console.log('bonjour')
      map.removeLayer(global_data.layers.features[layerNames[m]]);
      global_data.layers.features[layerNames[m]]= generateLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1], id_links, selected_nodes)

      global_data.layers.features[layerNames[m]].setZIndex(Zindex)
    }else if (layerNames[m] === "node"){
      map.removeLayer(global_data.layers.features[layerNames[m]]);
     global_data.layers.features[layerNames[m]]= addNodeLayer(map, data.links, data.hashedStructureData, global_data.style , id_links, selected_nodes)

      global_data.layers.features[layerNames[m]].setZIndex(Zindex)
    }
  }

  // refreshZindex()
}


function changeTemporalFilterArray(name_layer, name_variable, filter, id){

if(name_layer === 'link'){
  var value = data.filter[name_layer][name_variable].temporal.index[Number(document.getElementById(id).value)]
  }
else{
    var value = [... new Set(Object.keys(data.hashedStructureData).map(function(item){return data.hashedStructureData[item].properties[name_variable]}))][Number(document.getElementById(id).value)]
}


  var i = -1;
  if(global_data.filter[name_layer].length !== 0){
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if( global_data.filter[name_layer][p].variable === name_variable  && global_data.filter[name_layer][p].filter === filter){
      i = p;
      global_data.filter[name_layer][p].values = value;
      break;
    }
  }
}
  if(i === -1){
  global_data.filter[name_layer].push({
    variable: name_variable,
    values:value,
    filter:filter
    })
  }  

  refreshFilterFeaturesLayers()
}


function changeCatFilterArray(name_layer, name_variable, filter, id){

    var value = Array.from($(id).find(':selected')).map(function(item){
    return $(item).text();
});

  var i = -1;
  if(global_data.filter[name_layer].length !== 0){
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if( global_data.filter[name_layer][p].variable === name_variable  && global_data.filter[name_layer][p].filter === filter){
      i = p;
      global_data.filter[name_layer][p].values = value;
      break;
    }
  }
}
  if(i === -1){
  global_data.filter[name_layer].push({
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
  if(global_data.filter[name_layer].length !== 0){
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if( global_data.filter[name_layer][p].variable === name_variable &&  global_data.filter[name_layer][p].filter === filter){
      i = p;
      global_data.filter[name_layer][p].values = value;
      break;
    }
  }
}
  if(i === -1){
  global_data.filter[name_layer].push({
    variable: name_variable,
    values:value,
    filter:filter
    })
  }  
 
  refreshFilterFeaturesLayers()
}


function changeTimeFilterArray(name_layer, name_variable, filter, value){
  
//console.log(value);
  var i = true;
  if(global_data.filter[name_layer].length !== 0){
  for(var p=0; p<global_data.filter[name_layer].length; p++){
    if( global_data.filter[name_layer][p].variable === name_variable &&  global_data.filter[name_layer][p].filter === filter){
      i = false;
      global_data.filter[name_layer][p].values = value;
      break;
    }
  }
}
  if(i){
  global_data.filter[name_layer].push({
    variable: name_variable,
    values:value,
    filter:filter,
    format: data.filter[name_layer][name_variable].timeLapse.format
    })
  }  

  refreshFilterFeaturesLayers()
}


