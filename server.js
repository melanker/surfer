/**
 * Created by alonm on 6/7/2015.
 */
var express = require('express'),
    app = express(), // define our app using express
    bodyParser = require('body-parser'), // get body-parser
    morgan = require('morgan'), // used to see requests
    mongoose = require('mongoose'), // for working w/ our database
    port = process.env.PORT || 8080; // set the port for our app

