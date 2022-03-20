window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    let radius = 100;

    p5.setup = () => {
        p5.createCanvas(width, height);
        console.log('Move mouse horizontally from left to right to increase the vertices in the circle')
    }

    p5.draw = () => {
        p5.background(0);
        p5.translate(width / 2, height / 2)
        p5.stroke(255)
        p5.noFill();
        p5.beginShape();
        const increment = p5.map(p5.mouseX, 0, width, p5.PI, 0.01)
        for (let angle = 0; angle < p5.PI * 2; angle += increment) {
            p5.vertex(p5.cos(angle) * radius, p5.sin(angle) * radius);
        }
        p5.endShape(p5.CLOSE);
    }
}, document.querySelector('main'));
