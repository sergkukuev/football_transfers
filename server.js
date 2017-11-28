var express = require("express");
var app = express();

// определяем обработчик для маршрута "/"
app.get("/", function(request, response){
    response.send("<h2>Привет Express!</h2>");
});

app.listen(1337);