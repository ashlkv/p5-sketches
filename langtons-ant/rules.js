const DIRECTION = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
}

const hex2rgb = (rawHex = '') => {
    const hex = rawHex.replace('#', '');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

const rgb2Hex = ([r, g, b]) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}

const shuffle = (originalArray = []) => {
    const array = originalArray.slice(0);
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const getRandomRules = (colors = []) => {
    return shuffle(colors).map((color) => {
        return { color, turn: Math.round(Math.random()) === 0 ? 'clockwise' : 'counter-clockwise' };
    });
};

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

const moveForward = (position = { x: 0, y: 0 }, direction, { width, height }) => {
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

