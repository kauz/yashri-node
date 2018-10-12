module.exports = class Video {
    constructor(src) {
        this.video = document.createElement('video');
        this.video.src = src;
        this.video.muted = true;
        this.video.autoplay = true;
        this.video.loop = true;
        this.video.controls = true;
    }
};