wavesApp.factory('appConstants', function() {
    return {
        WAVES_API: "/api/waves/"
    }
});


wavesApp.factory('$httpDefer', function($q, $http) {
    var communication = {};

    communication.ajax = function(obj) {
        var deferred = $q.defer();

        $http(obj).success(function(data) {
            deferred.resolve(data);
        }).error(function(err) {
            deferred.reject(err);
        });

        return deferred.promise;
    }

    return communication;

});