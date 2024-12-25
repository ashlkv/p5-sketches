import {
    changePolygonStart,
    getCenter,
    getPolygonLines,
    getFacingSides,
    isClockwise,
    movePolygon, rotatePolygon, getTouchingSide, scalePolygon, getOverlappingPolygonUnion, isPointInPolygon
} from "../common/geometry.js";
import {getAdjacentPolygonUnion} from "../common/union.js";
import {FlowField} from "../common/flow-field.js";
import {Grid} from "../common/grid.js";

window.P5 = p5;

new p5((p5) => {
    const canvasSize = {width: window.innerHeight * 1.42, height: window.innerHeight};
    const cellSize = 8;
    const grid1 = new Grid(p5, Math.floor(canvasSize.width / cellSize), Math.floor(canvasSize.height / cellSize), (column, row) => {
        return { x: column * cellSize, y: row * cellSize }
    })
    // const seed = 1728315780048
    // const seed = 1735122836931
    const seed = Date.now()
    p5.randomSeed(seed)
    console.log(seed)
    
    p5.voronoiRndSites(20, 20);
    p5.voronoi(canvasSize.width, canvasSize.height, true);
    const cells = p5.voronoiGetCells()
        .map(cell => cell.map(([x, y]) => ({x, y})))
        // Makes all cells clockwise and starting from the leftmost point
        .map((cell) => {
            const clockwise = isClockwise(cell) ? cell : [...cell].reverse();
            const startFromIndex = clockwise.reduce((startFrom, { x }, index, polygon) => {
                const previousX = polygon[startFrom].x;
                return x < previousX ? index : startFrom;
            }, 0)
            return changePolygonStart(clockwise, startFromIndex);
        })
        // Removes cells bordering on the edge
        // .filter((cell) => {
        //     return !cell.find(({ x, y }) => x === 0 || y === 0 || x === canvasSize.width || y === canvasSize.height)
        // })

    // Sorts cells so that cells at the bottom (closer to the viewer) go last and are rendered "on top"
    cells.sort((first, second) => {
        const y1 = Math.min.apply(undefined, first.map(({ y }) => y));
        const y2 = Math.min.apply(undefined, second.map(({ y }) => y));
        return y1 - y2;
    });
    
    window.p5 = p5;
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.background(255);
        p5.frameRate(10)
        window.save = (name) => p5.save(name)
    }
    
    p5.draw = () => {
        p5.noFill()
        
        const threshold = 0.65;
        
        // cells.forEach((cell) => {
        //     const center = getCenter(cell)
        //     p5.beginShape()
        //     cell.forEach(({ x, y }, index, cell) => {
        //         if (index === 0 || index === cell.length - 1) {
        //             p5.vertex(x, y);
        //         }
        //         p5.vertex(x, y)
        //     })
        //     p5.endShape(p5.CLOSE)
        // })
            
        
        grid1.traverse((column, row, { x, y }) => {
            const index = cells.findIndex((cell) => isPointInPolygon({x, y}, cell)); 
            // cmyk
            p5.strokeWeight(3)
            if (index) {
                p5.stroke('#ff00ff80')
                p5.point(x + index * 5, y + index * 5);
                p5.point(x + index * 10, y + index * 10);
                p5.stroke('#ffff0080')
                p5.point(x + index * 20, y + index * 20);
            } else {
                p5.stroke('#ff00ff80')
                p5.point(x, y);
                p5.stroke('#00ffff80')
                p5.point(x + 2, y + 2);
            }
            
            // circles
           /* p5.strokeWeight(1);
            p5.noFill();
            if (index) {
                p5.stroke('#ff00ff80')
                p5.circle(x + index * 5, y + index * 5, 5);
                p5.stroke('#00ffff80')
                p5.circle(x + index * 5 + 5, y + index * 5 + 5, 5);
                p5.stroke('#ffff0080')
                p5.circle(x + index * 5 + 10, y + index * 5 + 10, 5);
                // p5.stroke('#ff00ff80')
                // p5.circle(x + index * 20 + 5, y + index * 20 + 5, 5);
            } else {
                p5.stroke('#ff00ff80')
                p5.circle(x, y, 5);
                p5.stroke('#00ffff80')
                p5.circle(x + 2.5, y + 2.5, 5);
                p5.stroke('#ffff0080')
                p5.circle(x + 5, y + 5, 5);
            }*/
    
            // monochrome
            /*p5.strokeWeight(3)
            p5.stroke(0)
            if (index) {
                p5.point(x + index * 5, y + index * 5);
                p5.point(x + index * 10, y + index * 10);
                p5.point(x + index * 20, y + index * 20);
            } else {
                p5.point(x, y);
                p5.point(x + 2, y + 2);
            }*/
        })
        
        p5.noLoop()
    }
}, document.querySelector('main'));
