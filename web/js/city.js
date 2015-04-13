$(function () {


    SurfInfo.initCity = function () {
        var dataObj = {},
            self = this,
            populateCityTable,
            prepareReport


        populateCityTable = function() {
            var weatherCurrentJq = $(".weatherCurrent");


            weatherCurrentJq.find('.cloudsImg').css("background", "url(/styles/img/"+ dataObj.weather[0].icon + ".png) no-repeat");
            weatherCurrentJq.find('.temp').text(dataObj.main.temp.toPrecision(4) + "c");

            if (SurfInfo.webApp.locationPath === "Haifa") {
                weatherCurrentJq.find(".waves").text(SurfInfo.webApp.charts.haifaData.dataHs[SurfInfo.webApp.charts.haifaData.dataHs.length - 1] + "m");
                weatherCurrentJq.find(".seaTemp").text(parseFloat(SurfInfo.webApp.charts.haifaData.data[SurfInfo.webApp.charts.haifaData.data.length - 1].temp) + "c");

            } else if (SurfInfo.webApp.locationPath === "Ashdod") {
                weatherCurrentJq.find(".waves").text(SurfInfo.webApp.charts.ashdodData.dataHs[SurfInfo.webApp.charts.ashdodData.dataHs.length - 1] + "m");
                weatherCurrentJq.find(".seaTemp").text(parseFloat(SurfInfo.webApp.charts.ashdodData.data[SurfInfo.webApp.charts.ashdodData.data.length - 1].temp) + "c");
            } else {
                if (SurfInfo.webApp.charts.ashdodData.data[0].day === SurfInfo.webApp.charts.haifaData.data[0].day) {
                    weatherCurrentJq.find(".waves").text(((SurfInfo.webApp.charts.ashdodData.dataHs[SurfInfo.webApp.charts.ashdodData.dataHs.length -1] +
                      SurfInfo.webApp.charts.haifaData.dataHs[SurfInfo.webApp.charts.haifaData.dataHs.length - 1]) / 2).toPrecision(3) + "m");

                    weatherCurrentJq.find(".seaTemp").text(((parseFloat(SurfInfo.webApp.charts.ashdodData.data[SurfInfo.webApp.charts.ashdodData.data.length -1].temp) +
                        parseFloat(SurfInfo.webApp.charts.haifaData.data[SurfInfo.webApp.charts.haifaData.data.length - 1].temp)) / 2).toPrecision(4) + "c");
                } else {
                    weatherCurrentJq.find(".waves").text(SurfInfo.webApp.charts.ashdodData.dataHs[SurfInfo.webApp.charts.ashdodData.dataHs.length -1] + "m");
                    weatherCurrentJq.find(".seaTemp").text(parseFloat(SurfInfo.webApp.charts.ashdodData.data[SurfInfo.webApp.charts.ashdodData.data.length - 1].temp) + "c");
                }
            }

            weatherCurrentJq.find(".speed").text((dataObj.wind.speed * 1.94384).toPrecision(4) + " knot");
            weatherCurrentJq.find(".direction").css({"background": "url(/styles/img/wa-sprite.png) -50px -1040px no-repeat",
                                                    '-webkit-transform' : 'rotate('+ dataObj.wind.deg +'deg)',
                                                    '-moz-transform' : 'rotate('+ dataObj.wind.deg +'deg)',
                                                    '-ms-transform' : 'rotate('+ dataObj.wind.deg +'deg)',
                                                    'transform' : 'rotate('+ dataObj.wind.deg +'deg)'});

            console.log(dataObj.wind);
            weatherCurrentJq.find(".sunset").text(SurfInfo.getTime(dataObj.sys.sunset * 1000));
            weatherCurrentJq.find(".sunrise").text(SurfInfo.getTime(dataObj.sys.sunrise * 1000));
            weatherCurrentJq.show();
        };

        prepareReport = function() {
            var windDirection;

            if (dataObj.wind.deg >= 80 && dataObj.wind.deg <= 100) {
                windDirection = "מזרחית";
            } else if ((dataObj.wind.deg > 100 && dataObj.wind.deg < 170)){
                windDirection = "דרומית מזרחית";
            }  else if ((dataObj.wind.deg >= 170 && dataObj.wind.deg <= 190)){
                windDirection = "דרומית";
            }  else if ((dataObj.wind.deg > 190 && dataObj.wind.deg < 260)){
                windDirection = "מערבית דרומית";
            }  else if ((dataObj.wind.deg >= 260 && dataObj.wind.deg <= 280)){
                windDirection = "מערבית";
            }  else if ((dataObj.wind.deg > 280 && dataObj.wind.deg < 360)){
                windDirection = "מערבית צפונית";
            }  else if ((dataObj.wind.deg >= 360 && dataObj.wind.deg <= 10)){
                windDirection = "צפונית";
            } else {
                windDirection = "צפונית מזרחית";
            }


        };

        self.communication.http("http://api.openweathermap.org/data/2.5/weather?q=" + SurfInfo.webApp.locationPath + ",il&units=metric", "GET").then(function(data) {
            dataObj = data;
            populateCityTable();
            prepareReport();
        });



    };

});



