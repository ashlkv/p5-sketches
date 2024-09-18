export function Curve(p5, { flowField, repellers = [], start, steps, step = 10, darkMode = false }) {
    this.vertices = [start];
    for (let i = 0; i < steps; i++) {
        const vertex = this.vertices[i];
        const value = flowField.getWeightedAverageAt(vertex);
        if (value === undefined) {
            break;
        }
        let flow = P5.Vector.fromAngle(value, step)
        const nextVertex = {x: vertex.x + flow.x, y: vertex.y + flow.y}
        if (repellers.length > 0) {
            for (const repeller of repellers) {
                flow = repeller.repel(nextVertex, flow);
            }
        }
        // const vector = p5.createVector(vertex.x, vertex.y);
        // vector.add(flow)
        this.vertices.push({x: vertex.x + flow.x, y: vertex.y + flow.y})
    }
    
    this.render = (color = '#000000') => {
        p5.strokeWeight(1)
        // p5.stroke(244, 85, 49, 100);
        p5.stroke(color);
        p5.fill(0, 0)
        p5.beginShape();
        const length = this.vertices.length;
        this.vertices.forEach(({x, y}, index) => {
            p5.curveVertex(x, y);
            if (index === 0 || index === length - 1) {
                // First and last vertices are curve control points, so we are repeating them to get anchor points.
                p5.curveVertex(x, y);
            }
        })
        p5.endShape();
    }
    
    this.renderVertices = () => {
        // Dots at vertices
        p5.strokeWeight(3)
        p5.stroke(0, 0, 0, 255);
        this.vertices.forEach(({x, y}) => {
            p5.point(x, y)
        })
    }
    
    this.renderStartingVertex = () => {
        p5.strokeWeight(5)
        p5.stroke(255, 0, 0, 255);
        p5.point(this.vertices[0].x, this.vertices[0].y)
    }
}
