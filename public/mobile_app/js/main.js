$(function (){
    var idAndClassesMap, updateChart, updateWaveInfo, initFunction;

    idAndClassesMap = {
        ashdodChart: "#ashdodChart",
        haifaChart: "#haifaChart",
        ashdodStatus: ".ashdodStatus",
        haifaStatus: ".haifaStatus",
        upperNav: ".upperNav"
    };

    SurfInfo.webApp = {
        isMobile: false,
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
        var parseArrIntoFloat = function(arr) {
            var parsedArr = [];

            if (!arr || arr.length === 0) {return [];}

            for (var i=0; i < arr.length; i += 1) {
                parsedArr.push(parseFloat(arr[i]) || 0);
            }

            return parsedArr;
        };

        $(idAndClassesMap[name + "Chart"]).highcharts({
            chart: {
                type: 'areaspline'
            },
            title: {
                text: (SurfInfo.webApp.charts[name + "Data"].data.date || "") + "  " + SurfInfo.webApp.charts[name + "Data"].title
            },
            xAxis: {
                categories: SurfInfo.webApp.charts[name + "Data"].data.time || []
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
                data: parseArrIntoFloat(SurfInfo.webApp.charts[name + "Data"].data.hMax) || []
            }, {
                name: 'גל ממוצע',
                data: parseArrIntoFloat(SurfInfo.webApp.charts[name + "Data"].data.hS) || []
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
        var getData, initiateUpdateSeq, deferreds ;

        deferreds  = [];

        getData = function(url) {
            var deferred = $.Deferred();
            deferreds.push(deferred.promise());

            SurfInfo.communication.http(url, 'GET').then(function(res) {
                deferred.resolve(res.data);
            });

            return deferred.promise();
        };

        initiateUpdateSeq = function(data, name) {
            var heightJq = $(idAndClassesMap[name + "Status"] + " .height" ),
                dateJq = $(idAndClassesMap[name + "Status"] + " .date"),
                hourJq = $(idAndClassesMap[name + "Status"] + " .hour"),
                tempJq = $(idAndClassesMap[name + "Status"] + " .temp");

            SurfInfo.webApp.charts[name + "Data"].data = data;
            updateChart(name);
            heightJq.text(SurfInfo.webApp.charts[name + "Data"].data.hS[SurfInfo.webApp.charts[name + "Data"].data.hS.length - 1] + "m" + " - " +
                          SurfInfo.webApp.charts[name + "Data"].data.hMax[SurfInfo.webApp.charts[name + "Data"].data.hMax.length - 1] + "m");
            dateJq.text(SurfInfo.webApp.charts[name + "Data"].data.date);
            hourJq.text(SurfInfo.webApp.charts[name + "Data"].data.time[SurfInfo.webApp.charts[name + "Data"].data.time.length - 1]);
            tempJq.html(SurfInfo.webApp.charts[name + "Data"].data.temperature[SurfInfo.webApp.charts[name + "Data"].data.temperature.length - 1] + "&deg");
            SurfInfo.webApp.charts[name + "Data"].loadingJq.hide();
        };

        getData("/api/waves/ashdod").then(function(data) {
            initiateUpdateSeq(data, "ashdod");
        });
        getData("/api/waves/haifa").then(function(data) {
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
                locationPath = window.location.pathname.replace(/\//g,''),
                activateTab;

            SurfInfo.webApp.isMobile = false;
            if (locationPath.indexOf("mobile") >= 0) {
                SurfInfo.webApp.isMobile = true;
                locationPath = locationPath.replace("mobile","");

            }

            SurfInfo.webApp.locationPath = locationPath;
            upperNavJq.find(".active").removeClass("active");
            upperNavJq.find(".ui-btn-active").removeClass("ui-btn-active ui-state-persist");

            activateTab = function () {
                if (SurfInfo.webApp.isMobile) {
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
                case "TelAviv":
                    activateTab.call(liJq.eq(4));
                    break;
                case "Ashdod":
                    activateTab.call(liJq.eq(5));
                    break;
                default:
                    activateTab.call(liJq.eq(6));
            }
        };

        toggleTab();
        SurfInfo.webApp.charts.ashdodData.loadingJq.show();
        SurfInfo.webApp.charts.haifaData.loadingJq.show();
        updateWaveInfo();
    } ();

});
