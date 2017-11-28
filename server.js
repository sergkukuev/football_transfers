var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var log             = require('./libs/log')(module);
var app = express();

app.use(function(request, response, next) {
	response.status(404);
	log.debug('Not found URL: %s', request.url);
	response.send({ error: 'Not found' });
	return;
});

app.use(function(request, response, next) {
	response.status(err.status || 500);
	log.error('Internal error(%d): %s', response.statusCode, err.message);
	response.send({ error: err.message });
	return;
});


app.get('/api', function (request, response, next) {
    next(new Error('Random error!'));
});


app.listen(1337, function(){
    log.info('Express server listening on port 1337');
});