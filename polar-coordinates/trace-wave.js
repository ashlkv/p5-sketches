window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    const pointRadius = 4;
    const wave = new Wave(p5, 200, width / 2);

    p5.setup = () => {
        p5.createCanvas(width, height);
    }

    p5.draw = () => {
        p5.background(0);
        p5.translate(0, height / 2)
        p5.fill(255);
        p5.noStroke();
        wave.trace((x, y) => p5.circle(x, y, pointRadius * 2), width, 500)
    }
}, document.querySelector('main'));
