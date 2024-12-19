export function Repeller(p5, position) {
    this.power = 150;
    this.position = position;
    
    this.display = (fill = 127) => {
        p5.fill(fill);
        p5.ellipse(this.position.x, this.position.y, 32, 32);
    }
    
    this.repel = (particle) => {
        let dir = P5.Vector.sub(this.position, particle.position); // Calculate direction of force
        let d = dir.mag(); // Distance between objects
        dir.normalize(); // Normalize vector (distance doesn't matter here, we just want this vector for direction)
        d = p5.constrain(d, 1, 100); // Keep distance within a reasonable range
        let force = -1 * this.power / (d * d); // Repelling force is inversely proportional to distance
        dir.mult(force); // Get force vector --> magnitude * direction
        return dir;
    }
}
