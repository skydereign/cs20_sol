//Object for holding all the tiles and their positions
//Given to Player so it knows where objects are for purposes of collision detection
//
function Level(cols, rows, tile_size, camera) {
	Sprite.call(this);
	this.cols = cols;
	this.rows = rows;
	this.camera = camera
	this.tile_size = tile_size;
	this.level_array = new Array();
	for(var i = 0; i < cols; i++) {
		this.level_array.push(new Array());
		for(var j = 0; j < rows; j++) {
			this.level_array[i].push("empty");
		}
	}
	this.buildLevel();
}

Level.prototype = new Sprite();


Level.prototype.getTileLevelRelative = function(x, y) {
	if(x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
		return this.level_array[x][y];
	} else {
		return "empty";
	}
}

Level.prototype.getTileCameraRelative = function(x, y) {
	//returns the tile that is at the x and y value on the screen, rather than by indexed values;
	var xpos = Math.floor((x + this.camera.xpos) / this.tile_size);
	var ypos = Math.floor((y + this.camera.ypos) / this.tile_size);
	console.log(" " + this.camera.ypos);
	if(xpos >= 0 && xpos < this.cols && ypos >= 0 && ypos < this.rows) {
		return this.level_array[xpos][ypos];
	} else {
		return "empty";
	}
}

Level.prototype.getTilexLoc = function(x) {
	return Math.floor((x + this.camera.xpos) / this.tile_size);
}

Level.prototype.getTileyLoc = function(y) {
	return Math.floor((y + this.camera.ypos) / this.tile_size);
}

Level.prototype.insertTile = function(x, y, tile) {
	if(x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
		this.level_array[x][y] = tile; 
	} else {
		return "offlevel";
	}
}

Level.prototype.buildAndInsert = function(x, y) {
	newtile = new Tile(this, this.camera.xpos + x*this.tile_size, this.camera.ypos + y*this.tile_size, this.tile_size);
	newtile.image = Textures.load("images/Black_Tile.png");
	newtile.width = this.tile_size;
	this.addChild(newtile);
	this.insertTile(x, y, newtile);
}

Level.prototype.buildLevel = function() {
	//very temporary; for first prototype
	var basetile;
	for(var i = 0; i < cols; i++) {
		for(var j = 29; j > 26; j--) {
			this.buildAndInsert(i, j);
		}
	}
	this.buildAndInsert(15,10);
	this.buildAndInsert(16,10);
	this.buildAndInsert(17,10);
	
	this.buildAndInsert(15,20);
	this.buildAndInsert(16,20);
	this.buildAndInsert(17,20);

	
	this.buildAndInsert(10,15);
	this.buildAndInsert(11,15);
	this.buildAndInsert(12,15);
	
	this.buildAndInsert(10,23);
	this.buildAndInsert(11,23);
	this.buildAndInsert(12,23);
	
	this.buildAndInsert(28, 10);
	this.buildAndInsert(29, 10);
	this.buildAndInsert(30, 10);
	this.buildAndInsert(31, 10);
	this.buildAndInsert(32, 10);
	
	
	this.buildAndInsert(28, 20);
	this.buildAndInsert(29, 20);
	this.buildAndInsert(30, 20);
	this.buildAndInsert(31, 20);
	this.buildAndInsert(32, 20);

}

Level.prototype.update = function(d) {
	//Level's update method updates all of its tiles
	for(var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			if(typeof this.level_array[i][j] != "string") {
				this.level_array[i][j].update(d);
			}
		}
	}
}
