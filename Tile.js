function Tile(level, x, y, tile_size) {
	Sprite.call(this);
	this.level = level;
	this.camera = level.camera;
	this.x_abs = x;
	this.y_abs = y;
	this.width = tile_size;
	this.height = tile_size;
	this.x = x;
	this.y = y;
}

Tile.prototype = new Sprite();

Tile.prototype.update = function(d) {
	this.x =  this.x_abs - this.camera.xpos;
	this.y =  this.y_abs - this.camera.ypos;
}
