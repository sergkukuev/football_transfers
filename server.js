var express         = require('express');
var path            = require('path'); // модуль для парсинга пути
var log             = require('./libs/log')(module);
var app = express();

app.get('/api', function (request, response) {
    res.send('API is running');
});

app.listen(1337, function(){
    log.info('Express server listening on port 1337');
});