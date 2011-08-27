var express = require('express');
var argv = require('optimist').argv;

var mkdirp = require('mkdirp');
mkdirp(__dirname + '/data', 0700);

var app = express.createServer();
app.use(express.static(__dirname + '/static'));

var browserify = require('browserify');
var bundle = browserify({
    mount : '/player.js',
    entry : __dirname + '/browser/player.js',
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

app.get(new RegExp('^/id/.+'), require('./lib/player.js'));
app.use('/file', express.static(__dirname + '/data'));

var port = argv.port || 80;
app.listen(port)
console.log('Listening on :' + port);
