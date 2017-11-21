// Подгрузка модулей
var http = require('http');
var os = require('os');
//var greeting = require("./my-module/greeting");
var User = require('./my-module/User');

var sergey = new User('Sergey', 22);
var userName = os.userInfo().userName;
//var port = process.env.PORT || 1337;
http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(sergey.saySalute()/*greeting.getMessage(userName)*/);
}).listen(1337, '127.0.0.1', function () {
   //console.log("Date: ${greeting.date}");
    sergey.displayInfo();
    console.log('Server started listening to request on port 1337');
})
//.listen(port);
