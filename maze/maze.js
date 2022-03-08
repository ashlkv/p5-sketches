new p5((p5) => {
    const width = 300;
    const height = 300;

    const cellSize = 20;
    const columns = width / cellSize;
    const rows = height / cellSize;

    const grid = [...new Array(rows)]
        .map(() => [...new Array(columns)]
            .map(() => {
                return undefined;
            }));

    for (let row = 0; row < grid.length; row++) {
        for (let column = 0; column < grid[row].length; column++) {
            grid[row][column] = new Spot(column, row, grid);
        }
    }

    const start = grid[0][0];
    const end = grid[rows - 1][columns - 1]

    start.distance = 0;
    start.wall = false;
    end.wall = false;
    const openSet = [start];
    const closedSet = []

    function Spot(column, row, grid = []) {
        this.column = column;
        this.row = row;
        this.distance = Infinity;
        this.grid = grid;
        this.previous = undefined;
        this.wall = p5.random(0, 1) < 0.2;

        this.show = (color) => {
            p5.fill(this.wall ? 0 : color);
            p5.rect(this.column * cellSize, this.row * cellSize, cellSize, cellSize);
        }

        this.guess = (end) => {
            // Eucledian distance
            // return p5.dist(this.column, this.row, end.column, end.row)

            // Manhattan distance
            return Math.abs(this.column - end.column) + Math.abs(this.row - end.row);
        };

        this.f = (end) => this.distance + this.guess(end);

        this.getNeighbors = () => {
            const neighbors = []
            if (this.row > 0) {
                neighbors.push(this.grid[this.row - 1][this.column])
            }
            if (this.column > 0) {
                neighbors.push(this.grid[this.row][this.column - 1])
            }
            if (this.column < this.grid[0].length - 1) {
                neighbors.push(this.grid[this.row][this.column + 1])
            }
            if (this.row < this.grid.length - 1) {
                neighbors.push(this.grid[this.row + 1][this.column])
            }
            return neighbors;
        }

        this.showPath = () => {
            const path = [];
            let current = this;
            if (!current.previous) {
                return;
            }
            while (current.previous) {
                path.push(current.previous);
                current = current.previous;
            }
            for (const spot of path) {
                spot.show(p5.color(0, 0, 255))
            }
        }
    }

    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(255);
        for (const row of grid) {
            for (const spot of row) {
                if (spot.wall) {
                    spot.show();
                }
            }
        }
    }

    p5.draw = () => {
        for (const spot of closedSet) {
            spot.show(p5.color(255, 0, 0));
        }

        for (const spot of openSet) {
            spot.show(p5.color(0, 255, 0));
        }

        if (openSet.length > 0) {
            const spot = openSet.reduce((winner, spot) => spot.f(end) < winner.f(end) ? spot : winner, openSet[0])
            if (spot === end) {
                p5.noLoop();
            }
            openSet.remove(spot);
            closedSet.push(spot);
            for (const neighbor of spot.getNeighbors()) {
                if (closedSet.includes(neighbor) || neighbor.wall) {
                    continue;
                }
                const distance = spot.distance + 1;
                if (distance < neighbor.distance) {
                    neighbor.distance = distance;
                }
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor)
                }
                neighbor.previous = spot;
            }

            spot.showPath();
        } else {
            p5.noLoop();
        }
    }
});

Array.prototype.remove = function(element) {
    const index = this.findIndex(currentElement => currentElement === element);
    this.splice(index, 1);
    return this.length;
};

