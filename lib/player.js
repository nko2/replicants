var path = require('path');

module.exports = function (req, res) {
    var id = path.basename(req.url);
    res.render('player.ejs', {
        layout : false,
        id : id
    });
};
