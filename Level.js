function Level(cols, rows, tile_size, camera) {
	Sprite.call(this);
	this.cols = cols;
	this.rows = rows;
	this.camera = camera
	this.tile_size = tile_size;
	this.tile_array;
	this.object_array;
	this.initArrays();
	this.buildLevel();
	var tile = new Sprite();
	tile.width = this.tile_size;
	tile.height = this.tile_size;
	tile.image;
	this.tile = tile;
	this.addChild(this.tile);
	this.lightManager = new LightManager(camera.camera_width, camera.camera_height, tile_size);
	this.lightManager.col_map = this.tile_array;
	this.lightManager.lights.push(new Light(100, 400, 270, 500, 45, 'rgba(255, 0, 0, 1)'));
	this.lightManager.lights.push(new Light(800, 400, 200, 500, 45, 'rgba(255, 0, 0, 1)'));
}

Level.prototype = new Sprite();

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
	for(var i = 0; i < cols; i++) {
		for(var j = 29; j > 26; j--) {
			this.tile_array[i][j] = 0;
		}
	}
	
	this.tile_array[15][10] = 0;
	this.tile_array[16][10] = 0;
	this.tile_array[17][10] = 0;
	
	this.tile_array[15][20] = 0;
	this.tile_array[16][20] = 0;
	this.tile_array[17][20] = 0;

	
	this.tile_array[10][15] = 0;
	this.tile_array[11][15] = 0;
	this.tile_array[12][15] = 0;
	
	this.tile_array[10][23] = 0;
	this.tile_array[11][23] = 0;
	this.tile_array[12][23] = 0;
	
	this.tile_array[28][10] = 0;
	this.tile_array[29][10] = 0;
	this.tile_array[30][10] = 0;
	this.tile_array[31][10] = 0;
	this.tile_array[32][10] = 0;
	
	
	this.tile_array[28][20] = 0;
	this.tile_array[29][20] = 0;
	this.tile_array[30][20] = 0;
	this.tile_array[31][20] = 0;
	this.tile_array[32][20] = 0;

	this.tile_array[0][12] = 0;
	this.tile_array[1][12] = 0;
	this.tile_array[2][12] = 0;
	this.tile_array[3][12] = 0;
	this.tile_array[4][12] = 0;
}

Level.prototype.initArrays = function() {
	tile_arr = new Array();
	object_arr = new Array();
	for(var i = 0; i < cols; i++) {
		tile_arr.push(new Array());
		for(var j = 0; j < rows; j++) {
			tile_arr[i].push(-1);
		}
	}
	this.tile_array = tile_arr;
	this.object_array = object_arr;
}


Level.prototype.getImage = function(type) {
	//Will be filled out with all the various images
	switch (type) {
	case 0:
		return "images/Black_Tile.png";
		break;
	case 1:
		return "images/Black_Tile.png";
		break;
	case 2:
		return "images/Black_Tile.png";
		break;
	case 3:
		return "images/Black_Tile.png";
		break;
	case 4:
		return "images/Black_Tile.png";
		break;
	case 5:
		return "images/Black_Tile.png";
		break;
	default:
		return null;
	}
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
	ctx.fillStyle = 'rgba(127, 127, 127, 1.0)';
	ctx.fillRect(0, 0, this.camera.camera_width, this.camera.camera_height);
	for(var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			if(this.tile_array[i][j] > -1) {
				this.tile.x = i*this.tile_size - this.camera.x;
				this.tile.y = j*this.tile_size - this.camera.y;
				this.tile.image = Textures.load(this.getImage(this.tile_array[i][j]));
				this.drawChildren(ctx);
			}
		}
	}
}
