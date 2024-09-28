export function Attractor(p5, position, velocity, mass) {
    this.position = position;
    this.velocity = velocity;
    // this.velocity.mult(0.01)
    this.acceleration = new P5.Vector(0, 0);
    this.mass = mass;
    this.vertices = []
    
    this.applyForce = (force) => {
        let acceleration = P5.Vector.div(force, this.mass);
        this.acceleration.add(acceleration);
    }
    
    this.update = () => {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.acceleration.set(0, 0);
    }
    
    this.render = () => {
        p5.beginShape();
        for (const {x, y} of this.vertices) {
            p5.curveVertex(x, y)
        }
        p5.endShape();
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



