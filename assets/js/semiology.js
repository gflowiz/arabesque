import {getNameVariables} from "./control.js";
import {addNodeLayer, addLinkLayer} from "./layer.js";


//PALETTE FOR SMIOLOGY
//USE OF INTERPOLAR FOR COMPUTE THE COLOR VALUE
export const paletteColorCat = {
  Category10 : d3.schemeCategory10,
  Accent: d3.schemeAccent,
  Dark2: d3.schemeDark2,
  Paired: d3.schemePaired,
  Pastel1 : d3.schemePastel1,
  Pastel2: d3.schemePastel2,
  Set1: d3.schemeSet1,
  Set2: d3.schemeSet2,
  Set3 : d3.schemeSet3
}

export  const paletteColorDiverging = {
  BrBG : d3.schemeBrBG,
  PRGn: d3.schemePRGn,
  PiYG: d3.schemePiYG,
  PuOr: d3.schemePuOr,
  RdBu : d3.schemeRdBu,
  RdGy: d3.schemeRdGy,
  RdYlBu: d3.schemeRdYlBu,
  RdYlGn: d3.schemeRdYlGn,
  Spectral : d3.schemeSpectral
}


export const paletteColorSequential = {
  Blues : d3.schemeBlues,
  Greens: d3.schemeGreens,
  Greys: d3.schemeGreys,
  Oranges: d3.schemeOranges,
  Purples : d3.schemePurples,
  Reds: d3.schemeReds
}

export const paletteColorSequentialMultiHue = {
  BuGn : d3.schemeBuGn,
  BuPu: d3.schemeBuPu,
  GnBu: d3.schemeGnBu,
  OrRd: d3.schemeOrRd,
  PuBuGn : d3.schemePuBuGn,
  PuBu: d3.schemePuBu,
  PuRd: d3.schemePuRd,
  RdPu: d3.schemeRdPu,
  YlGnBu : d3.schemeYlGnBu,
  YlGn: d3.schemeYlGn,
  YlOrBr: d3.schemeYlOrBr,
  YlOrRd : d3.schemeYlOrRd
}

 
export const paletteColorSequentialMultiHue2 = {  
    Viridis : [[],[],[],[],[],[],[],[],[],[],[],[],[]],
    Inferno : [[],[],[],[],[],[],[],[],[],[],[],[],[]],
    Magma : [[],[],[],[],[],[],[],[],[],[],[],[],[]],
    Plasma : [[],[],[],[],[],[],[],[],[],[],[],[],[]],
    Warm : [[],[],[],[],[],[],[],[],[],[],[],[],[]],
    Cool : [[],[],[],[],[],[],[],[],[],[],[],[],[]],
    CubehelixDefault : [[],[],[],[],[],[],[],[],[],[],[],[],[]],
    Rainbow : [[],[],[],[],[],[],[],[],[],[],[],[],[]],
    Sinebow : [[],[],[],[],[],[],[],[],[],[],[],[],[]]
  }




export function setupStyleAndAddLayer(style){

  var widthVar = document.getElementById('semioSelectorSizeAdd').value;

  var ratio = document.getElementById('ratioMinMaxSizeAdd').value;
  var colorVar = document.getElementById('semioSelectorColorAdd').value
  
  var colorType = document.getElementById('typeColorAdd').value  

  
  var textVar = document.getElementById('semioSelectorTextAdd').value
  var layer = document.getElementById('featureChosenAdd').value


  var   opaVar = document.getElementById('semioSelectorOpaAdd').value


    style[layer].opa.var = opaVar

var opaMinRatio, opaMaxRatio, typeopa;
  if(opaVar === 'fixed'){
    style[layer].opa.vmax =  Number(document.getElementById('ratioMaxOpaAdd').value);

  }
  else
  {
    style[layer].opa.vmax  = setupMaxAndMin(opaVar, layer)[1]
    style[layer].opa.min = document.getElementById('ratioMinOpaAdd').value;
    style[layer].opa.max = document.getElementById('ratioMaxOpaAdd').value;
    style[layer].opa.cat = document.getElementById('typeOpaAdd').value;
  }

  // sizeMM = setupMaxAndMin(widthVar, layer)
  var sizeMM = [0,0]
  var colMM = [0,0]

    if(widthVar !== 'fixed')
      {
        sizeMM = setupMaxAndMin(widthVar, layer)
        var typeSize = document.getElementById('typeSizeAdd').value;
      }

    
    if(colorVar === 'fixed')
    {
      var chosenPalette = $("#semioColorpickerAdd").spectrum('get').toHexString();
    }
    else{
      style[layer].color.palette = $("#colorPickerAdd>div").find(".selected").attr("value");
      colMM = [0,0]
      if(colorType==='number'){
        colMM = setupMaxAndMin(colorVar, layer)
      }
      if(colorType==='categorical'){
        window[layer+'OrderedCategory'](colorVar, style[layer])
      }
     
    }

      style[layer].color.cat = colorType
      style[layer].color.var = colorVar
      style[layer].color.max = colMM[1]
      style[layer].color.min = colMM[0]

      style[layer].size.var = widthVar
      style[layer].size.cat = typeSize
      style[layer].size.ratio = ratio
      style[layer].size.max = sizeMM[1]
      style[layer].size.min = sizeMM[0]

      style[layer].text = textVar


    applyNewStyle(layer)
}

export function applyNewStyle(name_layer){

    if(name_layer==='node'){
      
      if (typeof global_data.layers['link'] !== "undefined"){
      map.removeLayer(global_data.layers.features['link'])
      global_data.layers.features['link'] = addLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1])

      }

      map.removeLayer(global_data.layers.features['node'])
      global_data.layers.features['node'] = addNodeLayer(map, data.links, data.hashedStructureData, global_data.style)
    }
    else if (name_layer ==='link'){
      

      map.removeLayer(global_data.layers.features['link'])
      global_data.layers.features['link'] = addLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1])
    
    }  
}

function nodeOrderedCategory(var_name, style){
style.categorialNodeOrderedColors = {};
let counts = {}
data.nodes.features.map(function(item){return item.properties[var_name]}).forEach(el => counts[el] = 1  + (counts[el] || 0))
var sortedKeys = Object.keys(counts).sort(function(a,b){return counts[a]-counts[b]})
var lenPalette = paletteColorCat[style.color.palette].length;
  for(var p=0; p<sortedKeys.length; p++){
    if(p<lenPalette){
    style.categorialNodeOrderedColors[sortedKeys[p]] = paletteColorCat[style.color.palette][p]
    }
    else{
      style.categorialNodeOrderedColors[sortedKeys[p]] = d3.color('grey').rgb()
    }
  }
}

function linkOrderedCategory(var_name, style){
style.categorialLinkOrderedColors = {};
let counts = {}
data.links.map(function(item){return item[var_name]}).forEach(el => counts[el] = 1  + (counts[el] || 0))
var sortedKeys = Object.keys(counts).sort(function(a,b){return counts[a]-counts[b]})
var lenPalette = paletteColorCat[style.color.palette].length;
  for(var p=0; p<sortedKeys.length; p++){
    if(p<lenPalette){
      style.categorialLinkOrderedColors[sortedKeys[p]] = paletteColorCat[style.color.palette][p]
    }
    else{
      style.categorialLinkOrderedColors[sortedKeys[p]] = d3.color('grey').rgb()
    }
  }
}
window.linkOrderedCategory = linkOrderedCategory;
window.nodeOrderedCategory = nodeOrderedCategory;

export function setupMaxAndMin(var_name, layer_name){

  if(layer_name==='node'){
    var dataArray = data.nodes.features.map(function(item){return item.properties[var_name]})
  }
  else if (layer_name ==='link'){
    var dataArray = data.links.map(function(item){return item[var_name]})
  }
  return [Math.min(...dataArray),Math.max(...dataArray)]
}




function addColorSemio(name,id_selector,id_parent, variables){
    $("#"+id_parent).append($('<div>')
                      .attr("class","col-md-2")
                      .append($('<select>')
                        .attr('class','custom-select')
                          .attr("id","semioSelectorColor"+id_selector)
                           .append('<option selected disable>Choose...</option>')
                           .append('<option value="fixed">fixed</option>')
                       )
                     );

    for(var p=0; p<variables.length; p++){
    $('#semioSelectorColor'+id_selector).append($('<option>', {text:variables[p] })
                        .attr("value",variables[p])
                        );
           
                            
    }   
document.getElementById("semioSelectorColor"+id_selector).addEventListener("change", function(){addColorTypeSelector(id_parent, id_selector)});        
}

function addTextSemio(name,id_selector,id_parent, variables){
    $("#"+id_parent).append($('<div>')
                      .attr("class","col-md-12")
                      .append($('<select>')
                        .attr('class','custom-select')
                          .attr("id","semioSelectorText"+id_selector)
                          .append('<option selected disable>Choose...</option>')
                          
                           //.attr("onchange",'addSemioColorType("'+name+','+id_selector+'")')
                       )
                     );

    for(var p=0; p<variables.length; p++){

    $('#semioSelectorText'+id_selector).append($('<option>', {text:variables[p] })
                        .attr("value",variables[p])
                        );             
                            
    }   

}

function addSizeSemio(name,id_selector,id_parent, variables){
    $("#"+id_parent).append($('<div>')
                      .attr("class","col-md-2")
                      .append($('<select>')
                        .attr('class','custom-select')
                          .attr("id","semioSelectorSize"+id_selector)
                          .append('<option selected disable>Choose...</option>')
                          .append('<option value="fixed">fixed</option>')
                       )
                     );

    for(var p=0; p<variables.length; p++){

    $('#semioSelectorSize'+id_selector).append($('<option>', {text:variables[p] })
                        .attr("value",variables[p])
                        );             
                            
    }   
document.getElementById("semioSelectorSize"+id_selector).addEventListener("change", function(){addSizeRatio(id_parent, id_selector)});
}

//TODO: REAL OPACITY
function addOpacitySemio(name,id_selector,id_parent, variables){
    $("#"+id_parent).append($('<div>')
                      .attr("class","col-md-3")
                      .append($('<select>')
                        .attr('class','custom-select')
                          .attr("id","semioSelectorOpa"+id_selector)
                          .append('<option selected disable>Choose...</option>')
                          .append('<option value="fixed">fixed</option>')
                       )
                     );

    for(var p=0; p<variables.length; p++){

    $('#semioSelectorOpa'+id_selector).append($('<option>', {text:variables[p] })
                        .attr("value",variables[p])
                        );             
                            
    }   

document.getElementById("semioSelectorOpa"+id_selector).addEventListener("change", function(){addOpaSelect(id_parent, id_selector)});
}

function addOpaSelect(id_parent, id_ele){
    if(document.getElementById("semioSelectorOpa"+id_ele) !== null){
      $('#semioOpaMinRatio'+id_ele).remove();
       $('#semioOpaMaxRatio'+id_ele).remove();
       $('#semioOpaRatioCat'+id_ele).remove();
    }
if(document.getElementById('semioSelectorOpa'+id_ele).value !== 'fixed'){
  $("#"+id_parent).append($('<div>')
                    .attr("id","semioOpaRatioCat"+id_ele)
                    .attr("class","col-md-4")
                    .append($('<select>')
                    .attr('class','custom-select')
                    .attr("id","typeOpa"+id_ele)
                    // .attr("onchange",'showRangeSize("'+id_ele+'","'+id_parent+'")')
                      .append($('<option>', {text:"Linear", value:'Linear'}))
                      .append($('<option>', {text:"Square", value:'Sqrt'}))                      
                      .append($('<option>', {text:"Logarithmic", value:'Log'}))
                    )
                  )


    $("#"+id_parent).append($('<div>')
                    .attr("id","semioOpaMinRatio"+id_ele)
                    .attr("class","col-md-2")
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","ratioMinOpa"+id_ele)
                    .attr("min",0.00)
                    .attr("step",0.05)
                    .attr("max",1.00)
                    .attr("type",'number')
                    .attr("value",0.25)
                    )
                  )
  }

  $("#"+id_parent).append($('<div>')
                    .attr("id","semioOpaMaxRatio"+id_ele)
                    .attr("class","col-md-2")
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","ratioMaxOpa"+id_ele)
                    .attr("min",0.00)
                    .attr("step",0.05)
                    .attr("max",1.00)
                    .attr("type",'number')
                    .attr("value",0.85)
                    ))
  return
      
}
// addSemioColorType(name,id){

//     if(document.getElementById(id) !== null){
//       $('#typeColor'+id).remove();
//       $('#colorPicker'+id).remove();
//     }

//   if(document.getElementById('semioTypeColor'+id) !== null){
//     $('#semioTypeColor'+id).remove();
//   }
//   addColorTypeSelector(name,id);
  
// }

function addSizeRatio(id_parent, id_ele){
    if(document.getElementById("semioSelectorSize"+id_ele) !== null){
      $('#semioSizeRatio'+id_ele).remove();
       $('#semioSizeRatioCat'+id_ele).remove();
    }
if(document.getElementById('semioSelectorSize'+id_ele).value !== 'fixed'){
  $("#"+id_parent).append($('<div>')
                    .attr("id","semioSizeRatioCat"+id_ele)
                    .attr("class","col-md-4")
                    .append($('<select>')
                    .attr('class','custom-select')
                    .attr("id","typeSize"+id_ele)
                    // .attr("onchange",'showRangeSize("'+id_ele+'","'+id_parent+'")')
                      .append($('<option>', {text:"Linear", value:'Linear'}))
                      .append($('<option>', {text:"Square", value:'Sqrt'}))                      
                      .append($('<option>', {text:"Logarithmic", value:'Log'}))
                    )
                  )
}
    $("#"+id_parent).append($('<div>')
                    .attr("id","semioSizeRatio"+id_ele)
                    .attr("class","col-md-4")
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","ratioMinMaxSize"+id_ele)
                    .attr("type",'number')
                    .attr("value",100)
                    )
                  )
  return
      
}



function addColorTypeSelector ( id_parent, id_ele){
    if(document.getElementById("semioTypeColor"+id_ele) !== null){
      $('#semioTypeColor'+id_ele).remove();
      $('#colorPicker'+id_ele).remove();
    }
if(document.getElementById('semioSelectorColor'+id_ele).value !== 'fixed'){
  $("#"+id_parent).append($('<div>')
                    .attr("id","semioTypeColor"+id_ele)
                    .attr("class","col-md-2")
                    .append($('<select>')
                    .attr('class','custom-select')
                    .attr("id","typeColor"+id_ele)
                      .append($('<option>', {text:"categorical", value:'categorical'}))
                      .append($('<option>', {text:"number", value:'number'}))
                    )
                  )
  
}

document.getElementById("typeColor"+id_ele).addEventListener("change", function(){showColors(id_ele, id_parent)});
showColors(id_ele, id_parent)
  return
      
}

function showColors(ide, idp){
  if(document.getElementById("semioSelectorColor"+ide) !== null){
      $('#colorPicker'+ide).remove();
    }
  if(document.getElementById('semioSelectorColor'+ide).value === 'fixed'){
    showfixed(ide, idp)
    return
  }

  var colorType = document.getElementById('typeColor'+ide).value      
  if(document.getElementById('colorPicker'+ide) !== null){
    $('#colorPicker'+ide).remove();
  }
  if(colorType === "categorical"){
    showPalette(ide, idp)
  } 
  else if(colorType === "number"){
    showGRadient(ide, idp)
  }  

  
}


function showfixed(ide, idp){
  var underId = "colorPicker"+ide
    $("#"+idp).append($('<div>')
      .attr("id",underId)
      .attr("class","col-md-8")
      .append($('<label>')
        )
      .append($('<input>')
        .attr("id","semioColorpicker"+ide)
        )
      )

    $("#semioColorpicker"+ide).spectrum({
    color: "aliceblue"
});
}





function showPalette(id_ele, id_parent){
  var chosenPalette = Object.keys(paletteColorCat)[0]
  var underId = "colorPicker"+id_ele
  $("#"+id_parent).append($('<div>')
      .attr("id",underId)
      .attr("class","col-md-8")
      .append($('<div>')
       .attr('class',"row")
        )
      )
  var palettes_names = Object.keys(paletteColorCat)
  var add =true;
  for(var p=0;p<palettes_names.length;p++){

    $("#"+underId+">div").append($('<div>')
                              .attr('id',palettes_names[p]+id_ele)
                              .attr('value',palettes_names[p])
                            );
    if(chosenPalette === palettes_names[p]){
      $("#"+palettes_names[p]+id_ele).attr('class', "ramps selected");
      add = false;
      chosenPalette = palettes_names[p];
    }
    else {
      $("#"+palettes_names[p]+id_ele).attr("class","ramps")
    }
    var svg = '<svg width="15" height="120">';
     for(var n=0; n<8; n++){
      svg += '<rect fill="'+d3.rgb(paletteColorCat[palettes_names[p]][n])+'" width="15" height="15" y="'+ n*15+'"></rect>'
    }
    svg += '</svg>';
    $("#"+palettes_names[p]+id_ele).append(svg).click( function(){
        changePalette($(this),id_ele);
        
  });
}
}

export function generatePaletteMultiHue2(){
  var X = [0,1.5,3,4.5,5.5,7,8.5,10]
  var keys = Object.keys(paletteColorSequentialMultiHue2)
  for (var p=0;p<X.length;p++){
    for(var n=0;n<keys.length;n++){
      paletteColorSequentialMultiHue2[keys[n]][8].push(d3["interpolate"+keys[n]](X[p]*0.1))
    }
  }
}

function removeSelected(id){
 $("#"+id).find(":selected").prop('selected', false);
}

function changeSelect(element,id){
    removeSelected(id);
    element.prop('selected', true);
  }

function removeColorSelected(id){
 $("#colorPicker"+id+">div").find("div.selected").removeClass('selected').attr('ramps');
}

function changePalette(element,id){

  if(!element.hasClass('selected')){
    removeColorSelected(id)
    element.attr('class','ramps selected')
    var chosenPalette = element.attr("value")
  }
  
  }

function showGRadient(id_ele, id_parent){
  var chosenPalette = Object.keys(paletteColorDiverging)[0]
    $("#"+id_parent).append($('<div>')
      .attr("id","colorPicker"+id_ele)
      .attr("class","col-md-8")
      .append($('<div>')
       .attr('class',"row")
       .attr('id',"diverColor"+id_ele)
        )
      .append($('<div>')
       .attr('class',"row")
       .attr('id',"sequentialColor"+id_ele)
        )
      )
  //other = Object.keys(paletteColorSequentialMultiHue2)
  createFrameColorsSeclector(paletteColorSequential,8,"sequentialColor"+id_ele,id_ele)

  createFrameColorsSeclector(paletteColorSequentialMultiHue,8,"sequentialColor"+id_ele,id_ele)

  createFrameColorsSeclector(paletteColorDiverging,8,"diverColor"+id_ele,id_ele)

  createFrameColorsSeclector(paletteColorSequentialMultiHue2,8,"diverColor"+id_ele,id_ele)
}

function createFrameColorsSeclector(list_palette, n_color, id_div, id_to_control){

   var palette = Object.keys(list_palette)
   for(var p=0;p<palette.length;p++){
        $('#'+id_div).append($('<div>')
                              .attr('id',palette[p]+id_to_control)
                              .attr('value',palette[p])
                            );
    if(chosenPalette === palette[p]){
      $("#"+palette[p]+id_to_control).attr('class', "ramps selected");
      var chosenPalette = palette[p];
    }
    else {
      $("#"+palette[p]+id_to_control).attr("class","ramps")
    }


    $("#"+palette[p]+id_to_control).append(svgExample(list_palette[palette[p]][8],n_color)).click( function(){
        changePalette($(this),id_to_control);
        
  });
  }
}

function svgExample(listColor, n_color){
  var svg = '<svg width="15" height="'+15*n_color+'">';
     for(var n=0; n<n_color; n++){
      svg += '<rect fill="'+d3.rgb(listColor[n])+'" width="15" height="15" y="'+ n*15+'"></rect>'
    }
    svg += '</svg>';
    
  return svg;
}


export function showSemioParameter(){
      
  var featureName = document.getElementById('featureChosenAdd').value;
   if(document.getElementById('semioSelectorLink') !== null){
      $('#semioSelectorLink').parent().remove()
    }
    if(document.getElementById('semioColorAdd') !== null){
      $('#semioColorAdd').children().remove()
    }
    if(document.getElementById('semioSizeAdd') !== null){
      $('#semioSizeAdd').children().remove()
    }
    if(document.getElementById('semioTextAdd') !== null){
      $('#semioTextAdd').children().remove()
    }
    if(document.getElementById('semioOpaAdd') !== null){
      $('#semioOpaAdd').children().remove()
    }
    if(featureName ==='link'){
    $('#semioLayerBody').append($('<div>')
                                .attr("class","col-md-6")
                                .append($('<select>')
                                  .attr('class','custom-select')
                                  .attr("id","semioSelectorLink")
                                  )
                                );

    var graph = ["oriente", "non_oriente"];
    for(var p=0; p<graph.length; p++){
    $('#semioSelectorLink').append($('<option>', {text:graph[p] })
                        .attr("value",graph[p])
                        );
                      
      }                 
    } 

    var variables = getNameVariables(featureName)

    addColorSemio(featureName,'Add','semioColorAdd', variables)
    
    addSizeSemio(featureName,'Add','semioSizeAdd', variables)
    addTextSemio(featureName,'Add','semioTextAdd', variables)

    addOpacitySemio(name,'Add','semioOpaAdd', variables)
}


export function changeSemioParameter(name, style){

    if(document.getElementById('semioColorChange') !== null){
      $('#semioColorChange').children().remove()
    }
    if(document.getElementById('semioSizeChange') !== null){
      $('#semioSizeChange').children().remove()
    }
    if(document.getElementById('semioTextChange') !== null){
      $('#semioTextChange').children().remove()
    }
    if(document.getElementById('semioOpaChange') !== null){
      $('#semioOpaChange').children().remove()
    }

    var variables = getNameVariables(name)

    addColorSemio(name,'Change','semioColorChange', variables)
 
    addSizeSemio(name,'Change','semioSizeChange', variables)

    addTextSemio(name,'Change','semioTextChange', variables)

    addOpacitySemio(name,'Change','semioOpaChange', variables)
    loadStyleToModify(name, style[name])
    //TODO SET UP OLD VALUE
    // document.getElementById('changeStyleButton').removeListeners();
    $('#changeStyleButton').replaceWith($('#changeStyleButton').clone());
    document.getElementById("changeStyleButton").addEventListener("click", function() {
        applyChangeStyle(name, style, global_data.layers.features)
    });
}



//TODO
function loadStyleToModify(layer_name, style){
  changeSelect($("#semioSelectorTextChange").children('[value="'+style.text+'"]'),"semioSelectorTextChange")
  changeSelect($("#semioSelectorSizeChange").children('[value="'+style.size.var+'"]'),"semioSelectorColorChange")
  changeSelect($("#semioSelectorOpaChange").children('[value="'+style.opa.var+'"]'),"semioSelectorOpaChange")
  changeSelect($("#semioSelectorColorChange").children('[value="'+style.color.var+'"]'),"semioSelectorColorChange")
  //COLOR LOAD
  addColorTypeSelector("semioColorChange",'Change')
  changeSelect($("#typeColorChange").children('[value="'+style.color.cat+'"]'),"typeColorChange")
  showColors("Change", 'semioColorChange')
  if (style.color.var !== 'fixed'){
    changePalette($("#colorPickerChange>div").children('[value="'+style.color.palette+'"]'),"Change")
  }
  else 
  {
    $("#semioColorpickerChange").spectrum({
    color: style.color.palette
    });
  }

  addSizeRatio("semioSizeChange",'Change')
  if (style.size.var !== 'fixed'){
    changeSelect($("#typeSizeChange").children('[value="'+style.size.cat+'"]'),"typeSizeChange")
    $("#ratioMinMaxSizeChange").attr("value",style.size.ratio)
  }
  else
  {
      $("#ratioMinMaxSizeChange").attr("value",styles.size.ratio)
  }
  
  addOpaSelect("semioOpaChange",'Change')
  if (style.opa.var !== 'fixed'){
    changeSelect($("#typeOpaChange").children('[value="'+style.opa.cat+'"]'),"typeOpaChange")
    $("#ratioMaxOpaChange").attr("value",style.opa.max)
    $("#ratioMinOpaChange").attr("value",style.opa.min)
  }
  else
  {
    $("#ratioMaxOpaChange").attr("value",style.opa.vmax)
  }
}

export function applyChangeStyle(name, style, layers){
  var widthVar = document.getElementById('semioSelectorSizeChange').value;
  var colorVar = document.getElementById('semioSelectorColorChange').value
  var colorType = document.getElementById('typeColorChange').value  

  var ratio = document.getElementById('ratioMinMaxSizeChange').value;
  var typeSize = document.getElementById('typeSizeChange').value;
  var textVar = document.getElementById('semioSelectorTextChange').value


  var opaVar = document.getElementById('semioSelectorOpaChange').value
    
     style[name].opa.var = opaVar

   console.log(name)

  if(opaVar === 'fixed'){
     style[name].opa.vmax = document.getElementById('ratioMaxOpaChange').value;
  }
  else
  {

    style[name].opa.vmax = setupMaxAndMin(opaVar, name)[1]
    style[name].opa.min = document.getElementById('ratioMinOpaChange').value;
    style[name].opa.max = document.getElementById('ratioMaxOpaChange').value;
    style[name].opa.cat =  document.getElementById('typeOpaChange').value;
  }

  // sizeMM = setupMaxAndMin(widthVar, layer)
  var sizeMM = [0,0]
  var colMM = [0,0]


console.log(style)


    if(widthVar !== 'fixed')
      {
        sizeMM = setupMaxAndMin(widthVar, name)
      var  typeSize = document.getElementById('typeSizeChange').value;
      }



    colMM = [0,0]
    if(colorVar === 'fixed')
    {
      var chosenPalette = $("#semioColorpickerChange").spectrum('get').toHexString();
    }
    else{
      colMM = [0,0]
      if(colorType==='number'){
        colMM = setupMaxAndMin(colorVar, name)
      }
      else if(colorType==='categorical'){
        window[name+'OrderedCategory'](colorVar, style[name])
      }
      var chosenPalette =  $("#colorPickerChange>div").find(".selected").attr("value");
      // sizeMM = setupMaxAndMin(widthVar, name)
    }
    
console.log(sizeMM)
      style[name].color.palette = chosenPalette
      style[name].color.cat = colorType
      style[name].color.var = colorVar
      style[name].color.max = colMM[1]
      style[name].color.min = colMM[0]

       style[name].text = textVar
      
      layers[name].changed()

     
      style[name].size.var = widthVar
      style[name].size.cat = typeSize
      style[name].size.ratio = ratio
      style[name].size.max = sizeMM[1]
      style[name].size.min = sizeMM[0]
      
      
      // else{
      //   if(name === 'link'){
      //   map.removeLayer(featuresLayers[name])
      //   featuresLayers[name] = new ol.layer.Vector({
      //     name:"Link",
      //     source:featuresLayers[name].getSource(),
      //     style:styleLinkPoly,
      //     renderMode:'image'
      //   })
      //   map.addLayer(featuresLayers[name])
      // }
      //   if(name === 'node'){
      //     map.removeLayer(featuresLayers[name])
      //     layer = new ol.layer.Vector({
      //     name:"Node",
      //     source:featuresLayers[name].getSource(),
      //     style:styleNodeCircle,
      //     renderMode:'image'
      //   })
      //   map.addLayer(featuresLayers[name])
      //   }
      // }
applyNewStyle(name)

  return;
}

function checkChangeSize(Styles, var_size,cat,value){
  return var_size === Styles.size.var && cat === Styles.size.cat && value === Styles.size.ratio
}
