/** A basic cellular automaton */

window.P5 = p5;

new p5((p5) => {
    const getRuleset = () => {
        return [
            // First array is for cell color
            [0, 0, 1, 0, 0, 0, 1, 1],
            // Second array is for active cell: -1 means move the active cell to the left, 1 — to the right.
            [1, 1, -1, -1, -1, 1, 1, -1]
        ];
    }
    
    const getFirstGeneration = (size) => {
        const generation = Array(size).fill([0, false])
        generation[Math.floor(size / 2)] = [1, true]
        return generation;
    }
    
    // Width has to be an odd number
    const canvasWidth = window.innerWidth % 2 === 0 ? window.innerWidth - 1 : window.innerWidth;
    const canvasHeight = window.innerHeight;
    
    const ruleset = getRuleset();
    const firstGeneration = getFirstGeneration(canvasWidth);
    
    const automata = new MobileAutomata(p5, canvasWidth, canvasHeight, firstGeneration, ruleset)
    
    p5.setup = () => {
        p5.createCanvas(canvasWidth, canvasHeight);
        p5.background(255);
        p5.frameRate(15)
    };
    
    p5.draw = () => {
        automata.renderGeneration();
    };
}, document.querySelector('main'))


function MobileAutomata(p5, width, height, firstGeneration, ruleset) {
    const defaultPointRenderer = (x, y, value) => {
        p5.stroke(value ? 0 : 255);
        p5.point(x, y);
    }
    
    const getNewCell = (ruleset, [leftColor], [middleColor, isActive], [rightColor]) => {
        const index = ruleset[0].length - parseInt(`${leftColor}${middleColor}${rightColor}`, 2) - 1;
        const color = ruleset[0][index];
        if (isActive) {
            const activeCellOffset = isActive ? ruleset[1][index] : 0
            return [color, activeCellOffset];
        } else {
            return [middleColor, undefined]
        }
    }
    
    const renderPoint = (x, y, [value, isActive]) => {
        p5.stroke(isActive ? 'black' : value === 1 ? 'gray' : 'white');
        p5.strokeWeight(2)
        p5.point(x, y);
    }
    
    this.generation = firstGeneration;
    this.nextGeneration = [];
    this.frameCount = 0;
    this.generationIndex = 0;
    /** Calculates the cell color based on the color of left, middle and right cells */
    this.getNewCell = getNewCell.bind(undefined, ruleset);
    /** Renders a point */
    this.renderPoint = renderPoint ?? defaultPointRenderer
    
    this.renderGeneration = () => {
        const isKeyframe = this.frameCount % p5.round(60 / p5.frameRate()) === 0;
        this.frameCount = this.frameCount < 60 ? this.frameCount + 1 : 0;
        if (!isKeyframe) {
            return
        }
        let nextActiveCellIndex = undefined
        for (let cellIndex = 0; cellIndex < this.generation.length; cellIndex ++) {
            let leftCell = this.generation[cellIndex - 1];
            let middleCell = this.generation[cellIndex];
            let rightCell = this.generation[cellIndex + 1];
    
            this.renderPoint(cellIndex, this.generationIndex, this.generation[cellIndex])
            if (cellIndex === 0) {
                leftCell = this.generation[0];
            } else if (cellIndex === this.generation.length - 1) {
                rightCell = this.generation[this.generation.length - 1];
            }
            const [color, activeCellOffset] = this.getNewCell(leftCell, middleCell, rightCell);
            nextActiveCellIndex = activeCellOffset !== undefined ? cellIndex + activeCellOffset : nextActiveCellIndex;
            this.nextGeneration[cellIndex] = [color, false];
        }
        this.nextGeneration[nextActiveCellIndex][1] = [true];
        
        this.generationIndex = this.generationIndex < height ? this.generationIndex + 1 : 0;
        if (this.generationIndex > 0) {
            this.generation = [...this.nextGeneration];
        }
    }
}







