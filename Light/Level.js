function Level(tile_size, level_data) {
	Sprite.call(this);
	this.cols = level_data.tile_array[0].length;
	this.rows = level_data.tile_array.length;
	this.camera;
	this.x_start_camera = level_data.x_start_camera;
	this.y_start_camera = level_data.y_start_camera;
	this.x_start_player = level_data.x_start_player;
	this.y_start_player = level_data.y_start_player;
	this.level_data = level_data;
	this.tile_size = tile_size;
	this.tile_array = level_data.tile_array;
	this.tile_bg = level_data.tile_bg;
	this.tile_fg = level_data.tile_fg;
	this.sign_texts = level_data.signs;

	this.alterLevel();
	this.image_array;
	this.object_array;
	var tile = new Sprite();
	tile.width = this.tile_size;
	tile.height = this.tile_size;
	tile.image = Textures.load("../../trunk/Level Editor/tiles_concept_01.png");
        tile.sliceWidth = 40;
        tile.sliceHeight = 40;
	this.tile = tile;
	this.addChild(this.tile);
	this.lightManager;
	this.player;
}

Level.prototype = new Sprite();

Level.prototype.giveCamera = function(camera) {
	this.camera = camera;
	this.lightManager = new LightManager(camera.camera_width, camera.camera_height, this.tile_size, this.tile_array, this.cols, this.rows);
	this.lightManager.col_map = this.tile_array;
	var light_array = this.level_data.light_array;
	for(var i = 0; i < light_array.length; i++) {
		this.lightManager.lights.push(new Light(light_array[i][0], light_array[i][1], light_array[i][2], light_array[i][3], light_array[i][4], light_array[i][5], light_array[i][6], light_array[i][7], light_array[i][8], light_array[i][9], light_array[i][10], light_array[i][11], light_array[i][12], light_array[i][13]));
	}
}


Level.prototype.getTileByIndex = function(x, y) {
	//Same as getting the value directly, but adds in a bounds check.
	if(x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
		return this.tile_array[x][y];
	} else {
		return -1;
	}
}

Level.prototype.getTile = function(x, y) {
	var xpos = Math.floor(x / this.tile_size);
	var ypos = Math.floor(y / this.tile_size);
	return this.getTileByIndex(xpos, ypos);
}

Level.prototype.getTilexLoc = function(x) {
	return Math.floor(x / this.tile_size);
}

Level.prototype.getTileyLoc = function(y) {
	return Math.floor(y / this.tile_size);
}

Level.prototype.insertTile = function(x, y, type) {
	if(x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
		this.tile_array[x][y] = type; 
	} else {
		return -1;
	}
}

Level.prototype.alterLevel = function() {
	//Will build based on files
	//in additon to inserting the various objects

    var new_tiles = [];
    var new_bg = [];
    var new_fg = [];
    for(var i=0; i<this.cols; i++) {
		new_tiles[i] = [];
		new_bg[i] = [];
		new_fg[i] = [];
		for(var j=0; j<this.rows; j++) {
	 	   new_tiles[i][j] = this.tile_array[j][i];
	 	   new_bg[i][j] = this.tile_bg[j][i];
	 	   new_fg[i][j] = this.tile_fg[j][i];
		}
    }
    this.tile_array = new_tiles;
    this.tile_bg = new_bg;
    this.tile_fg = new_fg;
}



Level.prototype.getImage = function(type) {
	//Will be filled out with all the various images
	//return image_array[type];
	if(type > -1) {
		return this.image_array[0];
	}
	return -1;
}

Level.prototype.checkTilesLeft = function(x, y, width, height) {
	for(var i = 0; i < Math.floor(height / this.tile_size) + 1; i++) {
		if(this.getTile(x, y + (i * this.tile_size)) != -1) {
			return this.getTilexLoc(x)*this.tile_size + this.tile_size + .11;
		}
	}
	return -1;
}

Level.prototype.checkTilesRight = function(x, y, width, height) {
	for(var i = 0; i < Math.floor(height / this.tile_size) + 1; i++) {
	    if(this.getTile(x + width, y + (i * this.tile_size)) != -1) {
	    	return this.getTilexLoc(x + width)*this.tile_size - width - .11;
		}
	} 
	return -1;
}

Level.prototype.checkTilesUp = function(x, y, width, height) {
	for(var i = 0; i < Math.floor(width / this.tile_size) + 1; i++) {
		if(this.getTile(x + (i * this.tile_size), y) != -1) {
			return this.getTileyLoc(y)*this.tile_size + this.tile_size+.11;
		}
	}
	return -1;
}

Level.prototype.checkTilesDown = function(x, y, width, height) {
	for(var i = 0; i < Math.floor(width / this.tile_size) + 1; i++) {
		if(this.getTile(x + (i * this.tile_size), y + height) != -1) {
			return this.getTileyLoc(y+height)*this.tile_size - height;
		}
	}
	return -1;
}

Level.prototype.update = function (d) {
	this.lightManager.x_off = Math.floor(this.camera.x); // TODO: put in Level.update
	this.lightManager.y_off = Math.floor(this.camera.y);    
	this.updateChildren(d);
}

Level.prototype.draw = function(ctx) {
    //draws the tile in all its spots.
    var count = 0;
    var start_x = Math.floor(this.camera.x/this.tile_size)-1;
    var start_y = Math.floor(this.camera.y/this.tile_size)-1;
    var end_x = Math.floor((this.camera.x+this.camera.camera_width)/this.tile_size)+1;
    var end_y = Math.floor((this.camera.y+this.camera.camera_height)/this.tile_size)+1;
    start_x = start_x<0 ? 0 : start_x;
    start_y = start_y<0 ? 0 : start_y;

    end_x = end_x>this.cols ? this.cols : end_x;
    end_y = end_y>this.rows ? this.rows : end_y;

    ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
    ctx.fillRect(0, 0, this.camera.camera_width, this.camera.camera_height);


    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // shading bg tiles
    for(var i = start_x; i < end_x; i++) {
	for(var j = start_y; j < end_y; j++) {
	    if(this.tile_bg[i][j] > -1) {
		var idx = this.tile_bg[i][j];
		this.tile.x = Math.floor(i*this.tile_size - this.camera.x);
		this.tile.y = Math.floor(j*this.tile_size - this.camera.y);
		this.tile.sliceX = (idx%9)*this.tile_size; // <- don't hardcode
		this.tile.sliceY = Math.floor(idx/9)*this.tile_size;
		this.drawChildren(ctx);
	    }
	}
    }
    ctx.fillRect(0, 0, 920, 600);

    for(var i = start_x; i < end_x; i++) {
	for(var j = start_y; j < end_y; j++) {
	    if(this.tile_array[i][j] > -1) {
		var idx = this.tile_array[i][j];
		this.tile.x = Math.floor(i*this.tile_size - this.camera.x);
		this.tile.y = Math.floor(j*this.tile_size - this.camera.y);
		this.tile.sliceX = (idx%9)*this.tile_size; // <- don't hardcode
		this.tile.sliceY = Math.floor(idx/9)*this.tile_size;
		this.drawChildren(ctx);
	    }

	    if(this.tile_fg[i][j] > -1) {
		var idx = this.tile_fg[i][j];
		this.tile.x = Math.floor(i*this.tile_size - this.camera.x);
		this.tile.y = Math.floor(j*this.tile_size - this.camera.y);
		this.tile.sliceX = (idx%9)*this.tile_size; // <- don't hardcode
		this.tile.sliceY = Math.floor(idx/9)*this.tile_size;
		this.drawChildren(ctx);
	    }
	}
    }
}
