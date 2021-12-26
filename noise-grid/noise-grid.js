const cellSize = 20;
const width = 600;
const height = 700;
let grid = []

function setup() {
    createCanvas(width, height);
    grid = [...new Array(height / cellSize + 1)].map(() => [...new Array(width / cellSize + 1)].map(() => floor(random(2))));
}

function draw() {
    background(122);
    let rowIndex = -1;
    for (const row of grid) {
        rowIndex ++;
        let columnIndex = -1;
        for (const column of row) {
            columnIndex ++;
            stroke(column * 255);
            strokeWeight(4);
            point(columnIndex * cellSize, rowIndex * cellSize, 255)
        }
    }
}
