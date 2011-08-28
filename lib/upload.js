var fs = require('fs');
var path = require('path');
var hat = require('hat');
var seq = require('seq');
var formidable = require('formidable');

module.exports.CURL = function (req, res) {
    var src = '';
    req.on('data', function (buf) {
        src += buf.toString();
    });
    
    req.on('end', function () {
        res.setHeader('content-type', 'text/plain');
        
        seq()
            .seq(function () {
                var m = req.url.match('^/id/([^/]+)');
                if (m) {
                    this.ok({
                        id : m[1],
                        dir : directoryOf(m[1])
                    });
                }
                else generate(this)
            })
            .seq(function (b) {
                this.vars.id = b.id;
                var file = path.basename(unescape(req.url));
                if (!file.match(/^[\w .-]+\.js$/)) {
                    this('Invalid upload filename: ' + file);
                }
                else fs.writeFile(b.dir + '/' + file, src, this)
            })
            .seq(function () {
                var id = this.vars.id;
                res.write(
                    'Visit this site to run and manage the code:\n'
                    + '    http://' + req.headers.host + '/id/' + id
                    + '\n\n'
                );
                
                res.write(
                    ' To upload more files:\n'
                    + '    curl -sNT file.js '
                        + req.headers.host + '/id/' + id + '/file.js'
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

module.exports.WEB = function (req, res, next) {
    var form = new formidable.IncomingForm();
    form.uploadDir = '.';
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files) {
        var file = files.file;
        var name = path.basename(file.path).slice(0,6);
        fs.mkdir('./data/'+name,0700, function (err) {
            if (err) throw new Error()
            else {
                fs.rename(file.path, './data/'+name+'/'+file.name);
                res.redirect('/id/' + name);
            }
        });
    });

    return;
};


function directoryOf (id) {
    return __dirname + '/../data/' + id;
}

function generate (cb) {
    var id = hat(32);
    var dir = directoryOf(id);
    
    path.exists(dir, function (ex) {
        if (ex) generate(cb)
        else {
            fs.mkdir(dir, 0700, function (err) {
                if (err) cb(err)
                else {
                    fs.writeFile(dir + '/', function () {
                        cb(null, { id : id, dir : dir });
                    });
                }
            });
        }
    });
}
