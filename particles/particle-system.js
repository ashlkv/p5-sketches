import { Particle } from './particle.js'

export function ParticleSystem(p5, position, speed = 1, color = 0) {
    this.position = position.copy();
    this.particles = [];
    /* Speed in particles per frame */
    this.speed = speed;
    this.color = color;
    
    this.addParticle = (x, y) => {
        if (x !== undefined && y !== undefined) {
            this.particles.push(new Particle(p5, p5.createVector(x, y), color));
        } else {
            this.particles.push(new Particle(p5, this.position, color));
        }
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
