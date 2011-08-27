var $ = require('jquery-browserify');
var bunker = require('bunker');
var heatmap = require('heatmap');

module.exports = function (src) {
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
    
    var heat = heatmap(canvas);
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
        var x = node.start.col * 10 + 8;
        var y = node.start.line * 20 + 10;
        heat.addPoint(x, y);
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
