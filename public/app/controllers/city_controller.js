wavesApp.controller('CityCtrl', function ($scope, $httpDefer, appConstants, $routeParams, timeFormatter) {
    var populateCityTable, prepareReport;

    $scope.loadingCity = true;
    $scope.$parent.city = $routeParams.city;

    populateCityTable = function() {
        $scope.weatherIcon = {
            background: "url(/public/assets/img/"+  $scope.currentCity.weather[0].icon + ".png)"
        };

        $scope.temp = ($scope.currentCity.main.temp).toPrecision(4);
        $scope.windSpeedKnots = ($scope.currentCity.wind.speed * 1.94384).toPrecision(4);

        if ($scope.city === "Haifa" || $scope.city === "Nahariya") {
            $scope.waveHeight = $scope.haifa.data.hS[$scope.haifa.data.hS.length - 1];
            $scope.seaTemp = parseFloat($scope.haifa.data.temperature[$scope.haifa.data.temperature.length - 1]);
        } else if ($scope.city === "Ashdod") {
            $scope.waveHeight = $scope.ashdod.data.hS[$scope.ashdod.data.hS.length - 1];
            $scope.seaTemp = parseFloat($scope.ashdod.data.temperature[$scope.ashdod.data.temperature.length - 1]);
        } else {
            $scope.waveHeight = ((parseFloat($scope.ashdod.data.hS[$scope.ashdod.data.hS.length - 1]) +
                                    parseFloat($scope.haifa.data.hS[$scope.haifa.data.hS.length - 1])) / 2).toPrecision(3);

            $scope.seaTemp = ((parseFloat($scope.ashdod.data.temperature[$scope.ashdod.data.temperature.length -1]) +
                               parseFloat($scope.haifa.data.temperature[$scope.haifa.data.temperature.length - 1])) / 2).toPrecision(4);
        }

        $scope.direction = {
            background: "url(/public/assets/img/wa-sprite.png) -50px -1040px no-repeat",
            '-webkit-transform' : 'rotate('+ $scope.currentCity.wind.deg +'deg)',
            '-moz-transform' : 'rotate('+ $scope.currentCity.wind.deg +'deg)',
            '-ms-transform' : 'rotate('+ $scope.currentCity.wind.deg +'deg)',
            'transform' : 'rotate('+ $scope.currentCity.wind.deg +'deg)'};
        $scope.sunset = timeFormatter.formatTime($scope.currentCity.sys.sunset * 1000);
        $scope.sunrise = timeFormatter.formatTime($scope.currentCity.sys.sunrise * 1000);
        $scope.lastUpdate = timeFormatter.formatDate($scope.currentCity.dt * 1000) + " " +  timeFormatter.formatTime($scope.currentCity.dt * 1000);

    };

    prepareReport = function() {
        var windDirection,
            windLevel,
            details = "",
            windText = "",
            windSpeed = parseFloat($scope.windSpeedKnots),
            waveHeight = parseFloat($scope.waveHeight);

            $scope.imgBackground = {};



        if ($scope.currentCity.wind.deg >= 80 && $scope.currentCity.wind.deg <= 100) {
            windDirection = "מזרחית";
            windText = "רוח מזרחית עלולה להשטיח את הגל";
        } else if (($scope.currentCity.wind.deg > 100 && $scope.currentCity.wind.deg < 170)) {
            windDirection = "דרומית מזרחית";
        }  else if (($scope.currentCity.wind.deg >= 170 && $scope.currentCity.wind.deg <= 190)) {
            windDirection = "דרומית";
            windText = "קחו לתשומת ליבכם שרוח דרומית הינה בעלת השפעה קטנה על הגל"
        }  else if (($scope.currentCity.wind.deg > 190 && $scope.currentCity.wind.deg < 260)) {
            windDirection = "מערבית דרומית";
        }  else if (($scope.currentCity.wind.deg >= 260 && $scope.currentCity.wind.deg <= 280)) {
            windDirection = "מערבית";
        }  else if (($scope.currentCity.wind.deg > 280 && $scope.currentCity.wind.deg < 360)) {
            windDirection = "מערבית צפונית";
        }  else if (($scope.currentCity.wind.deg >= 360 || ( $scope.currentCity.wind.deg >= 0 && $scope.currentCity.wind.deg <= 10))) {
            windDirection = "צפונית";
            windText = "קחו לתשומת ליבכם שרוח צפונית הינה בעלת השפעה קטנה על הגל"
        } else {
            windDirection = "צפונית מזרחית";
        }

        switch (true) {
            case (windSpeed <= 7):
                windLevel = "רוח חלשה";
                break;
            case (windSpeed > 7 && windSpeed < 10):
                windLevel = "רוח בינונית";
                break;
            case (windSpeed >= 10 && windSpeed < 13):
                windLevel = "רוח בינונית חזקה";
                break;
            case (windSpeed >= 13 && windSpeed < 16):
                windLevel = "רוח חזקה";
                break;
            case (windSpeed >= 16):
                windLevel = "רוח חזקה מאוד";
                break;
        }


        if (waveHeight >= 0.8) {
            if (windSpeed <= 7) {
                details = "ים חלום. קחו חופש מחלה וצאו לים";
                $scope.imgBackground.src = "/public/assets/img/perfectWave.jpg";
            } else if (windSpeed > 7 && windSpeed < 10) {
                details = "הים עובד יופי, צריך עדיין להתחשב בכיוון הרוח ועוצמתה" ;
                $scope.imgBackground.src = "/public/assets/img/regWaves.jpg";
            } else if (windSpeed > 10 && windSpeed < 16) {
                details = "ים למנוסים, יש סיכוי לסחף ומכבסות עדיף חופים סגורים";
                $scope.imgBackground.src = "/public/assets/img/forPros.jpg";
            } else {
                details = "לא מומלץ לרדת לים";
                $scope.imgBackground.src = "/public/assets/img/chppyWaves.jpg";
            }
        } else if (waveHeight < 0.8 && waveHeight >= 0.5) {
            if (windSpeed <= 7) {
                details = "ים מצויין למתחילים עם לונג בורד";
                $scope.imgBackground.src = "/public/assets/img/longboardWave.jpg";
            } else if (windSpeed > 7 && windSpeed < 10) {
                details = "ים סביר, למתחילים עם לונג";
                $scope.imgBackground.src = "/public/assets/img/longboardWave.jpg";
            } else {
                details = "לא מומלץ, גל נמוך ורוח יחסית חזקה";
                $scope.imgBackground.src = "/public/assets/img/lowCrappyWaves.jpg";
            }
        } else {
            details = "ים לחסקה";
            $scope.imgBackground.src = "/public/assets/img/hasake.jpg";
        }

        $scope.title = windLevel + " " + windDirection + "\n" + windText;
        $scope.details = details;
    };

    $httpDefer.ajax({ method: "GET", url: appConstants.CITY_API + $scope.city}).then(function(res){
        $scope.currentCity = res.data;
        populateCityTable();
        prepareReport();
        $scope.loadingCity = false;
    }, function(err){
        console.log(err);
    });

});