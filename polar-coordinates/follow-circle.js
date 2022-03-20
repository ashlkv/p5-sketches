window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    const radius = 100;
    let angle = 0;

    p5.setup = () => {
        p5.createCanvas(width, height);
    }

    p5.draw = () => {
        p5.background(0);
        p5.translate(width / 2, height / 2)
        p5.stroke(255);
        p5.strokeWeight(2);
        p5.noFill();
        p5.circle(0, 0, radius * 2)
        p5.noStroke();
        p5.fill(255);
        p5.ellipse(p5.cos(angle) * radius, p5.sin(angle) * radius, 10, 10);
        angle += 0.01;
    }
}, document.querySelector('main'));
