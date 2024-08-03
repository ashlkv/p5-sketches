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

const ruleAcross = [
    {"color": "#0000ff", "turn": "counter-clockwise"},
    {"color": "#ff0000", "turn": "counter-clockwise"},
    {"color": "#00ff00", "turn": "clockwise"},
    {"color": "#ffffff", "turn": "counter-clockwise"}
]

// const rules = getRandomRules(['#ffffff', '#ff0000', '#00ff00', '#0000ff']);
const rules = ruleAcross;
console.log('rules', rules)

new p5((p5) => {
    const resolution = 2
    // const canvasSize = { width: 640, height: 320 }
    const canvasSize = { width: 640, height: 456 }
    if (canvasSize.width % resolution > 0 || canvasSize.height % resolution > 0) {
        throw 'Canvas size should divide by resolution';
    }
    const gridSize = { width: canvasSize.width / resolution, height: canvasSize.height / resolution };
    // Grid of white squares
    const grid = [...new Array(gridSize.height)].map(() => [...new Array(gridSize.width)].map(() => '#ffffff'))
    // Rule dictionary or rule cache for quick calculation of next turn and color
    const ruleDictionary = getRuleDictionary(rules);
    
    let position = {x: Math.round(gridSize.width / 2), y: Math.round(gridSize.height / 2)}
    let direction = DIRECTION.UP
    
    const getNextColor = (color) => {
        return ruleDictionary[color].color;
    }
    const getNextDirection = (color, direction) => {
        return ruleDictionary[color].turn === 'clockwise' ? turnClockwise(direction) : turnCounterClockwise(direction);
    }
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
    }

    p5.draw = () => {
        p5.strokeWeight(resolution)
        for (let i = 0; i < 1000000; i++) {
            const { x: column, y: row } = position;
            
            const hex = grid[row][column];
            direction = getNextDirection(hex, direction);
            grid[row][column] = getNextColor(hex);
            position = moveForward(position, direction, gridSize);
            
        }
        grid.forEach((columns, row) => columns.forEach((hex, column) => {
            const [r, g, b] = hex2rgb(hex)
            p5.stroke(r, g, b);
            p5.point(column * resolution, row * resolution);
        }))
        p5.noLoop()
    }
    
    window.save = (name) => p5.save(name)
    
}, document.querySelector('main'))
