export function Grid(width, height, initialize = () => {}) {
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
    
    return this.values;
}
