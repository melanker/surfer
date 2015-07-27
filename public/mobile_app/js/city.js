$(function () {

    SurfInfo.initCity = function () {
        var dataObj = {},
            self = this,
            populateCityTable,
            prepareReport,
            loadingJq = $(".loading");

        populateCityTable = function() {
            var weatherCurrentJq = $(".weatherCurrent");

            weatherCurrentJq.find('.cloudsImg').css("background", "url(/public/assets/img/"+ dataObj.weather[0].icon + ".png) no-repeat");
            weatherCurrentJq.find('.temp').html(dataObj.main.temp.toPrecision(4) + "&deg");
            dataObj.windSpeedKnots = (dataObj.wind.speed * 1.94384).toPrecision(4);

            if (SurfInfo.webApp.locationPath === "Haifa" || SurfInfo.webApp.locationPath === "Nahariya") {
                dataObj.waveHeight = SurfInfo.webApp.charts.haifaData.data.hS[SurfInfo.webApp.charts.haifaData.data.hS.length - 1];
                weatherCurrentJq.find(".seaTemp").html(parseFloat(SurfInfo.webApp.charts.haifaData.data.temperature[SurfInfo.webApp.charts.haifaData.data.temperature.length - 1]) + "&deg");
            } else if (SurfInfo.webApp.locationPath === "Ashdod") {
                dataObj.waveHeight = SurfInfo.webApp.charts.ashdodData.data.hS[SurfInfo.webApp.charts.ashdodData.data.hS.length - 1];
                weatherCurrentJq.find(".seaTemp").html(parseFloat(SurfInfo.webApp.charts.ashdodData.data.temperature[SurfInfo.webApp.charts.ashdodData.data.temperature.length - 1]) + "&deg");
            } else {
                dataObj.waveHeight = ((parseFloat(SurfInfo.webApp.charts.ashdodData.data.hS[SurfInfo.webApp.charts.ashdodData.data.hS.length -1]) +
                                       parseFloat(SurfInfo.webApp.charts.haifaData.data.hS[SurfInfo.webApp.charts.haifaData.data.hS.length - 1])) / 2).toPrecision(3);

                weatherCurrentJq.find(".seaTemp").html(((parseFloat(SurfInfo.webApp.charts.ashdodData.data.temperature[SurfInfo.webApp.charts.ashdodData.data.temperature.length -1]) +
                    parseFloat(SurfInfo.webApp.charts.haifaData.data.temperature[SurfInfo.webApp.charts.haifaData.data.temperature.length - 1])) / 2).toPrecision(4) + "&deg");
            }

            weatherCurrentJq.find(".waves").text(dataObj.waveHeight + "m");
            weatherCurrentJq.find(".speed").text((dataObj.wind.speed * 1.94384).toPrecision(4) + " " + "קשר");
            weatherCurrentJq.find(".direction").css({"background": "url(/public/assets/img/wa-sprite.png) -50px -1040px no-repeat",
                '-webkit-transform' : 'rotate('+ dataObj.wind.deg +'deg)',
                '-moz-transform' : 'rotate('+ dataObj.wind.deg +'deg)',
                '-ms-transform' : 'rotate('+ dataObj.wind.deg +'deg)',
                'transform' : 'rotate('+ dataObj.wind.deg +'deg)'});
            weatherCurrentJq.find(".sunset").text(SurfInfo.getTime(dataObj.sys.sunset * 1000));
            weatherCurrentJq.find(".sunrise").text(SurfInfo.getTime(dataObj.sys.sunrise * 1000));
            weatherCurrentJq.show();
        };

        prepareReport = function() {
            var windDirection,
                windLevel,
                details = "",
                windText = "",
                detailsJq = $(".details"),
                imgJq = $("#imgStat");

            if (dataObj.wind.deg >= 80 && dataObj.wind.deg <= 100) {
                windDirection = "מזרחית";
                windText = "רוח מזרחית עלולה להשטיח את הגל";
            } else if ((dataObj.wind.deg > 100 && dataObj.wind.deg < 170)) {
                windDirection = "דרומית מזרחית";
            }  else if ((dataObj.wind.deg >= 170 && dataObj.wind.deg <= 190)) {
                windDirection = "דרומית";
                windText = "קחו לתשומת ליבכם שרוח דרומית הינה בעלת השפעה קטנה על הגל";
            }  else if ((dataObj.wind.deg > 190 && dataObj.wind.deg < 260)) {
                windDirection = "מערבית דרומית";
            }  else if ((dataObj.wind.deg >= 260 && dataObj.wind.deg <= 280)) {
                windDirection = "מערבית";
            }  else if ((dataObj.wind.deg > 280 && dataObj.wind.deg < 360)) {
                windDirection = "מערבית צפונית";
            }  else if ((dataObj.wind.deg >= 360 || ( dataObj.wind.deg >= 0 && dataObj.wind.deg <= 10))) {
                windDirection = "צפונית";
                windText = "קחו לתשומת ליבכם שרוח צפונית הינה בעלת השפעה קטנה על הגל";
            } else {
                windDirection = "צפונית מזרחית";
            }

            switch (true) {
                case (dataObj.windSpeedKnots <= 7):
                    windLevel = "רוח חלשה";
                    break;
                case (dataObj.windSpeedKnots > 7 && dataObj.windSpeedKnots < 10):
                    windLevel = "רוח בינונית";
                    break;
                case (dataObj.windSpeedKnots >= 10 && dataObj.windSpeedKnots < 13):
                    windLevel = "רוח בינונית חזקה";
                    break;
                case (dataObj.windSpeedKnots >= 13 && dataObj.windSpeedKnots < 16):
                    windLevel = "רוח חזקה";
                    break;
                case (dataObj.windSpeedKnots >= 16):
                    windLevel = "רוח חזקה מאוד";
                    break;
            }


            if (dataObj.waveHeight >= 0.8) {
                if (dataObj.windSpeedKnots <= 7) {
                    details = "ים חלום. קחו חופש מחלה וצאו לים";
                    imgJq.attr("src", "/public/assets/img/perfectWave.jpg");
                } else if (dataObj.windSpeedKnots > 7 && dataObj.windSpeedKnots < 10) {
                    details = "הים עובד יופי, צריך עדיין להתחשב בכיוון הרוח ועוצמתה" ;
                    imgJq.attr("src", "/public/assets/img/regWaves.jpg");
                } else if (dataObj.windSpeedKnots > 10 && dataObj.windSpeedKnots < 16) {
                    details = "ים למנוסים, יש סיכוי לסחף ומכבסות עדיף חופים סגורים";
                    imgJq.attr("src", "/public/assets/img/forPros.jpg");
                } else {
                    details = "לא מומלץ לרדת לים";
                    imgJq.attr("src", "/public/assets/img/chppyWaves.jpg");
                }
            } else if (dataObj.waveHeight < 0.8 && dataObj.waveHeight >= 0.5) {
                if (dataObj.windSpeedKnots <= 7) {
                    details = "ים מצויין למתחילים עם לונג בורד";
                    imgJq.attr("src", "/public/assets/img/longboardWave.jpg");
                } else if (dataObj.windSpeedKnots > 7 && dataObj.windSpeedKnots < 10) {
                    details = "ים סביר, למתחילים עם לונג";
                    imgJq.attr("src", "/public/assets/img/longboardWave.jpg");
                } else {
                    details = "לא מומלץ, גל נמוך ורוח יחסית חזקה";
                    imgJq.attr("src", "/public/assets/img/lowCrappyWaves.jpg");
                }
            } else {
                details = "ים לחסקה";
                imgJq.attr("src", "/public/assets/img/hasake.jpg");
            }

            detailsJq.find('h1').text(details);
            detailsJq.find('p').text(windLevel + " " + windDirection + "\n" + windText);
            loadingJq.hide();
        };


        var issueOpenWeatherRequest = function() {
            self.communication.http("/api/" + SurfInfo.webApp.locationPath , "GET").then(function(res) {
                loadingJq.show();
                dataObj = res.data;
                populateCityTable();
                prepareReport();
            }, function(data) {
                SurfInfo.initCity();
            });
        }();
    };
});



