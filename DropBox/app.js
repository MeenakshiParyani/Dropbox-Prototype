// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var signup = require('./api/signup');
var login = require('./api/login');
var file = require('./api/file');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// Express
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


//Routes
app.use('/api/signup', signup);
app.use('/api/login', login);
app.use('/api/file', file);

// Start Server
app.listen(3000);
console.log('API running on port 3000');
