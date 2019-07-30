import smooth from 'chaikin-smooth'
import {changeSelect} from "./semiology.js"

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

function simpleLinkNoOriented(point_base1, point_base2, arrow_size, width) {
    var startX = point_base1[0]
    var startY = point_base1[1]
    var endX = point_base2[0]
    var endY = point_base2[1]
    var angle = Math.atan2(endY - startY, endX - startX)

}
// create a simple arrow with en triangle head at a given ratio of the distance
function noOrientedStraightArrow(style, ori, dest, rad_ori, rad_dest , width) {
    var startX = ori[0]
    var startY = ori[1]
    var endX = dest[0]
    var endY = dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    var reducePointdest = getIntersection(dest,ori,rad_dest)
    var reducePointOri = getIntersection(ori,dest,rad_ori)

	var baseArrow = tranposeLine(reducePointOri, reducePointdest, width / 2);
	var topArrow = tranposeLine(reducePointdest, reducePointOri, width / 2);

   // 
    
    return baseArrow.concat(topArrow).concat([baseArrow[0]])
}

// create a simple arrow with en triangle head at a given ratio of the distance
function orientedStraightArrow(style, ori, dest, rad_ori, rad_dest , width) {
    var startX = ori[0]
    var startY = ori[1]
    var endX = dest[0]
    var endY = dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    var reducePointdest = getIntersection(dest,ori,rad_dest)
    var reducePointOri = getIntersection(ori,dest,rad_ori)

    var heigth_arrow = style.link.geometry.head.height
	var widthArrow = style.link.geometry.head.width

	var dist =  Math.sqrt((reducePointdest[0] - reducePointOri[0]) * (reducePointdest[0] - reducePointOri[0]) + (reducePointdest[1] - reducePointOri[1]) * (reducePointdest[1] - reducePointOri[1])) 
	var baseArrow = tranposeLine(reducePointOri, reducePointdest,  2.5 *style.ratioBounds);

    // var percentDist = heigth_arrow * Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY))
    //distance = Math.sqrt( (endX - startX)*(endX - startX )+ (endY - startY)*(endY - startY) ) * ratio_Arrow_Line;

	// var heigth_arrow = Math.min(heigth_arrow *width + width , 0.5* dist)
      // 
   // 
    var testWidth =  Math.min(heigth_arrow *width + width , 0.5 *dist)
    // topArrowpoint = [Math.cos(angle) * distance + startX, Math.sin(angle) * distance + startY]
    var topArrowpoint =  getIntersection(baseArrow[1], baseArrow[0],testWidth)
    var polyPoint = tranposeLine(baseArrow[0], topArrowpoint, width)
    var topArrowpoint =  tranposeLine(baseArrow[0], topArrowpoint, width + widthArrow * width)[1]
    // topArrowpoint = transposePointVerticalyFromLine(topArrowpoint, [baseArrow[0], baseArrow[1]], width + widthArrow * width )
   
    return [baseArrow[0], baseArrow[1],topArrowpoint, polyPoint[1], polyPoint[0], baseArrow[0]]
}

function orientedStraightNoHookArrow(style, ori, dest, rad_ori, rad_dest , width) {
    var startX = ori[0]
    var startY = ori[1]
    var endX = dest[0]
    var endY = dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    var reducePointdest = getIntersection(dest,ori,rad_dest)
    var reducePointOri = getIntersection(ori,dest,rad_ori)

    var heigth_arrow = style.link.geometry.head.height
    var widthArrow = style.link.geometry.head.width

    var dist =  Math.sqrt((reducePointdest[0] - reducePointOri[0]) * (reducePointdest[0] - reducePointOri[0]) + (reducePointdest[1] - reducePointOri[1]) * (reducePointdest[1] - reducePointOri[1])) 
    var baseArrow = tranposeLine(reducePointOri, reducePointdest,  2.5 *style.ratioBounds);

    // var percentDist = heigth_arrow * Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY))
    //distance = Math.sqrt( (endX - startX)*(endX - startX )+ (endY - startY)*(endY - startY) ) * ratio_Arrow_Line;

    // var heigth_arrow = Math.min(heigth_arrow *width + width , 0.5* dist)
      // 
   // 
    var testWidth =  Math.min(heigth_arrow *width + width , 0.5 *dist)
    // topArrowpoint = [Math.cos(angle) * distance + startX, Math.sin(angle) * distance + startY]
    var topArrowpoint =  getIntersection(baseArrow[1], baseArrow[0],testWidth)
    var polyPoint = tranposeLine(baseArrow[0], topArrowpoint, width)

    // topArrowpoint = transposePointVerticalyFromLine(topArrowpoint, [baseArrow[0], baseArrow[1]], width + widthArrow * width )
   
    return [baseArrow[0], baseArrow[1], polyPoint[1], polyPoint[0], baseArrow[0]]
}

function orientedTriangleArrow(style, ori, dest, rad_ori, rad_dest , width) {
    var startX = ori[0]
    var startY = ori[1]
    var endX = dest[0]
    var endY = dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    var reducePointdest = getIntersection(dest,ori,rad_dest)
    var reducePointOri = getIntersection(ori,dest,rad_ori)

    var heigth_arrow = style.link.geometry.head.height
    var widthArrow = style.link.geometry.head.width

    var dist =  Math.sqrt((reducePointdest[0] - reducePointOri[0]) * (reducePointdest[0] - reducePointOri[0]) + (reducePointdest[1] - reducePointOri[1]) * (reducePointdest[1] - reducePointOri[1])) 
    var baseArrow = tranposeLine(reducePointOri, reducePointdest, style.ratioBounds / 2);

    // var percentDist = heigth_arrow * Math.sqrt((endX - startX) * (endX - startX) + (endY - startY) * (endY - startY))
    //distance = Math.sqrt( (endX - startX)*(endX - startX )+ (endY - startY)*(endY - startY) ) * ratio_Arrow_Line;

    // var heigth_arrow = Math.min(heigth_arrow *width + width , 0.5* dist)

    var testWidth =  Math.min(heigth_arrow *width + width , dist)
    // topArrowpoint = [Math.cos(angle) * distance + startX, Math.sin(angle) * distance + startY]
    var topArrowpoint =  getIntersection(reducePointdest,reducePointOri,testWidth)
    var polyPoint = tranposeLine(baseArrow[0], topArrowpoint, width)

    // topArrowpoint = transposePointVerticalyFromLine(topArrowpoint, [baseArrow[0], baseArrow[1]], width + widthArrow * width )
   
    return [baseArrow[0], baseArrow[1], polyPoint[0], baseArrow[0]]
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



// function getPointFromDistance(Line, dist)

export function orientedCurveArrow(style, ori, dest, rad_ori, rad_dest, width){


	var base_curve = style.link.geometry.place.base
	var height_curve = style.link.geometry.place.height
	var heigth_arrow = style.link.geometry.head.height
	var widthArrow = style.link.geometry.head.width


    var startX = ori[0]
    var startY = ori[1]
    var endX = dest[0]
    var endY = dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    // compute the point from
    var reducePointdest = getIntersection(dest,ori,rad_dest)
    var reducePointOri = getIntersection(ori,dest,rad_ori)

    var dist = base_curve * Math.sqrt((reducePointdest[0] - reducePointOri[0]) * (reducePointdest[0] - reducePointOri[0]) + (reducePointdest[1] - reducePointOri[1]) * (reducePointdest[1] - reducePointOri[1]))
	var base_curve_point = [-Math.cos(angle) * dist + reducePointdest[0], -Math.sin(angle) * dist + reducePointdest[1]]

	// get Origin from the radius of the current nodes
	var center_curve_point = transposePointVerticalyFromLine(base_curve_point, [ori,dest], height_curve * dist)
	var max_curve_point = transposePointVerticalyFromLine(base_curve_point, [ori,dest], height_curve * dist + width/2)
	var min_curve_point = transposePointVerticalyFromLine(base_curve_point, [ori,dest], height_curve * dist - width/2)
	var newOri = getIntersection(ori,center_curve_point,rad_ori)
	// 
	var heigth_arrow = Math.min(heigth_arrow *width + width , 0.5* dist)
	var newDest = getIntersection(dest,center_curve_point,rad_dest + heigth_arrow) // The height of the arrow is added tested to see the result
	var pointArrow = getIntersection(dest,center_curve_point,rad_dest)
	//Compute the base 
	var angleFirst  =  Math.atan2(center_curve_point[1] - ori[1], center_curve_point[0] - ori[0])
	var angleSecond =  Math.atan2(center_curve_point[1] - dest[1], center_curve_point[0] - dest[0])
	var extremPointArrow = [transposePointVerticalyFromLine(newDest, [newDest,center_curve_point], width /2 +widthArrow * (width /2)), transposePointVerticalyFromLine(newDest, [newDest,center_curve_point], -(width /2 +(widthArrow *width/2))) ]
	
	newOri = [transposePointVerticalyFromLine(newOri, [newOri,center_curve_point], width/2), transposePointVerticalyFromLine(newOri, [newOri,center_curve_point], - width/2) ]
	newDest = [transposePointVerticalyFromLine(newDest, [newDest,center_curve_point], width/2), transposePointVerticalyFromLine(newDest, [newDest,center_curve_point], - width/2) ]

	var pathLow = [newOri[1], min_curve_point, newDest[0]]
	var pathHigh = [newDest[1], max_curve_point, newOri[0]]
	// draw the curve line
	pathLow = drawLine(pathLow,5)
	pathHigh = drawLine(pathHigh,5)

	//draw the arrow .concat([extremPointArrow[1]]).concat([pointArrow]).concat([extremPointArrow[0]])

	

	var Polygone = pathLow.concat([extremPointArrow[0]]).concat([pointArrow]).concat([extremPointArrow[1]]).concat(pathHigh).concat([pathLow[0]])
	return Polygone
}

export function orientedCurveOneArrow(style, ori, dest, rad_ori, rad_dest, width){


    var base_curve = style.link.geometry.place.base
    var height_curve = style.link.geometry.place.height
    var heigth_arrow = style.link.geometry.head.height
    var widthArrow = style.link.geometry.head.width


    var startX = ori[0]
    var startY = ori[1]
    var endX = dest[0]
    var endY = dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    // compute the point from
    var reducePointdest = getIntersection(dest,ori,rad_dest)
    var reducePointOri = getIntersection(ori,dest,rad_ori)
// 
    var dist = base_curve * Math.sqrt((reducePointdest[0] - reducePointOri[0]) * (reducePointdest[0] - reducePointOri[0]) + (reducePointdest[1] - reducePointOri[1]) * (reducePointdest[1] - reducePointOri[1]))
    var base_curve_point = [-Math.cos(angle) * dist + reducePointdest[0], -Math.sin(angle) * dist + reducePointdest[1]]
// 
    // get Origin from the radius of the current nodes
    var center_curve_point = transposePointVerticalyFromLine(base_curve_point, [ori,dest], height_curve * dist)
    var max_curve_point = transposePointVerticalyFromLine(base_curve_point, [ori,dest],height_curve * dist + width/2)
    var min_curve_point = transposePointVerticalyFromLine(base_curve_point, [ori,dest],height_curve * dist - width/2)
    var newOri = getIntersection(ori,center_curve_point,rad_ori)
    // 
    // var heigth_arrow = Math.min(heigth_arrow *width + width , 0.5* dist)
    var newDest = getIntersection(dest,center_curve_point,rad_dest) // The height of the arrow is added tested to see the result
    var pointArrow = getIntersection(dest,center_curve_point,rad_dest)
    //Compute the base 
    var angleFirst  =  Math.atan2(center_curve_point[1] - ori[1], center_curve_point[0] - ori[0])
    var angleSecond =  Math.atan2(center_curve_point[1] - dest[1], center_curve_point[0] - dest[0])
    // var extremPointArrow = [transposePointVerticalyFromLine(newDest, [newDest,center_curve_point], width /2 +widthArrow * (width /2)), transposePointVerticalyFromLine(newDest, [newDest,center_curve_point], -(width /2 +(widthArrow *width/2))) ]
    
    newOri = [transposePointVerticalyFromLine(newOri, [newOri,center_curve_point], width), transposePointVerticalyFromLine(newOri, [newOri,center_curve_point], - width) ]
    // newDest = [transposePointVerticalyFromLine(newDest, [newDest,center_curve_point], width/2), transposePointVerticalyFromLine(newDest, [newDest,center_curve_point], - width/2) ]

    var pathLow = [newOri[1], min_curve_point, pointArrow]
    var pathHigh = [pointArrow, max_curve_point, newOri[0]]
    // draw the curve line
    pathLow = drawLine(pathLow,5)
    pathHigh = drawLine(pathHigh,5)

    //draw the arrow .concat([extremPointArrow[1]]).concat([pointArrow]).concat([extremPointArrow[0]])

    

// 
    var Polygone = pathHigh.concat(pathLow)
    return Polygone
}


export function noOrientedCurveArrow(style, ori, dest, rad_ori, rad_dest, width){

	var base_curve = style.link.geometry.place.base
	var height_curve = style.link.geometry.place.height



    var startX = ori[0]
    var startY = ori[1]
    var endX = dest[0]
    var endY = dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

    // compute the point from
    var reducePointdest = getIntersection(dest,ori,rad_dest)
    var reducePointOri = getIntersection(ori,dest,rad_ori)

    var dist = base_curve * Math.sqrt((reducePointdest[0] - reducePointOri[0]) * (reducePointdest[0] - reducePointOri[0]) + (reducePointdest[1] - reducePointOri[1]) * (reducePointdest[1] - reducePointOri[1]))
	var base_curve_point = [-Math.cos(angle) * dist + reducePointdest[0], -Math.sin(angle) * dist + reducePointdest[1]]

	// get Origin from the radius of the current nodes
	var center_curve_point = transposePointVerticalyFromLine(base_curve_point, [ori,dest], height_curve * dist)
	var max_curve_point = transposePointVerticalyFromLine(base_curve_point, [ori,dest], height_curve * dist + width/2)
	var min_curve_point = transposePointVerticalyFromLine(base_curve_point, [ori,dest], height_curve * dist - width/2)
	var newOri = getIntersection(ori,center_curve_point,rad_ori)
	var newDest = getIntersection(dest,center_curve_point,rad_dest) // The height of the arrow is added tested to see the result
	// var pointArrow = getIntersection(dest,center_curve_point,rad_dest)
	//Compute the base 
	var angleFirst  =  Math.atan2(center_curve_point[1] - ori[1], center_curve_point[0] - ori[0])
	var angleSecond =  Math.atan2(center_curve_point[1] - dest[1], center_curve_point[0] - dest[0])
	// var extremPointArrow = [transposePointVerticalyFromLine(newDest, [dest,center_curve_point], width /2 ), transposePointVerticalyFromLine(newDest, [dest,center_curve_point], -(width /2)) ]
	newOri = [transposePointVerticalyFromLine(newOri, [ori,center_curve_point], width/2), transposePointVerticalyFromLine(newOri, [ori,center_curve_point], - width/2) ]
	newDest = [transposePointVerticalyFromLine(newDest, [dest,center_curve_point], width/2), transposePointVerticalyFromLine(newDest, [dest,center_curve_point], - width/2) ]

	var pathLow = [newOri[1], min_curve_point, newDest[0]]
	var pathHigh = [newDest[1], max_curve_point, newOri[0]]
	// draw the curve line
	pathLow = drawLine(pathLow,5)
	pathHigh = drawLine(pathHigh,5)

	//draw the arrow .concat([extremPointArrow[1]]).concat([pointArrow]).concat([extremPointArrow[0]])

	
	var Polygone = pathLow.concat(pathHigh).concat([pathLow[0]])
	return Polygone
}

window.noOrientedStraightArrow = noOrientedStraightArrow
window.noOrientedCurveArrow = noOrientedCurveArrow
window.orientedStraightArrow = orientedStraightArrow
window.orientedCurveArrow = orientedCurveArrow
window.orientedCurveOneArrow = orientedCurveOneArrow
window.noOrientedCurveOneArrow = orientedCurveOneArrow
window.orientedTriangleArrow = orientedTriangleArrow
window.noOrientedTriangleArrow = orientedTriangleArrow
window.orientedStraightNoHookArrow = orientedStraightNoHookArrow
window.noOrientedStraightNoHookArrow = orientedStraightNoHookArrow
// export function drawNoOrientedCurveLine(ori, dest, base_curve, height_curve, width)

function drawLine(path, iteration){
	var numIterations = iteration;
	while (numIterations > 0) {
          path = smooth(path);
          numIterations--;
        }
	return path;
}

export function changeGeometryParameter(name_layer, style){
    
  changeSelect($("#arrowDataChange").children('[value="'+ style.geometry.oriented+'"]'), "arrowDataChange" )
  changeSelect($("#arrowtypeChange").children('[value="'+ style.geometry.type+'"]'), "arrowtypeChange")
    showGeometryParameter('Change')
    if (style.geometry.type ==="CurveArrow" ||  style.geometry.type ==="CurveOneArrow"){
        document.getElementById("baseCurveArrowChange").value = style.geometry.place.base
        document.getElementById("heightCurveArrowChange").value = style.geometry.place.height
    }
    if (style.geometry.oriented === 'oriented' && style.geometry.type !=="TriangleArrow"  && style.geometry.type !=="CurveOneArrow"){
        document.getElementById("widthArrowChange").value = style.geometry.head.width
        document.getElementById("heightArrowChange").value = style.geometry.head.height
    }
}

function getIntersection(ori, dest, radius){
	var startX = ori[0]
    var startY = ori[1]
    var endX = dest[0]
    var endY = dest[1]
    var angle = Math.atan2(endY - startY, endX - startX)

	return [Math.cos(angle) * radius + startX, Math.sin(angle) * radius + startY]
}


export function addArrowSizeSelect(name = ''){
    
    if($("ArrowHeadSize"+name).children() !== null){
      $('#ArrowHeadSize'+name).children().remove()
    }

    var text = '" - Heigth: Choose the distance between the base and the arrow tip, the value is a percentage of the width of the link</br /> - Width: choose the base width of the arrow, the value represent a percentage of the arrow width"'
    // $("#ArrowHeadSize").append('<hr>')
    $("#ArrowHeadSize"+name).append('<label class="p-2 h5">Arrow Head <img class="small-icon" src="assets/svg/si-glyph-circle-info.svg" data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content='+text+' title="Arrow Size Parameter"/></label>')
	$("#ArrowHeadSize"+name).append($('<div>').attr('class', "row p-2"))
  	$("#ArrowHeadSize"+name+">div").append($('<div>')
                    .attr("class","col-md-6")

                    .append('<label class="text-muted h5">Heigth</label>')
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","heightArrow"+name)
                    .attr("min",0.0)
                    .attr("step",0.1)
                    .attr("max",10)
                    .attr("type",'number')
                    .attr("value",0.5)
                    )
                  )
                


    $("#ArrowHeadSize"+name+">div").append($('<div>')
                    .attr("class","col-md-6")
                    .append('<label class="text-muted h5">Width</label>')
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","widthArrow"+name)
                    .attr("min",0.0)
                    .attr("step",0.1)
                    .attr("max",10)
                    .attr("type",'number')
                    .attr("value",0.5)
                    )
                  )
$('[data-toggle="popover"]').popover()
}

export function drawArrow(style, ori, dest, rad_ori, rad_dest, distance){

	var selectedArrowType = style.link.geometry.type
	var isOriented = style.link.geometry.oriented
	return window[isOriented + selectedArrowType](style, ori, dest, rad_ori, rad_dest, distance)
}

export function addArrowPlaceCurveSelect(name = ''){
    if($("ArrowPlaceSize"+name).children() !== null){
      $('#ArrowPlaceSize'+name).children().remove()
    }

    var text = '"The curve is created by the chaikin algorithm </br /></br /> - Heigth: The value is the percentage of the distance between the origin and the destination used to define the maximum height of the link </br /> - Base: The value ([0,1]) is the center of the curve, the point is select by select a percentage of the distance from the origin node of the link "'
    // $("#ArrowPlaceSize").append('<hr>')
    $("#ArrowPlaceSize"+name).append('<label class="h5 p-2">Curve Arrow  <img class="small-icon" src="assets/svg/si-glyph-circle-info.svg" data-html="true" data-container="body" data-toggle="popover" data-placement="right" data-content='+text+' title="Arrow Size Parameter"/></label>')
	$("#ArrowPlaceSize"+name).append($('<div>').attr('class', "row p-2"))
  	$("#ArrowPlaceSize"+name+">div").append($('<div>')
                    .attr("class","col-md-6")
                    .append('<label class="text-muted h5">Heigth Curve</label>')
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","heightCurveArrow"+name)
                    .attr("min",0.0)
                    .attr("step",0.1)
                    .attr("max",10)
                    .attr("type",'number')
                    .attr("value",0.5)
                    )
                  )
                


    $("#ArrowPlaceSize"+name+">div").append($('<div>')
                    .attr("class","col-md-6")
                    .append('<label class="text-muted h5">Center Curve</label>')
                    .append($('<input>')
                    .attr('class','form-control')
                    .attr("id","baseCurveArrow"+name)
                    .attr("min",0.0)
                    .attr("step",0.1)
                    .attr("max",1)
                    .attr("type",'number')
                    .attr("value",0.5)
                    )
                  )
$('[data-toggle="popover"]').popover()
}


export function showGeometryParameter(name = ''){
	setupHead(name)
	setupArrowParameter(name)
}

export function setupArrowParameter(name = ''){

	if (document.getElementById("arrowtype"+name).value ==="CurveArrow" ||  document.getElementById("arrowtype"+name).value ==="CurveOneArrow"){
 		addArrowPlaceCurveSelect(name)
	}
	else{
    	if($("ArrowPlaceSize"+name).children() !== null){
      	$('#ArrowPlaceSize'+name).children().remove()
    }

	}
    setupHead(name)
}

export function setupHead(name = '')
{	
    
	if (document.getElementById("arrowData"+name).value === 'oriented' && document.getElementById("arrowtype"+name).value !=="TriangleArrow"  && document.getElementById("arrowtype"+name).value !=="CurveOneArrow"){
		addArrowSizeSelect(name)
	}
	else {
		if($("ArrowHeadSize"+name).children() !== null){
      		$('#ArrowHeadSize'+name).children().remove()
    	}
	}}

