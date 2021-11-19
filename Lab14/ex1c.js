// var userdata = require('./user_data.json');
var fs = require('fs');

var filename = 'user_data.json';

if (fs.existsSync(filename)) {
    var stats = fs.statSync(filename);
    console.log(filename + ' has ' + stats["size"] + ' characters');
} else {
    console.log(filename + ' does not exist!');
}