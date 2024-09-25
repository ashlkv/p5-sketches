export function Grid(width, height, initialize = () => {}) {
    this.values = Array(height).fill()
                        .map((value, row) => Array(width).fill()
                            .map((value, column) => initialize(column, row)))
    const original = this.values;
    
    this.values.clone = function() {
        const clone = new Grid(width, height, initialize);
        clone.traverse((column, row) => {
            clone[column][row] = original[column][row];
        })
        return clone;
    }
    this.values.swap = function(target) {
        const temp = target;
        target = this.values;
        this.values = temp;
    }
    this.values.traverse = function(predicate) {
        this.forEach((columns, row) => columns.forEach((value, column) => {
            predicate(column, row, value)
        }))
    }
    return this.values;
}
