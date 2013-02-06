function Light (x, y, a, r, s, c) {
    this.x = x; // x position
    this.y = y; // y position
    this.angle = a; // direction of light
    this.radius = r; // length of light
    this.spread = s; // angle spread of light
    this.color = c; // rgba
}


function LightManager (w, h) {
    this.x = 0;
    this.y = 0;
    this.lights = [];
    this.lightCtx;
    this.width = w;
    this.height = h;
    this.drawAll = false; // used to determine if lights are drawn out of view
    this.col_map = null;
}

function distance (x1, y1, x2, y2) {
    var x = x1-x2;
    var y = y1-y2;
    return Math.sqrt(x*x+y*y);
}

LightManager.prototype.draw = function () {
    this.lightCtx.fillStyle='black';
    this.lightCtx.clearRect(0, 0, this.width, this.height);
    this.lightCtx.globalCompositeOperation='lighter';

    var xc = this.x+this.width/2; // center of screen
    var yc = this.y+this.height/2; // center of screen

    var x1 = this.x;
    var y1 = this.y;
    var x2 = this.x+this.width;
    var y2 = this.y+this.height;

    for(var idx=0; idx<this.lights.length; idx++) {
	var light = this.lights[idx];
	var radius = light.radius;
	var xl = light.x;
	var yl = light.y;

	this.lightCtx.save();

	// could also check angles
	// if the light is within range
	var max_dist = light.radius+distance(x1, y1, x2, y2)/2;
	if(this.drawAll || distance(xc, yc, xl, yl)<max_dist) {
	    var ang_start = light.angle-light.spread/2;
	    var ang_end = light.angle+light.spread/2;
	    var step = 0.1; // TODO: fix this, should be based off radius

	    var x_hit; // used to detect where collisions happen
	    var y_hit;

	    this.lightCtx.fillStyle = light.color;
	    this.lightCtx.beginPath();
	    this.lightCtx.moveTo(xl, yl);

	    for(var i=ang_start; i<ang_end; i+=step) {
		// ang is in radians
		var ang = (i*Math.PI/180)%(2*Math.PI);
		if(ang<0) {
		    ang+=2*Math.PI; 
		}

		var sin = Math.sin(ang);
		var cos = Math.cos(ang);
		var dist = 0;
		var x = xl;
		var y = yl;
		while(x>=x1 && x<x2 && y>=y1 && y<y2) {
		    var x_col = Math.floor(x);
		    var y_col = Math.floor(y);

		    // can be optimized to prevent checking radius
		    if(this.col_map[x_col][y_col]!=undefined && this.col_map[x_col][y_col]!=0) { // hit a wall
			dist = distance(xl, yl, x, y);
			x_hit = x;
			y_hit = y;
			break;
		    }
		    x+=cos;
		    y-=sin;
		}
		if(dist===0) {
		    x_hit = xl + cos*light.radius;
		    y_hit = yl - sin*light.radius;
		}

		this.lightCtx.lineTo(x_hit-this.x, y_hit-this.y); 
	    }
	    this.lightCtx.closePath();
	    this.lightCtx.fill();
	    this.lightCtx.restore();
	}
    }
}
