/*
Last Update : 19/03/2019
Bapaume Thomas
*/
import {changeSemioParameter} from "./semiology.js";
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
                      global_data.layers.base[elem.textContent].setZIndex(- $listItem.index() )
                    }
                    if (typeof global_data.layers.features[elem.textContent] !== 'undefined')
                    {
                     global_data.layers.features[elem.textContent].setZIndex(- $listItem.index() )
                    }

                });
            }
        });
    });

   

export function changeZIndexLayer(name) {
    //len = layers.length;
    global_data.layers.base[name].setZIndex(document.getElementById(name + "ZindexSelector").value)
    // map.render()

}


export function changeZIndexFeaturesLayer(name) {
    //len = layers.length;
    global_data.layers.features[name].setZIndex(document.getElementById(name + "ZindexFSelector").value);


}

export function hasData() {
    if (typeof rawLinkData === "undefined") {
        alert("No Data Loaded")
        return false;
    }
    if (typeof rawGeoData === "undefined") {
        alert("No Data Loaded")
        return false;
    }
    return true;
}




export function removeLayer(name) {
    //len = layers.length;

    map.removeLayer(global_data.layers.base[name]);

    delete global_data.layers.base[name];
    removeLayerGestionMenu(name);
    //$("#layers").append($("<option>", {value:layerName, text:layerName}));
}


export function removeFeaturesLayer(name) {

    //len = layers.length;

    map.removeLayer(global_data.layers.features[name]);


    delete global_data.layers.features[name];

    removeLayerGestionMenu(name);
    //$("#Flayers").append($("<option>", {value:layerName, text:layerName}));

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
                .attr("id", "buttonHideLayer" + name)
                .attr("class", "close center-block ml-1")
                .attr("aria-label", "Close")
                .append("<img class='icon' src='assets/svg/si-glyph-view.svg'/>")
    )));

    //sel = document.getElementById("accordionLayerControl")
    // $("#accordionLayerControl").append($("<div>", {
    //     class: "card p-0",
    //     id: "card" + name
    // }));
    // $("#card" + name).append($("<div>", {
    //         class: "card-header",
    //         type: "button",
    //         text: name,
    //         id: "heading" + name
    //     }).attr("data-toggle", "collapse")
    //     .attr("data-toggle", "collapse")
    //     .attr("aria-expanded", "true")
    //     .attr("aria-expanded", "true")
    //     .attr("aria-controls", "collapse" + name)
    //     .attr("data-target", "#collapse" + name)
    //     .append($("<button>")
    //         .attr("type", "button")
    //         .attr("id", "buttonRemoveLayer" + name)
    //         .attr("class", "close center-block")
    //         .attr("aria-label", "Close")
    //         .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")
    //     ));
    // $("#card" + name).append($("<div>", {
    //         class: "collapse",
    //         id: "collapse" + name
    //     }).attr("data-toggle", "collapse")
    //     .attr("aria-labelledby", "headingFour")
    //     .attr("data-parent", "#accordionLayerControl"));
    // $("#collapse" + name).append($("<div>").attr("class", "card-body"));
    // $("#collapse" + name + ">div").append($("<div>").attr("class", "card-body"))
    // $("#collapse" + name + ">div>div").append($("<div>")
    //     .attr("class", "input-group-prepend")
    //     .append($("<input>")
    //         .attr("class", "btn btn-primary btn-block")
    //         .attr("id", "buttonChangeZindexLayer" + name)
    //         .attr("type", "button")
    //         .attr("value", "Change")

    //     )
    //     .append($("<input>")
    //         .attr("class", "form-control")
    //         .attr("type", "number")
    //         .attr("id", "ZindexSelector" + name)));

    document.getElementById("buttonHideLayer" + name).addEventListener("click", function() {
       hideLayer(name)
    });
    document.getElementById("buttonRemoveLayer" + name).addEventListener("click", function() {
        removeLayer(name)
    });
    // document.getElementById("buttonChangeZindexLayer" + name).addEventListener("click", function() {
    //     changeZIndexLayer(name)
    // });
}

function hideFLayer(name_layer) {
    var opa = global_data.layers.features[name_layer].getOpacity();
    console.log(opa)
    if(opa>0){
        opa = 0
    }
    else{
        opa = 0.8
    }
    global_data.layers.features[name_layer].setOpacity(opa)
}

function hideLayer(name_layer) {
    var opa = global_data.layers.base[name_layer].getOpacity();
    console.log(opa)
    if(opa>0){
        opa = 0
    }
    else{
        opa = 0.8
    }
    global_data.layers.base[name_layer].setOpacity(opa)
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
    //sel = document.getElementById("accordionLayerControl")
    // $("#accordionLayerControl").append($("<div>", {
    //     class: "card p-0",
    //     id: "card" + name
    // }));
    // $("#card" + name).append($("<div>", {
    //         class: "card-header",
    //         type: "button",
    //         text: name,
    //         id: "heading" + name
    //     }).attr("data-toggle", "collapse")
    //     .attr("data-toggle", "collapse")
    //     .attr("aria-expanded", "true")
    //     .attr("aria-controls", "collapse" + name)
    //     .attr("data-target", "#collapse" + name)
    //     .append($("<button>")
    //         .attr("type", "button")
    //         .attr("id", "buttonRemoveLayer" + name)
    //         .attr("class", "close center-block")
    //         .attr("aria-label", "Close")
    //         .append("<img class='icon' src='assets/svg/si-glyph-trash.svg'/>")
    //     )
    //     .append($("<button>")
    //         .attr("type", "button")
    //         .attr("id", "buttonChangeLayer" + name)
    //         .attr("class", "close center-block")
    //         .attr("aria-label", "Close")
    //         .attr("data-target", "#changeSemioModal")
    //         .attr("data-toggle", "modal")
    //         .append("<img class='icon' src='assets/svg/si-glyph-brush-1.svg'/>")
    //     ));
    document.getElementById("buttonHideLayer" + name).addEventListener("click", function() {
       hideFLayer(name)
    });

    document.getElementById("buttonRemoveLayer" + name).addEventListener("click", function() {
        removeFeaturesLayer(name)
    });
    document.getElementById("buttonChangeLayer" + name).addEventListener("click", function() {
        changeSemioParameter(name, global_data.style)
    });


    // $("#card" + name).append($("<div>", {
    //         class: "collapse",
    //         id: "collapse" + name
    //     }).attr("data-toggle", "collapse")
    //     .attr("aria-labelledby", "headingFour")
    //     .attr("data-parent", "#accordionLayerControl"));
    // $("#collapse" + name).append($("<div>").attr("class", "card-body"));
    // $("#collapse" + name + ">div").append($("<div>").attr("class", "card-body"))
    // $("#collapse" + name + ">div>div").append($("<div>")
    //     .attr("class", "input-group-prepend")
    //     .append($("<input>")
    //         .attr("class", "btn btn-primary btn-block")
    //         .attr("id", "buttonChangeZindexLayer" + name)
    //         .attr("type", "button")
    //         .attr("value", "Change")

    //     )
    //     .append($("<input>")
    //         .attr("class", "form-control")
    //         .attr("type", "number")
    //         .attr("id", "ZindexFSelector" + name)));

    // document.getElementById("buttonChangeZindexLayer" + name).addEventListener("click", function() {
    //     changeZIndexFeaturesLayer(name)
    // });
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
