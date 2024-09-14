window.P5 = p5;

function getLoop(p5, phase, noiseMax, radiusLimits = { min: 100, max: 600 }) {
    const vertices = [];
    for (let angle = 0; angle < p5.PI * 2; angle += 0.01) {
        const xOffset = p5.map(p5.cos(angle + phase), -1, 1, 0, noiseMax);
        const yOffset = p5.map(p5.sin(angle + phase), -1, 1, 0, noiseMax);
        const radius = p5.map(p5.noise(xOffset, yOffset), 0, 1, radiusLimits.min, radiusLimits.max);
        const x = p5.cos(angle) * radius * (1 + phase);
        const y = p5.sin(angle) * radius * (1 + phase);
        vertices.push({ x, y })
    }
    return vertices;
}

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let noiseMax = 5;
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
        p5.translate(width / 2, height / 2)
        p5.stroke(0)
        p5.noFill();
        // const seed = p5.floor(p5.random(10));
        
        // p5.noiseSeed(seed)
        // const noiseMax = slider.value();
    
        let radiusMin = 50;
        let radiusMax = 150;
        let angle = 0
        const count = 200;
        Array(count).fill().forEach((element, index) => {
            p5.beginShape();
            const vertices = getLoop(p5, phase, noiseMax, { min: radiusMin, max: radiusMax });
            vertices.forEach(({ x, y }) => p5.vertex(x, y));
            p5.endShape(p5.CLOSE);
            /*const falloff = p5.map(index, 0, count - 1, 0, 2);
            if ((index + 1) % 20 === 0) {
                const octaves = Math.round(p5.map(index, 0, count - 1, 8, 1));
                p5.noiseDetail(octaves, falloff)
            }*/
            // if ((index + 1) % 20 === 0) {
            //     p5.noiseSeed(index)
            // }
            noiseMax -= 0.01
            radiusMin += 1;
            radiusMax += 1;
            angle += 0.1
            phase += 0.007
            p5.rotate(Math.sin(angle) / 200)
            // p5.translate(angle / 5, angle / 5)
            // phase += Math.sin(angle) > 0 ? 0.01 : -0.01
        })
        
        
        p5.noLoop();
        window.save = (name) => p5.save(name)
        // window.seed = seed;
    }
}, document.querySelector('main'));
