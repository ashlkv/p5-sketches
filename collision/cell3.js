import {
    changePolygonStart,
    getCenter,
    getPolygonLines,
    getFacingSides,
    isClockwise,
    movePolygon
} from "../common/geometry.js";
import {FlowField} from "../common/flow-field.js";

window.P5 = p5;

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    p5.voronoiRndSites(100, 100);
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
    
    /*const cells = [[
        {"x": 275.6875, "y": 349.5},
        {"x": 302.64777000168147, "y": 391.1561379158044},
        {"x": 315.9323181049069, "y": 413.8917089678511},
        {"x": 339.82730087051624, "y": 388.5967263657679},
        {"x": 366.0958549222798, "y": 367.9974093264249},
        {"x": 336.5, "y": 349.5},
        {"x": 332.08444303396516, "y": 351.0520443406211},
        {"x": 311.84899704709153, "y": 346.78375006769437}
    ]]*/
    
    /*const cells = [[
        {"x": 250, "y": 400},
        {"x": 275, "y": 356.69872981077807},
        {"x": 325, "y": 356.69872981077807},
        {"x": 350, "y": 400},
        {"x": 325, "y": 443.30127018922193},
        {"x": 275, "y": 443.30127018922193}
      ]];*/
    
    let noiseOffset = 0.05;
    const cellSize = 10;
    const flowField = new FlowField(p5, {
        width: Math.round(canvasSize.width / cellSize),
        height: Math.round(canvasSize.height / cellSize),
        cellSize
    })
    window.p5 = p5;
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        p5.background(255);
        p5.frameRate(10)
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
        const up = false
        cells.forEach((cell, index) => {
            const center = getCenter(cell);
            const cellId = p5.voronoiGetSite(center.x, center.y);
            const noise = p5.noise(center.x, center.y, p5.frameCount * noiseOffset);
            const rate = flowField.getValueAtPoint(center);
            p5.push()
            p5.translate(center.x, center.y)
            if ((up && rate > 0) || (!up && rate < 0)) {
                offsets[cellId] = (offsets[cellId] ?? 0) + rate * 5 * -1
                p5.rotate(noise / 10)
                // scales[cellId] = (scales[cellId] ?? 1) - Math.abs(noise) / p5.map(index, 0, cells.length - 1, 100, 200)
                // p5.scale(1, scales[cellId])
                p5.translate(0, offsets[cellId])
                const lines = getPolygonLines(cell);
                const facingSides = getFacingSides(p5, lines, up);
                const visibleSides = facingSides.filter((side) => {
                    const neighbors = getNeighbors(cellId)
                    // find neighbor on that side
                    // if neighbor offset is less than its own offset, render the line
                    const neighborId = getNeighborIdOnSide(cellId, side);
                    const neighborOffset = offsets[neighborId];
                    return up ? neighborOffset < offsets[cellId] : neighborOffset > offsets[cellId];
                })
                if (visibleSides.length > 0) {
                    const relativeSides = visibleSides.map(line => movePolygon(line, {x: -center.x, y: -center.y}))
                    relativeSides.forEach(([{x: x1, y: y1}, {x: x2, y: y2}]) => {
                        p5.line(x1, y1, x2, y2)
                    })
                }
                const relative = movePolygon(cell, {x: -center.x, y: -center.y})
                p5.beginShape()
                relative.forEach(({ x, y }, index, vertices) => {
                    p5.vertex(x, y)
                })
                p5.endShape(p5.CLOSE)
            } else {
                const relative = movePolygon(cell, {x: -center.x, y: -center.y})
                p5.beginShape()
                relative.forEach(({ x, y }, index, vertices) => {
                    p5.vertex(x, y)
                    if (index === 0 || index === vertices.length - 1) {
                        p5.vertex(x, y)
                    }
                })
                p5.endShape(p5.CLOSE)
            }
            p5.pop()
        })
        
        // p5.noLoop()
    }
}, document.querySelector('main'));
