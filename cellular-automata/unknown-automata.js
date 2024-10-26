import {Grid} from "../common/grid.js";

window.P5 = p5;


const hasTriangle = (grid, columnIndex, rowIndex, width, height) => {
    // Should start with 0. Previous should be 1.
    if (grid[rowIndex - 1]?.[columnIndex] !== 1 || grid[rowIndex][columnIndex - 1] !== 1) {
        return false;
    } else if (rowIndex + height > grid.length || columnIndex + width > grid[rowIndex].length || grid[rowIndex][columnIndex] !== 0) {
        return false;
    }
    for (let i = 0; i < height; i++) {
        const layer = grid[rowIndex + i].slice(columnIndex + i, columnIndex + i + width - i * 2);
        if (!layer.every(element => element === 0)) {
            return false;
        }
    }
    return true;
}

new p5((p5) => {
    const canvasSize = { width: window.innerWidth, height: window.innerHeight }
    const height = 200;
    // Width has to be an odd number
    const width = 41;
    // Rule 30 https://en.wikipedia.org/wiki/Rule_30
    // 111	110	101	100	011	010	001	000
    // 0	0	0	1	1	1	1	0
    const getRuleset = (ruleNumber = 30) => {
        const radix = 2;
        return ((ruleNumber ?? p5.random(0, 255)) >>> 0)
            .toString(radix)
            .padStart(8, '0')
            .split('')
            .map(value => parseInt(value, radix));
    }
    
    const ruleset = getRuleset(30)
    const firstGeneration = CellularAutomata.getGenerationWithCenterPoint(width);
    
    const grid = new Grid(width, height)
    const renderPoint = (x, y, value) => {
        grid[y][x] = value;
    }
    const renderTriangle = (x, y, size = 1) => {
        p5.stroke(0)
        p5.strokeWeight(1);
        p5.noFill()
        p5.beginShape()
        p5.vertex(x + 0, y + 0)
        p5.vertex(x + 10 * size, y + 10 * size)
        p5.vertex(x + 20 * size, y + 0)
        p5.endShape(p5.CLOSE)
    }
    
    const renderWave = (x, y, size = 1) => {
        p5.curveVertex(x, y + 5 * size)
        p5.curveVertex(x + 10 * size, y + 25 * size)
        if (size >= 4) {
            p5.curveVertex(x + 35 * size, y + 5 * size)
        } else {
            p5.curveVertex(x + 60 * size, y + 5 * size)
        }
    }
    
    const automata = new CellularAutomata(p5, width, height, firstGeneration, ruleset, undefined, renderPoint)
    window.grid = grid;
    window.save = (name) => p5.save(name)
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.background(255);
        p5.frameRate(60)
        p5.noFill()
        new Array(height).fill().forEach(() => {
            automata.renderGeneration();
        })
    };
    
    const offsetFactor = 10;
    p5.draw = () => {
        p5.translate(0, canvasSize.height * 0.9)
        p5.rotate(p5.PI * -0.5)
        /*grid.traverse((column, row, value) => {
            if (row < 20 || value !== 0) {
                return;
            }
            const { x, y } = { x: column * offsetFactor, y: row * offsetFactor }
            if (hasTriangle(grid, column, row, 11, 8)) {
                renderTriangle(x, y, 7)
            } else if (hasTriangle(grid, column, row, 10, 7)) {
                renderTriangle(x, y, 6)
            } else if (hasTriangle(grid, column, row, 9, 6)) {
                renderTriangle(x, y, 5)
            } else if (hasTriangle(grid, column, row, 8, 5)) {
                renderTriangle(x, y, 4)
            } else if (hasTriangle(grid, column, row, 7, 4)) {
                renderTriangle(x, y, 3)
            } else if (hasTriangle(grid, column, row, 5, 3)) {
                renderTriangle(x, y, 2)
            } else if (hasTriangle(grid, column, row, 3, 2)) {
                renderTriangle(x, y, 1)
            }
        })*/
        const startAt = grid.findIndex(row => row[0] === 1)
        grid.traverse((column, row, value, grid) => {
            if (row < startAt) {
                return;
            }
            if (column === 0) {
                const { x, y } = { x: (column) * offsetFactor, y: (row - startAt) * offsetFactor }
                p5.beginShape();
                p5.curveVertex(x, y)
                p5.curveVertex(x, y)
            }
            const { x, y } = { x: (column + 15) * offsetFactor, y: (row - startAt) * offsetFactor }
            if (hasTriangle(grid, column, row, 11, 8)) {
                renderWave(x, y, 7)
            } else if (hasTriangle(grid, column, row, 13, 7)) {
                renderWave(x, y, 6)
            } else if (hasTriangle(grid, column, row, 11, 6)) {
                renderWave(x, y, 5)
            } else if (hasTriangle(grid, column, row, 9, 5)) {
                renderWave(x, y, 4)
            } else if (hasTriangle(grid, column, row, 8, 4)) {
                renderWave(x, y, 3.5)
            } else if (hasTriangle(grid, column, row, 7, 4)) {
                renderWave(x, y, 3)
            } else if (hasTriangle(grid, column, row, 6, 3)) {
                renderWave(x, y, 2.5)
            } else if (hasTriangle(grid, column, row, 5, 3)) {
                renderWave(x, y, 2)
            } else if (hasTriangle(grid, column, row, 4, 2)) {
                renderWave(x, y, 1.5)
            } else if (hasTriangle(grid, column, row, 3, 2)) {
                renderWave(x, y, 1)
            }
            if (column === grid.width - 1) {
                p5.curveVertex(x + 20 * offsetFactor, y)
                p5.curveVertex(x + 20 * offsetFactor, y)
                p5.endShape();
            }
        })
        p5.noLoop()
    };
}, document.querySelector('main'))



