// Dependemcies
var express = require('express');
var bodyParser = require('body-parser');
var signup = require('./api/signup');

// Express
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//Routes
app.use('/api/signup', signup);


// Start Server
app.listen(3000);
console.log('API running on port 3000');
