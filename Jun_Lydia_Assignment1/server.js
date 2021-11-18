var express = require('express');
var app = express();
var myParser = require("body-parser");

var data = require('./public/products.js');
var products = data.products;

products.forEach((prod, i) => { prod.inventory = 10; });
var querystring = require("querystring");

// Routing 

// Monitor all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path);
    next();
});

// GET request for products.js.
app.get('/products.js', function (request, response, next) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`;
    response.send(products_str);
});

// Function adopted from previous labs.
// Checks if a string q is a non-neg integer. If returnErrors is true, the array of errors is returned.
// Otherwise returns true if q is non-neg int.
function isNonNegInt(q, return_errors = false) {
    errors = []; // Assume no errors at first.
    if (q == '') q = 0; // Blank quantities = 0.
    if (Number(q) != q) errors.push('<font color="red">Not a number!</font>'); // Check if string is a number value
    if (q < 0) errors.push('<font color="red">Negative value!</font>'); // Check if it is non-negative
    if (parseInt(q) != q) errors.push('<font color="red">Not an integer!</font>'); // Check that it is an integer
    return return_errors ? errors : (errors.length == 0);
}

// Adopted from Lab 13 Exercise 3.
app.use(myParser.urlencoded({ extended: true }));

// Process purchase request (validate quantities, check quantity available)
// Adopted from Lab 13 Exercise 3.
app.post("/process_form", function (req, res, next) {
    // Post request routing.
    let POST = req.body;

    // Error alert if form submission has no quantities.
    var errors = {};
    errors['no_quantities'] = 'Please enter a valid quantity!';

    for (i = 0; i < products.length; i++) {
        qua = POST['quantity' + i];
        // Error alert if invalid quantities inputted into textboxes.
        if (isNonNegInt(qua) == false) {
            errors['quantity' + i] = `Please enter valid quantities for ${products[i].name}`;
        }
        if (qua > 0) {
            delete errors['no_quantities']; // Delete errors if valid quantities.
            // Validate quantities by checking available amount in inventories.
            if (qua > products[i].inventory) { // Error alert if quantity submitted is more than available in inventories.
                errors['inventory' + i] = `${qua} of ${products[i].name} not available. Only ${products[i].inventory} available.`;
            }
        }
    }

    // Querystring based on POST request.
    QString = querystring.stringify(POST);
    if (JSON.stringify(errors) === '{}') {
        // Remove quantity for amount of products i purchased.
        for (i = 0; i < products.length; i++) {
            products[i].inventory -= Number(POST['quantity' + i]); 
        }
        // Redirect customer to invoice.html if valid quantities entered.
        res.redirect("./invoice.html?" + QString);
    } else { // Else, give the errors.
        let errObj = { 'error': JSON.stringify(errors) };
        QString += '&' + querystring.stringify(errObj);
        res.redirect("./store.html?" + QString); // Redirect to store.html if errors.
    }
});

// Route all other GET requests to files in public.
app.use(express.static('./public'));

// Start server.
app.listen(8080, () => console.log(`listening on port 8080`));