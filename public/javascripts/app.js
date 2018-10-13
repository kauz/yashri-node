let UI = require('./UI');
let touch = require('./TouchCtrl');
let cctv = require('./cctv');

let ui = new UI();


let App = (function (ui, TouchCtrl) {

    let loadEventListeners = function () {
        // document.addEventListener('DOMContentLoaded', event.loadEvents);
    };

    return {
        init: function () {
            let touchImg = document.querySelector('.event__img');
            loadEventListeners();
            if (touchImg) {
                TouchCtrl.init(touchImg);
            }

            // If video container exists - init videos
            if (document.querySelector(ui.selectors.videoContainer)) {
                cctv.init();
            }


        }
    }


})(ui, touch);


App.init();