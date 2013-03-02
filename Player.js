function Player(x, y, level, image) {
	Level_Object.call(this, x, y);
	this.level = level;
	this.camera = this.level.camera;
	this.image = Textures.load("images/Player_Example.png");
	this.x_level = x + this.camera.x;
	this.y_level = y + this.camera.y;
	this.width = 40;
	this.height = 65;

	this.anims = [];
	this.anims.push(new Animation("images/stand_r.png", 40, 65, 1, 30));
	this.anims.push(new Animation("images/stand_l.png", 40, 65, 1, 30));
	this.anims.push(new Animation("images/run_r.png", 50, 65, 4, 5));
	this.anims.push(new Animation("images/run_l.png", 50, 65, 4, 5));
	this.anims.push(new Animation("images/jump_r.png", 50, 65, 1, 30));
	this.anims.push(new Animation("images/jump_l.png", 50, 65, 1, 30));
	this.changeAnimation(2);
}

Player.prototype = new Level_Object();

gInput.addBool(37, "left");
gInput.addBool(38, "up");
gInput.addBool(39, "right");
gInput.addBool(65, "a"); //a key
gInput.addBool(87, "w"); //w key
gInput.addBool(68, "d"); //d key
gInput.addBool(83, "s"); //s key
gInput.addBool(32, "spacebar");

Player.prototype.update = function(d) {
	for(var i=0; i<this.level.lightManager.polygons.length; i++) {
		var polygon = this.level.lightManager.polygons[i];
		if(polygon.within(this.x+this.width/2, this.y+this.height/2)) {
			if(polygon.color == "rgba(255, 0, 0, 1)") {
				this.y_velocity=-2;
			}
		}
	}		

	if(gInput.a || gInput.left) {
		this.x_velocity = -3;
	} else if(gInput.d || gInput.right) {
		this.x_velocity = 3;
	} else {
		this.x_velocity = 0;
	}
	if(gInput.w || gInput.spacebar || gInput.up) {
		if(this.y_velocity == 0) {
			this.changeAnimation(4);
			this.y_velocity = -6;
		}
	}
	var collisions = this.detectCollisionTile();
	if(collisions.x == -1) {
		this.x_level += this.x_velocity;
		this.x_velocity += this.x_acceleration;
	} else {
		this.x_level = collisions.x;
		this.x_velocity = 0;
	}
	//console.log(collisions.y);
	if(collisions.y == -1) {
		this.y_level += this.y_velocity;
		this.y_velocity += this.y_acceleration;
	} else {
		//console.log(collisions.y);
		this.y_level = collisions.y;
		this.y_velocity = 0;
	}
	if(collisions.x == -1) {
		if(this.camera.checkToMovex(this.x_velocity + this.x, this.x_velocity)) {
			this.camera.move(this.x_velocity, 0);
		}
	}
	if(collisions.y == -1) {
		if(this.camera.checkToMovey(this.y_velocity + this.y, this.y_velocity)) {
			this.camera.move(0, this.y_velocity);
		} 
	}
	this.x = this.x_level - this.camera.x;
	this.y = this.y_level - this.camera.y;
	this.level.lightManager.x_off = Math.floor(this.camera.x); // bit of a hack
	this.level.lightManager.y_off = Math.floor(this.camera.y);
}


// change animation based off of animindex/state
Player.prototype.changeAnimation = function (index) {
    this.image = this.anims[index].image;
    this.frameWidth = this.anims[index].frameWidth;
    this.frameHeight = this.anims[index].frameHeight;
    this.frameCount = this.anims[index].frameCount;
    this.frameRate = this.anims[index].frameRate;
    this.width = this.frameWidth;
    this.height = this.frameHeight;
}
