var $ = require('jquery-browserify');
var bunker = require('bunker');
var heatmap = require('heatmap');

module.exports = function (src) {
    var b = bunker(src);
    var lines = src.split('\n');
    
    var canvas = $('<canvas>').attr({
        width : 600,
        height : lines.length * 16 + 20
    }).appendTo($('#player'));
    
    var heat = heatmap(canvas.get(0));
    var ctx = canvas.get(0).getContext('2d');
    
    var div = $('<div>')
        .addClass('source')
        .text(src)
        .appendTo($('#player'))
    ;
    
    b.on('node', function (node) {
        var x = node.start.col * 10 + 8;
        var y = node.start.line * 20 + 10;
        heat.addPoint(x, y);
        heat.draw();
    });
    
    return b;
};
