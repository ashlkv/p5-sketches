import {FlowField} from "./flow-field.js";

export function Spiral(p5, {path, steps = 100, step = 5, radius = 20, frequency = 0.63, noiseMax = 1}) {
    const start = path.vertices[0];
    const end = path.vertices.at(-1);
    const previous = path.vertices.at(-2)
    const endVector = p5.createVector(end.x - previous.x, end.y - previous.y);
    const factor = Math.round(p5.TWO_PI / frequency);
    const delta = step / factor
    const polar = P5.Vector.fromAngle(0, radius);
    let center = start;
    this.vertices = [];
    const flowField = new FlowField(p5, { width: Math.min(steps, 1000) * factor, height: 1, initialize: (column, row) => p5.noise(column, row) })
    
    this.addVertex = (index) => {
        const angle = index * frequency;
        const xOffset = p5.map(p5.cos(angle), -1, 1, 0, noiseMax);
        const yOffset = p5.map(p5.sin(angle), -1, 1, 0, noiseMax);
        const radiusNoise = p5.noise(xOffset, yOffset);
        const deltaNoise = flowField.get( {column: index, row: 0 } );
        
        polar.setHeading(angle);
        polar.setMag(p5.map(radiusNoise, 0, 1, radius, radius * 2))
        const direction = P5.Vector.fromAngle(path.getAngleAt(center), delta * deltaNoise)
        this.vertices.push({x: center.x + polar.x, y: center.y + polar.y})
        center = {x: center.x + direction.x, y: center.y + direction.y};
    }
    
    if (steps === Infinity) {
        let index = 0;
        while (index < 4000/* && p5.createVector(end.x - center.x, end.y - center.y).heading()*/) {
            this.addVertex(index);
            index ++;
        }
    } else {
        for (let index = 0; index < steps * factor; index++) {
            this.addVertex(index);
        }
    }
}
