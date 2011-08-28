module.exports = function (heat) {
    heat.addPointMultiple = function(x,y, num) {
        for (var i = 0; i < num; i++) {
            this.addPoint(x,y,{weight:0.075});
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
    
    setTimeout(function draw () {
        heat.draw();
        setTimeout(draw, 300); // instead of setInterval so they don't back up
    }, 300);
    
    setTimeout(function fade () {
        var ctx = heat.alphaCanvas.getContext('2d');
        var im = ctx.getImageData(0, 0, heat.width, heat.height);
        var data = im.data;
        for (var i = 0; i < data.length; i+= 4) {
            data[i+3] *= 0.9;
        }
        ctx.putImageData(im, 0, 0);
        
        setTimeout(fade, 500); // so they don't back up
    }, 500);
    
    return heat;
};
