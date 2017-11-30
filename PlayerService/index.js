var express = require('express'),
	config = require('./libs/config'),
	log = require('./libs/log')(module);

var app = express();

// Обработка 404 ошибки
app.use(function(request, response, next) {
	response.status(404);
	log.debug('Not found URL: %s', request.url);
	response.send({ error: 'Not found' });
	return;
});
// Обработка 500 ошибки
app.use(function(request, response, next) {
	response.status(err.status || 500);
	log.error('Internal error(%d): %s', response.statusCode, err.message);
	response.send({ error: err.message });
	return;
});

app.listen(config.get('port'), function(){
	log.info('Service \'Player\' listening on port ' + config.get('port'));
});