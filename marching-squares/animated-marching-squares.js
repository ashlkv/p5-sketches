// Marching squares tutorial at https://www.youtube.com/watch?v=0ZONMNUKTfU

new p5((p5) => {
    const simplex = openSimplexNoise(Date.now());

    const cellSize = 20;
    const width = 600;
    const height = 700;
    const noiseIncrement = 0.1;

    let grid = []
    let zNoiseOffset = 0;
    let level = 0;

    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.frameRate(25)
    }

    p5.draw = () => {
        p5.background(122);

        grid = [...new Array(height / cellSize + 1)]
            .map((value, row) => [...new Array(width / cellSize + 1)]
                // Simplex noise gives a number between -1 and 1
                .map((value, column) => {
                    return simplex.noise2D(column * noiseIncrement, row * noiseIncrement, zNoiseOffset);
                }));

        zNoiseOffset += 0.0005;

        for (let row = 0; row < grid.length - 1; row++) {
            for (let column = 0; column < grid[row].length - 1; column++) {
                p5.stroke(grid[row][column] * 255);
                p5.strokeWeight(4);
                p5.point(column * cellSize, row * cellSize, 255)
            }
        }

        traverseGrid(grid, cellSize, (noise) => noise >= level ? 1 : 0)
        level += 0.001;
    }

    const connectVectors = (fromVector, toVector) => {
        return p5.line(fromVector.x, fromVector.y, toVector.x, toVector.y);
    }

    /**
     *
     * @param grid
     * @param cellSize
     * @param polarizeNoise The function receiving floating numbers from -1 to 1 and returning 0 or 1
     */
    const traverseGrid = (grid, cellSize, polarizeNoise = Math.ceil) => {
        for (let row = 0; row < grid.length - 1; row ++) {
            for (let column = 0; column < grid[row].length - 1; column ++) {
                // .___a___.
                // |       |
                // d       b
                // |       |
                // .___c___.
                const a = p5.createVector(column * cellSize + cellSize / 2, row * cellSize);
                const b = p5.createVector(column * cellSize + cellSize, row * cellSize + cellSize / 2)
                const c = p5.createVector(column * cellSize + cellSize / 2, row * cellSize + cellSize);
                const d = p5.createVector(column * cellSize, row * cellSize + cellSize / 2)
                const topLeft = polarizeNoise(grid[row][column]);
                const topRight = polarizeNoise(grid[row][column + 1]);
                const bottomRight = polarizeNoise(grid[row + 1][column + 1]);
                const bottomLeft = polarizeNoise(grid[row + 1][column]);
                const binaryNumber = `${topLeft}${topRight}${bottomRight}${bottomLeft}`;
                const decimalNumber = parseInt(binaryNumber, 2)
                p5.stroke(255);
                p5.strokeWeight(1);
                // See https://youtu.be/0ZONMNUKTfU?t=552 for the visual representation of lines.
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
}, document.querySelector('main'))
