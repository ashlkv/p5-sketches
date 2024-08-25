window.P5 = p5;

function getLoop(p5, phase, noiseMax) {
    const vertices = [];
    for (let angle = 0; angle < p5.PI * 2; angle += 0.01) {
        const xOffset = p5.map(p5.cos(angle + phase), -1, 1, 0, noiseMax);
        const yOffset = p5.map(p5.sin(angle + phase), -1, 1, 0, noiseMax);
        const radius = p5.map(p5.noise(xOffset, yOffset), 0, 1, 100, 600);
        const x = p5.cos(angle) * radius * (1 + phase);
        const y = p5.sin(angle) * radius * (1 + phase);
        vertices.push({ x, y })
    }
    return vertices;
}

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let noiseMax = 3;
    let noiseStep = 0.03;
    let phase = 0;
    let phaseStep = 0.007;
    let slider;

    p5.setup = () => {
        p5.createCanvas(width, height, p5.SVG);
        p5.frameRate(5);
        // slider = p5.createSlider(0, 10, 5, 0.1)
    }

    p5.draw = () => {
        p5.background(255);
        p5.translate(width / 2, height * -0.4)
        p5.stroke(0)
        p5.noFill();
        // const seed = p5.floor(p5.random(10));
        
        // p5.noiseSeed(seed)
        // const noiseMax = slider.value();
        
        Array(400).fill().forEach((element, index) => {
            p5.beginShape();
            const vertices = getLoop(p5, phase, noiseMax);
            vertices.forEach(({ x, y }) => p5.vertex(x, y));
            p5.endShape(p5.CLOSE);
            phase += phaseStep
            if (index % Math.round(p5.random(5)) === 0) {
                noiseMax += noiseStep
            }
        })
        
        
        p5.noLoop();
        window.save = (name) => p5.save(name)
        // window.seed = seed;
    }
}, document.querySelector('main'));
