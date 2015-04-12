$(function (){
    var webApp, idAndClassesMap, updateChart, communication, updateWaveInfo, updateWaveInfo, buildChart, initFunction;

    idAndClassesMap = {
        ashdodChart: "#ashdodChart",
        haifaChart: "#haifaChart",
        ashdodStatus: ".ashdodStatus",
        haifaStatus: ".haifaStatus",
        upperNav: ".upperNav"
    };

    webApp = {
        charts: {
            ashdodData: {
                loadingJq: $(".ashdodLoading"),
                title: "Ashdod",
                day: "",
                data: []
            },
            haifaData: {
                loadingJq: $(".haifaLoading"),
                title: "Haifa",
                day: "",
                data: []
            }
        }
    };



    updateChart = function(name) {
        var dataLength = webApp.charts[name + "Data"].data.length,
            chartData = webApp.charts[name + "Data"].data;

        webApp.charts[name + "Data"].dataHmax = [];
        webApp.charts[name + "Data"].dataHs = [];
        webApp.charts[name + "Data"].dataTime = [];

        for (var i = 1; i < dataLength; i += 1) {
            webApp.charts[name + "Data"].dataHmax.push(chartData[i].hMax);
            webApp.charts[name + "Data"].dataHs.push(chartData[i].hS);
            webApp.charts[name + "Data"].dataTime.push(chartData[i].time);
        }

        $(idAndClassesMap[name + "Chart"]).highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: webApp.charts[name + "Data"].data[0].day + "  " + webApp.charts[name + "Data"].title || webApp.charts[name + "Data"].title
            },
            xAxis: {
                categories: webApp.charts[name + "Data"].dataTime
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
                name: 'Wave Max',
                data: webApp.charts[name + "Data"].dataHmax
            }, {
                name: 'Wave Significant(High probability)',
                data: webApp.charts[name + "Data"].dataHs
            }]
        });
    };


    communication = {
        http: function (url, method) {
            var deffered = $.Deferred();

            $.ajax({
                url: url,
                type: method,
                success: function (data) {
                    deffered.resolve(data);
                }
            });
            return deffered.promise();
        }
    };

    updateWaveInfo = function () {
        var parseHtml, buildData, initiateUpdateSeq;

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
                    tP: currentRowJq.eq(7).text() || "-"
                };

            return dataObj;
        };

        buildData = function(url) {
            var deffered = $.Deferred();

            communication.http(url, 'GET').then(function(data) {
                var todayWaves = [];

                $.each($(data).find("table").eq(0).find('tr'), function(key, val) {
                    todayWaves.push(parseHtml($(val), $(data).find("[size='+1']").eq(0).text()));
                });
                deffered.resolve(todayWaves);
            });

            return deffered.promise();
        };

        initiateUpdateSeq = function(data, name) {
            var heightJq = $(idAndClassesMap[name + "Status"] + " .height" ),
                timeJq = $(idAndClassesMap[name + "Status"] + " .time");

            webApp.charts[name + "Data"].data = data;
            updateChart(name);
            heightJq.text(webApp.charts[name + "Data"].dataHs[webApp.charts[name + "Data"].dataHs.length - 1] + "m" + " - " +
                          webApp.charts[name + "Data"].dataHmax[webApp.charts[name + "Data"].dataHmax.length - 1] + "m");
            timeJq.text(webApp.charts[name + "Data"].dataTime[webApp.charts[name + "Data"].dataTime.length - 1] + "," +  webApp.charts[name + "Data"].data[0].day)
            webApp.charts[name + "Data"].loadingJq.hide();
        };

        buildData("/server/waves_prox.php?place=ashdod").then(function(data) {
            initiateUpdateSeq(data, "ashdod");
        });
        buildData("/server/waves_prox.php?place=haifa").then(function(data) {
            initiateUpdateSeq(data, "haifa");
        });
    };

    buildChart = function(chartId) {
        $(chartId).highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Average fruit consumption during one week'
            },
            legend: {
            },
            xAxis: {
                categories: webApp.charts[name + "Data"].dataTime,
                plotBands: [{ // visualize the weekend
                    from: 4.5,
                    to: 6.5,
                    color: 'rgba(68, 170, 213, .2)'
                }]
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
                name: 'Wave Max',
                data: webApp.charts[name + "Data"].dataHmax
            }, {
                name: 'Wave Significant(High probability)',
                data: webApp.charts[name + "Data"].dataHs
            }]
        });
    };



    initFunction = function () {
        var toggleTab = function () {

            var upperNavJq = $(idAndClassesMap.upperNav),
                liJq = upperNavJq.find("li"),
                locationPath = window.location.pathname.replace(/\//g,'');

            upperNavJq.find(".active").removeClass("active");

            switch (locationPath) {
                case "Netanya":
                    liJq.eq(2).tab('show');
                    break;
                case "Haifa":
                    liJq.eq(1).tab('show');
                    break;
                case "Herzliya":
                    liJq.eq(3).tab('show');
                    break;
                case "Tel-Aviv":
                    liJq.eq(4).tab('show');
                    break;
                case "Ashdod":
                    liJq.eq(5).tab('show');
                    break;
                default:
                    liJq.eq(0).tab('show');
            }
        };

        toggleTab();
        webApp.charts.ashdodData.loadingJq.show();
        webApp.charts.haifaData.loadingJq.show();
        updateWaveInfo();
    } ();

});
