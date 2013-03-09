/* Used primarily for the x and y cooridiantes, which are offsets from the level itself
 */

function Camera(camera_width, camera_height) {
	this.x;
	this.y;
	this.level_width;
	this.level_height;
	this.camera_width = camera_width; //same as canvas width
	this.camera_height = camera_height; //same as canvas height
	this.camera_move_threshold_x_right = 10 * camera_width/20;
	this.camera_move_threshold_x_left = 10 * camera_width/20;
	this.camera_move_threshold_y_up = 7 * camera_height/20;
	this.camera_move_threshold_y_down = 12 * camera_height/20;
}

Camera.prototype.changeLevel = function(level) {
	this.level_width = level.cols*level.tile_size;
	this.level_height = level.rows*level.tile_size;
	this.x = level.x_start_camera;
	this.y = level.y_start_camera;
}

Camera.prototype.move = function(dx, dy) {
	if(this.x + dx + this.camera_width > this.level_width) {
		this.x = this.level_width - this.camera_width;
	} else {
		this.x += dx;
	}
	if(this.y + dy + this.camera_height > this.level_height) {
		this.y = this.level_height - this.camera_height;
	} else {
		this.y += dy;
	}
}

Camera.prototype.checkToMovex = function(x, x_velocity) {
	if(this.x + this.camera_width + x_velocity < this.level_width && this.x + x_velocity > 0) {
		if(x_velocity > 0) {
			if(x - this.camera_move_threshold_x_right > 0) {
				return true;
			}
		} else if (x_velocity < 0) {
			if(x < this.camera_width - this.camera_move_threshold_x_left) {
				return true;
			}
		}
	}
	return false;
}

Camera.prototype.checkToMovey = function(y, y_velocity) {
	if(this.y + this.camera_height + y_velocity < this.level_height && this.y + y_velocity > 0) {
		if(y_velocity > 0) {
			if(y - this.camera_move_threshold_y_down > 0) {
				return true;
			}
		} else if (y_velocity < 0) {
			if(y < this.camera_height - this.camera_move_threshold_y_up) {
				return true;
			}
		}
	}
	return false;
}

