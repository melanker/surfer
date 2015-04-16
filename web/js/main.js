$(function (){
    var idAndClassesMap, updateChart, updateWaveInfo, updateWaveInfo, initFunction;

    idAndClassesMap = {
        ashdodChart: "#ashdodChart",
        haifaChart: "#haifaChart",
        ashdodStatus: ".ashdodStatus",
        haifaStatus: ".haifaStatus",
        upperNav: ".upperNav",
        openContactMe: ".openContactMe"
    };

    SurfInfo.webApp = {
        isMobile: false,
        contactMeJq: $("#contactMe"),
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
            "Haifa": "294801"
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
                    deferred.reject(status);
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
            }, function (data) {
                deferred.reject(data);
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
            heightJq.text(SurfInfo.webApp.charts[name + "Data"].dataHs[SurfInfo.webApp.charts[name + "Data"].dataHs.length - 1] + "m" + " - " +
                SurfInfo.webApp.charts[name + "Data"].dataHmax[SurfInfo.webApp.charts[name + "Data"].dataHmax.length - 1] + "m");
            dateJq.text(SurfInfo.webApp.charts[name + "Data"].data[0].day);
            hourJq.text(SurfInfo.webApp.charts[name + "Data"].dataTime[SurfInfo.webApp.charts[name + "Data"].dataTime.length - 1]);
            tempJq.html(SurfInfo.webApp.charts[name + "Data"].data[SurfInfo.webApp.charts[name + "Data"].data.length - 1].temp + "&deg");
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
            var form = $('#ajax-contact');

            $(form).submit(function(event) {
                var formData = $(form).serialize();
                SurfInfo.communication.http($(form).attr('action'), 'POST', $(form).serialize()).then(function(data) {

                });
                SurfInfo.webApp.contactMeJq.modal('hide');
                return false;
            });
        };

        initMailForm();
        toggleTab();
        SurfInfo.webApp.charts.ashdodData.loadingJq.show();
        SurfInfo.webApp.charts.haifaData.loadingJq.show();
        updateWaveInfo();
    } ();

});
