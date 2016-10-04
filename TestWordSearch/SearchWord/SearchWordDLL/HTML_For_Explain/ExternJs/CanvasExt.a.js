//Embarrased data struct

var CanvasOP = (function () {
    var Canvas = [],
        Context = [],
        x_width = 50,
        y_width = 50,
        ColorSet = [
            "#ffd9ad",                //1
            "burlywood",              //2
            "cadetblue",              //3
            "darksalmon",             //4
            "lightseagreen",          //5
            "#9dfdc8",                //6
            "khaki",                  //7
            "lightblue",              //8
            "lightgreen",             //9
            "#bad",                   //0
            "blue",
            "green",
            "yellow",
            "red",
            "gray",
            "slive"
        ];

    var addToOnLoad = function () {
        ExtContext();
    },
    ExtContext = function () {
        if (CanvasRenderingContext2D != null) {
            CanvasRenderingContext2D.prototype.fillArc = FillArcForContext;
            CanvasRenderingContext2D.prototype.drawLine = DrawLineForContext;
        }
    },
    //canvas_ can be the canvas element object or id or className and will return a Array .
    GetCanvas = function (canvas_) {
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
    },
    //Id : require , Id will allocate to the new canvas element 
    //Parent : not require , the parent element for the new canvas element
    //Class : not require , some stylesheet will be put on the new canvas element
    CreateCanvas = function (Id, Parent, Class) {
        var ele = document.createElement("canvas");
        ele.id = Id;
        ele.classList.add(Class);
        if (Parent instanceof Element) {
            Parent.appendChild(ele);
        }
        Canvas.push(ele);
        RefleshContext();
        return ele;
    },
    RefleshContext = function () {
        while (Context.length) {
            Context.pop();
        }
        Canvas.forEach(function (i) {
            Context.push(i.getContext("2d"));
        });
    },
    //Obj = {                       Required
    //    data: data,
    //    chi : []
    //}
    //xw : the x-dir width          Not Required default value is x_width
    //yw : the y-dir width          Not Required default value is y_width
    //the result is put the fitted location in data
    //local : {
    //    x: x,
    //    y: y
    //}
    //return Obj is the changed Obj
    LocalCalc = function (Obj, xw, yw) {
        if (Obj) {
            if (!xw) {
                xw = x_width;
            }
            if (!yw) {
                yw = y_width;
            }
            var level = [],         // record the total count of the every level have .
                cur_level= 0,       // record the current level is .
                chi = [],           // record current level chi count what have been visited .
                tObj = Obj,         // template copy Obj
                pObj = []           // parent Obj
            ;
            //Here have three rule about how to calculate the total count of every level .
            //First , if the current brunch's father or grandfather or grand-grand-father is not the first brunch ,
            //but the current brunch is the deepest , the total count is equal to the up-record .
            // [1 2 3 3 4] => [1 2 3 3 4 4]
            //Secondly , none of the node level count is less than the parent node .
            //意思是：没有哪一个点的记录数比其父节点记录数小
            //Thirdly , the pre-localation is unique and did stricted correct and isolated .
            level.push(0);
            chi.push(0);
            var isF = true;
            //level : 记录各层的对象数量
            //chi : 记录某一结点的子节点被访问的个数
            //tObj : 当前指向的节点
            //pObj : 父节点栈
            while (tObj) {
                //如果没有子节点，则表示该点位叶节点，应该回滚
                //if one node have not child node that it is the leaf node , it should be reroll .
                if (tObj.chi.length == 0) {
                    //对叶节点的操作：
                    //Operation for leaf node
                    //1、打入信息
                    //1.set attributes
                    var lar = level[cur_level];
                    //（1）判断该节点的相对位置是否和最右叶节点对齐，并对齐
                    //To judge whether the node is right and Try align the rightest node
                    if (level.length - 1 > cur_level) {
                        level.forEach(function (i) {
                            if (lar < i) {
                                lar = i;
                            }
                        });
                    }
                    lar += 1;
                    //（2）定位
                    //2.located
                    if (lar != level[cur_level]) {
                        //这里说明应该完全往下对其
                        //It is importanced that make all of the virtual or real node on the chain to be align .
                        for (var i = 0; i < level.length; i++) {
                            level[i] = lar + 1;
                        }
                        tObj.data.local = {
                            x: xw * (lar + 1),
                            y: yw * cur_level
                        }
                    } else {
                        tObj.data.local = {
                            x: xw * level[cur_level],
                            y: yw * cur_level
                        }
                    }
                    //2、回滚
                    //2.reroll
                    tObj = pObj.pop();
                    cur_level--;
                    chi.pop();
                    if (typeof chi[cur_level] != "undefined") {
                        chi[cur_level]++;
                    }
                }
                //如果该节点的子节点被访问完，则应该结束该节点的操作，并进行回滚
                //If all of the children of this node have been visited , 
                //it should be finish the operate for this node and reroll .
                else if (tObj.chi.length == chi[cur_level]) {
                    //对该节点的操作
                    //Operate for this node
                    //1、打入信息
                    //1.set attributes
                    var x_ = 0;
                    tObj.chi.forEach(function (i) {
                        x_ += i.data.local.x;
                    });
                    x_ /= tObj.chi.length;
                    tObj.data.local = {
                        x: x_,
                        y: yw * cur_level
                    }
                    //2、回滚
                    //2.reroll
                    tObj = pObj.pop();
                    cur_level--;
                    chi.pop();
                    if (typeof chi[cur_level] != "undefined") {
                        chi[cur_level]++;
                    }
                }
                //如果该节点还有未访问子节点，应该对其进行访问，并深入
                //If the node have child and have not all the children be visisted,
                //the child node should be visist .
                else {
                    //操作
                    //operation
                    //1、深入子节点
                    //1.visit the child node
                    //(1)记录当前结点入栈
                    //(1)keep the current information on the stack (array) .
                    pObj.push(tObj);
                    //(2)进入子节点
                    //(2)enter the child node
                    tObj = tObj.chi[chi[cur_level]];
                    //2、记录信息入栈
                    //keep and change the record
                    //(1)修改访问层
                    //(1)change the visit level information (level)
                    cur_level++;
                    //(2)记录当前访问层的对象数量
                    //(2)keep down the count of visit level
                    if (typeof level[cur_level] != "undefined") {
                        level[cur_level]++;
                        if (cur_level > 0) {
                            if (level[cur_level] < level[cur_level - 1]) {
                                level[cur_level] = level[cur_level - 1];
                            }
                        }
                    } else {
                        level.push(level[cur_level - 1]);
                    }
                    //(3)记录将访问的子节点位置索引(与当前位置为基)
                    //(3)keep the index of the child node (base on the current node)
                    if (typeof chi[cur_level] != "undefined") {
                        chi[cur_level]++;
                    } else {
                        chi.push(0);
                    }
                }
            }
        } else {
            return Obj;
        }
        return Obj;
    },
    //Obj
    //ox : offset x
    //oy : offset y
    //x  : up x
    //y  : up y
    DrawObj = function (Obj, ox, oy, x, y) {
        if (!ox) {
            ox = oy = 20;
        }
        if (Obj) {
            var x_ = Obj.data.local.x + ox,
                y_ = Obj.data.local.y + oy
            Obj.chi.forEach(function (i) {
                DrawObj(i,ox,oy,x_,y_);
            });
            if (x && y) {
                Context[0].drawLine(
                    x_,
                    y_,
                    x,
                    y,
                    ColorSet[Obj.data.color]
                );
            }
            Context[0].fillArc(
                Obj.data.r,
                x_,
                y_,
                0,
                2 * Math.PI,
                ColorSet[Obj.data.color]
            );
            if (Obj.ch) {
                fs = Context[0].fillStyle;
                Context[0].fillStyle = "black";
                Context[0].fillText(
                    Obj.ch,
                    x_ - Obj.data.r / 2,
                    Obj.data.r * 3 / 4 + y_
                );
                Context[0].fillStyle = fs;
            }
        }
    },
    DrawObj_1 = function (Obj, ox, oy, x, y) {
        if (!ox) {
            ox = oy = 20;
        }
        if (Obj) {
            var x_ = Obj.data.local.x + ox,
                y_ = Obj.data.local.y + oy
            Obj.chi.forEach(function (i) {
                DrawObj_1(i, ox, oy, x_, y_);
            });
            Context[0].fillArc(
                Obj.data.r,
                x_,
                y_,
                0,
                2 * Math.PI,
                ColorSet[Obj.data.color]
            );
            if (Obj.ch) {
                fs = Context[0].fillStyle;
                Context[0].fillStyle = "black";
                Context[0].fillText(
                    Obj.ch,
                    x_ - Obj.data.r / 2,
                    Obj.data.r * 3 / 4 + y_
                );
                Context[0].fillStyle = fs;
            }
        }
    },
    setFont = function (str) {
        Context.forEach(function (i) {
            i.font = str;
        });
    };

    function SetContext(index, Obj) {
        if (Context.length < index + 1) {
            return;
        } else {
            for (var i in Obj) {
                Context[index][i] = Obj[i];
            }
        }
    }

    //Obj format is 
    //Obj = {
    //    data: {},     //  
    //    chi : []      //  it is Obj Array . [Obj,Obj,...]
    //}
    //data format is 
    //data = {
    //    R: 1,                     //Required
    //    x: 1,                     //Requried
    //    y: 1,                     //Requried
    //    fromAng: 0,               //Not Requried
    //    toAng: 2 * Math.PI,       //Not Requried
    //    fillStyle: "red"          //Not Requried
    //}
    //ObjFn : it is draw the obj function                               //Required
    //Lfn : it is the function to draw the line connect to two object   //Not Required
    function DrawObject_1(Obj, ObjFn, Lfn) {
        if (!Lfn) {
            Lfn = function () { };
        }
    }

    //R is the radius               Required 
    //x is the x-pos                Required
    //y is the y-pos                Required
    //fromAng is the start angle    Not Required
    //toAng is the end angle        Not Required
    //fillStyle is the fill color   Not Required
    function FillArcForContext(R, x, y, fromAng, toAng, fillStyle) {
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
        context_.arc(x, y, R, start, end);
        context_.closePath();
        context_.fill();
        context_.fillStyle = fillStyle_;
    }

    //fromX the start point x-pos       Required
    //fromY the start point y-pos       Required
    //toX the end point x-pos           Required
    //toY the end point y-pos           Required
    //strokeStyle is the stroke color   Not Required
    function DrawLineForContext(fromX, fromY, toX, toY, strokeStyle) {
        var context_ = this,
            strokeStyle_ = context_.strokeStyle;
        if (strokeStyle) {
            context_.strokeStyle = strokeStyle;
        }
        context_.beginPath();
        context_.moveTo(fromX, fromY);
        context_.lineTo(toX, toY);
        context_.closePath();
        context_.stroke();
        context_.strokeStyle = strokeStyle_;
    }

    return {
        ColorSet:ColorSet,
        addToOnLoad: addToOnLoad,
        GetCanvas: GetCanvas,
        CreateCanvas: CreateCanvas,
        getContext: function () {
            return Context;
        },
        Canvas: Canvas,
        Context: Context,
        LocalCalc: LocalCalc,
        DrawObj: DrawObj,
        DrawObj_1: DrawObj_1,
        setFont : setFont
    }
})();

//wdvo'bImcfumcFiwdvcdFu
var CanvasOPAddOn = (function () {
    //Obj : CanvasOP
    //name_ : add on function name 
    var AddOn = function (Obj, name_) {
        if (!Obj) { return;}
        if (typeof name_ == "string") {
            if (name_ === "All" || name_ == "ALL") {
                for (var i in regeditFn) {
                    Obj[i] = regeditFn[i];
                }
            } else {
                if (regeditFn[name_]) {
                    Obj[name_] = regeditFn[name_];
                }
            }
        } else if (name_ instanceof Array) {
            name_.forEach(function (i) {
                AddOn(Obj, i);
            });
        }
    },
    regeditFn = {
        //SP FUN
        //Obj = {
        //    data : [],
        //    chi : []
        //}
        Dui: function (Obj, fn) {
            console.log("Dui");
            fn(Obj.data);
            Obj.forEach(function (i) {
                Dui(i, fn);
            });
        }
    }
    return {
        AddOn : AddOn
    };
})();

var TestData = (function () {
    //format using qianxu 
    //have is not null
    var testObj = function (data, format) {
        var Obj,
            pObj = {
                data: new data.constructor(),
                chi: [],
                label : "p"
            },
            ObjTemplate = function(data){
                var data_ = new data.constructor();
                data_.color = parseInt(Math.random() * 10);
                data_.r = 5;
                return {
                    data: data_,
                    chi : []
                };
            },
            Objt = pObj,
            level = 0,
            col = [0],
            pObj_ = [];
        pObj.data.color = 0;
        pObj.data.r = 5;
        format.forEach(function (i) {
            if (i) {
                Objt.chi.push(ObjTemplate(data));
                pObj_.push(Objt);
                Objt = Objt.chi[col[level]];
                col[level]++;
                col.push(0);
                level++;
            } else {
                col.pop();
                level--;
                Objt = pObj_.pop();
            }
        });
        return pObj;
    };
    var drawLine = function (len,r,y) {
        var o = {
            data: {
                r: 0,
                local : {
                    x: 0,
                    y: 0,
                },
                color: 0
            },
            chi : []
        };
        for (var i = 0; i < len; i++) {
            o.chi.push(
                {
                    chi: [],
                    data: {
                        local: {
                            x: 2.5 * r * i + 10,
                            y: y
                        },
                        r: r,
                        color : i
                    }
                }
            );
        }
        return o;
    };
    var drawLineWord = function (str, r, y) {
        var o = {
            data: {
                r: 0,
                local: {
                    x: 0,
                    y: 0,
                },
                color: 0
            },
            chi: []
        };
        for (var i = 0; i < str.length; i++) {
            o.chi.push(
                {
                    chi: [],
                    data: {
                        local: {
                            x: 2.5 * r * i + 10,
                            y: y
                        },
                        r: r,
                        color: 0,
                    },
                    ch: str[i]
                }
            );
        }
        return o;
    };
    return {
        tObj: testObj,
        drawLine: drawLine,
        drawLineWord: drawLineWord
    };
})();

var inlineTest = function () {
    return TestData.tObj(
        {
        },
        [
            1, 1, 1, 0, 0, 0,
               1, 1, 1, 0, 0,
                  1, 1, 0, 0,
                  1, 1, 0,
                     1, 0,
                     1, 0, 0, 0, 
               1, 1, 1, 0,
                     1, 0, 0, 0, 0 
        ]
    );
}

function d___() {
    var o = inlineTest();
    CanvasOP.LocalCalc(o, 20,20);
    CanvasOP.Context[0].clearRect(0, 0, 1000, 1000);
    CanvasOP.DrawObj(o);
    return o;
}

var CreateTestObj = (function () {
    var baseStr = "ABCDE".split(''),
        r = 5,
        ox = 20,
        oy = 20,
        len = 10,
        result = [],
        outObj = {},
        debugResult = function (result_) {
            if (result_ instanceof Array) {
                result = result_;
                outObj = getObj();
            }
            return result;
        },
        setOxOy = function (ox_, oy_) {
            if (ox_ && oy_) {
                ox = ox_;
                oy = oy_;
            }
            return [ox, oy];
        },
        setR = function (r_) {
            if (r_) {
                if (r_ > 0) {
                    r = r_;
                }
            }
            return r;
        },
        getObj = function () {
            var data_ = new Object();
            data_.color = 0;
            data_.r = r;
            return {
                data: data_,
                ch: '',
                chi: []
            };
        },
        setLen = function (len_) {
            if (len_) {
                len = len_;
            }
            return len;
        },
        setBaseStr = function(str){
            if (typeof str == "string") {
                baseStr = str.split('');
            }
            return baseStr;
        },
        CreateStr = function () {
            var strlen = baseStr.length;
            for (var i = 0; i < len; i++) {
                result.push(baseStr[parseInt(Math.random() * strlen)]);
            }
            return result;
        },
        Invoke = function (rebulid) {
            var pool = [];
            if (!result.length || rebulid) {
                result = [];
                outObj = getObj();
                CreateStr();
            }
            for (var i = 0; i < result.length; i++) {
                pool.push(outObj);
                for (var i_ = 0;i_ < pool.length;i_++) {
                    var isGet = false;
                    for (var j = 0; j < pool[i_].chi.length; j++) {
                        if (pool[i_].chi[j].ch == result[i]) {
                            isGet = true;
                            pool[i_] = pool[i_].chi[j];
                            pool[i_].data.color++;
                            break;
                        }
                    }
                    if (!isGet) {
                        var o = getObj();
                        o.ch = result[i];
                        pool[i_].chi.push(o);
                        pool[i_] = o;
                    }
                }
            }
            return outObj;
        },
        testDraw = function (rebulid) {
            var o = Invoke(rebulid);
            CanvasOP.Context[0].clearRect(0, 0, 1000, 1000);
            o = CanvasOP.LocalCalc(o, ox,oy);
            CanvasOP.setFont((r * 2) + "px Arial");
            CanvasOP.DrawObj(o, 30,120);
        };
    return {
        result: function () {
            return result;
        },
        outObj: outObj,
        setR: setR,
        setOxOy: setOxOy,
        setLen: setLen,
        setBaseStr:setBaseStr,
        CreateStr: CreateStr,
        Invoke: Invoke,
        testDraw: testDraw,
        debugResult: debugResult
    };
})();

function Invoke_CreateTestObj(len,str) {
    CreateTestObj.setR(10);
    CreateTestObj.setOxOy(10,30);
    CreateTestObj.setLen(len);
    CreateTestObj.setBaseStr(str);
    CreateTestObj.testDraw(true);
    CanvasOP.DrawObj_1(TestData.drawLine(CanvasOP.ColorSet.length, 20, 5));
    var o = TestData.drawLineWord(CreateTestObj.result(), 20, 55);
    CanvasOP.setFont("40px Arial");
    CanvasOP.DrawObj_1(o);
    return o;
}

function Invoke_CreateTestObj_1() {
    CreateTestObj.setR(10);
    CreateTestObj.setOxOy(40, 40);
    CreateTestObj.setLen(5);
    CreateTestObj.debugResult("CDDCE".split(''));
    CreateTestObj.testDraw();
    CanvasOP.DrawObj_1(TestData.drawLine(CanvasOP.ColorSet.length, 20, 5));
    var o = TestData.drawLineWord(CreateTestObj.result(), 20, 55);
    CanvasOP.setFont("40px Arial");
    CanvasOP.DrawObj_1(o);
    return o;
}















