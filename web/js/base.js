var SurfInfo = function() {

};

SurfInfo.prototype.getTime = function (time) {
    var addZero = function(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    };

    var d = new Date(time);
    var h = addZero(d.getHours());
    var m = addZero(d.getMinutes());
    return  h + ":" + m;
};
