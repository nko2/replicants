var $ = require('jquery-browserify');
var http = require('http-browserify');
var path = require('path');
var run = require('./run');

$(window).ready(function () {
    var id = path.basename(window.location.pathname);
    var opts = { path : '/file/' + id + '/file.js' };
    http.get(opts, function (res) {
        res.on('data', function (buf) {
            $('#source').val(
                $('#source').val() + buf.toString()
            );
        });
        
        res.on('end', function () {
            var src = $('#source').val();
            var b = run(src);
            
            b.on('node', function (node) {
                console.dir(node);
            });
            
            b.run();
        });
    });
});
