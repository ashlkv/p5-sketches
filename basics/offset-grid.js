import {Grid} from "../common/grid.js";
import {randomSample} from '../common/noise.js'

window.P5 = p5;

// 1. Create a grid
// 2. Measure distance between grid intersections and spread points
// 2. Split points into those within the radial distance and those outside
// 3. Move points inside to their closest point outside
// 4. Remove overlapping points that exist in the same x,y,z coordinates
// 5. Connect points to make new spread grid

new p5((p5) => {
    const canvasSize = {width: window.innerHeight * 1.42, height: window.innerHeight};
    const cellSize = 8;
    const grid = new Grid(p5, Math.floor(canvasSize.width / cellSize), Math.floor(canvasSize.height / cellSize), (column, row) => {
        return { x: column * cellSize, y: row * cellSize }
    })
    const spreadPoints = randomSample(p5, 15, canvasSize.width - 200, canvasSize.height - 200).map(({x, y}) => {
        return { x: x + 100, y: y + 100 }
    })
    const radii = spreadPoints.map((point, index) => Math.abs(p5.noise(index)) * 200).sort();
    const outsidePositions = [];
    const insidePositions = [];
    
    grid.traverse((column, row, from) => {
        const distances = spreadPoints.map((to) => p5.dist(to.x, to.y, from.x, from.y))
        const isOutside = distances.every((distance, index) => distance > radii[index])
        if (isOutside) {
            outsidePositions.push({ column, row })
        } else {
            insidePositions.push({ column, row })
            const index = distances.findIndex((distance, index) => distance < radii[index])
            const radius = radii[index];
            const point = grid.at(column, row);
            const offset = /*Math.abs(p5.map(radius, 0, 200, 1.5, 4))*/ 2.5
            point.x = point.x + cellSize * offset
            point.y = point.y + cellSize * offset
        }
    })
    
    // insidePositions.forEach(({ column, row }) => {
    //     const point = grid.at(column, row);
    //     point.x = point.x + cellSize * 1.5
    //     point.y = point.y + cellSize * 1.5
    // })

    window.spreadPoints = spreadPoints
    window.save = (name) => p5.save(name)

    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.background(255);
        p5.noFill();
    }
    
    p5.draw = () => {
        // p5.stroke('#0000ff');
        // p5.strokeWeight(6);
        // spreadPoints.forEach(({ x, y }) => {
        //     p5.point(x, y)
        // })
        
        p5.strokeWeight(2)
        p5.stroke('#ff0000')
        grid.traverse((column, row, { x, y }) => {
            if ((grid.width - column < 15 || grid.height - row < 15) && outsidePositions.find(position => position.column === column && position.row === row)) {
                return
            }
            p5.point(x, y);
            
        })
        // p5.stroke('#00ff00')
        // insidePositions.forEach(({ column, row }) => {
        //     const point = grid[column][row];
        //     p5.point(point.x, point.y);
        // })
        
        p5.noLoop();
    }
}, document.querySelector('main'));
