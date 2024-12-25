export function Attractor(p5, position, power = 150, oneway = true) {
    this.power = power;
    this.position = position instanceof P5.Vector ? position : new p5.createVector(position.x, position.y);
    /** Attracts only the particles which move to its direction */
    this.oneway = oneway;
    
    this.display = (fill = 127) => {
        p5.stroke('#ff000099');
        p5.strokeWeight(5);
        p5.fill(fill);
        p5.point(this.position.x, this.position.y)
    }
    
    this.attract = (particle) => {
        // let dir = P5.Vector.sub(this.position, particle.position); // Calculate direction of force
        // let d = dir.mag(); // Distance between objects
        // dir.normalize(); // Normalize vector (distance doesn't matter here, we just want this vector for direction)
        // d = p5.constrain(d, 1, 100); // Keep distance within a reasonable range
        // // let force = -1 * this.power * (d * d); // Repelling force is inversely proportional to distance
        // let force = this.power * (d * d); // Repelling force is inversely proportional to distance
        // dir.mult(force); // Get force vector --> magnitude * direction
        // return dir;
        
        let force = P5.Vector.sub(this.position, particle.position);
        let distanceSq = p5.constrain(force.magSq(), 100, 1000);
        let G = this.power;
        let strength = G / distanceSq;
        force.setMag(strength);
        return force;
    
        /*
        const isTowards = this.position.dist(P5.Vector.add(particle.position, particle.velocity)) < this.position.dist(particle.position);
        
        let direction = P5.Vector.sub(this.position, particle.position);
        direction.normalize();
        // if (!isTowards && this.oneway) {
        //     direction.setMag(direction.mag() + p5.PI);
        // }
        direction.mult(0.2);
        particle.acceleration = direction;
        particle.velocity.add(direction);
        // particle.velocity.limit(10);
        */
        
        particle.position.add(this.velocity);
    }
}
