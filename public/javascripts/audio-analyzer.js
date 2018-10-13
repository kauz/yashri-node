module.exports = (function () {

    return {
        analyze: function () {
            let AdioContext = w.AudioContext || w.webkitAudioContext;

                this.context = new AudioContext();
                this.node = this.context.createScriptProcessor(2048, 1, 1);
                this.anayzer = this.context.createAnalyser();
                this.anayzer.smoothingTimeConstant = 0.3;
                this.anayzer.fftSize = 512;

                this.bands = new Uint8Array(this.anayzer.frequencyBinCount);
        }
    }



})();