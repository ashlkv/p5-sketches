import {getCollatzSequence, getGrowth} from "../common/collatz.js";

window.P5 = p5;

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    const controls = {}
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        
        const container = document.querySelector('#controls');
        
        p5.createP('Odd angle').parent(container);
        controls.oddAngle = p5.createSlider(p5.PI / 40, p5.PI / 2, p5.PI / 20, p5.PI / 100);
        controls.oddAngle.parent(container)
        controls.oddAngle.elt.onchange = () => p5.draw();
        
        p5.createP('Even angle').parent(container);
        controls.evenAngle = p5.createSlider(p5.PI / 40, p5.PI / 2, p5.PI / 20, p5.PI / 100);
        controls.evenAngle.parent(container)
        controls.evenAngle.elt.onchange = () => p5.draw();
        
        p5.createP('Step').parent(container);
        controls.step = p5.createSlider(1, 100, 20, 1);
        controls.step.parent(container)
        controls.step.elt.onchange = () => p5.draw();
        
        p5.createP('Iterations').parent(container);
        controls.iterations = p5.createSlider(10, 10000, 1000, 1);
        controls.iterations.parent(container)
        controls.iterations.elt.onchange = () => p5.draw();
        
        p5.createP('Roundness').parent(container);
        controls.roundness = p5.createSlider(2, 8, 2, 2);
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
        const getSequence = (from) => getCollatzSequence(from, roundness)
        
        const growth = getGrowth(p5, { iterations, origin: { x: canvasSize.width / 2, y: canvasSize.height / 2 }, initialAngle: p5.PI / 2, oddAngle, evenAngle, step, getSequence });
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
