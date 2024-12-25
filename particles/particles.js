import {Emitter} from './emitter.js'
import {Repeller} from './repeller.js'
import {Attractor} from './attractor.js'
import {poissonSample, randomSample} from '../common/noise.js'

window.P5 = p5;

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    let repellers = [];
    let attractors = [];
    let emitters = [];
    let started = false;
    let radio;
    
    window.p5 = p5
    
    const renderSystem = () => {
        attractors.forEach(attractor => attractor.display());
        emitters.forEach((emitter) => emitter.display());
        repellers.forEach((repeller) => repeller.display());
    }

    window.start = () => {
        p5.loop();
        started = true;
    }
    
    window.stop = () => {
        p5.noLoop();
        emitters.forEach(emitter => emitter.particles.forEach(particle => particle.render()))
        started = false;
    }
    
    window.reset = () => {
        p5.background(255);
        renderSystem();
    }
    
    window.document.addEventListener('click', (event) => {
        if (!event.target.matches('canvas')) {
            return;
        }
        const from = p5.random(0, Math.PI);
        const phase = p5.random(Math.PI * 0.8, Math.PI * 1.2);
        const ranges = [[from, from * 0.1], [from + phase, from * 0.1 + phase]];
        // const ranges = [[from, from * 0.3]];
        // const ranges = [[-0.15, 0.15], [Math.PI - 0.15, Math.PI + 0.15]];
        const emitter = new Emitter(p5, p5.createVector(p5.mouseX, p5.mouseY), 0.05, 0, ranges)
        const attractor = new Attractor(p5, {x: p5.mouseX, y: p5.mouseY}, 0.2);
        const repeller = new Repeller(p5, p5.createVector(p5.mouseX, p5.mouseY));
        switch (radio.value()) {
            case 'emitter + attractor': {
                emitters.push(emitter)
                attractors.push(attractor)
                break;
            }
            case 'emitter': {
                emitters.push(emitter);
                break;
            }
            case 'attractor': {
                attractors.push(attractor)
                break;
            }
            case 'repeller': {
                repellers.push(repeller);
                break;
            }
        }
    });
    
    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(255);
        p5.frameRate(20)
        
        radio = p5.createRadio();
        radio.position(0, 0);
        
        radio.option('emitter + attractor');
        radio.option('attractor');
        radio.option('emitter');
        radio.option('repeller');
        radio.selected('emitter + attractor');
        
        const start = p5.createButton('start');
        start.position(0, 24);
        start.mousePressed(window.start)
        
        const stop = p5.createButton('stop');
        stop.position(0, 48);
        stop.mousePressed(window.stop)
        
        const reset = p5.createButton('reset');
        reset.position(0, 72);
        reset.mousePressed(window.reset)
    
        const center = { x: width / 2, y: height / 2 }
        const positions = new Array(0).fill().map(() => {
            const angle = p5.random(0, p5.TWO_PI);
            const radius = P5.Vector.fromAngle(angle, 200);
            return { x: center.x + radius.x, y: center.y + radius.y }
        })
        positions.push(center)
    }
    
    p5.draw = () => {
        renderSystem();
        
        repellers.forEach(repeller => emitters.forEach(emitter => emitter.applyRepeller(repeller)))
        attractors.forEach(attractor => emitters.forEach((emitter) => emitter.applyAttractor(attractor)));
        // emitters.forEach(emitter => emitter.applyForce(gravity1))
        if (!started) {
            return
        }
        emitters.forEach((emitter) => emitter.run(emitter.position.x, emitter.position.y));
    }
}, document.querySelector('main'))
