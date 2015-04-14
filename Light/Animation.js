function Animation (image, width, height, count, fps) {
    this.image = Textures.load(image);
    this.frameWidth = width;
    this.frameHeight = height;
    this.frameCount = count;
    this.frameRate = fps;
}
