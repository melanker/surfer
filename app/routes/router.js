var Wave = require('../models/wave'),
    City = require('../models/city'),
    cities = require('./../city_proxy');

module.exports = function(app, express) {
    var router = express.Router();

    router.route('/waves/:city')
        .get(function(req, res) {
            Wave.find({city: req.params.city}, function(err, info) {
                if (err) {res.send(err)}
                res.json({data: info[0]});
            });
        });

    router.route('/:city')
        .get(function(req, res) {
            City.find({id: cities.cityMap[req.params.city]}, function(err, info) {
                if (err) {res.send(err)}
                res.json({data: info[0]});
            });
        });


    return router;
};


