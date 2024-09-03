function BezierCurve(p5, { flowField, start, steps, step = 10, handle = 50 }) {
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
}

BezierCurve.fromVertices = (p5, {vertices = [], handle = 50}) => {
    if (vertices.length === 0) {
        throw 'At least one vertex required for a bezier curve';
    }
    const bezier = new BezierCurve(p5, { flowField: undefined, start: vertices[0], steps: 0, handle })
    if (vertices.length === 1) {
        return bezier;
    }
    for (let index = 0; index < vertices.length; index++) {
        const anchor = vertices[index]
        const nextVertex = vertices[index + 1]
        const vector = p5.createVector(anchor.x, anchor.y);
        const nextVector = p5.createVector(nextVertex.x, nextVertex.y)
        if (nextVector) {
            const angle = nextVector.sub(vector).heading();
            const handleVector1 = P5.Vector.fromAngle(angle - p5.PI, bezier.handle);
            const handleVector2 = P5.Vector.fromAngle(angle, bezier.handle);
            const controlVector1 = p5.createVector(anchor.x, anchor.y).add(handleVector1)
            const controlVector2 = p5.createVector(anchor.x, anchor.y).add(handleVector2)
            const control1 = { x: controlVector1.x, y: controlVector1.y }
            const control2 = { x: controlVector2.x, y: controlVector2.y }
            bezier.points.push({ anchor, control1, control2 })
        } else {
            // FIXME Determine the anchor of the last control point
            bezier.points.push({ anchor, control1: anchor, control2: anchor })
        }
    }
    bezier.segments = bezier.points.reduce((segments, { control1: control2, anchor: anchor2 }, index, points) => {
        if (index === 0) {
            return segments;
        }
        const {anchor: anchor1, control2: control1} = points[index - 1];
        segments.push({ anchor1, anchor2, control1, control2 })
        return segments
    }, [])
}


/** Simple curve or spline */
function Curve(p5, { flowField, start, steps, step = 10 }) {
    this.vertices = [start];
    for (let i = 0; i < steps; i++) {
        const point = this.vertices[i];
        const vector = p5.createVector(point.x, point.y);
        const value = flowField.getWeightedAverageAt(point);
        if (value === undefined) {
            break;
        }
        const force = P5.Vector.fromAngle(value, step)
        vector.add(force)
        const vertex = {x: vector.x, y: vector.y};
        this.vertices.push(vertex)
    }
}

