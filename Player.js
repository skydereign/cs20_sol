function Player() {
	Level_Object.call(this);
	this.level;
	this.camera;
	this.x_level;
	this.y_level;
	this.image = Textures.load("images/Player_Example.png");
	this.width = 40;
	this.height = 65;
	this.jump_lock = true;
	this.grounded = false;
	this.anims = [];
	this.anims.push(new Animation("images/stand_r.png", 40, 65, 1, 0));
	this.anims.push(new Animation("images/stand_l.png", 40, 65, 1, 0));
	this.anims.push(new Animation("images/run_r.png", 50, 65, 4, 5));
	this.anims.push(new Animation("images/run_l.png", 50, 65, 4, 5));
	this.anims.push(new Animation("images/jump_r.png", 50, 65, 1, 0));
	this.anims.push(new Animation("images/jump_l.png", 50, 65, 1, 0));
	this.changeAnimation(2);
    this.initKeys();
    this.state = 0;
    this.light = {r:0, g:0, b:0}; // r, g, b
    this.gmult = 2; // green speed multiplier
    this.gspeed = 0.0; // used current green multiplier

    var player = this;
	document.addEventListener('keydown', function (e) {
		switch(e.keyCode) {
			case 32:
				if(player.jump_lock == true) {
					player.keyd_jump();
					player.jump_lock = false;
				}
	   			break;
		}
	}, true);
	document.addEventListener('keyup', function (e) {
		switch(e.keyCode) {
			case 32:
				player.jump_lock = true;
	   			break;
		}
	}, true);
	if(this.y_velocity>this.y_acceleration && this.state!=4 && this.state!=5) {
	    this.state = 4+this.state%2; // change to falling state
	    this.changeAnimation(this.state);
	}

}

Player.prototype = new Level_Object();

Player.prototype.changeLevel = function(level) {
	this.level = level;
	this.camera = this.level.camera;
	this.x = level.x_start_player;
	this.y = level.y_start_player;
	this.x_level = this.x + this.camera.x;
	this.y_level = this.y + this.camera.y;
}

gInput.addBool(65, "a"); //a key
gInput.addBool(87, "w"); //w key
gInput.addBool(68, "d"); //d key
gInput.addBool(83, "s"); //s key
gInput.addBool(32, "spacebar");
gInput.addBool(27, "escape");

Player.prototype.update = function(d) {
	var player = this;
	var blue_angles = []; // holds all angles to process for blue

	var prev_light = {r:this.light.r, g:this.light.g, b:this.light.b};
	this.light = {r:0, g:0, b:0, m:0, y:0, c:0, w:0};

	for(var i=0; i<this.level.lightManager.polygons.length; i++) {
		var polygon = this.level.lightManager.polygons[i];
		if(polygon.within(this.x+this.width/2, this.y+this.height/2)) {
			switch(polygon.color) {
			case "rgba(255, 0, 0, 1)":
			    this.light.r = 1;
			    break;
			    
			case "rgba(0, 255, 0, 1)":
			    this.light.g = 1;
			    break;

			case "rgba(0, 0, 255, 1)":
			    blue_angles.push(this.level.lightManager.lights[i].angle);
			    this.light.b = 1;
			    break;

			case "rgba(255, 255, 255, 1)":
				//TODO: NEXT_LEVEL()
			    //alert("Congrats, that's the end.\nRefresh to restart.");
			    //end();
			    game_manager.nextLevel();
			    break;
			}
		}
	}		

	var cur_light = this.light.r + this.light.g*2 + this.light.b*5;
	switch(cur_light) {
	case 1: // red
	    this.y_velocity=-2;
	    this.state = 4+this.state%2;
	    break;

	case 2: // green
	    this.gspeed = 1.0;
	    break;

	case 3: // yellow
	    break;

	case 5: // blue
	    for(var i=0; i<blue_angles.length; i++) {
		var ang = blue_angles[i];
		this.x_velocity += Math.cos(ang)/3;
		this.y_velocity -= Math.sin(ang)/3;
		if(this.y_velocity<-2) {
		    if(this.state%2==0) {
			this.state=4;
		    } else {
			this.state=5;
		    }
		    this.changeAnimation(this.state);
		}
	    }
	    break;

	case 6: // magenta
	    break;

	case 7: // cyan
	    break;

	case 8: // white
	    break;
	}


	if(this.light.gspeed>0) {
	    this.gspeed-=0.025;
	}

	//sif(gInput.escape) {console.log("x: ", this.x_level, " y: ", this.y_level); end(); } // end the game (insert error...)
	if(gInput.a) {
		this.keyd_left();
	}
	if(gInput.d) {
	    this.keyd_right();
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
		if(this.y_velocity>this.y_acceleration) {
		    this.state = this.state%2==0 ? 4 : 5;
		    this.changeAnimation(this.state);
		}
	} else {
		//console.log(collisions.y);
		if(this.y_velocity>0 && (this.state==4 || this.state==5)) {
		    this.jump_landing();
		}
		this.y_level = collisions.y;
		this.y_velocity = 0;
	}
	if(collisions.x == -1) {
		if(this.camera.checkToMovex(this.x_velocity + this.x, this.x_velocity)) {
			this.camera.move(this.x_velocity, 0);
		}
	}
	if(collisions.y == -1 && this.grounded == false) {
		if(this.camera.checkToMovey(this.y_velocity + this.y, this.y_velocity)) {
			this.camera.move(0, this.y_velocity);
		} 
	}
	this.x = Math.floor(this.x_level - this.camera.x);
	this.y = Math.floor(this.y_level - this.camera.y);
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

Player.prototype.initKeys = function () {
    var player = this;
    document.addEventListener('keyup', function (e) {
	switch(e.keyCode) {
	case 37: // left
	case 65: // a
	    player.keyu_left();
	    break;

	case 39: // right
	case 68: // d
	    player.keyu_right();
	    break;
	}
    }, true);

    gInput.addLBtnFunc(function() {
	var warp = false;
	for(var i=0; i<player.level.lightManager.polygons.length; i++) {
	    var polygon = player.level.lightManager.polygons[i];
	    if(polygon.color == "rgba(255, 255, 0, 0.8)") {
		if(polygon.within(gInput.mouse.x, gInput.mouse.y)) {
		    warp = true;
		    break;
		}
	    }
	}
	if(warp) {
	    for(var i=0; i<player.level.lightManager.polygons.length; i++) {
		var polygon = player.level.lightManager.polygons[i];
		if(polygon.color == "rgba(255, 255, 0, 0.8)") {
		    if(polygon.within(player.x+player.width/2, player.y+player.height/2)) {
			var ts = player.level.tile_size;
			player.x_level = Math.round((gInput.mouse.x-player.width/2 + player.camera.x)/ts)*ts;
			player.y_level = Math.round((gInput.mouse.y-player.height/2 + player.camera.y)/ts)*ts;
			player.camera.x = player.x_level - player.camera.camera_width/2;
			player.camera.y = player.y_level - player.camera.camera_height/2;
			if(player.camera.x<0) { player.camera.x = 0; }
			if(player.camera.y<0) { player.camera.y = 0; }
			if(player.camera.x>player.level.cols*player.level.tile_size-player.camera.camera_width) {
			    player.camera.x = player.level.cols*player.level.tile_size-player.camera.camera_width;
			}
			if(player.camera.y>player.level.rows*player.level.tile_size-player.camera.camera_height) {
			    player.camera.y = player.level.rows*player.level.tile_size-player.camera.camera_height;
			}
			return;
		    }
		}
	    }
	}

    });
}




// functions that handle state/animation changes
Player.prototype.keyd_right = function () {
    switch(this.state) {
    case 0:
    case 1:
    case 3:
	this.state = 2; // run right
	break;

    case 5:
	this.state = 4; // jump right
	break;
    }
    this.x_velocity = 3 +3*this.gmult*this.light.g;
    this.changeAnimation(this.state);
}

Player.prototype.keyd_left = function () {
    switch(this.state) {
    case 0:
    case 1:
    case 2:
	this.state = 3; // run left
	break;

    case 4:
	this.state = 5; // jump left
	break;
    }
    this.x_velocity = -3-3*this.gmult*this.light.g;
    this.changeAnimation(this.state);
}


Player.prototype.keyu_right = function () {
    switch(this.state) {
    case 2:
	this.state = 0;
	this.x_velocity = 0;
	this.changeAnimation(this.state);
	break;

    case 4:
    case 5:
	this.x_velocity = 0;
	break;
    }
}

Player.prototype.keyu_left = function () {
    switch(this.state) {
    case 3:
	this.state = 1;
	this.x_velocity = 0;
	this.changeAnimation(this.state);
	break;

    case 4:
    case 5:
	this.x_velocity = 0;
	break;
    }
}


Player.prototype.keyd_jump = function () {
    switch(this.state) {
    case 0:
    case 2:
	this.y_velocity = -6;
	this.state = 4;
	this.changeAnimation(this.state);
	break;

    case 1:
    case 3:
	this.y_velocity = -6;
	this.state = 5;
	this.changeAnimation(this.state);
	break;
    }
}

Player.prototype.jump_landing = function () {
    this.x_velocity = 0;
    switch(this.state) {
    case 4:
	this.state = 0;
	this.changeAnimation(this.state);
	break;

    case 5:
	this.state = 1;
	this.changeAnimation(this.state);
	break;
    }
}
