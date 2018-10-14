let Hls = require('hls.js');
let audioAnalyzer = require('./audio-analyzer');

module.exports = (function () {

// Check for hls and start video
    function initVideo(video, url) {
        if (Hls.isSupported()) {
            let hls = new Hls();
            hls.loadSource(url);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                video.play();
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = url;
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        }
    }

    function fullScreenVideo(e) {
            let children = e.target.parentElement.children;
            if (e.target.classList.contains('video_fullscreen')) {
                for (let i = 0; i < children.length; i++) {
                    if (children[i].classList.contains('video_hidden'))
                        children[i].classList.remove('video_hidden');
                }
                toggleMute(e.target);
                e.target.classList.remove('video_fullscreen');
                e.target.style.filter = `brightness(1) contrast(1)`;
                document.querySelector('.video__controls').classList.add('video__controls_hidden');
            } else {
                toggleMute(e.target);
                audioAnalyzer.visualize(e.target);
                for (let i = 0; i < children.length; i++) {
                    if (children[i].classList.contains('video'))
                        children[i].classList.add('video_hidden');
                }
                e.target.classList.remove('video_hidden');
                e.target.classList.add('video_fullscreen');
                document.querySelector('.video__controls').classList.remove('video__controls_hidden');
            }
    }

    function exitFullScreenVideo() {
        let fscv = document.querySelector('.video_fullscreen');
        if (fscv) {
            let children = fscv.parentElement.children;
            for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains('video_hidden'))
                    children[i].classList.remove('video_hidden');
            }
            fscv.classList.remove('video_fullscreen');
            toggleMute(fscv);
            document.querySelector('.video__controls').classList.add('video__controls_hidden');
        }
    }

    function addFilter(e) {
        let brightness = 1;
        let contrast = 1;
        let value = e.target.value;
        let video = document.querySelector('.video_fullscreen');
        if (!video.style.filter) {
            video.style.filter = `brightness(${brightness}) contrast(${contrast})`;
        }
        if (video) {
            if (e.target.classList.contains('video__input_brightness')) {
                let reg = /contrast\([0-9]?\)/;
                let filter = video.getAttribute('style');
                let contrast = filter.match(reg)[0];
                video.style.filter = `brightness(${value}) ${contrast}`;
            }
            else if (e.target.classList.contains('video__input_contrast')) {
                let reg = /brightness\([0-9]?\)/;
                let filter = video.getAttribute('style');
                let brightness = filter.match(reg)[0];
                video.style.filter = `${brightness} contrast(${value})`;
            }
        }
    }

    function toggleMute(video) {
        video.muted = !video.muted;
    }


    return {
        init: function () {

            let sources = ['http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
                'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
                'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
                'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'];

            let videos = document.querySelectorAll('video');
            videos.forEach((video, i) => {
                initVideo(document.getElementById(`video-${i}`), sources[i]);
                video.addEventListener('click', (e) => {
                    fullScreenVideo(e);
                });
            });


            document.querySelector('.video__input_brightness').addEventListener('input', addFilter);
            document.querySelector('.video__input_contrast').addEventListener('input', addFilter);
            document.querySelector('.video__button_efs').addEventListener('click', exitFullScreenVideo);
        }
    };

})();
