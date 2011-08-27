var $ = require('jquery-browserify');
var bunker = require('bunker');
var heatmap = require('heatmap');
var heatPlus = require('./heat_plus.js');

module.exports = function (src) {
    src = src.replace(/\t/g, '    ');
    var b = bunker(src);
    var lines = src.split('\n');
    
    var width = 800;
    var height = lines.length * 20;
    
    var canvas = $('<canvas>')
        .addClass('heat')
        .attr('width', width)
        .attr('height', height)
        .appendTo($('#player'))
        .get(0)
    ;
    
    var heat = heatPlus(heatmap(canvas));
    var ctx = canvas.getContext('2d');
    
    var scanvas = $('<canvas>')
        .attr('width', width)
        .attr('height', height)
        .addClass('source')
        .appendTo($('#player'))
        .get(0)
    ;
    
    var sctx = scanvas.getContext('2d');
    var drawText = (function drawText () {
        sctx.fillStyle = 'white';
        sctx.font = '16px monospace';
        src.split('\n').forEach(function (line, i) {
            sctx.fillText(line, 0, 20 * (i + 1));
        });
        return drawText;
    })();
    
    b.on('node', function (node) {
        var nodesrc = src.slice(node.start.pos, node.end.pos+1);
        var startx = node.start.col * 10 + 8;
        var starty = node.start.line * 20 + 10;
        
        var lines = nodesrc.split('\n');
        lines.forEach(function (line,linenum) {
            var endx = line.length * 10 + 8;
            if ((linenum === lines.length-1) && (linenum !== 0)) {
                var match = line.match(/\S/);
                startx = 8 + (match && line.match(/\S/).index * 10 || 0);
                heat.line(
                    startx, starty + (linenum * 20),
                    node.end.col * 10 + 8,
                    starty + (linenum * 20),
                    1
                );
            }
            else if (linenum >= 1) {
                var match = line.match(/\S/);
                startx = 8 + (match && line.match(/\S/).index * 10 || 0);
                heat.line(
                    startx, starty + (linenum * 20),
                    endx, starty + (linenum * 20),
                    1
                );
            }
            else {
                heat.line(startx,starty, endx, starty ,1);
            }
        });
        heat.draw();
    });
    
    b.scale = function (x, y) {
        if (y === undefined) y = x;
        heat.scale(x, y);
        heat.draw();
        
        scanvas.width = Math.floor(x * width);
        scanvas.height = Math.floor(y * height);
        sctx.scale(x, y);
        
        drawText();
    };
    
    return b;
};
