function Level(cols, rows, tile_size, x_start_camera, y_start_camera, x_start_player, y_start_player, tile_array) {
	Sprite.call(this);
	this.cols = cols;
	this.rows = rows;
	this.camera;
	this.x_start_camera = x_start_camera;
	this.y_start_camera = y_start_camera;
	this.x_start_player = x_start_player;
	this.y_start_player = y_start_player;
	this.tile_size = tile_size;
	this.tile_array = tile_array;
	this.alterLevel();
	this.tile_bg; // used for display
	this.tile_fg; // used for display
	this.image_array;
	this.object_array;
	this.initArrays();
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
	this.lightManager = new LightManager(camera.camera_width, camera.camera_height, this.tile_size, this.tile_array, this.cols, this.rows);
	this.lightManager.col_map = this.tile_array;
	this.lightManager.lights.push(new Light(580, 1400, 270, 1000, 45, 0));
	//this.lightManager.lights.push(new Light(580, 1400, 270, 1000, 45, 2));
	this.lightManager.lights.push(new Light(1300, 1200, 300, 1000, 75, 1));
	this.lightManager.lights.push(new Light(3000, 2300, 100, 600, 60, 2));
	this.lightManager.lights.push(new Light(2570, 1550, 40, 300, 40, 2));
	this.lightManager.lights.push(new Light(3070, 1350, 140, 500, 60, 2));
	this.lightManager.lights.push(new Light(1483, 1079, 30, 800, 60, 1));
	this.lightManager.lights.push(new Light(1072, 854, 330, 300, 30, 2));
	this.lightManager.lights.push(new Light(1135, 1180, 150, 300, 60, 2));
	this.lightManager.lights.push(new Light(360, 1200, 180, 400, 180, 4));
	this.lightManager.lights.push(new Light(360, 540, 270, 400, 60, 4));

	this.lightManager.lights.push(new Light(580, 340, 270, 400, 30, 0));
	this.lightManager.lights.push(new Light(1275, 370, 330, 400, 30, 4));
	this.lightManager.lights.push(new Light(1100, 470, 90, 100, 30, 2));
	this.lightManager.lights.push(new Light(1030, 315, 60, 100, 30, 2));

	this.lightManager.lights.push(new Light(1600, 140, 300, 300, 90, 1));
	this.lightManager.lights.push(new Light(2070, 40, 270, 150, 30, 0));

	this.lightManager.lights.push(new Light(2595, 412, 270, 60, 60, 4));
	this.lightManager.lights.push(new Light(2625, 468, 270, 60, 60, 4));
	this.lightManager.lights.push(new Light(2565, 468, 270, 60, 60, 4));
	this.lightManager.lights.push(new Light(2595, 519,  90, 60, 60, 6));

	this.lightManager.lights.push(new Light(2170, 668, 70, 300, 40, 2));
	this.lightManager.lights.push(new Light(3020, 668, 110, 300, 40, 2));
	this.lightManager.lights.push(new Light(2595, 200, 270, 600, 40, 1));
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

Level.prototype.initArrays = function() {
	tile_fg = new Array();
	tile_bg = new Array();
	object_arr = new Array();
	image_arr = new Array();
	//image_arr.push(Textures.load("images/Black_Tile.png"));
	for(var i = 0; i < this.cols; i++) {
		tile_fg.push(new Array());
		tile_bg.push(new Array());
		for(var j = 0; j < this.rows; j++) {
			tile_fg[i].push(-1);
			tile_bg[i].push(-1);
		}
	}
	this.tile_fg = tile_fg;
	this.tile_bg = tile_bg;
	this.object_array = object_arr;
	this.image_array = image_arr;
}
Level.prototype.alterLevel = function() {
	//Will build based on files
	//in additon to inserting the various objects

    var new_tiles = [];
    for(var i=0; i<80; i++) {
		new_tiles[i] = [];
		for(var j=0; j<60; j++) {
	 	   new_tiles[i][j] = this.tile_array[j][i];
		}
    }
    this.tile_array = new_tiles;
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
		this.tile.sliceX = (idx%9)*this.tile_size; // <- don't hardcoe
		this.tile.sliceY = Math.floor(idx/9)*this.tile_size;
		this.drawChildren(ctx);
		ctx.fillRect(i*this.tile_size, j*this.tile_size, this.tile_size, this.tile_size);
	    }
	    if(this.tile_array[i][j] > -1) {
		count++;
		var idx = this.tile_array[i][j];
		this.tile.x = Math.floor(i*this.tile_size - this.camera.x);
		this.tile.y = Math.floor(j*this.tile_size - this.camera.y);
		this.tile.sliceX = (idx%9)*this.tile_size; // <- don't hardcoe
		this.tile.sliceY = Math.floor(idx/9)*this.tile_size;
		this.drawChildren(ctx);
	    }
	    if(this.tile_fg[i][j] > -1) {
		var idx = this.tile_fg[i][j];
		this.tile.x = Math.floor(i*this.tile_size - this.camera.x);
		this.tile.y = Math.floor(j*this.tile_size - this.camera.y);
		this.tile.sliceX = (idx%9)*this.tile_size; // <- don't hardcoe
		this.tile.sliceY = Math.floor(idx/9)*this.tile_size;
		this.drawChildren(ctx);
	    }
	}
    }
}


Level.prototype.loadLevel = function (filename) {
    var level1 = new XMLHttpRequest();

    var curLevel = this;
    // calls editor's loadMap nested inside loadLevel for scope
    level1.onreadystatechange = function () {
	var contents = level1.responseText;
	console.log(contents);
	var line = contents.substr(0, contents.indexOf("\n"));
	var n = line.split(" ");
	var gridWidth = parseInt(n[0]);
	var gridHeight = parseInt(n[1]);
	curLevel.cols = gridWidth;
	curLevel.rows = gridWidth;
	curLevel.initArrays();
	//canvas.width = gridWidth * cellSize;
	//canvas.height = gridHeight * cellSize;
	
	line = contents.substring(contents.indexOf('b'), contents.indexOf('m'));
	n = line.split(" ");
	t = 1;
	for(j=0; j < gridHeight; j++){
	    for(i = 0; i < gridWidth; i++){
		if(t%(gridWidth + 1) == 0){
		    t++;
		}
		curLevel.tile_bg[i][j] = n[t++];
	    }
	}
	line = contents.substring(contents.indexOf('m'), contents.indexOf('f'));
	n = line.split(" ");
	t = 1;
	for(j=0; j < gridHeight; j++){
	    for(i = 0; i < gridWidth; i++){
		if(t%(gridWidth + 1) == 0){
		    t++;
		}
		curLevel.tile_array[i][j] = n[t++];
	    }
	}
	line = contents.substring(contents.indexOf('f'), contents.indexOf('e'));
	n = line.split(" ");
	t = 1;
	for(j=0; j < gridHeight; j++){
	    for(i = 0; i < gridWidth; i++){
		if(t%(gridWidth + 1) == 0){
		    t++;
		}
		curLevel.tile_fg[i][j] = n[t++];
	    }
	}
    } // loadMap/onreadystate end

    level1.open("GET", filename, true);
    level1.send();
}


