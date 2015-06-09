var Q = require('q');

module.exports = function(schema) {
    var db = {};

    db.findAndReturnItem = function(query) {
        var deferred = Q.defer();
        item = schema.find(query, function (err, item) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(item);
            }
        });

        return deferred.promise;
    };


    return db;
};