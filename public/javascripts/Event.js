module.exports = class Event {

    loadEvents() {
        let xhr = new XMLHttpRequest();

        xhr.open('GET', `/api/events`, true);

        xhr.onload = function() {

            let output = '';


            if (this.status === 200) {
                let response = JSON.parse(this.responseText);

                response.events.forEach(function(event) {
                    output += `<div class="event event_type_${event.type} event_size_${event.size}">

                                    <i class="event__hide"></i>

                                    <div class="event__heading">
                                        <i class="event__icon icon__${event.icon}"></i>
                                        <p class="event__title">${event.title}</p>
                                    </div>
                                    
                                    <div class="event__status">
                                        <div class="event__source">${event.source}</div>
                                        <div class="event__time">${event.time}</div>
                                    </div>
                                   
                                        ${event.description !== null ? '<div class="event__body">' + event.description + '</div>': ``}
                                    
                                    
                                    ${event.data !== undefined ? `<div class="event__data">` : ``}
                                        
                                        ${event.data !== undefined && event.data.image !== undefined ? `<img 
                                            srcset="/images/${event.data.image} 408w, /images/${event.data.image.replace(/\.jpg$/, '@2x.jpg')} 1664w, /images/${event.data.image.replace(/\\.jpg$/, '@3x.jpg')} 2496w"
                                            sizes="(max-width: 768px) 408px,
                                                   (max-width: 2560px) 1664px,
                                                    2496px"
                                            class="data__img event__img" src="/images/${event.data.image}" 
                                            alt="${event.title}">` : ``}
                                        
                                        ${event.icon === 'cam' ? `<div class="data__items data__items_cam"><p class="data__item">Приближение: <span class="data__digit">78%</span></p> <p class="data__item">Яркость: <span class="data__digit">50%</span></p></div>` : ``}
                                        ${event.data !== undefined && event.data.type === 'graph' ? `<img class="data__img event__img" src="/images/graph.svg" alt="${event.title}">` : ``}
                                        ${event.data !== undefined && event.data.albumcover !== undefined ? `<div class="music data__music">
                                            <img class="data__img music__albumcover" src="${event.data.albumcover}" alt="albumcover">
                                            
                                                    <div class="music__track track">
                                                        <div class="track__description">${event.data.artist} - ${event.data.track.name}</div>
                                                        <div class="track__body">
                                                            <input class="track__input" type="range" min="0" max="24000" step="1" value="0">
                                                            <div class="track__length">${event.data.track.length}</div>
                                                        </div>
                                                    </div>
                                                    
                                                    <div class="music__nav m-nav">
                                                        <button class="m-nav__prev"></button>
                                                        <button class="m-nav__next"></button>
                                                        <div class="m-nav__volume">
                                                            <input class="m-nav__volume-input" type="range" min="0" max="100" step="1" value="${event.data.volume}">
                                                            <div class="m-nav__value">${event.data.volume}%</div>
                                                        </div>
                                                    </div>
                                            </div>
                                        ` : ``}
                                        ${event.data !== undefined && event.data.humidity !== undefined ? `<div class="data__items"><p class="data__item">Температура: <span class="data__digit">${event.data.temperature}&#8451;</span></p> <p class="data__item">Влажность: <span class="data__digit">${event.data.humidity}%</span></p></div>` : ``}
                                        ${event.data !== undefined && event.data.buttons !== undefined ? `<div class="data__buttons"><button class="data__button button button_primary">${event.data.buttons[0]}</button> <button class="data__button button">${event.data.buttons[1]}</button></div>` : ``}
                                    
                                    ${event.data !== undefined ? `</div>` : ``}
                
                                                    <i class="event__go"></i>
                                                    
                                               </div>`;
                });

            }

            else {
                output += '<li>Something went wrong</li>'
            }

            let container = document.querySelector('.events');
            if (container) {
                container.innerHTML = output;
            }

        };

        xhr.send();
    }
}