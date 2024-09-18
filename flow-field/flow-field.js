window.P5 = p5;

import { FlowLine } from "./flow-line.js";

new p5((p5) => {
    const particleCount = 300;
    const noiseIncrement = 0.1;
    const cellSize = 20;
    const canvasWidth = Math.floor(window.innerWidth / cellSize) * cellSize;
    const canvasHeight = Math.floor(window.innerHeight / cellSize) * cellSize;
    let time = 0;
    let flowField = [];
    let particles = [];

    // p5.frameRate(200);

    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        particles = Array(particleCount).fill().map(() => new Particle(p5, {canvasWidth, canvasHeight, cellSize}));
        flowField = Array(canvasHeight / cellSize).fill()
            .map((value, row) => Array(canvasWidth / cellSize).fill()
                .map((value, column) => new FlowLine(p5,{column, row, noiseIncrement, cellSize})));
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
