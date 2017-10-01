
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./api/routes/calculatorRoutes')
  , http = require('http')
  , path = require('path')
  , bodyParser = require('body-parser')
  , methodOverride = require('method-override')
  , favicon = require('favicon');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(favicon());
app.use(bodyParser());
app.use(methodOverride());
app.use(app.router);
//app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(methodOverride('X-HTTP-Method-Override')); 

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//routes(app);
//app.get('/', function(req,res){
//	res.send('Welcome to Calculator API');
//});
//app.get('/users', user.list);
app.use('/api/calc', routes);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

exports = module.exports = app;
