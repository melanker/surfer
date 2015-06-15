var path = require('path'),
    config = require('../../config');

module.exports = function(app, express) {
    var router = express.Router();

    router.route('/:city')
        .get(function(req, res) {
            res.sendFile(path.join(__dirname, (config.development ? '../../public/mobile_app/sub/city_dev.html' : '../../public/mobile_app/sub/city.html')));
        });

    return router;
};


