var express = require('express');
var app = express();

// var userdata = require('./user_data.json');
var fs = require('fs');

var filename = './user_data.json';

username = 'newuser';
user_data[username] = {};
user_data[username].password = 'newpass';
user_data[username].email = 'newuser@user.com';

if (fs.existsSync(filename)) {
    var stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats["size"] + ' characters');
    // have reg data file, so read data and parse into user_data.json
    let data_str = fs.readFileSync(filename, 'utf-8');
    // or use require:
    // var user_data = require(filename); 
    var user_data = JSON.parse(data_str);
} else {
    console.log(filename + ' does not exist!');
}

app.get("/", function (request, response) {
    response.send('nothing here')
});

// strikethrough = myParser is depreciated, so replace with express
app.use(express.urlencoded({ extended: true }));

app.get("/login", function (request, response) {
    // Give a simple login form
    str = `
        <body>
        <form action="" method="POST">
        <input type="text" name="username" size="40" placeholder="enter username" ><br />
        <input type="password" name="password" size="40" placeholder="enter password"><br />
        <input type="submit" value="Submit" id="submit">
        </form>
        </body>
    `;
    response.send(str);
 });

 app.get("/register", function (request, response) {
    // Give a simple register form
    str = `
        <body>
        <form action="" method="POST">
        <input type="text" name="username" size="40" placeholder="enter username" ><br />
        <input type="password" name="password" size="40" placeholder="enter password"><br />
        <input type="password" name="repeat_password" size="40" placeholder="enter password again"><br />
        <input type="email" name="email" size="40" placeholder="enter email"><br />
        <input type="submit" value="Submit" id="submit">
        </form>
        </body>
    `;
    response.send(str);
 });

 app.post("/register", function (request, response) {
    // process a simple register form
 });

app.post("/login", function (request, response) {
    // Process login form POST and redirect to logged in page if ok, back to login page if not
    let login_username = request.body['username'] // check if username exists, then check password entered matches password stored
    let login_password = request.body['password']
    if (typeof user_data[login_username] != 'undefined') {
        if (user_data[login_username]["password"] == login_password) { // getting the stored password and matching against login_password
            response.send(`${login_username} is logged in`)
        } else {
            response.redirect(`./login?err=incorrect password for ${login_username}`);
        } 
    } else {
            response.send(`${login_username} does not exist`)
        }
    response.send('processing login' + JSON.stringify(request.body));
});

app.listen(8080, () => console.log(`listening on port 8080`));