var WindowExt = (function () {
    var OnloadExt = function (fn) {
        if (window) {
            var onload_ = window.onload;
            function OE() {
                if (onload_) {
                    onload_();
                }
                if (fn instanceof Array) {
                    fn.forEach(function (i) {
                        i();
                    });
                } else {
                    fn();
                }
            }
            setTimeout(OE, 100);
        }
    };
    return {
        Invoke: OnloadExt
    };
})();


















