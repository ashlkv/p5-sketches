import {getCenter, getIntersectingLines, getRange} from "./intersection.js";
import {FlowField} from "./flow-field.js";


window.P5 = p5;

const anchorSample = (p5, count, anchor, width, height) => {
    return Array(count).fill().map(() => ({x: Math.round(p5.random(0, width - 1) + anchor.x - width / 2), y: Math.round(p5.random(0, height - 1) + anchor.y - height / 2) }))
}

const randomSample = function(p5, count, width, height) {
  return Array(count).fill().map(() => ({x: Math.round(p5.random(0, width - 1)), y: Math.round(p5.random(0, height - 1)) }))
}

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const cellSize = 20;
    const noiseIncrement = 0.01;
    
    // const polygon = [{ x: 60, y: 50 }, { x: 560, y: 50 }, { x: 560, y: 550 }, { x: 60, y: 550 }];
    p5.voronoiRndSites(50, 70);
    p5.voronoi(width, height);
    const cells = p5.voronoiGetCells().map(cell => cell.map(([x, y]) => ({x, y})));
    
    const getSlightNoiseValue = (column, row) => {
                const main = 0;
                const range = p5.PI;
                const variation = p5.noise(column * noiseIncrement, row * noiseIncrement) * range;
                return main - range / 2 + variation
            }
    const flowField1 = new FlowField(p5, {width: Math.round(width / cellSize), height: Math.round(height / cellSize), noiseIncrement, cellSize, initialize: getSlightNoiseValue})
    const flowField2 = new FlowField(p5, {width: Math.round(width / cellSize), height: Math.round(height / cellSize), noiseIncrement, cellSize, initialize: getSlightNoiseValue})
    
    window.flowField1 = flowField1
    window.flowField2 = flowField2
    window.cells = cells
    
    // const lines = [
    //     [{ x: 10, y: 10 }, { x: 590, y: 590 }]
    // ]
    // const origins = randomSample(p5, 500, 1, height)
    // const origins = Array(700).fill().map(() => ({x: 0, y: Math.round(p5.random(-height * 0.5, height * 1.5)) }))
    
    p5.setup = () => {
        p5.createCanvas(width, height, p5.SVG);
        p5.background(255);
        window.save = (name) => p5.save(name)
    }
    
    p5.draw = () => {
        p5.background(255);
        
        // flowField.render();
        
        // Render cells
        /*for (const cell of cells) {
            p5.beginShape();
            for (const { x, y } of cell)  {
                p5.vertex(x, y)
            }
            p5.endShape(p5.CLOSE);
        }*/
        
        // const lines = origins.map(({x, y}) => [{ x, y }, { x: width, y }])
        for (const cell of cells) {
            p5.beginShape();
            for (const point of cell) {
                p5.vertex(point.x, point.y);
            }
            p5.endShape();
            
            const center = getCenter(cell);
            const minY = p5.min(cell.map(({ y }) => y))
            const maxY = p5.max(cell.map(({ y }) => y))
            const minX = p5.min(cell.map(({ x }) => x))
            // const range = getRange(Math.round(minY), Math.round(maxY)).filter((value, index) => index % 4 === 0);
            const range = []
            let noiseOffset = 0;
            for (let index = minY; index < maxY; index = index + p5.noise(noiseOffset, noiseOffset) * 5) {
                noiseOffset += noiseIncrement;
                range.push(index)
            }
            
            /*let noiseOffset = 0;
            const increment = 1;
            for (let index = minY; index < maxY; index = index + flowField2.getValueAt({x: noiseOffset, y: noiseOffset}) * 4) {
                noiseOffset += increment;
                range.push(index)
            }*/
            // const range = getRange(Math.round(minY), Math.round(maxY)).filter((value, index) => index % 4 === 0);
            const origins = range.reduce((origins, y) => {
                const point = { x: minX, y };
                // if (flowField2.getValueAt(point) > 0) {
                    origins.push(point)
                // }
                return origins;
            }, []);
            
            const angle = flowField1.getValueAt(center);
            const vector = P5.Vector.fromAngle(angle, width * 1.5)
            const lines = origins.map(({x, y}) => {
                return [{ x, y }, { x: vector.x, y: y + vector.y }]
            })
            const hatch = getIntersectingLines(p5, lines, cell)
            for (const section of hatch) {
                p5.strokeWeight(1)
                p5.stroke(0, 0, 0, 255)
                const [start, end] = section;
                p5.line(start.x, start.y, end.x, end.y)
            }
            
            // p5.strokeWeight(3)
            // p5.stroke(255, 0, 0)
            // p5.point(center.x, center.y)
        }
        p5.noLoop()
    }
}, document.querySelector('main'));
