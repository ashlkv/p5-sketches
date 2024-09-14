window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    let phase = 0;
    let slider;

    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.frameRate(25);
        slider = p5.createSlider(0, 10, 5, 0.1)
    }

    p5.draw = () => {
        p5.background(255);
        p5.translate(width / 2, height / 2)
        p5.stroke(0)
        p5.fill(0);
        p5.beginShape();
        // p5.noiseSeed(p5.frameCount)
        const noiseMax = slider.value();
        for (let angle = 0; angle < p5.PI * 2; angle += 0.03) {
            const xOffset = p5.map(p5.cos(angle + phase), -1, 1, 0, noiseMax);
            const yOffset = p5.map(p5.sin(angle + phase), -1, 1, 0, noiseMax);
            const radius = p5.map(p5.noise(xOffset, yOffset), 0, 1, 100, 200);
            const x = p5.cos(angle) * radius;
            const y = p5.sin(angle) * radius;
            p5.vertex(x, y);
        }
        p5.endShape(p5.CLOSE);
        phase += 0.01
    }
}, document.querySelector('main'));
