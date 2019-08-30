import {Fill, Stroke, Text, Style, Circle,RegularShape} from 'ol/style.js';

import {Point} from 'ol/geom.js';
import {getCenter} from 'ol/extent.js';
import {asArray} from 'ol/color.js'

import  {computeNodeDistanceCanvas, getD3ScalersForStyle} from "./layer.js"
// import * as d3scale from 'd3-scale'


// const d3 = Object.assign(d3base, d3color, d3scale)
// import * as d3 from 'd3'


export function simpleColoredStyle(opacity, stroke, fill){
    var strokeColor = asArray(stroke);
    var fillColor = asArray(fill);
    return new Style({
        stroke: new Stroke({
            color: 'rgba('+ strokeColor[0] +','+ strokeColor[1] +','+ strokeColor[2]+', '+ opacity+')',
            width: 1
          }),
          fill: new Fill({
            color: 'rgba('+ fillColor[0] +','+ fillColor[1] +','+ fillColor[2]+', '+ opacity+')'
          })
        })
    }



export function getFeatureStyle (feature) {
    // 
    // 
    return [
      new Style ({
        image: new Circle({
          radius: computeNodeDistanceCanvas('node', feature.get('pop'), global_data.style.ratioBounds, global_data.style)/ map.getView().getResolution(), 
          fill: new Fill ({
            color: [169,169,169,0.3],
            // opacity: 0.2
          }),
          stroke: new Stroke ({
            width: 2,
            color: [169,169,169,1],
            // opacity: 0.2
          })
        }),
        geometry: new Point(getCenter(feature.getGeometry().getExtent() ))
      })
      ,
      //       new Style ({
      //   image: new Circle({
      //     radius: computeNodeDistanceCanvas('node', feature.get('pop'), global_data.style.ratioBounds, global_data.style)/ (2 * map.getView().getResolution()), 
      //     fill: new Fill ({
      //       color: [0,0,255,.3],
      //     }),
      //     stroke: new Stroke ({
      //       width: 1,
      //       color: [0,0,255],
      //     })
      //   }),
      //   geometry: new Point(getCenter(feature.getGeometry().getExtent() ))
      // }),      
      //       new Style ({
      //   image: new Circle({
      //     radius: computeNodeDistanceCanvas('node', feature.get('pop'), global_data.style.ratioBounds, global_data.style)/ (4 * map.getView().getResolution()), 
      //     fill: new Fill ({
      //       color: [255,0,0,.3],
      //     }),
      //     stroke: new Stroke ({
      //       width: 1,
      //       color: [0,0,255],
      //     })
      //   }),
      //   geometry: new Point(getCenter(feature.getGeometry().getExtent() ))
      // }),
      // new Style ({
      //   radius: 150,
      //   stroke: new Stroke ({
      //     width: 2,
      //     color: [0,0,255]
      //   }),
      //   fill: new Fill ({
      //     color: [0, 255, 255, 0.2]
      //   })
      // })
    ];
  }

  export function getLinkFeatureStyle (feature) {
    

      var stroke = new Stroke({color: 'black', width: 2});
      var fill = new Fill({color: 'red'});

      var square = new Style({
          image: new RegularShape({
            fill: fill,
            stroke: stroke,
            points: 4,
            radius: feature.get('pop') * global_data.style.ratioBounds/ map.getView().getResolution(),
            angle: Math.PI / 4
          })
        })
    
    return [
      square,
      new Style ({
        stroke: new Stroke ({
          width: 1,
          color: [255,128,0]
        }),
        fill: new Fill ({
          color: "cyan"
        })
      })
    ];
  }

export function styleLinkPoly(feature){
    //width stupe
    if(global_data.style.link.size.var === 'fixed'){
    //color setup
  
        var zindex = 1 //impossible case//impossible case
         
    }
    else{//impossible case//impossible case//impossible case
        if(global_data.style.link.geometry.oriented === 'noOriented'){
         var zindex = - feature.get('size').value
        }
        else{
         var zindex = feature.get('size').value
        }
    }

    //color setup
    if (global_data.style.link.color.var === 'fixed'){

        var oColor = d3.color(global_data.style.link.color.palette)
        // get the corlor from a js object wer the name of the variable is link to 
    }
    else if (global_data.style.link.color.cat === 'categorical'){
        var oColor = d3.color(global_data.style.link.categorialOrderedColors[feature.get(global_data.style.link.color.var).toString()]) // get the corlor from a js object wer the name of the variable is link to 
    }    
    else if(global_data.style.link.color.cat === 'number'){
        var NormalizeColor = (feature.get('color').value-global_data.style.link.color.min)/(global_data.style.link.color.max-global_data.style.link.color.min) 
        // 
        var oColor = d3.color(d3["interpolate"+global_data.style.link.color.palette](NormalizeColor))
       // oColor.opacity = opacityFunciton

    
    }
   

    if (global_data.style.link.opa.var === 'fixed'){
        
        oColor.opacity = global_data.style.link.opa.vmax
    }
    else
    {
        var opascale = d3["scale"+global_data.style.link.opa.cat]().domain([0,Number(global_data.style.link.opa.vmax)]).range([Number(global_data.style.link.opa.min),Number(global_data.style.link.opa.max)])
        oColor.opacity= opascale(feature.get('opa').value)
    }
    var style = new Style({
         fill: new Fill({
            color: oColor.rgb().toString()
            // width: width + 1,
            // lineCap:'butt',
            //lineJoin:'miter'rgb(255,250,250)
        }),
        // stroke: new Stroke({
        //     color: "rgb(255,250,250,0.4)",
        //     width: 2
        //     // lineCap:'butt',
        //     //lineJoin:'miter'rgb(255,250,250)
        // }),
        zIndex: zindex,
        // text:new Text()

        });

    // style.getText().setText(feature.get(global_data.style.link.text));
    return style
}

export function styleNodeCircle(feature,scalers){
  
    if(global_data.style.node.size.cat === 'fixed'){
    //color setup
        var zindex = 1 //impossible case//impossible case Actually
         
    }
    else{
        
         var zindex = global_data.style.node.size.max - feature.get(global_data.style.node.size.var)
    }
    //color setup
    if (global_data.style.node.color.var === 'fixed'){

        var oColor = d3.color(global_data.style.node.color.palette)
        // get the corlor from a js object wer the name of the variable is link to 
    }

    else if (global_data.style.node.color.cat === 'categorical'){
        var oColor = d3.color(global_data.style.node.categorialOrderedColors[feature.get(global_data.style.node.color.var).toString()])
        // get the corlor from a js object wer the name of the variable is link to 
    }
    else if(global_data.style.node.color.cat === 'number'){
        
        // var NormalizeColor = (Number(feature.get(global_data.style.node.color.var))-global_data.style.node.color.min)/(global_data.style.node.color.max-global_data.style.node.color.min) 
        var oColor = d3.color(scalers.color(feature.get(global_data.style.node.color.var)))
       // oColor.opacity = opacityFunciton
    
    }
    
    if (global_data.style.node.opa.var === 'fixed'){
        oColor.opacity = global_data.style.node.opa.vmax
    }
    else
    {
     // var opascale = d3["scale"+global_data.style.node.opa.cat]().domain([0,Number(global_data.style.node.opa.vmax)]).range([Number(global_data.style.node.opa.min),Number(global_data.style.node.opa.max)])

     oColor.opacity= scalers.opa(Number(feature.get(global_data.style.node.opa.var)))
  }
    var style = new Style({
            fill: new Fill({
            color:  oColor.rgb().toString()
            }),
            stroke: new Stroke({
            color:  oColor.rgb().toString(),
            width:0
            }),
        zIndex: zindex,
        text:new Text()

        });

     style.getText().setText(feature.get(global_data.style.node.text));
    return style
}

export function applyGlobalNodeStyle(feature){
  if(feature.get('selected')){
    return styleNodeCircle(feature,getD3ScalersForStyle("node"))
  }
  else{
    return styleUnselectedNodeCircle(feature)
  }
}

export function styleUnselectedNodeCircle(feature){

    if(global_data.style.node.size.cat === 'fixed'){
    //color setup
        var zindex = 1 //impossible case//impossible case Actually
         
    }
    else{
        
         var zindex = global_data.style.node.size.max - feature.get(global_data.style.node.size.var)
    }

        var oColor = d3.color("#666666")
        oColor.opacity = 0.4// get the corlor from a js object wer the name of the variable is link to 

    var style = new Style({
            fill: new Fill({
            color:  oColor.rgb().toString()
            }),

        zIndex: zindex,
        // text:new Text()

        });

     // style.getText().setText(feature.get(global_data.style.node.text));
    return style
}

