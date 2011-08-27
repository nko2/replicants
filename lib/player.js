var path = require('path');
var fs = require('fs');

module.exports = function (req, res) {
    var id = path.basename(req.url);
    if (!id.match(/^[0-9a-f]+$/)) {
        res.statusCode = 500;
        res.setHeader('content-type', 'text/html');
        res.end('<h1><blink>Wrong ID format</blink></h1>');
    }
    else {
        var file = __dirname + '/../data/' + id + '/file.js';
        fs.readFile(file, function (err, src) {
            if (err) {
                res.statusCode = 500;
                res.setHeader('content-type', 'text/plain');
                res.end(err.toString());
            }
            else {
                res.render('player.ejs', {
                    layout : false,
                    source : src,
                    id : id
                });
            }
        });
    }
};
