webApp.communication = {
    http: function (url, method) {
        var deferred = $.Deferred();

        $.ajax({
            url: url,
            crossDomain: true,
            type: method,
            success: function (data) {
                deferred.resolve(data);
            }
        });
        return deferred.promise();
    }
};

webApp.getTime = function (time) {
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

webApp.formatDate = function (date) {
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], d = new Date(date);
    return months[d.getUTCMonth()] + " " + d.getUTCDate();
};