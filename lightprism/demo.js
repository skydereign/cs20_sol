function Game () {
    this.canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");

    this.canvas.addEventListener('click', function(e) { 
	var x = Math.floor(e.pageX);
	var y = Math.floor(e.pageY);
	for(var i=0; i<10; i++) {
	    for(var j=0; j<10; j++) {
		col_map[x+i][y+j]=1;
	    }
	}
	lm.draw();
    }, false);

    this.lightManager = new LightManager(canvas.width, canvas.height);

    this.lightManager.lightCtx = this.ctx;

    this.col_map = [];
    for(var x=0; x<canvas.width; x++) {
	this.col_map[x] = [];
	for(var y=0; y<canvas.height; y++) {
	    this.col_map[x][y] = 0;
	}
    }

    this.lightManager.col_map = this.col_map;
    this.lightManager.lights.push(new Light(80, 80, 0, 300, 60, 'rgba(255, 0, 0, 1)'));
    this.lightManager.lights.push(new Light(80, 200, 0, 300, 60, 'rgba(0, 0, 255, 1)'));
    this.main = function () {
	this.lightManager.draw();
    }
    var col_map = this.col_map;
    var lm = this.lightManager;
}

function start () {
    var game = new Game();
    game.main();
}
