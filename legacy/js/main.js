SurfInfo.prototype.data = {
    isMobile: false,
    requestCounter: 0,
    charts: {
        ashdodData: {
            loadingJq: $(".ashdodLoading"),
            title: "אשדוד",
            day: "",
            data: []
        },
        haifaData: {
            loadingJq: $(".haifaLoading"),
            title: "חיפה",
            day: "",
            data: []
        }
    },
    cityMapping: {
        "Ashdod": "295629",
        "Herzliyya": "294778",
        "Tel-Aviv": "293397",
        "Netanya": "294071",
        "Haifa": "294801",
        "Nahariya": "294117"
    },
        idAndClassesMap: {
        ashdodChart: "#ashdodChart",
        haifaChart: "#haifaChart",
        ashdodStatus: ".ashdodStatus",
        haifaStatus: ".haifaStatus",
        upperNav: ".upperNav",
        openContactMe: ".openContactMe"
    }
};

SurfInfo.prototype.updateChart = function(name) {
    var thisSurfInfo = this,
        dataLength = thisSurfInfo.data.charts[name + "Data"].data.length,
        chartData = thisSurfInfo.data.charts[name + "Data"].data;


    thisSurfInfo.data.charts[name + "Data"].dataHmax = [];
    thisSurfInfo.data.charts[name + "Data"].dataHs = [];
    thisSurfInfo.data.charts[name + "Data"].dataTime = [];

    for (var i = 1; i < dataLength; i += 1) {
        thisSurfInfo.data.charts[name + "Data"].dataHmax.push(chartData[i].hMax);
        thisSurfInfo.data.charts[name + "Data"].dataHs.push(chartData[i].hS);
        thisSurfInfo.data.charts[name + "Data"].dataTime.push(chartData[i].time);
    }

    $(thisSurfInfo.data.idAndClassesMap[name + "Chart"]).highcharts({
        chart: {
            type: 'areaspline'
        },
        title: {
            text: thisSurfInfo.data.charts[name + "Data"].data[0].day + "  " + thisSurfInfo.data.charts[name + "Data"].title || thisSurfInfo.data.charts[name + "Data"].title,
            style: {
                "color": "#333", "fontSize": "16px", "fontWeight": "bold", "fontFamily": "almoni-dl-regular, Arial"
            }
        },
        xAxis: {
            categories: thisSurfInfo.data.charts[name + "Data"].dataTime
        },
        yAxis: {
            title: {
                text: 'Height[meter]'
            }
        },
        tooltip: {
            shared: true,
            valueSuffix: ' meter'
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            areaspline: {
                fillOpacity: 0.5
            }
        },
        series: [{
            name: 'גל מקסימלי',
            data: thisSurfInfo.data.charts[name + "Data"].dataHmax
        }, {
            name: 'גל ממוצע',
            data: thisSurfInfo.data.charts[name + "Data"].dataHs
        }]
    });
};

SurfInfo.prototype.communication = {
    http: function (url, method, data) {
        var deferred = $.Deferred();

        $.ajax({
            url: url,
            crossDomain: true,
            type: method,
            data: data,
            success: function (data) {
                deferred.resolve(data);
            },
            error: function(request, status, error) {
                deferred.reject({"error": error, "status": status});
            }
        });
        return deferred.promise();
    }
};

SurfInfo.prototype.updateWaveInfo = function () {
    var parseHtml, buildData, initiateUpdateSeq, deferreds, thisSurfInfo = this;

    deferreds  = [];

    parseHtml = function(rowJq, day) {
        var currentRowJq = rowJq.find('td'),
            dataObj = {
                day: day || "0",
                time: currentRowJq.eq(0).text() || "0",
                hMax: parseFloat(currentRowJq.eq(1).text()) || 0,
                hS: parseFloat(currentRowJq.eq(2).text()) || 0,
                hThird: parseFloat(currentRowJq.eq(3).text()) || "0",
                direction: currentRowJq.eq(4).text() || "0",
                tAv: currentRowJq.eq(5).text() || "0",
                tZ: currentRowJq.eq(6).text() || "0",
                tP: currentRowJq.eq(7).text() || "0",
                temp: currentRowJq.eq(8).text() || "0"
            };

        return dataObj;
    };

    buildData = function(url) {
        var deferred = $.Deferred();
        deferreds.push(deferred.promise());

        thisSurfInfo.communication.http(url, 'GET').then(function(data) {
            var todayWaves = [];

            $.each($(data).find("table").eq(0).find('tr'), function(key, val) {
                todayWaves.push(parseHtml($(val), $(data).find("[size='+1']").eq(0).text()));
            });
            deferred.resolve(todayWaves);
        }, function (data) {
            deferred.reject(data);
        });

        return deferred.promise();
    };

    initiateUpdateSeq = function(data, name) {
        var heightJq = $(thisSurfInfo.data.idAndClassesMap[name + "Status"] + " .height" ),
            dateJq = $(thisSurfInfo.data.idAndClassesMap[name + "Status"] + " .date"),
            hourJq = $(thisSurfInfo.data.idAndClassesMap[name + "Status"] + " .hour"),
            tempJq = $(thisSurfInfo.data.idAndClassesMap[name + "Status"] + " .temp");

        thisSurfInfo.data.charts[name + "Data"].data = data;
        thisSurfInfo.updateChart(name);
        heightJq.text(thisSurfInfo.data.charts[name + "Data"].dataHs[thisSurfInfo.data.charts[name + "Data"].dataHs.length - 1] + "m" + " - " +
            thisSurfInfo.data.charts[name + "Data"].dataHmax[thisSurfInfo.data.charts[name + "Data"].dataHmax.length - 1] + "m");
        dateJq.text(thisSurfInfo.data.charts[name + "Data"].data[0].day);
        hourJq.text(thisSurfInfo.data.charts[name + "Data"].dataTime[thisSurfInfo.data.charts[name + "Data"].dataTime.length - 1]);
        tempJq.html(thisSurfInfo.data.charts[name + "Data"].data[thisSurfInfo.data.charts[name + "Data"].data.length - 1].temp + "&deg");
        $("." + name + "Loading").hide();
    };

    buildData("/server/waves_prox.php?place=ashdod").then(function(data) {
        initiateUpdateSeq(data, "ashdod");
    });
    buildData("/server/waves_prox.php?place=haifa").then(function(data) {
        initiateUpdateSeq(data, "haifa");
    });

    if (thisSurfInfo.data.locationPath) {
        $.when.apply($, deferreds).then(function () {
            thisSurfInfo.initCity();
        });
    }
};

SurfInfo.prototype.initFunction = function () {
    var thisSurfInfo = this;

    var toggleTab = function () {

        var upperNavJq = $(thisSurfInfo.data.idAndClassesMap.upperNav),
            liJq = upperNavJq.find("li"),
            locationPath = window.location.pathname.replace(/\//g,''),
            activateTab;

        thisSurfInfo.data.isMobile = false;
        if (locationPath.indexOf("mobile") >= 0) {
            thisSurfInfo.data.isMobile = true;
            locationPath = locationPath.replace("mobile","");

        }

        thisSurfInfo.data.locationPath = locationPath;
        upperNavJq.find(".active").removeClass("active");
        upperNavJq.find(".ui-btn-active").removeClass("ui-btn-active ui-state-persist");

        activateTab = function () {
            if (thisSurfInfo.data.isMobile) {
                this.find("a").addClass("ui-btn-active ui-state-persist");
            } else {
                this.tab("show");
            }
        };

        switch (locationPath) {
            case "Netanya":
                activateTab.call(liJq.eq(2));
                break;
            case "Nahariya":
                activateTab.call(liJq.eq(0));
                break;
            case "Haifa":
                activateTab.call(liJq.eq(1));
                break;
            case "Herzliyya":
                activateTab.call(liJq.eq(3));
                break;
            case "Tel-Aviv":
                activateTab.call(liJq.eq(4));
                break;
            case "Ashdod":
                activateTab.call(liJq.eq(5));
                break;
            default:
                activateTab.call(liJq.eq(6));
        }
    };

    var initMailForm = function() {
        var form = $('#ajax-contact'),
            contactMeJq = $("#contactMe");

        $(form).submit(function(event) {
            var formData = $(form).serialize();
            thisSurfInfo.communication.http($(form).attr('action'), 'POST', $(form).serialize()).then(function(data) {

            }, function (data) {
                var notifyJq = $("#notifyDialog");
                setTimeout(function () {notifyJq.modal("show")}, 1000);
                notifyJq.find("p").text("בעיה עם שליחת המייל, יתכן והמייל שהזנת לא תקין. נסה שוב");
                setTimeout(function () {notifyJq.modal("hide")}, 8000);
            });
            contactMeJq.modal('hide');
            contactMeJq.find("input, textarea").val('');
            return false;
        });
    };

    initMailForm();
    toggleTab();
    thisSurfInfo.data.charts.ashdodData.loadingJq.show();
    thisSurfInfo.data.charts.haifaData.loadingJq.show();
    thisSurfInfo.updateWaveInfo();
};

jQuery(function(){
    var surfInfo = new SurfInfo();
    surfInfo.initFunction();
});


