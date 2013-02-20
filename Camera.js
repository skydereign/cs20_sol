/* In this prototype, all objects are always being drawn
 * the camera merely holds x and y offsets for the update functions
 * of tile and player
 */

function Camera(level_width, level_height, camera_width, camera_height, initx, inity, cols, rows, tile_size) {
	this.level_width = level_width; //level length
	this.level_height = level_height;
	this.camera_width = camera_width; //same as canvas width
	this.camera_height = camera_height //same as canvas height
	this.xpos = initx; //upper left position of 
	this.ypos = inity;	
	this.cols = cols;
	this.rows = rows;
	this.tile_size = tile_size;
	this.camera_move_threshold_x = 9 * camera_width/20;
	this.camera_move_threshold_y = 9 * camera_height/20;
}

Camera.prototype.move = function(dx, dy) {
	this.xpos += dx;
	this.ypos += dy;
}

Camera.prototype.checkToMovex = function(x, x_velocity) {
	if(this.xpos + this.camera_width + x_velocity < this.level_width && this.xpos + x_velocity > 0) {
		if(x_velocity > 0) {
			if(x - this.camera_move_threshold_x > 0) {
				return true;
			}
		} else if (x_velocity < 0) {
			if(x < this.camera_width - this.camera_move_threshold_x) {
				return true;
			}
		}
	}
	return false;
}

Camera.prototype.checkToMovey = function(y, y_velocity) {
	if(this.ypos + this.camera_height + y_velocity < this.level_height && this.ypos + y_velocity > 0) {
		if(y_velocity > 0) {
			if(y - this.camera_move_threshold_y > 0) {
				return true;
			}
		} else if (y_velocity < 0) {
			if(y < this.camera_height - this.camera_move_threshold_y) {
				return true;
			}
		}
	}
	return false;
}

