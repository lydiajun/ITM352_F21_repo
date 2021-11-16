var express = require('express');
var app = express();

app.use(express.urlencoded({ extended: true }));

app.post('/process_form', function (request, response, next) {
    response.send(`I'm in POST /test ` + JSON.stringify(request.body));
});

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path + ' query string ' + JSON.stringify(request.query));
    next();
});

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback
