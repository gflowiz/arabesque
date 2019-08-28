import {getNameVariables, refreshZindex} from "./control.js";
import {addNodeLayer, generateLinkLayer, getLayerFromName, changeBaseLayer, groupLinksByOD, addLegendToMap,getD3ScalersForStyle} from "./layer.js";
import { testLinkDataFilter, applyNodeDataFilter } from "./filter.js";
import 'spectrum-colorpicker/spectrum.js';
import 'spectrum-colorpicker/spectrum.css';



//PALETTE FOR SMIOLOGY
//USE OF INTERPOLAR FOR COMPUTE THE COLOR VALUE
var paletteColorCat = {
  Category10: d3.schemeCategory10,
  Accent: d3.schemeAccent,
  Dark2: d3.schemeDark2,
  Paired: d3.schemePaired,
  Pastel1: d3.schemePastel1,
  Pastel2: d3.schemePastel2,
  Set1: d3.schemeSet1,
  Set2: d3.schemeSet2,
  Set3: d3.schemeSet3
}

export const paletteColorDiverging = {
  BrBG: d3.schemeBrBG,
  PRGn: d3.schemePRGn,
  PiYG: d3.schemePiYG,
  PuOr: d3.schemePuOr,
  RdBu: d3.schemeRdBu,
  RdGy: d3.schemeRdGy,
  RdYlBu: d3.schemeRdYlBu,
  RdYlGn: d3.schemeRdYlGn,
  Spectral: d3.schemeSpectral
}


export const paletteColorSequential = {
  Blues: d3.schemeBlues,
  Greens: d3.schemeGreens,
  Greys: d3.schemeGreys,
  Oranges: d3.schemeOranges,
  Purples: d3.schemePurples,
  Reds: d3.schemeReds
}

export const paletteColorSequentialMultiHue = {
  BuGn: d3.schemeBuGn,
  BuPu: d3.schemeBuPu,
  GnBu: d3.schemeGnBu,
  OrRd: d3.schemeOrRd,
  PuBuGn: d3.schemePuBuGn,
  PuBu: d3.schemePuBu,
  PuRd: d3.schemePuRd,
  RdPu: d3.schemeRdPu,
  YlGnBu: d3.schemeYlGnBu,
  YlGn: d3.schemeYlGn,
  YlOrBr: d3.schemeYlOrBr,
  YlOrRd: d3.schemeYlOrRd
}


export const paletteColorSequentialMultiHue2 = {
  Viridis: [[],[],[],[],[],[],[],[],[],[],[],[],[]],
  Inferno: [[],[],[],[],[],[],[],[],[],[],[],[],[]],
  Magma: [[],[],[],[],[],[],[],[],[],[],[],[],[]],
  Plasma: [[],[],[],[],[],[],[],[],[],[],[],[],[]],
  Warm: [[],[],[],[],[],[],[],[],[],[],[],[],[]],
  Cool: [[],[],[],[],[],[],[],[],[],[],[],[],[]],
  CubehelixDefault: [[],[],[],[],[],[],[],[],[],[],[],[],[]],
  Rainbow: [[],[],[],[],[],[],[],[],[],[],[],[],[]],
  Sinebow: [[],[],[],[],[],[],[],[],[],[],[],[],[]],
}

export function showChangeBaseLayerParameter(map, layers, mode, layer_name, style) {

  document.getElementById("strokeColorpickerChange").value = style.stroke
  document.getElementById("fillColorpickerChange").value = style.fill
  document.getElementById("opacityLayer" + mode).value = style.opacity;

  $('#addNewLayerButtonChange').replaceWith($('#addNewLayerButtonChange').clone());
  document.getElementById('addNewLayerButtonChange').addEventListener("click", function () {
    changeBaseLayer(map, global_data.layers, "Change", layer_name)
  });
  return;
}

export function getNodeColorScaleValue(layer, scalers) {

  var colors = []
  var min = global_data.style[layer].color.min;
  var max = global_data.style[layer].color.max;
  for (var i = 0; i < 7; i++) {
    var NormalizeColor = (min + (max - min) / 7 * (7 - i) - min) / (max - min)
    colors.push([Number(max / (i + 1)).toString(), d3.color(d3["interpolate" + global_data.style[layer].color.palette](NormalizeColor)).rgb().toString()])
  }
  // 
  return colors
}

export function getNodeOpaScaleValue(layer) {
  var colors = []
  var min = global_data.style[layer].opa.min;
  var valueMax = global_data.style[layer].opa.vmax;
  var max = global_data.style[layer].opa.max;
  var color = d3.color('grey');
  for (var i = 0; i < 7; i++) {
    // var NormalizeColor = (min * (9-i)-min)/(max-min) 
    color.opacity = max - (i * (max - min) / 7)
    // 
    colors.push([Number(valueMax / (i + 1)), color.rgb().toString()])
  }
  return colors
}

export function getNodeColorCatValue(layer) {
  var colors = {}
  var list_colors = global_data.style[layer].categorialOrderedColors;
  var hasOtherCat = false;
  var index = Object.keys(global_data.style[layer].categorialOrderedColors)

  for (var i = 0; i < index.length; i++) {
    // 
    if (typeof d3.color('grey').rgb() !== typeof list_colors[index[i]]) {

      colors[index[i]] = list_colors[index[i]]
    } else {
      hasOtherCat = true;
    }
  }

  if (hasOtherCat) {
    colors['Others'] = d3.color('grey').rgb().toString()
  }

  return colors
}

function loadGeometryParameter(style) {

  style.link.geometry.type = document.getElementById("arrowtype").value
  if (document.getElementById("arrowtype").value === "CurveArrow" || document.getElementById("arrowtype").value === "CurveOneArrow") {

    style.link.geometry.place.base = Number(document.getElementById("baseCurveArrow").value)
    style.link.geometry.place.height = Number(document.getElementById("heightCurveArrow").value)
  } else if (document.getElementById("arrowtype").value === "StraightArrow") {
    style.link.geometry.place.base = null
    style.link.geometry.place.height = null
  }

  if (document.getElementById("arrowData").value === 'oriented' && document.getElementById("arrowtype").value !== "TriangleArrow" && document.getElementById("arrowtype").value !== "CurveOneArrow") {
    style.link.geometry.oriented = document.getElementById("arrowData").value
    style.link.geometry.head.width = Number(document.getElementById("widthArrow").value)
    style.link.geometry.head.height = Number(document.getElementById("heightArrow").value)
  } else {
    style.link.geometry.oriented = document.getElementById("arrowData").value
    style.link.geometry.head.width = null
    style.link.geometry.head.height = null
  }
}

export function setupStyleAndAddLayer(style, layer_name) {
  if (layer_name === 'link') {
    loadGeometryParameter(style)
  }
  
  var layer = layer_name.toLowerCase();

  if (layer === 'node') {
    var textVar = document.getElementById('semioSelectorTextAdd' + layer_name).value;
    style[layer].text = textVar;
  } else {
    loadGeometryParameter(style)
  }
  if (document.getElementById("semioOpaBaseTypeAdd" + layer_name).value === 'fixed') {
    style[layer].opa.var = 'fixed';
    style[layer].opa.vmax = Number(document.getElementById('ratioMaxOpaAdd' + layer_name).value);
  } else {
    
    var opaVar = document.getElementById('semioSelectorOpaAdd' + layer_name).value;
    style[layer].opa.var = opaVar
    style[layer].opa.vmax = getMinMaxColor(opaVar, layer)[1];
    style[layer].opa.min = document.getElementById('ratioMinOpaAdd' + layer_name).value;
    style[layer].opa.max = document.getElementById('ratioMaxOpaAdd' + layer_name).value;
    style[layer].opa.cat = document.getElementById('typeOpaAdd' + layer_name).value;
  }

  var sizeMM = [0, 0];
  var colMM = [0, 0];

  if (document.getElementById("semioSizeBaseTypeAdd" + layer_name).value !== 'fixed') {
    var widthVar = document.getElementById('semioSelectorSizeAdd' + layer_name).value;
    sizeMM = getMinMaxSize(widthVar, layer)
    var typeSize = document.getElementById('typeSizeAdd' + layer_name).value;

    style[layer].size.var = document.getElementById('semioSelectorSizeAdd' + layer_name).value;
    style[layer].size.cat = document.getElementById('typeSizeAdd' + layer_name).value;
    style[layer].size.ratio = document.getElementById('ratioMinMaxSizeAdd' + layer_name).value;
    style[layer].size.max = sizeMM[1]
    style[layer].size.min = sizeMM[0]

  } else {
    style[layer].size.var = 'fixed';
    style[layer].size.ratio = document.getElementById('ratioMinMaxSizeAdd' + layer_name).value;
    style[layer].size.max = sizeMM[1]
    style[layer].size.min = sizeMM[0]
  }

  if (document.getElementById("semioColorBaseTypeAdd" + layer_name).value === 'fixed') {
    style[layer].color.var = 'fixed';
    style[layer].color.palette = document.getElementById("semioColorpickerAdd" + layer_name).value;
  } else {
    var colorVar = document.getElementById('semioSelectorColorAdd' + layer_name).value;
    var colorType = document.getElementById('typeColorAdd' + layer_name).value
    style[layer].color.palette = $("#colorPickerAdd" + layer_name).find(".selected").attr("value");
    style[layer].color.cat = colorType
    colMM = [0, 0]
    if (colorType === 'number') {
      colMM = getMinMaxColor(colorVar, layer)
    }
    if (colorType === 'categorical') {
      window[layer + 'OrderedCategory'](colorVar, style[layer])
    }

    style[layer].color.var = document.getElementById('semioSelectorColorAdd' + layer_name).value;
    style[layer].color.inversed = document.getElementById("inversedColorPalette").checked
    if (document.getElementById("inversedColorPalette").checked) {
      style[layer].color.max = colMM[0]
      style[layer].color.min = colMM[1]
    } else {
      style[layer].color.max = colMM[1]
      style[layer].color.min = colMM[0]
    }
  }
  applyNewStyle(layer)
}

function getMinMaxColor(colorVar, layer) {


  if (layer === 'node') {
    var dataArray = Object.keys(data.hashedStructureData).map(function (item) {
      return Number(data.hashedStructureData[item].properties[colorVar])
    })
  } else if (layer === 'link') {

    var OD = groupLinksByOD(data.links, [...Array(data.links.length).keys()], global_data.ids.linkID[0], global_data.ids.linkID[1])
    var idOD = Object.keys(OD)

    var test = idOD.map(function (item) {
      return Object.keys(OD[item]).map(function (item2) {
        if (global_data.files.aggr === "sum") {
          return OD[item][item2].reduce(function (accumulateur, valeurCourante) {
            return accumulateur + Number(data.links[valeurCourante][colorVar]);
          }, 0);
        } else {
          Math.max(...OD[item][item2].map(function (value) {
            return Number(data.links[value][colorVar]);
          }))

        }

      })
    })

    var dataArray = test.flat()
  }
  
  return [Math.min(...dataArray), Math.max(...dataArray)]
}

function getMinMaxSize(sizeVar, layer) {


  if (layer === 'node') {
    var dataArray = Object.keys(data.hashedStructureData).map(function (item) {
      return Number(data.hashedStructureData[item].properties[sizeVar])
    })
  } else if (layer === 'link') {

    var OD = groupLinksByOD(data.links, [...Array(data.links.length).keys()], global_data.ids.linkID[0], global_data.ids.linkID[1])
    var idOD = Object.keys(OD)

    var test = idOD.map(function (item) {
      return Object.keys(OD[item]).map(function (item2) {
        if (global_data.files.aggr === "sum") {
          return OD[item][item2].reduce(function (accumulateur, valeurCourante) {
            return accumulateur + Number(data.links[valeurCourante][sizeVar]);
          }, 0);
        } else {
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
  return [Math.min(...dataArray), Math.max(...dataArray)]
}

export function applyNewStyle(name_layer) {
  var lindex = 0;
  var nindex = 0;
  var id_links = testLinkDataFilter(global_data.filter.link, data)

  var selected_nodes = applyNodeDataFilter(data.hashedStructureData)
  var t0 = performance.now();


  if (getLayerFromName(map, 'node') !== null) {
    nindex = getLayerFromName(map, 'node').getZIndex()
  }


  if (getLayerFromName(map, 'link') !== null) {
    lindex = getLayerFromName(map, 'link').getZIndex()
  }


  if (name_layer === 'node') {
    if (getLayerFromName(map, 'link') !== null) {

      // map.removeLayer(getLayerFromName(map, 'link'))

      generateLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1], id_links, selected_nodes)
      getLayerFromName(map, 'link').setZIndex(lindex)
      // global_data.layers.features['node'].setZIndex(nindex)
    }
    // map.removeLayer(getLayerFromName(map, 'node'))
    addNodeLayer(map, data.links, data.hashedStructureData, global_data.style, id_links, selected_nodes)
    getLayerFromName(map, 'node').setZIndex(nindex)
  } else if (name_layer === 'link') {

    // index = global_data.layers.features['link'].getZIndex()
    // map.removeLayer(getLayerFromName(map, 'link'))
    generateLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1], id_links, selected_nodes)
    getLayerFromName(map, 'link').setZIndex(lindex)
    // global_data.layers.features['node'].setZIndex(nindex)

  }
  // refreshZindex()
  var t1 = performance.now();

  var i = 0
  $('#accordionLayerControl').find('li').each(function () {
    var elem = $(this).attr('value')

    if (getLayerFromName(map, elem) !== null) {
      getLayerFromName(map, elem).setZIndex(-i)
    }
    i = i + 1
  })

  addLegendToMap()
}

export function nodeOrderedCategory(var_name, style) {

  style.categorialOrderedColors = {};
  let counts = {}
  // 
  Object.keys(data.hashedStructureData).map(function (item) {
    return data.hashedStructureData[item].properties[var_name]
  }).forEach(el => counts[el] = 1 + (counts[el] || 0))
  var sortedKeys = Object.keys(counts).sort(function (a, b) {
    return counts[a] - counts[b]
  })
  var lenPalette = paletteColorCat[style.color.palette].length;
  for (var p = 0; p < sortedKeys.length; p++) {
    if (p < lenPalette) {
      style.categorialOrderedColors[sortedKeys[p]] = paletteColorCat[style.color.palette][p]
    } else {
      style.categorialOrderedColors[sortedKeys[p]] = d3.color('grey').rgb()
    }
  }
}

export function linkOrderedCategory(var_name, style) {
  style.categorialOrderedColors = {};
  let counts = {}
  data.links.map(function (item) {
    return item[var_name]
  }).forEach(el => counts[el] = 1 + (counts[el] || 0))
  var sortedKeys = Object.keys(counts).sort(function (a, b) {
    return counts[a] - counts[b]
  })
  var lenPalette = paletteColorCat[style.color.palette].length;
  for (var p = 0; p < sortedKeys.length; p++) {
    if (p < lenPalette) {
      style.categorialOrderedColors[sortedKeys[p]] = paletteColorCat[style.color.palette][p]
    } else {
      style.categorialOrderedColors[sortedKeys[p]] = d3.color('grey').rgb()
    }
  }
}


window.linkOrderedCategory = linkOrderedCategory;
window.nodeOrderedCategory = nodeOrderedCategory;

export function setupMaxAndMin(var_name, layer_name) {

  if (layer_name === 'node') {
    var dataArray = Object.keys(data.hashedStructureData).map(function (item) {
      return Number(data.hashedStructureData[item].properties[var_name])
    })
  } else if (layer_name === 'link') {
    var dataArray = data.links.map(function (item) {
      return Number(item[var_name])
    })
  }
  // 
  return [Math.min(...dataArray), Math.max(...dataArray)]
}


function addColorSemio(name, id_selector, id_parent, variables) {

  
  if ($("#semioSelectorColor" + id_selector) !== null) {
    $("#semioColor" + id_selector).children().remove()
    $("#typeColor" + id_selector).remove();
    $("#labelTypeColor" + id_selector).remove();
    $('#colorPicker' + id_selector).children().remove();
  }
  
  if (document.getElementById("semioColorBaseType" + id_selector).value === "varied") {

    

    $("#semioColor" + id_selector).append('<label class="text-muted h5" for="semioSelectorColor"' + id_selector + '>Variable</label>')
      .append($('<select>')
        .attr('class', 'custom-select')
        .attr("id", "semioSelectorColor" + id_selector)
        // .append('<option selected disable>Choose...</option>')
      );

    for (var p = 0; p < variables.length; p++) {
      $('#semioSelectorColor' + id_selector).append($('<option>', {
          text: variables[p]
        })
        .attr("value", variables[p])
      );
    }
    document.getElementById("semioSelectorColor" + id_selector).addEventListener("change", function () {
      addColorTypeSelector(id_parent, id_selector)
    });
    addColorTypeSelector(id_parent, id_selector)
  } else {
    showfixed(id_selector, id_parent)
  }
}

function addTextSemio(name, id_selector, id_parent, variables) {
  
  $("#" + id_parent).append($('<div>')
    .attr("class", "col-md-12")
    .append('<label class="text-muted h5">Variable</label>')
    .append($('<select>')
      .attr('class', 'custom-select')
      .attr("id", "semioSelectorText" + id_selector)
      .append('<option selected disable>Choose...</option>')

      //.attr("onchange",'addSemioColorType("'+name+','+id_selector+'")')
    )
  );

  for (var p = 0; p < variables.length; p++) {

    $('#semioSelectorText' + id_selector).append($('<option>', {
        text: variables[p]
      })
      .attr("value", variables[p])
    );

  }

}

function addSizeSemio(name, id_selector, id_parent, variables) {

  if ($("#semioSelectorSize" + id_selector) !== null) {
    $("#semioSelectorSize" + id_selector).parent().remove()
    $('#semioSizeRatio' + id_selector).remove();
    $('#semioSizeRatioCat' + id_selector).remove();
    // $("#typeColor"+id_selector).remove();
    $("#labelTypeSize" + id_selector).remove();
    $('#typeSize' + id_selector).remove();
  }

  if (document.getElementById("semioSizeBaseType" + id_selector).value === "varied") {


    $("#" + id_parent).append($('<div>')
      .attr("class", "col-md-2")
      .append('<label class="text-muted h5">Variable</label>')
      .append($('<select>')
        .attr('class', 'custom-select')
        .attr("id", "semioSelectorSize" + id_selector)
      )
    );

    for (var p = 0; p < variables.length; p++) {

      $('#semioSelectorSize' + id_selector).append($('<option>', {
          text: variables[p]
        })
        .attr("value", variables[p])
      );

    }

    document.getElementById("semioSelectorSize" + id_selector).addEventListener("change", function () {
      addSizeRatio(id_parent, id_selector, name)
    });
    addSizeRatio(id_parent, id_selector, name)
    return
  }
  addSizeRatio(id_parent, id_selector, name)


}

//TODO: REAL OPACITY
function addOpacitySemio(name, id_selector, id_parent, variables) {
  // 

  if ($("#semioSelectorOpa" + id_selector) !== null) {
    $("#semioSelectorOpa" + id_selector).parent().remove()
    $('#semioOpaMinRatio' + id_selector).remove();
    $('#semioOpaMaxRatio' + id_selector).remove();
    $('#semioOpaRatioCat' + id_selector).remove();
  }

  if (document.getElementById("semioOpaBaseType" + id_selector).value === "varied") {


    $("#" + id_parent).append($('<div>')
      .attr("class", "col-md-2")
      .append('<label class="text-muted h5">Variable</label>')
      .append($('<select>')
        .attr('class', 'custom-select')
        .attr("id", "semioSelectorOpa" + id_selector)
      )
    );

    for (var p = 0; p < variables.length; p++) {

      $('#semioSelectorOpa' + id_selector).append($('<option>', {
          text: variables[p]
        })
        .attr("value", variables[p])
      );

    }

    document.getElementById("semioSelectorOpa" + id_selector).addEventListener("change", function () {
      addOpaSelect(id_parent, id_selector)
    });
    addOpaSelect(id_parent, id_selector)
    return
  }
  addOpaSelect(id_parent, id_selector)


}

function addOpaSelect(id_parent, id_ele) {
  if (document.getElementById("semioSelectorOpa" + id_ele) !== null) {
    $('#semioOpaMinRatio' + id_ele).remove();
    $('#semioOpaMaxRatio' + id_ele).remove();
    $('#semioOpaRatioCat' + id_ele).remove();
  }
  if (document.getElementById("semioOpaBaseType" + id_ele).value === "varied") {
    $("#" + id_parent).append($('<div>')
      .attr("id", "semioOpaRatioCat" + id_ele)
      .attr("class", "col-md-3")

      .append('<label class="text-muted h5">Scale</label>')
      .append($('<select>')
        .attr('class', 'custom-select')
        .attr("id", "typeOpa" + id_ele)
        // .attr("onchange",'showRangeSize("'+id_ele+'","'+id_parent+'")')
        .append($('<option>', {
          text: "Linear",
          value: 'Linear'
        }))
        .append($('<option>', {
          text: "Square",
          value: 'Pow'
        }))
        .append($('<option>', {
          text: "SquareRoot",
          value: 'Sqrt'
        }))
        .append($('<option>', {
          text: "Logarithmic",
          value: 'Log'
        }))
      )
    )


    $("#" + id_parent).append($('<div>')
      .attr("id", "semioOpaMinRatio" + id_ele)
      .attr("class", "col-md-2")
      .append('<label class="text-muted h5">Min</label>')
      .append($('<input>')
        .attr('class', 'form-control')
        .attr("id", "ratioMinOpa" + id_ele)
        .attr("min", 0.00)
        .attr("step", 0.05)
        .attr("max", 1.00)
        .attr("type", 'number')
        .attr("value", 0.25)
      )
    )


    $("#" + id_parent).append($('<div>')
      .attr("id", "semioOpaMaxRatio" + id_ele)
      .attr("class", "col-md-2")
      .append('<label class="text-muted h5">Max</label>')
      .append($('<input>')
        .attr('class', 'form-control')
        .attr("id", "ratioMaxOpa" + id_ele)
        .attr("min", 0.00)
        .attr("step", 0.05)
        .attr("max", 1.00)
        .attr("type", 'number')
        .attr("value", 0.85)
      ))

    document.getElementById("ratioMaxOpa" + id_ele).addEventListener("change", function () {
      if (Number(document.getElementById("ratioMaxOpa" + id_ele).valueAsNumber) > 1) {
        document.getElementById("ratioMaxOpa" + id_ele).value = 1
      }
      if (Number(document.getElementById("ratioMaxOpa" + id_ele).valueAsNumber) < 0) {
        document.getElementById("ratioMaxOpa" + id_ele).value = 0
      }
    });
    document.getElementById("ratioMinOpa" + id_ele).addEventListener("change", function () {
      if (Number(document.getElementById("ratioMinOpa" + id_ele).valueAsNumber) < 0) {
        document.getElementById("ratioMinOpa" + id_ele).value = 0
      }
      if (Number(document.getElementById("ratioMinOpa" + id_ele).valueAsNumber) > 1) {
        document.getElementById("ratioMinOpa" + id_ele).value = 1
      }
    });

    return
  } else {
    $("#" + id_parent).append($('<div>')
      .attr("id", "semioOpaMaxRatio" + id_ele)
      .attr("class", "col-md-3")
      .append('<label class="text-muted h5">Value</label>')
      .append($('<input>')
        .attr('class', 'form-control')
        .attr("id", "ratioMaxOpa" + id_ele)
        .attr("min", 0.00)
        .attr("step", 0.05)
        .attr("max", 1.00)
        .attr("type", 'number')
        .attr("value", 0.85)
      ))
    document.getElementById("ratioMaxOpa" + id_ele).addEventListener("change", function () {
      if (Number(document.getElementById("ratioMaxOpa" + id_ele).valueAsNumber) > 1) {
        document.getElementById("ratioMaxOpa" + id_ele).value = 1
      }
      if (Number(document.getElementById("ratioMaxOpa" + id_ele).valueAsNumber) < 0) {
        document.getElementById("ratioMaxOpa" + id_ele).value = 0
      }
    })


  }
}


function addSizeRatio(id_parent, id_ele, layer) {
  if (document.getElementById("semioSelectorSize" + id_ele) !== null) {
    // $('#semioSelectorSize'+id_ele).remove();
    $('#semioSizeRatio' + id_ele).remove();
    $('#semioSizeRatioCat' + id_ele).remove();
  }

  if (document.getElementById('semioSizeBaseType' + id_ele).value === 'varied') {
    if (layer === 'link') {
      $("#" + id_parent).append($('<div>')
        .attr("id", "semioSizeRatioCat" + id_ele)
        .attr("class", "col-md-4")
        .append('<label class="text-muted h5">Scale</label>')
        .append($('<select>')
          .attr('class', 'custom-select')
          .attr("id", "typeSize" + id_ele)
          // .attr("onchange",'showRangeSize("'+id_ele+'","'+id_parent+'")')
          .append($('<option>', {
            text: "Linear",
            value: 'Linear'
          }))
          .append($('<option>', {
            text: "Square",
            value: 'Pow'
          }))
          .append($('<option>', {
            text: "SquareRoot",
            value: 'Sqrt'
          }))
          .append($('<option>', {
            text: "Logarithmic",
            value: 'Log'
          }))
        )
      )
    } else {
      $("#" + id_parent).append($('<div>')
        .attr("id", "semioSizeRatioCat" + id_ele)
        .attr("class", "col-md-4")
        .append('<label class="text-muted h5">Scale</label>')
        .append($('<select>')
          .attr('class', 'custom-select')
          .attr("id", "typeSize" + id_ele)
          // .attr("onchange",'showRangeSize("'+id_ele+'","'+id_parent+'")')
          .append($('<option>', {
            text: "Square",
            value: 'Pow'
          }))
          .append($('<option>', {
            text: "SquareRoot",
            value: 'Sqrt'
          }))
          .append($('<option>', {
            text: "Logarithmic",
            value: 'Log'
          }))
          // .append($('<option>', {text:"Square", value:'Sqrt'}))          
        )
      )
    }
    var text = '"it represent the max width in pixel of the visualisation "'
    $("#" + id_parent).append($('<div>')
      .attr("id", "semioSizeRatio" + id_ele)
      .attr("class", "col-md-4")
      .append('<label class="text-muted h5">Ratio  <img class="small-icon" src="assets/svg/si-glyph-circle-info.svg" data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content=' + text + '/></label>')
      .append($('<input>')
        .attr('class', 'form-control')
        .attr("id", "ratioMinMaxSize" + id_ele)
        .attr("type", 'number')
        .attr("value", 100)
      )
    )
    $('[data-toggle="popover"]').popover()
    return
  } else {
    var text = '"It is the fixed width in pixel for each links"'
    $("#" + id_parent).append($('<div>')
      .attr("id", "semioSizeRatio" + id_ele)
      .attr("class", "col-md-4")
      .append('<label class="text-muted h5">Width  <img class="small-icon" src="assets/svg/si-glyph-circle-info.svg" data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content=' + text + '/></label>')
      .append($('<input>')
        .attr('class', 'form-control')
        .attr("id", "ratioMinMaxSize" + id_ele)
        .attr("type", 'number')
        .attr("value", 10)
      )
    )
    return
  }
}


function addColorTypeSelector(id_parent, id_ele) {

  
  if ($("#typeColor" + id_ele) !== null) {

    $("#inversedColorPalette").parent().remove();
    $("#typeColor" + id_ele).remove();
    $("#labelTypeColor" + id_ele).remove();
    $('#colorPicker' + id_ele).children().remove();
  }
  
  if (document.getElementById('semioSelectorColor' + id_ele).value !== 'fixed') {
    $("#" + id_parent).append('<label class="text-muted h5 mt-2" for="typeColor' + id_ele + '" id="labelTypeColor' + id_ele + '">Type</label>')
      .append($('<select>')
        .attr('class', 'custom-select')
        .attr("id", "typeColor" + id_ele)
        .append($('<option>', {
          text: "quantitative",
          value: 'number'
        }))
        .append($('<option>', {
          text: "qualitative",
          value: 'categorical'
        }))
      )

    document.getElementById("typeColor" + id_ele).addEventListener("change", function () {
      showColors(id_ele, id_parent)
    });

  }
  showColors(id_ele, id_parent)
  return

}


function showColors(ide, idp) {

  
  
  if (document.getElementById("semioSelectorColor" + ide).value === 'fixed') {
    $('#colorPicker' + ide).children().remove();
    showfixed(ide, idp)
    return
  }

  if (document.getElementById("semioSelectorColor" + ide).value !== null) {
    $('#colorPicker' + ide).children().remove();
  }


  var colorType = document.getElementById("typeColor" + ide).value
  if (document.getElementById("colorPicker" + ide) !== null) {
    $("#colorPicker" + ide).children().remove();
  }
  if (colorType === "categorical") {
    showPalette(ide, idp)
  } else if (colorType === "number") {
    showGRadient(ide, idp)
  }


}


function showfixed(ide, idp) {
  
  var underId = "colorPicker" + ide
  $("#" + underId)
    .append('<label class="text-muted h5" for="semioColorpicker' + ide + '">Choose color</label>')
    .append('<input type="color" class="form-control col-md-4" id="semioColorpicker' + ide + '" onchange="clickColor(0, -1, -1, 5)" value="#ff0000" style="width:85%;">')


}


function showPalette(id_ele, id_parent) {
  var chosenPalette = Object.keys(paletteColorCat)[0]
  var underId = "colorPicker" + id_ele
  $("#" + underId)
    .append('<label class="text-muted h5">Palette</label>')
    .append($('<div>')
      .attr('class', "row")
    )

  var palettes_names = Object.keys(paletteColorCat)
  var add = true;
  for (var p = 0; p < palettes_names.length; p++) {

    $("#" + underId + ">div").append($('<div>')
      .attr('id', palettes_names[p] + id_ele)
      .attr('value', palettes_names[p])
    );
    if (chosenPalette === palettes_names[p]) {
      $("#" + palettes_names[p] + id_ele).attr('class', "ramps selected");
      add = false;
      chosenPalette = palettes_names[p];
    } else {
      $("#" + palettes_names[p] + id_ele).attr("class", "ramps")
    }
    var svg = '<svg width="15" height="120">';
    for (var n = 0; n < 8; n++) {
      svg += '<rect fill="' + d3.rgb(paletteColorCat[palettes_names[p]][n]) + '" width="15" height="15" y="' + n * 15 + '"></rect>'
    }
    svg += '</svg>';
    $("#" + palettes_names[p] + id_ele).append(svg).click(function () {
      changePalette($(this), id_ele);

    });
  }
}

export function generatePaletteMultiHue2() {
  var X = [0, 1.5, 3, 4.5, 5.5, 7, 8.5, 10]
  var keys = Object.keys(paletteColorSequentialMultiHue2)
  for (var p = 0; p < X.length; p++) {
    for (var n = 0; n < keys.length; n++) {
      paletteColorSequentialMultiHue2[keys[n]][8].push(d3["interpolate" + keys[n]](X[p] * 0.1))
    }
  }
}

function removeSelected(id) {
  $("#" + id).find(":selected").prop('selected', false);
}

export function changeSelect(element, id) {
  removeSelected(id);
  element.prop('selected', true);
}

function removeColorSelected(id) {
  // 
  $("#colorPicker" + id).find("div.selected").removeClass('selected').attr('ramps');
}

function changePalette(element, id) {

  if (!element.hasClass('selected')) {
    removeColorSelected(id)
    element.attr('class', 'ramps selected')
    var chosenPalette = element.attr("value")
  }

}

function showGRadient(id_ele, id_parent) {
  if ($("#inversedColorPalette") !== null) {
    $("#inversedColorPalette").parent().remove();
  }
  var chosenPalette = Object.keys(paletteColorDiverging)[0]

  $("#semioColor" + id_ele).append('<div class="form-check mt-2">' +
    '<input class="form-check-input position-static" type="checkbox" id="inversedColorPalette">' +
    '<label class="form-check-label text-muted h5" for="inversedColorPalette"> Inverse</label>' +
    '</div>'
  )
  $("#colorPicker" + id_ele)
    // .append('<label class="text-muted h5>Palettes</label>')
    .append($('<table>')
      .attr('class', "table-borderless")
      .append($('<tbody>')
        .append($('<tr>')
          .append($('<td>')
            .append('<label class="text-muted h5" for="diverging' + id_ele + '">Diverging</label>')
          )
          .append($('<td>')
            .append('<label class="text-muted h5" for="diverging' + id_ele + '">Extra Palettes</label>')
          )
        )
        .append($('<tr>')
          .append($('<td>')
            .attr('id', "diverging" + id_ele)
          )
          .append($('<td>')
            .attr('class', "ml-1")
            .attr('id', "diverColor" + id_ele)
          )
        )
        .append($('<tr>')
          .append($('<td>')
            .append('<label class="text-muted h4">Sequential</label>')
          )
        )
        .append($('<tr>')
          .append($('<td>')
            .append('<label class="text-muted h5" for="multi' + id_ele + '">Multi Hue</label>')
          )
          .append($('<td>')
            .append('<label class="text-muted h5" for="single' + id_ele + '">Single Hue</label>')
          )
        )
        .append($('<tr>')
          // .append('<label class="text-muted h5>Sequential Palettes</label>')
          .append($('<td>')
            .attr('id', "multi" + id_ele)
          )
          .append($('<td>')
            .attr('class', "ml-1")
            .attr('id', "single" + id_ele)
          )
        )

      )
    )
  //other = Object.keys(paletteColorSequentialMultiHue2)
  createFrameColorsSeclector(paletteColorSequential, 8, "single" + id_ele, id_ele)

  createFrameColorsSeclector(paletteColorSequentialMultiHue, 8, "multi" + id_ele, id_ele)

  createFrameColorsSeclector(paletteColorDiverging, 8, "diverging" + id_ele, id_ele)

  createFrameColorsSeclector(paletteColorSequentialMultiHue2, 8, "diverColor" + id_ele, id_ele)
}

function createFrameColorsSeclector(list_palette, n_color, id_div, id_to_control) {

  var palette = Object.keys(list_palette)
  for (var p = 0; p < palette.length; p++) {
    $('#' + id_div).append($('<div>')
      .attr('id', palette[p] + id_to_control)
      .attr('value', palette[p])
    );
    if (chosenPalette === palette[p]) {
      $("#" + palette[p] + id_to_control).attr('class', "ramps selected");
      var chosenPalette = palette[p];
    } else {
      $("#" + palette[p] + id_to_control).attr("class", "ramps")
    }


    $("#" + palette[p] + id_to_control).append(svgExample(list_palette[palette[p]][8], n_color)).click(function () {
      changePalette($(this), id_to_control);

    });
  }
}

function svgExample(listColor, n_color) {
  var svg = '<svg width="15" height="' + 15 * n_color + '">';
  for (var n = 0; n < n_color; n++) {
    svg += '<rect fill="' + d3.rgb(listColor[n]) + '" width="15" height="15" y="' + n * 15 + '"></rect>'
  }
  svg += '</svg>';

  return svg;
}


export function showSemioParameter(featureName) {

  if (document.getElementById('semioTextAdd' + featureName) !== null) {
    $('#semioTextAdd' + featureName).children().remove()
  }

  var variables = getNameVariables(featureName.toLowerCase())


  $('#semioColorBaseTypeAdd' + featureName).replaceWith($('#semioColorBaseTypeAdd' + featureName).clone());
  document.getElementById('semioColorBaseTypeAdd' + featureName).addEventListener('change', function () {
    addColorSemio(featureName, 'Add' + featureName, 'semioColorAdd' + featureName, variables)
  })
  addColorSemio(featureName, 'Add' + featureName, 'semioColorAdd' + featureName, variables)
  $('#semioSizeBaseTypeAdd' + featureName).replaceWith($('#semioSizeBaseTypeAdd' + featureName).clone());
  document.getElementById('semioSizeBaseTypeAdd' + featureName).addEventListener('change', function () {
    addSizeSemio(featureName, 'Add' + featureName, 'semioSizeAdd' + featureName, variables)
  })
  addSizeSemio(featureName, 'Add' + featureName, 'semioSizeAdd' + featureName, variables)



  $('#semioOpaBaseTypeAdd' + featureName).replaceWith($('#semioOpaBaseTypeAdd' + featureName).clone());
  document.getElementById('semioOpaBaseTypeAdd' + featureName).addEventListener('change', function () {
    addOpacitySemio(name, 'Add' + featureName, 'semioOpaAdd' + featureName, variables)

  })
  addOpacitySemio(name, 'Add' + featureName, 'semioOpaAdd' + featureName, variables)


  if (featureName === 'node') {
    addTextSemio(featureName, 'Add' + featureName, 'semioTextAdd' + featureName, variables)
  }
}


export function changeSemioParameter(name, style) {
  
  if (document.getElementById('semioTextChange' + name) !== null) {
    $('#semioTextChange' + name).children().remove()
  }

  var variables = getNameVariables(name)

  $('#changeStyleButton' + name).replaceWith($('#changeStyleButton' + name).clone());
  document.getElementById("changeStyleButton" + name).addEventListener("click", function () {
    applyChangeStyle(name, style, global_data.layers.features)
  });

  $('#semioColorBaseTypeChange' + name).replaceWith($('#semioColorBaseTypeChange' + name).clone());
  document.getElementById('semioColorBaseTypeChange' + name).addEventListener('change', function () {
    addColorSemio(name, 'Change' + name, 'semioColorChange' + name, variables)
  })

  $('#semioSizeBaseTypeChange' + name).replaceWith($('#semioSizeBaseTypeChange' + name).clone());
  document.getElementById('semioSizeBaseTypeChange' + name).addEventListener('change', function () {
    addSizeSemio(name, 'Change' + name, 'semioSizeChange' + name, variables)
  })

  $('#semioOpaBaseTypeChange' + name).replaceWith($('#semioOpaBaseTypeChange' + name).clone());
  document.getElementById('semioOpaBaseTypeChange' + name).addEventListener('change', function () {
    addOpacitySemio(name, 'Change' + name, 'semioOpaChange' + name, variables)
  })

  if (name === 'node') {
    addTextSemio(name, 'Change' + name, 'semioTextChange' + name, variables)
  }

  loadStyleToModify(name, style[name], variables)
}


//TODO
function loadStyleToModify(layer_name, style, variables) {

  
  if (layer_name === 'node') {
    changeSelect($("#semioSelectorTextChange" + layer_name).children('[value="' + style.text + '"]'), "semioSelectorTextChange" + layer_name)
  }

  if (style.color.var !== 'fixed') {
    changeSelect($("#semioColorBaseTypeChange" + layer_name).children('[value="varied"]'), "semioColorBaseTypeChange" + layer_name)
    addColorSemio(layer_name, 'Change' + layer_name, 'semioColorChange' + layer_name, variables)
    changeSelect($("#semioSelectorColorChange" + layer_name).children('[value="' + style.color.var+'"]'), "semioSelectorColorChange" + layer_name)
    addColorTypeSelector("semioColorChange" + layer_name, 'Change' + layer_name)
    changeSelect($("#typeColorChange" + layer_name).children('[value="' + style.color.cat + '"]'), "typeColorChange" + layer_name)
    showColors("Change" + layer_name, 'semioColorChange' + layer_name)
    changePalette($("#colorPickerChange" + layer_name).find('[value="' + style.color.palette + '"]'), "Change" + layer_name)
    if (style.inversed) {
      document.getElementById("inversedColorPalette").checked = true
    } else {
      document.getElementById("inversedColorPalette").checked = false
    }
  } else {
    changeSelect($("#semioColorBaseTypeChange" + layer_name).children('[value="fixed"]'), "semioColorBaseTypeChange" + layer_name)
    addColorSemio(layer_name, 'Change' + layer_name, 'semioColorChange' + layer_name, variables)
    document.getElementById("semioColorpickerChange" + layer_name).value = style.color.palette

  }


  if (style.size.var !== 'fixed') {
    changeSelect($("#semioSizeBaseTypeChange" + layer_name).children('[value="varied"]'), "semioSizeBaseTypeChange" + layer_name)
    addSizeSemio(layer_name, 'Change' + layer_name, 'semioSizeChange' + layer_name, variables)
    changeSelect($("#semioSelectorSizeChange" + layer_name).children('[value="' + style.size.var+'"]'), "semioSelectorSizeChange" + layer_name)
    addSizeRatio("semioSizeChange" + layer_name, 'Change' + layer_name, layer_name.charAt(0).toUpperCase() + layer_name.slice(1))
    changeSelect($("#typeSizeChange" + layer_name).children('[value="' + style.size.cat + '"]'), "typeSizeChange" + layer_name)
    $("#ratioMinMaxSizeChange" + layer_name).attr("value", style.size.ratio)
  } else {
    changeSelect($("#semioColorBaseTypeChange" + layer_name).children('[value="fixed"]'), "semioColorBaseTypeChange" + layer_name)
    addSizeSemio(layer_name, 'Change' + layer_name, 'semioSizeChange' + layer_name, variables)
    $("#ratioMinMaxSizeChange" + layer_name).attr("value", style.size.ratio)

  }

  if (style.opa.var !== 'fixed') {
    changeSelect($("#semioOpaBaseTypeChange" + layer_name).children('[value="fixed"]'), "semioOpaBaseTypeChange" + layer_name)
    addOpacitySemio(layer_name, 'Change' + layer_name, 'semioOpaChange' + layer_name, variables)
    changeSelect($("#typeOpaChange" + layer_name).children('[value="' + style.opa.cat + '"]'), "typeOpaChange" + layer_name)
    $("#ratioMaxOpaChange" + layer_name).attr("value", style.opa.max)
    $("#ratioMinOpaChange" + layer_name).attr("value", style.opa.min)
  } else {
    changeSelect($("#semioOpaBaseTypeChange" + layer_name).children('[value="fixed"]'), "semioOpaBaseTypeChange" + layer_name)
    addOpacitySemio(layer_name, 'Change' + layer_name, 'semioOpaChange' + layer_name, variables)
    $("#ratioMaxOpaChange" + layer_name).attr("value", style.opa.vmax)
  }
}

export function changeArrowGeometryAndReloadMap(style){

  style.link.geometry.type = document.getElementById("arrowtypeChange").value
  if (document.getElementById("arrowtypeChange").value === "CurveArrow" || document.getElementById("arrowtypeChange").value === "CurveOneArrow") {

    style.link.geometry.place.base = Number(document.getElementById("baseCurveArrowChange").value)
    style.link.geometry.place.height = Number(document.getElementById("heightCurveArrowChange").value)
  } else if (document.getElementById("arrowtypeChange").value === "StraightArrow") {
    style.link.geometry.place.base = null
    style.link.geometry.place.height = null
  }

  if (document.getElementById("arrowDataChange").value === 'oriented' && document.getElementById("arrowtypeChange").value !== "TriangleArrow" && document.getElementById("arrowtypeChange").value !== "CurveOneArrow") {
    style.link.geometry.oriented = document.getElementById("arrowDataChange").value
    style.link.geometry.head.width = Number(document.getElementById("widthArrowChange").value)
    style.link.geometry.head.height = Number(document.getElementById("heightArrowChange").value)
  } else {
    style.link.geometry.oriented = document.getElementById("arrowDataChange").value
    style.link.geometry.head.width = null
    style.link.geometry.head.height = null
  }

  applyNewStyle("link")
}

export function applyChangeStyle(layer_name, style, layers) {


  var layer = layer_name.toLowerCase();

  if (layer === 'node') {
    var textVar = document.getElementById('semioSelectorTextChange' + layer).value;
    style[layer].text = textVar;
  }
  if (document.getElementById("semioOpaBaseTypeChange" + layer).value === 'fixed') {
    style[layer].opa.var = 'fixed';
    style[layer].opa.vmax = Number(document.getElementById('ratioMaxOpaChange' + layer).value);
  } else {
    var opaVar = document.getElementById('semioSelectorOpaChange' + layer).value;
    style[layer].opa.var = opaVar
    style[layer].opa.vmax = getMinMaxColor(opaVar, layer)[1];
    style[layer].opa.min = document.getElementById('ratioMinOpaChange' + layer).value;
    style[layer].opa.max = document.getElementById('ratioMaxOpaChange' + layer).value;
    style[layer].opa.cat = document.getElementById('typeOpaChange' + layer).value;
  }

  // sizeMM = setupMaxAndMin(widthVar, layer)
  var sizeMM = [0, 0];
  var colMM = [0, 0];

  if (document.getElementById("semioSizeBaseTypeChange" + layer).value !== 'fixed') {
    var widthVar = document.getElementById('semioSelectorSizeChange' + layer).value;
    sizeMM = getMinMaxSize(widthVar, layer)
    var typeSize = document.getElementById('typeSizeChange' + layer).value;
    style[layer].size.var = document.getElementById('semioSelectorSizeChange' + layer).value;
    style[layer].size.cat = document.getElementById('typeSizeChange' + layer).value;
    style[layer].size.ratio = document.getElementById('ratioMinMaxSizeChange' + layer).value;
    style[layer].size.max = sizeMM[1]
    style[layer].size.min = sizeMM[0]

  } else {
    style[layer].size.var = 'fixed';
    style[layer].size.ratio = document.getElementById('ratioMinMaxSizeChange' + layer).value;
    style[layer].size.max = sizeMM[1]
    style[layer].size.min = sizeMM[0]
  }
  if (document.getElementById("semioColorBaseTypeChange" + layer).value === 'fixed') {
    style[layer].color.var = 'fixed';
    style[layer].color.palette = document.getElementById("semioColorpickerChange" + layer).value;
  } else {
    var colorVar = document.getElementById('semioSelectorColorChange' + layer).value;
    var colorType = document.getElementById('typeColorChange' + layer).value
    style[layer].color.palette = $("#colorPickerChange" + layer).find(".selected").attr("value");
    style[layer].color.cat = colorType
    colMM = [0, 0]
    if (colorType === 'number') {
      colMM = getMinMaxColor(colorVar, layer)
    }
    if (colorType === 'categorical') {
      window[layer + 'OrderedCategory'](colorVar, style[layer])
    }

    style[layer].color.var = document.getElementById('semioSelectorColorChange' + layer).value;
    if (document.getElementById("inversedColorPalette").checked) {
      style[layer].color.max = colMM[0]
      style[layer].color.min = colMM[1]
    } else {
      style[layer].color.max = colMM[1]
      style[layer].color.min = colMM[0]
    }
  }
  applyNewStyle(layer)
  return;
}

function checkChangeSize(Styles, var_size, cat, value) {
  return var_size === Styles.size.var && cat === Styles.size.cat && value === Styles.size.ratio
}

