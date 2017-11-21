var http = require('http');
var fs = require('fs');
var Calculator = require('./module/arithmetic.js');

var port = process.env.PORT || 1337;
http.createServer(function(request, response){
	fs.readFile('public/index.html', 'utf-8', function(err, data){
		var calc = new Calculator();
		data = data.replace('{p1}', 2).replace('{p2}', 4).replace('{pRes}', calc.plus(2, 4));
		data = data.replace('{m1}', 10).replace('{m2}', 3).replace('{mRes}', calc.minus(10, 3));
		data = data.replace('{ml1}', 3).replace('{ml2}', 2).replace('{mlRes}', calc.multi(3, 2));
		response.end(data);
	})
}).listen(port);