//var CanvasExt = (function () {
    
//})();

var Canvas = [];

//The first step is get a canvas .

//canvas_ can be the canvas element object or id or className and will return a Array .
function GetCanvas(canvas_) {
    if (typeof canvas_ == "object") {
        Canvas = [canvas_];
    } else if (typeof canvas_ == "string") {
        Canvas = document.getElementById(canvas_);
        if (Canvas == null) {
            Canvas = Array.prototype.slice.call(document.getElementsByClassName(canvas_));
        } else {
            Canvas = [Canvas];
        }
    }
    return Canvas;
}

//Id : require , Id will allocate to the new canvas element 
//Parent : not require , the parent element for the new canvas element
//Class : not require , some stylesheet will be put on the new canvas element
function CreateCanvas(Id, Parent, Class) {
    var ele = document.createElement("canvas");
    ele.id = Id;
    ele.classList.add(Class);
    if (Parent instanceof Element) {
        Parent.appendChild(ele);
    }
    Canvas.push(ele);
    return ele;
}

function (){

}

//R is the radius               Required 
//x is the x-pos                Required
//y is the y-pos                Required
//fromAng is the start angle    Not Required
//toAng is the end angle        Not Required
//fillStyle is the fill color   Not Required
function FillArcForContext(R,x,y,fromAng,toAng,fillStyle){
    var context_ = this,
        start = 0,
        end = 2 * Math.PI,
        fillStyle_ = context_.fillStyle;
    if (fillStyle) {
        context_.fillStyle = fillStyle;
    }
    if (typeof fromAng == "number") {
        start = fromAng;
    }
    if (typeof toAng == "number") {
        end = toAng;
    }
    context_.beginPath();
    context_.arc(x,y,R,start,end);
    context_.closePath();
    context_.fill();
    context_.fillStyle = fillStyle_;
}

//fromX the start point x-pos       Required
//fromY the start point y-pos       Required
//toX the end point x-pos           Required
//toY the end point y-pos           Required
//strokeStyle is the stroke color   Not Required
function DrawLineForContext(fromX,fromY,toX,toY,strokeStyle) {
    var context_ = this,
        strokeStyle_ = context_.strokeStyle;
    if (strokeStyle) {
        context_.strokeStyle = strokeStyle;
    }
    context.beginPath();
    context_.moveTo(fromX,fromY);
    context_.lineTo(toX,toY);
    context_.closePath();
    context_.stroke();
    context_.strokeStyle = strokeStyle_;
}

//Pobj is the information of two points                         Required
//LstrokeStyle is the line strokeStyle                          Not Required
//times is how many times of the draw accous                    Required
//interval is the time length of everytime to Excute            Required
//Pfn is the point control function for two point               Not Required
//Lfn is the line control function                              Not Required
//Lfn param is [R,X,Y,r,x,y]
//Pobj = [{R,x,y,fromAng,toAng,fillStyle} , {r , x , y , fillStyle}]
///////////////////////
//test =->
//DrawPLPAForContext(
//    [
//        {
//            R : 10,
//            x : 20,
//            y : 20
//        },{
//            R : 10,
//            x : 20,
//            y : 20
//        }
//    ],
//    100,
//    200,
//    "#afa",
//    function(Obj){
//        Obj[1] = {
//            x : Obj[1].x + 10,
//            y : Obj[1].y + 10,
//            R : Obj[1].R
//        }
//    }
//)
function DrawPLPAForContext(Pobj,times,interval,LstrokeStyle,Pfn,Lfn) {
    var context_ = this;
    if (context_.PLPID) {
        clearInterval(context_.PLPID);
    }
    if (!(Pobj instanceof Array & Pobj.length == 2)) {
        return false;
    }
    if (times < 0) {
        times = 0;
    }
    if (!LstrokeStyle) {
        LstrokeStyle = context_.strokeStyle;
    }
    if (!Lfn) {
        //Obj = [r,x,y,r,x,y];
        Lfn = function(Obj){
            var xd = Obj.x[0] - Obj.x[1],
                yd = Obj.y[0] - Obj.y[1],
                rd = Obj.r[0] - Obj.r[1],
                big = 0,
                dis = Math.sqrt(xd * xd + yd * yd);
            if (rd <= dis) {
                if (Obj.x[0] > Obj.x[1]) {
                    big = 1;
                }
                if (xd) {
                    var atan = Math.atan(yd / xd),
                        sin = Math.sin(atan),
                        cos = Math.cos(atn);
                    if (Obj.y[big] > Obj.y[1 - big]) {
                        return [
                                    Obj.x[1 - big] + Obj.r[1 - big] * cos,
                                    Obj.y[1 - big] - Obj.r[1 - big] * sin,
                                    Obj.x[big] - Obj.r[big] * cos,
                                    Obj.y[big] + Obj.r[big]] * sin;
                    } else {
                        return [
                                    Obj.x[1 - big] + Obj.r[1 - big] * cos,
                                    Obj.y[1 - big] + Obj.r[1 - big] * sin,
                                    Obj.x[big] - Obj.r[big] * cos,
                                    Obj.y[big] - Obj.r[big]] * sin;
                    }
                } else {
                    if (Obj.y[0] > Obj.y[1]) {
                        return [Obj.x[0],Obj.y[1] + Obj.r[1],Obj.x[0],Obj.y[0] + Obj.r[0]];
                    } else {
                        return [Obj.x[0],Obj.y[0] + Obj.r[0],Obj.x[0],Obj.y[1] + Obj.r[1]];
                    }
                }
            } else {
                return [-1,-1,-1,-1];
            }
        };
    }
    CanvasRenderingContext2D.prototype.PLPIDTimes = times;
    CanvasRenderingContext2D.prototype.PLPIDCount = 0;
    context_.PLPID = setInterval(
        function(Obj){
            if (Obj.context.PLPIDCount == Obj.context.time) {
                clearInterval(Obj.context.PLPID);
            } else {
                var lineParam = {
                        x : [],
                        y : [],
                        r : []
                    },
                    lineObj;
                Obj.Pobj.forEach(function(i){
                    Obj.context.fillArc(i.R,i.x,i.y,i.fromAng,i.toAng,i.fillStyle);
                    lineParam.x.push(i.x);
                    lineParam.y.push(i.y);
                    lineParam.r.push(i.r);
                });
                Obj.Pobj = Pfn(Obj.Pobj);
                lineObj = Lfn(lineParam);
                Obj.context.drawLine(
                    lineObj.fromX,
                    lineObj.fromY,
                    lineObj.toX,
                    lineObj.toY,
                    Obj.strokeStyle
                )
            }
        },
        interval,
        {
            Pobj : Pobj,
            LstrokeStyle : LstrokeStyle,
            Pfn : Pfn,
            Lfn : Lfn,
            context : context_
        });
}

window.onload = function(){
    OverrideSetInterval();
}
function OverrideSetInterval(){
    if (setInterval) {
        window.setInterval_ = window.setInterval;
        window.setInterval = function(fn,time,param) {
            var callback = function(){
                return fn(param);
            }
            return window.setInterval_(callback,time);
        }
    }
}

function ExtContext(){
    if (CanvasRenderingContext2D != null) {
        CanvasRenderingContext2D.prototype.fillArc = FillArcForContext;
        CanvasRenderingContext2D.prototype.drawLine = DrawLineForContext;
        CanvasRenderingContext2D.prototype.PointLinePoint = DrawPLPAForContext;
        CanvasRenderingContext2D.prototype.PLPID = null;
        CanvasRenderingContext2D.prototype.PLPIDTimes = 0;
        CanvasRenderingContext2D.prototype.PLPIDCount = 0;
    }
}



