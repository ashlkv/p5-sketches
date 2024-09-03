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

export function FlowField(p5, { width, height, cellSize, initialize = (column, row) => {} }) {
    this.width = width;
    this.height = height
    this.values = Array(height).fill()
                    .map((value, row) => Array(width).fill()
                        .map((value, column) => initialize(column, row)))
    const cellDiagonal = p5.dist(0, 0, cellSize, cellSize);
    
    const isInBounds = ({ column, row }, {width, height}) => {
        return column >= 0 && row >= 0 && column <= width - 1 && row <= height - 1
    }
    
    /** Gets closest vector to the point specified in pixels */
    this.getValueAt = ({x, y}) => {
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
    
    this.render = () => {
        this.values.forEach((columns, row) => columns.forEach((value, column) => {
            const line = new FlowLine(p5, { column, row, cellSize, angle: value })
            line.render()
        }))
    }
}
