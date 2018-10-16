let UI = require('./UI');
let touch = require('./TouchCtrl');
let cctv = require('./cctv');

let ui = new UI();


let App = (function (ui, TouchCtrl, cctvCtrl) {

    let loadEventListeners = function () {
        // document.addEventListener('DOMContentLoaded', event.loadEvents);
    };

    return {
        init: function () {
            let touchImg = document.querySelector('.data__img');
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