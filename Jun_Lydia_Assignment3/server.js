// This is the server.js file that runs the server for my store and contains instructions for specific requests.

// DEFINING VARIABLES

// from Lab 13, to use express modules
var express = require('express');
var app = express();
var myParser = require("body-parser");

// requires user_data.json file for user information, taken from Lab 14
var fs = require('fs');
var filename = './user_data.json';

// requires products.js file for product information
var data = require('./public/products.js');
var products = data.products;

// sets product inventory to 10
products.forEach((prod, i) => { prod.inventory = 10; });
var querystring = require("querystring");

// used to later store quantity data from products disiplay page. assume empty at first
var temp_qty_data = {};


// ROUTING

// Monitor all requests
app.all('*', function (request, response, next) {
    console.log(request.method + ' to ' + request.path); // console shows request to path
    next();
});

// GET request for products.js.
app.get('/products.js', function (request, response, next) {
    response.type('.js');
    var products_str = `var products = ${JSON.stringify(products)};`; // puts products into JSON object
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
// Checks for the existence of the file, from Lab 14
if (fs.existsSync(filename)) { 
    var data = fs.readFileSync(filename, 'utf-8'); // if it exists, read the file user_data.json storedin filename
    var user_data = JSON.parse(data); // parse user data
  } 

// POST request from signin.html. Adopted from Assignment 2 code examples on ITM 352 website, and received help from Professor Port
app.post("/process_login", function (req, res) {
    var the_username = req.body.username.toLowerCase();
    if (typeof user_data[the_username] != 'undefined') {
        if (user_data[the_username].password == req.body.password) { // Check if password matches username.
            // if there are no errors, store user info in temp_qty_data and send to invoice.  
            temp_qty_data['username'] = the_username;
            temp_qty_data['email'] = user_data[the_username].email;       
            let params = new URLSearchParams(temp_qty_data);
            res.redirect('/invoice.html?' + params.toString()); // Send to invoice page if login successful.
            return; // end process
        } else { // else (the_username password does not match the password entered), then there's an error
            req.query.username = the_username;
            req.query.LoginError = 'Invalid password!'; // Error message for wrong password.
        }
    } else { // else (the _username is undefined), there's an error
        req.query.LoginError  = 'Invalid username!'; // Error message for user that doesn't exist.
    } 
    // otherwise back to login with errors.    
    params = new URLSearchParams(req.query);
    res.redirect("./signin.html?" + params.toString()); // Redirect to signin.html if errors.
});

// POST request from signup.html. Received help from Professor Port
// Registration validation (each validation adopted from https://www.w3resource.com/javascript/form/javascript-sample-registration-form-validation.php)
app.post("/process_register", function (req, res) {
    var reg_errors = {};  // assume no errors at start
    var reg_username = req.body.username.toLowerCase();

    // EMAIL VALIDATION
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(req.body.email)) { //check if the fullname is correct
    } else {
        reg_errors['email'] = "Invalid email."; // error message for email that doesn't match format of name@website.domain
    } 

    // NAME VALIDATION
    if (/^[A-Za-z, ]+$/.test(req.body.fullname)) { // name must contain only letters
    } else {
        reg_errors['fullname'] = "Enter a name with alphabet characters only."; // error message if name contains numbers or invalid characters/symbols
    }
    
    if (req.body.fullname.length > 30 && req.body.fullname.length < 1) { // 30 characters or less
        reg_errors['fullname'] = "Name must be less than 30 characters."; // error message if name exceeds 30 characters or nothing in there
    }

    // USERNAME VALIDATION
    // alphanumeric check taken from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
    if (/^[0-9a-z]+$/.test(req.body.username)) { // Letters and numbers only
    } else {
        reg_errors['username'] = "Enter a username with alphanumeric characters only.";  // error message if username contains invalid characeters/symbols
    }

    if (req.body.username.length > 10 || req.body.username.length < 4) { // 4-10 characters
        reg_errors['username'] = "Username must be 4-10 characters."; // error message if username is under 4 characters or over 10 characters
    }
    
    if (typeof user_data[reg_username] != 'undefined') { // Username must be unique
        reg_errors['username'] = 'This username is already taken!'; // error message if username is already in user_data.json file
    }

    // PASSWORD VALIDATION
    if (req.body.password.length < 6) {
        reg_errors['password'] = "Password must be more than 6 characters."; // error message if password doesn't exceed 6 characters
    }

    // CONFIRM PASSWORD VALIDATION
    if (req.body.password !== req.body.confirmpassword) {
        reg_errors['confirmpassword'] = "Passwords do not match." // error message if passwords don't match
    }

    // Save registration data to json file and send to invoice page if registration successful. 
    // Taken from Lab 14 Exercise 4.
    if (Object.keys(reg_errors).length == 0) {
        var username = req.body['username'].toLowerCase();
        user_data[username] = {};
        // information entered is added to user_data
        user_data[username]['name'] = req.body['fullname']; 
        user_data[username]['password'] = req.body['password'];
        user_data[username]['email'] = req.body['email'];

        // stored data of purchase info goes into temp_qty_data
        fs.writeFileSync(filename, JSON.stringify(user_data), "utf-8");
        // username and email from temp_qty_data variable added into file as username and email
        temp_qty_data['username'] = username;
        temp_qty_data['email'] = user_data[username]["email"];
        let params = new URLSearchParams(temp_qty_data);
        res.redirect('./invoice.html?' + params.toString()); // go to invoice at the end of a successful registration process
    }

    // Otherwise back to registration with the registration errors.    
    else {
        req.body['reg_errors'] = JSON.stringify(reg_errors);
        let params = new URLSearchParams(req.body);
        res.redirect('signup.html?' + params.toString()); // redirect to signup page after errors popup
      }
});

// Process purchase request (validate quantities, check quantity available)
// Adopted from Lab 13 Exercise 3. (this has remained the same since Assignment 1)
app.post("/process_form", function (request, response, next) {
    // Post request routing.
    let POST = request.body;

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
        temp_qty_data = request.body;
        response.redirect("./signin.html?" + `    `);
    } else { // Else, give the errors.
        let errObj = { 'error': JSON.stringify(errors) };
        QString += '&' + querystring.stringify(errObj);
        response.redirect("./store.html?" + QString); // Redirect to store.html if errors.
    }
});

// Route all other GET requests to files in public.
app.use(express.static('./public'));

// Start server.
app.listen(8080, () => console.log(`listening on port 8080`));