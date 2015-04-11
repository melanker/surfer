$(function (){
    var webApp = {
        charts: {
            ashdodData: {
                title: "Ashdod",
                day: "",
                data: []
            },
            haifaData: {
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

        if (name === "ashdod") {

        }

        for (var i = 1; i < dataLength; i += 1) {
            dataHmax.push(chartData[i].hMax);
            dataHs.push(chartData[i].hS);
            dataTime.push(chartData[i].time);
        }

        $(idAndClassesMap[name + "Chart"]).highcharts({
            title: {
                text: 'Average fruit consumption during one week'
            },
            xAxis: {
                categories: dataTime
            },
            series: [{
                name: 'Wave Max',
                data: dataHmax
            }, {
                name: 'Wave sig',
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

            communication.http("/server/waves_prox.php?place='ashdod'", 'GET').then(function(data) {
                var todayWaves = [];

                $.each($(data).find("table").eq(0).find('tr'), function(key, val) {
                    todayWaves.push(parseHtml($(val), $(data).find("[size='+1']").eq(0).text()));
                });
                deffered.resolve(todayWaves);
            });

            return deffered.promise();
        };

        buildData("/server/waves_prox.php?place='ashdod'").then(function(data) {
            webApp.charts.ashdodData.data = data;
            updateChart("ashdod");
        });
        buildData("/server/waves_prox.php?place='haifa'").then(function(data) {
            webApp.charts.haifaData.data = data;
        });

    };

    var buildChart = function(chartId) {
       return $(chartId).highcharts({
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
                categories: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday'
                ],
                plotBands: [{ // visualize the weekend
                    from: 4.5,
                    to: 6.5,
                    color: 'rgba(68, 170, 213, .2)'
                }]
            },
            yAxis: {
                title: {
                    text: 'Fruit units'
                }
            },
            tooltip: {
                shared: true,
                valueSuffix: ' units'
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
                data: [3, 4, 3, 5, 4, 10, 12]
            }, {
                name: 'Wave sig',
                data: [1, 3, 4, 3, 3, 5, 4]
            }]
        });
    };

    //setInterval(updateWaveInfo, 1000);
    var initFunction = function (){
        buildChart(idAndClassesMap.ashdodChart);
        buildChart(idAndClassesMap.haifaChart);
        updateWaveInfo();
    } ();

});
