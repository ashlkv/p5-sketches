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
    const cellSize = 20;
    const redGrid = new Grid(p5, Math.floor(canvasSize.width / cellSize), Math.floor(canvasSize.height / cellSize), (column, row) => {
        return { x: column * cellSize, y: row * cellSize }
    })
    const blueGrid = new Grid(p5, Math.floor(canvasSize.width / cellSize), Math.floor(canvasSize.height / cellSize), (column, row) => {
        return { x: column * cellSize, y: row * cellSize }
    });
    const spreadPoints = randomSample(p5, 20, canvasSize.width - 150, canvasSize.height - 150).map(({x, y}) => {
        return { x: x + 75, y: y + 75 }
    })
    const radii = spreadPoints.map((point, index) => Math.abs(p5.noise(index)) * 200);
    const outsidePositions = [];
    const insidePositions = [];
    
    redGrid.traverse((column, row, from) => {
        const distances = spreadPoints.map((to) => p5.dist(to.x, to.y, from.x, from.y))
        const isOutside = distances.every((distance, index) => distance > radii[index])
        if (isOutside) {
            outsidePositions.push({ column, row })
        } else {
            insidePositions.push({ column, row })
        }
    })
    
    insidePositions.forEach(({ column, row }) => {
        const insidePoint = redGrid.at(column, row);
        const distancesToOutside = outsidePositions.map(({ column, row }) => {
            const outsidePoint = redGrid.at(column, row);
            return p5.dist(outsidePoint.x, outsidePoint.y, insidePoint.x, insidePoint.y)
        })
        const distancesToSpreadPoints = spreadPoints.map((spreadPoints) => {
            return p5.dist(spreadPoints.x, spreadPoints.y, insidePoint.x, insidePoint.y)
        })
        
        const minToOutside = Math.min.apply(undefined, distancesToOutside);
        const toSpreadPoint = Math.min.apply(undefined, distancesToSpreadPoints);
        const spreadPointIndex = distancesToSpreadPoints.indexOf(toSpreadPoint);
        const spreadPoint = spreadPoints[spreadPointIndex];
        const radius = radii[spreadPointIndex]
        const index = distancesToOutside.indexOf(minToOutside);
        const closestOutside = redGrid.at(outsidePositions[index].column, outsidePositions[index].row)
        const direction = p5.createVector(closestOutside.x - spreadPoint.x, closestOutside.y - spreadPoint.y);
        direction.setMag(direction.mag() / toSpreadPoint * 10)
        direction.add(p5.createVector(insidePoint.x - spreadPoint.x, insidePoint.y - spreadPoint.y));
        insidePoint.x = direction.x + spreadPoint.x
        insidePoint.y = direction.y + spreadPoint.y
    })

    window.spreadPoints = spreadPoints

    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.background(255);
        p5.noFill();
        window.save = (name) => p5.save(name)
    }
    
    p5.draw = () => {
        /*p5.push();
        p5.stroke('#00ffff88')
        p5.scale(0.99)
        p5.translate(canvasSize.width * 0.005, canvasSize.height * 0.005)
        blueGrid.forEach((columns) => {
            p5.beginShape();
            columns.forEach(({ x, y }, index) => {
                if (index === 0 || index === columns.length - 1) {
                    p5.curveVertex(x, y)
                }
                p5.curveVertex(x, y)
            })
            p5.endShape();
        })
        const blueTransposed = blueGrid.getTransposed();
        blueTransposed.forEach((columns) => {
            p5.beginShape();
            columns.forEach(({ x, y }, index) => {
                if (index === 0 || index === columns.length - 1) {
                    p5.curveVertex(x, y)
                }
                p5.curveVertex(x, y)
            })
            p5.endShape();
        })
        p5.pop();*/
        
        // p5.stroke('#0000ff');
        // p5.strokeWeight(6);
        // spreadPoints.forEach(({ x, y }) => {
        //     p5.point(x, y)
        // })
        
        // p5.strokeWeight(3)
        // p5.stroke('#ff0000')
        // grid.traverse((column, row, { x, y }) => {
        //     p5.point(x, y);
        // })
    
        p5.push();
        p5.strokeWeight(1)
        p5.stroke('#ed225dbb')
        redGrid.forEach((columns) => {
            p5.beginShape();
            columns.forEach(({ x, y }, index) => {
                if (index === 0 || index === columns.length - 1) {
                    p5.curveVertex(x, y)
                }
                p5.curveVertex(x, y)
            })
            p5.endShape();
        })
        
        const redTransposed = redGrid.getTransposed();
        redTransposed.forEach((columns) => {
            p5.beginShape();
            columns.forEach(({ x, y }, index) => {
                if (index === 0 || index === columns.length - 1) {
                    p5.curveVertex(x, y)
                }
                p5.curveVertex(x, y)
            })
            p5.endShape();
        })
        p5.pop();
        
        // p5.strokeWeight(4)
        // p5.stroke('#00ff00')
        // insidePositions.forEach(({ column, row }) => {
        //     const point = grid.at(column, row);
        //     p5.point(point.x, point.y);
        // })
        
        p5.noLoop();
    }
}, document.querySelector('main'));
