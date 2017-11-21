var http = require('http');

var port = process.env.PORT || 1337;
http.createServer(function(request, response){
	/*console.log('\nRequest data');
	console.log('Url: ' + request.url);
	console.log('Type: ' + request.method);
	console.log('User-Agent:' + request.headers['user-agent']);
	console.log(request.headers);*/

	response.setHeader('UserId', 10);
	response.setHeader('Content-Type', 'text/html');
	response.write('<h2> My little pony </h2>');

	response.end();
}).listen(port);