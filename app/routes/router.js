var Wave = require('../models/wave'),
    City = require('../models/city'),
    cities = require('./../city_proxy');
    mail = require('./../services/nodemailer');

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


    router.route('/mail')
        .post(function(req, res){
           mail.sendMail({from: req.body.email, title: req.body.name, text: req.body.message}).then( function(response) {
               res.json({success: response});
           } , function(err) {
               res.json({error: err});
           });
        });

    return router;
};


