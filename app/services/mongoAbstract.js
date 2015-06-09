var request = require('request'),
    Q = require('q');

module.exports = function(schema) {
    var db;

    db.isExist = function(query) {
        schema.find(query, function (err, wave) {
            if (err) {
                return false;
            } else {
                return true;
            }
        });
    }
};