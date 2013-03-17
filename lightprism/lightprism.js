function Light (x, y, a, r, s, c, m_b, m_a, m_s, m_t, r_b, r_k, r_s, r_r) {
    this.x = x; // x position
    this.y = y; // y position
    this.angle = a; // direction of light
    this.radius = r; // length of light
    this.spread = s; // angle spread of light
    this.color = this.COLORS_A[c]; // rgba
    this.color_end = this.COLORS_B[c]; // rgba
		this.color_idx = c;

		this.move_bool = m_b; // sets if light moves
		this.move_delta = 0; // timer variable for movement
		this.move_angle = DTR(m_a); // angle to move in
		this.move_speed = m_s; // speed to move at
		this.move_time  = m_t; // time to move for

		this.rotate_bool = r_b; // sets if the light rotates
		this.rotate_type = r_k; // 0 = full rotation, 1 = min/max rotate
		this.rotate_speed = r_s; // speed at which it rotates
		this.rotate_range = r_r; // range for rotation (not used in full)
		this.rotate_start = a; // hold the original position

}
Light.prototype.COLORS_A = ["rgba(255, 0, 0, 1)",
														"rgba(0, 255, 0, 1)",
														"rgba(0, 0, 255, 1)",
														"rgba(255, 0, 255, 1)",
														"rgba(255, 255, 0, 0.8)",
														"rgba(0, 255, 255, 1)",
														"rgba(255, 255, 255, 1)"];
Light.prototype.COLORS_B = ["rgba(255, 0, 0, 0.3)",
														"rgba(0, 255, 0, 0.3)",
														"rgba(0, 0, 255, 0.3)",
														"rgba(255, 0, 255, 0.3)",
														"rgba(255, 255, 0, 0.2)",
														"rgba(0, 255, 255, 0.3)",
														"rgba(255, 255, 255, 0.3)"];




function LightManager (w, h, ts, col_map, xs, ys) {
    Sprite.call(this);
    this.x = 0;
    this.y = 0;
		this.x_off = 0; // offset used for Level
		this.y_off = 0;
    this.lights = [];
    this.width = w;
    this.height = h;
    this.drawAll = false; // used to determine if lights are drawn out of view
    this.col_map = col_map;
		this.x_max = xs;
		this.y_max = ys;
    this.tile_size = ts;
		this.polygons = [];
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

LightManager.prototype.update = function (d) {
    //ctx.globalCompositeOperation='lighter';
		
    var xc = this.x+this.width/2; // center of screen
    var yc = this.y+this.height/2; // center of screen

    var x1 = this.x/this.tile_size;
    var y1 = this.y/this.tile_size;
    var x2 = (this.x+this.width)/this.tile_size;
    var y2 = (this.y+this.height)/this.tile_size;

		this.polygons = []; // wipe polygons each frame (can optimize)

    for(var idx=0; idx<this.lights.length; idx++) {
				var light = this.lights[idx];


				if(light.move_bool) { // handle movement
						light.move_delta+=1;
						light.x += Math.cos(light.move_angle)*light.move_speed;
						light.y -= Math.sin(light.move_angle)*light.move_speed;
						if(light.move_delta>light.move_time) {
								light.move_angle=(light.move_angle+Math.PI)%(2*Math.PI); // reverse direction
								light.move_delta = 0;
						}
				}

				if(light.rotate_bool) { // handle rotation
						switch(light.rotate_type) {
						case 0: // full rotation
								light.angle+=light.rotate_speed;
								break;

						case 1: // partial rotation
								light.angle+=light.rotate_speed;
								if(light.angle<light.rotate_start || light.angle>light.rotate_start+light.rotate_range) {
										light.rotate_speed*=-1; // reverse direction
								}
								break;
						}
				}

				var radius = light.radius;
				var xl = light.x/this.tile_size;
				var yl = light.y/this.tile_size;

				// could also check angles
				// if the light is within range
				var max_dist = light.radius+distance(x1*this.tile_size, y1*this.tile_size, x2*this.tile_size, y2*this.tile_size)/2;
				var onScreen = (light.x>=this.x && light.x_off<this.x+this.width && light.y_off>=this.y && light.y_off<this.y+this.height);

				if(this.drawAll || distance(xc, yc, this.x+xl, this.y+yl)<max_dist) {
						var ang_start = light.angle-light.spread/2;
						var ang_end = light.angle+light.spread/2;
						var step = 0.8; // handles precision

						var x_hit; // used to detect where collisions happen
						var y_hit;

						this.polygons[idx] = new Polygon();
						this.polygons[idx].color = light.color;
						this.polygons[idx].add(light.x-this.x_off, light.y-this.y_off);
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
										this.polygons[idx].draw=true;
										while(x>=x1 && x<x2 && y>=y1 && y<y2) {
												var x_col = Math.floor(x);
												var y_col = Math.floor(y);
												var t_dist = distance(xl, yl, x, y); // improve?
												// can be optimized to prevent checking radius
												if(t_dist<=light.radius/this.tile_size && this.col_map[x_col][y_col]!=undefined && this.col_map[x_col][y_col]!=-1 && this.col_map[x_col][y_col]<108 && !(this.col_map[x_col][y_col]>=6 && this.col_map[x_col][y_col]<=8)) { // hit a wall
														dist = t_dist;
														x_hit = x;
														y_hit = y;
														break;
												}
												while(x_col === Math.floor(x) && y_col === Math.floor(y)) {
														x+=cos/this.tile_size*2;
														y-=sin/this.tile_size*2;
												}
										}
								} else { // the light was offscreen
										this.polygons[idx].draw=false;
										var t_dist = 0;
										do {
												var x_col = Math.floor(x);
												var y_col = Math.floor(y);
												t_dist = distance(xl, yl, x, y); // improve?
												
												if(x_col<0 || y_col<0 || x_col>=this.x_max || y_col>=this.y_max) { // out of bounds
														break;
												}

												// can be optimized to prevent checking radius
												if(t_dist<=light.radius/this.tile_size && this.col_map[x_col][y_col]!=undefined && this.col_map[x_col][y_col]!=-1 && this.col_map[x_col][y_col]<108 && !(this.col_map[x_col][y_col]>=6 && this.col_map[x_col][y_col]<=8)) {
														dist = t_dist;
														x_hit = x;
														y_hit = y;
														break;
												}
												while(x_col === Math.floor(x) && y_col === Math.floor(y)) {
														x+=cos/this.tile_size*2;
														y-=sin/this.tile_size*2;
												}
										} while(t_dist<=light.radius/this.tile_size);
								}

								if(dist===undefined) {
										x_hit = xl + cos*light.radius/this.tile_size;
										y_hit = yl - sin*light.radius/this.tile_size;
								}
								this.polygons[idx].add(x_hit*this.tile_size-this.x_off, y_hit*this.tile_size-this.y_off);
						}
				}
    }
}

LightManager.prototype.draw = function (ctx) {
		ctx.globalCompositeOperation='lighter';
		var count = 0;
		for(var i=0; i<this.polygons.length; i++) {
				if(this.polygons[i]) {
						var vw = this.width/2;
						var vh = this.height/2;
						var vcx = this.width/2;
						var vcy = this.height/2;
						
						var pw = (this.polygons[i].max_x - this.polygons[i].min_x)/2;
						var ph = (this.polygons[i].max_y - this.polygons[i].min_y)/2;
						var pcx = this.polygons[i].min_x + pw;
						var pcy = this.polygons[i].min_y + ph;
						if(Math.abs(pcx-vcx)<=vw+pw && Math.abs(pcy-vcy)<=vh+ph) {
								count++;
								ctx.save();
								var x = this.polygons[i].get(0).x;
								var y = this.polygons[i].get(0).y;
								//var lg = ctx.createRadialGradient(x, y, 30, x, y, this.lights[i].radius);
								//lg.addColorStop(0, this.lights[i].color);//this.polygons[i].color);
								//lg.addColorStop(1, this.lights[i].color_end);
								
								ctx.fillStyle = this.polygons[i].color;
								ctx.beginPath();
								ctx.moveTo(this.polygons[i].get(0).x, this.polygons[i].get(0).y);
								for(var j=1; j<this.polygons[i].count; j++) {
										ctx.lineTo(this.polygons[i].get(j).x, this.polygons[i].get(j).y);
								}
								ctx.closePath();
								ctx.fill();
								//could use this this.polygons[i].draw_fill(ctx);
								ctx.restore();
						}
				}
		}
}
