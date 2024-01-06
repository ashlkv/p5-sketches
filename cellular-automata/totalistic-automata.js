/** A basic cellular automaton */

window.P5 = p5;

new p5((p5) => {
    const getRuleset = (ruleNumber = 777) => {
        const radix = 3
        return ((ruleNumber ?? p5.random(0, 255)) >>> 0)
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
        p5.stroke(value === 1 ? 100 : value === 2 ? 0 : 255);
        p5.strokeWeight(2)
        p5.point(x, y);
    }
    
    
    // Width has to be an odd number
    const canvasWidth = window.innerWidth % 2 === 0 ? window.innerWidth - 1 : window.innerWidth;
    const canvasHeight = window.innerHeight;
    
    const ruleset = getRuleset(1635);
    const firstGeneration = CellularAutomata.getFirstGeneration(canvasWidth);
    
    const automata = new CellularAutomata(p5, canvasWidth, canvasHeight, firstGeneration, ruleset, getNewCell, renderPoint)
    
    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        p5.background(255);
        // p5.frameRate(15)
    };
    
    p5.draw = () => {
        automata.renderGeneration();
    };
}, document.querySelector('main'))



