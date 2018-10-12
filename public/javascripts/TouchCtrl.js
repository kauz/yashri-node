module.exports = (function() {

    let evCache = [];
    let evCachePDown = [];
    let prevDiff = -1;
    let isRotation = false;

    let angle = 0;
    let tx = 0;
    let scale = 1;

    let pointerdown_handler = function (ev) {
        // console.log('down', ev)
        // The pointerdown event signals the start of a touch interaction.
        // This event is cached to support 2-finger gestures
        evCache.push(ev);
        evCachePDown.push(ev);

        isRotation = false;

        ev.preventDefault();
    };

    let pointermove_handler = function (ev) {
        // console.log('move', ev);
        // console.log(evCachePDown[0]);
        let diffScale = 0;
        let diffAngle = 0;

        // Find this event in the cache and update its record with this event
        for (var i = 0; i < evCache.length; i++) {
            if (ev.pointerId === evCache[i].pointerId) {
                if (evCache.length >= 2) {
                    let prevI = i === 0 ? 1 : 0;
                    let prevDistance = Math.abs(evCache[0].clientX - evCache[1].clientX);
                    let nextDistance = Math.abs(evCache[prevI].clientX - ev.clientX);

                    let prevAngle = calcEventAngle(evCache[prevI], evCache[i]);
                    let nextAngle = calcEventAngle(evCache[prevI], ev);
                    diffScale = nextDistance - prevDistance;
                    diffAngle = nextAngle - prevAngle;


                    let firstAngle = calcEventAngle(evCachePDown[prevI], evCachePDown[i]);
                    let deltaFromFirstAngle = Math.abs(nextAngle - firstAngle);
                    if (deltaFromFirstAngle > 30) {
                        isRotation = true;
                    }
                }
                evCache[i] = ev;
                break;
            }
        }

        if (evCache.length === 1) {
            tx += ev.movementX;
            ev.target.style.backgroundPositionX = `${tx}px`;
        } else if (evCache.length === 2) {
            // console.log(diffScale);

            console.log(isRotation);
            if (isRotation) {
                angle += diffAngle;
                angle = Math.min(Math.max(-90, angle), 90);
                ev.target.style.filter = `brightness(${(angle + 90) / 180})`;
                document.getElementById('brightness').innerText = ((angle + 90) / 180 * 100).toFixed() + '%';

            } else {
                scale += diffScale * 0.01;
                ev.target.style.transform = `scale(${scale})`;
            }
        }

        document.getElementById('percentage').innerText = (scale * 100).toFixed() + '%';
        // console.log(angle);
        // console.log(`angle: ${angle}`);
        ev.preventDefault();
    };


    let pointerup_handler = function(ev) {
        remove_event(ev);


        // If the number of pointers down is less than two then reset diff tracker
        if (evCache.length < 2) prevDiff = -1;
        ev.preventDefault();
    };


    function remove_event(ev) {
        // Remove this event from the target's cache
        for (var i = 0; i < evCache.length; i++) {
            if (evCache[i].pointerId === ev.pointerId) {
                evCache.splice(i, 1);
                evCachePDown.splice(i, 1);
                break;
            }
        }
    }

    function calcEventDistace(ev, ev2) {
        let dx = (ev.clientX - ev2.clientX);
        let dy = (ev.clientY - ev2.clientY);
        return Math.sqrt(dx * dx + dy * dy);
    }

    function calcEventAngle(ev, ev2) {
        return Math.acos((ev2.clientX - ev.clientX) / (calcEventDistace(ev, ev2))) / Math.PI * 180;
    }

    // Public methods
    return {

        myFunc: function (ev) {
            if (ev.target.classList.contains('cam__img') && ev.pointerType === 'touch') {

                console.log(ev.pointerType + " " + ev.type + " on a "+ ev.target.nodeName);
            }
            ev.preventDefault();
        },

        init: function() {

            //if (ev.target.classList.contains('cam__img') && ev.pointerType === 'touch') {
                let el = document.querySelector('.cam__img');
                // Install event handlers for the pointer target
                el.onpointerdown = pointerdown_handler;
                el.onpointermove = pointermove_handler;

                // Use same handler for pointer{up,cancel,out,leave} events since
                // the semantics for these events - in this app - are the same.
                el.onpointerup = pointerup_handler;
                el.onpointercancel = pointerup_handler;
                el.onpointerout = pointerup_handler;
                el.onpointerleave = pointerup_handler;
            //}

        }
    }
})();