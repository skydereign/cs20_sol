function Game () {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
		
    this.shadowCanvas = document.getElementById("shadowCanvas");
    this.shadowCtx = this.shadowCanvas.getContext("2d");

    var colCanvas = document.getElementById("colCanvas");
    this.colCtx = colCanvas.getContext("2d");


    var lastKey = 0; // used to determine what action
		var selectedLight;
		var keys = [];

    this.canvas.addEventListener('click', function(e) { 
				switch(lastKey) {
				case 0: // no key
						var x = (Math.floor((e.pageX-10)/20))*20;
						var y = (Math.floor((e.pageY-10)/20))*20;
						for(var i=0; i<20; i++) {
								for(var j=0; j<20; j++) {
										col_map[x+i][y+j]=1-col_map[x+i][y+j];
								}
						}
						
						var ctx = colCanvas.getContext("2d");
						if(col_map[x][y]===1) {
								ctx.fillStyle = 'rgba(255, 255, 255, 1)';
								ctx.fillRect(x, y, 20, 20);
						} else {
								ctx.clearRect(x, y, 20, 20);
						}
						break;
						
				case 49: // 1 - red
						selectedLight = new Light(e.pageX, e.pageY, 0, 200, 45, 'rgba(255, 0, 0, 1)');
						lm.lights.push(selectedLight);
						break;
						
				case 50: // 2 - green
						selectedLight = new Light(e.pageX, e.pageY, 0, 200, 45, 'rgba(0, 255, 0, 1)');
						lm.lights.push(selectedLight);
						break;
						
				case 51: // 3 - blue
						selectedLight = new Light(e.pageX, e.pageY, 0, 200, 45, 'rgba(0, 0, 255, 1)')
						lm.lights.push(selectedLight);
						break;
						
				case 52: // 4 - magenta
						selectedLight = new Light(e.pageX, e.pageY, 0, 200, 45, 'rgba(255, 0, 255, 1)')
						lm.lights.push(selectedLight);
						break;
						
				case 53: // 5 - yellow
						selectedLight = new Light(e.pageX, e.pageY, 0, 200, 45, 'rgba(255, 255, 0, 1)');
						lm.lights.push(selectedLight);
						break;
						
				case 54: // 6 - cyan
						selectedLight = new Light(e.pageX, e.pageY, 0, 200, 45, 'rgba(0, 255, 255, 1)');
						lm.lights.push(selectedLight);
						break;
						
				case 55: // 7 - white
						selectedLight = new Light(e.pageX, e.pageY, 0, 200, 45, 'rgba(255, 255, 255, 1)');
						lm.lights.push(selectedLight);
						break;
						
				case 88: // x - delete local lights
						for(var i=0; i<lm.lights.length; i++) {
								var light = lm.lights[i];
								if(Math.abs(light.x - e.pageX)<30 && Math.abs(light.y - e.pageY)<30) {
										lm.remove(i);
										i--; // removed a light, so adjust
								}
						}
						break;

				case 90: // z - select local light
						for(var i=0; i<lm.lights.length; i++) {
								var light = lm.lights[i];
								if(Math.abs(light.x - e.pageX)<30 && Math.abs(light.y - e.pageY)<30) {
										selectedLight = light;
										break;
								}
						}
						break;
				}
    }, false);
		
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
		
    this.lightManager.lightCtx = this.ctx;
    this.lightManager.shadowCtx = this.shadowCtx;

    this.col_map = [];
    for(var x=0; x<canvas.width; x++) {
				this.col_map[x] = [];
				for(var y=0; y<canvas.height; y++) {
						this.col_map[x][y] = 0;
				}
    }
		
    this.lightManager.col_map = this.col_map;

		update = function () {
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
								if(selectedLight.x>=lm.width) {
										selectedLight.x=lm.width-1;
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
								if(selectedLight.y>=lm.height) {
										selectedLight.y=lm.height-1;
								}
						}
				}

		}

    this.main = function () {
				update();
				lm.draw();
    }
    var col_map = this.col_map;
    var lm = this.lightManager;
}

var game;

function start () {
    game = new Game();
    setInterval(game.main, 1000/60);
}
