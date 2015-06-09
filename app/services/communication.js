var request = require('request'),
Q = require('q');

module.exports = {
     httpGet: function(url) {
        var deferred = Q.defer(),
            options = {
                url: url,
                method: 'GET'
            };

        request.get(options, function (error, response, body) {
            if (!error) {
                deferred.resolve(body);
            } else {
                deferred.reject(error);
            }
        });

        return deferred.promise;
    }
};