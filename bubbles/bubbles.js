window.P5 = p5;

new p5((p5) => {
    const particleCount = 100;
    const noiseIncrement = 0.1;
    const cellSize = 20;
    const canvasWidth = 600;
    const canvasHeight = 400;
    let time = 0;
    let flowField = [];
    let particles = [];
    p5.frameRate(10);

    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        particles = Array(particleCount).fill().map(() => new Bubble(p5, {canvasWidth, canvasHeight, cellSize}));
        flowField = Array(canvasWidth / cellSize).fill()
            .map((value, row) => Array(canvasWidth / cellSize).fill()
                .map((value, column) => new GravityLine(p5,{column, row, noiseIncrement, cellSize})));
    }

    p5.draw = () => {
        for (const row of flowField) {
            for (const vector of row) {
                vector.update(time);
            }
        }
        time += noiseIncrement / 20;

        for (const particle of particles) {
            particle.update();
            particle.wrapAround();
            particle.show();
            particle.follow(flowField);
        }
    }
}, document.querySelector('main'));
