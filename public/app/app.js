var wavesApp = angular.module('wavesApp', ['ngRoute']);

wavesApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/home', {
                templateUrl: '/public/app/views/pages/home.html',
                controller: 'HomeCtrl'
            }).
            when('/cities/:city', {
                templateUrl: '/public/app/views/pages/city.html',
                controller: 'CityCtrl'
            }).
            otherwise({
                redirectTo: '/home'
            });
    }]);