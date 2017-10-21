// Module Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var session = require('express-session');

// Internal dependencies
var signup = require('./api/signup');
var login = require('./api/login');
var file = require('./api/file');
var logout = require('./api/logout');

// Express
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Save session
app.use(session({ secret : "nwkjndxhoiwjp[qp[]]", resave : false, saveUninitialized : true}));


//Routes
app.use('/api/signup', signup);
app.use('/api/login', login);
app.use('/api/logout', logout)
app.use('/api/file', file);

// Start Server
app.listen(3000);
console.log('API running on port 3000');
