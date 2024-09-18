export function Spot(p5, column, row, grid = [], cellSize) {
    this.column = column;
    this.row = row;
    this.distance = Infinity;
    this.grid = grid;
    this.previous = undefined;
    this.wall = p5.random(0, 1) < 0.4;

    this.show = (color) => {
        p5.fill(this.wall ? 0 : color);
        p5.rect(this.column * cellSize, this.row * cellSize, cellSize, cellSize);
    }

    this.guess = (end) => {
        // Eucledian distance
        return p5.dist(this.column, this.row, end.column, end.row)

        // Manhattan distance
        // return Math.abs(this.column - end.column) + Math.abs(this.row - end.row);
    };

    this.f = (end) => this.distance + this.guess(end);

    this.getNeighbors = () => {
        const neighbors = []
        const rows = this.grid.length;
        const columns = this.grid[0].length;
        if (this.row > 0) {
            neighbors.push(this.grid[this.row - 1][this.column])
        }
        if (this.column > 0) {
            neighbors.push(this.grid[this.row][this.column - 1])
        }
        if (this.column < columns - 1) {
            neighbors.push(this.grid[this.row][this.column + 1])
        }
        if (this.row < rows - 1) {
            neighbors.push(this.grid[this.row + 1][this.column])
        }
        if (this.row > 0 && this.column > 0) {
            neighbors.push(this.grid[this.row - 1][this.column - 1])
        }
        if (this.row > 0 && this.column < columns - 1) {
            neighbors.push(this.grid[this.row - 1][this.column + 1])
        }
        if (this.row < rows - 1 && this.column < columns - 1) {
            neighbors.push(this.grid[this.row + 1][this.column + 1])
        }
        if (this.row < rows - 1 && this.column > 0) {
            neighbors.push(this.grid[this.row + 1][this.column - 1])
        }
        return neighbors;
    }

    this.showPath = () => {
        const path = [];
        let current = this;
        if (!current.previous) {
            return;
        }
        p5.beginShape()
        p5.curveVertex(0, 0);
        p5.noFill();
        p5.strokeWeight(1)
        p5.stroke(0)
        while (current.previous) {
            path.push(current.previous);
            current = current.previous;
        }
        for (const spot of path) {
            // spot.show(p5.color(0, 0, 255))
            p5.curveVertex(spot.row * cellSize, spot.column * cellSize);
        }
        p5.endShape()
    }
}
