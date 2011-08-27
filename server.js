var express = require('express');
var argv = require('optimist').argv;

var mkdirp = require('mkdirp');
mkdirp(__dirname + '/data');

var app = express.createServer();
app.use(express.static(__dirname + '/static'));

var browserify = require('browserify');
var bundle = browserify({
    entry : __dirname + '/main.js',
    filter : require('uglify-js'),
    watch : true
});
app.use(bundle);

var upload = require('./lib/upload.js');
app.use(function (req, res, next) {
    if (req.method === 'PUT') {
        upload(req, res);
    }
    else next()
});

var port = argv.port || 80;
app.listen(port)
console.log('Listening on :' + port);
