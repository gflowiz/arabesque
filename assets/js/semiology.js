import {getNameVariables, refreshZindex} from "./control.js";
import {addNodeLayer, generateLinkLayer, getLayerFromName, changeBaseLayer, groupLinksByOD, addLegendToMap,getD3ScalersForStyle} from "./layer.js";
import { testLinkDataFilter, applyNodeDataFilter } from "./filter.js"
import 'spectrum-colorpicker/spectrum.js'
import 'spectrum-colorpicker/spectrum.css'

//PALETTE FOR SMIOLOGY
//USE OF INTERPOLAR FOR COMPUTE THE COLOR VALUE
var paletteColorCat = {
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



export function showChangeBaseLayerParameter(map, layers, mode, layer_name, style){

    $("#strokeColorpickerChange").spectrum({
        color: style.stroke
    });
    $("#fillColorpickerChange").spectrum({
        color: style.fill
    });

    document.getElementById("opacityLayer"+mode).value = style.opacity;

    $('#addNewLayerButtonChange').replaceWith($('#addNewLayerButtonChange').clone());
    document.getElementById('addNewLayerButtonChange').addEventListener("click", function(){changeBaseLayer(map, global_data.layers, "Change", layer_name)}); 
  return;
}

export function getNodeColorScaleValue(layer, scalers){
  
  var colors = []
  var min = global_data.style[layer].color.min;
  var max = global_data.style[layer].color.max;
  for(var i = 0; i<7; i++){
        var NormalizeColor = (min+ (max-min)/7 * (7-i)-min)/(max-min) 
        colors.push([Number(max/(i+1)).toString(), d3.color(d3["interpolate"+global_data.style[layer].color.palette](NormalizeColor)).rgb().toString()])
  }
  // 
  return colors
}

export function getNodeOpaScaleValue(layer){
  var colors = []
  var min = global_data.style[layer].opa.min;
  var valueMax = global_data.style[layer].opa.vmax;
  var max = global_data.style[layer].opa.max;
  var color = d3.color('grey');
  for(var i = 0; i<7; i++){
        // var NormalizeColor = (min * (9-i)-min)/(max-min) 
        color.opacity = max - (i  * (max-min)/7)
        // 
        colors.push([Number(valueMax /(i+1)), color.rgb().toString()])
  }
  return colors
}

export function getNodeColorCatValue(layer){
  var colors = {}
  var list_colors = global_data.style[layer].categorialOrderedColors;
  var hasOtherCat = false;
  var index = Object.keys(global_data.style[layer].categorialOrderedColors)
  // 
  // 
  for(var i = 0; i<index.length; i++){
    // 
        if( typeof d3.color('grey').rgb() !==  typeof list_colors[index[i]]){
            // 
            // 
          colors[index[i]] = list_colors[index[i]]
        }
        else{
          hasOtherCat = true;
        }
  }

  if(hasOtherCat){
    colors['Others'] = d3.color('grey').rgb().toString()
  }

  // 

  return colors
}

function loadGeometryParameter(style){

  style.link.geometry.type = document.getElementById("arrowtype").value
  if (document.getElementById("arrowtype").value ==="CurveArrow" || document.getElementById("arrowtype").value ==="CurveOneArrow"){
    
    style.link.geometry.place.base = Number(document.getElementById("baseCurveArrow").value)
    style.link.geometry.place.height = Number(document.getElementById("heightCurveArrow").value)
  }
  else if (document.getElementById("arrowtype").value ==="StraightArrow"){
    style.link.geometry.place.base = null
    style.link.geometry.place.height = null
  }

  if (document.getElementById("arrowData").value  === 'oriented'  && document.getElementById("arrowtype").value !=="TriangleArrow" && document.getElementById("arrowtype").value !=="CurveOneArrow"){
    style.link.geometry.oriented = document.getElementById("arrowData").value
    style.link.geometry.head.width = Number(document.getElementById("widthArrow").value)
    style.link.geometry.head.height = Number(document.getElementById("heightArrow").value)
  }
    else{
    style.link.geometry.oriented = document.getElementById("arrowData").value
    style.link.geometry.head.width = null
    style.link.geometry.head.height = null
    }
}

export function setupStyleAndAddLayer(style, layer_name){
  if(layer_name === 'link'){
  loadGeometryParameter(style)
}
  var widthVar = document.getElementById('semioSelectorSizeAdd'+layer_name).value;

  var ratio = document.getElementById('ratioMinMaxSizeAdd'+layer_name).value;
  var colorVar = document.getElementById('semioSelectorColorAdd'+layer_name).value;
  var layer =layer_name.toLowerCase();
   

  if(layer ==='node'){
  var textVar = document.getElementById('semioSelectorTextAdd'+layer_name).value;
  style[layer].text = textVar;
  }
  else{
    loadGeometryParameter(style)
  }


  var   opaVar = document.getElementById('semioSelectorOpaAdd'+layer_name).value;


    style[layer].opa.var = opaVar;

  var opaMinRatio, opaMaxRatio, typeopa;
  if(opaVar === 'fixed'){
    style[layer].opa.vmax =  Number(document.getElementById('ratioMaxOpaAdd'+layer_name).value);

  }
  else
  {
    style[layer].opa.vmax  = getMinMaxColor(opaVar, layer)[1];
    style[layer].opa.min = document.getElementById('ratioMinOpaAdd'+layer_name).value;
    style[layer].opa.max = document.getElementById('ratioMaxOpaAdd'+layer_name).value;
    style[layer].opa.cat = document.getElementById('typeOpaAdd'+layer_name).value;
  }

  // sizeMM = setupMaxAndMin(widthVar, layer)
  var sizeMM = [0,0];
  var colMM = [0,0];

    if(widthVar !== 'fixed')
      {
        sizeMM = getMinMaxSize(widthVar, layer)
        var typeSize = document.getElementById('typeSizeAdd'+layer_name).value;
      }

    
    if(colorVar === 'fixed')
    {
      style[layer].color.palette = $("#semioColorpickerAdd"+layer_name).spectrum('get').toHexString();
    }
    else{

      var colorType = document.getElementById('typeColorAdd'+layer_name).value 
      style[layer].color.palette = $("#colorPickerAdd"+layer_name).find(".selected").attr("value");  
      style[layer].color.cat = colorType
      colMM = [0,0]
      if(colorType==='number'){
        colMM = getMinMaxColor(colorVar, layer)
      }
      if(colorType==='categorical'){
        window[layer+'OrderedCategory'](colorVar, style[layer])
      }
     
    }

      style[layer].color.var = colorVar
      style[layer].color.max = colMM[1]
      style[layer].color.min = colMM[0]

      style[layer].size.var = widthVar
      style[layer].size.cat = typeSize
      style[layer].size.ratio = ratio
      style[layer].size.max = sizeMM[1]
      style[layer].size.min = sizeMM[0]




    applyNewStyle(layer)
}

function getMinMaxColor(colorVar, layer){
  

  if(layer==='node'){
    var dataArray = Object.keys(data.hashedStructureData).map(function(item){return Number(data.hashedStructureData[item].properties[colorVar])})
  }
  else if (layer ==='link'){

    var OD  = groupLinksByOD(data.links, [...Array(data.links.length).keys()], global_data.ids.linkID[0],global_data.ids.linkID[1])
    var idOD = Object.keys(OD)

    var test = idOD.map(function(item){
      return Object.keys(OD[item]).map(function(item2){
        if(global_data.files.aggr === "sum"){
          return OD[item][item2].reduce(function (accumulateur, valeurCourante) {
              return accumulateur + Number(data.links[valeurCourante][colorVar]);
          }, 0);
      }
        else{
          Math.max(...OD[item][item2].map(function (value) {
              return Number(data.links[value][colorVar]);
          }))

        }

        })
      })
    
    var dataArray = test.flat()
  }
  // console
  return [Math.min(...dataArray),Math.max(...dataArray)]
}

function getMinMaxSize(sizeVar, layer){
  

  if(layer==='node'){
    var dataArray = Object.keys(data.hashedStructureData).map(function(item){return Number(data.hashedStructureData[item].properties[sizeVar])})
  }
  else if (layer ==='link'){

    var OD  = groupLinksByOD(data.links, [...Array(data.links.length).keys()], global_data.ids.linkID[0],global_data.ids.linkID[1])
    var idOD = Object.keys(OD)

    var test = idOD.map(function(item){
       return Object.keys(OD[item]).map(function(item2){
        if(global_data.files.aggr === "sum"){
          return OD[item][item2].reduce(function (accumulateur, valeurCourante) {
              return accumulateur + Number(data.links[valeurCourante][sizeVar]);
          }, 0);
        }
        else{
          Math.max(...OD[item][item2].map(function (value) {
              return Number(data.links[value][sizeVar]);
          }))

        }
        })
      })
    // 
    var dataArray = test.flat()
  }
  // console
  return [Math.min(...dataArray),Math.max(...dataArray)]
}

export function applyNewStyle(name_layer){
var lindex = 0;
var nindex = 0;
  var id_links = testLinkDataFilter(global_data.filter.link, data)

  var selected_nodes = applyNodeDataFilter(data.hashedStructureData)
var t0 = performance.now();


    if (getLayerFromName(map, 'node') !== null){
      nindex = getLayerFromName(map, 'node').getZIndex()
    }


    if (getLayerFromName(map, 'link') !== null){
      lindex = getLayerFromName(map, 'link').getZIndex()
    }



    if(name_layer==='node'){
         if (getLayerFromName(map, 'link') !== null){
          
          // map.removeLayer(getLayerFromName(map, 'link'))
          
          generateLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1], id_links, selected_nodes)
          getLayerFromName(map, 'link').setZIndex(lindex)
          // global_data.layers.features['node'].setZIndex(nindex)
        }  
      // map.removeLayer(getLayerFromName(map, 'node'))
      addNodeLayer(map, data.links, data.hashedStructureData, global_data.style, id_links, selected_nodes)
      getLayerFromName(map, 'node').setZIndex(nindex)
    }
    else if (name_layer ==='link'){
      
      // index = global_data.layers.features['link'].getZIndex()
      // map.removeLayer(getLayerFromName(map, 'link'))
      generateLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1], id_links, selected_nodes)
      getLayerFromName(map, 'link').setZIndex(lindex)
      // global_data.layers.features['node'].setZIndex(nindex)
      
    }  
    // refreshZindex()
var t1 = performance.now();

    var i = 0
    $('#accordionLayerControl').find('li').each(function(){
      var elem  = $(this).attr('value')
      
       if (getLayerFromName(map, elem) !== null)
            {
                getLayerFromName(map, elem).setZIndex(- i)
            }
            i = i+1
          }
   )

    addLegendToMap()
}

export function nodeOrderedCategory(var_name, style){
  
  style.categorialOrderedColors = {};
  let counts = {}
  // 
  Object.keys(data.hashedStructureData).map(function(item){return data.hashedStructureData[item].properties[var_name]}).forEach(el => counts[el] = 1  + (counts[el] || 0))
  var sortedKeys = Object.keys(counts).sort(function(a,b){return counts[a]-counts[b]})
  var lenPalette = paletteColorCat[style.color.palette].length;
  for(var p=0; p<sortedKeys.length; p++){
    if(p<lenPalette){
    style.categorialOrderedColors[sortedKeys[p]] = paletteColorCat[style.color.palette][p]
    }
    else{
      style.categorialOrderedColors[sortedKeys[p]] = d3.color('grey').rgb()
    }
  }
}

export function linkOrderedCategory(var_name, style){
  style.categorialOrderedColors = {};
  let counts = {}
  data.links.map(function(item){return item[var_name]}).forEach(el => counts[el] = 1  + (counts[el] || 0))
  var sortedKeys = Object.keys(counts).sort(function(a,b){return counts[a]-counts[b]})
  var lenPalette = paletteColorCat[style.color.palette].length;
  for(var p=0; p<sortedKeys.length; p++){
    if(p<lenPalette){
      style.categorialOrderedColors[sortedKeys[p]] = paletteColorCat[style.color.palette][p]
    }
    else{
      style.categorialOrderedColors[sortedKeys[p]] = d3.color('grey').rgb()
    }
  }
}


window.linkOrderedCategory = linkOrderedCategory;
window.nodeOrderedCategory = nodeOrderedCategory;

export function setupMaxAndMin(var_name, layer_name){

  if(layer_name==='node'){
    var dataArray = Object.keys(data.hashedStructureData).map(function(item){return Number(data.hashedStructureData[item].properties[var_name])})
  }
  else if (layer_name ==='link'){
    var dataArray = data.links.map(function(item){return Number(item[var_name])})
  }
  // 
  return [Math.min(...dataArray),Math.max(...dataArray)]
}




function addColorSemio(name,id_selector,id_parent, variables){
    $("#"+id_parent).append($('<div>')
                      .attr("class","col-md-3")
                      .append('<label class="text-muted h5" for="semioSelectorColor"'+id_selector+'>Variable</label>')
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
                      .append('<label class="text-muted h5">Variable</label>')
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
                      .append('<label class="text-muted h5">Variable</label>')
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
    
document.getElementById("semioSelectorSize"+id_selector).addEventListener("change", function(){addSizeRatio(id_parent, id_selector, name)});
}

//TODO: REAL OPACITY
function addOpacitySemio(name,id_selector,id_parent, variables){
  // 
    $("#"+id_parent).append($('<div>')
                      .attr("class","col-md-3")
                      .append('<label class="text-muted h5">Variable</label>')
                      .append($('<select>')
                        .attr('class','custom-select')
                          .attr("id","semioSelectorOpa"+id_selector)
                          .append('<option selected value="fixed">fixed</option>')
                       )
                     );

    for(var p=0; p<variables.length; p++){

    $('#semioSelectorOpa'+id_selector).append($('<option>', {text:variables[p] })
                        .attr("value",variables[p])
                        );             
                            
    }   

document.getElementById("semioSelectorOpa"+id_selector).addEventListener("change", function(){addOpaSelect(id_parent, id_selector)});
addOpaSelect(id_parent, id_selector)
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
                    .attr("class","col-md-3")

                    .append('<label class="text-muted h5">Scale</label>')
                    .append($('<select>')
                    .attr('class','custom-select')
                    .attr("id","typeOpa"+id_ele)
                    // .attr("onchange",'showRangeSize("'+id_ele+'","'+id_parent+'")')
                      .append($('<option>', {text:"Linear", value:'Linear'}))
                      .append($('<option>', {text:"Square", value:'Pow'}))
                      .append($('<option>', {text:"SquareRoot", value:'Sqrt'}))                         
                      .append($('<option>', {text:"Logarithmic", value:'Log'}))
                    )
                  )


    $("#"+id_parent).append($('<div>')
                    .attr("id","semioOpaMinRatio"+id_ele)
                    .attr("class","col-md-3")
                    .append('<label class="text-muted h5">Min</label>')
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
  

  $("#"+id_parent).append($('<div>')
                    .attr("id","semioOpaMaxRatio"+id_ele)
                    .attr("class","col-md-3")
                    .append('<label class="text-muted h5">Max</label>')
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
  else{
     $("#"+id_parent).append($('<div>')
                    .attr("id","semioOpaMaxRatio"+id_ele)
                    .attr("class","col-md-3")
                    .append('<label class="text-muted h5">Value</label>')
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","ratioMaxOpa"+id_ele)
                    .attr("min",0.00)
                    .attr("step",0.05)
                    .attr("max",1.00)
                    .attr("type",'number')
                    .attr("value",0.85)
                    ))
  }
      
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

function addSizeRatio(id_parent, id_ele, layer){
    if(document.getElementById("semioSelectorSize"+id_ele) !== null){
      $('#semioSizeRatio'+id_ele).remove();
       $('#semioSizeRatioCat'+id_ele).remove();
    }
    
if(document.getElementById('semioSelectorSize'+id_ele).value !== 'fixed'){
  if(layer === 'link'){
  $("#"+id_parent).append($('<div>')
                    .attr("id","semioSizeRatioCat"+id_ele)
                    .attr("class","col-md-4")
                    .append('<label class="text-muted h5">Scale</label>')
                    .append($('<select>')
                    .attr('class','custom-select')
                    .attr("id","typeSize"+id_ele)
                    // .attr("onchange",'showRangeSize("'+id_ele+'","'+id_parent+'")')
                      .append($('<option>', {text:"Linear", value:'Linear'}))  
                      .append($('<option>', {text:"Square", value:'Pow'})) 
                      .append($('<option>', {text:"SquareRoot", value:'Sqrt'}))                         
                      .append($('<option>', {text:"Logarithmic", value:'Log'}))         
                    )
                  )
}
else{
    $("#"+id_parent).append($('<div>')
                    .attr("id","semioSizeRatioCat"+id_ele)
                    .attr("class","col-md-4")
                    .append('<label class="text-muted h5">Scale</label>')
                    .append($('<select>')
                    .attr('class','custom-select')
                    .attr("id","typeSize"+id_ele)
                    // .attr("onchange",'showRangeSize("'+id_ele+'","'+id_parent+'")')
                      // .append($('<option>', {text:"Linear", value:'Linear'}))  
                      .append($('<option>', {text:"Square", value:'Pow'}))  
                      .append($('<option>', {text:"SquareRoot", value:'Sqrt'}))                       
                      .append($('<option>', {text:"Logarithmic", value:'Log'}))    
                      // .append($('<option>', {text:"Square", value:'Sqrt'}))          
                    )
                  )
}
    var text = '"It is the percentage of the arrow width."'
    $("#"+id_parent).append($('<div>')
                    .attr("id","semioSizeRatio"+id_ele)
                    .attr("class","col-md-4")
                    .append('<label class="text-muted h5">Ratio  <button  class="badge badge-pill badge-secondary"  data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content='+text+' ><img class="small-icon" src="assets/svg/si-glyph-info.svg"/></button></label>')
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","ratioMinMaxSize"+id_ele)
                    .attr("type",'number')
                    .attr("value",100)
                    )
                  )
  $('[data-toggle="popover"]').popover()
    return
    }
    else{
      $("#"+id_parent).append($('<div>')
                    .attr("id","semioSizeRatio"+id_ele)
                    .attr("class","col-md-4")
                    .append('<label class="text-muted h5">Width</label>')
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","ratioMinMaxSize"+id_ele)
                    .attr("type",'number')
                    .attr("value",10)
                    )
                  )
    return
    }  
}



function addColorTypeSelector ( id_parent, id_ele){
  // 
    if($("#typeColor"+id_ele) !== null){

      $("#typeColor"+id_ele).remove();
      $("#labelTypeColor"+id_ele).remove();
      $('#colorPicker'+id_ele).remove();
    }
if(document.getElementById('semioSelectorColor'+id_ele).value !== 'fixed'){
  $("#"+id_parent+'>div').append('<label class="text-muted h5 mt-2" for="typeColor'+id_ele+'" id="labelTypeColor'+id_ele+'">Type</label>')
                    .append($('<select>')
                    .attr('class','custom-select')
                    .attr("id","typeColor"+id_ele)
                      .append($('<option>', {text:"qualitative", value:'categorical'}))
                      .append($('<option>', {text:"quantitative", value:'number'}))
                    )
                  
  document.getElementById("typeColor"+id_ele).addEventListener("change", function(){showColors(id_ele, id_parent)});
  
}
showColors(id_ele, id_parent)
  return
      
}

function showColors(ide, idp){

  if(document.getElementById("semioSelectorColor" + ide).value === 'fixed'){
    $('#colorPicker'+ide).remove();
    showfixed(ide, idp)  
    return
  }

  if(document.getElementById("semioSelectorColor"+ ide).value !== null){
      $('#colorPicker'+ide).remove();
    }


  var colorType = document.getElementById("typeColor"+ide).value      
  if(document.getElementById("colorPicker"+ide) !== null){
    $("#colorPicker"+ide).remove();
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
      .append('<label class="text-muted h5" for="semioColorpicker'+ide+'">Choose color</label>')
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
      .attr("class","col-md-7 align-self-end")
      .append('<label class="text-muted h5">Palette</label>')
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
  //   $("#"+palettes_names[p]+id_ele).append(svgExample(list_palette[palette[p]][8],n_color)).click( function(){
  //       changePalette($(this),id_to_control);
        
  // });
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
  // 
 $("#colorPicker"+id).find("div.selected").removeClass('selected').attr('ramps');
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
      .attr("class","col-md-9")
      // .append('<label class="text-muted h5>Palettes</label>')
      .append($('<table>')
        .attr('class',"table-borderless") 
        .append($('<tbody>')           
          .append($('<tr>')
            .append($('<td>')
              .append('<label class="text-muted h5" for="diverging'+id_ele+'">Diverging</label>')
              )
            .append($('<td>')
              .append('<label class="text-muted h5" for="diverging'+id_ele+'">Extra Palettes</label>')
              )
          )
          .append($('<tr>')
            .append($('<td>')
              .attr('id',"diverging"+id_ele)
              )
              .append($('<td>')
                .attr('class',"ml-1") 
                .attr('id',"diverColor"+id_ele)
              )
            )
            .append($('<tr>')
              .append($('<td>')
                .append('<label class="text-muted h4">Sequential</label>')
                )
            )
          .append($('<tr>')
            .append($('<td>')
                .append('<label class="text-muted h5" for="multi'+id_ele+'">Multi Hue</label>')
              )
            .append($('<td>')
              .append('<label class="text-muted h5" for="single'+id_ele+'">Single Hue</label>')
              )
            )
        .append($('<tr>')
          // .append('<label class="text-muted h5>Sequential Palettes</label>')
          .append($('<td>')
            .attr('id',"multi"+id_ele)
          )
          .append($('<td>')
            .attr('class',"ml-1") 
            .attr('id',"single"+id_ele)
          )
        )
      )
        )
      )
  //other = Object.keys(paletteColorSequentialMultiHue2)
  createFrameColorsSeclector(paletteColorSequential,8,"single"+id_ele,id_ele)

  createFrameColorsSeclector(paletteColorSequentialMultiHue,8,"multi"+id_ele,id_ele)

  createFrameColorsSeclector(paletteColorDiverging,8,"diverging"+id_ele,id_ele)

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


export function showSemioParameter(featureName){
      
  

    if(document.getElementById('semioColorAdd'+featureName) !== null){
      $('#semioColorAdd'+featureName).children().remove()
    }
    if(document.getElementById('semioSizeAdd'+featureName) !== null){
      $('#semioSizeAdd'+featureName).children().remove()
    }
    if(document.getElementById('semioTextAdd'+featureName) !== null){
      $('#semioTextAdd'+featureName).children().remove()
    }
    if(document.getElementById('semioOpaAdd'+featureName) !== null){
      $('#semioOpaAdd'+featureName).children().remove()
    }
    // if(featureName ==='link'){
    // $('#semioLayerBody').append($('<div>')
    //                             .attr("class","col-md-6")
    //                             .append($('<select>')
    //                               .attr('class','custom-select')
    //                               .attr("id","semioSelectorLink")
    //                               )
    //                             );

    // var graph = ["oriente", "non_oriente"];
    // for(var p=0; p<graph.length; p++){
    // $('#semioSelectorLink').append($('<option>', {text:graph[p] })
    //                     .attr("value",graph[p])
    //                     );
                      
    //   }                 
    // } 

    var variables = getNameVariables(featureName.toLowerCase())
  

    addColorSemio(featureName,'Add'+featureName,'semioColorAdd'+featureName, variables)
    
    addSizeSemio(featureName,'Add'+featureName,'semioSizeAdd'+featureName, variables)
    if(featureName === 'Node'){
    addTextSemio(featureName,'Add'+featureName,'semioTextAdd'+featureName, variables)
    }
    addOpacitySemio(name,'Add'+featureName,'semioOpaAdd'+featureName, variables)
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
    changePalette($("#colorPickerChange").find('[value="'+style.color.palette+'"]'),"Change")
  }
  else 
  {
    $("#semioColorpickerChange").spectrum({
    color: style.color.palette
    });
  }

  addSizeRatio("semioSizeChange",'Change', layer_name.charAt(0).toUpperCase() +layer_name.slice(1))
  if (style.size.var !== 'fixed'){
    changeSelect($("#typeSizeChange").children('[value="'+style.size.cat+'"]'),"typeSizeChange")
    $("#ratioMinMaxSizeChange").attr("value",style.size.ratio)
  }
  else
  {
      $("#ratioMinMaxSizeChange").attr("value",style.size.ratio)
  }
  
  addOpaSelect("semioOpaChange",'Change')

  if (style.opa.var !== 'fixed'){
    changeSelect($("#typeOpaChange").children('[value="'+style.opa.cat+'"]'),"typeOpaChange")
    $("#ratioMaxOpaChange").attr("value",style.opa.max)
    $("#ratioMinOpaChange").attr("value",style.opa.min)
  }
  else
  {

    changeSelect($("#typeOpaChange").children('[value="'+style.opa.cat+'"]'),"typeOpaChange")
    $("#ratioMaxOpaChange").attr("value",style.opa.vmax)
  }
}

export function applyChangeStyle(name, style, layers){
  var widthVar = document.getElementById('semioSelectorSizeChange').value;
  var colorVar = document.getElementById('semioSelectorColorChange').value

  var ratio = document.getElementById('ratioMinMaxSizeChange').value;
  // var typeSize = document.getElementById('typeSizeChange').value;
  var textVar = document.getElementById('semioSelectorTextChange').value


  var opaVar = document.getElementById('semioSelectorOpaChange').value
    
     style[name].opa.var = opaVar

  if(opaVar === 'fixed'){
     style[name].opa.vmax = document.getElementById('ratioMaxOpaChange').value;
  }
  else
  {

    style[name].opa.vmax = getMinMaxColor(opaVar, name)[1]
    style[name].opa.min = document.getElementById('ratioMinOpaChange').value;
    style[name].opa.max = document.getElementById('ratioMaxOpaChange').value;
    style[name].opa.cat =  document.getElementById('typeOpaChange').value;
  }

  // sizeMM = setupMaxAndMin(widthVar, layer)
  var sizeMM = [0,0]
  var colMM = [0,0]
    if(widthVar !== 'fixed')
      {
        sizeMM = getMinMaxSize(widthVar, name)
      var  typeSize = document.getElementById('typeSizeChange').value;
      }

    if(colorVar === 'fixed')
    {
      style[name].color.palette = $("#semioColorpickerChange").spectrum('get').toHexString();
    }
    else{
      var colorType = document.getElementById('typeColorChange').value  
      style[name].color.cat = colorType

      style[name].color.palette = $("#colorPickerChange").find(".selected").attr("value");

      if(colorType==='number'){
        colMM = getMinMaxColor(colorVar, name)
      }
      else if(colorType==='categorical'){
        
        window[name+'OrderedCategory'](colorVar, style[name])
      }
      // sizeMM = setupMaxAndMin(widthVar, name)
    }     
     
      style[name].color.var = colorVar
      style[name].color.max = colMM[1]
      style[name].color.min = colMM[0]

       style[name].text = textVar
      
      // layers[name].changed()

     
      style[name].size.var = widthVar
      style[name].size.cat = typeSize
      style[name].size.ratio = ratio
      style[name].size.max = sizeMM[1]
      style[name].size.min = sizeMM[0]
      
      
      // else{
      //   if(name === 'link'){
      //   map.removeLayer(featuresLayers[name])
      //   featuresLayers[name] = new ol.layer.Vector({
      //     name:'link',
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
// refreshZindex()
  return;
}

function checkChangeSize(Styles, var_size,cat,value){
  return var_size === Styles.size.var && cat === Styles.size.cat && value === Styles.size.ratio
}
