/**
 * Created by alonm on 7/28/2015.
 */
webApp.City = function(name) {
    this.name = name;
    this.dataObj = null;
};

webApp.City.prototype.initCity = function() {
    var self = this,
        populateCityTable,
        prepareReport,
        weatherCurrentJq = $("#" + self.name + " .weatherCurrent");

    weatherCurrentJq.parent().hide();
    populateCityTable = function() {
        weatherCurrentJq.find(".lastUpdated").text(webApp.formatDate(self.dataObj.dt * 1000) + " " +  webApp.getTime(self.dataObj.dt * 1000));
        weatherCurrentJq.find('.cloudsImg').css("background", "url(/public/assets/img/"+ self.dataObj.weather[0].icon + ".png) no-repeat");
        weatherCurrentJq.find('.temp').html(self.dataObj.main.temp.toPrecision(4) + "&deg");
        self.dataObj.windSpeedKnots = (self.dataObj.wind.speed * 1.94384).toPrecision(4);

        if (webApp.locationPath === "Haifa" || webApp.locationPath === "Nahariya") {
            self.dataObj.waveHeight = webApp.charts.haifaData.data.hS[webApp.charts.haifaData.data.hS.length - 1];
            weatherCurrentJq.find(".seaTemp").html(parseFloat(webApp.charts.haifaData.data.temperature[webApp.charts.haifaData.data.temperature.length - 1]) + "&deg");
        } else if (webApp.locationPath === "Ashdod") {
            self.dataObj.waveHeight = webApp.charts.ashdodData.data.hS[webApp.charts.ashdodData.data.hS.length - 1];
            weatherCurrentJq.find(".seaTemp").html(parseFloat(webApp.charts.ashdodData.data.temperature[webApp.charts.ashdodData.data.temperature.length - 1]) + "&deg");
        } else {
            self.dataObj.waveHeight = ((parseFloat(webApp.charts.ashdodData.data.hS[webApp.charts.ashdodData.data.hS.length -1]) +
            parseFloat(webApp.charts.haifaData.data.hS[webApp.charts.haifaData.data.hS.length - 1])) / 2).toPrecision(3);

            weatherCurrentJq.find(".seaTemp").html(((parseFloat(webApp.charts.ashdodData.data.temperature[webApp.charts.ashdodData.data.temperature.length -1]) +
                parseFloat(webApp.charts.haifaData.data.temperature[webApp.charts.haifaData.data.temperature.length - 1])) / 2).toPrecision(4) + "&deg");
        }

        weatherCurrentJq.find(".waves").text(self.dataObj.waveHeight + "m");
        weatherCurrentJq.find(".speed").text((self.dataObj.wind.speed * 1.94384).toPrecision(4) + " " + "קשר");
        weatherCurrentJq.find(".direction").css({"background": "url(/public/assets/img/wa-sprite.png) -50px -1040px no-repeat",
            '-webkit-transform' : 'rotate('+ self.dataObj.wind.deg +'deg)',
            '-moz-transform' : 'rotate('+ self.dataObj.wind.deg +'deg)',
            '-ms-transform' : 'rotate('+ self.dataObj.wind.deg +'deg)',
            'transform' : 'rotate('+ self.dataObj.wind.deg +'deg)'});
        weatherCurrentJq.find(".sunset").text(webApp.getTime(self.dataObj.sys.sunset * 1000));
        weatherCurrentJq.find(".sunrise").text(webApp.getTime(self.dataObj.sys.sunrise * 1000));
        weatherCurrentJq.show();
    };

    prepareReport = function() {
        var windDirection,
            windLevel,
            details = "",
            windText = "",
            detailsJq = $(".details"),
            imgJq = $("#imgStat");

        if (self.dataObj.wind.deg >= 80 && self.dataObj.wind.deg <= 100) {
            windDirection = "מזרחית";
            windText = "רוח מזרחית עלולה להשטיח את הגל";
        } else if ((self.dataObj.wind.deg > 100 && self.dataObj.wind.deg < 170)) {
            windDirection = "דרומית מזרחית";
        }  else if ((self.dataObj.wind.deg >= 170 && self.dataObj.wind.deg <= 190)) {
            windDirection = "דרומית";
            windText = "קחו לתשומת ליבכם שרוח דרומית הינה בעלת השפעה קטנה על הגל";
        }  else if ((self.dataObj.wind.deg > 190 && self.dataObj.wind.deg < 260)) {
            windDirection = "מערבית דרומית";
        }  else if ((self.dataObj.wind.deg >= 260 && self.dataObj.wind.deg <= 280)) {
            windDirection = "מערבית";
        }  else if ((self.dataObj.wind.deg > 280 && self.dataObj.wind.deg < 360)) {
            windDirection = "מערבית צפונית";
        }  else if ((self.dataObj.wind.deg >= 360 || ( self.dataObj.wind.deg >= 0 && self.dataObj.wind.deg <= 10))) {
            windDirection = "צפונית";
            windText = "קחו לתשומת ליבכם שרוח צפונית הינה בעלת השפעה קטנה על הגל";
        } else {
            windDirection = "צפונית מזרחית";
        }

        switch (true) {
            case (self.dataObj.windSpeedKnots <= 7):
                windLevel = "רוח חלשה";
                break;
            case (self.dataObj.windSpeedKnots > 7 && self.dataObj.windSpeedKnots < 10):
                windLevel = "רוח בינונית";
                break;
            case (self.dataObj.windSpeedKnots >= 10 && self.dataObj.windSpeedKnots < 13):
                windLevel = "רוח בינונית חזקה";
                break;
            case (self.dataObj.windSpeedKnots >= 13 && self.dataObj.windSpeedKnots < 16):
                windLevel = "רוח חזקה";
                break;
            case (self.dataObj.windSpeedKnots >= 16):
                windLevel = "רוח חזקה מאוד";
                break;
        }


        if (self.dataObj.waveHeight >= 0.8) {
            if (self.dataObj.windSpeedKnots <= 7) {
                details = "ים חלום. קחו חופש מחלה וצאו לים";
                imgJq.attr("src", "/public/assets/img/perfectWave.jpg");
            } else if (self.dataObj.windSpeedKnots > 7 && self.dataObj.windSpeedKnots < 10) {
                details = "הים עובד יופי, צריך עדיין להתחשב בכיוון הרוח ועוצמתה" ;
                imgJq.attr("src", "/public/assets/img/regWaves.jpg");
            } else if (self.dataObj.windSpeedKnots > 10 && self.dataObj.windSpeedKnots < 16) {
                details = "ים למנוסים, יש סיכוי לסחף ומכבסות עדיף חופים סגורים";
                imgJq.attr("src", "/public/assets/img/forPros.jpg");
            } else {
                details = "לא מומלץ לרדת לים";
                imgJq.attr("src", "/public/assets/img/chppyWaves.jpg");
            }
        } else if (self.dataObj.waveHeight < 0.8 && self.dataObj.waveHeight >= 0.5) {
            if (self.dataObj.windSpeedKnots <= 7) {
                details = "ים מצויין למתחילים עם לונג בורד";
                imgJq.attr("src", "/public/assets/img/longboardWave.jpg");
            } else if (self.dataObj.windSpeedKnots > 7 && self.dataObj.windSpeedKnots < 10) {
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
        weatherCurrentJq.parent().fadeIn(600);
        $("#" + self.name + " i").hide();
    };

    var issueOpenWeatherRequest = function() {
        webApp.communication.http("/api/" + self.name , "GET").then(function(res) {
            self.dataObj = res.data;
            populateCityTable();
            prepareReport();
        });
    }();
};