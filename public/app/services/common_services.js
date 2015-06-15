wavesApp.factory('appConstants', function() {
    return {
        WAVES_API: "/api/waves/",
        CITY_API: "/api/"
    };
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
    };

    return communication;
});

wavesApp.factory('timeFormatter', function () {
    return {
        formatTime: function (time) {
            var addZero = function(i) {
                if (i < 10) {
                    i = "0" + i;
                }
                return i;
            };

            var d = new Date(time);
            var h = addZero(d.getHours());
            var m = addZero(d.getMinutes());
            return  h + ":" + m;
        },
        formatDate: function (date) {
            var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], d = new Date(date);
            return months[d.getUTCMonth()] + " " + d.getUTCDate();
        }
    };
});
