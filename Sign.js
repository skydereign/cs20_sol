function Sign (text, x, y, camera) {
    Sprite.call(this);
    this.text = text;
    this.camera = camera;
    this.font = "\'Press Start 2P\'";
    this.x_level = x;
    this.y_level = y;
    this.x = this.x_level - camera.x;
    this.y = this.y_level - camera.y;
    this.fontSize = 8;
    this.drawBG = true;
    this.bgColor = "rgba(127, 188, 127, 1.0)"
    this.border = 3;
    this.padLeft = 4;
    this.padRight = 4;
    this.padTop = 8;
    this.padBottom = 8;

}
Sign.prototype = new TextBox("Hello!");

Sign.prototype.update = function (d) {
    this.x = this.x_level - this.camera.x;
    this.y = this.y_level - this.camera.y;
}


function SignInfo (x, y, text) {
    this.x = parseInt(x); // <- uses tile position
    this.y = parseInt(y);
    this.text = text;
    this.sprite = undefined;
}
