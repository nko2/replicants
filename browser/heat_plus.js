module.exports = function (heat) {
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
    
    return heat;
};
