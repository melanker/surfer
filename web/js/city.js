SurfInfo.prototype.reqFlag = true;
SurfInfo.prototype.initCity = function () {
    var thisSurfingInfoJq = this,
        dataObj = {},
        populateCityTable,
        prepareReport,
        loadingJq = $(".loading");

    populateCityTable = function() {
        var weatherCurrentJq = $(".weatherCurrent");

        weatherCurrentJq.find('.cloudsImg').css("background", "url(/styles/img/"+ dataObj.weather[0].icon + ".png) no-repeat");
        weatherCurrentJq.find('.temp').html(dataObj.main.temp.toPrecision(4) + "&deg");
        dataObj.windSpeedKnots = (dataObj.wind.speed * 1.94384).toPrecision(4);

        if (thisSurfingInfoJq.data.locationPath === "Haifa" || thisSurfingInfoJq.data.locationPath === "Nahariya") {
            dataObj.waveHeight = thisSurfingInfoJq.data.charts.haifaData.dataHs[thisSurfingInfoJq.data.charts.haifaData.dataHs.length - 1];
            weatherCurrentJq.find(".seaTemp").html(parseFloat(thisSurfingInfoJq.data.charts.haifaData.data[thisSurfingInfoJq.data.charts.haifaData.data.length - 1].temp) + "&deg");
        } else if (thisSurfingInfoJq.data.locationPath === "Ashdod") {
            dataObj.waveHeight = thisSurfingInfoJq.data.charts.ashdodData.dataHs[thisSurfingInfoJq.data.charts.ashdodData.dataHs.length - 1];
            weatherCurrentJq.find(".seaTemp").html(parseFloat(thisSurfingInfoJq.data.charts.ashdodData.data[thisSurfingInfoJq.data.charts.ashdodData.data.length - 1].temp) + "&deg");
        } else {
            dataObj.waveHeight = ((thisSurfingInfoJq.data.charts.ashdodData.dataHs[thisSurfingInfoJq.data.charts.ashdodData.dataHs.length -1] +
                thisSurfingInfoJq.data.charts.haifaData.dataHs[thisSurfingInfoJq.data.charts.haifaData.dataHs.length - 1]) / 2).toPrecision(3);

            weatherCurrentJq.find(".seaTemp").html(((parseFloat(thisSurfingInfoJq.data.charts.ashdodData.data[thisSurfingInfoJq.data.charts.ashdodData.data.length -1].temp) +
                parseFloat(thisSurfingInfoJq.data.charts.haifaData.data[thisSurfingInfoJq.data.charts.haifaData.data.length - 1].temp)) / 2).toPrecision(4) + "&deg");
        }

        weatherCurrentJq.find(".waves").text(dataObj.waveHeight + "m");
        weatherCurrentJq.find(".speed").text((dataObj.wind.speed * 1.94384).toPrecision(4) + " " + "קשר");
        weatherCurrentJq.find(".direction").css({"background": "url(/styles/img/wa-sprite.png) -50px -1040px no-repeat",
            '-webkit-transform' : 'rotate('+ dataObj.wind.deg +'deg)',
            '-moz-transform' : 'rotate('+ dataObj.wind.deg +'deg)',
            '-ms-transform' : 'rotate('+ dataObj.wind.deg +'deg)',
            'transform' : 'rotate('+ dataObj.wind.deg +'deg)'});
        weatherCurrentJq.find(".sunset").text(thisSurfingInfoJq.getTime(dataObj.sys.sunset * 1000));
        weatherCurrentJq.find(".sunrise").text(thisSurfingInfoJq.getTime(dataObj.sys.sunrise * 1000));
        weatherCurrentJq.find(".lastUpdated").text(thisSurfingInfoJq.prettyDate(dataObj.dt * 1000) + " " +  thisSurfingInfoJq.getTime(dataObj.dt * 1000));
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
            windText = "קחו לתשומת ליבכם שרוח דרומית הינה בעלת השפעה קטנה על הגל"
        }  else if ((dataObj.wind.deg > 190 && dataObj.wind.deg < 260)) {
            windDirection = "מערבית דרומית";
        }  else if ((dataObj.wind.deg >= 260 && dataObj.wind.deg <= 280)) {
            windDirection = "מערבית";
        }  else if ((dataObj.wind.deg > 280 && dataObj.wind.deg < 360)) {
            windDirection = "מערבית צפונית";
        }  else if ((dataObj.wind.deg >= 360 || ( dataObj.wind.deg >= 0 && dataObj.wind.deg <= 10))) {
            windDirection = "צפונית";
            windText = "קחו לתשומת ליבכם שרוח צפונית הינה בעלת השפעה קטנה על הגל"
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
                imgJq.attr("src", "/styles/img/perfectWave.jpg");
            } else if (dataObj.windSpeedKnots > 7 && dataObj.windSpeedKnots < 10) {
                details = "הים עובד יופי, צריך עדיין להתחשב בכיוון הרוח ועוצמתה" ;
                imgJq.attr("src", "/styles/img/regWaves.jpg");
            } else if (dataObj.windSpeedKnots > 10 && dataObj.windSpeedKnots < 16) {
                details = "ים למנוסים, יש סיכוי לסחף ומכבסות עדיף חופים סגורים";
                imgJq.attr("src", "/styles/img/forPros.jpg");
            } else {
                details = "לא מומלץ לרדת לים";
                imgJq.attr("src", "/styles/img/chppyWaves.jpg");
            }
        } else if (dataObj.waveHeight < 0.8 && dataObj.waveHeight >= 0.5) {
            if (dataObj.windSpeedKnots <= 7) {
                details = "ים מצויין למתחילים עם לונג בורד";
                imgJq.attr("src", "/styles/img/longboardWave.jpg");
            } else if (dataObj.windSpeedKnots > 7 && dataObj.windSpeedKnots < 10) {
                details = "ים סביר, למתחילים עם לונג";
                imgJq.attr("src", "/styles/img/longboardWave.jpg");
            } else {
                details = "לא מומלץ, גל נמוך ורוח יחסית חזקה";
                imgJq.attr("src", "/styles/img/lowCrappyWaves.jpg");
            }
        } else {
            details = "ים לחסקה";
            imgJq.attr("src", "/styles/img/hasake.jpg");
        }

        detailsJq.find('h1').text(details);
        detailsJq.find('p').text(windLevel + " " + windDirection + "\n" + windText);
        loadingJq.hide();
    };


    var issueOpenWeatherRequest = function(url) {
            var deferred = $.Deferred();
            thisSurfingInfoJq.communication.http(url , "GET").then(function(data) {

                loadingJq.show();
                if ((data.cod && data.cod === "500") ) {
                    deferred.reject(data);
                }
                else if (typeof(data) === "string" && data.indexOf("city_id") >= 0) {
                    dataObj = JSON.parse(JSON.parse(data).data);
                    populateCityTable();
                    prepareReport();
                    deferred.resolve(dataObj);
                } else if(data.wind) {
                    dataObj = data;
                    populateCityTable();
                    prepareReport();
                    deferred.resolve(dataObj);
                } else {
                    deferred.reject(data);
                }


        }, function(data) {
            deferred.reject(data);
        });
        return deferred.promise();
    };

    issueOpenWeatherRequest("/server/city_data.php?id=" + thisSurfingInfoJq.data.cityMapping[thisSurfingInfoJq.data.locationPath]).then(function() {}, function (data) {
        issueOpenWeatherRequest("http://api.openweathermap.org/data/2.5/weather?id=" +
            thisSurfingInfoJq.data.cityMapping[thisSurfingInfoJq.data.locationPath] +
            "&units=metric&APPID=65979c59499d18cff77bbcfd2c8bdce6").then(function(data) {},
            function(data) {
                thisSurfingInfoJq = SurfInfo.prototype;
                setTimeout(function() {
                    issueOpenWeatherRequest.call(thisSurfingInfoJq, "http://api.openweathermap.org/data/2.5/weather?q=" +
                            thisSurfingInfoJq.data.locationPath + ",il" +
                            "&units=metric&APPID=65979c59499d18cff77bbcfd2c8bdce6")
                        .then(function(data) {}, function(data) {
                            var errorModalJq = $("#notifyDialog");
                            errorModalJq.find("p").text("בעיה בשרת, נסה מאוחר יותר");
                            errorModalJq.modal("show");
                            setTimeout(function() {
                                window.location = "/";
                            }, 4000);
                        });
                }, 4000);
            });
    });







};



