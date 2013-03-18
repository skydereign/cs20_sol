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
    this.light = {r:0, g:0, b:0, m:0, y:0, c:0, w:0};
    this.gmult = 2; // green speed multiplier
    this.gspeed = 0.0; // used current green multiplier
		this.cjump_point = undefined;
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

	var prev_light = {r:this.light.r, g:this.light.g, b:this.light.b, m:this.light.m, y:this.light.y, c:this.light.c, w:this.light.w};
	this.light = {r:0, g:0, b:0, m:0, y:0, c:0, w:0};

	for(var i=0; i<this.level.lightManager.polygons.length; i++) {
		var polygon = this.level.lightManager.polygons[i];
		if(polygon.within(this.x+this.width/2, this.y+this.height/2)) {
			switch(polygon.color) {
			case "rgba(255, 0, 0, 1)": // red
			    this.light.r = 1;
			    break;
			    
			case "rgba(0, 255, 0, 1)": // green
			    this.light.g = 1;
			    break;

			case "rgba(0, 0, 255, 1)": // blue
			    blue_angles.push(DTR(this.level.lightManager.lights[i].angle));
			    this.light.b = 1;
			    break;

			case "rgba(255, 0, 255, 1)": // magenta
					this.light.r = 1;
					this.light.b = 1;
					break;

			case "rgba(255, 255, 0, 0.8)": // yellow
					this.light.r = 1;
					this.light.g = 1;
					break;

			case "rgba(0, 255, 255, 1)": // cyan
					this.light.g = 1;
					this.light.b = 1;
					break;

			case "rgba(255, 255, 255, 1)":
				//TODO: NEXT_LEVEL()
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
			this.light.r = 0;
			this.light.g = 0;
			this.light.y = 1;
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
			this.light.r = 0;
			this.light.b = 0;
			this.light.m = 1;

			this.y_acceleration = 0;
			this.state = 4+this.state%2;
			this.changeAnimation(this.state);
			if(gInput.d) {
					this.x_velocity+=0.5;
					if(this.x_velocity>6) {
							this.x_velocity = 6;
					}
					if(this.state==5) {
							this.state = 4;
							this.changeAnimation(this.state);
					}
			}
			if(gInput.a) {
					this.x_velocity-=0.5;
					if(this.x_velocity<-6) {
							this.x_velocity = -6;
					}
					if(this.state==4) {
							this.state = 5;
							this.changeAnimation(this.state);
					}
			}
			if(gInput.w) {
					this.y_velocity-=0.5;
					if(this.y_velocity<-6) {
							this.y_velocity = -6;
					}
			}
			if(gInput.s) {
					this.y_velocity+=0.5;
					if(this.y_velocity>6) {
							this.y_velocity = 6;
					}
			}
	    break;

	case 7: // cyan
			this.light.g = 0;
			this.light.b = 0;
			this.light.c = 1;
	    break;

	case 8: // white
			this.light.r = 0;
			this.light.g = 0;
			this.light.b = 0;
			this.light.w = 1;
	    break;
	}

	// checks for signs
	if(this.level.sign_texts!=undefined) {
		for(var i=0; i<this.level.sign_texts.length; i++) {
			var xt = Math.round(this.x_level/40) - this.level.sign_texts[i][0];
			var yt = Math.round(this.y_level/40) - this.level.sign_texts[i][1];

			if(this.level.sign_texts[i].sprite == undefined) {
				if(Math.abs(xt)<=2 && Math.abs(yt)<=1) {
					var sign_x = this.level.sign_texts[i][0]*this.level.tile_size;
					var sign_y = this.level.sign_texts[i][1]*this.level.tile_size;
					if(game_manager.victory==false || game_manager.current_level!=0) {
					    this.level.sign_texts[i].sprite = new Sign(this.level.sign_texts[i][2], sign_x, sign_y-30, this.camera);
					    world.addChild(this.level.sign_texts[i].sprite);
					} else {
					    if(this.level.sign_texts[i][0]==6) {
						this.level.sign_texts[i].sprite = new Sign("And you thought you\naccomplished something.", sign_x, sign_y-30, this.camera);
						world.addChild(this.level.sign_texts[i].sprite);
					    } else {
						this.level.sign_texts[i].sprite = new Sign("Developed by 6Ten\nMusic from incompotech.com", sign_x, sign_y-30, this.camera);
						world.addChild(this.level.sign_texts[i].sprite);
					    }
					}

					    

				}
			} else {
				if(Math.abs(xt)>2 || Math.abs(yt)>1) {
						this.level.sign_texts[i].sprite.remove();
						this.level.sign_texts[i].sprite = undefined;
				}
			}
		}
	}

	if(this.gspeed>0) {
	    this.gspeed-=0.025;
	}

	if(prev_light.m==1 && this.light.m==0) { // left the magenta light
			this.y_acceleration = 0.22;
	}


	//if(gInput.escape) {console.log("x: ", this.x_level/40, " y: ", this.y_level/40); }
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
	if(collisions.y == -1 && this.grounded == false && Math.abs(this.y_velocity) > this.y_acceleration) {
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
						
				case 32:
				case 87:
						player.jump_lock = true;
	   				break;
				}
    }, true);

		document.addEventListener('keydown', function (e) {
				switch(e.keyCode) {
				case 32:
				case 87:
						if(player.jump_lock == true) {
								player.keyd_jump();
								player.jump_lock = false;
						}
				}
		});
				
    gInput.addLBtnFunc(function() {
				var warp = false;
				var colors = {r:0, g:0, b:0};
				for(var i=0; i<player.level.lightManager.polygons.length; i++) {
						var polygon = player.level.lightManager.polygons[i];
						if(polygon.within(gInput.mouse.x, gInput.mouse.y)) {
								switch(polygon.color) {
								case "rgba(255, 255, 0, 0.8)":
										colors.r = 1;
										colors.g = 1;
										break;
										
								case "rgba(255, 0, 0, 1)":
										colors.r = 1;
										break;
										
								case "rgba(0, 255, 0, 1)":
										colors.g = 1;
										break;
										
								case "rgba(255, 255, 255, 1)":
										colors.r = 1;
										colors.g = 1;
										colors.b = 1;
										break;
								}
						}
				}
				if(colors.r==1 && colors.g==1 && colors.b===0) { // mouse in yellow light

						if(player.light.y == 1) {
								var old_x = player.x_level;
								var old_y = player.y_level;
								var ts = player.level.tile_size;
								player.x_level = Math.round((gInput.mouse.x-player.width/2 + player.camera.x)/ts)*ts;
								player.y_level = Math.round((gInput.mouse.y-player.height/2 + player.camera.y)/ts)*ts;
								warp_collision = player.detectCollisionTile();
								if(!(warp_collision.x_collide != -1 && warp_collision.y_collide != -1 && player.level.getTile(player.x_level, player.y_level) != -1))  {
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
									player.y_velocity = -2;
								} else {
									console.log("foo");
									player.x_level = old_x;
									player.y_level = old_y;
								}
						}
						
		    }
    });
}




// functions that handle state/animation changes
Player.prototype.keyd_right = function () {
		if(this.light.m==0) {
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
				this.x_velocity = 3 +3*this.gmult*this.gspeed;
				this.changeAnimation(this.state);
		}
}

Player.prototype.keyd_left = function () {
		if(this.light.m==0) {
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
				this.x_velocity = -3-3*this.gmult*this.gspeed;
				this.changeAnimation(this.state);
		} else {
				this.x_velocity-=0.25;
				if(this.x_velocity<-4) {
						this.x_velocity = -4;
				}
		}
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
		if(this.light.m==0) {
				switch(this.state) {
				case 0:
				case 2:
				case 1:
				case 3:
						var sm = new SoundManager();
						sm.load("sounds/jump.wav");
						sound = sm.play("sounds/jump.wav");
						sound.volume = 0.5;
						this.y_velocity = -6;
						this.state = 4+this.state%2;
						this.changeAnimation(this.state);
						break;

				case 4:
				case 5:
						if(this.light.c==1) {
								if(this.cjump_point == undefined) {
										var sm = new SoundManager();
										sm.load("sounds/jump.wav");
										sound = sm.play("sounds/jump.wav");
										sound.volume = 0.5;
										this.y_velocity = -5;
										this.cjump_point = {x:this.x, y:this.y};
								} else {
										var xd = this.x-this.cjump_point.x;
										var yd = this.y-this.cjump_point.y;
										var dist = Math.sqrt(Math.pow(xd, 2)+Math.pow(yd, 2));
										if(dist>50) {
												var sm = new SoundManager();
												sm.load("sounds/jump.wav");
												sound = sm.play("sounds/jump.wav");
												sound.volume = 0.5;
												this.y_velocity = -5;
												this.cjump_point = {x:this.x, y:this.y};
										}
								}
						}
						break;
				}
		} else {
				this.y_velocity-=-.25;
				if(this.y_velocity<-4) {
						this.y_velocity = -4;
				}
		}
}

Player.prototype.jump_landing = function () {
    this.x_velocity = 0;
		this.cjump_point = undefined; // reset for cjump
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
