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

// To handle errors. This is not part of the example at the moment. Just fixing for Edge that did not like the ogv format video
        video.onerror = function (e) {
            //document.body.removeChild(canvas);
            document.body.innerHTML += "<h2>There is a problem loading the video</h2><br>";
        };

        videoContainer.video.oncanplay = readyToPlayVideo; // set the event to the play function that
// can be found below
        function readyToPlayVideo(e) { // this is a referance to the video
            // the video may not match the canvas size so find a scale to fit
            videoContainer.scale = Math.min(
                canvas.width / this.videoWidth,
                canvas.height / this.videoHeight);
            videoContainer.ready = true;
            // the video can be played so hand it off to the display function
            requestAnimationFrame(updateCanvas);
            // playPauseClick(e);
            // document.querySelector(".mute").textContent = "Mute";
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
                // now just draw the video the correct size
                ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);
/*                if (videoContainer.video.paused) { // if not playing show the paused screen
                    drawPlayIcon();
                }*/
            }
            // all done for display
            // request the next frame in 1/60th of a second
            requestAnimationFrame(updateCanvas);
        }

/*        function drawPlayIcon() {
            ctx.fillStyle = "black";  // darken display
            ctx.globalAlpha = 0.5;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#fff"; // colour of play icon
            ctx.globalAlpha = 0.75; // partly transparent
            ctx.beginPath(); // create the path for the icon
            let size = (canvas.height / 2) * 0.5;  // the size of the icon
            ctx.moveTo(canvas.width / 2 + size / 2, canvas.height / 2); // start at the pointy end
            ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 + size);
            ctx.lineTo(canvas.width / 2 - size / 2, canvas.height / 2 - size);
            ctx.closePath();
            ctx.fill();
            ctx.globalAlpha = 1; // restore alpha
        }*/

/*        function playPauseClick(e) {
            if (e.target.id === canvas.id || e.type === "DOMContentLoaded") {
                if (videoContainer !== undefined && videoContainer.ready) {
                    if (videoContainer.video.paused) {
                        videoContainer.video.play();
                    } else {
                        videoContainer.video.pause();
                    }
                }
            }
        }*/

        function fullScreenVideo(e) {
            if (e.target.id === canvas.id) {
                if (videoContainer !== undefined && videoContainer.ready) {
                    if (canvas.requestFullscreen) {
                        canvas.requestFullscreen();
                    } else if (canvas.mozRequestFullScreen) {
                        canvas.mozRequestFullScreen();
                    } else if (canvas.webkitRequestFullscreen) {
                        canvas.webkitRequestFullscreen();
                    }
                }
            }
        }

        function videoMute() {
            video.video.muted = !video.video.muted;
            if (video.video.muted) {
                document.querySelector(".mute").textContent = "Mute";
            } else {
                document.querySelector(".mute").textContent = "Sound on";
            }
        }

// register the event
        document.addEventListener('DOMContentLoaded', videoContainer.video.play());
        // document.querySelector(ui.selectors.videoContainer).addEventListener('click', playPauseClick);
        document.querySelector(ui.selectors.videoContainer).addEventListener('click', fullScreenVideo);
        //document.querySelector(".mute").addEventListener("click",videoMute);

    });

}