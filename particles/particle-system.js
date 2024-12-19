import { Particle } from './particle.js'

export function ParticleSystem(p5, position) {
    this.origin = position.copy();
    this.particles = [];
    
    this.addParticle = (x, y) => {
        if (x !== undefined && y !== undefined) {
            this.particles.push(new Particle(p5, p5.createVector(x, y)));
        } else {
            this.particles.push(new Particle(p5, this.origin));
        }
    }
    
    this.run = () => {
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
    
}
