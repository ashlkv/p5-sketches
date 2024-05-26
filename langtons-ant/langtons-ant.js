// Langton's ant with customizable or possibly random rules
// https://www.youtube.com/watch?app=desktop&v=G1EgjgMo48U


/** Ant rules. color is the current cell color. Next color is the color of the next array element. */
// const rules = [{ color: '#ffffff', turn: 'clockwise' }, { color: '#000000', turn: 'counter-clockwise' }];
// const rules = [{ color: '#ffffff', turn: 'clockwise' }, { color: '#ff0000', turn: 'counter-clockwise' }];
// const rules = [{ color: '#ffffff', turn: 'clockwise' }, { color: '#ff0000', turn: 'clockwise' }, { color: '#00ff00', turn: 'counter-clockwise' }];
// const rules = [
//     {color: '#ffffff', turn: 'clockwise'},
//     {color: '#ff0000', turn: 'clockwise'},
//     {color: '#00ff00', turn: 'clockwise'},
//     {color: '#00ffff', turn: 'clockwise'},
//     {color: '#ffff00', turn: 'counter-clockwise'},
//     {color: '#ff00ff', turn: 'counter-clockwise'},
// ];

const rules = getRandomRules(['#ffffff', '#ff0000', '#00ff00', '#00ffff', '#ffff00', '#ff00ff']);

new p5((p5) => {
    const width = 400;
    const height = 400;
    // Grid of white squares
    const grid = [...new Array(height)].map(() => [...new Array(width)].map(() => '#ffffff'))
    // Rule dictionary or rule cache for quick calculation of next turn and color
    const ruleDictionary = getRuleDictionary(rules);
    
    let position = {x: Math.round(width / 2) - 1, y: Math.round(height / 2) - 1}
    let direction = DIRECTION.UP
    
    const getNextColor = (color) => {
        return ruleDictionary[color].color;
    }
    const getNextDirection = (color, direction) => {
        return ruleDictionary[color].turn === 'clockwise' ? turnClockwise(direction) : turnCounterClockwise(direction);
    }
    
    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.frameRate(25)
    }

    p5.draw = () => {
        p5.strokeWeight(1)
        for (let i = 0; i < 100; i++) {
            const { x, y } = position;
            
            const hex = grid[x][y];
            direction = getNextDirection(hex, direction);
            grid[x][y] = getNextColor(hex);
            position = moveForward(position, direction, { width, height });
            
            const [r, g, b] = hex2rgb(grid[x][y])
            p5.stroke(r, g, b);
            p5.point(x, y);
        }
    }
}, document.querySelector('main'))
