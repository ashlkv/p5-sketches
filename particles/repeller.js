export function Repeller(p5, position) {
    this.power = 150;
    this.position = position;
    
    this.display = (color = '#00ff0099') => {
        p5.stroke(color);
        p5.strokeWeight(5);
        p5.point(this.position.x, this.position.y)
    }
    
    this.repel = (particle) => {
        let direction = P5.Vector.sub(this.position, particle.position); // Calculate direction of force
        let magnitude = direction.mag(); // Distance between objects
        direction.normalize(); // Normalize vector (distance doesn't matter here, we just want this vector for direction)
        magnitude = p5.constrain(magnitude, 1, 100); // Keep distance within a reasonable range
        let force = -1 * this.power / (magnitude * magnitude); // Repelling force is inversely proportional to distance
        direction.mult(force); // Get force vector --> magnitude * direction
        return direction;
    }
}
