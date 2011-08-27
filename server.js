var express = require('express');
var argv = require('optimist').argv;

var app = express.createServer();
app.use(express.static(__dirname + '/static'));

var browserify = require('browserify');
var bundle = browserify({
    entry : __dirname + '/main.js',
    filter : require('uglify-js'),
    watch : true
});
app.use(bundle);

app.listen(argv.port || 80)
