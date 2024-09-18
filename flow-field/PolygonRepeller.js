export default function PolygonRepeller(p5, polygon, power = 20) {
    this.vertices = polygon;
    this.power = power;
    this.segments = polygon.map(({x: x1, y: y1}, index, polygon) => {
        const { x: x2, y: y2 } = index === polygon.length - 1 ? polygon[0] : polygon[index + 1];
        return [{ x: x1, y: y1 }, {x: x2, y: y2}, { x: x1 + (x2 - x1) / 2, y: y1 + (y2 - y1) / 2 }];
    });
    this.forces = this.segments.map(([from, to]) => {
        const angle = p5.createVector(from.x, from.y).sub(to.x, to.y).heading();
        return P5.Vector.fromAngle(angle + p5.HALF_PI, this.power);
    })
    
    this.getForce = (segment) => {
        const [from, to, center] = segment;
        const angle = p5.createVector(from.x, from.y).sub(to.x, to.y).heading();
        return P5.Vector.fromAngle(angle - p5.HALF_PI, this.power);
    }
    
    this.render = () => {
        p5.push();
        p5.noStroke();
        p5.fill(0, 0, 0, 50);
        p5.beginShape()
        this.vertices.map(({ x, y }) => {
            p5.vertex(x, y)
        })
        p5.endShape()
        p5.pop();
    }
    
    this.renderForces = (color = '#ff0000') => {
        p5.push();
        this.forces.forEach((force, index) => {
            const [, , from] = this.segments[index];
            p5.stroke(color)
            p5.strokeWeight(1)
            const to = { x: from.x + force.x, y: from.y + force.y }
            p5.line(from.x, from.y, to.x, to.y );
            p5.strokeWeight(3)
            p5.point(to.x, to.y)
        })
        p5.pop();
    }
    
    
    
    this.repel = (origin = {x: 0, y: 0}, flow = { x: 0, y: 0 }) => {
        const distances = this.segments.map(([from, to, center]) => Math.abs(p5.dist(origin.x, origin.y, center.x, center.y)))
        const distance = Math.min(...distances);
        const index = distances.indexOf(distance);
        const force = this.forces[index];
        
        const normalizedDistance = p5.constrain(distance, 20, 50);
        if (normalizedDistance < 50) {
            const repulsion = force.copy()
            // Actual repulsion magnitude isn't simply a constant value (power), but a function of power and distance.
            const magnitude = -1 * this.power * 500 / Math.pow(normalizedDistance, 2);
            repulsion.setMag(magnitude)
            return P5.Vector.sub(flow, repulsion);
        } else {
            return flow;
        }
    }
}
