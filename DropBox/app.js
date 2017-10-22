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
// var whitelist = ['http://localhost:3000', 'http://localhost:8080']
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   },
//   methods : 'GET,HEAD,POST,PUT,DELETE,OPTIONS',
//   credentials : true
// }
// app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());

// // Start Mongo Db
// mongoose.connect(mongodb.url, mongodb.options, true);


// Save session
app.use(session({
  secret : "nwkjndxhoiwjp[qp[]]",
  resave : true,
  saveUninitialized : true,
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000
}));

app.use(passport.initialize());
app.use(passport.session());

// // Add headers
// app.use(function (req, res, next) {
//     console.log('headers are');
//     console.log(req.headers);
//     // Website you wish to allow to connect
//     res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
//
//     // Request methods you wish to allow
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//
//     // Request headers you wish to allow
//     res.setHeader('Access-Control-Allow-Headers', '*');
//
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });


app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", request.headers.origin);
    response.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Origin, Authorization, X-Requested-With, userId");
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
