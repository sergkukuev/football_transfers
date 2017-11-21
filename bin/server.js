/*var http = require('http');
var port = process.env.PORT || 1337;

// request - stream reader, response - stream writter

http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end();
}).listen(1337, '127.0.0.1', function () {
    console.log('Server started listening to request on port 1337');
})*/

var fs = require('fs');

var wrStream = fs.createWriteStream('hello.txt');
wrStream.write('Hello all\n');
wrStream.write('ololol');

var rdStream = fs.createReadStream('hello.txt', 'utf-8');

rdStream.on('data', function(chunk){
	console.log(chunk);
});