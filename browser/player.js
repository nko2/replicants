var $ = require('jquery-browserify');
require('jquery-mousewheel')($);
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
    
    get('/files/' + id, function (filesStr) {
        var files = JSON.parse(filesStr);
        
        var ix = files.indexOf('main.js');
        var mainFile = ix >= 0 ? files[ix] : files[0];
        
        var pending = files.length;
        var runners = {};
        
        files.forEach(function (file, i) {
            get('/file/' + id + '/' + file, function (src) {
                runners['./' + file] = run(file, src);
                if (--pending === 0) runMain()
            });
        });
        
        function runMain () {
            var context = {
                setTimeout : pass(setTimeout),
                setInterval : pass(setInterval),
                require : function (name) {
                    var r = runners[name] || runners[name + '.js'];
                    if (r) {
                        r.run({
                            setTimeout : pass(setTimeout),
                            setInterval : pass(setInterval),
                            require : context.require
                        });
                    }
                    else (require)(name)
                }
            };
            runners['./' + mainFile].run(context);
        }
    });
});

function pass (fn) {
    return function () { fn.apply(null, arguments) };
}
