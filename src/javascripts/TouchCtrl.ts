module.exports = (function (): object {

    let evCache: PointerEvent[] = [];
    let evCachePDown: PointerEvent[] = [];
    let prevDiff: number = -1;
    let isRotation: boolean = false;

    let angle: number = 0;
    let tx: number = 0;
    let scale: number = 1;

    let pointerdownHandler: (ev: PointerEvent) => void = function (ev) {
        // console.log('down', ev)
        // The pointerdown event signals the start of a touch interaction.
        // This event is cached to support 2-finger gestures
        evCache.push(ev);
        evCachePDown.push(ev);

        isRotation = false;

        ev.preventDefault();
    };


    let pointermoveHandler: (ev: PointerEvent) => void = function (ev) {
        // console.log('move', ev);
        // console.log(evCachePDown[0]);
        let diffScale = 0;
        let diffAngle = 0;
        let locEl = ev.target as HTMLElement;

        // Find this event in the cache and update its record with this event
        for (let i = 0; i < evCache.length; i++) {
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
            locEl.style.transform = `translate(${tx}px)`;
        } else if (evCache.length === 2) {
            // console.log(diffScale);

            console.log(isRotation);
            if (isRotation) {
                angle += diffAngle;
                angle = Math.min(Math.max(-90, angle), 90);
                locEl.style.filter = `brightness(${(angle + 90) / 180})`;
                let brightness = document.getElementById('brightness');
                if (brightness) {
                    brightness.innerText = ((angle + 90) / 180 * 100).toFixed() + '%';
                }

            } else {
                scale += diffScale * 0.01;
                locEl.style.transform = `scale(${scale})`;
                let zoom = document.getElementById('zoom');
                if (zoom) {
                    zoom.innerText = (scale * 100).toFixed() + '%';
                }
            }
        }

        // console.log(angle);
        // console.log(`angle: ${angle}`);
        ev.preventDefault();
    };


    let pointerupHandler = function (ev: PointerEvent) {
        removeEvent(ev);


        // If the number of pointers down is less than two then reset diff tracker
        if (evCache.length < 2) prevDiff = -1;
        ev.preventDefault();
    };


    function removeEvent(ev: PointerEvent) {
        // Remove this event from the target's cache
        for (let i = 0; i < evCache.length; i++) {
            if (evCache[i].pointerId === ev.pointerId) {
                evCache.splice(i, 1);
                evCachePDown.splice(i, 1);
                break;
            }
        }
    }

    function calcEventDistace(ev: PointerEvent, ev2: PointerEvent) {
        let dx = (ev.clientX - ev2.clientX);
        let dy = (ev.clientY - ev2.clientY);
        return Math.sqrt(dx * dx + dy * dy);
    }

    function calcEventAngle(ev: PointerEvent, ev2: PointerEvent) {
        return Math.acos((ev2.clientX - ev.clientX) / (calcEventDistace(ev, ev2))) / Math.PI * 180;
    }

    // Public methods
    return {

        init: function (el: HTMLElement): void {

            el.classList.add('touch__img');

            //if (ev.target.classList.contains('cam__img') && ev.pointerType === 'touch') {
            // Install event handlers for the pointer target
            el.onpointerdown = pointerdownHandler;
            el.onpointermove = pointermoveHandler;

            // Use same handler for pointer{up,cancel,out,leave} events since
            // the semantics for these events - in this app - are the same.
            el.onpointerup = pointerupHandler;
            el.onpointercancel = pointerupHandler;
            el.onpointerout = pointerupHandler;
            el.onpointerleave = pointerupHandler;
            //}

        }
    }
})();