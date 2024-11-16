import {
    changePolygonStart,
    getCenter,
    getPolygonLines,
    getFacingSides,
    isClockwise,
    movePolygon, rotatePolygon, getTouchingSide, scalePolygon, getOverlappingPolygonUnion
} from "../common/geometry.js";
import {getAdjacentPolygonUnion} from "../common/union.js";
import {FlowField} from "../common/flow-field.js";

window.P5 = p5;

new p5((p5) => {
    const seeds = [1728315651592, 1728315780048]
    const seed = /*Date.now()*/ 1728315780048
    p5.noiseSeed(seed)
    console.log(seed)
    
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    p5.voronoiRndSites(640, 480);
    p5.voronoiJitterStepMax(50);
    p5.voronoiJitterStepMin(20);
    p5.voronoiJitterFactor(5);
    p5.voronoi(canvasSize.width, canvasSize.height, true);
    const cells = p5.voronoiGetCellsJitter()
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
        .filter((cell) => {
            return !cell.find(({ x, y }) => x === 0 || y === 0 || x === canvasSize.width || y === canvasSize.height)
        })

    // Sorts cells so that cells at the bottom (closer to the viewer) go last and are rendered "on top"
    cells.sort((first, second) => {
        const y1 = Math.min.apply(undefined, first.map(({ y }) => y));
        const y2 = Math.min.apply(undefined, second.map(({ y }) => y));
        return y1 - y2;
    });
    
    // p5.noiseDetail(5)
    let noiseOffset = 0.05;
    const cellSize = 2;
    const flowField = new FlowField(p5, {
        width: Math.round(canvasSize.width / cellSize),
        height: Math.round(canvasSize.height / cellSize),
        cellSize
    })
    window.p5 = p5;
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.background(255);
        p5.frameRate(10)
        window.save = (name) => p5.save(name)
    }
    
    // Dictionary with cell id as key and cell as value
    const dictionary = cells.reduce((dictionary, cell) => {
        const center = getCenter(cell);
        const cellId = p5.voronoiGetSite(center.x, center.y);
        dictionary[cellId] = cell;
        return dictionary;
    }, {})
    
    // Dictionary with cell id as key and cell neighbor ids as values
    const neighbors = cells.reduce((neighbors, cell) => {
        const center = getCenter(cell);
        const cellId = p5.voronoiGetSite(center.x, center.y);
        neighbors[cellId] = p5.voronoiNeighbors(cellId);
        return neighbors;
    }, {})
    
    const getNeighbors = (cellId) => {
        return neighbors[cellId].map(neighborId => dictionary[neighborId])
    }
    const getNeighborIdOnSide = (cellId, side) => {
        const neighborIds = neighbors[cellId];
        // Neighboring side has opposite direction
        const [start1, end1] = [...side].reverse();
        const threshold = 2
        const hasMatchingSide = (end2, index, vertices) => {
            const start2 = index === 0 ? vertices[vertices.length - 1] : vertices[index - 1];
            return Math.abs(start1.x - start2.x) < threshold &&
                Math.abs(start1.y - start2.y) < threshold &&
                Math.abs(end1.x - end2.x) < threshold &&
                Math.abs(end1.y - end2.y) < threshold;
        }
        return neighborIds.find(neighborId => {
            const neighbor = dictionary[neighborId];
            // Neighbor may be missing, because the cells bordering on the canvas edge were removed.
            return neighbor?.find(hasMatchingSide)
        })
    }
    
    // Cell offsets which are increasing with each iteration
    const offsets = {}
    // Cell scales which are increasing with each iteration
    const scales = {}
    
    p5.draw = () => {
        p5.noFill()
        
        const threshold = 0.65;
        const extrudedCells = cells.filter((cell, index) => {
            const center = getCenter(cell)
            return flowField.getValueAtPoint(center) > threshold
        })
        
        cells.forEach((cell) => {
            const center = getCenter(cell)
            const noise = flowField.getValueAtPoint(center);
            if (noise > threshold) {
                return;
            }
            p5.beginShape()
            cell.forEach(({ x, y }, index, cell) => {
                if (index === 0 || index === cell.length - 1) {
                    p5.curveVertex(x, y);
                }
                p5.curveVertex(x, y)
            })
            p5.endShape(p5.CLOSE)
            
            const iterations = Math.round(p5.map(noise, -1, 1, -2, 8));
            if (iterations <= 0) {
                return;
            }
            p5.beginShape()
            const vertices1 = new Array(iterations).fill(cell).flat()
            vertices1.forEach(({ x, y }, index) => {
                const divider = 3
                if (index % divider === 0) {
                    return
                }
                p5.curveVertex(x, y)
            })
            p5.endShape(p5.CLOSE)
            
            p5.beginShape()
            const iterations2 = Math.round(p5.map(noise, -1, 1, 0, 5));
            const vertices2 = new Array(iterations2).fill(cell).flat()
            vertices2.forEach(({x, y}, index, vertices) => {
                if (index % 3 !== 1) {
                    return;
                }
                p5.curveVertex(x, y)
                const distances = vertices.map(({x: x1, y: y1}) => p5.dist(x, y, x1, y1))
                const max = Math.max(null, ...distances);
                const indexOfMax = distances.indexOf(max);
                const opposite = vertices[indexOfMax]
                if (opposite) {
                    p5.curveVertex(opposite.x, opposite.y)
                }
            })
            p5.endShape(p5.CLOSE)
        })
        
        const groups = [[extrudedCells.pop()]];
        let group = groups[0];
        while (extrudedCells.length > 0) {
            const index = extrudedCells.findIndex(extrudedCell => group.find((cell) => getTouchingSide(extrudedCell, cell)))
            if (index !== -1) {
                const [cell] = extrudedCells.splice(index, 1);
                group.push(cell);
            } else {
                group = [extrudedCells.pop()]
                groups.push(group)
            }
        }
        
        window.groups = groups
        groups.forEach((group) => {
            let union = group.pop();
            if (!union?.length) {
                return;
            }
            while (group.length > 0) {
                const index = group.findIndex((cell) => getTouchingSide(union, cell))
                if (index !== -1) {
                    const [cell] = group.splice(index, 1);
                    union = getAdjacentPolygonUnion(union, cell)
                } else {
                    break;
                }
            }
            
            /*p5.beginShape()
            union.forEach(({x, y}, index, vertices) => {
                if (index % 2 !== 1) {
                    return;
                }
                p5.curveVertex(x, y)
                const distances = vertices.map(({x: x1, y: y1}) => p5.dist(x, y, x1, y1))
                const max = Math.max(null, ...distances);
                const indexOfMax = distances.indexOf(max);
                const opposite = vertices[indexOfMax]
                if (opposite) {
                    p5.curveVertex(opposite.x, opposite.y)
                }
            })
            p5.endShape(p5.CLOSE)*/
            
            p5.beginShape()
            union.forEach(({ x, y }, index, vertices) => {
            p5.curveVertex(x, y)
            const opposite = vertices.find(({x: x1}) => Math.abs(x1 - x) < 25)
                if (opposite) {
                    p5.curveVertex(opposite.x, opposite.y)
                }
            })
            p5.endShape(p5.CLOSE)
            
            p5.beginShape()
            union.forEach(({ x, y }, index, vertices) => {
            p5.curveVertex(x, y)
            const opposite = vertices.find(({y: y1}) => Math.abs(y1 - y) < 25)
                if (opposite) {
                    p5.curveVertex(opposite.x, opposite.y)
                }
            })
            p5.endShape(p5.CLOSE)
            
            /*p5.beginShape()
            union.forEach(({ x, y }, index, cell) => {
                p5.fill(0, 50)
                p5.curveVertex(x, y)
            })
            p5.endShape(p5.CLOSE)*/
        })
        
        p5.noLoop()
    }
}, document.querySelector('main'));
