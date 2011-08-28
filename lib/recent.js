var fs = require('fs');
var recent = module.exports = [];

function sortStats (mtimes) {
    recent.splice(0);
    recent.push.apply(recent, Object.keys(mtimes)
        .sort(function (a,b) {
            return mtimes[b] - mtimes[a]
        })
        .map(function (id) {
            return { id : id, mtime : mtimes[id] };
        })
    );
}

function readStats () {
    fs.readdir(__dirname + '/../data', function (err, files) {
        if (err) console.error(err)
        else {
            var pending = files.length;
            var mtimes = {};
            files.forEach(function (id) {
                var file = __dirname + '/../data/' + id;
                
                fs.stat(file, function (err, stat) {
                    if (err) console.error(err)
                    else {
                        mtimes[id] = stat.mtime;
                        if (--pending === 0) {
                            sortStats(mtimes);
                        }
                    }
                });
            });
        }
    });
}

setInterval(readStats, 15000);
readStats();
