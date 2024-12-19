// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Simple Particle System

// A simple Particle class

export function Particle(p5, position) {
    
    this.position = position;
    this.velocity = p5.createVector(p5.random(-1, 1), p5.random(-1, 0));
    this.acceleration = p5.createVector(0, 0);
    this.lifespan = 255.0;
    
    this.run = () => {
        this.update();
        this.display();
    }
    
    this.applyForce = (force) => {
        this.acceleration.add(force);
      }
    
    // Method to update position
    this.update = () => {
        this.velocity.add(this.acceleration);
        this.position.add(this.velocity);
        this.lifespan -= 2;
        
        this.velocity.limit(5);
    }
    
    // Method to display
    this.display = () => {
        p5.stroke(0, this.lifespan);
        p5.strokeWeight(2);
        p5.point(this.position.x, this.position.y)
        
        // p5.fill(127, this.lifespan);
        // p5.ellipse(this.position.x, this.position.y, 12, 12);
    }
    
    // Is the particle still useful?
    this.isDead = () => {
        if (this.lifespan < 0.0) {
            return true;
        } else {
            return false;
        }
    }
}
