module.exports = function format(ms){
    function pad(ms){
        return (ms < 10 ? '0' : '') + ms;
    }
    let hours = Math.floor(ms / (60*60));
    let minutes = Math.floor(ms % (60*60) / 60);
    let seconds = Math.floor(ms % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
};