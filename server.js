var form = require('connect-form');
var express = require('express');
var argv = require('optimist').argv;
var fs = require('fs');

var mkdirp = require('mkdirp');
mkdirp(__dirname + '/data', 0700);

var app = express.createServer(form({ keepExtensions: true }));
app.use(express.static(__dirname + '/static'));

var browserify = require('browserify');
var bundle = browserify({
    mount : '/player.js',
    entry : __dirname + '/browser/player.js',
    //filter : require('uglify-js'),
    watch : true
});
app.use(bundle);

var upload = require('./lib/upload.js');
app.use(function (req, res, next) {
    if (req.method === 'PUT') {
        upload.CURL(req, res);
    }
    else next()
});

app.use(express.bodyParser());
app.post('/upload', upload.WEB);
app.get(new RegExp('^/id/.+'), require('./lib/player.js'));
app.use('/file', express.static(__dirname + '/data'));
app.get(new RegExp('/files/(example(1|2|3)|[0-9a-f]+)'), function (req, res) {
    var id = req.params[0];
    fs.readdir(__dirname + '/data/' + id, function (err, files) {
        if (err) {
            console.log('fs.readdir error:', err.toString());
            res.statusCode = 500;
            res.setHeader('content-type', 'text/plain');
            res.end(err.toString());
        }
        else {
            var stats = {};
            var pending = files.length;
            
            function sortFiles () {
                res.setHeader('content-type', 'application/json');
                var sorted = Object.keys(stats).sort(function (a,b) {
                    return stats[a].mtime - stats[b].mtime;
                });
                res.end(JSON.stringify(sorted));
            }
            
            files.forEach(function (file) {
                var pfile = __dirname + '/data/' + id + '/' + file;
                fs.stat(pfile, function (err, stat) {
                    if (err) {
                        console.log('fs.stat error:', err.toString());
                        res.statusCode = 500;
                        res.setHeader('content-type', 'text/plain');
                        res.end(err.toString());
                    }
                    else {
                        stats[file] = stat;
                        if (--pending === 0) sortFiles()
                    }
                })
            });
        }
    });
});

var port = argv.port || 80;
app.listen(port)
console.log('Listening on :' + port);
