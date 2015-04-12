$(function (){
    var webApp = {
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

    var idAndClassesMap = {
        ashdodChart: "#ashdodChart",
        haifaChart: "#haifaChart"
    };

    var updateChart = function(name) {
        var dataHmax = [],
            dataHs = [],
            dataTime = [],
            dataLength = webApp.charts[name + "Data"].data.length,
            chartData = webApp.charts[name + "Data"].data;

        for (var i = 1; i < dataLength; i += 1) {
            dataHmax.push(chartData[i].hMax);
            dataHs.push(chartData[i].hS);
            dataTime.push(chartData[i].time);
        }

        $(idAndClassesMap[name + "Chart"]).highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: webApp.charts[name + "Data"].data[0].day + "  " + webApp.charts[name + "Data"].title || webApp.charts[name + "Data"].title
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            xAxis: {
                categories: dataTime
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
                data: dataHmax
            }, {
                name: 'Wave Significant(High probability)',
                data: dataHs
            }]
        });
    };


    var communication = {
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

    var updateWaveInfo = function () {
        var parseHtml, buildData;

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

        buildData("/server/waves_prox.php?place=ashdod").then(function(data) {
            webApp.charts.ashdodData.data = data;
            updateChart("ashdod");
            webApp.charts.ashdodData.loadingJq.hide();
        });
        buildData("/server/waves_prox.php?place=haifa").then(function(data) {
            webApp.charts.haifaData.data = data;
            updateChart("haifa");
            webApp.charts.haifaData.loadingJq.hide();
        });

    };

    var buildChart = function(chartId) {
        $(chartId).highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: 'Average fruit consumption during one week'
            },
            legend: {
                layout: 'vertical',
                align: 'left',
                verticalAlign: 'top',
                x: 150,
                y: 100,
                floating: true,
                borderWidth: 1,
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
            },
            xAxis: {
                categories: dataTime,
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
                data: dataHmax
            }, {
                name: 'Wave Significant(High probability)',
                data: dataHs
            }]
        });
    };

    var initFunction = function (){
        webApp.charts.ashdodData.loadingJq.show();
        webApp.charts.haifaData.loadingJq.show();
        updateWaveInfo();
    } ();

});
