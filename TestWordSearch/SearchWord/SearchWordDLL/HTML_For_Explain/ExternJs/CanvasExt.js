//var CanvasExt = (function () {
    
//})();

var Canvas = [],
    Context = [];

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
    RefleshContext();
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
    RefleshContext();
    return ele;
}

function RefleshContext() {
    while (Context.length) {
        Context.pop();
    }
    Canvas.forEach(function (i) {
        Context.push(i.getContext("2d"));
    });
}

function SetContext(index, Obj) {
    if (Context.length < index + 1) {
        return;
    } else {
        for (var i in Obj) {
            Context[index][i] = Obj[i];
        }
    }
}

function R(){

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
    context_.beginPath();
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
//PIDFn is the funciton of the Interval function                Not Required
//Lfn is the line control function                              Not Required
//Lfn param is [R,X,Y,r,x,y]
//Pobj = [{R,x,y,fromAng,toAng,fillStyle} , {R,x,y,fromAng,toAng,fillStyle} ,... ]
///////////////////////
//test =->
//context.PointLinePoint(
//    [
//        {
//            R: 10,
//            x: 20,
//            y: 20
//        }, {
//            R: 10,
//            x: 20,
//            y: 20
//        }
//    ],
//    100,
//    200,
//    "#afa",
//    function (Obj) {
//        Obj[1] = {
//            x: Obj[1].x + 10,
//            y: Obj[1].y + 10,
//            R: Obj[1].R
//        }; return Obj;
//    }
//)
function DrawPLPAForContext(Pobj, times, interval, LstrokeStyle, Pfn, PIDFn, Lfn) {
    var context_ = this;
    if (context_.PLPID) {
        clearInterval(context_.PLPID);
    }
    if (!(Pobj instanceof Array & Pobj.length >= 2)) {
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
        Lfn = function (Obj) {
            return {
                fromX: Obj.x[0],
                fromY: Obj.y[0],
                toX: Obj.x[1],
                toY: Obj.y[1]
            }
        };
    }
    if (!PIDFn) {
        PIDFn = defaultPID;
    }
    CanvasRenderingContext2D.prototype.PLPIDTimes = times;
    CanvasRenderingContext2D.prototype.PLPIDCount = 0;
    context_.PLPID = setInterval(
        PIDFn,
        interval,
        {
            Pobj: Pobj,
            LstrokeStyle: LstrokeStyle,
            Pfn: Pfn,
            Lfn: Lfn,
            context: context_
        });
};

function defaultPID(Obj) {
    if (Obj.context.PLPIDCount == Obj.context.PLPIDTimes) {
        clearInterval(Obj.context.PLPID);
    } else {
        var lineParam = {
            x: [],
            y: [],
            r: []
        },
            lineObj;
        Obj.Pobj.forEach(function (i) {
            lineParam.x.push(i.x);
            lineParam.y.push(i.y);
            lineParam.r.push(i.r);
        });
        lineObj = Obj.Lfn(lineParam);
        //This is not strict , at the real project , here will be give a varrible .
        Obj.context.clearRect(0, 0, 500, 500);
        Obj.context.drawLine(
            lineObj.fromX,
            lineObj.fromY,
            lineObj.toX,
            lineObj.toY,
            Obj.strokeStyle
        );
        Obj.Pobj.forEach(function (i) {
            Obj.context.fillArc(i.R, i.x, i.y, i.fromAng, i.toAng, i.fillStyle);
        });
        Obj.Pobj = Obj.Pfn(Obj.Pobj);
        Obj.context.PLPIDTimes--;
    }
};

function defaultLfn(Obj){
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

function AddToOnLoad(){
    OverrideSetInterval();
    ExtContext();
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

function API() {
    //Obj is the Point information .
    //The format is as follow : 
    //[
    //     {R,x,y,index,fromAng,toAng,fillStyle} , 
    //     {R,x,y,index,fromAng,toAng,fillStyle} ,
    // ... ]
    Pfn = function (Obj) { }
    //Obj is all the information which will used in the interval function 
    //format is as follow
    //{
    //    Pobj : Pobj,
    //    LstrokeStyle : LstrokeStyle,
    //    Pfn : Pfn,
    //    Lfn : Lfn,
    //    context : context_
    //}
    PIDFn = function (Obj) { }
    //Obj is a object contains some points informations 
    //the format is as follow 
    //{
    //    x : [], // order by the points'
    //    y : [],
    //    r : []
    //}
    Lfn = function(Obj) { }
};













