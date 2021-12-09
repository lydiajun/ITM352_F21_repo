var express = require('express');
var app = express();

var cookieParser = require('cookie-parser'); // parser takes data out of a request and puts into a cookie object so you can use it
const { response } = require('express');
app.use(cookieParser());

// var userdata = require('./user_data.json');
var fs = require('fs');
var filename = './user_data.json';

app.get('/set_cookie', function (request, response) {
    // this will send a cookie to the requester
    response.cookie('name', 'Lydia', {maxAge: 5*1000});
    response.send('The name cookie has been sent')
});

app.get('/use_cookie', function (request, response) {
    // this will get the name cookie from the requester respond with message
    console.log(request.cookies);
    response.send(`Welcome to the Use Cookie page ${request.cookies.name}`);
});

if (fs.existsSync(filename)) {
    var stats = fs.statSync(filename);
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