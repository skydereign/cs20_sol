/* ALl non-tile objects on levels are
 * level objects. The various types of them 
 * (e.g Player, Block, Switch, Light) all
 * inheret many of their properties from this class
 */
function Level_Object(x, y) {
	Sprite.call(this);
	this.x = x; //Camera relative for drawing
	this.y = y;
	this.x_level = x; //level relative for computing
	this.y_level = y;
	this.camera;
	this.x_velocity = 0;
	this.x_acceleration = 0;
	this.y_velocity = 0;
	this.y_acceleration = .1;
}

Level_Object.prototype = new Sprite();

Level_Object.prototype.changeLevel = function(level) {
	this.level = level;
	this.camera = this.level.camera;
}


Level_Object.prototype.detectCollisionTile = function() {
	var new_x = this.x_level + this.x_velocity;
	var new_y = this.y_level + this.y_velocity;
	var x_collide = -1;
	var y_collide = -1;
	if(this.x_velocity < 0) {
		x_collide = this.level.checkTilesLeft(new_x, this.y_level, this.width, this.height);
	}
	if(this.x_velocity > 0) {
		x_collide = this.level.checkTilesRight(new_x, this.y_level, this.width, this.height);
	}
	if(this.y_velocity < 0) {
		y_collide = this.level.checkTilesUp(this.x_level, new_y, this.width, this.height);
	}
	if(this.y_velocity > 0) {
		y_collide = this.level.checkTilesDown(this.x_level, new_y, this.width, this.height);
	}
	var collisions = {
		"x": x_collide,
		"y": y_collide
	};
	return collisions;
}

Level_Object.prototype.update = function(d) {
	var collisions = this.detectCollisionTile();
	if(collisions.x = -1) {
		this.x += this.x_velocity;
	} else {
		this.x = collisions.x;
		this.x_velocity = 0;
	}
	if(collisions.y = -1) {
		this.y += this.y_velocity;
	} else {
		this.y = collisions.y;
		this.y_velocity = 0;
	}
	this.x_velocity += this.x_acceleration;
	this.y_velocity += this.y_acceleration;
}

Level_Object.prototype.detectCollisionObject = function(obj) {
	//NYI
}

