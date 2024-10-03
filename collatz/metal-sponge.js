import {getGrowth} from "../common/collatz.js";
import {FlowField} from "../common/flow-field.js";

window.P5 = p5;

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    const presets = {
        medium: {"oddAngle": 1.17809724509617, "evenAngle": 0.895353906273091, "step": 10, "iterations": 228}
    }
    const preset = presets.medium
    const controls = {}
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        
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
    }
    
    p5.draw = () => {
        p5.background(255);
        p5.noFill();
        p5.stroke(0)
        
        const oddAngle = controls.oddAngle.value()
        const evenAngle = controls.evenAngle.value()
        const step = controls.step.value()
        const iterations = controls.iterations.value()
        
        const flowField = new FlowField(p5, {
            width: iterations,
            height: iterations,
            cellSize: 20,
            initialize: (column, row) => p5.noise(column, row)
        })
        const getSequence = (from) => {
            const sequence = [];
            for (let number = 0; number < from; number ++) {
                const value = flowField.getCellValue({ column: number, row: from })
                sequence.push(value > 0.5 ? 1 : 2);
            }
            return sequence;
        }
        
        const growth = getGrowth(p5, { from: iterations, origin: { x: canvasSize.width / 2, y: canvasSize.height / 2 }, initialAngle: p5.PI / 2, oddAngle, evenAngle, step, getSequence });
        growth.forEach((curve) => {
            p5.beginShape();
            curve.forEach(({x, y}, index, curve) => {
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
