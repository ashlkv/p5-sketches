/** Calculates the cell color based on the color of left, middle and right cells */
const defaultCellCalculator = (ruleset, left, middle, right) => {
    const index = ruleset.length - parseInt(`${left}${middle}${right}`, 2) - 1;
    return ruleset[index];
}

function CellularAutomata(p5, width, height, firstGeneration, ruleset, getNewCell = defaultCellCalculator, renderPoint = undefined) {
    const defaultPointRenderer = (x, y, value) => {
        p5.stroke(value ? 0 : 255);
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
            this.nextGeneration[cellIndex] = this.getNewCell(leftCell, middleCell, rightCell);
        }
        this.generationIndex = this.generationIndex < height ? this.generationIndex + 1 : 0;
        if (this.generationIndex > 0) {
            this.generation = [...this.nextGeneration];
        }
    }
}

/** Returns a default first generation with a point in center */
CellularAutomata.getGenerationWithCenterPoint = (size) => {
    const generation = Array(size).fill(0)
    generation[Math.floor(size / 2)] = 1
    return generation;
}




