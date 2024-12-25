import { Particle } from './vector-particle.js'

export function Emitter(p5, position, speed = 1, color = 0, ranges = [[0, Math.PI], [Math.PI, Math.PI * 2]]) {
    this.position = position.copy();
    this.particles = [];
    /* Speed in particles per frame */
    this.speed = speed;
    this.color = color;
    
    this.display = (fill = 127) => {
        p5.stroke('#0000ff99');
        p5.strokeWeight(5);
        p5.fill(fill);
        p5.point(this.position.x, this.position.y)
    }
    
    this.addParticle = (x, y) => {
        const position = x !== undefined && y !== undefined ? p5.createVector(x, y) : this.position;
        const particle = new Particle(p5, position, color, ranges);
        this.particles.push(particle);
    }
    
    this.run = (x, y) => {
        const frequency = Math.round(1 / this.speed);
        if (p5.frameCount % frequency === 0) {
            this.addParticle(x, y)
        }
        // Run every particle
        // ES6 for..of loop
        for (let particle of this.particles) {
            particle.run();
        }
        
        // Filter removes any elements of the array that do not pass the test
        this.particles = this.particles.filter(particle => !particle.isDead());
    }
    
    // A function to apply a force to all Particles
    this.applyForce = (force) => {
        for (let particle of this.particles) {
            particle.applyForce(force);
        }
    }
    
    this.applyRepeller = (repeller) => {
        for (let particle of this.particles) {
            let force = repeller.repel(particle);
            particle.applyForce(force);
        }
    }
    
    this.applyAttractor = (attractor) => {
        for (let particle of this.particles) {
            let force = attractor.attract(particle);
            particle.applyForce(force);
        }
    }
    
}
