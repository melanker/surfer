var express = require('express'),
    app = express(), // define our app using express
    bodyParser = require('body-parser'), // get body-parser
    morgan = require('morgan'), // used to see requests
    mongoose = require('mongoose'),
    Q = require('q'),
    config = require('./config'),
    path = require('path'),
    waves = require('./app/waves_proxy');

// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));


waves.getCity("ashdod");
// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/app/views/index.html'));
});

// START THE SERVER
// ====================================
app.listen(config.port);
console.log('Magic happens on port ' + config.port);
