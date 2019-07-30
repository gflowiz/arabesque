/*
Last Update : 19/03/2019
Bapaume Thomas
*/
import { changeGeometryParameter} from "./geometry.js";
import {showChangeBaseLayerParameter,changeSemioParameter , applyNewStyle, } from "./semiology.js";
import {changeBaseLayer, generateLinkLayer, getLayerFromName} from "./layer.js";
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
                    
                    

                     getLayerFromName(map,elem.textContent).setZIndex(- $listItem.index() )
                    
                   

                });
            }
        });
    });

export function refreshZindex(){
    var panelList = $('#accordionLayerControl');
    // 
    if (panelList.childNodes.length > 1){
        
        // 
        for(var k = 0; k<panelList.childNodes.length; k++){
            elem = panelList.childNodes[k]
            
            getLayerFromName(map,elem.textContent).setZIndex(- elem.textContent)

            }
        }
// 
    
    return;
}

export function removeLayer(name) {
    //len = layers.length;

    map.removeLayer(getLayerFromName(map,name));

    delete global_data.layers.base[name];
    removeLayerGestionMenu(name);
    //$("#layers").append($("<option>", {value:layerName, text:layerName}));
}

export function removeTileLayer(name) {
    //len = layers.length;

    map.removeLayer(getLayerFromName(map,name));

    delete global_data.layers.osm[name];
    removeLayerGestionMenu(name);
    //$("#layers").append($("<option>", {value:layerName, text:layerName}));
}



export function removeFeaturesLayer(name) {

    //len = layers.length;

    map.removeLayer(getLayerFromName(map,name));

    global_data.style[name].color = {};
    global_data.style[name].size.var  = null;
    global_data.style[name].text = {};
    global_data.style[name].opa = {};
    // delete global_data.layers.features[name];

    removeLayerGestionMenu(name);

    if(name === 'node'){
        if (getLayerFromName(map,'link') !== null){
            // map.removeLayer(getLayerFromName(map,'link'))
            generateLinkLayer(map, data.links, data.hashedStructureData, global_data.style, global_data.ids.linkID[0], global_data.ids.linkID[1])
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
            .attr("data-toggle", "tooltip")
            .attr("data-placement", "right")
            .attr("title", "Remove the layer")
            .attr("data-animation", "false")
            .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")
        ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonHideLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("data-toggle", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Hide the layer")
                .attr("data-animation", "false")
                .append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
    )));


// 
    // document.getElementById("buttonChangeLayer" + name).addEventListener("click", function(){showChangeBaseLayerParameter(map, global_data.layers, "Change", name ,global_data.layers.base[name].style)}); 
    document.getElementById("buttonHideLayer" + name).addEventListener("click", function() {
       hideOSMLayer(name)
    });
    document.getElementById("buttonRemoveLayer" + name).addEventListener("click", function() {
        removeTileLayer(name)
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
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Remove the layer")
            .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")
        ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonChangeLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("data-target", "#changeBaseLayerModal")
                .attr("data-toggle", "modal")
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Change the style layer")
                .append("<img class='icon' src='assets/svg/si-glyph-brush-1.svg'/>")
        ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonHideLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Hide the layer")
                .append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
    )));



    document.getElementById("buttonChangeLayer" + name).addEventListener("click", function(){showChangeBaseLayerParameter(map, global_data.layers, "Change", name ,global_data.layers.base[name].style)}); 
    document.getElementById("buttonHideLayer" + name).addEventListener("click", function() {
       hideLayer(name)
    });
    document.getElementById("buttonRemoveLayer" + name).addEventListener("click", function() {
        removeLayer(name)
    });

}

export function addLayerImportGestionMenu(name) {


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
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Remove the layer")
            .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")
        ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonChangeLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("data-target", "#changeBaseLayerModal")
                .attr("data-toggle", "modal")
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Change the style layer")
                .append("<img class='icon' src='assets/svg/si-glyph-brush-1.svg'/>")
        ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonHideLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Hide the layer")
                .append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
    )));


// 
    document.getElementById("buttonChangeLayer" + name).addEventListener("click", function(){showChangeBaseLayerParameter(map, global_data.layers, "Change", name ,global_data.layers.import[name].style)}); 
    document.getElementById("buttonHideLayer" + name).addEventListener("click", function() {
       hideLayer(name)
    });
    document.getElementById("buttonRemoveLayer" + name).addEventListener("click", function() {
        removeLayer(name)
    });

}

function hideFLayer(name_layer) {
    var opa = getLayerFromName(map,name_layer).getOpacity();
    
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
    getLayerFromName(map,name_layer).setOpacity(opa)
}

function hideLayer(name_layer) {
    var opa = getLayerFromName(map,name_layer).getOpacity();
    
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
    getLayerFromName(map,name_layer).setOpacity(opa)
}



function hideOSMLayer(name_layer) {
    var opa = getLayerFromName(map,name_layer).getOpacity();
    
    if(opa>0){
        opa = 0
    }
    else{
        opa = 1
    }
    getLayerFromName(map,name_layer).setOpacity(opa)
}

export function addFLayerGestionMenu(name) {
    


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
                .attr("data-toggle", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Remove the layer")
                .attr("data-animation", "false")
                .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")
            ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonChangeLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("data-target", "#changeSemioModal")
                .attr("data-toggle", "modal")
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Change style of the layer")
                // .attr("data-animation", "false")
                .append("<img class='icon' src='assets/svg/si-glyph-brush-1.svg'/>")
            ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonHideLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("data-toggle", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Hide the layer")
                .attr("data-animation", "false")
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


export function addLinkLayerGestionMenu(name) {
    


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
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Remove the layer")
                .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")            
            ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonChangeGeoLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("data-target", "#changeGeometryModal")
                .attr("data-toggle", "modal")
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Change shape of the links")
                .append("<img class='icon' src='assets/svg/si-glyph-ruler.svg' />")
            ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonChangeLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("data-target", "#changeSemioLinkModal")
                .attr("data-toggle", "modal")
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Change style of the links")
                .append("<img class='icon' src='assets/svg/si-glyph-brush-1.svg'/>")
            ).append($("<button>")
                .attr("type", "button")
                .attr("id", "buttonHideLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .attr("rel", "tooltip")
                .attr("data-placement", "right")
                .attr("title", "Hide the layer")
                .append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
        )
    ));
    document.getElementById("buttonHideLayer" + name).addEventListener("click", function() {
       hideFLayer(name)
    });

    document.getElementById("buttonChangeGeoLayer" + name).addEventListener("click", function() {
       changeGeometryParameter(name, global_data.style.link)
    });

    document.getElementById("buttonRemoveLayer" + name).addEventListener("click", function() {
        removeFeaturesLayer(name)
    });
    document.getElementById("buttonChangeLayer" + name).addEventListener("click", function() {
        changeSemioParameter(name, global_data.style)
    });
    // console.log($('[rel="tooltip"]'))
    // $('[rel="tooltip"]').tooltip({placement:"right"}); 
}

function removeLayerGestionMenu(name) {
    $("#card" + name).remove();
}

//divide in two function encapsulated each type of function
export function getNameVariables(dataName){
  if(dataName==='node'){
    return Object.keys(data.hashedStructureData[Object.keys(data.hashedStructureData)[0]].properties);
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
