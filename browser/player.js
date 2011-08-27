var $ = require('jquery-browserify');
var http = require('http-browserify');
var path = require('path');
var run = require('./run');

function get (uri, cb) {
    var src = '';
    var opts = { path : uri };
    
    var src = '';
    http.get(opts, function (res) {
        res.on('data', function (buf) {
            src += buf.toString();
        });
        
        res.on('end', function () {
            cb(src);
        });
    });
}

$(window).ready(function () {
    var id = path.basename(window.location.pathname);
    var src = '';
    
    get('/files/' + id, function (files) {
        JSON.parse(files).forEach(function (file) {
            get('/file/' + id + '/' + file, function (src) {
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
});
