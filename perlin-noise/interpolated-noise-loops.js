window.P5 = p5;

function getLoop(p5, phase, noiseMax, radiusLimits = { min: 100, max: 600 }) {
    const vertices = [];
    for (let angle = 0; angle < p5.PI * 2; angle += 0.05) {
        const xOffset = p5.map(p5.cos(angle + phase), -1, 1, 0, noiseMax);
        const yOffset = p5.map(p5.sin(angle + phase), -1, 1, 0, noiseMax);
        const radius = p5.map(p5.noise(xOffset, yOffset), 0, 1, radiusLimits.min, radiusLimits.max);
        const x = p5.cos(angle) * radius * (1 + phase);
        const y = p5.sin(angle) * radius * (1 + phase);
        vertices.push({ x, y })
    }
    return vertices;
}

function getLoopGradient(p5, first = [], second = [], count = 10) {
    const loops = [];
    for (let loopIndex = 0; loopIndex < count; loopIndex++) {
        const loop = []
        for (let vertexIndex = 0; vertexIndex < first.length; vertexIndex ++) {
            const from = first[vertexIndex]
            const to = second[vertexIndex];
            const vertex = {
                x: p5.map(loopIndex, 0, count - 1, from.x, to.x),
                y: p5.map(loopIndex, 0, count - 1, from.y, to.y)
            }
            loop.push(vertex)
        }
        loops.push(loop)
    }
    return loops;
}

function getFibonacciGenerator() {
    let fibonacciIndex = 2;
    const fibonacciNumbers = [0, 1];
    return () => {
        const next = fibonacciNumbers[fibonacciIndex - 2] + fibonacciNumbers[fibonacciIndex - 1];
        fibonacciNumbers[fibonacciIndex] = next;
        fibonacciIndex ++;
        return next
    }
}

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;

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
    
        let phase = 0;
        let noiseMax = 3;
        let radiusMin = 25;
        let radiusMax = 150;
        let angle = 0
        const count = 200;
        const loops = [];
        const seed = Date.now();
        const fibonacciGenerator = getFibonacciGenerator();
        // let threshold = fibonacciGenerator();
        // let threshold = 5;
        let threshold = 1;
        Array(200).fill().forEach((element, index) => {
            const falloff = p5.map(index, 0, count - 1, 0, 1.5);
            if ((index + 1) % threshold === 0) {
                // threshold = fibonacciGenerator();
                threshold = Math.round(threshold * 1.3);
                loops.push(getLoop(p5, phase, noiseMax, { min: radiusMin, max: radiusMax }))
                // const octaves = Math.round(p5.map(index, 0, count - 1, 8, 1));
                const octaves = Math.round(p5.map(index, 0, count - 1, 8, 1));
                p5.noiseDetail(octaves, falloff)
            }
            // p5.noiseSeed(seed + index)
            noiseMax -= 0.01
            radiusMin += 1;
            radiusMax += 1;
            phase += 0.007
            // p5.translate(angle / 5, angle / 5)
            // phase += Math.sin(angle) > 0 ? 0.01 : -0.01
        })
    
        for (let index = 0; index < loops.length; index++) {
            const loop = loops[index];
            const nextLoop = loops[index + 1];
            if (!nextLoop) {
                break;
            }
            const gradient = getLoopGradient(p5, loop, nextLoop, 5);
            for (const loop of gradient) {
                p5.beginShape();
                loop.forEach(({ x, y }) => p5.vertex(x, y));
                p5.endShape(p5.CLOSE);
                angle += 0.1
                p5.rotate(Math.sin(angle) / 500)
                // p5.translate(angle / 200)
                // angle += -0.007
                // p5.rotate(angle)
            }
        }
        
        
        
        
        p5.noLoop();
        window.save = (name) => p5.save(name)
        // window.seed = seed;
    }
}, document.querySelector('main'));
