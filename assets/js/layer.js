import {addLayerGestionMenu,addFLayerGestionMenu,removeLayer} from "./control.js"
import {simpleColoredStyle, styleLinkPoly, styleNodeCircle} from "./style.js"
import {applyNodeDataFilter, applyLinkDataFilter, getAllNodesToShow, testLinkDataFilter} from "./filter.js"
import {drawArrow} from "./geometry.js"

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
    console.log(index_links)
    // filter_nodes
    console.log(id_ori);
    //CHANGE IN indexList
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


export function generateLinkLayer(map, links, nodes, style, id_ori, id_dest) {

    // console.log('======================')
    if (Object.keys(global_data.layers.features).includes("link")) {
        map.removeLayer(global_data.layers.features["link"])
        
    }
    else
    {
      addFLayerGestionMenu("link");
    }

    var selected_nodes = applyNodeDataFilter(nodes);
    var removed_nodes = selected_nodes[1]
    var list_nodes = Object.keys(selected_nodes[0])
    var index_links = testLinkDataFilter(global_data.filter.link, data)
    console.log(index_links)
    // filter_nodes
    console.log(id_ori);
    //CHANGE IN indexList
    // var filter_links = applyLinkDataFilter(links, selected_nodes[0], selected_nodes[1]);

    var len = links.length;
    var arrow;
    var featureList = [];
    for (var j = 0; j < len; j++) {
         // get the index of the filtered links

        // if(){
        
            var ori = nodes[links[j][id_ori]].properties.centroid;
            var dest = nodes[links[j][id_dest]].properties.centroid;
            var rad_ori = 0;
            var rad_dest = 0;

            if (style.node.size.var === 'fixed'){
                rad_ori =  Number(style.node.size.ratio) * style.ratioBounds ;
                rad_dest = Number(style.node.size.ratio) * style.ratioBounds ;
            }
            else if (style.node.size.var !== null) {
                rad_ori = computeDistanceCanvas('node', Number(nodes[links[j][id_ori]].properties[style.node.size.var]), style.ratioBounds, style);
                rad_dest = computeDistanceCanvas('node', Number(nodes[links[j][id_dest]].properties[style.node.size.var]), style.ratioBounds, style);
            
            }
            if (style.link.size.var !== 'fixed') {
                var distance = computeDistanceCanvas('link', Number(links[j][style.link.size.var]), style.ratioBounds * 0.75, style);
            }
            else{
                var distance = Number(style.link.size.ratio) * style.ratioBounds ;
            }
        
            var rad_points = removeRadius(ori, dest, rad_ori, rad_dest);

            var basePoint = tranposeLine(rad_points[0], rad_points[1], style.ratioBounds / 2);
            arrow = drawArrow(style, ori, dest, rad_ori, rad_dest, distance)

            var featureTest = new Feature(new Polygon([arrow]));
            featureTest.setProperties(links[j]);
            featureTest.setStyle(styleLinkPoly(featureTest))


            if(index_links.includes(j)){
                if((list_nodes.includes(links[j][id_ori]) || list_nodes.includes(links[j][id_dest]) ) && (!removed_nodes.includes(links[j][id_dest]) && !removed_nodes.includes(links[j][id_ori]))){
                    featureList.push(featureTest);
                }
            }


            links[j].polygone = featureTest;
           
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

export function addOSMLayer(map, layers) {
    var layer = new Tile({
        name: "OSM",
        source: new OSM()
    })
    layers["OSM"] = layer;

    map.addLayer(layer);
    addLayerGestionMenu("OSM");
}


export function addNodeLayer(map, links, nodes, style) {
// console.log(Object.keys(global_data.layers.features).includes("node"))
    if (Object.keys(global_data.layers.features).includes("node")) {
        map.removeLayer(global_data.layers.features["node"])
    }
    else 
    {
        addFLayerGestionMenu("node");
    }

    var filter_nodes = applyNodeDataFilter(nodes)
console.log(filter_nodes)
    
    // if(typeof global_data.layers.features.link !== "undefined"){
    // var filter_links = applyLinkDataFilter(links, filter_nodes[0],filter_nodes[1]);
    // filter_nodes = getAllNodesToShow(filter_links,nodes ,filter_nodes[0]);
    // }
    // else{
    //     filter_nodes = filter_nodes[0]
    // }
// console.log(filter_nodes)
    var nodeList = []
    for (var feature in filter_nodes[0]) {
     
        //var j = st[m]
        var point = nodes[feature].properties.centroid;
        if (style.node.size.var !== 'fixed') {
            var radius = computeDistanceCanvas('node', Number(nodes[feature].properties[style.node.size.var]), style.ratioBounds, style);
        }
        else
        {
            var radius = Number(style.node.size.ratio) * style.ratioBounds ;
        }
        
        var feat = new Feature(new Circle(point, radius))
        //feat.setStyle(createCircle(Math.round(1000 * nodes[feature].properties.pop_est / SumPop +1)));
        feat.setProperties(nodes[feature].properties)

        //    featureTest.setStyle(styleFunctionLink(featureTest, linkData[j]["Trade Value (US$)"]))
        nodeList.push(feat);

    }

    var source = new VectorSource({
        features: nodeList
    });
    var nodeLayer = new VectorLayer({
        name: "Node",
        source: source,
        style: styleNodeCircle,
        renderMode: 'image'
    })
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
    console.log(data)
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