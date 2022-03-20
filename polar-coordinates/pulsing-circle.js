window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    let angle = 0;
    const frameRate = 60;

    p5.setup = () => {
        p5.createCanvas(width, height);
    }

    p5.draw = () => {
        p5.background(0);
        p5.translate(width / 2, height / 2)
        p5.fill(255);
        p5.noStroke();
        const radius = p5.map(p5.sin(angle), -1, 1, 0, 100)
        p5.circle(0, 0, radius * 2);
        angle += p5.PI * 2 / frameRate;
    }
}, document.querySelector('main'));
