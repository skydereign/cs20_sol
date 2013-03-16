function Game_Manager() {
    this.tile_size = 40;
    this.x_player_start = 120;
    this.y_player_start = 450;
    this.x_camera_start = 0;
    this.y_camera_start = 1700;
	this.current_level = 0;
	this.screen_manager;
	this.level_array;
	this.level;
	this.camera;
    this.player;
    this.initGameElements();
    world.addChild(this.screen_manager);
    var game_manager = this;
    world.init = function() {}
	world.update = function(d) {
		this.updateChildren(d);
	}
}

Game_Manager.prototype.initGameElements = function() {
	var that = this;
	var request = new XMLHttpRequest();
	request.open("GET", "levels.json", false);
	request.overrideMimeType("text/json");
	request.onreadystatechange = function () {
		// http://127.0.0.1:8020/Light/levels.json for web hosting. Chrome hates that it is referenced as a local file.
    	var done = 4;
   		if (request.readyState == done) {
   			that.level_array = JSON.parse(request.responseText);
    	}
	};
	
	request.send(null);
	this.level = new Level(this.tile_size, this.level_array.levels[this.current_level]);
    this.camera = new Camera(canvas_width, canvas_height);
    this.player = new Player();
    
    this.camera.changeLevel(this.level);
    this.level.giveCamera(this.camera);
    this.player.changeLevel(this.level);
    
    this.screen_manager = new Screen_Manager();
    this.screen_manager.updateGameScreen(this.player);
}

Game_Manager.prototype.nextLevel = function() {
	this.current_level++;
	this.level = new Level(this.tile_size, this.level_array.levels[this.current_level]);
	this.camera.changeLevel(this.level);
	this.level.giveCamera(this.camera);
	this.player.changeLevel(this.level);
	this.screen_manager.nextLevel(this.player);
}

gInput.addFunc(27, function(){
	that = game_manager.screen_manager;
    if(that.screens.find(that.game_screen)) {
        that.push(that.pause_menu);   
    } else if(that.screens.find(that.pause_menu)) {
        that.remove(that.pause_menu);   
    }
});


