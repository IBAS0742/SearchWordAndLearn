window.onload = function () {
    AddToOnLoad();
    init();
}

//for test initial
function init() {
    GetCanvas("canvas");
    SetContext(0,{
        fillStyle : "#bad"
    });
    Context[0].PointLinePoint(
        [
            {
                R: 10,
                x: 20,
                y: 20,
                index : 1
            }, {
                R: 10,
                x: 20,
                y: 20,
                index : 2
            }, {
                R: 10,
                x: 20,
                y: 20,
                index : 2
            }
        ],
        50,
        20,
        "#afa",
        function (Obj) {
            Obj[1] = {
                x: Obj[1].x + 2,
                y: Obj[1].y + 0.04 * Obj[1].x,
                R: Obj[1].R
            };
            Obj[2] = {
                x: Obj[2].x + 1,
                y: Obj[1].y,
                R : Obj[1].R
            }
            return Obj;
        },
        //Obj is all the information which will used in the interval function 
        //format is as follow
        //{
        //    Pobj : Pobj,
        //    LstrokeStyle : LstrokeStyle,
        //    Pfn : Pfn,
        //    Lfn : Lfn,
        //    context : context_
        //}
        function (Obj) {
            Obj.context.clearRect(0, 0, 500, 500);

        }
    )
}