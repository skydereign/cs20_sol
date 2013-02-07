function Game () {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.shadowCanvas = document.getElementById("shadowCanvas");
    this.shadowCtx = this.shadowCanvas.getContext("2d");

    var colCanvas = document.getElementById("colCanvas");
    this.colCtx = colCanvas.getContext("2d");

    this.canvas.addEventListener('click', function(e) { 
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
	
	lm.draw();
    }, false);

    
    document.addEventListener('keydown', function(e) {
	switch(e.keyCode) {
	case 49: // 1
	    //lm.lights[0].angle = e.pageX;
	    break;

	case 50: // 2
	    break;

	default:
	    console.log("keycode {x}", e.keyCode, e.keyCode);
	    break;
	}
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
    this.lightManager.lights.push(new Light(80, 80, 300, 500, 60, 'rgba(255, 0, 0, 1)'));
    this.lightManager.lights.push(new Light(80, 200, 0, 300, 60, 'rgba(0, 0, 255, 1)'));
    this.main = function () {
	this.lightManager.draw();
    }
    var col_map = this.col_map;
    var lm = this.lightManager;
}

var game;

function start () {
    game = new Game();
    game.main();
}
