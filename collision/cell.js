import {FlowField} from "./flow-field.js";

window.P5 = p5;

export function getCenter(polygon) {
    const x = polygon.reduce((sum, { x }) => sum + x, 0)
    const y = polygon.reduce((sum, { y }) => sum + y, 0)
    return { x: x / polygon.length, y: y / polygon.length }
}

const absoluteToRelative = (position, origin) => {
    return {x: position.x - origin.x, y: position.y - origin.y,}
}
const relativeToAbsolute = (position, origin) => {
    return {x: position.x + origin.x, y: position.y + origin.y,}
}

function getPolygonVariation(p5, polygon, phase, noiseMax) {
    const center = getCenter(polygon);
    const relative = polygon.map(({x, y}) => absoluteToRelative({ x, y }, center))
    const vectors = relative.map(({ x, y }) => p5.createVector(x, y));
    return vectors.map((vector) => {
        const angle = vector.heading();
        const xOffset = p5.map(p5.cos(angle + phase), -1, 1, 0, noiseMax);
        const yOffset = p5.map(p5.sin(angle + phase), -1, 1, 0, noiseMax);
        const radius = p5.map(p5.noise(xOffset, yOffset), 0, 1, 100, 600);
        const x = p5.cos(angle) * radius * (1 + phase);
        const y = p5.sin(angle) * radius * (1 + phase);
        vertices.push({ x, y })
        
        
        return relativeToAbsolute({x: vector.x + offsetNoise.x, y: vector.y + offsetNoise.y}, center)
    })
}

export function getRange(start, end) {
    return new Array(end - start).fill().map((element, index) => start + index)
}

function getLoop(p5, phase, noiseMax) {
    const vertices = [];
    for (let angle = 0; angle < p5.PI * 2; angle += 0.01) {
        const xOffset = p5.map(p5.cos(angle + phase), -1, 1, 0, noiseMax);
        const yOffset = p5.map(p5.sin(angle + phase), -1, 1, 0, noiseMax);
        const radius = p5.map(p5.noise(xOffset, yOffset), 0, 1, 100, 600);
        const x = p5.cos(angle) * radius * (1 + phase);
        const y = p5.sin(angle) * radius * (1 + phase);
        vertices.push({ x, y })
    }
    return vertices;
}


new p5((p5) => {
    const width = 600;
    const height = 600;
    // const cell = [{"x": 185.61682441022742, "y": 291.63377595705606}, {"x": 193.44917407878017, "y": 348.0919631512071}, {"x": 257.99608184588595, "y": 390.04745319982584}, {"x": 275.82427145708584, "y": 391.8388023952096}, {"x": 327.90650092649787, "y": 344.17032118591726}, {"x": 333.12750780205084, "y": 275.717119928667}, {"x": 270.8483237939493, "y": 217.82379394930499}, {"x": 197.33582089552237, "y": 264.6044776119403}]
    p5.voronoiRndSites(50, 70);
    p5.voronoi(width, height);
    // const cells = p5.voronoiGetCells().map(cell => cell.map(([x, y]) => ({x, y}))).filter(cell => cell.every(({x, y}) => x !== 0 && y !== 0 && x !== width && y !== height));
    const cells = [[
        {
            "x": 414.7127659574468,
            "y": 67.20449172576832
        },
        {
            "x": 459.3434704830054,
            "y": 121.7531305903399
        },
        {
            "x": 500.1927138331573,
            "y": 109.79725448785638
        },
        {
            "x": 520.6952927156264,
            "y": 68.27953225085655
        },
        {
            "x": 504.7064411804339,
            "y": 19.343956340115888
        },
        {
            "x": 417.8725793958172,
            "y": 58.690549961270335
        }
    ]]
    
    const cellSize = 20;
    const noiseIncrement = 0.01
    // const flowField = new FlowField(p5, {
    //     width: Math.round(width / cellSize),
    //     height: Math.round(height / cellSize),
    //     noiseIncrement,
    //     cellSize
    // })
    let phase = 0;
    window.cells = cells
    window.noLoop = p5.noLoop.bind(p5)
    
    
    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(255);
        p5.frameRate(2)
        p5.noFill();
    }
    
    p5.draw = () => {
        for (const cell of cells) {
            p5.noiseSeed(Date.now());
            const noiseGrid = new FlowField(p5, {
                width: 10,
                height: 10,
                cellSize: 50,
                initialize: (column, row) => p5.noise(column * noiseIncrement, row * noiseIncrement) * p5.TWO_PI
            });
            const variations = []
            noiseGrid.forEach(({ value }) => {
                const variation = getPolygonVariation(p5, cell, value, { x: 5, y: 5 })
                variations.push(variation);
            })
    
            for (const variation of variations) {
                p5.beginShape();
                for (const point of variation) {
                    p5.vertex(point.x, point.y);
                }
                p5.endShape();
            }
            phase = phase + noiseIncrement;
        }
        p5.noLoop()
    }
}, document.querySelector('main'));
