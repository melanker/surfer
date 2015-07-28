webApp.Main = function() {
};

webApp.Main.prototype.getData = function getData(url) {
    return webApp.communication.http(url, "GET");
};

webApp.Main.prototype.setCity = function getData(name) {
    var heightJq = $(webApp.idAndClassesMap[name + "Status"] + " .height" ),
        dateJq = $(webApp.idAndClassesMap[name + "Status"] + " .date"),
        hourJq = $(webApp.idAndClassesMap[name + "Status"] + " .hour"),
        tempJq = $(webApp.idAndClassesMap[name + "Status"] + " .temp");


    heightJq.text(webApp.charts[name + "Data"].data.hS[webApp.charts[name + "Data"].data.hS.length - 1] + "m" + " - " +
                webApp.charts[name + "Data"].data.hMax[webApp.charts[name + "Data"].data.hMax.length - 1] + "m");
    dateJq.text(webApp.charts[name + "Data"].data.date);
    hourJq.text(webApp.charts[name + "Data"].data.time[webApp.charts[name + "Data"].data.time.length - 1]);
    tempJq.html(webApp.charts[name + "Data"].data.temperature[webApp.charts[name + "Data"].data.temperature.length - 1] + "&deg");
};


