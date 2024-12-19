// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Simple Particle System

// A simple Particle class

const hex2rgb = (rawHex = '') => {
    const hex = rawHex.replace('#', '');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

export function Particle(p5, position, color = 0, ranges = [{x: -1, y: 1}]) {
    
    this.position = position instanceof P5.Vector ? position : new p5.createVector(position.x, position.y);
    this.velocity = p5.createVector(p5.random(-1, 1), p5.random(-1, 1));
    this.acceleration = p5.createVector(0, 0);
    this.lifespan = 1024.0;
    this.color = typeof color === "number" ? [color] : hex2rgb(color);
    
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
        p5.stroke(...this.color, this.lifespan);
        p5.strokeWeight(1);
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
