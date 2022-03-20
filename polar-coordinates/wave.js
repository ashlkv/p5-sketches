/**
 * @param p5
 * @param amplitude The amplitude in pixels
 * @param wavelength The length of the wave in pixels
 * @param phase
 * @constructor
 */
function Wave(p5, amplitude, wavelength, phase = 0) {
    this.amplitude = amplitude;
    this.wavelength = wavelength;
    this.startingPhase = phase;
    this.index = 0;

    this.getY = (x, phase = 0) => {
        return p5.sin(this.startingPhase + phase + p5.PI * 2 * x / this.wavelength) * this.amplitude;
    }

    this.scroll = (renderPoint = (x, y) => {}, density, phase) => {
        this.points = [...new Array(density)].map((angle, index) => ({x: index, y: this.getY(index, phase)}));
        this.points.forEach(({x, y}) => renderPoint(x, y))
    }

    this.trace = (renderPoint = (x, y) => {}, width, density = 100) => {
        this.points = [...new Array(density)].map((element, index) => {
            const x = p5.map(index, 0, density - 1, 0, width - 1);
            return {x, y: this.getY(x)}
        });
        const {x, y} = this.points[this.index];
        renderPoint(x, y);
        this.index = this.index < this.points.length - 1 ? this.index + 1 : 0;
    }

    this.oscillate = (renderPoint = (x, y) => {}, width, density = 100, phase = 0) => {
        const waveCount = width / this.wavelength;
        this.angles = [...new Array(density)].map((angle, index) => p5.map(index, 0, density - 1, 0, p5.PI * 2 * waveCount) + phase);
        this.angles.forEach((angle, index) => {
            const y = p5.map(p5.sin(angle), -1, 1, -this.amplitude, this.amplitude)
            const x = p5.map(index, 0, this.angles.length - 1, 0, this.wavelength * waveCount)
            renderPoint(x, y);
        })
    }
}
