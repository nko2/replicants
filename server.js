var express = require('express');
var argv = require('optimist')
    .usage('Heatwave: Visualize your code with realtime heatmaps!\nUsage: $0 --port=<portnum>\nAfter start, you can either \ncurl -sNT <yourcode.js> localhost:port or \nvisit localhost:port')
    .demand('p')
    .alias('p', 'port')
    .describe('p', 'Specify the port you want the server to run on')
    .argv
;

var fs = require('fs');

var mkdirp = require('mkdirp');
mkdirp(__dirname + '/data', 0700);

var app = express.createServer();

var browserify = require('browserify');
app.use(browserify({
    mount : '/player.js',
    entry : __dirname + '/browser/player.js',
    filter : argv.debug ? String : require('uglify-js'),
    watch : true
}));

app.use(browserify({
    mount : '/index.js',
    entry : __dirname + '/browser/index.js',
    filter : argv.debug ? String : require('uglify-js'),
    watch : true
}));

var upload = require('./lib/upload.js');
app.use(function (req, res, next) {
    if (req.method === 'PUT') {
        upload.CURL(req, res);
    }
    else next()
});

var exampleFiles = [
    'example0/callback.js',
    'example1/loop.js',
    'example2/interval.js'
];

var examples = exampleFiles.map(function (x) {
    return fs.readFileSync(__dirname + '/data/' + x, 'utf8');
});

app.get('/', function (req, res) {
    res.render('index.ejs', {
        layout : false,
        examples : examples,
        host : req.headers.host || 'heatwave.nodejitsu.com'
    });
});

app.post('/upload', upload.WEB);
app.get(
    new RegExp('^/(id|frame)/.+'),
    require('./lib/player.js')
);

app.use('/file', express.static(__dirname + '/data'));
app.get(new RegExp('/files/(example[0-2]|[0-9a-f]+)'), function (req, res) {
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

app.use(express.static(__dirname + '/static'));

var port = argv.port || argv.p || 80;
app.listen(port)
console.log('Listening on :' + port);
