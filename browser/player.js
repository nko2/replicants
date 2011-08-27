var $ = require('jquery-browserify');
require('jquery-mousewheel')($);
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
            
            b.run({
                setTimeout : function (fn, t) {
                    return setTimeout.apply(null, arguments);
                },
                setInterval : function (fn, t) {
                    return setInterval.apply(null, arguments);
                }
            });
        });
    });
});
