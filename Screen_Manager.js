function Screen_Manager() {
	Sprite.call(this);
	this.screens = new List();
	this.main_menu;
	this.game_screen;
	this.pause_menu;
	this.buildMainMenu();
	this.buildGameScreen();
	this.buildPauseMenu();
	this.push(this.main_menu);
        this.push(this.game_screen);

}


Screen_Manager.prototype = new Sprite();

Screen_Manager.prototype.push = function(screen) {
    this.screens.remove(screen);
    this.screens.push(screen);
}

Screen_Manager.prototype.pop = function() {
    this.screens.tail.item.gui.visible = false;
    return this.screens.pop();
}

Screen_Manager.prototype.remove = function(screen) {
	screen.gui.visible = false;
    this.screens.remove(screen);
}

Screen_Manager.prototype.buildMainMenu = function() {
	this.main_menu = new Screen(false, false);
	//this.image = Textures.load("Some main screen image");
	this.main_menu.width = canvas_width;
	this.main_menu.height = canvas_height;
	this.main_menu.gui.x = canvas_width/2;
	this.main_menu.gui.y = canvas_height/2;
	
	var new_game = new TextButton("New Game");
    new_game.center = true;
    new_game.label.dropShadow = true;
    new_game.label.fontSize = 30;
    new_game.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.main_menu.gui.addChild(new_game);
 
    var that = this;
        
    new_game.func = function() {
    }
}

Screen_Manager.prototype.buildGameScreen = function() {
	this.game_screen = new Screen(false, true);
	this.game_screen.width = canvas_width;
	this.game_screen.height = canvas_height;
}

Screen_Manager.prototype.updateGameScreen = function(player) {
	//this.game_screen.stage.removeChildren(this.game_screen.stage);
	this.game_screen.addChild(player.level);
	this.game_screen.addChild(player);
	this.game_screen.addChild(player.level.lightManager);
}

Screen_Manager.prototype.buildPauseMenu = function() {
	this.pause_menu = new Screen(false, false);
	this.pause_menu.width = canvas_width;
	this.pause_menu.height = canvas_height;
	this.pause_menu.gui.x = canvas_width/2;
	this.pause_menu.gui.y = canvas_height/2;
	
	var resume_game = new TextButton("Resume Game");
    resume_game.center = true;
    resume_game.label.dropShadow = true;
    resume_game.label.fontSize = 30;
    resume_game.setLabelColors("#aaaaaa", "#ffffff", "#ff0000");
    this.pause_menu.gui.addChild(resume_game);
    
    var that = this;
    
    resume_game.func = function() {
        that.remove(that.pause_menu);   
    }
}

Screen_Manager.prototype.nextLevel = function(player) {
	var next_game_screen = new Screen(false, true);
	next_game_screen.width = canvas_width;
	next_game_screen.height = canvas_height;
	this.remove(this.game_screen);
	this.game_screen = next_game_screen;
	this.updateGameScreen(player);
	this.push(this.game_screen);
}

Screen_Manager.prototype.update = function(d) {
    for (var node = this.screens.head; node != null; node = node.link) {        
        if(node != this.screens.tail) {
            node.item.gui.visible = false;
        } else {
            node.item.gui.visible = true;
        }
        if(node.item.always_update || node == this.screens.tail) {
            node.item.update(d);
        }
    }
}

Screen_Manager.prototype.draw = function(ctx) {
    for (var node = this.screens.head; node != null; node = node.link) {
        var screen = node.item;
        if (screen.always_draw || node == this.screens.tail) {
            screen.draw(ctx);
        }
    }
}

