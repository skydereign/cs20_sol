// TODO: clean up use of global variables
use2D = true;
var colGrid = [];
var map_width = 100;
var map_height = 30;

var size = 20;				
var lastKey = 0; // used to determine what action
var selectedLight;
var keys = [];
var lm;

var canvas = {width:640, height:480};

function Game () {
		Sprite.call(this);
		// uses colGrid instead of colCanvas
		for(var i=0; i<map_height; i++) {
				colGrid[i] = [];
				for(var j=0; j<map_width; j++) {
						colGrid[i][j]=0;
				}
		}

    document.addEventListener('keydown', function(e) {
				lastKey = e.keyCode;
				keys[e.keyCode] = true;
    }, true);
		
    document.addEventListener('keyup', function(e) {
				if(lastKey == e.keyCode) {
						lastKey = 0;
				}
				keys[e.keyCode] = false;
    }, true);
		
    this.lightManager = new LightManager(canvas.width, canvas.height);
		
    this.lightManager.col_map = colGrid;
    lm = this.lightManager;
}
Game.prototype = new Sprite();

Game.prototype.update = function (d) {
		if(keys[74]) { // j - move screen left
				lm.x-=2;
				if(lm.x<0) {
						lm.x = 0;
				}
		}
		if(keys[76]) { // l - move screen right
				lm.x+=2;
				if(lm.x>=map_width*size-lm.width) {
						lm.x = map_width*size-lm.width-1;
				}
		}
		if(keys[73]) { // i - move screen up
				lm.y-=2;
				if(lm.y<0) {
						lm.y = 0;
				}
		}
		if(keys[75]) { // l - move screen down
				lm.y+=2;
				if(lm.y>=map_height*size-lm.height) {
						lm.y = map_height*size-lm.height-1;
				}
		}

		if(selectedLight) {
				if(keys[37]) { // left - rotate
						selectedLight.angle+=2;
				}
				if(keys[39]) { // right - rotate
						selectedLight.angle-=2;
				}
				if(keys[38]) { // up - radius
						selectedLight.radius+=2;
				}
				if(keys[40]) { // down - radius
						selectedLight.radius-=2;
						if(selectedLight.radius<5) {
								selectedLight.radius=5;
						}
				}
				if(keys[188]) { // comma - spread
						selectedLight.spread+=2;
						if(selectedLight.spread>360) {
								selectedLight.spread = 360;
						}
				}
				if(keys[190]) { // period - spread
						selectedLight.spread-=2;
						if(selectedLight.spread<1) {
								selectedLight.spread = 1;
						}
				}
				if(keys[65]) { // a - left
						selectedLight.x-=2;
						if(selectedLight.x<0) {
								selectedLight.x=0;
						}
				}
				if(keys[68]) { // d - right
						selectedLight.x+=2;
						if(selectedLight.x>=map_width*size) {
								selectedLight.x=map_width*size-1;
						}
				}
				if(keys[87]) { // w - up
						selectedLight.y-=2;
						if(selectedLight.y<0) {
								selectedLight.y=0;
						}
				}
				if(keys[83]) { // s - down
						selectedLight.y+=2;
						if(selectedLight.y>=map_height*size) {
								selectedLight.y=map_height*size-1;
						}
				}
		}
		this.updateChildren(d);
}

Game.prototype.draw = function (ctx) {
		ctx.clearRect(0, 0, lm.width, lm.height);
		ctx.fillStyle = "rgba(0, 0, 0, 1.0)";
		ctx.fillRect(0, 0, lm.width, lm.height);

		for(var i = 0; i<map_height; i++) {
				for(var j=0; j<map_width; j++) {
						var x = j*20;
						var y = i*20;
						if(colGrid[i][j]===1) {
								ctx.fillStyle = 'rgba(255, 255, 255, 1.0)';
								ctx.fillRect(x-lm.x, y-lm.y, 20, 20);
						}
				}
		}
		this.drawChildren(ctx);
}

gInput.addLBtnFunc(function() { 
		switch(lastKey) {
		case 0: // no key
				var x = Math.floor((gInput.mouse.x-10+lm.x)/20);
				var y = Math.floor((gInput.mouse.y-10+lm.y)/20);
				colGrid[y][x] = 1-colGrid[y][x]; // used for drawing
				break;
				
		case 49: // 1 - red
				selectedLight = new Light(gInput.mouse.x+lm.x, gInput.mouse.y+lm.y, 0, 200, 45, 'rgba(255, 0, 0, 1)');
				lm.lights.push(selectedLight);
				break;
				
		case 50: // 2 - green
				selectedLight = new Light(gInput.mouse.x+lm.x, gInput.mouse.y+lm.y, 0, 200, 45, 'rgba(0, 255, 0, 1)');
				lm.lights.push(selectedLight);
				break;
				
		case 51: // 3 - blue
				selectedLight = new Light(gInput.mouse.x+lm.x, gInput.mouse.y+lm.y, 0, 200, 45, 'rgba(0, 0, 255, 1)')
				lm.lights.push(selectedLight);
				break;
				
		case 52: // 4 - magenta
				selectedLight = new Light(gInput.mouse.x+lm.x, gInput.mouse.y+lm.y, 0, 200, 45, 'rgba(255, 0, 255, 1)')
				lm.lights.push(selectedLight);
				break;
				
		case 53: // 5 - yellow
				selectedLight = new Light(gInput.mouse.x+lm.x, gInput.mouse.y+lm.y, 0, 200, 45, 'rgba(255, 255, 0, 1)');
				lm.lights.push(selectedLight);
				break;
				
		case 54: // 6 - cyan
				selectedLight = new Light(gInput.mouse.x+lm.x, gInput.mouse.y+lm.y, 0, 200, 45, 'rgba(0, 255, 255, 1)');
				lm.lights.push(selectedLight);
				break;
				
		case 55: // 7 - white
				selectedLight = new Light(gInput.mouse.x+lm.x, gInput.mouse.y+lm.y, 0, 200, 45, 'rgba(255, 255, 255, 1)');
				lm.lights.push(selectedLight);
				break;
				
		case 88: // x - delete local lights
				for(var i=0; i<lm.lights.length; i++) {
						var light = lm.lights[i];
						if(Math.abs(light.x-gInput.mouse.x-lm.x)<30 && Math.abs(light.y-gInput.mouse.y-lm.y)<30) {
								lm.remove(i);
								i--; // removed a light, so adjust
						}
				}
				break;

		case 90: // z - select local light
				for(var i=0; i<lm.lights.length; i++) {
						var light = lm.lights[i];
						if(Math.abs(light.x-gInput.mouse.x-lm.x)<30 && Math.abs(light.y-gInput.mouse.y-lm.y)<30) {
								selectedLight = light;
								break;
						}
				}
				break;
		}
});





var game;

function start () {
		initGame("canvas");
    game = new Game();
		world.addChild(game);
		game.addChild(game.lightManager);
}
