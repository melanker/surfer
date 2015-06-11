var express = require('express'),
    app = express(), // define our app using express
    bodyParser = require('body-parser'), // get body-parser
    config = require('./config'),
    path = require('path'),
    waves = require('./app/waves_proxy'),
    mongoose = require('mongoose'),
    cities = require('./app/city_proxy');

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname, 'public'));

//connect to database
mongoose.connect(config.database);

//updates database every 4 min (240000 ms)
setInterval(function () {
    waves.updateCityWave("ashdod");
    waves.updateCityWave("haifa");
    cities.updateCityWeather("Ashdod");
    cities.updateCityWeather("Herzliyya");
    cities.updateCityWeather("TelAviv");
    cities.updateCityWeather("Netanya");
    cities.updateCityWeather("Haifa");
    cities.updateCityWeather("Nahariya");
}, 24000000);


// ROUTES FOR OUR API =================
// ====================================
// API ROUTES ------------------------
var router = require('./app/routes/router')(app, express);
app.use('/api', router);

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + (config.development ? '/public/app/views/index_dev.html' : '/public/app/views/index.html')));
});


// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
