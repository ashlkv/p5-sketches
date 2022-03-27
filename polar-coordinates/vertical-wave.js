window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    const pointRadius = 4;
    let phase = p5.PI / 2;

    const getNewWave = () => {
        const amplitude = p5.random(10, 50);
        const wavelength = p5.random(width / 2, width);
        const phase = p5.PI * 2 / p5.random(0, 1);
        return new Wave(p5, amplitude, wavelength, phase, {vertical: true, reversed: true, expanding: 0.003})
    };
    const wave = getNewWave();

    p5.setup = () => {
        p5.createCanvas(width, height);
    }

    p5.draw = () => {
        p5.background(0);
        p5.translate(width / 2, height)
        p5.fill(255);
        p5.noStroke();
        wave.draw((x, y) => p5.circle(x, y, pointRadius * 2), width, 100)
        phase += 0.02
    }
}, document.querySelector('main'));
