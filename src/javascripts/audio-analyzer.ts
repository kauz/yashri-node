export interface SourceNodes {
    'video-0': object;
}

module.exports = (function () {

    return {

        MediaElementAudioSourceNodes: {
            'video-0': {},
            'video-1': {},
            'video-2': {},
            'video-3': {}
        },

        analyze: function (video: HTMLVideoElement): object {

            let AudioContext = window.AudioContext || window.webkitAudioContext;
            let self = this,
                context: AudioContext,
                analyzer: AnalyserNode,
                node: ScriptProcessorNode,
                bands: Uint8Array,
                source: MediaElementAudioSourceNode;

            if (self.MediaElementAudioSourceNodes[video.id].context) {
                context = self.MediaElementAudioSourceNodes[video.id].context;
                analyzer = self.MediaElementAudioSourceNodes[video.id].analyzer;
                source = self.MediaElementAudioSourceNodes[video.id].source;
                node = self.MediaElementAudioSourceNodes[video.id].node;

                source.connect(analyzer);
                source.connect(context.destination)
            } else {
                // Create audio context
                context = new AudioContext();
                self.MediaElementAudioSourceNodes[video.id].context = context;
                node = context.createScriptProcessor(2048, 1, 1);
                self.MediaElementAudioSourceNodes[video.id].node = node;
                // Create audio analyzer
                analyzer = context.createAnalyser();
                // Frequency of analyzer's requiring data
                analyzer.smoothingTimeConstant = 0.3;
                // Amount of output data
                analyzer.fftSize = 512;
                self.MediaElementAudioSourceNodes[video.id].analyzer = analyzer;

                // Connect video with audioContext
                source = context.createMediaElementSource(video);
                self.MediaElementAudioSourceNodes[video.id].source = source;
                // Connect source with analyzer
                source.connect(analyzer);
                // Connect analyzer with data interface
                analyzer.connect(node);
                // Connect everything with output
                node.connect(context.destination);
                source.connect(context.destination);
            }

            bands = new Uint8Array(analyzer.frequencyBinCount);
            self.MediaElementAudioSourceNodes[video.id].bands = bands;

            // Listen to input data change
            node.onaudioprocess = function (): Uint8Array | number {
                analyzer.getByteFrequencyData(bands);
                let returnValue = 0;
                if (!video.paused) {
                    if (typeof self.update === 'function') {
                        returnValue = self.update(bands);
                    }
                }
                return returnValue
            };

            console.log(this);
            return this;
        },


        visualize: function (video: HTMLVideoElement): void {

            let nodes = this.MediaElementAudioSourceNodes;

            this.analyze(video);

            let canvas = <HTMLCanvasElement> document.querySelector('.video__analyzer');
            let ctx = canvas.getContext('2d');
            let {width: WIDTH, height: HEIGHT} = canvas;
            let analyzer: AnalyserNode = nodes[video.id].analyzer;
            let bufferLengthAlt: number = nodes[video.id].analyzer.frequencyBinCount;
            let bands: Uint8Array = nodes[video.id].bands;

            if (ctx) {
                ctx.clearRect(0, 0, WIDTH, HEIGHT);
                drawBars();
            }

            function drawBars() {
                requestAnimationFrame(drawBars);

                analyzer.getByteFrequencyData(bands);
                if (ctx) {
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(0, 0, WIDTH, HEIGHT);

                    let barHeight: number,
                        barWidth: number = (WIDTH / bufferLengthAlt) * 4,
                        x: number = 0;

                    for (let i = 0; i < bufferLengthAlt; i++) {
                        barHeight = bands[i];

                        ctx.fillStyle = `rgb(${barHeight},${barWidth},${barWidth})`;
                        ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                        x += barWidth + 2;
                    }
                }

            }

        }


    }


})();
