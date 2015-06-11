wavesApp.controller('MainCtrl', function ($scope, $httpDefer, appConstants, $q) {
    var setup, cityMap = {
        ashdod: "ashdod",
        haifa: "haifa"
    };

    $scope.ashdod = {

    };
    $scope.haifa = {

    };

    setup = function(cityName) {
        $scope[cityMap[cityName]] = {

        };

        $httpDefer.ajax({ method: "GET", url: appConstants.WAVES_API + cityName}).then(function(res){
            $scope[cityMap[cityName]].data = res.data;
            console.log($scope[cityMap[cityName]]);
        }, function(err){
            console.log(err);
        })
    };

    setup(cityMap.ashdod);
    setup(cityMap.haifa);

});