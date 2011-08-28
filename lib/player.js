var path = require('path');
var fs = require('fs');

module.exports = function (req, res) {
    var id = path.basename(req.url);
    if (!id.match(/^[0-9a-f]+|example(1|2|3)$/)) {
        res.statusCode = 500;
        res.setHeader('content-type', 'text/html');
        res.end('<h1><blink>Wrong ID format</blink></h1>');
    }
    else {
        var file = req.params[0] === 'frame'
            ? 'frame.ejs'
            : 'player.ejs'
        ;
        res.render(file, {
            layout : false,
            id : id
        });
    }
};
