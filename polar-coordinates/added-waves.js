window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    const pointRadius = 4;
    let phase = p5.PI / 2;

    const getNewWave = () => new Wave(p5, p5.random(10, 50), p5.random(width / 6, width / 2), p5.PI / p5.random(0.5, 4));
    const wave = getNewWave();
    for (const index of [...new Array(4)]) {
        wave.add(getNewWave())
    }

    p5.setup = () => {
        p5.createCanvas(width, height);
    }

    p5.draw = () => {
        p5.background(0);
        p5.translate(0, height / 2)
        p5.fill(255);
        p5.noStroke();
        wave.draw((x, y) => p5.circle(x, y, pointRadius * 2), width)
        phase += 0.02
    }
}, document.querySelector('main'));
