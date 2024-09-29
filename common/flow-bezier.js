export function FlowBezier(p5, { flowField, start, steps, step = 10, handle = 50 }) {
    this.vertices = [start];
    this.points = []
    for (let index = 0; index < steps; index++) {
        const anchor = this.vertices[index];
        const vector = p5.createVector(anchor.x, anchor.y);
        const angle = flowField.getWeightedAverageAt(anchor);
        if (angle === undefined) {
            break;
        }
        const force = P5.Vector.fromAngle(angle, step)
        vector.add(force)
        const vertex = {x: vector.x, y: vector.y}
        this.vertices.push(vertex);
        // even: control point looks forward
        // odd: control point looks back
        const handleVector1 = P5.Vector.fromAngle(angle - p5.PI, handle);
        const handleVector2 = P5.Vector.fromAngle(angle, handle);
        const controlVector1 = p5.createVector(anchor.x, anchor.y).add(handleVector1)
        const controlVector2 = p5.createVector(anchor.x, anchor.y).add(handleVector2)
        const control1 = { x: controlVector1.x, y: controlVector1.y }
        const control2 = { x: controlVector2.x, y: controlVector2.y }
        this.points.push({ anchor, control1, control2 })
    }
    this.segments = this.points.reduce((segments, { control1: control2, anchor: anchor2 }, index, points) => {
        if (index === 0) {
            return segments;
        }
        const {anchor: anchor1, control2: control1} = points[index - 1];
        segments.push({ anchor1, anchor2, control1, control2 })
        return segments
    }, [])
    
    this.getAngleAt = (index) => {
        if (index < 0 || index > this.vertices.length - 1) {
            throw 'Index out of bounds when getting bezier angle';
        }
        const anchor = this.vertices[index];
        return flowField.getWeightedAverageAt(anchor)
    }
    
    this.renderAnchors = () => {
        p5.push();
        p5.strokeWeight(3)
        p5.stroke(0, 0, 0, 255);
        this.segments.forEach(({anchor1, anchor2}) => {
            p5.point(anchor1.x, anchor1.y)
            p5.point(anchor2.x, anchor2.y)
        })
        p5.pop();
    }
    
    this.renderHandles = () => {
        p5.push();
        this.segments.forEach(({ control1, control2, anchor1, anchor2}) => {
            p5.stroke(0, 0, 255, 255);
            p5.strokeWeight(1)
            p5.line(control1.x, control1.y, anchor1.x, anchor1.y)
            p5.line(control2.x, control2.y, anchor2.x, anchor2.y)
            
            p5.strokeWeight(5)
            p5.point(control1.x, control1.y)
            p5.point(control2.x, control2.y)
        })
        p5.pop();
    }
    
    this.renderStart = () => {
        p5.push();
        p5.strokeWeight(5)
        p5.stroke(255, 0, 0, 255);
        p5.point(this.vertices[0].x, this.vertices[0].y)
        p5.pop();
    }
}
