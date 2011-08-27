var $ = require('jquery-browserify');
var bunker = require('bunker');
var heatmap = require('heatmap');

module.exports = function (src) {
    var b = bunker(src);
    var lines = src.split('\n');
    
    var canvas = $('<canvas>')
        .addClass('heat')
        .attr('width', 600)
        .attr('height', lines.length * 20)
        .appendTo($('#player'))
        .get(0)
    ;
    
    var heat = heatmap(canvas);
    var ctx = canvas.getContext('2d');
    
    var scanvas = $('<canvas>')
        .attr('width', 600)
        .attr('height', 141)
        .addClass('source')
        .appendTo($('#player'))
        .get(0)
    ;
    
    var sctx = scanvas.getContext('2d');
    sctx.fillStyle = 'white';
    sctx.font = '16px monospace';
    src.split('\n').forEach(function (line, i) {
        sctx.fillText(line, 0, 20 * (i + 1));
    });
    //sctx.globalCompositeOperation = 'source-atop';
    
    b.on('node', function (node) {
        var x = node.start.col * 10 + 8;
        var y = node.start.line * 20 + 10;
        heat.addPoint(x, y);
        heat.draw();
    });
    
    return b;
};
