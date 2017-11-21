var http = require('http');
var fs = require('fs');

var port = process.env.PORT || 1337;
http.createServer(function(request, response){
	/*console.log('\nRequest data');
	console.log('Url: ' + request.url);
	console.log('Type: ' + request.method);
	console.log('User-Agent:' + request.headers['user-agent']);
	console.log(request.headers);

	response.setHeader('UserId', 10);
	response.setHeader('Content-Type', 'text/html');
	response.write('<h2> My little pony </h2>');*/

	console.log('Get Url: ' + request.url);
	if (request.url.startsWith('/public/')){
		var fPath = request.url.substr(1);
		fs.readFile(fPath, function(err, data){
			if (err) {
				reponse.statusCode = 404;
				response.end('Resource not found!');
			}
			else {
				//response.setHeader('Content-Type', 'text/html');
				response.end(data);
			}
			return;
		})
	}
	else {
		response.end('Missing start page!');
	}

	response.end();
}).listen(port);