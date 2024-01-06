/** A basic cellular automaton */

window.P5 = p5;

new p5((p5) => {
    const frameRate = 15;
    // Width has to be an odd number
    const canvasWidth = window.innerWidth % 2 === 0 ? window.innerWidth - 1 : window.innerWidth;
    const canvasHeight = window.innerHeight;
    let generation = getFirstGeneration(canvasWidth);
    let nextGeneration = [];
    let frameCount = 0;
    let generationIndex = 0;
    
    // Rule 30 https://en.wikipedia.org/wiki/Rule_30
    // 111	110	101	100	011	010	001	000
    // 0	0	0	1	1	1	1	0
    let ruleset = getRuleset(30);
    
    function getRuleset(ruleNumber) {
        return ((ruleNumber ?? p5.random(0, 255)) >>> 0).toString(2).padStart(8, '0').split('').map(value => parseInt(value, 2));
    }
    
    function getFirstGeneration(size) {
        const generation = Array(size).fill(0)
        generation[Math.floor(size / 2)] = 1
        return generation;
    }
    
    function getNewCellState(left, middle, right, ruleset) {
        const index = ruleset.length - parseInt(`${left}${middle}${right}`, 2) - 1;
        return ruleset[index];
    }
    
    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        p5.background(255);
        // p5.frameRate(1)
    };
    
    p5.draw = () => {
        const isKeyframe = frameCount % p5.round(60 / frameRate) === 0;
        frameCount = frameCount < 60 ? frameCount + 1 : 0;
        if (!isKeyframe) {
            return
        }
        for (let cellIndex = 0; cellIndex < generation.length; cellIndex ++) {
            let previousCell = generation[cellIndex - 1];
            let currentCell = generation[cellIndex];
            let nextCell = generation[cellIndex + 1];
    
            p5.stroke(generation[cellIndex] ? 0 : 255);
            p5.point(cellIndex, generationIndex);
            if (cellIndex === 0) {
                previousCell = generation[0];
            } else if (cellIndex === generation.length - 1) {
                nextCell = generation[generation.length - 1];
            }
            nextGeneration[cellIndex] = getNewCellState(previousCell, currentCell, nextCell, ruleset);
        }
        generationIndex = generationIndex < canvasHeight ? generationIndex + 1 : 0;
        if (generationIndex > 0) {
            generation = [...nextGeneration];
        }
    };
}, document.querySelector('main'))



