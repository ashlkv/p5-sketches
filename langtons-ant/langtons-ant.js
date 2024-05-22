// Langton's ant with customizable or possibly random rules
// https://www.youtube.com/watch?app=desktop&v=G1EgjgMo48U

const DIRECTION = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
}

const shuffle = (originalArray = []) => {
    const array = originalArray.slice(0);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const getRandomRules = (colors) => {
    return shuffle(colors).map((color) => {
        return { color, turn: Math.round(Math.random()) === 0 ? 'clockwise' : 'counter-clockwise' };
    });
};

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

const getRuleDictionary = (rules = []) => {
    return rules.reduce((dictionary, {color, turn}, index, rules) => {
        const next = rules[index + 1] || rules[0];
        dictionary[color] = { turn, color: next.color }
        return dictionary;
    }, {})
}

const turnClockwise = (direction) => {
    return direction === DIRECTION.LEFT ? DIRECTION.UP : direction + 1
}
const turnCounterClockwise = (direction) => {
    return direction === DIRECTION.UP ? DIRECTION.LEFT : direction - 1
}
const hex2rgb = (rawHex = '') => {
    const hex = rawHex.replace('#', '');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

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
    
    const moveForward = (position = { x: 0, y: 0 }, direction) => {
        let { x, y } = position;
        if (direction === DIRECTION.UP) {
            return { x, y: y === 0 ? height - 1 : y - 1 }
        } else if (direction === DIRECTION.RIGHT) {
            return { x: x === width - 1 ? 0 : x + 1, y }
        } else if (direction === DIRECTION.DOWN) {
            return { x, y: y === height - 1 ? 0 : y + 1 }
        } else {
            return { x: x === 0 ? width - 1 : x - 1, y }
        }
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
            position = moveForward(position, direction);
            
            const [r, g, b] = hex2rgb(grid[x][y])
            p5.stroke(r, g, b);
            p5.point(x, y);
        }
    }
}, document.querySelector('main'))
