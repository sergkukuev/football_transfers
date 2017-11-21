// Подгрузка модулей
/*var http = require('http');
var os = require('os');
var greeting = require("./my-module/greeting");
var User = require('./my-module/User');
var greeting2 = require('./my-module/greeting');
greeting2.name = 'Andrew';

var sergey = new User('Sergey', 22);
var userName = os.userInfo().userName;
//var port = process.env.PORT || 1337;
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(/*sergey.saySalute()/*greeting.getMessage(userName)/);
}).listen(1337, '127.0.0.1', function () {
   //console.log("Date: ${greeting.date}");
    //sergey.displayInfo();
    console.log('${greeting.name}');
    console.log('${greeting2.name}');
    console.log('Server started listening to request on port 1337');
})*/
//.listen(port);

function display(data, callback) {
	// случайное определение ошибки
	var randInt = Math.random() * (10 - 1) + 1;
	var err = randInt > 5 ? new Error('Error. randInt > 5.') : null;

	setTimeout(function(){
		callback(err, data);
	}, 0);
}

console.log('Start app');
display('Data processing...', function(err, data){
	if (err) throw err;
	console.log(data);
});

console.log('Finish app');