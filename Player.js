//Player Object
//
//
function Player(level, x, y) {
	Sprite.call(this);
	this.image = Textures.load("images/Big_Blue_Tile.png");
	this.width = 30; //Sprite dimensions
	this.height = 60;
	this.level = level;
	this.camera = level.camera;
	this.x = x - this.camera.xpos;
	this.y = y - this.camera.ypos;
	this.absx = x;
	this.absy = y;
	this.x_acceleration = 0;
	this.y_acceleration = .1;
	this.x_velocity = 0;
	this.y_velocity = 0;
	this.max_x_velocity = 10;
	this.max_y_velocity = 10;
}

Player.prototype = new Sprite();

//gInput.addBool(##, "esc") //esc key
gInput.addBool(37, "left");
gInput.addBool(38, "up");
gInput.addBool(39, "right");

gInput.addBool(65, "a"); //a key
gInput.addBool(87, "w"); //w key
gInput.addBool(68, "d"); //d key
gInput.addBool(83, "s"); //s key
gInput.addBool(32, "spacebar");

Player.prototype.update = function(d) {
	if(gInput.a || gInput.left) {
		this.x_velocity = -3;
	} else if(gInput.d || gInput.right) {
		this.x_velocity = 3;
	} else {
		this.x_velocity = 0;
	}
	if(gInput.w || gInput.spacebar || gInput.up) {
		if(this.y_velocity == 0) {
			this.y_velocity = -5.5;
		}
	}
	this.detect_collision();
}

//Current collision implemenetation treats the player's sprite dimensions as a bounding box
//which the size of two stacked tiles.
Player.prototype.detect_collision = function() {
	var hitx = 0; //counters for collisions
	var hity = 0;
	var new_x = this.x + this.x_velocity;
	var new_y = this.y + this.y_velocity;
	var xloc = this.level.getTilexLoc(new_x);
	var yloc = this.level.getTileyLoc(this.y);
	console.log("Player's x loc: " + this.x  + ", Player's y loc: " + this.y);
	console.log("Player's x loc: " + this.level.getTilexLoc(this.x)  + ", Player's y loc: " + this.level.getTileyLoc(this.y));
    if(this.x_velocity > 0) {
		console.log("right");
		//checking to the right
	    for(var i = 0; i < 3; i++) {
	     	if(this.level.getTileAbs(xloc+1,yloc+i) != "empty") {
			    this.x_velocity = 0;
			    this.absx = this.level.getTileAbs(xloc+1, yloc+i).absx - this.width-.11;
			    hitx++;
			}
		}
	}  
	console.log(this.x_velocity + "");
	if(this.x_velocity < 0) {
		console.log("left");
		//checking to the left
		for(var i = 0; i < 3; i++) {
			if(this.level.getTileAbs(xloc, yloc+i) != "empty") {
				this.x_velocity = 0;
				this.absx = this.level.getTileAbs(xloc, yloc+i).absx + this.width+.11;
				hitx++;
			}
		}
	} 
	xloc = this.level.getTilexLoc(this.x);
	yloc = this.level.getTileyLoc(new_y);
	if(hitx == 0) {
		if(this.camera.checkToMovex(this.x_velocity + this.x, this.x_velocity)) {
			this.camera.move(this.x_velocity, 0);
		} 
		this.absx += this.x_velocity;
		this.x_velocity += this.x_acceleration;
	}
	if(this.y_velocity > 0 && hitx == 0) {
		console.log("down");
		//checking downward
		for(var i = 0; i < 2; i++) {
			if(this.level.getTileAbs(xloc+i, yloc+2) != "empty") {
				this.y_velocity = 0;
				console.log("MOVED");
				this.absy = this.level.getTileAbs(xloc+i, yloc+2).absy - this.height-.11;
				hity++;
			}
		}
	} else if(this.y_velocity < 0 && hitx == 0) {
		console.log("up");
		//checking above
		for(var i = 0; i < 2; i++) {
			if(this.level.getTileAbs(xloc+i, yloc) != "empty") {
				this.y_velocity = 0;
				this.absy = this.level.getTileAbs(xloc+i, yloc).absy + this.height/2+.11;
				hity++;
			}
		}
	}
	if(hity == 0) {
		if(this.camera.checkToMovey(this.y_velocity + this.y, this.y_velocity)) {
			this.camera.move(0, this.y_velocity);
		} 
		this.absy += this.y_velocity;
		this.y_velocity += this.y_acceleration;
	}
	this.x = this.absx - this.camera.xpos;
	this.y = this.absy - this.camera.ypos;
}
