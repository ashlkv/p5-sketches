/** A basic cellular automata */

window.P5 = p5;

new p5((p5) => {
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
    
    // Width has to be an odd number
    const canvasWidth = window.innerWidth % 2 === 0 ? window.innerWidth - 1 : window.innerWidth;
    const canvasHeight = window.innerHeight;
    
    const ruleset = getRuleset(101)
    const firstGeneration = CellularAutomata.getGenerationWithCenterPoint(canvasWidth);
    
    const automata = new CellularAutomata(p5, canvasWidth, canvasHeight, firstGeneration, ruleset)
    
    
    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        p5.background(255);
        // p5.frameRate(15)
    };
    
    p5.draw = () => {
        automata.renderGeneration();
    };
}, document.querySelector('main'))



