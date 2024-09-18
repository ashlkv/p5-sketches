window.P5 = p5;

import PolygonRepeller from './PolygonRepeller.js';
import {FlowField} from '../collision/flow-field.js';

const poissonSample = function(count, width, height) {
  let distance = width / Math.sqrt((count * height) / width);
  let sampling = new PoissonDiskSampling({
    shape: [width, height],
    minDistance: distance * 0.8,
    maxDistance: distance * 1.6,
    tries: 15
  });
  return sampling.fill().map(([x, y]) => ({x, y}));
}

const getHexagon = (p5, center = { x: 0, y: 0 }, radius) => {
    const hexagon = []
    for (let i = 0; i < 6; i++) {
    let angle = p5.TWO_PI / 6 * i;
    let x = center.x + p5.cos(angle) * radius;
    let y = center.y + p5.sin(angle) * radius;
    hexagon.push({ x, y })
  }
    return hexagon;
}

const randomSample = function(p5, count, width, height) {
  return Array(count).fill().map(() => ({x: Math.round(p5.random(0, width - 1)), y: Math.round(p5.random(0, height - 1)) }))
}

const anchorSample = (p5, count, anchor, width, height) => {
    return Array(count).fill().map(() => ({x: Math.round(p5.random(0, width - 1) + anchor.x - width / 2), y: Math.round(p5.random(0, height - 1) + anchor.y - height / 2) }))
}

function Curve(p5, { flowField, repellers = [], start, steps, step = 10, darkMode = false }) {
    this.vertices = [start];
    for (let i = 0; i < steps; i++) {
        const vertex = this.vertices[i];
        const value = flowField.getWeightedAverageAt(vertex);
        if (value === undefined) {
            break;
        }
        let flow = P5.Vector.fromAngle(value, step)
        const nextVertex = {x: vertex.x + flow.x, y: vertex.y + flow.y}
        if (repellers.length > 0) {
            for (const repeller of repellers) {
                flow = repeller.repel(nextVertex, flow);
            }
        }
        // const vector = p5.createVector(vertex.x, vertex.y);
        // vector.add(flow)
        this.vertices.push({x: vertex.x + flow.x, y: vertex.y + flow.y})
    }
    
    this.render = () => {
        p5.strokeWeight(1)
        // p5.stroke(244, 85, 49, 100);
        darkMode ? p5.stroke(255, 255, 255, 100) : p5.stroke(0, 0, 0, 100);
        p5.fill(0, 0)
        p5.beginShape();
        const length = this.vertices.length;
        this.vertices.forEach(({x, y}, index) => {
            p5.curveVertex(x, y);
            if (index === 0 || index === length - 1) {
                // First and last vertices are curve control points, so we are repeating them to get anchor points.
                p5.curveVertex(x, y);
            }
        })
        p5.endShape();
    }
    
    this.renderVertices = () => {
        // Dots at vertices
        p5.strokeWeight(3)
        p5.stroke(0, 0, 0, 255);
        this.vertices.forEach(({x, y}) => {
            p5.point(x, y)
        })
    }
    
    this.renderStartingVertex = () => {
        p5.strokeWeight(5)
        p5.stroke(255, 0, 0, 255);
        p5.point(this.vertices[0].x, this.vertices[0].y)
    }
}

new p5((p5) => {
    const cellSize = 20;
    const noiseIncrement = 0.1;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    const controls = {};
    // const canvasSize = { width: Math.floor(640 / cellSize) * cellSize, height: Math.floor(480 / cellSize) * cellSize }
    let flowField;
    let repellers = [];
    window.save = (name) => p5.save(name)
    window.p5 = p5
    
    const initialize = (initialSeed) => {
        const seed = initialSeed ?? p5.floor(p5.random(9999999));
        console.log('seed:', seed)
        p5.noiseSeed(seed);
        p5.randomSeed(seed);
        window.seed = seed;
        
        // const getNoiseValue = (column, row) => p5.noise(column * noiseIncrement, row * noiseIncrement) * p5.TWO_PI * 3
        // const getConstantValue = () => p5.PI / 2
        const getSlightNoiseValue = (column, row) => {
            const main = 0;
            const range = p5.PI / 2;
            const variation = p5.noise(column * noiseIncrement, row * noiseIncrement) * range;
            return main - range / 2 + variation
        }
        flowField = new FlowField(p5, {width: canvasSize.width / cellSize, height: canvasSize.height / cellSize, cellSize, initialize: getSlightNoiseValue})
        window.flowField = flowField
    }
    
    const initializeRepellers = () => {
        if (controls.repellerOn.checked()) {
            // const repellerOrigins = [{ x: 150, y: canvasSize.height / 2 }];
            const repellerOrigins = randomSample(p5, 5, canvasSize.width * 0.75, canvasSize.height);
            // const repellerOrigins = poissonSample( 10, canvasSize.width, canvasSize.height * 0.66);
            // repellers = repellerOrigins.map(({ x, y }) => new Repeller(p5, x, canvasSize.height * 0.33 + y))
            repellers = repellerOrigins
                .map(({x, y}) => {
                    const hexagon = getHexagon(p5, { x, y }, 50)
                    return new PolygonRepeller(p5, hexagon)
                })
            // repellers.forEach((repeller) => {
            //     repeller.power = p5.random(controls.repellerPower.value());
            // })
            // repellers = [
            //     new Repeller(p5, canvasSize.width * 0.5, canvasSize.height * 0.5, power)
            // ];
        } else {
            repellers = [];
        }
    }
    
    p5.setup = () => {
        p5.frameRate(1)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        // p5.noiseDetail(2, 0.25)
        
        const container = document.querySelector('#controls');
        controls.count = p5.createSlider(0, 1000, 20, 10);
        controls.count.parent(container)
        controls.count.elt.onchange = () => {
            p5.draw();
        }
        controls.repellerPower = p5.createSlider(0, 100, 20, 1);
        controls.repellerPower.parent(container)
        controls.repellerPower.elt.onchange = () => {
            const power = p5.random(controls.repellerPower.value());
            repellers.forEach(repeller => {
                repeller.power = p5.random(controls.repellerPower.value());
            })
            p5.draw();
        }
        controls.repellerOn = p5.createCheckbox('Repellers', true);
        controls.repellerOn.parent(container)
        controls.repellerOn.elt.onchange = () => {
            initializeRepellers();
            p5.draw();
        }
        controls.seed = p5.createButton('Seed');
        controls.seed.parent(container)
        controls.seed.elt.onclick = () => {
            initialize();
            p5.draw();
        }
        controls.rerender = p5.createButton('Re-render');
        controls.rerender.parent(container)
        controls.rerender.elt.onclick = () => {
            p5.draw();
        }
        
        const initialSeed = /*1009208*/ 6888242;
        initialize(initialSeed);
        initializeRepellers();
    }

    p5.draw = () => {
        p5.background(255, 255, 255)
        
        // repellers.forEach((repeller) => repeller.render())
        // flowField.render()
        
        const count = controls.count.value()
        // const curveOrigins = poissonSample(count, canvasSize.width, canvasSize.height);
        // const curveOrigins = randomSample(p5, count, canvasSize.width, canvasSize.height);
        // const curveOrigins = [{x: 0, y: Math.round(canvasSize.height / 2)}];
        // const curveOrigins = [{x: Math.round(p5.random(canvasSize.width)), y: Math.round(p5.random(canvasSize.height))}];
        // const curveOrigins = [{x: Math.round(canvasSize.width * 0.25), y: Math.round(canvasSize.height * 0.25)}];
        // const curveOrigins = anchorSample(p5, count, {x: canvasSize.width / 2, y: 20}, canvasSize.width, 10);
        const curveOrigins = anchorSample(p5, count, {x: 20, y: canvasSize.height / 2}, 10, canvasSize.height);
        
        curveOrigins.forEach((start) => {
            const curve = new Curve(p5, {start, steps: 100, flowField, repellers, step: 10, darkMode: false})
            curve.render();
            curve.renderVertices();
            curve.renderStartingVertex();
        })
        
        repellers.forEach((repeller) => {
            repeller.render();
            repeller.renderForces();
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));
