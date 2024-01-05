// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

function Mover(p5, position, velocity, mass) {
    this.position = position;
    this.velocity = velocity;
    // this.velocity.mult(0.01)
    this.acceleration = new P5.Vector(0, 0);
    this.mass = mass;
    this.radius = p5.sqrt(this.mass) * 4;
    
    this.applyForce = (force) => {
        let acceleration = P5.Vector.div(force, this.mass);
        this.acceleration.add(acceleration);
    }
    
    this.update = () => {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
    }
    
    this.show = () => {
        p5.stroke(255, 50);
        p5.strokeWeight(1);
        p5.fill(255, 10);
        p5.ellipse(this.position.x, this.position.y, this.radius * 2);
    }
    
    this.attract = (mover) => {
        let force = P5.Vector.sub(this.position, mover.position);
        let distanceSq = p5.constrain(force.magSq(), 100, 1000);
        let G = 25;
        let strength = G * (this.mass * mover.mass) / distanceSq;
        force.setMag(strength);
        mover.applyForce(force);
    }
}



