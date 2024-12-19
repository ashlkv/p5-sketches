import { Particle } from './particle.js'
import { ParticleSystem } from './particle-system.js'
import { Repeller } from './repeller.js'

window.P5 = p5;

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    let particles = [];
    let particleSystem;
    let repeller;
    
    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(255);
        particleSystem = new ParticleSystem(p5, p5.createVector(width / 2, 50));
        repeller = new Repeller(p5, p5.createVector(width / 2, height / 2));
    }
    
    p5.draw = () => {
        particleSystem.addParticle(p5.mouseX, p5.mouseY);
        
          // Apply gravity force to all Particles
          let gravity = p5.createVector(0, 0.02);
          particleSystem.applyForce(gravity);
        
          particleSystem.applyRepeller(repeller);
        
          repeller.display();
          particleSystem.run();
    
    }
    
}, document.querySelector('main'))
