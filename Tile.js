function Tile(level, x, y, tile_size) {
	Sprite.call(this);
	this.level = level;
	this.camera = level.camera;
	this.absx = x;
	this.absy = y;
	this.width = tile_size;
	this.height = tile_size;
	this.x = x;
	this.y = y;
}

Tile.prototype = new Sprite();

Tile.prototype.update = function(d) {
	this.x =  this.absx - this.camera.xpos;
	this.y =  this.absy - this.camera.ypos;
}
