// Module Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var session = require('express-session');
var cors = require('cors');
var router = express.Router();
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;


// Internal dependencies
var signup = require('./api/signup');
var login = require('./api/login');
var file = require('./api/file');
var logout = require('./api/logout');
var mongodb = require('./db/mongodb.js');

// Express
var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// Save session
app.use(session({
  secret : "nwkjndxhoiwjp[qp[]]",
  resave : true,
  saveUninitialized : true,
  cookie: { maxAge: 60000 },
  rolling: true
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(function(request, response, next) {
    console.log('origin is' + request.headers.origin);
    response.header("Access-Control-Allow-Origin", request.headers.origin);
    response.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Authorization, X-Requested-With, currentpath, userid");
    response.header("Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,DELETE,OPTIONS");
    response.header("Access-Control-Allow-Credentials", "true");
    next();
});

//Routes
app.use('/api/signup', signup);
app.use('/api/login', login);
app.use('/api/logout', logout)
app.use('/api/file', file);


// Start Server
app.listen(3000);
console.log('API running on port 3000');
