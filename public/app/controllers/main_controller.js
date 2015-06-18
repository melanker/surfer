wavesApp.controller('MainCtrl', function ($scope, $httpDefer, appConstants, $timeout, $q) {
    var cityMap = {
        ashdod: "ashdod",
        haifa: "haifa"
    };

    $scope.city = undefined;

    $scope.setup = function(cityName) {
        var deferred = $q.defer();

        $scope[cityMap[cityName] + "Loading"] = true;

        $httpDefer.ajax({ method: "GET", url: appConstants.WAVES_API + cityName}).then(function(res) {
            $timeout(function() {
                $scope[cityMap[cityName]] = {
                    waveRange: "",
                    lastUpdateDate: "",
                    lastUpdateHour: "",
                    seaTemp: ""
                };
                $scope[cityMap[cityName]].data = res.data;

                $.extend(true ,$scope[cityMap[cityName]], {
                    waveRange: res.data.hS[res.data.hS.length - 1] + "m-" + res.data.hMax[res.data.hMax.length - 1] + "m",
                    lastUpdateDate: res.data.date,
                    lastUpdateHour: res.data.time[res.data.time.length - 1],
                    seaTemp:  res.data.temperature[res.data.temperature.length - 1]
                });
                $scope[cityMap[cityName] + "Loading"] = false;
                deferred.resolve();
            }, 500);
        }, function(err){
            console.log(err);
            deferred.reject(err);
        });
        return deferred.promise;
    };

    $scope.setup(cityMap.ashdod);
    $scope.setup(cityMap.haifa);

});