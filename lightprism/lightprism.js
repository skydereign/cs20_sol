function Light (x, y, a, r, s, c) {
    this.x = x; // x position
    this.y = y; // y position
    this.angle = a; // direction of light
    this.radius = r; // length of light
    this.spread = s; // angle spread of light
    this.color = c; // rgba
}


function LightManager (w, h) {
    Sprite.call(this);
    this.x = 0;
    this.y = 0;
    this.lights = [];
    this.width = w;
    this.height = h;
    this.drawAll = false; // used to determine if lights are drawn out of view
    this.col_map = null;
}
LightManager.prototype = new Sprite();

function distance (x1, y1, x2, y2) {
    var x = x1-x2;
    var y = y1-y2;
    return Math.sqrt(x*x+y*y);
}

LightManager.prototype.remove = function (idx) {
    if(idx > this.lights.length) {
	return false;
    }
    
    this.lights.splice(idx, 1);
    return true;
}

LightManager.prototype.draw = function (ctx) {
    ctx.globalCompositeOperation='lighter';

    var xc = this.x+this.width/2; // center of screen
    var yc = this.y+this.height/2; // center of screen

    var x1 = this.x/20;
    var y1 = this.y/20;
    var x2 = (this.x+this.width)/20;
    var y2 = (this.y+this.height)/20;

    for(var idx=0; idx<this.lights.length; idx++) {
	var light = this.lights[idx];
	var radius = light.radius;
	var xl = light.x/20;
	var yl = light.y/20;

	ctx.save();

	// could also check angles
	// if the light is within range
	var max_dist = light.radius+distance(x1*20, y1*20, x2*20, y2*20)/2;
	var onScreen = true;//(light.x>=this.x && light.x<this.x+this.width && light.y>=this.y && light.y<this.y+this.height);

	if(this.drawAll || distance(xc, yc, xl, yl)<max_dist) {
	    var ang_start = light.angle-light.spread/2;
	    var ang_end = light.angle+light.spread/2;
	    var step = 0.1; // TODO: fix this, should be based off radius

	    var x_hit; // used to detect where collisions happen
	    var y_hit;

	    ctx.fillStyle = light.color;
	    ctx.beginPath();
	    ctx.moveTo(light.x-this.x*2, light.y-this.y*2);
	    // note must use times 2 because light positions are relative

	    for(var i=ang_start; i<ang_end; i+=step) {
		// ang is in radians
		var ang = (i*Math.PI/180)%(2*Math.PI);
		if(ang<0) {
		    ang+=2*Math.PI; 
		}

		var sin = Math.sin(ang);
		var cos = Math.cos(ang);
		var dist = undefined;
		var x = xl;
		var y = yl;

		if(onScreen) { // optimized to prevent calculations out of screen
		    while(x>=x1 && x<x2 && y>=y1 && y<y2) {
			var x_col = Math.floor(x);
			var y_col = Math.floor(y);
			var t_dist = distance(xl, yl, x, y); // improve?
			
			// can be optimized to prevent checking radius
			if(t_dist<=light.radius/20 && this.col_map[x_col][y_col]!=undefined && this.col_map[x_col][y_col]!=0) { // hit a wall
			    dist = t_dist;
			    x_hit = x;
			    y_hit = y;
			    break;
			}
			while(x_col === Math.floor(x) && y_col === Math.floor(y)) {
			    x+=cos/20;
			    y-=sin/20;
			}
		    }
		} else { // the light was offscreen
		    // TODO: fix this, so lights off screen still work
		    // problem is col_map is directly tied to canvas right now
		    // not always the case
		    var t_dist = 0;
		    do {
			var x_col = Math.floor(x);
			var y_col = Math.floor(y);
			t_dist = distance(xl, yl, x, y); // improve?
			
			// can be optimized to prevent checking radius
			if(this.col_map[x_col][y_col]!=undefined && this.col_map[x_col][y_col]!=0) { // hit a wall
			    dist = t_dist;
			    x_hit = x;
			    y_hit = y;
			    break;
			}
			x+=cos;
			y-=sin;
		    } while(t_dist<=light.radius/20);
		}

		if(dist===undefined) {
		    x_hit = xl + cos*light.radius/20;
		    y_hit = yl - sin*light.radius/20;
		}

		ctx.lineTo(x_hit*20-this.x*2, y_hit*20-this.y*2); 
	    }
	    ctx.closePath();
	    ctx.fill();
	    ctx.restore();
	}
    }
}
