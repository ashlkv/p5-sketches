import {Pixels} from "./pixels.js";

const getNoiseValue = (column, row, p5, ) => {
    // FIXME Remove noise increment
    const noiseIncrement = 0.01
    return p5.noise(column * noiseIncrement, row * noiseIncrement);
};

export function FlowLine(p5, {column, row, cellSize, angle}) {
    this.angle = angle;
    this.radius = cellSize / 2;
    this.vector = P5.Vector.fromAngle(this.angle, this.radius)
    this.anchor = { x: column * cellSize, y: row * cellSize }
    
    this.render = () => {
        this.vector = P5.Vector.fromAngle(this.angle, this.radius)
        const { x: x1, y: y1 } = this.anchor;
        const { x: x2, y: y2 } = { x: this.anchor.x + this.vector.x, y: this.anchor.y + this.vector.y }
        p5.strokeWeight(1)
        p5.stroke(255, 0, 0, 50);
        p5.line(x1, y1, x2, y2)
        
        // Dot at the end
        p5.strokeWeight(3)
        p5.stroke(255, 0, 0, 50);
        p5.point(x2, y2)
    }
}

function FlowField(p5, { width, height, cellSize = 20, initialize = getNoiseValue }) {
    this.width = width;
    this.height = height
    this.values = Array(height).fill()
                    .map((value, row) => Array(width).fill()
                        .map((value, column) => initialize(column, row, p5)))
    const cellDiagonal = p5.dist(0, 0, cellSize, cellSize);
    
    const isInBounds = ({ column, row }, {width, height}) => {
        return column >= 0 && row >= 0 && column <= width - 1 && row <= height - 1
    }
    
    /** Gets closest vector to the point specified in pixels */
    this.getValueAtPoint = ({x, y}) => {
        const column = Math.round(x / cellSize);
        const row = Math.round(y / cellSize);
        if (!isInBounds({ column, row }, { width, height })) {
            return undefined;
        }
        return this.values[row][column]
    }
    
    this.getWeightedAverageAt = ({x, y}) => {
        const column = x / cellSize;
        const row = y / cellSize;
        const anchor1 = { row: Math.floor(row), column: Math.floor(column) }
        const anchor2 = { row: Math.floor(row), column: Math.ceil(column) }
        const anchor3 = { row: Math.ceil(row), column: Math.ceil(column) }
        const anchor4 = { row: Math.ceil(row), column: Math.floor(column) }
        const values = [anchor1, anchor2, anchor3, anchor4]
            .filter(({ column, row }) => isInBounds({ column, row }, { width, height }))
            .map(({ column, row }) => {
                const value = this.values[row][column];
                const distance = p5.dist(x, y, column * cellSize, row * cellSize);
                return { value, weight: cellDiagonal - distance }
            })
        if (values.length === 0) {
            return undefined
        }
        const weights = values.reduce((sum, {weight}) => sum + weight, 0)
        return values.reduce((sum, {value, weight}) => sum + value * weight, 0) / weights
    }
    
    this.get = ({column, row}) => {
        return this.values[row]?.[column]
    }
    
    this.set = ({column, row}, value) => {
        if (this.values[row]?.[column] === undefined) {
            return;
        }
        return this.values[row][column] = value;
    }
    
    /** @deprecated */
    this.render = () => {
        this.values.forEach((columns, row) => columns.forEach((value, column) => {
            const line = new FlowLine(p5, { column, row, cellSize, angle: value })
            line.render()
        }))
    }
    
    this.renderVectors = () => {
        this.render();
    }
    
    this.renderGrid = () => {
        p5.push();
        p5.noStroke()
        this.values.forEach((columns, row) => columns.forEach((value, column) => {
            const color = p5.map(value, -1, 1, 0, 255)
            p5.fill(color);
            p5.rect(column * cellSize, row * cellSize, cellSize, cellSize)
        }))
        p5.pop();
    }
    
    this.forEach = (predicate) => {
        this.values.forEach((columns, row, rows) => columns.forEach((value, column, columns) => {
            const point = {value, column, row, x: column * cellSize, y: row * cellSize}
            const left = {
                value: columns[column - 1],
                column: column - 1,
                row,
                x: (column - 1) * cellSize,
                y: row * cellSize
            }
            const right = {
                value: columns[column + 1],
                column: column + 1,
                row,
                x: (column + 1) * cellSize,
                y: row * cellSize
            }
            const top = {
                value: rows[row - 1]?.[column],
                column,
                row: row - 1,
                x: column * cellSize,
                y: (row - 1) * cellSize
            }
            const bottom = {
                value: rows[row + 1]?.[column],
                column,
                row: row + 1,
                x: column * cellSize,
                y: (row + 1) * cellSize
            }
            
            predicate(point, left, right, top, bottom)
        }))
    }
}

FlowField.fromImage = function(p5, image, slice = { left: 0, top: 0, width: undefined, height: undefined }, options = { cellSize: 1 }) {
    image.loadPixels();
    return FlowField.fromPixels(p5, image.pixels, { width: image.width, height: image.height }, slice, options)
}

FlowField.fromPixels = function(p5, pixels, size, slice, { cellSize } = { cellSize: 1 }) {
    const whole = new Pixels(p5, pixels, size);
    const { get: getPixel } = Pixels.slice(p5, whole, slice);
    const initialize = (column, row) => {
        const { r, g, b } = getPixel({x: column, y: row });
        return p5.map((r + g + b) / 3, 0, 255, -1, 1);
    };
    return new FlowField(p5, { width: Math.floor(slice.width / cellSize), height: Math.floor(slice.height / cellSize), cellSize, initialize })
}

export { FlowField };
