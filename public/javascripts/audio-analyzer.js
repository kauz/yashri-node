module.exports = (function () {

    return {
        analyze: function (video) {

            if (!window.AudioContext || window.webkitAudioContext) {
                let AudioContext = window.AudioContext || window.webkitAudioContext;
            }
            let self = this;

            this.video = video;
            // Create audio context
            this.context = new AudioContext();
            this.node = this.context.createScriptProcessor(2048, 1, 1);

            // Create audio analyzer
            this.anayzer = this.context.createAnalyser();
            // Frequency of analyzer's requiring data
            this.anayzer.smoothingTimeConstant = 0.3;
            // Amount of output data
            this.anayzer.fftSize = 512;

            this.bands = new Uint8Array(this.anayzer.frequencyBinCount);

            // Connect video with audioContext
            self.source = self.context.createMediaElementSource(self.video);
            // Connect source with analyzer
            self.source.connect(self.anayzer);
            // Connect analyzer with data interface
            self.anayzer.connect(self.node);
            // Connect everything with output
            self.node.connect(self.context.destination);
            self.source.connect(self.context.destination);
            // Listen to input data change
            self.node.onaudioprocess = function () {
                self.anayzer.getByteFrequencyData(self.bands);
                if (!self.video.paused) {
                    if (typeof self.update === 'function') {
                        return self.update(self.bands);
                    } else {
                        return 0;
                    }
                }
            };

            console.log(this);
            return this;
        }
    }


})();