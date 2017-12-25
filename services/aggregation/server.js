var express	 = require('express'),
	config 	 = require('./libs/config'),
	log 	 = require('./libs/log')(module),
	mongoose = require('mongoose');

var app = express();

mongoose.connect(config.db);
var db = mongoose.connection;

db.on('error', function(err) {
	log.error('Connection error:', err.message);
});

db.once('open', function callback() {
	log.info("Service \'Aggregation\' connected to MongoDB!");
});

module.exports = require('./libs/express') (app, config);

app.listen(config.port, function(){
	log.info('Service \'Aggregation\' listening on port ' + config.port);
});