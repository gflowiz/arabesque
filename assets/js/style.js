import {Fill, Stroke, Text, Style, Circle} from 'ol/style.js';
import {asArray} from 'ol/color.js'
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




export function styleLinkPoly(feature){
    //width stupe
    if(global_data.style.link.size.var === 'fixed'){
    //color setup
  
        var zindex = 1 //impossible case//impossible case
         
    }
    else{//impossible case//impossible case//impossible case
         var zindex = feature.get(global_data.style.link.size.var)
    }

    //color setup
    if (global_data.style.link.color.var === 'fixed'){

        var oColor = d3.color(global_data.style.link.color.palette)
        // get the corlor from a js object wer the name of the variable is link to 
    }
    else if (global_data.style.link.color.cat === 'categorical'){
        var oColor = d3.color(global_data.style.link.categorialLinkOrderedColors[feature.get(global_data.style.link.color.var).toString()]) // get the corlor from a js object wer the name of the variable is link to 
    }    
    else if(global_data.style.link.color.cat === 'number'){
        var NormalizeColor = (feature.get(global_data.style.link.color.var)-global_data.style.link.color.min)/(global_data.style.link.color.max-global_data.style.link.color.min) 
        // console.log(NormalizeColor)
        var oColor = d3.color(d3["interpolate"+global_data.style.link.color.palette](NormalizeColor))
       // oColor.opacity = opacityFunciton

    
    }
   

    if (global_data.style.link.opa.var === 'fixed'){
        
        oColor.opacity = global_data.style.link.opa.vmax
    }
    else
    {
     var opascale = d3["scale"+global_data.style.link.opa.cat]().domain([0,Number(global_data.style.link.opa.vmax)]).range([Number(global_data.style.link.opa.min),Number(global_data.style.link.opa.max)])
     oColor.opacity= opascale(Number(feature.get(global_data.style.link.opa.var)))
  }
    var style = new Style({
         fill: new Fill({
            color: oColor.rgb().toString()
            // width: width + 1,
            // lineCap:'butt',
            //lineJoin:'miter'rgb(255,250,250)
        }),
        stroke: new Stroke({
            color: "rgb(255,250,250,0.4)",
            width: 2
            // lineCap:'butt',
            //lineJoin:'miter'rgb(255,250,250)
        }),
        zIndex: zindex,
        // text:new Text()

        });

    // style.getText().setText(feature.get(global_data.style.link.text));
    return style
}

export function styleNodeCircle(feature){

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
        var oColor = d3.color(global_data.style.node.categorialNodeOrderedColors[feature.get(global_data.style.node.color.var).toString()])
        // get the corlor from a js object wer the name of the variable is link to 
    }
    else if(global_data.style.node.color.cat === 'number'){
        
        var NormalizeColor = (Number(feature.get(global_data.style.node.color.var))-global_data.style.node.color.min)/(global_data.style.node.color.max-global_data.style.node.color.min) 
        var oColor = d3.color(d3["interpolate"+global_data.style.node.color.palette](NormalizeColor))
       // oColor.opacity = opacityFunciton
    
    }
    
    if (global_data.style.node.opa.var === 'fixed'){
        oColor.opacity = global_data.style.node.opa.vmax
    }
    else
    {
     var opascale = d3["scale"+global_data.style.node.opa.cat]().domain([0,Number(global_data.style.node.opa.vmax)]).range([Number(global_data.style.node.opa.min),Number(global_data.style.node.opa.max)])

     oColor.opacity= opascale(Number(feature.get(global_data.style.node.opa.var)))
  }
    var style = new Style({
            fill: new Fill({
            color:  oColor.rgb().toString()
            }),
            stroke: new Stroke({
            color:  oColor.rgb().toString(),
            width:2
            }),
        zIndex: zindex,
        text:new Text()

        });

     style.getText().setText(feature.get(global_data.style.node.text));
    return style
}




// function createCircle(radius) {
//   if (radius < 10){
//     return new Style({ image :new Circle({
//         radius: radius,
//         fill: new Fill({
//         color: 'rgba(0, 255, 0, 0.6)'
//     })
//         })
//     })
//     }
//     else{
//        return new Style({ image :new Circle({
//         radius: radius,
//         visible: false,
//         fill: new Fill({
//         color: 'rgba(0, 255, 0, 0.0)'

//     })
//         })
//     })
//     }

// };


// const stroke = new Stroke({color: 'black', width: 2});
//       const fill = new Fill({color: 'red'});




//       const style = new Style({
//         fill: new Fill({
//           color: 'rgba(255, 255, 255, 0.6)'
//         }),
//         stroke: new Stroke({
//           color: '#319FD3',
//           width: 1
//         }),
//         text: new Text()
//       });

//       var style2 = new Style({
//         fill: new Fill({
//           color: 'rgba(255, 128, 128, 0.6)'
//         }),
//         stroke: new Stroke({
//           color: '#319FD3',
//           width: 1
//         }),
//         text: new Text()
//       });

           
// const styles = {

//         'LineString': new Style({
//           stroke: new Stroke({
//             color: 'rgba(255, 0, 128, 0.5)',
//             width: 15
//           })
//         }),
//         'MultiLineString': new Style({
//           stroke: new Stroke({
//             color: 'green',
//             width: 1
//           })
//         }),

//         'MultiPolygon': new Style({
//           stroke: new Stroke({
//             color: 'yellow',
//             width: 1
//           }),
//           fill: new Fill({
//             color: 'rgba(255, 255, 0, 0.1)'
//           })
//         }),
//         'Polygon': new Style({
//           stroke: new Stroke({
//             color: 'blue',
//             width: 1
//           }),
//           fill: new Fill({
//             color: 'rgba(0, 0, 255, 0.4)'
//           })
//         })
//       };