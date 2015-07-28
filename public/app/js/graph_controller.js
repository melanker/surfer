webApp.Graph = function(name) {

    var parseArrIntoFloat = function(arr) {
        var parsedArr = [];

        if (!arr || arr.length === 0) {return [];}

        for (var i=0; i < arr.length; i += 1) {
            parsedArr.push(parseFloat(arr[i]));
        }

        return parsedArr;
    };

    $(webApp.idAndClassesMap[name + "Chart"]).highcharts({
        chart: {
            type: 'areaspline',
            backgroundColor:'rgba(255, 255, 255, 0)'
        },
        title: {
            text: (webApp.charts[name + "Data"].data.date || "") + "  " + webApp.charts[name + "Data"].title,
            style: {
                color: "black",
                fontFamily: "monospace"
            }
        },
        legend: {
            color: "black",
            itemStyle: {
                color: "black",
                fontFamily: "monospace"
            }
        },
        xAxis: {
            categories: webApp.charts[name + "Data"].data.time || [],
            labels: {
                style: {
                    color: "black",
                    fontFamily: "monospace"
                }
            },
            lineWidth: 0,
            minorGridLineWidth: 0,
            lineColor: 'transparent',
            minorTickLength: 0,
            tickLength: 0
        },
        yAxis: {
            gridLineColor: 'white',
            title: {
                text: 'Height[meter]',
                style: {
                    color: "black",
                    fontFamily: "monospace"
                }
            },
            labels: {
                style: {
                    color: "black",
                    fontFamily: "monospace"
                }
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
            color: 'rgba(0, 0, 0, 0.95)',
            name: 'גל מקסימלי',
            data: parseArrIntoFloat(webApp.charts[name + "Data"].data.hMax) || []
        }, {
            name: 'גל מינימלי',
            data: parseArrIntoFloat(webApp.charts[name + "Data"].data.hS) || []
        }]
    });
};

