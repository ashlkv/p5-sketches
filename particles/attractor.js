export function Attractor(p5, position) {
    this.power = 150;
    this.position = position instanceof P5.Vector ? position : new p5.createVector(position.x, position.y);
    
    this.display = (fill = 127) => {
        p5.stroke(255);
        p5.strokeWeight(2);
        p5.fill(fill);
        p5.ellipse(this.position.x, this.position.y, 32, 32);
    }
    
    this.attract = (particle) => {
        // let dir = P5.Vector.sub(this.position, particle.position); // Calculate direction of force
        // let d = dir.mag(); // Distance between objects
        // dir.normalize(); // Normalize vector (distance doesn't matter here, we just want this vector for direction)
        // d = p5.constrain(d, 1, 100); // Keep distance within a reasonable range
        // // let force = -1 * this.power * (d * d); // Repelling force is inversely proportional to distance
        // let force = -1 * this.power * (d * d); // Repelling force is inversely proportional to distance
        // dir.mult(force); // Get force vector --> magnitude * direction
        // return dir;
        
        let force = P5.Vector.sub(this.position, particle.position);
        let distanceSq = p5.constrain(force.magSq(), 100, 1000);
        let G = 25;
        let strength = G / distanceSq;
        force.setMag(strength);
        return force;
    }
}
