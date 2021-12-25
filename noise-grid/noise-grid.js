const noiseIncrement = 0.1;
const cellSize = 20;
const width = 600;
const height = 700;

function setup() {
    createCanvas(width, height);
}

function draw() {
    for (let row = 0; row < height / cellSize; row++) {
        for (let column = 0; column < width / cellSize; column++) {
            const perlinNoiseFill = noise(column * noiseIncrement, row * noiseIncrement) * 255;
            fill(perlinNoiseFill);
            rect(column * cellSize, row * cellSize, cellSize, cellSize);
        }
    }
}
