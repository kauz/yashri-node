let UI = require('./UI');
let touch = require('./TouchCtrl');
let cctv = require('./cctv');
import Store from 'dumb-flux/lib/Store';
import Dispatcher from 'dumb-flux/lib/Dispatcher';

let ui = new UI();


let App = (function (ui, TouchCtrl, cctvCtrl) {

    let emitter = document;
    let listener = document;
    let store = new Store([listener]);
    let dispatcher = new Dispatcher(store);

    let loadEventListeners = function () {
        // document.addEventListener('DOMContentLoaded', event.loadEvents);
        emitter.addEventListener('click', listenForClick);
        listener.addEventListener('switch-page', reRender);
    };

    function listenForClick(e) {
        if (e.target.classList.contains('nav__link')) {
            dispatcher.dispatch('switch-page', {name: e.target.textContent});
        }
    }

    function reRender(e) {
        e.preventDefault();
        switch (e.detail.name) {
            case "Сводка":
                document.location.href = '/';
                break;
            case "Видеонаблюдение":
                document.location.href = '/cctv';
                break;
            default: break;
        }
    }

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
