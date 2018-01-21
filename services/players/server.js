var express	 = require('express'),
	config 	 = require('./config'),
	log 	 = require('./config/log')(module),
	mongoose = require('mongoose');

var app = express();

mongoose.connect(config.db);
var db = mongoose.connection;

db.on('error', function(err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback() {
	log.info("Service \'Player\' connected to MongoDB!");
});

module.exports = require('./config/express') (app, config);

app.listen(config.port, function(){
	log.info('Service \'Player\' listening on port ' + config.port);
});