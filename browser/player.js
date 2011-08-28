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

$(document).ready(function () {
    var id = path.basename(window.location.pathname);
    var isFrame = path.dirname(window.location.pathname) === '/frame';
    
    if (isFrame) {
        var src = unescape(window.location.pathname.slice('/frame/'.length));
        
        var r = run('example.js', src);
        r.run({
            setTimeout : pass(setTimeout),
            setInterval : pass(setInterval),
            clearTimeout : pass(clearTimeout),
            clearInterval : pass(clearInterval),
            require : require
        });
        r.scale(0.90);
    }
    else play(id)
});

function play (id) {
    var src = '';
    get('/files/' + id, function (filesStr) {
        var files = JSON.parse(filesStr);
        
        var ix = files.indexOf('main.js');
        var mainFile = ix >= 0 ? files[ix] : files[0];
        
        var pending = files.length;
        var runners = {};
        
        files.forEach(function (file, i) {
            get('/file/' + id + '/' + file, function (src) {
                var r = runners['./' + file] = run(file, src);
                if (--pending === 0) runMain()
            });
        });
        
        function runMain () {
            var context = {
                setTimeout : pass(setTimeout),
                setInterval : pass(setInterval),
                clearTimeout : pass(clearTimeout),
                clearInterval : pass(clearInterval),
                module : { exports : {} },
                require : function (name) {
                    var r = runners[name]
                        || runners[name + '.js']
                        || runners[name + 'index.js']
                    ;
                    if (r) {
                        var c = {
                            setTimeout : pass(setTimeout),
                            setInterval : pass(setInterval),
                            require : context.require,
                            module : { exports : {} }
                        };
                        c.exports = c.module.exports;
                        r.run(c);
                        return c.module.exports;
                    }
                    else return (require)(name)
                }
            };
            context.exports = module.exports;
            runners['./' + mainFile].run(context);
        }
    });
}

function pass (fn) {
    return function () { return fn.apply(null, arguments) };
}
