let UI = require('./UI');
let Video = require('./Video');
let ui = new UI();

if (document.querySelector(ui.selectors.videoContainer)) {

    let canvases = new Array(4);
    let videos = new Array(4);

    for (let i = 0; i < canvases.length; i++) {
        canvases[i] = document.getElementById(`canvas-${i}`);
    }
    for (let i = 0; i < videos.length; i++) {
        videos[i] = new Video(`/assets/${i}.mp4`);
    }

    videos.forEach((video, i) => {

        let videoContainer = {
            video: video.video,
            ready: false,
        };
        let canvas = canvases[i];
        let ctx = canvas.getContext('2d');

        video.onerror = function () {
            document.body.removeChild(canvas);
            document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
        };

        videoContainer.video.oncanplay = readyToPlayVideo;
        function readyToPlayVideo() {
            // find a scale to fit canvas size
            videoContainer.scale = Math.min(
                canvas.width / this.videoWidth,
                canvas.height / this.videoHeight);
            videoContainer.ready = true;
            // the video can be played so hand it off to the display function
            requestAnimationFrame(updateCanvas);
        }

        function updateCanvas() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // only draw if loaded and ready
            if (videoContainer !== undefined && videoContainer.ready) {
                // find the top left of the video on the canvas
                let scale = videoContainer.scale;
                let vidH = videoContainer.video.videoHeight;
                let vidW = videoContainer.video.videoWidth;
                let top = canvas.height / 2 - (vidH / 2) * scale;
                let left = canvas.width / 2 - (vidW / 2) * scale;
                // draw the video the correct size
                ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);
            }
            // request the next frame in 1/60th of a second
            requestAnimationFrame(updateCanvas);
        }

        function fullScreenVideo(e) {
            if (e.target.id === canvas.id) {
                if (videoContainer !== undefined && videoContainer.ready) {
                    let children = e.target.parentElement.children;
                    if (e.target.classList.contains('canvas_fullscreen')) {
                        for (let i = 0; i < children.length; i++) {
                            if(children[i].classList.contains('canvas_hidden'))
                                children[i].classList.remove('canvas_hidden');
                        }
                        toggleMute();
                        e.target.classList.remove('canvas_fullscreen');
                        e.target.style.filter = `brightness(1) contrast(1)`;
                        document.querySelector('.video__controls').classList.add('video__controls_hidden');
                    } else {
                        toggleMute();
                        for (let i = 0; i < children.length; i++) {
                            if(children[i].classList.contains('canvas'))
                                children[i].classList.add('canvas_hidden');
                        }
                        e.target.classList.remove('canvas_hidden');
                        e.target.classList.add('canvas_fullscreen');
                        document.querySelector('.video__controls').classList.remove('video__controls_hidden');
                    }
                }
            }
        }

        function filterCanvas(e) {
            let brightness = 1;
            let contrast = 1;
            let value = e.target.value;
            let canvas = document.querySelector('.canvas_fullscreen');
            if (!canvas.style.filter) {
                canvas.style.filter = `brightness(${brightness}) contrast(${contrast})`;
            }
            if (canvas) {
                if (e.target.classList.contains('video__input_brightness')) {
                    let reg = /contrast\([0-9]?\)/;
                    let filter = canvas.getAttribute('style');
                    let contrast = filter.match(reg)[0];
                    canvas.style.filter = `brightness(${value}) ${contrast}`;
                }
                else if (e.target.classList.contains('video__input_contrast')) {
                    let reg = /brightness\([0-9]?\)/;
                    let filter = canvas.getAttribute('style');
                    let brightness = filter.match(reg)[0];
                    canvas.style.filter = `${brightness} contrast(${value})`;
                }
            }
        }

        function toggleMute() {
                video.video.muted = !video.video.muted;
        }


        document.addEventListener('DOMContentLoaded', videoContainer.video.play());
        document.querySelector('.video__input_brightness').addEventListener('mouseup', filterCanvas);
        document.querySelector('.video__input_contrast').addEventListener('mouseup', filterCanvas);
        document.querySelector(ui.selectors.videoContainer).addEventListener('click', fullScreenVideo);

    });

}