module.exports = class Video {
    constructor(src, id) {
        this.video = document.createElement('video');
        this.video.src = src;
        this.video.id = id;
        this.video.muted = true;
        this.video.autoplay = true;
        this.video.loop = true;
        this.video.controls = true;
    }
};