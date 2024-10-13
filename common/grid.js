export function Grid(width, height, initialize = () => {}) {
    this.values = Array(height).fill()
                        .map((value, row) => Array(width).fill()
                            .map((value, column) => initialize(column, row)))
    
    this.values.width = width;
    this.values.height = height;
    
    /** Iterates over each value */
    this.values.traverse = function(predicate) {
        this.forEach.call(this, (columns, row) => columns.forEach((value, column) => {
            predicate(column, row, value, this)
        }))
    }
    return this.values;
}
