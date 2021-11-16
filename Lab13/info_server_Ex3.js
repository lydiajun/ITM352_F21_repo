var express = require('express');
var app = express();

app.use(express.urlencoded({ extended: true }));

app.all('*', function (request, response, next) {
    console.log(request.method + ' to path ' + request.path + ' query string ' + JSON.stringify(request.query));
    next();
});

app.post("/process_form", function (request, response) {
    var q = request.body['quantity_textbox'];
    if (typeof q != 'undefined') {
        if (isNonNegInt(q)) {
            response.send(`Thank you for purchasing ${q} things!`);
        } else {
            response.send(`Error: ${q} is not a quantity. Hit the back button to fix`)
        }
    }
 });

app.use(express.static('./public'));

app.listen(8080, () => console.log(`listening on port 8080`)); // note the use of an anonymous function here to do a callback

function isNonNegInt(q, returnErrors = false) {
    // Checks if a string q is a non-neg integer. If returnErrors is true, the array of errors is returned.
    // Otherwise returns true if q is non-neg int.
    errors = []; // assume no errors at first
    if (q == '') q = 0;
    if (Number(q) != q) errors.push('Not a number!'); // Check if string is a number value
    else {
        if (q < 0) errors.push('Negative value!'); // Check if it is non-negative
        if (parseInt(q) != q) errors.push('Not an integer!'); // Check that it is an integer
        }

    return returnErrors ? errors : (errors.length == 0);
}