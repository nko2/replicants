var $ = require('jquery-browserify');
var http = require('http-browserify');
var path = require('path');
var run = require('./run');

$(window).ready(function () {
    var id = path.basename(window.location.pathname);
    var src = '';
    
    var opts = { path : '/file/' + id + '/file.js' };
    http.get(opts, function (res) {
        res.on('data', function (buf) {
            src += buf.toString();
        });
        
        res.on('end', function () {
            var b = run(src);
            b.run();
        });
    });
});
