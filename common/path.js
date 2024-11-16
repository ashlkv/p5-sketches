export function Path(p5, vertices = []) {
    this.vertices = vertices;
    this.reverse = () => this.vertices.reverse();
    this.getAngleAt = (point) => {
        const distances = this.vertices.map(({ x, y }) => p5.dist(x, y, point.x, point.y));
        const min = Math.min(...distances);
        const index = distances.indexOf(min)
        if (index === this.vertices.length - 1) {
            return undefined
        } else {
            const closest = this.vertices[index];
            const next = this.vertices[index + 1];
            const previous = this.vertices[index - 1];
            const vector1 = p5.createVector(next.x - closest.x, next.y - closest.y);
            if (previous) {
                const distance = p5.dist(previous.x, previous.y, next.x, next.y);
                const vector2 = p5.createVector(closest.x - previous.x, closest.y - previous.y);
                const bias = p5.dist(point.x, point.y, next.x, next.y) / distance;
                return vector1.heading() + vector1.angleBetween(vector2) * bias;
            } else {
                return vector1.heading();
            }
            
        }
    }
}
