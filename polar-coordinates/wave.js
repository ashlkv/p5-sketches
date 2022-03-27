/**
 * @param p5
 * @param amplitude The amplitude in pixels
 * @param wavelength The length of the wave in pixels
 * @param phase
 * @param options
 * @constructor
 */
function Wave(p5, amplitude, wavelength, phase = 0, options = { vertical: false, reversed: false, expanding: 0, shrinking: 0 }) {
    this.amplitude = amplitude;
    this.wavelength = wavelength;
    this.startingPhase = phase;
    this.index = 0;
    this.addedWaves = [];
    this.vertical = Boolean(options.vertical);
    this.reversed = Boolean(options.reversed);
    this.expanding = options.expanding || 0;
    this.shrinking = options.shrinking || 0;

    this.getY = (x, phase = 0) => {
        const expandRatio = this.expanding ? x * this.expanding + 1 : 1;
        const shrinkRatio = this.shrinking ? x * this.shrinking + 1 : 1;
        let y = p5.sin(this.startingPhase + phase + p5.TWO_PI * x / this.wavelength) * this.amplitude * expandRatio / shrinkRatio;
        for (const wave of this.addedWaves) {
            y += wave.getY(x, phase);
        }
        return y;
    }

    this.scroll = (renderPoint = (x, y) => {}, density, phase) => {
        this.points = [...new Array(density)].map((angle, index) => ({x: index, y: this.getY(index, phase)}));
        this.points.forEach(({x, y}) => this.renderPoint(renderPoint, x, y))
    }

    this.trace = (renderPoint = (x, y) => {}, width, density = 100, onEnd = () => {}) => {
        this.points = [...new Array(density)].map((element, index) => {
            const x = p5.map(index, 0, density - 1, 0, width - 1);
            return {x, y: this.getY(x)}
        });
        const {x, y} = this.points[this.index];
        this.renderPoint(renderPoint, x, y);
        if (this.index < this.points.length - 1) {
            this.index ++;
        } else {
            onEnd();
            this.index = 0;
        }
    }

    // FIXME Replace oscillate with draw in a loop
    this.oscillate = (renderPoint = (x, y) => {}, width, density = 100, phase = 0) => {
        const waveCount = width / this.wavelength;
        this.angles = [...new Array(density)].map((angle, index) => p5.map(index, 0, density - 1, 0, p5.TWO_PI * waveCount) + phase);
        this.angles.forEach((angle, index) => {
            const y = p5.map(p5.sin(angle), -1, 1, -this.amplitude, this.amplitude)
            const x = p5.map(index, 0, this.angles.length - 1, 0, this.wavelength * waveCount)
            this.renderPoint(renderPoint, x, y);
        })
    }

    this.add = (wave) => {
        this.addedWaves.push(wave);
    }

    this.draw = (renderPoint = (x, y) => {}, width, density = 100) => {
        const increment = width / density;
        for (let x = 0; x < width; x += increment) {
            const y = this.getY(x);
            this.renderPoint(renderPoint, x, y);
        }
    }

    this.renderPoint = (renderPoint, x, y) => {
        const first = this.vertical ? y : this.reversed ? -x : x;
        const second = this.vertical ? this.reversed ? -x : x : y;
        renderPoint(first, second)
    }
}
