var express = require('express');
var app = express();
var myParser = require("body-parser");

var fs = require('fs');
var filename = './user_data.json';
var users_reg_data = require("./user_data.json"); // when server starts, load all user registration data (put all in memory)

var data = require('./public/products.js');
var products = data.products;

products.forEach((prod, i) => { prod.inventory = 10; });
var querystring = require("querystring");

// used to store quantity data from products disiplay page
var temp_qty_data = {};


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
app.use(express.urlencoded({ extended: true }));
// borrowed from Lab 14 
//check if the file already exists in the given path or not
if (fs.existsSync(filename)) {
    var data = fs.readFileSync(filename, 'utf-8');
    var user_data = JSON.parse(data);
    //if the file does not exists, the console willl show the nme of the file, and tell the file is not exist.
  } else {
    console.log(`${filename} does not exist!`);
  }

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
    var errors = {}; // assume no errors
    let params = new URLSearchParams(request.query);
    temp_qty_data['username'] = the_username;
    temp_qty_data['email'] = user_data[the_username].email;
    // Process login form POST and redirect to logged in page if ok, back to login page if not.
    the_username = request.body['username'].toLowerCase();
    the_password = request.body['password'];
    if (typeof users_reg_data[the_username] != 'undefined') {
        if (users_reg_data[the_username].password == the_password) { // Check if password matches username.
            // if there are no errors, send to invoice.         
            response.redirect('./invoice.html?' + params.toString()); // Send to invoice page if login successful.
            return;
        } else {
            errors["password"] = "Wrong password!"; // Error message for wrong password.
        }
    } else {
        errors["username"] = `${the_username} does not exist`; // Error message for user that doesn't exist.
    }
    // otherwise back to login with errors.    
    if (JSON.stringify(errors) !== '{}') {
        params.append('error', JSON.stringify(errors));
        params.append('username', the_username);
        response.redirect("./signin.html?" + params.toString()); // Redirect to signin.html if errors.
    }
});

// POST request to signup.html. 
// Registration validation (each validation adopted from https://www.w3resource.com/javascript/form/javascript-sample-registration-form-validation.php)
app.post("/signup.html", function (request, response) {
    var errors = {};  // assume no errors at start
    let params = new URLSearchParams(request.query);
    the_email = request.body['email'].toLowerCase();
    the_name = request.body['name'];
    the_username = request.body['username'].toLowerCase();
    the_password = request.body['password'];
    the_password2 = request.body['confirmpassword'];

    // EMAIL VALIDATION
    if (/\S+@\S+\.\S+/.test(the_email)) { //check if the fullname is correct
    }else {
        errors['email'] = "Invalid email.";
    } 

    // NAME VALIDATION
    if (/^[A-Za-z]+$/.test(the_name)) { // name must contain only letters
    } else {
        errors['name'] = "Enter a name with alphabet characters only.";
    }
    
    if (the_name.length > 30 && the_name.length < 1) { // 30 characters or less
        errors['name'] = "Name must be less than 30 characters."
    }

    // USERNAME VALIDATION
    // alphanumeric check taken from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    if (/^[0-9a-z]+$/.test(the_username)) { // Letters and numbers only
    } else {
        errors['username'] = "Enter a username with alphanumeric characters only.";
    }

    if (the_username.length > 10 && the_username.length < 4) { // 4-10 characters
        errors['username'] = "Username must be 4-10 characters."
    }
    
    if (typeof users_reg_data[the_username] != 'undefined') { // Username must be unique
        errors['username'] = 'This username is already registered!'; 
    }

    // PASSWORD VALIDATION
    if (the_password.length < 6) {
        errors['password'] = "Password must be more than 6 characters."
    }

    // CONFIRM PASSWORD VALIDATION
    if (the_password2 !== the_password) {
        errors['confirmpassword'] = "Passwords do not match."
    }

    // Save registration data to json file and send to invoice page if registration successful. 
    // Taken from Lab 14 Exercise 4.
    if (Object.keys(errors).length == 0) {
        var username = request.body['username'].toLowerCase();
        users_reg_data[username] = {};
        users_reg_data[username]['name'] = request.body['name'];
        users_reg_data[username]['password'] = request.body['password'];
    
    fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");
    // Put the stored quanitiy data into the temp_qty_data
    //get the username and email from the register information
    temp_qty_data['username'] = username;
    let params = new URLSearchParams(temp_qty_data);
    response.redirect('./invoice.html?' + params.toString());
    }

    // Otherwise back to registration with errors.    
    else {
        request.body['errors'] = JSON.stringify(errors);
        let params = new URLSearchParams(request.body);
        res.redirect('./signup.html?' + params.toString());
      }
});

// Route all other GET requests to files in public.
app.use(express.static('./public'));

// Start server.
app.listen(8080, () => console.log(`listening on port 8080`));