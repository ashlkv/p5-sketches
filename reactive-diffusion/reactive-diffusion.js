import {Grid} from "../common/grid.js";
import {Pixels} from "../common/pixels.js";
import {convolveCell} from "../common/math.js";

window.P5 = p5;

new p5((p5) => {
    // const {innerWidth: width, innerHeight: height} = window
    const { width, height } = { width: 600, height: 600 }
    let grid = new Grid(width, height, () => ({ a: 1, b: 0 }))
    let next = new Grid(width, height, () => ({ a: 0, b: 0 }));
    const diffusionA = 1
    const diffusionB = 0.5
    const feed = 0.055;
    const killRate = 0.062
    const kernel = [[0.05, 0.2, 0.05], [0.2, -1, 0.2], [0.05, 0.2, 0.05]];
    grid[100][100].b = 1
    
    const laplacianA = (x, y) => {
        let sum = 0;
        sum += grid[x][y].a * -1
        sum += grid[x - 1][y].a * 0.2
        sum += grid[x + 1][y].a * 0.2
        sum += grid[x][y - 1].a * 0.2
        sum += grid[x][y + 1].a * 0.2
        sum += grid[x - 1][y - 1].a * 0.05
        sum += grid[x + 1][y - 1].a * 0.05
        sum += grid[x + 1][y + 1].a * 0.05
        sum += grid[x - 1][y + 1].a * 0.05
        return sum;
    }
    
    const laplacianB = (x, y) => {
        let sum = 0;
        sum += grid[x][y].b * -1
        sum += grid[x - 1][y].b * 0.2
        sum += grid[x + 1][y].b * 0.2
        sum += grid[x][y - 1].b * 0.2
        sum += grid[x][y + 1].b * 0.2
        sum += grid[x - 1][y - 1].b * 0.05
        sum += grid[x + 1][y - 1].b * 0.05
        sum += grid[x + 1][y + 1].b * 0.05
        sum += grid[x - 1][y + 1].b * 0.05
        return sum;
    }
    
    const swap = () => {
      var temp = grid;
      grid = next;
      next = temp;
    }
    
    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(0);
        // p5.frameRate(5)
    }
    
    p5.draw = () => {
        p5.background(255);
        
        next.traverse((x, y) => {
            if (x === 0 || y === 0 || x === grid[grid.length - 1].length - 1 || y === grid.length - 1) {
                return;
            }
            const a = grid[x][y].a;
            const b = grid[x][y].b;
            // const laplacianA = convolveCell(grid, x, y, kernel, (value, kernel) => value.a * kernel)
            // const laplacianB = convolveCell(grid, x, y, kernel, (value, kernel) => value.b * kernel)
            next[x][y] = {
                a: a + diffusionA * laplacianA(x, y) * a - a * Math.pow(a, 2) + feed * (1 - a),
                b: b + diffusionB * laplacianB(x, y) * b + a * Math.pow(b, 2) - (killRate + feed) * b
            };
            
            next[x][y].a = p5.constrain(next[x][y].a, 0, 1);
            next[x][y].b = p5.constrain(next[x][y].b, 0, 1);
        })
        
        p5.loadPixels();
        const {reset} = new Pixels(p5, width, height);
        reset((x, y) => ({r: next[x][y].a, g: 0, b: next[x][y].b, alpha: 255}))
        p5.updatePixels();
        
        swap()
    }
    
}, document.querySelector('main'));
