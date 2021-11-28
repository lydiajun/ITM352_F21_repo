var express = require('express');
var app = express();
var myParser = require("body-parser");

var data = require('./public/products.js');
var products = data.products;

products.forEach((prod, i) => { prod.inventory = 10; });
var querystring = require("querystring");

var users_reg_data = 
{
    "dport": {"password":"portpass"},
    "kazman": {"password":"kazpass"},
    "itm352": {"password":"grader"}
};

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
            errors['quantity' + i] = `Please enter valid quantities for ${products[i].model}`;
        }
        if (qua > 0) {
            delete errors['no_quantities']; // Delete errors if valid quantities.
            // Validate quantities by checking available amount in inventories.
            if (qua > products[i].inventory) { // Error alert if quantity submitted is more than available in inventories.
                errors['inventory' + i] = `${qua} of ${products[i].model} not available. Only ${products[i].inventory} available.`;
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
        // Redirect customer to signin.html if valid quantities entered.
        res.redirect("./signin.html?" + QString);
    } else { // Else, give the errors.
        let errObj = { 'error': JSON.stringify(errors) };
        QString += '&' + querystring.stringify(errObj);
        res.redirect("./store.html?" + QString); // Redirect to store.html if errors.
    }
});

// POST request to signin.html. Taken from Assignment 2 code examples on ITM 352 website.
app.post("/signin.html", function (request, response) {
    let params = new URLSearchParams(request.query);
    // Process login form POST and redirect to logged in page if ok, back to login page if not.
    the_username = request.body['username'].toLowerCase();
    the_password = request.body['password'];
    if (typeof users_reg_data[the_username] != 'undefined') { 
        if (users_reg_data[the_username].password == the_password) { // Check if password matches username.
            response.redirect('./invoice.html?'+ params.toString()); // Send to invoice page if login successful.
        } else {
            response.send(`Wrong password!`); // Error message for wrong password.
        }
        return;
    }
    response.send(`${the_username} does not exist`); // Error message for user that doesn't exist.
});

// POST request to signup.html.
app.post("/signup.html", function (request, response) {
    // Registration validation
        // Check if email address is valid. Case insensitive.
        // Name should only allow letters. 30 characters or less.
        // Check if username is unique. Letters and numbers only. 4-10 characters. Case insensitive.
        // Password is 6 characters min. Case sensitive.
        // Check if "Confirm Password" is same as password.
    // Send to invoice page if registration successful.
});

// Route all other GET requests to files in public.
app.use(express.static('./public'));

// Start server.
app.listen(8080, () => console.log(`listening on port 8080`));