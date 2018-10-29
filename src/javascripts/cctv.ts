// let Hls = require('hls.js');
let audioAnalyzer = require('./audio-analyzer');
import Hls from 'hls.js';

type HTMLElementEvent<T extends HTMLElement> = Event & {
    target: T;
}

module.exports = (function (): object {

// Check for hls and start video
    function initVideo(video: HTMLVideoElement, url: string): void {
        if (url.indexOf('assets')) {
            video.src = url;
            video.addEventListener('loadedmetadata', function () {
                video.play();
            });
        } else {
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
    }

    function fullScreenVideo(e: HTMLElementEvent<HTMLVideoElement>): void {
        let container: HTMLElement | null = document.querySelector('.container_video');
        // @ts-ignore
        let children: HTMLCollection = container.children;
        let videoControls: HTMLElement | null = document.querySelector('.video__controls');

        if (e.target.classList.contains('video_fullscreen')) {
            for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains('container_video__item_hidden'))
                    children[i].classList.remove('container_video__item_hidden');
            }
            toggleMute(e.target);
            e.target.classList.remove('video_fullscreen');
                if (e.target.parentElement) {
                    e.target.parentElement.classList.remove('container_video__item_fullscreen');
                }
            e.target.style.filter = `brightness(1) contrast(1)`;
                if (videoControls)
                    videoControls.classList.add('video__controls_hidden');
        } else {
            toggleMute(e.target);
            audioAnalyzer.visualize(e.target);
            for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains('container_video__item'))
                    children[i].classList.add('container_video__item_hidden');
            }
            if (e.target.parentElement) {
                e.target.parentElement.classList.remove('container_video__item_hidden');
                e.target.parentElement.classList.add('container_video__item_fullscreen');
            }
            e.target.classList.add('video_fullscreen');
            if (videoControls)
                videoControls.classList.remove('video__controls_hidden');
        }
    }

    function exitFullScreenVideo(): void {
        let fscv: HTMLVideoElement | null = document.querySelector('.video_fullscreen');
        // @ts-ignore
        let children: HTMLCollection = document.querySelector('.container_video').children;
        let videoControls: HTMLElement | null = document.querySelector('.video__controls');

        if (fscv) {
            for (let i = 0; i < children.length; i++) {
                if (children[i].classList.contains('container_video__item_hidden'))
                    children[i].classList.remove('container_video__item_hidden');
            }
            fscv.classList.remove('video_fullscreen');
            if (fscv.parentElement)
                fscv.parentElement.classList.remove('container_video__item_fullscreen');
            toggleMute(fscv);
            if (videoControls)
                videoControls.classList.add('video__controls_hidden');
        }
    }

    function addFilter(e: HTMLElementEvent<HTMLInputElement>): void {
        let brightness: number = 1;
        let contrast: number = 1;
        let value: string = e.target.value;
        let video: HTMLVideoElement | null = document.querySelector('.video_fullscreen');
        if (video && !video.style.filter) {
            video.style.filter = `brightness(${brightness}) contrast(${contrast})`;
        }
        if (video) {
            if (e.target.classList.contains('video__input_brightness')) {
                let reg = /contrast\([0-9]?\)/;
                // @ts-ignore
                let filter: string = video.getAttribute('style');
                // @ts-ignore
                let contrast: string = filter.match(reg)[0];
                video.style.filter = `brightness(${value}) ${contrast}`;
            }
            else if (e.target.classList.contains('video__input_contrast')) {
                let reg = /brightness\([0-9]?\)/;
                // @ts-ignore
                let filter: string = video.getAttribute('style');
                // @ts-ignore
                let brightness: string = filter.match(reg)[0];
                video.style.filter = `${brightness} contrast(${value})`;
            }
        }
    }

    function toggleMute(video: HTMLVideoElement): void {
        video.muted = !video.muted;
    }


    return {
        init: function (): void {

            /*            let sources: string[] = ['http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
                            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
                            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
                            'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'];*/

            let sources: string[] = ['/assets/0.mp4',
                '/assets/1.mp4',
                '/assets/2.mp4',
                '/assets/3.mp4'];

            let videos: NodeList = document.querySelectorAll('video');
            videos.forEach((video: Node, i: number) => {
                initVideo(<HTMLVideoElement> document.getElementById(`video-${i}`), sources[i]);
                // @ts-ignore
                video.addEventListener('click', (e: HTMLElementEvent<HTMLVideoElement>) => {
                    fullScreenVideo(e);
                });
            });

            let brightness: HTMLInputElement | null = document.querySelector('.video__input_brightness');
            let contrast: HTMLInputElement | null = document.querySelector('.video__input_contrast');
            let efs: HTMLButtonElement | null = document.querySelector('.video__button_efs');

            if (brightness && contrast && efs) {
                // @ts-ignore
                brightness.addEventListener('input', addFilter);
                // @ts-ignore
                contrast.addEventListener('input', addFilter);
                efs.addEventListener('click', exitFullScreenVideo);
            }

        }
    };

})();
