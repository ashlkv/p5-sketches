// Marching squares tutorial at https://www.youtube.com/watch?v=0ZONMNUKTfU

new p5((p5) => {
    const simplex = openSimplexNoise(Date.now());

    const cellSize = 16;
    const width = 600;
    const height = 700;
    const noiseIncrement = 0.1;
    const colors = [[255, 0, 0], [0, 0, 0], [255, 255, 255], [255, 255, 0], [0, 255, 255], [255, 0, 255]]

    let grid = []
    let zNoiseOffset = 0;
    let level = -1;

    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.frameRate(25)
        p5.background(122);
    }

    p5.draw = () => {

        grid = [...new Array(Math.ceil(height / cellSize) + 1)]
            .map((value, row) => [...new Array(Math.ceil(width / cellSize) + 1)]
                // Simplex noise gives a number between -1 and 1
                .map((value, column) => {
                    return simplex.noise2D(column * noiseIncrement, row * noiseIncrement, zNoiseOffset);
                }));

        zNoiseOffset += 0.0005;

        traverseGrid(grid, cellSize, level, (noise) => noise >= level ? 1 : 0)
        level += 0.1;
    }

    const connectVectors = (fromVector, toVector) => {
        return p5.line(fromVector.x, fromVector.y, toVector.x, toVector.y);
    }

    const colorCircle = (fromVector) => {
        p5.drawingContext.shadowOffsetX = 0;
        p5.drawingContext.shadowOffsetY = 0;
        p5.drawingContext.shadowBlur = 10;
        p5.drawingContext.shadowColor = '#00000080';
        p5.stroke(0);
        p5.strokeWeight(0);
        const colorIndex = Math.floor(p5.random(0, colors.length));
        p5.fill(...colors[colorIndex]);
        const radius = p5.random(20, 30);
        const x = p5.random(fromVector.x - 2, fromVector.x + 2)
        const y = p5.random(fromVector.y - 2, fromVector.y + 2)
        p5.ellipse(x, y, radius, radius)
    }

    /**
     *
     * @param grid
     * @param cellSize
     * @param polarizeNoise The function receiving floating numbers from -1 to 1 and returning 0 or 1
     */
    const traverseGrid = (grid, cellSize, level, polarizeNoise = Math.ceil) => {
        for (let row = 0; row < grid.length - 1; row ++) {
            for (let column = 0; column < grid[row].length - 1; column ++) {
                const value = grid[row][column];
                if (value < level) {
                    continue;
                }
                // .___a___.
                // |       |
                // d       b
                // |       |
                // .___c___.

                const da = p5.createVector(column * cellSize, row * cellSize);
                const ab = p5.createVector(column * cellSize + cellSize, row * cellSize);
                const bc = p5.createVector(column * cellSize + cellSize, row * cellSize + cellSize);
                const cd = p5.createVector(column * cellSize, row * cellSize + cellSize);

                const topLeft = polarizeNoise(grid[row][column]);
                const topRight = polarizeNoise(grid[row][column + 1]);
                const bottomRight = polarizeNoise(grid[row + 1][column + 1]);
                const bottomLeft = polarizeNoise(grid[row + 1][column]);
                const binaryNumber = `${topLeft}${topRight}${bottomRight}${bottomLeft}`;
                const decimalNumber = parseInt(binaryNumber, 2)
                p5.stroke(255);
                p5.strokeWeight(1);
                // TODO Do not draw multiple circles on the same point on the same level.
                // See https://youtu.be/0ZONMNUKTfU?t=552 for the visual representation of lines.
                switch (decimalNumber) {
                    case 0:
                    case 15:
                        colorCircle(da);
                        colorCircle(ab);
                        colorCircle(bc);
                        colorCircle(cd);
                        break;
                    case 1:
                    case 14:
                        colorCircle(cd);
                        break;
                    case 2:
                    case 13:
                        colorCircle(bc);
                        break;
                    case 3:
                    case 12:
                        colorCircle(bc);
                        colorCircle(cd);
                        break;
                    case 4:
                    case 11:
                        colorCircle(ab)
                        break;
                    case 5:
                        colorCircle(bc)
                        colorCircle(da)
                        break;
                    case 6:
                    case 9:
                        colorCircle(ab)
                        colorCircle(bc)
                        break;
                    case 7:
                    case 8:
                        colorCircle(da)
                        break;
                    case 10:
                        colorCircle(ab)
                        colorCircle(cd)
                        break;
                }
            }
        }
    }
}, document.querySelector('main'))
