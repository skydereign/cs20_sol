function Game_Manager() {
	this.current_level = 0;
    this.level_array = new Array();
	this.camera;
    this.player;
    //this.screen_manager;
    //this.main_menu;
    //this.game_screen;
    //this.pause_menu;
    this.initGameElements();
    world.addChild(this.screen_manager);
    //world.addChild(this.level_array[this.current_level]);
    //world.addChild(this.player);
    //world.addChild(this.level_array[0].lightManager);
    world.init = function() {}
	world.update = function(d) {
		this.updateChildren(d);
	}
}

Game_Manager.prototype.initGameElements = function() {
	var cols = 80;
    var rows = 60;
    var tile_size = 40;
    var x_player_start = 300;
    var y_player_start = 250;
    var x_camera_start = 1700;
    var y_camera_start = 600;
	var first_level = new Level(cols, rows, tile_size, x_camera_start, y_camera_start, x_player_start, y_player_start);
	this.level_array.push(first_level);
    this.camera = new Camera(canvas_width, canvas_height);
    //initializing Player here is placeholder. The entire object array for the level will eventually get initalized here.
    this.player = new Player();
    this.camera.changeLevel(first_level);
    first_level.giveCamera(this.camera);
    this.player.changeLevel(first_level);
    
    this.screen_manager = new Screen_Manager();
    this.screen_manager.updateGameScreen(this.player);
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

gInput.addFunc(27, function(){
	that = game_manager.screen_manager;
	console.log("foo");
    if(that.screens.find(that.game_screen)) {
        that.push(that.pause_menu);   
    } else if(that.screens.find(that.pause_menu)) {
        that.remove(that.pause_menu);   
    }
});


