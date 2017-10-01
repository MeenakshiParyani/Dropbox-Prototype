// Dependemcies
var express = require('express');
var bodyParser = require('body-parser');
var api = require('./routes/api');

// Express
var app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


//Routes
app.use('/api', api);


// Start Server
app.listen(3000);
console.log('API running on port 3000');