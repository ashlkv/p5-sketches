import {getCollatzSequence, getGrowth} from "../common/collatz.js";
import {primeNumbers} from "../common/prime-numbers.js";

window.P5 = p5;

new p5((p5) => {
    const presets = {
        round: {"oddAngle": 0.392699081698724, "evenAngle": 0.141371669411541, "step": 18, "iterations": 1000, "roundness": 4},
        organic: {"oddAngle": 0.235619449019235, "evenAngle": 0.204203522483337, "step": 18, "iterations": 8823, "roundness": 4},
        funky: {"oddAngle": 0.235619449019235, "evenAngle": 0.549778714378214, "step": 6, "iterations": 6640, "roundness": 2},
        original: {"oddAngle": 0.141371669411541, "evenAngle": 0.141371669411541, "step": 6, "iterations": 6639, "roundness": 2}
    }
    const preset = presets.funky
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
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
        
        const growth = getGrowth(p5, { iterations, origin: { x: canvasSize.width / 2, y: canvasSize.height / 2 }, initialAngle: p5.PI / 2, oddAngle, evenAngle, step, roundness, optimized: false });
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
