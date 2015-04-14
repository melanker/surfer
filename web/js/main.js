$(function (){

    var idAndClassesMap, updateChart, updateWaveInfo, updateWaveInfo, buildChart, initFunction;

    idAndClassesMap = {
        ashdodChart: "#ashdodChart",
        haifaChart: "#haifaChart",
        ashdodStatus: ".ashdodStatus",
        haifaStatus: ".haifaStatus",
        upperNav: ".upperNav"
    };

    SurfInfo.webApp = {
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
        }
    };


    updateChart = function(name) {
        var dataLength = SurfInfo.webApp.charts[name + "Data"].data.length,
            chartData = SurfInfo.webApp.charts[name + "Data"].data;

        SurfInfo.webApp.charts[name + "Data"].dataHmax = [];
        SurfInfo.webApp.charts[name + "Data"].dataHs = [];
        SurfInfo.webApp.charts[name + "Data"].dataTime = [];

        for (var i = 1; i < dataLength; i += 1) {
            SurfInfo.webApp.charts[name + "Data"].dataHmax.push(chartData[i].hMax);
            SurfInfo.webApp.charts[name + "Data"].dataHs.push(chartData[i].hS);
            SurfInfo.webApp.charts[name + "Data"].dataTime.push(chartData[i].time);
        }

        $(idAndClassesMap[name + "Chart"]).highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: SurfInfo.webApp.charts[name + "Data"].data[0].day + "  " + SurfInfo.webApp.charts[name + "Data"].title || SurfInfo.webApp.charts[name + "Data"].title
            },
            xAxis: {
                categories: SurfInfo.webApp.charts[name + "Data"].dataTime
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
                data: SurfInfo.webApp.charts[name + "Data"].dataHmax
            }, {
                name: 'גל ממוצע',
                data: SurfInfo.webApp.charts[name + "Data"].dataHs
            }]
        });
    };


    SurfInfo.communication = {
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

    updateWaveInfo = function () {
        var parseHtml, buildData, initiateUpdateSeq, deferreds ;

        deferreds  = [];

        parseHtml = function(rowJq, day) {
            var currentRowJq = rowJq.find('td'),
                dataObj = {
                    day: day || "",
                    time: currentRowJq.eq(0).text() || "-",
                    hMax: parseFloat(currentRowJq.eq(1).text()) || "-",
                    hS: parseFloat(currentRowJq.eq(2).text()) || "-",
                    hThird: parseFloat(currentRowJq.eq(3).text()) || "-",
                    direction: currentRowJq.eq(4).text() || "-",
                    tAv: currentRowJq.eq(5).text() || "-",
                    tZ: currentRowJq.eq(6).text() || "-",
                    tP: currentRowJq.eq(7).text() || "-",
                    temp: currentRowJq.eq(8).text()
                };

            return dataObj;
        };

        buildData = function(url) {
            var deferred = $.Deferred();
            deferreds.push(deferred.promise());

            SurfInfo.communication.http(url, 'GET').then(function(data) {
                var todayWaves = [];

                $.each($(data).find("table").eq(0).find('tr'), function(key, val) {
                    todayWaves.push(parseHtml($(val), $(data).find("[size='+1']").eq(0).text()));
                });
                deferred.resolve(todayWaves);
            });

            return deferred.promise();
        };

        initiateUpdateSeq = function(data, name) {
            var heightJq = $(idAndClassesMap[name + "Status"] + " .height" ),
                timeJq = $(idAndClassesMap[name + "Status"] + " .time");


            SurfInfo.webApp.charts[name + "Data"].data = data;
            updateChart(name);
            heightJq.text(SurfInfo.webApp.charts[name + "Data"].dataHs[SurfInfo.webApp.charts[name + "Data"].dataHs.length - 1] + "m" + " - " +
                          SurfInfo.webApp.charts[name + "Data"].dataHmax[SurfInfo.webApp.charts[name + "Data"].dataHmax.length - 1] + "m");
            timeJq.text(SurfInfo.webApp.charts[name + "Data"].dataTime[SurfInfo.webApp.charts[name + "Data"].dataTime.length - 1] + "," +  SurfInfo.webApp.charts[name + "Data"].data[0].day);
            SurfInfo.webApp.charts[name + "Data"].loadingJq.hide();
        };

        buildData("/server/waves_prox.php?place=ashdod").then(function(data) {
            initiateUpdateSeq(data, "ashdod");
        });
        buildData("/server/waves_prox.php?place=haifa").then(function(data) {
            initiateUpdateSeq(data, "haifa");
        });

        if (SurfInfo.webApp.locationPath) {
            $.when.apply($, deferreds).then(function () {
                SurfInfo.initCity();
            });
        }
    };

    initFunction = function () {
        var toggleTab = function () {

            var upperNavJq = $(idAndClassesMap.upperNav),
                liJq = upperNavJq.find("li"),
                locationPath = window.location.pathname.replace(/\//g,'');

            SurfInfo.webApp.locationPath = locationPath;
            upperNavJq.find(".active").removeClass("active");

            switch (locationPath) {
                case "Netanya":
                    liJq.eq(3).tab('show');
                    break;
                case "Nahariya":
                    liJq.eq(1).tab('show');
                    break;
                case "Haifa":
                    liJq.eq(2).tab('show');
                    break;
                case "Herzliya":
                    liJq.eq(4).tab('show');
                    break;
                case "Tel-Aviv":
                    liJq.eq(5).tab('show');
                    break;
                case "Ashdod":
                    liJq.eq(6).tab('show');
                    break;
                default:
                    liJq.eq(0).tab('show');
            }
        };

        toggleTab();
        SurfInfo.webApp.charts.ashdodData.loadingJq.show();
        SurfInfo.webApp.charts.haifaData.loadingJq.show();
        updateWaveInfo();
    } ();

});
