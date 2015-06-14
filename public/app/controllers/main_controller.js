wavesApp.controller('MainCtrl', function ($scope, $httpDefer, appConstants) {
    var setup, cityMap = {
        ashdod: "ashdod",
        haifa: "haifa"
    };

    $scope.city = undefined;

    setup = function(cityName) {
        $scope[cityMap[cityName] + "Loading"] = true;

        $scope[cityMap[cityName]] = {
            waveRange: "",
            lastUpdateDate: "",
            lastUpdateHour: "",
            seaTemp: ""

        };

        $httpDefer.ajax({ method: "GET", url: appConstants.WAVES_API + cityName}).then(function(res){
            $scope[cityMap[cityName]].data = res.data;
            $.extend(true ,$scope[cityMap[cityName]], {
                waveRange: res.data.hS[res.data.hS.length - 1] + "m-" + res.data.hMax[res.data.hMax.length - 1] + "m",
                lastUpdateDate: res.data.date,
                lastUpdateHour: res.data.time[res.data.time.length - 1],
                seaTemp:  res.data.temperature[res.data.temperature.length - 1]
            });

            $scope[cityMap[cityName] + "Loading"] = false;
        }, function(err){
            console.log(err);
        });
    };

    setup(cityMap.ashdod);
    setup(cityMap.haifa);

});