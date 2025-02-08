export function Attractor(p5, position, power = 0.2, oneway = true) {
    // Math.random is unaffected by p5.randomSeed
    this.id = 'attractor' + Math.round(Math.random() * 100000000);
    console.log('attractor id', this.id)
    this.power = power;
    this.position = position instanceof P5.Vector ? position : new p5.createVector(position.x, position.y);
    /** Attracts only the particles which move to its direction */
    this.oneway = oneway;
    
    /** Does not attract if distance is greater than threshold */
    this.threshold = 300;
    
    this.display = (color = '#ff000099') => {
        p5.stroke(color);
        p5.strokeWeight(5);
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
        
        /*let force = P5.Vector.sub(this.position, particle.position);
        let distanceSq = p5.constrain(force.magSq(), 100, 1000);
        let G = this.power;
        let strength = G / distanceSq;
        force.setMag(strength);
        return force;*/
    
        const distance = this.position.dist(particle.position);
        const nextDistance = this.position.dist(P5.Vector.add(particle.position, particle.velocity));
        if (this.oneway && distance < 20) {
            particle[this.id] = true;
        }
        const isTowards = nextDistance <= distance;
        let direction = P5.Vector.sub(this.position, particle.position);
        // if (particle[this.id] && this.oneway) {
        if (!isTowards && this.oneway) {
            let magnitude = direction.mag();
            magnitude = p5.constrain(magnitude, 1, 100);
            direction.mult(-1 * this.power / (magnitude * magnitude));
            particle.acceleration = direction;
            particle.velocity.add(direction);
            particle.position.add(this.velocity);
            particle.velocity.limit(10);
        } else {
            /*
            // Attraction in proportion to distance
            let magnitude = direction.mag();
            if (magnitude > this.threshold) {
                return;
            }
            magnitude = p5.constrain(magnitude, 1, 100);
            direction.mult(this.power / (magnitude * magnitude));
            particle.acceleration = direction;
            particle.velocity.add(direction);
            particle.position.add(this.velocity);
            particle.velocity.limit(10);*/
            
            
            direction.normalize();
            direction.mult(this.power);
            particle.acceleration = direction;
            particle.velocity.add(direction);
            particle.position.add(this.velocity);    
        }
    }
}
