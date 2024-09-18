import {Spot} from "./spot.js";

new p5((p5) => {
    const width = 600;
    const height = 800;

    const cellSize = 10;
    const columns = width / cellSize;
    const rows = height / cellSize;
    let openSet = [];
    let closedSet = []
    let grid;
    let start
    let end
    
    const initialize = () => {
        grid = [...new Array(rows)]
            .map(() => [...new Array(columns)]
                .map(() => {
                    return undefined;
                }));
    
        for (let row = 0; row < grid.length; row++) {
            for (let column = 0; column < grid[row].length; column++) {
                grid[row][column] = new Spot(p5, column, row, grid, cellSize);
            }
        }
    
        start = grid[0][0];
        end = grid[rows - 1][columns - 1]
    
        start.distance = 0;
        start.wall = false;
        end.wall = false;
        openSet = [start];
        closedSet = []
    }
    
    initialize();
    
    window.save = (name) => p5.save(name)
    window.repeat = () => {
        p5.noLoop();
        initialize();
        p5.loop();
    }
    
    p5.setup = () => {
        p5.createCanvas(width, height, p5.SVG);
        p5.background(255);
        for (const row of grid) {
            for (const spot of row) {
                if (spot.wall) {
                    // spot.show();
                }
            }
        }
    }

    p5.draw = () => {
        for (const spot of closedSet) {
            // spot.show(p5.color(255, 0, 0));
        }

        for (const spot of openSet) {
            // spot.show(p5.color(0, 255, 0));
        }

        if (openSet.length > 0) {
            const spot = openSet.reduce((winner, spot) => spot.f(end) < winner.f(end) ? spot : winner, openSet[0])
            spot.showPath();
            if (spot === end) {
                p5.noLoop();
                return;
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
                    neighbor.previous = spot;
                }
                if (!openSet.includes(neighbor)) {
                    openSet.push(neighbor)
                }
            }
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

