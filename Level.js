function Level(cols, rows, tile_size, x_start_camera, y_start_camera, x_start_player, y_start_player) {
	Sprite.call(this);
	this.cols = cols;
	this.rows = rows;
	this.camera;
	this.x_start_camera = x_start_camera;
	this.y_start_camera = y_start_camera;
	this.x_start_player = x_start_player;
	this.y_start_player = y_start_player;
	this.tile_size = tile_size;
	this.tile_array;
	this.image_array;
	this.object_array;
	this.initArrays();
	this.buildLevel();
	var tile = new Sprite();
	tile.width = this.tile_size;
	tile.height = this.tile_size;
	tile.image = Textures.load("../../trunk/Level Editor/tiles_concept_01.png");
        tile.sliceWidth = 40;
        tile.sliceHeight = 40;
	this.tile = tile;
	this.addChild(this.tile);
	this.lightManager;
}

Level.prototype = new Sprite();

Level.prototype.giveCamera = function(camera) {
	this.camera = camera;
	this.lightManager = new LightManager(camera.camera_width, camera.camera_height, this.tile_size);
	this.lightManager.col_map = this.tile_array;
	this.lightManager.lights.push(new Light(100, 400, 270, 500, 45, 'rgba(255, 0, 0, 1)'));
	//this.lightManager.lights.push(new Light(800, 400, 200, 500, 45, 'rgba(255, 0, 0, 1)'));
	this.lightManager.lights.push(new Light(300, 1100, 45, 500, 45, 'rgba(0, 0, 255, 1)'));
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

Level.prototype.buildLevel = function() {
	//Will build based on files
	//in additon to inserting the various objects
    this.tile_array = [[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,10,10],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,10,10],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,10,10],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,10,10],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,10,10],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 2,11,11,11],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0,18,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 2,20,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 2],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 7,-1,-1,-1,-1,-1,-1,-1, 0, 9, 9, 9],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 7,-1,-1,-1,-1,-1,-1,-1, 1,10,10,10],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 7,-1,-1,-1,-1,-1,-1,-1, 1,10,10,10],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 7,-1,-1,-1,-1,-1,-1,-1, 2,11,11,11],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 7,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 8,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 0, 9,18,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,19,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,19,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,19,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,19,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,19,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,19,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,19,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,19,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,19,-1,-1,-1,-1,-1,-1,-1,-1, 1],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,10, 9, 9, 9, 9, 9, 9, 9, 9, 2],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 1,10,10,10,10,10,10,10,10,10,10,10],
		       [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1, 2,10,10,10,10,10,10,10,10,10,10,10]];
}

Level.prototype.initArrays = function() {
	tile_arr = new Array();
	object_arr = new Array();
	image_arr = new Array();
	//image_arr.push(Textures.load("images/Black_Tile.png"));
	for(var i = 0; i < this.cols; i++) {
		tile_arr.push(new Array());
		for(var j = 0; j < this.rows; j++) {
			tile_arr[i].push(-1);
		}
	}
	this.tile_array = tile_arr;
	this.object_array = object_arr;
	this.image_array = image_arr;
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

    for(var i = start_x; i < end_x; i++) {
	for(var j = start_y; j < end_y; j++) {
	    if(this.tile_array[i][j] > -1) {
		var idx = this.tile_array[i][j];
		this.tile.x = i*this.tile_size - this.camera.x;
		this.tile.y = j*this.tile_size - this.camera.y;
		this.tile.sliceX = (idx%9)*this.tile_size; // <- don't hardcoe
		this.tile.sliceY = Math.floor(idx/9)*this.tile_size;
		this.drawChildren(ctx);
	    }
	}
    }
}
