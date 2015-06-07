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

SurfInfo.prototype.prettyDate = function (date) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], d = new Date(date);

    return months[d.getUTCMonth()] + " " + d.getUTCDate();
};

