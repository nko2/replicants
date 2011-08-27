var $ = require('jquery-browserify');
var bunker = require('bunker');
var heatmap = require('heatmap');
var heatPlus = require('./heat_plus.js');

var divs = {};

module.exports = function (filename, src) {
    src = src.replace(/\t/g, '    ');
    var b = bunker(src);
    var lines = src.split('\n');
    
    var width = 800;
    var height = lines.length * 20;
    
    var div = divs[filename] = {};
    
    div.label = $('<div>')
        .addClass('label')
        .appendTo($('#player'))
    ;
    
    div.lineNum = $('<div>')
        .addClass('lineNum')
        .text('line ')
        .appendTo(div.label)
    ;
    
    div.filename = $('<div>')
        .text(filename)
        .appendTo(div.label)
    ;
    
    div.container = $('<div>')
        .addClass('file')
        .appendTo($('#player'))
    ;
    
    var canvas = $('<canvas>')
        .addClass('heat')
        .attr('width', width)
        .attr('height', height)
        .appendTo(div.container)
        .get(0)
    ;
    
    var heat = heatPlus(heatmap(canvas));
    var ctx = canvas.getContext('2d');
    
    var scanvas = $('<canvas>')
        .attr('width', width)
        .attr('height', height)
        .addClass('source')
        .appendTo(div.container)
        .get(0)
    ;

    var scale = 1;
    $('#player').mousewheel(function (ev, delta) {
        if (delta > 0) {
            scale = scale-0.1;
            b.scale(scale);
        }
        else if (delta < 0) {
            scale = scale+0.1;
            b.scale(scale);
        }
    });
    
    var sctx = scanvas.getContext('2d');
    var drawText = (function drawText () {
        sctx.save();
        sctx.fillStyle = '#1F1F1F';
        sctx.font = '16px monospace';
        sctx.translate(1,1);
        src.split('\n').forEach(function (line, i) {
            sctx.fillText(line, 15, 5 + (20 * (i + 1)));
        });
        sctx.restore();
        sctx.fillStyle = 'white';
        sctx.font = '16px monospace';
        src.split('\n').forEach(function (line, i) {
            sctx.fillText(line, 15, 5 + (20 * (i + 1)));
        });
        return drawText;
    })();
    
    b.on('node', function (node) {
        $('.active .lineNum').fadeOut(1000);
        $('.active').removeClass('active');
        $(canvas).addClass('active');
        
        Object.keys(divs).forEach(function (name) {
            if (name === filename) {
                divs[name].lineNum
                    .show()
                    .text('line ' + node.start.line)
                ;
            }
            else divs[name].lineNum.hide()
        });
        
        var nodesrc = src.slice(node.start.pos, node.end.pos+1);
        var colwidth = 10;
        var lineheight = 20;
        
        var xoffset = 24;
        var yoffset = 16;
        var startx = (node.start.col-1) * colwidth + xoffset;
        var starty = node.start.line * lineheight + yoffset;
        
        var lines = nodesrc.split('\n');
        lines.forEach(function (line,linenum) {
            var endx = line.length * colwidth + xoffset;
            if ((linenum === lines.length-1) && (linenum !== 0)) {
                var match = line.match(/\S/);
                startx = xoffset + (match && (line.match(/\S/).index -1) * colwidth|| 0);
                heat.line(
                    startx, starty + (linenum * lineheight),
                    (node.end.col * colwidth) + xoffset,
                    starty + (linenum * lineheight),
                    1
                );
            }
            else if (linenum >= 1) {
                var match = line.match(/\S/);
                startx = xoffset + (match && (line.match(/\S/).index-1) * colwidth || 0);
                heat.line(
                    startx, starty + (linenum * lineheight),
                    endx, starty + (linenum * lineheight),
                    1
                );
            }
            else {
                heat.line(startx-4,starty, endx, starty ,1);
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
