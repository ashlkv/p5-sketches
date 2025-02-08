import {Emitter} from './emitter.js'
import {Repeller} from './repeller.js'
import {Attractor} from './attractor.js'
import {poissonSample, randomSample} from '../common/noise.js'

window.P5 = p5;

new p5((p5) => {
    const width = window.innerHeight * 1.42 * 2;
    const height = window.innerHeight * 2;
    
    const controls = {}
    let repellers = [];
    let attractors = [];
    let emitters = [];
    let started = false;
    let type;
    
    window.p5 = p5
    window.emitters = emitters;
    
    const renderSystem = () => {
        attractors.forEach(attractor => attractor.display());
        emitters.forEach((emitter) => emitter.display());
        repellers.forEach((repeller) => repeller.display());
    }

    window.save = (name) => p5.save(name)
    
    window.start = () => {
        p5.loop();
        started = true;
    }
    
    window.stop = () => {
        p5.noLoop();
        started = false;
        p5.clear();
        
        emitters.forEach(emitter => emitter.renderLines())
    }
    
    window.reset = () => {
        p5.background(255);
        renderSystem();
    }
    
    const attractorPower = 0.2;
    const repellerPower = 100;
    // 1 is 1 particle per frame, i.e. 60 particles per second
    const emitterSpeed = 0.5;
    
    window.randomize = () => {
        emitters = [];
        attractors = [];
        repellers = [];
        randomSample(p5, 10, width, height).map(({ x, y }) => emitters.push(getEmitter(x, y)))
        randomSample(p5, 5, width, height).map(({ x, y }) => attractors.push(getAttractor(x, y, true)))
        randomSample(p5, 5, width, height).map(({ x, y }) => repellers.push(getRepeller(x, y)))
        p5.background(255);
        renderSystem();
    }
    
    const getRanges = (angle = 1 * Math.PI) => {
        const from = p5.random(0, Math.PI);
        const phase = /*p5.random(Math.PI * 0.8, Math.PI * 1.2)*/ Math.PI;
        return [[from, from + angle], [from + phase, from + angle + phase]];
    }
    
    const getAttractor = (x, y, oneway) => new Attractor(p5, {x: p5.mouseX, y: p5.mouseY}, attractorPower, oneway)
    const getEmitter = (x, y, color) => new Emitter(p5, p5.createVector(x, y), emitterSpeed, color, getRanges())
    const getRepeller = (x, y) => new Repeller(p5, p5.createVector(x, y), repellerPower)
    
    window.document.addEventListener('click', (event) => {
        if (!event.target.matches('canvas, rect, g, svg')) {
            return;
        }
        const color = controls.color.value() === 'red' ? '#ff0000' : controls.color.value() === 'cyan' ? '#00ffff' : '#000000';
        switch (type.value()) {
            case 'emitter': {
                emitters.push(getEmitter(p5.mouseX, p5.mouseY, color));
                break;
            }
            case 'attractor oneway': {
                attractors.push(getAttractor(p5.mouseX, p5.mouseY, true))
                break;
            }
            case 'attractor both ways': {
                attractors.push(getAttractor(p5.mouseX, p5.mouseY, false))
                break;
            }
            case 'emitter + attractor': {
                emitters.push(getEmitter(p5.mouseX, p5.mouseY, color))
                attractors.push(getAttractor(p5.mouseX, p5.mouseY, true))
                break;
            }
            case 'repeller': {
                repellers.push(getRepeller(p5.mouseX, p5.mouseY));
                break;
            }
        }
    });
    
    p5.setup = () => {
        p5.createCanvas(width, height, p5.SVG);
        p5.background(255);
        p5.frameRate(20)
        
        const container = document.querySelector('#controls');
        
        type = p5.createRadio('type').parent(container);
        type.position(0, 0);
    
        type.option('attractor oneway');
        type.option('attractor both ways');
        type.option('emitter');
        type.option('emitter + attractor');
        type.option('repeller');
        type.selected('attractor oneway');
        
        const color = p5.createRadio('color').parent(container);
        color.position(0, 24);
        color.option('black');
        color.option('red');
        color.option('cyan');
        color.selected('black');
        controls.color = color;
        
        const start = p5.createButton('start').parent(container);
        start.position(0, 48);
        start.mousePressed(window.start)
        
        const stop = p5.createButton('stop').parent(container);
        stop.position(0, 72);
        stop.mousePressed(window.stop)
        
        const reset = p5.createButton('reset').parent(container);
        reset.position(0, 96);
        reset.mousePressed(window.reset)
        
        const randomize = p5.createButton('randomize').parent(container);
        randomize.position(0, 120);
        randomize.mousePressed(window.randomize)
    
        const center = { x: width / 2, y: height / 2 }
        const positions = new Array(0).fill().map(() => {
            const angle = p5.random(0, p5.TWO_PI);
            const radius = P5.Vector.fromAngle(angle, 200);
            return { x: center.x + radius.x, y: center.y + radius.y }
        })
        positions.push(center)
    }
    
    const gravity = p5.createVector(0, 0.01);
    // const gravity = p5.createVector(0, 0);
    p5.draw = () => {
        renderSystem();
        repellers.forEach(repeller => emitters.forEach(emitter => emitter.applyRepeller(repeller)))
        attractors.forEach(attractor => emitters.forEach((emitter) => emitter.applyAttractor(attractor)));
        emitters.forEach(emitter => emitter.applyForce(gravity))
        if (started) {
            emitters.forEach((emitter) => emitter.run(emitter.position.x, emitter.position.y));
        }
    }
}, document.querySelector('main'))
