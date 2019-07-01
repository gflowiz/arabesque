import {addLayerGestionMenu,addFLayerGestionMenu,removeLayer, addLayerGestionOSMMenu} from "./control.js"
import {simpleColoredStyle, styleLinkPoly, styleNodeCircle, styleUnselectedNodeCircle, getFeatureStyle, getLinkFeatureStyle} from "./style.js"
import {applyNodeDataFilter, applyLinkDataFilter, getAllNodesToShow, testLinkDataFilter} from "./filter.js"
import {drawArrow} from "./geometry.js"
import {getNodeColorScaleValue, getNodeColorCatValue, getNodeOpaScaleValue} from "./semiology.js"
import {getAggregateValue} from "./stat.js"


import {bbox} from 'ol/loadingstrategy';
import Bbox from 'ol/format/filter/Bbox';
import Legend from 'ol-ext/control/Legend'
import 'ol-ext/control/Legend.css'
import Crop from "ol-ext/filter/Crop"
import {Feature} from 'ol';
import {Fill, Stroke, Text, Style, CircleStyle,RegularShape} from 'ol/style.js';

import {Polygon, Circle} from 'ol/geom.js';
import {Tile,Vector as VectorLayer} from 'ol/layer.js';
import {OSM,Vector as VectorSource, XYZ} from 'ol/source.js';
import GeoJSON from 'ol/format/GeoJSON.js';
import {containsExtent} from 'ol/extent.js'

// var ol = require('ol');
import 'spectrum-colorpicker/spectrum.js'

global.ListBaseTileUrl = {
    "OSM_A": "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "OSM_B": "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "OSM_C": "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
    "Wikimedia": "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
    "Humanitarian OSM": "http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    "OSM_no_labels": "https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png",
    "Stamen Toner": "http://a.tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
    "wmflabs_OSM_BW": "https://tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png",
    "Öpnvkarte_Transport_Map": "http://tile.memomaps.de/tilegen/{z}/{x}/{y}.png",
    "OpenTopoMap": "https://a.tile.opentopomap.org/{z}/{x}/{y}.png",
};

global.ListStamenTileUrl = {
    "Toner": "http://a.tile.stamen.com/toner/{z}/{x}/{y}.png",
    "Toner_lite": "http://a.tile.stamen.com/toner-lite/{z}/{x}/{y}.png",
    "Toner_Lines": "http://a.tile.stamen.com/toner-lines/{z}/{x}/{y}.png",
    // "Stamen Toner": "http://a.tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
    "Terrain": "http://a.tile.stamen.com/terrain/{z}/{x}/{y}.png",
    "Terrain_lines": "http://a.tile.stamen.com/terrain-lines/{z}/{x}/{y}.png",
    "Terrain_background": "http://a.tile.stamen.com/terrain-background/{z}/{x}/{y}.png",
    // "Terrain_": "http://a.tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
    "WaterColor": "http://a.tile.stamen.com/watercolor/{z}/{x}/{y}.png",
};

global.ListCartoTileUrl = {
    // "Carto Light": "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    "Carto_Ligth_noLabels": "https://a.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
    // "Carto Light": "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    "Carto_Light": "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    // "Carto Light": "https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png",
    "Carto_Dark_noLabels": "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
    "Carto_Dark": "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    "voyager": "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    "voyager_nolabels": "https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png",
};

global.ListOverlayTileUrl = {
    "waymarkedtrails Cycling": "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
    "waymarkedtrails Hiking": "https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png",
    "OpenSeaMap": "http://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
    "Wikimedia": "https://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png",
    "SkyMap": "http://tiles.skimap.org/openskimap/{z}/{x}/{y}.png",
    "OpenRailwayMap_signalling": "http://a.tiles.openrailwaymap.org/signals/{z}/{x}/{y}.png",
    "OpenRailwayMap_maxspeeds": "http://a.tiles.openrailwaymap.org/maxspeed/{z}/{x}/{y}.png",
    "OpenRailwayMap_infrastructure": "http://a.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png ",
    "OpenPtMap": "http://www.openptmap.org/tiles/{z}/{x}/{y}.png",
    // "OSM A": "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
};
global.ListTextTileUrl = {
    // "waymarkedtrails Cycling": "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
    "Stamen_Toner_labels": "http://a.tile.stamen.com/toner-labels/{z}/{x}/{y}.png",
    "Stamen_TerrainnoLabels": "https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
    "Carto_Dark_labels": "https://a.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
    "Carto_Light_labels": "https://a.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png",
    "voyager_nolabels": "https://a.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png",
};

global.ListUrl = {
    "graticules_20": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_graticules_20.geojson",
    "countries": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson",
    "urban_area": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_urban_areas.geojson",
    "bounding_box": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_wgs84_bounding_box.geojson",
    "river": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_rivers_lake_centerlines_scale_rank.geojson",
    "land": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_land.geojson",
    "lakes": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_lakes.geojson",
    "graticules_5": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_graticules_5.geojson",
    "airports": "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_airports.geojson",
    // "ocean" : "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_geography_marine_polys.geojson",
    "disputed_borders" : "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_0_boundary_lines_disputed_areas.geojson",
    "disputed_area" : "https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_10m_admin_0_disputed_areas.geojson"
};

export function getLayerFromName(map, layer_name){
  // var layer  = null;
  var layers = map.getLayers()["array_"]
  for(var i in layers){
    // 
    if(layers[i].get('name') === layer_name)
    {
      return layers[i]
    }
  }
  return null
}

export function getTileUrl(){
    var tileType = document.getElementById('tileLayersAdd').value

  if(tileType === 'overlay')
    {
        var url = ListOverlayTileUrl[document.getElementById('tileLayersNameSelectorOptions').value]
    }
  else if (tileType === 'base')
    {
        var url = ListBaseTileUrl[document.getElementById('tileLayersNameSelectorOptions').value]
    }  
    else if (tileType === 'stamen')
    {
        var url = ListStamenTileUrl[document.getElementById('tileLayersNameSelectorOptions').value]
    }
    else if (tileType === 'text')
    {
        var url = ListTextTileUrl[document.getElementById('tileLayersNameSelectorOptions').value]
    }  
    else if (tileType === 'carto')
    {
        var url = ListCartoTileUrl[document.getElementById('tileLayersNameSelectorOptions').value]
    }  
    return url
}
  
export function showTileLayersName(tileType){
    if(document.getElementById('tileLayersNameSelector') !== null){
        $('#tileLayersNameSelector').children().remove();
    }

    $('#tileLayersNameSelector').append('<label for="tileLayersNameSelectorOptions">Tiles</label>')
                                .append($('<select>')
                                  .attr('class','custom-select')
                                  .attr("id","tileLayersNameSelectorOptions")
                                  );
    if(tileType === 'overlay')
    {
        var keys = Object.keys(ListOverlayTileUrl)
    }
    else if (tileType === 'base')
    {
        var keys = Object.keys(ListBaseTileUrl)
    } 
    else if (tileType === 'stamen')
    {
        var keys = Object.keys(ListStamenTileUrl)
    }
    else if (tileType === 'text')
    {
        var keys = Object.keys(ListTextTileUrl)
    }  
    else if (tileType === 'carto')
    {
        var keys = Object.keys(ListCartoTileUrl)
    }  
    // 
    // 
    for (var p = 0; p < keys.length; p++) {
        // 
        $('#tileLayersNameSelectorOptions').append($('<option>', {text:String(keys[p]) })
                        .attr("value",keys[p])
            );
    }
}
function removeRadius(point_ori, point_dest, radius_ori, radius_dest) {

    var startX = point_ori[0]
    var startY = point_ori[1]
    var endX = point_dest[0]
    var endY = point_dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    var NewOri = [Math.cos(angle) * radius_ori + startX, Math.sin(angle) * radius_ori + startY]
    var Newdest = [-Math.cos(angle) * radius_dest + endX, -Math.sin(angle) * radius_dest + endY]

    return [NewOri, Newdest]
}
// Add layer from the input button
// the function take the layer from a url base object or (TODO) an upload file or other url (give the format)
export function addBaseLayer(map, layers, mode) {

    var layer_name = document.getElementById("layers"+mode).value;
    var opacity = document.getElementById("opacityLayer"+mode).value;
    var stroke_color = $("#strokeColorpicker"+mode).spectrum('get').toHexString();
    var fill_color = $("#fillColorpicker"+mode).spectrum('get').toHexString();

    if (Object.keys(layers.base).includes(Object.keys(ListUrl))) {
        map.removeLayer(getLayerFromName(map,layer_name))

    }
    else{
      addLayerGestionMenu(layer_name);
    }
    layers.base[layer_name] = {}
    var layerAdded = addLayerFromURL(map, ListUrl[layer_name], layer_name, opacity, stroke_color, fill_color);
    // layers.base[layer_name].layer = layerAdded;
    layers.base[layer_name].style = { stroke: stroke_color, 
        fill: fill_color,
        opacity:opacity};
    layers.base[layer_name].added = false
}

export function changeBaseLayer(map, layers, mode, layer_name) {


    var opacity = document.getElementById("opacityLayer"+mode).value;
    var stroke_color = $("#strokeColorpicker"+mode).spectrum('get').toHexString();
    var fill_color = $("#fillColorpicker"+mode).spectrum('get').toHexString();

    getLayerFromName(map,layer_name).setStyle(simpleColoredStyle(opacity, stroke_color, fill_color))
    // map.removeLayer(layers.base[layer_name].layer)
    // layers.base[layer_name] = {}
    // var layerAdded = addLayerFromURL(map, ListUrl[layer_name], layer_name, opacity, stroke_color, fill_color);
    // layers.base[layer_name].layer = layerAdded;
    layers.base[layer_name].style = { stroke: stroke_color, 
        fill: fill_color,
        opacity:opacity}

}


export function computeNodeDistanceCanvas(layer_name, value, ratio_bounds, styles) {

    var cat = styles[layer_name].size.cat
    if (cat === 'Pow') {
        var Catscale = d3["scale" + cat]().exponent(2).domain([1, styles[layer_name].size.max]).range([0, styles[layer_name].size.ratio])
        return Catscale(value + 1)*Math.PI * ratio_bounds
    } else   if (cat === 'Sqrt') {
        var Catscale = d3["scale" + cat]().domain([1, styles[layer_name].size.max/Math.PI]).range([0, styles[layer_name].size.ratio])
        return Catscale(value/Math.PI + 1) * ratio_bounds
    } 
    else {

        var Catscale = d3["scale" + cat]().domain([0, styles[layer_name].size.max]).range([0, styles[layer_name].size.ratio])
        return Catscale(value) * ratio_bounds
    }
}

function computeDistanceCanvas(layer_name, value, ratio_bounds, styles) {

    var cat = styles[layer_name].size.cat
    if (cat === 'Log') {
        var Catscale = d3["scale" + cat]().domain([1, styles[layer_name].size.max]).range([0, styles[layer_name].size.ratio])
        return Catscale(value + 1) * ratio_bounds
    } else  if (cat === 'Pow') {
        var Catscale = d3["scale" + cat]().exponent(2).domain([1, styles[layer_name].size.max]).range([0, styles[layer_name].size.ratio])
        return Catscale(value) * ratio_bounds
    } else{

        var Catscale = d3["scale" + cat]().domain([0, styles[layer_name].size.max]).range([0, styles[layer_name].size.ratio])
        return Catscale(value) * ratio_bounds
    }
}

function setTargetLegend(legend, element){

    if(element === null){
        legend.setProperties({collapsible:true})
    }
    // else
    // {
    //     legend.setProperties({collapsible:true})
    // }
}

export function addLegendToMap(){
var scalers_node = getD3ScalersForStyle('node')
var scalers_link = getD3ScalersForStyle('link')
var lastLegend = null;
var style = global_data.style;

  map.removeControl(global_data.legend.link.legend)
  map.removeControl(global_data.legend.link.color)
  map.removeControl(global_data.legend.node.legend)
  map.removeControl(global_data.legend.node.color)
  map.removeControl(global_data.legend.node.opa)
  map.removeControl(global_data.legend.link.opa)

if (global_data.style.link.size.var !== 'fixed'){
    var linkLegend = new Legend({ 
        title: 'Size Link',
        style: getLinkLegendStyle,
        target : lastLegend,
        margin: 0
      }); 
    setTargetLegend(linkLegend, lastLegend)
    map.addControl(linkLegend);
    var c = [1,2,4]
    for(var i in c){
        // linkLegend.addRow();        
        linkLegend.addRow();
        linkLegend.addRow({ title:reducedNumber(style.link.size.max/c[i]), properties: { pop: global_data.style.link.size.max/c[i]   },  typeGeom: 'LineString'});

    }
        linkLegend.addRow();
        // linkLegend.addRow();  
    lastLegend = linkLegend.element
    global_data.legend.link.legend = linkLegend
    }
if (global_data.style.link.color.var !== 'fixed'){
    var linkColorLegend = new Legend({ 
        title: 'Color Link',
        target : lastLegend,
        // collapsible: true,
        margin: 0
      });
    // setTargetLegend(linkColorLegend, lastLegend)
    map.addControl(linkColorLegend);
    selectColorLegendForm(linkColorLegend, style.link.color.cat, "link", style,scalers_link.color)
    lastLegend = linkColorLegend.element
    global_data.legend.link.color = linkColorLegend
    }
if (global_data.style.link.opa.var !== 'fixed'){    
    var linkOpaLegend = new Legend({ 
        title: 'Opa Link',
        target : lastLegend,
        // style: getLinkLegendStyle,
        // target : linkLegend.element,
        margin: 0
      }); 
    // setTargetLegend(linkOpaLegend, lastLegend)
    map.addControl(linkOpaLegend);
    selectOpaLegendForm(linkOpaLegend, style.link.opa.cat, "link", style)
    lastLegend = linkOpaLegend.element
    global_data.legend.link.opa = linkOpaLegend
    }
if (global_data.style.node.size.var !== 'fixed'){
     var nodeLegend = new Legend({ 
        title: 'Size Node',
        style: getFeatureStyle,
        target : lastLegend,
        margin: 0,
        // target : nodeColorLegend.element,
      });
    // setTargetLegend(nodeLegend, lastLegend)
    map.addControl(nodeLegend);
    var c = [1,2,4]
        // nodeLegend.addRow();
    for(var i in c){     
        nodeLegend.addRow();
        nodeLegend.addRow({ title:reducedNumber(style.node.size.max/c[i]), properties: { pop: global_data.style.node.size.max/c[i]   }, typeGeom: 'Point'});
    }
      
        nodeLegend.addRow();
 
    lastLegend = nodeLegend.element
    global_data.legend.node.legend = nodeLegend
    }
    if (global_data.style.node.color.var !== 'fixed'){
        var nodeColorLegend = new Legend({ 
        title: 'Color Node',
        target : lastLegend,
        // style: getFeatureStyle,/
        margin: 0,
        // target : linkOpaLegend.element,
      });   
    // setTargetLegend(nodeColorLegend, lastLegend)
    map.addControl(nodeColorLegend);
    selectColorLegendForm(nodeColorLegend, style.node.color.cat, "node", style, scalers_node.color)
    lastLegend = nodeColorLegend.element
    global_data.legend.node.color = nodeColorLegend
    }
if (global_data.style.node.opa.var !== 'fixed'){
    var nodeOpaLegend = new Legend({ 
        title: 'Opa Link',
        // style: getLinkLegendStyle,
        target : lastLegend,
        margin: 0
      }); 
    // setTargetLegend(nodeOpaLegend, lastLegend)
    map.addControl(nodeOpaLegend);
    selectOpaLegendForm(nodeOpaLegend, style.node.opa.cat, "node", style)
    lastLegend = nodeOpaLegend.element
    global_data.legend.node.opa = nodeOpaLegend
    }



global.leg = linkLegend
}

function reducedNumber(number){
    if(number <= 10 && number >= -10)
    {
        return  Number(number).toFixed(2)
    }
    if(number >= 10000)
    {
        return Number(number).toExponential(2)
    }
    return Math.round(number).toString()
}

function selectColorLegendForm(legend, colorType, layer, style, scaler){
    
    if(colorType === "number"){
        var colors = getNodeColorScaleValue(layer)
        var step = (style[layer].color.max - style[layer].color.min)/7 // legend.addRow({ title:reducedNumber(style[layer].color.max)});
        // var x = 0; 
        for(var i = 0; i < 7; i++){
            if(i === 0){
                legend.addRow({title: reducedNumber(style[layer].color.max), typeGeom: 'Polygon',   
                style: new Style({
                  // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                  fill: new Fill({ color: scaler(style[layer].color.max)})
                })
            });
            }
            else if(i === 3){
                if(style[layer].color.min < 0){
                    legend.addRow({title: "0", typeGeom: 'Polygon',   
                    style: new Style({
                      // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                      fill: new Fill({ color: scaler(0)})
                    })
                    });}
                else {
                    legend.addRow({title: reducedNumber(colors[i][0]), typeGeom: 'Polygon',   
                    style: new Style({
                      // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                      fill: new Fill({ color: scaler(style[layer].color.max - i * step)})
                    })
                    });
                }
            }
            else if(i === 6){
                legend.addRow({title: reducedNumber(style[layer].color.min), typeGeom: 'Polygon',   
                style: new Style({
                  // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                  fill: new Fill({ color:  scaler(style[layer].color.min)})
                })
            });
            }
            else{
                legend.addRow({typeGeom: 'Polygon',   
                style: new Style({
                  // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                  fill: new Fill({ color: scaler(style[layer].color.max - i * step)})
                })
            }); 
            }
            // x = x+1;
            // 
        }
       
    }
    else if(colorType === "categorical"){
        var colors = getNodeColorCatValue(layer)

        for(var i in colors){
            legend.addRow({ title: i, typeGeom: 'Polygon',   
                style:[new Style({
                  // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                  fill: new Fill({ color: [255,255,255,1 ]})
                }),
                new Style({
                  // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                  fill: new Fill({ color: colors[i]})
                }),
                ]
            });
        }
    }

}

function selectOpaLegendForm(legend, colorType, layer, style){
   
        var colors = getNodeOpaScaleValue(layer)
        //
        // legend.addRow({ title:style[layer].opa.vmax});
        var x = 0; 
        for(var i in colors){
            if(x === 0){
                legend.addRow({title: reducedNumber(style[layer].opa.vmax), typeGeom: 'Polygon',   
                style: new Style({
                  // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                  fill: new Fill({ color: colors[i][1]})
                })
            });
            }
            else if(x === 3){
                legend.addRow({title: reducedNumber(colors[i][0]), typeGeom: 'Polygon',   
                style: new Style({
                  // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                  fill: new Fill({ color: colors[i][1]})
                })
            });
            }
            else if(x === 6){
                legend.addRow({title: reducedNumber(0), typeGeom: 'Polygon',   
                style: new Style({
                  // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                  fill: new Fill({ color: colors[i][1]})
                })
            });
            }
            else{
                legend.addRow({typeGeom: 'Polygon',   
                style: new Style({
                  // stroke: new Stroke({ color: [255,128,0,1 ], width: 1.5 }),
                  fill: new Fill({ color: colors[i][1]})
                })
            }); 
            }
            x = x+1;
            // 
        }
        // legend.addRow({ title:"0"});
}

function getLinkLegendStyle(feature){
    return [
      new Style({
              // image: new Polygon([[0,0][15,0][15,15][0,15][0,0]]),
                stroke: new Stroke({ 
                    color: [255,128,0,1 ],
                    width: computeDistanceCanvas('link', feature.get('pop'), global_data.style.ratioBounds, global_data.style)/ map.getView().getResolution() ,
                    opacity:1
                }),

              // fill: new Fill({ color: [255,255,0,.3 ],
                // geometry:new Polygon([[[0,0][0,15][15,0][0,0]]])
            // })
          })
    ];
}

export function generateLinkLayer(map, links, nodes, style, id_ori, id_dest, id_selected_links, selected_nodes) {
// 

        
    // 
    if (getLayerFromName(map, 'link') !== null) {
        map.removeLayer(getLayerFromName(map, 'link'))   
    }
    else
    {
      addFLayerGestionMenu("link");
    }


var t0 = performance.now();

    var removed_nodes = selected_nodes[1]
    var list_nodes = Object.keys(selected_nodes[0])

    var ODlinks = groupLinksByOD(links, id_selected_links, id_ori, id_dest)

var t1 = performance.now();

    var oriIDS = Object.keys(ODlinks);
    var arrow;
    var featureList = [];

    var list_width = []
    for (var j = 0; j < oriIDS.length; j++) {
         // get the index of the filtered links
        var Dlinks =  Object.keys(ODlinks[oriIDS[j]])

        for (var i = 0; i < Dlinks.length ; i++) {
                var properties = {}
    properties.ori = null
    properties.dest = null
    properties.layer = 'link'
    properties.opa =    {
                            name: style.link.opa.var,
                            value: null
                        }
    properties.size =    {
                            name: style.link.size.var,
                            value: null
                        }
    properties.color =    {
                            name: style.link.color.var,
                            value: null
                        }

            var list_index = ODlinks[oriIDS[j]][Dlinks[i]]
            properties.ori = oriIDS[j]
            properties.dest = Dlinks[i]
            var ori = nodes[oriIDS[j]].properties.centroid;
            var dest = nodes[Dlinks[i]].properties.centroid;

            var rad_ori = 0;
            var rad_dest = 0;
            if (style.node.size.var === 'fixed'){
                rad_ori =  Number(style.node.size.ratio) * style.ratioBounds ;
                rad_dest = Number(style.node.size.ratio) * style.ratioBounds ;
            }
            else if (style.node.size.var !== null) {
                if (list_nodes.includes(oriIDS[j])){
                    rad_ori = computeNodeDistanceCanvas('node', Number(nodes[oriIDS[j]].properties[style.node.size.var]), style.ratioBounds, style);
                }
                else
                {
                    rad_ori = 5 * style.ratioBounds
                }

                if(list_nodes.includes(Dlinks[i])){
                    rad_dest = computeNodeDistanceCanvas('node', Number(nodes[Dlinks[i]].properties[style.node.size.var]), style.ratioBounds, style);
                }
                else{
                    rad_dest = 5 * style.ratioBounds
                
                }
            
            }
        
            if (style.link.size.var !== 'fixed') {
                var width = getAggregateValue(list_index.map(function(item){return Number(links[item][style.link.size.var]) }))
                var distance = computeDistanceCanvas('link', width, style.ratioBounds , style);
            }
            else{
                var distance = Number(style.link.size.ratio) * style.ratioBounds ;
                var width = Number(style.link.size.ratio) * style.ratioBounds ;
            }


            if (style.link.color.var !== 'fixed') {

                var width_color = getAggregateValue(list_index.map(function(item){return Number(links[item][style.link.color.var]) }))
            }
            else{
                var width_color = Number(style.link.size.ratio) * style.ratioBounds ;
            }
            var width_opa = - 1;
            if (style.link.opa.var !== 'fixed') {
                // 
                var width_opa = getAggregateValue(list_index.map(function(item){return Number(links[item][style.link.opa.var]) }))                
            }
            properties[global_data.ids.vol] =  getAggregateValue(list_index.map(function(item){return Number(links[item][global_data.ids.vol])}))  
            arrow = drawArrow(style, ori, dest, rad_ori, rad_dest, distance)

            var featureTest = new Feature(new Polygon([arrow]));
            properties.size.value = width
            properties.opa.value = width_opa
            properties.color.value = width_color
            featureTest.setProperties(properties);
            // featureTest.setStyle(styleLinkPoly(featureTest))


                if((list_nodes.includes(oriIDS[j]) || list_nodes.includes(Dlinks[i]) ) && !(removed_nodes.includes(Dlinks[i]) || removed_nodes.includes(oriIDS[j]))){
                    featureList.push(featureTest);
                // 
            }

            // featureList.push(featureTest);
            // links[j].polygone = featureTest;
        }
            // if(){} //FOR THE GRAPHIC CHOICE OF SHOW THE NODES LINKS TO THE SELECTED NODES
        // }
    }


var t1 = performance.now();


    var source = new VectorSource({
        features: featureList
    });

var t1 = performance.now();


    var linkLayer = new VectorLayer({
        name: "link",
        source: source,
        style: styleLinkPoly,
        renderMode: 'image'
    });

var t1 = performance.now();

    map.addLayer(linkLayer);
 
    

  // var legend = new Legend({ 
  //   title: 'Legend',
  //   style: getFeatureStyle,
  //   collapsible: false,
  //   margin: 0,
  //   size: [40, 10]
  // });
  // map.addControl(legend);

var t1 = performance.now();

    
    linkLayer.changed();
    return linkLayer;
}



export function groupLinksByOD(links, mask_links, id_ori, id_dest){
    var group = {}

    mask_links.map(function(item){})

    for(var i = 0; i< mask_links.length; i++){
        var link = links[mask_links[i]]
        if(typeof group[link[id_ori]]  === 'undefined'){
            group[link[id_ori]]  = {}
            if(typeof group[link[id_ori]][link[id_dest]]  === 'undefined'){
                group[link[id_ori]][link[id_dest]]   = [mask_links[i]]
            }
            else{
                group[link[id_ori]][link[id_dest]].push(mask_links[i])
            }
        }
        else{
            if(typeof group[link[id_ori]][link[id_dest]]  === 'undefined'){
                group[link[id_ori]][link[id_dest]]   = [mask_links[i]]
            }
            else{
                group[link[id_ori]][link[id_dest]].push(mask_links[i])
            }
        }
    }
    return group
}

export function addOSMLayer(map, layers) {
    var layer = new Tile({
        name: "OSM",
        source: new OSM()
    })
    
    // layers["OSM"] = {layer:layer};

    map.addLayer(layer);
    addLayerGestionOSMMenu("OSM");
    return layer;
}

// TODO ADD CONTRIBUTIONs
export function addTileLayer(map, layers, url, name) {
    
    var source = new XYZ({
        url: url,
        crossOrigin: 'anonymous'
    });
    
    var layer = new Tile({
        name: name,
        source: source,
        // crossOrigin: 'anonymous'
    })
    layers[name] = url;

    map.addLayer(layer);
    addLayerGestionOSMMenu(name);
    return layer;
}


function getAllNodesFromFilteredLinks(links, id_links, ori_id, dest_id, selected_nodes){
    
    
    var ids = id_links.map(function(id){
        if(selected_nodes.includes(links[id][ori_id]) || selected_nodes.includes(links[id][dest_id]) ){        
        return [links[id][ori_id],links[id][dest_id]]}
    })
    return [...new Set(ids.flat().filter(function(el) { return el; }))]
}

export function addNodeLayer(map, links, nodes, style, id_selected_links, selected_nodes) {
// 
var scalers = getD3ScalersForStyle('node')
    if (getLayerFromName(map,'node') !== null) {
        map.removeLayer(getLayerFromName(map,'node'))
    }
    else 
    {
        addFLayerGestionMenu("node");
    }

    var filter_nodes = applyNodeDataFilter(nodes)

    var nodeList = []
    var sel_node = Object.keys(selected_nodes[0])
    var listallnodes = getAllNodesFromFilteredLinks(links, id_selected_links,global_data.ids.linkID[0], global_data.ids.linkID[1] , sel_node)
    var all_nodes = Object.keys(nodes)

    for( var p = 0; p< listallnodes.length; p++){
        if(sel_node.includes(listallnodes[p])){
            var point = nodes[listallnodes[p]].properties.centroid;
            if (style.node.size.var !== 'fixed') {
                var radius = computeNodeDistanceCanvas('node', Number(nodes[listallnodes[p]].properties[style.node.size.var]), style.ratioBounds, style);
            }
            else
            {
                var radius = Number(style.node.size.ratio) * style.ratioBounds ;
            }
            
            var feat = new Feature(new Circle(point, radius))
            //feat.setStyle(createCircle(Math.round(1000 * nodes[feature].properties.pop_est / SumPop +1)));
            feat.setProperties(nodes[listallnodes[p]].properties)
            feat.setStyle(styleNodeCircle(feat, scalers))
        
            //    featureTest.setStyle(styleFunctionLink(featureTest, linkData[j]["Trade Value (US$)"]))
            nodeList.push(feat);
        }
        else{
            var point = nodes[listallnodes[p]].properties.centroid;

            var radius = 5 * style.ratioBounds ;
            
            var feat = new Feature(new Circle(point, radius))
            //feat.setStyle(createCircle(Math.round(1000 * nodes[feature].properties.pop_est / SumPop +1)));
            feat.setProperties(nodes[listallnodes[p]].properties)
            feat.setProperties({layer:'node'})
            feat.setStyle(styleUnselectedNodeCircle(feat))
            //    featureTest.setStyle(styleFunctionLink(featureTest, linkData[j]["Trade Value (US$)"]))
            nodeList.push(feat);
        }
    }
 
    var source = new VectorSource({
        features: nodeList
    });
    var nodeLayer = new VectorLayer({
        name: "node",
        source: source,
        renderMode: 'image'
    })



    map.addLayer(nodeLayer);
    return nodeLayer;
}


export function getD3ScalersForStyle(layer){
    var scalers =   { 
                    color : null,
                    size  : null,
                    opa   : null  
                }

    if(global_data.style[layer].color.cat === 'number' && global_data.style[layer].color.var !== 'fixed'){
        if (global_data.style[layer].color.min < 0){
            scalers.color =d3.scaleDiverging(d3["interpolate"+global_data.style[layer].color.palette]).domain([global_data.style[layer].color.min, 0, global_data.style[layer].color.max])
        } 
        else
        {
            scalers.color =d3.scaleSequential(d3["interpolate"+global_data.style[layer].color.palette]).domain([global_data.style[layer].color.min, global_data.style[layer].color.max])
        }      
    }

    if (global_data.style[layer].opa.var !== 'fixed')
    {
        scalers.opa = d3["scale"+global_data.style[layer].opa.cat]().domain([0,Number(global_data.style[layer].opa.vmax)]).range([Number(global_data.style[layer].opa.min),Number(global_data.style[layer].opa.max)])
    }

    return scalers
}


export function addLayerFromURL(map, url, layerName, opacity, stroke_color, fill_color) {

   if(global_data.projection.extent !==  null)
    {
        var URLLayer = new VectorLayer({
        name: layerName,
        // overlaps:false,
        // extent: global_data.projection.extent,
        source:new VectorSource({
            // projection:global_data.projection.name,
            url: url,
            // strategy: new Bbox( "default", global_data.projection.extent),
            // overlaps:false,
            useSpatialIndex:false,
            format: new GeoJSON({
                //defaultDataProjection: 'EPSG:4326'
                })
            }),

            overlaps:true,
            // wrapX:false,
    });
    }
    else{
        var URLLayer = new VectorLayer({
        name: layerName,
        // overlaps:false,

            overlaps:true,
            wrapX:false,
        //extent: projection.extent,
        source: new VectorSource({
            // projection:global_data.projection.name,
            url: url,

            useSpatialIndex:false,
            format: new GeoJSON({
                //defaultDataProjection: 'EPSG:4326'
                })
            })
        });
    }

    console.log("etLayerFromName(map,layer_name)")

    URLLayer.setOpacity(opacity)
    URLLayer.setStyle(simpleColoredStyle(opacity, stroke_color, fill_color))
    map.addLayer(URLLayer);

    
    return URLLayer;
}

export function addLayerFromURLNoStyle(map, url, layerName) {

    // very approximate calculation of projection extent
   if(global_data.projection.extent !==  null)
    {
        var URLLayer = new VectorLayer({
        name: layerName,
        // extent: global_data.projection.extent,
        source: new VectorSource({
            projection:global_data.projection.name,
            // extent: global_data.projection.extent,
            url: url,
            format: new GeoJSON({
                //defaultDataProjection: 'EPSG:4326'
            })
        })
    });
    }
    else{
        var URLLayer = new VectorLayer({
        name: layerName,
        //extent: projection.extent,
        source: new VectorSource({
            projection:global_data.projection.name,
            url: url,
            format: new GeoJSON({
                //defaultDataProjection: 'EPSG:4326'
                })
            })
        });
    }
    
    map.addLayer(URLLayer);
    return URLLayer;
}

export function addGeoJsonLayer(map, data, name_layer, opacity, stroke_color, fill_color){
    // 
    var vectorSource = new VectorSource({
        projection:global_data.projection.name,
        features: new GeoJSON({
          // featureProjection: global_data.projection.name
        }).readFeatures(data)
      });

    var geoJsonLayer = new VectorLayer({
        name: name_layer,
        //extent: projection.extent,
        source: vectorSource
        
    });
    // geoJsonLayer.setStyle(simpleColoredStyle(opacity, stroke_color, fill_color));
    map.addLayer(geoJsonLayer);
    return geoJsonLayer;
}