// Written entirely based on
// http://www.karlsims.com/rd.html

// Also, for reference
// http://hg.postspectacular.com/toxiclibs/src/44d9932dbc9f9c69a170643e2d459f449562b750/src.sim/toxi/sim/grayscott/GrayScott.java?at=default

import {Pixels} from "../common/pixels.js";
import {convolveCell} from "../common/math.js";
import {Grid} from "../common/grid.js";

window.P5 = p5;


new p5((p5) => {
    const width = 200;
    const height = width;
    
    let grid = new Grid(width, height, () => ({a: 1, b: 0}));
    let next = new Grid(width, height, () => ({a: 1, b: 0}));
    
    const diffusionA = 1;
    const diffusionB = 0.5;
    /** The rate at which chemical A is added */
    const feedA = 0.055;
    /** The rate at which chemical B is killed */
    const killRateB = 0.062;
    const kernel = [[0.05, 0.2, 0.05], [0.2, -1, 0.2], [0.05, 0.2, 0.05]]
    const speed = 1;
    
    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.pixelDensity(1);
        
        grid.forEach((x, y) => {
            if (x >= width / 2 && x < width / 2 + 10 && y >= height / 2 && y < height / 2 + 10) {
                grid[x][y].b = 1;
            }
        })
    }
    
    p5.draw = () => {
        p5.background(51);
        
        grid.forEach((x, y) => {
            if (x === 0 || y === 0 || x === grid.width - 1 || y === grid.height - 1) {
                return;
            }
            const { a, b } = grid[x][y];
            const laplaceA = convolveCell(grid, x, y, kernel, (value, ratio) => value.a * ratio);
            const laplaceB = convolveCell(grid, x, y, kernel, (value, ratio) => value.b * ratio);
            const nextA = a + (diffusionA * laplaceA - a * b * b + feedA * (1 - a)) * speed;
            const nextB = b + (diffusionB * laplaceB + a * b * b - (killRateB + feedA) * b) * speed;
            next[x][y] = { a: p5.constrain(nextA, 0, 1), b: p5.constrain(nextB, 0, 1) }
        })
        
        p5.loadPixels();
        const {reset} = new Pixels(p5, p5.width, p5.height);
        reset((x, y) => {
            const {a, b} = next[x][y];
            const c = p5.constrain(p5.floor((a - b) * 255), 0, 255);
            return {r: c, g: c, b: c, alpha: 255}
        })
        p5.updatePixels();
        
        let temp = grid;
        grid = next;
        next = temp;
    }
}, document.querySelector('main'));

