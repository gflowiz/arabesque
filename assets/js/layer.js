import {addLayerGestionMenu,addFLayerGestionMenu,removeLayer, addLayerGestionOSMMenu} from "./control.js"
import {simpleColoredStyle, styleLinkPoly, styleNodeCircle, styleUnselectedNodeCircle} from "./style.js"
import {applyNodeDataFilter, applyLinkDataFilter, getAllNodesToShow, testLinkDataFilter} from "./filter.js"
import {drawArrow} from "./geometry.js"

import Legend from 'ol-ext/control/Legend'
import 'ol-ext/control/Legend.css'
import {Feature} from 'ol';

import {Polygon, Circle} from 'ol/geom.js';
import {Tile,Vector as VectorLayer} from 'ol/layer.js';
import {OSM,Vector as VectorSource} from 'ol/source.js';
import GeoJSON from 'ol/format/GeoJSON.js';

// var ol = require('ol');
import 'spectrum-colorpicker/spectrum.js'

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




function curveArrow(point_ori, point_dest, width, curving_ratio, ratio_bounds) {

}

function tranposeLine(point_ori, point_dest, distance) {

    var startX = point_ori[0]
    var startY = point_ori[1]
    var endX = point_dest[0]
    var endY = point_dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    var NewOri = [Math.sin(angle) * distance + startX, -Math.cos(angle) * distance + startY]
    var Newdest = [Math.sin(angle) * distance + endX, -Math.cos(angle) * distance + endY]

    return [NewOri, Newdest]
}


function transposePointVerticalyFromLine(point_ori, linePoints, distance) {

    var startX = linePoints[0][0]
    var startY = linePoints[0][1]
    var endX = linePoints[1][0]
    var endY = linePoints[1][1]
    var angle = Math.atan2(endY - startY, endX - startX);
    return [Math.sin(angle) * distance + point_ori[0], -Math.cos(angle) * distance + point_ori[1]];

}


// create a simple arrow with en triangle head at a given ratio of the distance
function simpleArrowCoordinates(point_base1, point_base2, arrow_size, width) {
    var startX = point_base1[0]
    var startY = point_base1[1]
    var endX = point_base2[0]
    var endY = point_base2[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    var percentDist = 0.65 * Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY))
    //distance = Math.sqrt( (endX - startX)*(endX - startX )+ (endY - startY)*(endY - startY) ) * ratio_Arrow_Line;

    var dist = Math.min(arrow_size, percentDist)

    // topArrowpoint = [Math.cos(angle) * distance + startX, Math.sin(angle) * distance + startY]
    var topArrowpoint = [-Math.cos(angle) * dist + endX, -Math.sin(angle) * dist + endY]
    var polyPoint = tranposeLine(point_base1, topArrowpoint, width)

    topArrowpoint = transposePointVerticalyFromLine(topArrowpoint, [point_base1, point_base2], width + dist / 4)
    return [point_base1, point_base2, topArrowpoint, polyPoint[1], polyPoint[0], point_base1]
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
        map.removeLayer(layers.base[layer_name].layer)

    }
    else{
      addLayerGestionMenu(layer_name);
    }
    layers.base[layer_name] = {}
    var layerAdded = addLayerFromURL(map, ListUrl[layer_name], layer_name, opacity, stroke_color, fill_color);
    layers.base[layer_name].layer = layerAdded;
    layers.base[layer_name].style = { stroke: stroke_color, 
        fill: fill_color,
        opacity:opacity};
    layers.base[layer_name].added = false

}

export function changeBaseLayer(map, layers, mode, layer_name) {


    var opacity = document.getElementById("opacityLayer"+mode).value;
    var stroke_color = $("#strokeColorpicker"+mode).spectrum('get').toHexString();
    var fill_color = $("#fillColorpicker"+mode).spectrum('get').toHexString();

    layers.base[layer_name].layer.setStyle(simpleColoredStyle(opacity, stroke_color, fill_color))
    // map.removeLayer(layers.base[layer_name].layer)
    // layers.base[layer_name] = {}
    // var layerAdded = addLayerFromURL(map, ListUrl[layer_name], layer_name, opacity, stroke_color, fill_color);
    // layers.base[layer_name].layer = layerAdded;
    layers.base[layer_name].style = { stroke: stroke_color, 
        fill: fill_color,
        opacity:opacity}

}


function computeDistanceCanvas(layer_name, value, ratio_bounds, styles) {

    var cat = styles[layer_name].size.cat
    if (cat === 'Log') {
        var Catscale = d3["scale" + cat]().domain([1, styles[layer_name].size.max]).range([0, styles[layer_name].size.ratio])
        return Catscale(value + 1) * ratio_bounds
    } else {

        var Catscale = d3["scale" + cat]().domain([0, styles[layer_name].size.max]).range([0, styles[layer_name].size.ratio])
        return Catscale(value) * ratio_bounds
    }
}


export function filterLinkLayer(map, links, nodes, style, id_ori, id_dest) {


    var selected_nodes = applyNodeDataFilter(nodes);
    var removed_nodes = selected_nodes[1]
    var list_nodes = Object.keys(selected_nodes[0])
    var index_links = testLinkDataFilter(global_data.filter.link, data)
    // console.log(index_links)
    // // filter_nodes
    // console.log(id_ori);
    // //CHANGE IN indexList
    // var filter_links = applyLinkDataFilter(links, selected_nodes[0], selected_nodes[1]);

    var len = index_links.length;
    var arrow;
    var featureList = [];
    for (var k = 0; k < len; k++) {
        var j = index_links[k]; // get the index of the filtered links

        // if(){
        if((list_nodes.includes(links[j][id_ori]) || list_nodes.includes(links[j][id_dest]) ) && (!removed_nodes.includes(links[j][id_dest]) && !removed_nodes.includes(links[j][id_ori]))){

            featureList.push(links[j].polygone);

           }
            // if(){} //FOR THE GRAPHIC CHOICE OF SHOW THE NODES LINKS TO THE SELECTED NODES
        // }
    }

    var source = new VectorSource({
        features: featureList
    });


    var linkLayer = new VectorLayer({
        name: "Link",
        source: source,
        style: styleLinkPoly,
        renderMode: 'image'
    });
    map.addLayer(linkLayer);


    
    linkLayer.changed();
    return linkLayer;
}

export function generateLinkLayer(map, links, nodes, style, id_ori, id_dest, id_selected_links, selected_nodes) {


    // console.log('======================')
    if (Object.keys(global_data.layers.features).includes("link")) {
        map.removeLayer(global_data.layers.features["link"])
        
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
console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
    var oriIDS = Object.keys(ODlinks);
    var arrow;
    var featureList = [];

    var list_width = []
    for (var j = 0; j < oriIDS.length; j++) {
         // get the index of the filtered links
        var Dlinks =  Object.keys(ODlinks[oriIDS[j]])

        for (var i = 0; i < Dlinks.length ; i++) {

            var list_index = ODlinks[oriIDS[j]][Dlinks[i]]

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
                    rad_ori = computeDistanceCanvas('node', Number(nodes[oriIDS[j]].properties[style.node.size.var]), style.ratioBounds, style);
                }
                else
                {
                    rad_ori = 5 * style.ratioBounds
                }

                if(list_nodes.includes(Dlinks[i])){
                    rad_dest = computeDistanceCanvas('node', Number(nodes[Dlinks[i]].properties[style.node.size.var]), style.ratioBounds, style);
                }
                else{
                    rad_dest = 5 * style.ratioBounds
                
                }
            
            }

            if (style.link.size.var !== 'fixed') {
                var width = list_index.reduce(function (accumulateur, valeurCourante) {
                                        return accumulateur + Number(links[valeurCourante][style.link.size.var]);
                                        }, 0);
                var distance = computeDistanceCanvas('link', width, style.ratioBounds * 0.75, style);
            }
            else{
                var distance = Number(style.link.size.ratio) * style.ratioBounds ;
                var width = Number(style.link.size.ratio) * style.ratioBounds ;
            }
            if (style.link.color.var !== 'fixed') {

                var width_color = list_index.reduce(function (accumulateur, valeurCourante) {
                                        return accumulateur + Number(links[valeurCourante][style.link.color.var]);
                                        }, 0);
                
            }
            else{
                var width_color = Number(style.link.size.ratio) * style.ratioBounds ;
            }
            // list_width.push(distance)
               
// console.log(width)
            arrow = drawArrow(style, ori, dest, rad_ori, rad_dest, distance)

            var featureTest = new Feature(new Polygon([arrow]));
            featureTest.setProperties(links[j]);
            featureTest.setStyle(styleLinkPoly(featureTest, width, width_color))
            

                if((list_nodes.includes(oriIDS[j]) || list_nodes.includes(Dlinks[i]) ) && !(removed_nodes.includes(Dlinks[i]) || removed_nodes.includes(oriIDS[j]))){
                    featureList.push(featureTest);
                
            }

            // featureList.push(featureTest);
            // links[j].polygone = featureTest;
           }
            // if(){} //FOR THE GRAPHIC CHOICE OF SHOW THE NODES LINKS TO THE SELECTED NODES
        // }
    }


var t1 = performance.now();
console.log("end generateLinkLayer" + (t1 - t0) + " milliseconds.")

    var source = new VectorSource({
        features: featureList
    });

var t1 = performance.now();
console.log("create source" + (t1 - t0) + " milliseconds.")

    var linkLayer = new VectorLayer({
        name: "Link",
        source: source,
        style: styleLinkPoly,
        renderMode: 'image'
    });

var t1 = performance.now();
console.log("addMap " + (t1 - t0) + " milliseconds.")
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
console.log("end" + (t1 - t0) + " milliseconds.")
    
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
    
    layers["OSM"] = {layer:layer};

    map.addLayer(layer);
    addLayerGestionOSMMenu("OSM");
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
// console.log(Object.keys(global_layers.features).includes("node"))
    if (Object.keys(global_data.layers.features).includes("node")) {
        map.removeLayer(global_data.layers.features["node"])
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
                var radius = computeDistanceCanvas('node', Number(nodes[listallnodes[p]].properties[style.node.size.var]), style.ratioBounds, style);
            }
            else
            {
                var radius = Number(style.node.size.ratio) * style.ratioBounds ;
            }
            
            var feat = new Feature(new Circle(point, radius))
            //feat.setStyle(createCircle(Math.round(1000 * nodes[feature].properties.pop_est / SumPop +1)));
            feat.setProperties(nodes[listallnodes[p]].properties)
            feat.setStyle(styleNodeCircle(feat))
        
            //    featureTest.setStyle(styleFunctionLink(featureTest, linkData[j]["Trade Value (US$)"]))
            nodeList.push(feat);
        }
        else{
            var point = nodes[listallnodes[p]].properties.centroid;

            var radius = 5 * style.ratioBounds ;
            
            var feat = new Feature(new Circle(point, radius))
            //feat.setStyle(createCircle(Math.round(1000 * nodes[feature].properties.pop_est / SumPop +1)));
            feat.setProperties(nodes[listallnodes[p]].properties)
            feat.setStyle(styleUnselectedNodeCircle(feat))
            //    featureTest.setStyle(styleFunctionLink(featureTest, linkData[j]["Trade Value (US$)"]))
            nodeList.push(feat);
        }
    }
 
// let a = new Set(all_nodes);
// let b = new Set(sel_node);
// let c = new Set(listallnodes);
// let difference = new Set(
//     [...a].filter(x => b.has(x)));
// let difference2 = [...new Set(
//     [...difference].filter(x => !c.has(x)))];
// console.log(difference2)

    // for( var p = 0; p< difference2.length; p++){
    //     console.log(sel_node.includes(difference2[p]))
    //         var point = nodes[difference2[p]].properties.centroid;
    //         if (style.node.size.var !== 'fixed') {
    //             var radius = computeDistanceCanvas('node', Number(nodes[difference2[p]].properties[style.node.size.var]), style.ratioBounds, style);
    //         }
    //         else
    //         {
    //             var radius = Number(style.node.size.ratio) * style.ratioBounds ;
    //         }
            
    //         var feat = new Feature(new Circle(point, radius))
    //         //feat.setStyle(createCircle(Math.round(1000 * nodes[feature].properties.pop_est / SumPop +1)));
    //         feat.setProperties(nodes[difference2[p]].properties)
    //         feat.setStyle(styleNodeCircle(feat))
        
    //         //    featureTest.setStyle(styleFunctionLink(featureTest, linkData[j]["Trade Value (US$)"]))
    //         nodeList.push(feat);
    //     }

//     
//     for (var feature in selected_nodes[0]) {
     
//         //var j = st[m]


//     }
//         var nodes_already_print = Object.keys(selected_nodes[0])
// console.log(nodes_already_print)
// console.log(listallnodes)
//      for (var n in listallnodes) {
//         var feature = listallnodes[n]
//         //var j = st[m]
//         if(!nodes_already_print.includes(feature) && !(selected_nodes[1].includes(feature) || selected_nodes[1].includes(feature))){
//         var point = nodes[feature].properties.centroid;

//         var radius = 10 * style.ratioBounds ;
        
//         var feat = new Feature(new Circle(point, radius))
//         //feat.setStyle(createCircle(Math.round(1000 * nodes[feature].properties.pop_est / SumPop +1)));
//         feat.setProperties(nodes[feature].properties)
//         feat.setStyle(styleUnselectedNodeCircle(feat))
//         //    featureTest.setStyle(styleFunctionLink(featureTest, linkData[j]["Trade Value (US$)"]))
//         nodeList.push(feat);
//     }
//     }


    var source = new VectorSource({
        features: nodeList
    });
    var nodeLayer = new VectorLayer({
        name: "Node",
        source: source,
        renderMode: 'image'
    })

  //     var legend = new Legend({ 
  //   title: 'Legend',
  //   style: styleNodeCircle,
  //   collapsible: true,
  //   margin: 15,
  //   size: [40, 10]
  // });
  // map.addControl(legend);

    map.addLayer(nodeLayer);
    return nodeLayer;
}

export function addLayerFromURL(map, url, layerName, opacity, stroke_color, fill_color) {

    // very approximate calculation of projection extent
    var URLLayer = new VectorLayer({
        name: layerName,
        //extent: projection.extent,
        source: new VectorSource({
            url: url,
            format: new GeoJSON({
                //defaultDataProjection: 'EPSG:4326'
            })
        })
    });
    

    URLLayer.setOpacity(opacity)
    URLLayer.setStyle(simpleColoredStyle(opacity, stroke_color, fill_color))
    map.addLayer(URLLayer);
    return URLLayer;
}

export function addLayerFromURLNoStyle(map, url, layerName) {

    // very approximate calculation of projection extent

    var URLLayer = new VectorLayer({
        name: layerName,
        //extent: projection.extent,
        source: new VectorSource({
            url: url,
            format: new GeoJSON({
                //defaultDataProjection: 'EPSG:4326'
            })
        })
    });
    map.addLayer(URLLayer);
    return URLLayer;
}

export function addGeoJsonLayer(map, data, name_layer, opacity, stroke_color, fill_color){
    // console.log(data)
    var vectorSource = new VectorSource({
        features: new GeoJSON({
          featureProjection: global_data.projection.name
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