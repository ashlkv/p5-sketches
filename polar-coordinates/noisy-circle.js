window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    let radius = 100;

    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.frameRate(5);
    }

    p5.draw = () => {
        p5.background(0);
        p5.translate(width / 2, height / 2)
        p5.stroke(255)
        p5.noFill();
        p5.beginShape();
        for (let angle = 0; angle < p5.PI * 2; angle += 0.1) {
            const randomRadium = radius + p5.random(-10, 10);
            p5.vertex(p5.cos(angle) * randomRadium, p5.sin(angle) * randomRadium);
        }
        p5.endShape(p5.CLOSE);
    }
}, document.querySelector('main'));
