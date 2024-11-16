import { FlowField } from '../common/flow-field.js'
import {poissonSample, randomSample, anchorSample} from '../common/noise.js'

window.P5 = p5;

function Curve(p5, { flowField, start, steps, bias = 0, growth = 1, step = 10 }) {
    this.vertices = [start];
    for (let index = 0; index < steps; index++) {
        const point = this.vertices[index];
        const vector = p5.createVector(point.x, point.y);
        const value = flowField.getValueAtPoint(point);
        if (value === undefined) {
            break;
        }
        const force = P5.Vector.fromAngle(value + index * bias, step)
        vector.add(force)
        vector.mult(growth)
        this.vertices.push({x: vector.x, y: vector.y})
    }
}

new p5((p5) => {
    const cellSize = 50;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    const controls = {}
    let flowField;
    let image;
    let seed = 1728315780048;
    window.save = (name) => p5.save(name)
    
    p5.preload = () => {
      image = p5.loadImage('./images/sun.jpg');
    }

    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        window.p5 = p5;
        
        const presets = {
            preset1: {
                "steps": 390,
                "bias": 0,
                "growth": 1,
                "step": 10,
                "count": 3700,
                "cellSize": 4,
                seed: 1728315780048
            },
        }
        const { steps, growth, bias, step, count, cellSize } = presets.preset1
        
        const container = document.querySelector('#controls');
        
        p5.createP('Bias').parent(container);
        controls.bias = p5.createSlider(-1, 1, bias, 0.01);
        controls.bias.parent(container)
        controls.bias.elt.onchange = () => p5.draw();
        
        p5.createP('Growth').parent(container);
        controls.growth = p5.createSlider(0.995, 1.005, growth, 0.0001);
        controls.growth.parent(container)
        controls.growth.elt.onchange = () => p5.draw();
        
        p5.createP('Curve step count').parent(container);
        controls.steps = p5.createSlider(10, 1000, steps, 10);
        controls.steps.parent(container)
        controls.steps.elt.onchange = () => p5.draw();
        
        p5.createP('Curve step size').parent(container);
        controls.step = p5.createSlider(1, 200, step, 1);
        controls.step.parent(container)
        controls.step.elt.onchange = () => p5.draw();
        
        p5.createP('Curve count').parent(container);
        controls.count = p5.createSlider(0, 5000, count, 100);
        controls.count.parent(container)
        controls.count.elt.onchange = () => p5.draw();
        
        p5.createP('Flow field cell size').parent(container);
        controls.cellSize = p5.createSlider(2, 200, cellSize, 1);
        controls.cellSize.parent(container)
        controls.cellSize.elt.onchange = () => p5.draw();
        
        controls.seed = p5.createButton('Seed');
        controls.seed.parent(container)
        controls.seed.elt.onclick = () => {
            seed = Date.now();
            p5.draw();
        }
    }

    p5.draw = () => {
        p5.background(255)
        
        const steps = controls.steps.value();
        const bias = controls.bias.value();
        const growth = controls.growth.value();
        const step = controls.step.value();
        const count = controls.count.value();
        const cellSize = controls.cellSize.value();
        
        console.log(seed, { steps, bias, growth, step, count, cellSize })
        
        
        flowField = FlowField.fromImage(p5, image, {left: 0, top: 0, width: canvasSize.width, height: canvasSize.height},  { cellSize })
        
        // flowField.values.forEach((columns, row) => columns.forEach((value, column, columns) => {
        //     columns[column] = value + p5.PI / 2 * 3
        // }));
        
        window.flowField = flowField
        // flowField.render()
        // flowField.renderGrid()
        
        
        const origin = { x: 0, y: canvasSize.height };
        p5.randomSeed(seed)
        
        const startingPoints = poissonSample(p5, count, canvasSize.width, canvasSize.height).sort((first, second) => {
            const distance1 = p5.dist(origin.x, origin.y, first.x, first.y)
            const distance2 = p5.dist(origin.x, origin.y, second.x, second.y)
            return distance1 - distance2
        });
        
        window.startingPoints = startingPoints;
        
        const curves = startingPoints.map((start) => {
            const curve = new Curve(p5, { start, steps, flowField, step, bias, growth })
            // const end = curve.getEnd();
            // const fromStart = p5.dist(origin.x, origin.y, start.x, start.y)
            // const fromEnd = p5.dist(origin.x, origin.y, end.x, end.y)
            // if (fromEnd < fromStart) {
            //     curve.reflow();
            // }
            return curve;
        })
        window.curves = curves;
        
        curves.forEach((curve, index, curves) => {
            p5.strokeWeight(1)
            p5.noFill()
            
            p5.stroke(0, 0, 0, 125);
            p5.beginShape();
            curve.vertices.forEach(({x, y}, index) => {
                p5.curveVertex(x, y);
                if (index === 0 || index === curve.vertices.length - 1) {
                    // First and last vertices are curve control points, so we are repeating them to get anchor points.
                    p5.curveVertex(x, y);
                }
            })
            p5.endShape();
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));

