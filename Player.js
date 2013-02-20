//Player Object
//
//
function Player(level, x, y) {
	Sprite.call(this);
	this.image = Textures.load("images/Player_Example.png");
	this.width = 40; //Sprite dimensions
	this.height = 65;
	this.level = level;
	this.camera = level.camera;
	this.x = x - this.camera.xpos;
	this.y = y - this.camera.ypos;
	this.x_abs = x;
	this.y_abs = y;
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
			this.y_velocity = -6;
		}
	}
	this.detectCollision();
}

//Current collision implemenetation treats the player's sprite dimensions as a bounding box
//which the size of two stacked tiles.
Player.prototype.detectCollision = function() {
	var hit_x = 0; //counters for collisions
	var hit_y = 0;
	var new_x = this.x + this.x_velocity;
	var new_y = this.y + this.y_velocity;
	var xloc = this.level.getTilexLoc(this.x);
	var yloc = this.level.getTileyLoc(this.y);
	var downyloc = this.level.getTileyLoc(new_y + this.height);
	var upyloc = this.level.getTileyLoc(new_y);
	var leftxloc = this.level.getTilexLoc(new_x);
	var rightxloc = this.level.getTilexLoc(new_x + this.width)
	//console.log("Player's x loc: " + this.x  + ", Player's y loc: " + this.y);
	//console.log("Player's x loc: " + this.level.getTilexLoc(this.x)  + ", Player's y loc: " + this.level.getTileyLoc(this.y));
    if(this.x_velocity > 0) {
		//checking to the right
	    for(var i = 0; i < this.level.getTileyLoc(this.y+this.height) - yloc + 1; i++) {
	     	if(this.level.getTileLevelRelative(rightxloc,yloc+i) != "empty") {
			    this.x_velocity = 0;
			    this.x_abs = this.level.getTileLevelRelative(rightxloc, yloc+i).x_abs - this.width-.11;
			    hit_x++;
			}
		}
	}  
	console.log(this.x_velocity + "");
	if(this.x_velocity < 0) {
		//checking to the left
		for(var i = 0; i < this.level.getTileyLoc(this.y+this.height) - yloc + 1; i++) {
			if(this.level.getTileLevelRelative(leftxloc, yloc+i) != "empty") {
				this.x_velocity = 0;
				this.x_abs = this.level.getTileLevelRelative(leftxloc, yloc+i).x_abs + this.level.tile_size+.11;
				hit_x++;
			}
		}
	} 
	if(hit_x == 0) {
		if(this.camera.checkToMovex(this.x_velocity + this.x, this.x_velocity)) {
			this.camera.move(this.x_velocity, 0);
		} 
		this.x_abs += this.x_velocity;
		this.x_velocity += this.x_acceleration;
	}
	if(this.y_velocity > 0 && hit_x == 0) {
		//checking downward
		for(var i = 0; i < this.level.getTilexLoc(this.x+this.width) - xloc + 1; i++) {
			if(this.level.getTileLevelRelative(xloc+i, downyloc) != "empty") {
				this.y_velocity = 0;
				console.log("MOVED DOWN");
				this.y_abs = this.level.getTileLevelRelative(xloc+i, downyloc).y_abs - this.height-.11;
				hit_y++;
			}
		}
	} else if(this.y_velocity < 0 && hit_x == 0) {
		//checking above
		for(var i = 0; i < this.level.getTilexLoc(this.x+this.width) - xloc + 1; i++) {
			if(this.level.getTileLevelRelative(xloc+i, upyloc) != "empty") {
				console.log("MOVED UP");
				this.y_velocity = 0;
				this.y_abs = this.level.getTileLevelRelative(xloc+i, upyloc).y_abs + this.level.tile_size+.11;
				hit_y++;
			}
		}
	}
	if(hit_y == 0) {
		if(this.camera.checkToMovey(this.y_velocity + this.y, this.y_velocity)) {
			this.camera.move(0, this.y_velocity);
		} 
		this.y_abs += this.y_velocity;
		this.y_velocity += this.y_acceleration;
	}
	this.x = this.x_abs - this.camera.xpos;
	this.y = this.y_abs - this.camera.ypos;
}
