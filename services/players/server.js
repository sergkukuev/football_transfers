var express 		= require('express'),
	config 			= require('./libs/config'),
	bodyParser 		= require('body-parser'),
	cookieParser    = require('cookie-parser'),
    bodyParser      = require('body-parser'),
    compress        = require('compression'),
    methodOverride  = require('method-override'),
	glob 			= require('glob'),
	log 			= require('./libs/log')(module),
	mongoose 		= require('mongoose');

var app = express();

mongoose.connect(config.get('mongoose:uri'));
var db = mongoose.connection;

db.on('error', function(err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback() {
	log.info("Service \'Player\' connected to MongoDB!");
});

var models = glob.sync(config.root + '/app/models/*.js');
	models.forEach(function (model) {
	require(model);
});

var controllers = glob.sync(config.root + '/app/controllers/*.js');
	controllers.forEach(function (controller) {
	require(controller)(app);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(compress());
app.use(express.static(config.root + '/public'));
app.use(methodOverride());

app.listen(config.get('port'), function(){
	log.info('Service \'Player\' listening on port ' + config.get('port'));
});

// Error 404
app.use(function(request, response, next) {
	response.status(404);
	log.debug('Not found URL: %s', request.url);
	response.send({ error: 'Not found' });
	return;
});

// Error 500
app.use(function(request, response, next) {
	response.status(err.status || 500);
	log.error('Internal error(%d): %s', response.statusCode, err.message);
	response.send({ error: err.message });
	return;
});
