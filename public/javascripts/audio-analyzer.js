module.exports = (function () {

    return {

        MediaElementAudioSourceNodes: {
            'video-0': {},
            'video-1': {},
            'video-2': {},
            'video-3': {},
        },

        analyze: function (video) {

            let AudioContext = window.AudioContext || window.webkitAudioContext;
            let self = this,
                context,
                analyzer,
                node,
                bands,
                source;

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
            node.onaudioprocess = function () {
                analyzer.getByteFrequencyData(bands);
                if (!video.paused) {
                    if (typeof self.update === 'function') {
                        return self.update(bands);
                    } else {
                        return 0;
                    }
                }
            };

            console.log(this);
            return this;
        },


        visualize: function (video) {

            let nodes = this.MediaElementAudioSourceNodes;

            this.analyze(video);

            let canvas = document.querySelector('.video__analyzer'),
                ctx = canvas.getContext('2d'),
                analyzer = nodes[video.id].analyzer,
                bufferLengthAlt = nodes[video.id].analyzer.frequencyBinCount,
                bands = nodes[video.id].bands;

            let {width: WIDTH, height: HEIGHT} = canvas;


            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            function drawBars() {
                requestAnimationFrame(drawBars);

                analyzer.getByteFrequencyData(bands);

                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(0, 0, WIDTH, HEIGHT);

                let barHeight,
                    barWidth = (WIDTH / bufferLengthAlt) * 4,
                    x = 0;

                for (let i = 0; i < bufferLengthAlt; i++) {
                    barHeight = bands[i];

                    ctx.fillStyle = `rgb(${barHeight},${barWidth},${barWidth})`;
                    ctx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight / 2);

                    x += barWidth + 2;
                }
            }

            drawBars();
        }


    }


})();
