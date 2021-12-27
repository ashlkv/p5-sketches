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
    for (let row = 0; row < grid.length - 1; row++) {
        for (let column = 0; column < grid[row].length - 1; column++) {
            stroke(grid[row][column] * 255);
            strokeWeight(4);
            point(column * cellSize, row * cellSize, 255)
        }
    }
    
    for (let row = 0; row < grid.length - 1; row ++) {
        for (let column = 0; column < grid[row].length - 1; column ++) {
            // .___a___.
            // |       |
            // d       b
            // |       |
            // .___c___.
            const a = new p5.Vector(column * cellSize + cellSize / 2, row * cellSize);
            const b = new p5.Vector(column * cellSize + cellSize, row * cellSize + cellSize / 2)
            const c = new p5.Vector(column * cellSize + cellSize / 2, row * cellSize + cellSize);
            const d = new p5.Vector(column * cellSize, row * cellSize + cellSize / 2)
            const binaryNumber = `${grid[row][column]}${grid[row][column + 1]}${grid[row + 1][column + 1]}${grid[row + 1][column]}`;
            const decimalNumber = parseInt(binaryNumber, 2)
            stroke(255);
            strokeWeight(1);
            switch (decimalNumber) {
                case 0:
                case 15:
                    break;
                case 1:
                case 14:
                    connectVectors(c, d);
                    break;
                case 2:
                case 13:
                    connectVectors(b, c);
                    break;
                case 3:
                case 12:
                    connectVectors(b, d);
                    break;
                case 4:
                case 11:
                    connectVectors(a, b);
                    break;
                case 5:
                    connectVectors(b, c);
                    connectVectors(d, a);
                    break;
                case 6:
                case 9:
                    connectVectors(a, c)
                    break;
                case 7:
                case 8:
                    connectVectors(d, a)
                    break;
                case 10:
                    connectVectors(a, b)
                    connectVectors(c, d)
                    break;
            }
        }
    }
}

const connectVectors = (fromVector, toVector) => {
    return line(fromVector.x, fromVector.y, toVector.x, toVector.y);
}
