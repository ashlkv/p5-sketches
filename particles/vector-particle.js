// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Simple Particle System

// A simple Particle class

const hex2rgb = (rawHex = '') => {
    const hex = rawHex.replace('#', '');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

export function Particle(p5, position, color = 0, ranges = [[0, Math.PI], [Math.PI, Math.PI * 2]]) {
    const rangeIndex = Math.round(p5.random(ranges.length - 1));
    const [from, to] = ranges[rangeIndex]
    const angle = p5.random(from, to)
    this.position = position instanceof P5.Vector ? position : new p5.createVector(position.x, position.y);
    this.velocity = P5.Vector.fromAngle(angle, p5.random(1, 5));
    this.acceleration = p5.createVector(0, 0);
    this.lifespan = Infinity;
    this.color = typeof color === "number" ? [color] : hex2rgb(color);
    this.points = [];
    
    this.run = () => {
        this.update();
        this.points.push({ x: this.position.x, y: this.position.y })
        
        p5.stroke(...this.color, 125);
        p5.strokeWeight(1)
        p5.point(this.position.x, this.position.y)
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
        this.points.push({ x: this.position.x, y: this.position.y })
    }
    
    // Method to display
    this.render = () => {
        p5.stroke(...this.color, 125);
        p5.strokeWeight(0.5)
        p5.noFill()
        p5.beginShape()
        // const from = p5.random(0, this.points.length - 1)
        // const to = p5.random(from, this.points.length - 1)
        this.points.forEach(({ x, y }, index) => {
            // if (index < from && index > to) {
            //     return;
            // }
            p5.curveVertex(x, y)
        })
        p5.endShape();
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
