//Object for holding all the tiles and their positions
//Given to Player so it knows where objects are for purposes of collision detection
//
function Level(cols, rows, tileSize, camera) {
	Sprite.call(this);
	this.cols = cols;
	this.rows = rows;
	this.camera = camera
	this.tileSize = tileSize;
	this.levelArray = new Array();
	for(var i = 0; i < cols; i++) {
		this.levelArray.push(new Array());
		for(var j = 0; j < rows; j++) {
			this.levelArray[i].push("empty");
		}
	}
	this.buildLevel();
}

Level.prototype = new Sprite();


Level.prototype.getTileAbs = function(x, y) {
	if(x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
		return this.levelArray[x][y];
	} else {
		return "empty";
	}
}

Level.prototype.getTile = function(x, y) {
	//returns the tile that is at the x and y value on the screen, rather than by indexed values;
	var xpos = Math.floor((x + this.camera.xpos) / this.tileSize);
	var ypos = Math.floor((y + this.camera.ypos) / this.tileSize);
	console.log(" " + this.camera.ypos);
	if(xpos >= 0 && xpos < this.cols && ypos >= 0 && ypos < this.rows) {
		return this.levelArray[xpos][ypos];
	} else {
		return "empty";
	}
}

Level.prototype.getTilexLoc = function(x) {
	return Math.floor((x + this.camera.xpos) / this.tileSize);
}

Level.prototype.getTileyLoc = function(y) {
	return Math.floor((y + this.camera.ypos) / this.tileSize);
}

Level.prototype.insertTile = function(x, y, tile) {
	if(x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
		this.levelArray[x][y] = tile; 
	} else {
		return "offlevel";
	}
}

Level.prototype.buildAndInsert = function(x, y) {
	newtile = new Tile(this, this.camera.xpos + x*this.tileSize, this.camera.ypos + y*this.tileSize, this.tileSize);
	newtile.image = Textures.load("images/Black_Tile.png");
	newtile.width = this.tileSize;
	this.addChild(newtile);
	this.insertTile(x, y, newtile);
}

Level.prototype.buildLevel = function() {
	//very temporary; for first prototype
	var basetile;
	for(var i = 0; i < cols; i++) {
		for(var j = 19; j > 16; j--) {
			this.buildAndInsert(i, j);
		}
	}
	this.buildAndInsert(15,10);
	this.buildAndInsert(16,10);
	this.buildAndInsert(17,10);
	
	this.buildAndInsert(10,13);
	this.buildAndInsert(11,13);
	this.buildAndInsert(12,13);
	
	this.buildAndInsert(28, 10);
	this.buildAndInsert(29, 10);
	this.buildAndInsert(30, 10);
	this.buildAndInsert(31, 10);
	this.buildAndInsert(32, 10);

}

Level.prototype.update = function(d) {
	//Level's update method updates all of its tiles
	for(var i = 0; i < cols; i++) {
		for(var j = 0; j < rows; j++) {
			if(typeof this.levelArray[i][j] != "string") {
				this.levelArray[i][j].update(d);
			}
		}
	}
}
