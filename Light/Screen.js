function Screen(always_update, always_draw) {
	Sprite.call(this);
	this.always_update = always_update;
	this.always_draw = always_draw;
	this.stage = new Sprite();
	this.gui = new GUI(gInput);
	this.addChild(this.stage);
	this.addChild(this.gui);
}

Screen.prototype = new Sprite();
