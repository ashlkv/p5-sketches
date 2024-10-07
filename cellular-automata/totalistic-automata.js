/** A basic cellular automaton */

window.P5 = p5;

new p5((p5) => {
    const colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255]]
    const values = new Set();
    
    const getRuleset = (defaultRuleNumber) => {
        const radix = colors.length
        const ruleNumber = (defaultRuleNumber ?? Math.round(p5.random(0, 1635)));
        console.log('ruleNumber', ruleNumber)
        return (ruleNumber >>> 0)
            .toString(radix)
            .padStart(7, '0')
            .split('')
            .map(value => parseInt(value, radix));
    }
    
    const getNewCell = (ruleset, left, middle, right) => {
        const levelCount = 255;
        const averageLevels = p5.map((left + middle + right) / 3, 0, 2, levelCount, 0)
        const step = levelCount / ruleset.length;
        const stepCount = Math.floor(averageLevels / step);
        const index = Math.min(stepCount, 6)
        return ruleset[index];
    }
    
    const renderPoint = (x, y, value) => {
        values.add(value)
        const index = value === undefined ? -1 : value
        const color = index === -1 ? [255, 255, 255] : colors[index]
        p5.stroke(...color);
        p5.strokeWeight(2)
        p5.point(x, y);
    }
    
    
    // Width has to be an odd number
    const canvasWidth = window.innerWidth % 2 === 0 ? window.innerWidth - 1 : window.innerWidth;
    const canvasHeight = window.innerHeight;
    
    const ruleset = getRuleset();
    const firstGeneration = CellularAutomata.getGenerationWithCenterPoint(canvasWidth);
    
    const automata = new CellularAutomata(p5, canvasWidth, canvasHeight, firstGeneration, ruleset, getNewCell, renderPoint)
    
    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        p5.background(255);
        p5.frameRate(30)
    };
    
    p5.draw = () => {
        const isKeyframe = automata.frameCount % p5.round(60 / p5.frameRate()) === 0;
        automata.frameCount = automata.frameCount < 60 ? automata.frameCount + 1 : 0;
        if (!isKeyframe) {
            return
        }
        automata.renderGeneration();
    };
    
    window.values = values
}, document.querySelector('main'))



