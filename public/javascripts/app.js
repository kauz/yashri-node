require('./surveillance');
let Hls = require('hls.js');
let UI = require('./UI');
let Event = require('./Event');

let event = new Event();
let ui = new UI();


let App = (function (ui, event) {

    let loadEventListeners = function () {
        document.addEventListener('DOMContentLoaded', event.loadEvents);
    };

    // Check for hls and start video
    let initVideo = function (video, url) {
        if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = 'https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8';
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        }
    };

    function loop() {
        let canvas = document.getElementById('canvas-for-video');
        let video = document.getElementById('video-for-canvas');

        let ctx = canvas.getContext('2d');

        ctx.drawImage(video, 0, 0);

        requestAnimationFrame(loop);
    }


    return {
        init: function () {

            loadEventListeners();

            // If video container exists - init videos
            if (ui.selectors.videoContainer) {

                /*                initVideo(
                                    document.getElementById('video-1'),
                                    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8'
                                );
                                initVideo(
                                    document.getElementById('video-2'),
                                    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8'
                                );
                                initVideo(
                                    document.getElementById('video-3'),
                                    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8'
                                );
                                initVideo(
                                    document.getElementById('video-4'),
                                    'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
                                );*/

                //loop();

            }


        }
    }


})(ui, event);


App.init();