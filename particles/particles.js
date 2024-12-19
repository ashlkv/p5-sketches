import {ParticleSystem} from './particle-system.js'
import {Repeller} from './repeller.js'
import {Attractor} from './attractor.js'
import {poissonSample, randomSample} from '../common/noise.js'

window.P5 = p5;

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    let particleSystem;
    let repeller;
    let attractors = [];
    let emitters = [];
    
    window.p5 = p5
    
    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(255);
        p5.frameRate(20)
        repeller = new Repeller(p5, p5.createVector(width / 2, height / 2));
        
        // attractors = randomSample(p5, 4, width, height).map(({x, y}) => new Attractor(p5, { x, y }))
        // emitters = randomSample(p5, 4, width, height).map(({x, y}) => new ParticleSystem(p5, p5.createVector(x, y)))
        
        // attractors = [new Attractor(p5, { x: width * 2/3, y: height / 2 })]
        // emitters = [new ParticleSystem(p5, p5.createVector(width * 1/3, height / 2))]
        
        attractors = [
            new Attractor(p5, { x: width * 0.25, y: height / 2 }),
            new Attractor(p5, { x: width * 0.75, y: height / 2 })
        ]
        emitters = [
            new ParticleSystem(p5, p5.createVector(width * 0.25, height / 2), 0.2, '#ff0000'),
            new ParticleSystem(p5, p5.createVector(width * 0.75, height / 2))
        ]
    }
    
    p5.draw = () => {
        // particleSystem.applyRepeller(repeller);
        // repeller.display();
        
        attractors.forEach(attractor => emitters.forEach((emitter) => emitter.applyAttractor(attractor)));
        attractors.forEach(attractor => attractor.display(255));
        
        emitters.forEach((emitter) => emitter.run(emitter.position.x, emitter.position.y));
    }
    
}, document.querySelector('main'))
