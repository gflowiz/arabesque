/*
Last Update : 19/03/2019
Bapaume Thomas
*/
import {showChangeBaseLayerParameter,changeSemioParameter , applyNewStyle} from "./semiology.js";
import {changeBaseLayer, filterLinkLayer} from "./layer.js";
import 'jquery-ui';

require('jquery-ui-bundle');


 $(function($) {
        var panelList = $('#accordionLayerControl');

        panelList.sortable({
            // Only make the .panel-heading child elements support dragging.
            // Omit this to make then entire <li>...</li> draggable.
            handle: '.card-header', 
            update: function() {
                $('.card', panelList).each(function(index, elem) {
                     var $listItem = $(elem),
                         newIndex = $listItem.index();
                    console.log($listItem.index())
                    console.log(elem.textContent)
                    if (typeof global_data.layers.base[elem.textContent] !== 'undefined')
                    {
                      global_data.layers.base[elem.textContent].layer.setZIndex(- $listItem.index() )
                    }
                    if (typeof global_data.layers.features[elem.textContent] !== 'undefined')
                    {
                     global_data.layers.features[elem.textContent].setZIndex(- $listItem.index() )
                    }

                });
            }
        });
    });

export function refreshZindex(){
    var panelList = $('#accordionLayerControl');
    console.log($('#accordionLayerControl'))
    if (panelList.childNodes.length > 1){
        
        console.log("fqfdqsdfqsdfqfdqsdf")
        for(var k = 0; k<panelList.childNodes.length; k++){
            elem = panelList.childNodes[k]
            console.log(elem.textContent)
            if (typeof global_data.layers.base[elem.textContent] !== 'undefined')
            {
                global_data.layers.base[elem.textContent].layer.setZIndex(- elem.textContent)
            }
            if (typeof global_data.layers.features[elem.textContent] !== 'undefined')
            {
                global_data.layers.features[elem.textContent].setZIndex(- elem.textContent )
            }
        }
console.log("AYAYAYA")
    }
    return;
}

export function removeLayer(name) {
    //len = layers.length;

    map.removeLayer(global_data.layers.base[name].layer);

    delete global_data.layers.base[name];
    removeLayerGestionMenu(name);
    //$("#layers").append($("<option>", {value:layerName, text:layerName}));
}


export function removeFeaturesLayer(name) {

    //len = layers.length;

    map.removeLayer(global_data.layers.features[name]);

    global_data.style[name].color = {};
    global_data.style[name].size.var  = null;
    global_data.style[name].text = {};
    global_data.style[name].opa = {};
    delete global_data.layers.features[name];

    removeLayerGestionMenu(name);

    if(name === 'node'){
        if (typeof global_data.layers.features.link !== 'undefined'){
            map.removeLayer(global_data.layers.features['link'])
            global_data.layers.features['link'] = filterLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1])
        }
    }

    
    //$("#Flayers").append($("<option>", {value:layerName, text:layerName}));

}

export function addLayerGestionOSMMenu(name){

        $("#accordionLayerControl").prepend($("<li>", {
        class: "card mt-2 border-dark",
        id : "card"+name,
        value : name
    })
    .append($("<div>", {
        class: "card-header  text-dark panel-heading",
        text : name,
        id: "panel" + name
        }
    )
        .append($("<button>")
            .attr("type", "button")
            .attr("id", "buttonRemoveLayer" + name)
            .attr("class", "close center-block  ml-1")
            .attr("aria-label", "Close")
            .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")
        ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonHideLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
    )));


console.log(global_data.layers.base)
    // document.getElementById("buttonChangeLayer" + name).addEventListener("click", function(){showChangeBaseLayerParameter(map, global_data.layers, "Change", name ,global_data.layers.base[name].style)}); 
    document.getElementById("buttonHideLayer" + name).addEventListener("click", function() {
       hideOSMLayer(name)
    });
    document.getElementById("buttonRemoveLayer" + name).addEventListener("click", function() {
        removeLayer(name)
    });

}

export function addLayerGestionMenu(name) {


        $("#accordionLayerControl").prepend($("<li>", {
        class: "card mt-2 border-dark",
        id : "card"+name,
        value : name
    })
    .append($("<div>", {
        class: "card-header  text-dark panel-heading",
        text : name,
        id: "panel" + name
        }
    )
        .append($("<button>")
            .attr("type", "button")
            .attr("id", "buttonRemoveLayer" + name)
            .attr("class", "close center-block  ml-1")
            .attr("aria-label", "Close")
            .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")
        ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonChangeLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("data-target", "#changeBaseLayerModal")
                .attr("data-toggle", "modal")
                .append("<img class='icon' src='assets/svg/si-glyph-brush-1.svg'/>")
        ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonHideLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
    )));


console.log(global_data.layers.base)
    document.getElementById("buttonChangeLayer" + name).addEventListener("click", function(){showChangeBaseLayerParameter(map, global_data.layers, "Change", name ,global_data.layers.base[name].style)}); 
    document.getElementById("buttonHideLayer" + name).addEventListener("click", function() {
       hideLayer(name)
    });
    document.getElementById("buttonRemoveLayer" + name).addEventListener("click", function() {
        removeLayer(name)
    });

}

function hideFLayer(name_layer) {
    var opa = global_data.layers.features[name_layer].getOpacity();
    console.log(opa)
    if(opa>0){
        opa = 0
        $("#buttonHideLayer" + name_layer).children().remove()
        $("#buttonHideLayer" + name_layer).append("<img class='icon' src='assets/svg/si-glyph-noview.svg'/>")
    }
    else{
        opa = 0.8
        $("#buttonHideLayer" + name_layer).children().remove()
        $("#buttonHideLayer" + name_layer).append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
    }
    global_data.layers.features[name_layer].setOpacity(opa)
}

function hideLayer(name_layer) {
    var opa = global_data.layers.base[name_layer].layer.getOpacity();
    console.log(opa)
    if(opa>0){
        opa = 0
        $("#buttonHideLayer" + name_layer).children().remove()
        $("#buttonHideLayer" + name_layer).append("<img class='icon' src='assets/svg/si-glyph-noview.svg'/>")
    }
    else{
        opa = global_data.layers.base[name_layer].style.opacity
        $("#buttonHideLayer" + name_layer).children().remove()
        $("#buttonHideLayer" + name_layer).append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
    }
    global_data.layers.base[name_layer].layer.setOpacity(opa)
}



function hideOSMLayer(name_layer) {
    var opa = global_data.layers.base[name_layer].layer.getOpacity();
    console.log(opa)
    if(opa>0){
        opa = 0
    }
    else{
        opa = 1
    }
    global_data.layers.base[name_layer].layer.setOpacity(opa)
}

export function addFLayerGestionMenu(name) {
    console.log(name)


    $("#accordionLayerControl").prepend($("<li>", {
        class: "card mt-2 border-dark",
        id : "card"+name,
        value : name
    })
        .append($("<div>", {
            class: "card-header text-dark h-5 panel-heading",
            text : name,
            id: "panel" + name
            }
        )
            .append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonRemoveLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")
            ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonChangeLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("data-target", "#changeSemioModal")
                .attr("data-toggle", "modal")
                .append("<img class='icon' src='assets/svg/si-glyph-brush-1.svg'/>")
            ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonHideLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
        )
    ));
    document.getElementById("buttonHideLayer" + name).addEventListener("click", function() {
       hideFLayer(name)
    });

    document.getElementById("buttonRemoveLayer" + name).addEventListener("click", function() {
        removeFeaturesLayer(name)
    });
    document.getElementById("buttonChangeLayer" + name).addEventListener("click", function() {
        changeSemioParameter(name, global_data.style)
    });
}


function removeLayerGestionMenu(name) {
    $("#card" + name).remove();
}

//divide in two function encapsulated each type of function
export function getNameVariables(dataName){
  if(dataName==='node'){
    return Object.keys(data.nodes.features[0].properties);
  }
  else if (dataName ==='link'){
    return Object.keys(data.links[0]);
  }
}

var applyExtent = function(layers, extent){
  keys = Object.keys(layers);
  for(var p=0; p<keys.length; p++){
    layers[keys[p]].setExtent(extent);
  };
}
