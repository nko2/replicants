var fs = require('fs');
var path = require('path');
var hat = require('hat');
var seq = require('seq');

module.exports = function (req, res) {
    var src = '';
    req.on('data', function (buf) {
        src += buf.toString();
    });
    
    req.on('end', function () {
        res.setHeader('content-type', 'text/plain');
        
        seq()
            .seq(generate, seq)
            .seq(function (b) {
                this.vars.id = b.id;
                var file = '/file.js';
                fs.writeFile(b.dir + '/file.js', src, this)
            })
            .seq(function () {
                var id = this.vars.id;
                res.write(
                    'Visit this site to run and manage the code:'
                    + '    http://' + req.headers.host + '/id/' + id
                );
                
                res.write(
                    ' To upload more files:\n'
                    + '    curl -sNT file.js '
                        + req.headers.host + '/id/' + id
                );
                
                res.end('\n');
            })
            .catch(function (err) {
                res.statusCode = 500;
                res.end(err.toString() + '\n');
            })
        ;
    });
};

function generate (cb) {
    var id = hat(32);
    var dir = __dirname + '/../data/' + id;
    
    path.exists(dir, function (ex) {
        if (ex) generate(cb)
        else {
            fs.mkdir(dir, 0700, function (err) {
                if (err) cb(err)
                else {
                    fs.writeFile(dir + '/', function () {
                        cb(null, {
                            id : id,
                            dir : dir
                        });
                    });
                }
            });
        }
    });
}
