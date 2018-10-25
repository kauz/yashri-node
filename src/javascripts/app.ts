let UI = require('./UI');
let touch = require('./TouchCtrl');
let cctv = require('./cctv');

let ui = new UI();

let App = (function (ui, TouchCtrl, cctvCtrl) {

    let loadEventListeners = function (): void {
        // document.addEventListener('DOMContentLoaded', event.loadEvents);
    };

    return {
        init: function (): void {

            let touchImg: HTMLElement = document.querySelector(ui.selectors.dataImg);
            loadEventListeners();

            if (touchImg) {
                TouchCtrl.init(touchImg);
            }

            // If video container exists - init videos
            if (document.querySelector(ui.selectors.videoContainer)) {
                cctvCtrl.init();
            }


        }
    }


})(ui, touch, cctv);


App.init();