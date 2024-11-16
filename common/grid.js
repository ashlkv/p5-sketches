export function Grid(p5, width, height, initialize = () => {}) {
    this.values = Array(height).fill()
                        .map((value, row) => Array(width).fill()
                            .map((value, column) => initialize(column, row)))
    
    this.values.width = width;
    this.values.height = height;
    
    let cursor = 0;
    this.values.next = function() {
        if (cursor > width * height - 1) {
            throw 'Grid cursor out of bounds'
        }
        const row = Math.floor(cursor / width)
        const column = cursor % width;
        cursor ++;
        return { row, column, value: this[row]?.[column] };
    }
    
    /** Iterates over each value */
    this.values.traverse = function(predicate) {
        this.forEach.call(this, (columns, row) => columns.forEach((value, column) => {
            predicate(column, row, value, this)
        }))
    }
    
    this.values.render = function(cellSize = 20, color = '#ff0000') {
        p5.push()
        p5.strokeWeight(3)
        p5.stroke(color);
        this.forEach((columns, row) => columns.forEach((value, column) => {
            p5.point(column * cellSize, row * cellSize)
        }))
        p5.pop()
    }
    
    const originalAt = this.values.at;
    this.values.at = function(column, row) {
        if (row !== undefined) {
            return this[row]?.[column];
        } else {
            originalAt.call(this, column)
        }
    }
    
    this.values.getTransposed = function() {
        const values = this;
        return new Grid(p5, height, width, (column, row) => values.at(row, column))
    }
    
    return this.values;
}
