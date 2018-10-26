module.exports = function format(ms: number): string{
    function pad(ms: number){
        return (ms < 10 ? '0' : '') + ms;
    }
    let hours: number = Math.floor(ms / (60*60));
    let minutes: number = Math.floor(ms % (60*60) / 60);
    let seconds: number = Math.floor(ms % 60);

    return pad(hours) + ':' + pad(minutes) + ':' + pad(seconds);
};