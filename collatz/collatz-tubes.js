import {getGrowth} from "../common/collatz.js";
import {FlowField} from "../common/flow-field.js";
import {Path} from "../common/path.js";
import {Spiral} from "../common/spiral.js";

window.P5 = p5;

new p5((p5) => {
    const presets = {
        print1: {
            "oddAngle": 0.267035375555132,
            "evenAngle": 0.361283155162826,
            "step": 12,
            "iterations": 2943,
            "roundness": 2
        }
    }
    const preset = presets.print1
    const canvasSize = {width: window.innerWidth, height: window.innerWidth * 1.4158249158249159};
    const controls = {}
    window.save = (name) => p5.save(name)
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        
        const container = document.querySelector('#controls');
        
        p5.createP('Odd angle').parent(container);
        controls.oddAngle = p5.createSlider(p5.PI / 40, p5.PI / 2, preset.oddAngle, p5.PI / 100);
        controls.oddAngle.parent(container)
        controls.oddAngle.elt.onchange = () => p5.draw();
        
        p5.createP('Even angle').parent(container);
        controls.evenAngle = p5.createSlider(p5.PI / 40, p5.PI / 2, preset.evenAngle, p5.PI / 100);
        controls.evenAngle.parent(container)
        controls.evenAngle.elt.onchange = () => p5.draw();
        
        p5.createP('Step').parent(container);
        controls.step = p5.createSlider(1, 100, preset.step, 1);
        controls.step.parent(container)
        controls.step.elt.onchange = () => p5.draw();
        
        p5.createP('Iterations').parent(container);
        controls.iterations = p5.createSlider(10, 10000, preset.iterations, 1);
        controls.iterations.parent(container)
        controls.iterations.elt.onchange = () => p5.draw();
        
        p5.createP('Roundness').parent(container);
        controls.roundness = p5.createSlider(2, 8, preset.roundness, 2);
        controls.roundness.parent(container)
        controls.roundness.elt.onchange = () => p5.draw();
    }
    
    p5.draw = () => {
        p5.background(255);
        p5.noFill();
        p5.stroke(0)
        
        
        const oddAngle = controls.oddAngle.value()
        const evenAngle = controls.evenAngle.value()
        const step = controls.step.value()
        const iterations = controls.iterations.value()
        const roundness = controls.roundness.value()
        
        const getNoiseValue = (column, row) => {
            const noiseIncrement = 0.05
            return p5.noise(column * noiseIncrement, row * noiseIncrement);
        }
        const flowField = new FlowField(p5, { width: iterations, height: 1, cellSize: 1, initialize: getNoiseValue });
        
        const growth = getGrowth(p5, {
            from: iterations,
            origin: {x: canvasSize.width * 0.05, y: canvasSize.width * 0.18},
            initialAngle: p5.PI * 1.5,
            oddAngle,
            evenAngle,
            step: (index) => (flowField.getValueAtPoint({ x: index, y: 0 }) + 1) * step * 2,
            roundness,
            optimized: true
        }).map((vertices) => {
            return vertices.reverse()
        }).filter((vertices, index) => {
            return index % 4 === 0
        });
       /* growth.forEach((vertices, index) => {
            p5.strokeWeight(3);
            p5.point(vertices[0].x, vertices[0].y)
            p5.strokeWeight(1);
            p5.stroke(0, 0, 255, 100)
            p5.beginShape();
            vertices.forEach(({x, y}, index, curve) => {
                if (index === 0 || index === curve.length - 1) {
                    p5.curveVertex(x, y);
                }
                p5.curveVertex(x, y)
            })
            p5.endShape();
        })*/
        growth.forEach((vertices, index) => {
            if (index % 3 === 0) {
                return;
            }
            const path = new Path(p5, vertices)
            p5.noiseSeed()
            const spiral = new Spiral(p5, { path, steps: Infinity, step: 5, radius: 10})
            
            // p5.strokeWeight(3);
            // p5.point(spiral.vertices[0].x, spiral.vertices[0].y)
            p5.strokeWeight(1);
            p5.stroke(255, 0, 0, 100)
            p5.beginShape();
            spiral.vertices.forEach(({x, y}, index, curve) => {
                if (index === 0 || index === curve.length - 1) {
                    p5.curveVertex(x, y);
                }
                p5.curveVertex(x, y)
            })
            p5.endShape();
        })
        p5.noLoop();
    }
}, document.querySelector('main'));
