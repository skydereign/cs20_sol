function Game_Manager() {
	this.current_level = 0;
    this.level_array = new Array();
	this.camera;
    this.player;
    //this.screen_manager;
    this.loadLevels();
    this.initGameElements();
    world.addChild(this.level_array[this.current_level]);
    world.addChild(this.player);
    world.addChild(this.level_array[0].lightManager);
    world.init = function() {}
	world.update = function(d) {
		this.updateChildren(d);
	}
}


Game_Manager.prototype.loadLevels = function() {
	var cols = 40;
    var rows = 30;
    var tile_size = 30;
    var x_player_start = 200;
    var y_player_start = 0;
    var x_camera_start = 0;
    var y_camera_start = 300;
	var first_level = new Level(cols, rows, tile_size, x_camera_start, y_camera_start, x_player_start, y_player_start);
	this.level_array.push(first_level);
}

Game_Manager.prototype.initGameElements = function() {
	var first_level = this.level_array[this.current_level];
    this.camera = new Camera(canvas_width, canvas_height);
    //initializing Player here is placeholder. The entire object array for the level will eventually get initalized here.
    this.player = new Player();
    this.camera.changeLevel(first_level);
    first_level.giveCamera(this.camera);
    this.player.changeLevel(first_level);
}

Game_Manager.prototype.nextLevel = function() {
	if(this.current_level+1 != level_array.length) {
		var level = level_array[this.currentLevel+1];
	}
	this.camera.changeLevel();
	level.giveCamera(this.camera);
	this.player.changeLevel();
	current_level++;
}


