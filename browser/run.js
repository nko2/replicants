var $ = require('jquery-browserify');
var bunker = require('bunker');
var heatmap = require('heatmap');
module.exports = function (src) {
	src = src.replace(/\t/g, '    ');
    var b = bunker(src);
    var lines = src.split('\n');
    
    var canvas = $('<canvas>').attr({
        width : 600,
        height : lines.length * 16 + 20
    }).appendTo($('#player'));
    
    var heat = heatmap(canvas.get(0));

heat.addPointMultiple = function(x,y, num) {
	for (var i = 0; i < num; i++) {
		this.addPoint(x,y);
	}
};		
heat.line = function (startx, starty, endx, endy, thickness) {
	if (endx == startx) { return undefined;}
	if (startx > endx) {
		var tx = endx;
		var ty = endy;
		endx = startx;
		endy = starty;
		startx = tx;
		starty = ty;
	}
	this.addPointMultiple(startx,starty, Math.floor(thickness + (thickness *0.25)));
	this.addPointMultiple(endx,endy, Math.floor(thickness + (thickness *0.25)));
	var slope = (endy - starty) / (endx - startx);
	var b = starty - (slope * startx);
	for (var x = startx; x <= endx; x+=1) {
		var y = (slope * x) + b;
		this.addPointMultiple(x,y,1);
	}	
	
};
    var ctx = canvas.get(0).getContext('2d');
    
    var div = $('<div>')
        .addClass('source')
        .text(src)
        .appendTo($('#player'))
    ;
    b.on('node', function (node) {
		var nodesrc = src.slice(node.start.pos, node.end.pos+1);
		console.log(node.start);
		console.log(nodesrc);
		console.log("*********\n");	
		var startx = node.start.col * 10 + 8;
        var starty = node.start.line * 20 + 10;
		var lines = nodesrc.split('\n');
		lines.forEach(function(line,linenum) {
			var endx = line.length * 10 + 8;
			if ((linenum === lines.length-1) && (linenum !== 0)) {
				var match = line.match(/\S/);
				if (match) {
					startx = 8 + (line.match(/\S/).index * 10);
				} else {
					startx = 8;
				}
				heat.line(startx, starty + (linenum*20), node.end.col*10 + 8,  starty + (linenum * 20),1);
			} else if (linenum >= 1) {
				var match = line.match(/\S/);
				if (match) {
					startx = 8 + (line.match(/\S/).index * 10);
				} else {
					startx = 8;
				}
				heat.line(startx,starty + (linenum*20), endx, starty + (linenum * 20),1);
			} else {
				heat.line(startx,starty, endx, starty ,1);
			}
		});
		heat.draw();
    });
    
    return b;
};
