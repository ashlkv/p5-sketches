import {FlowField} from '../common/flow-field.js'
import {poissonSample, randomSample} from '../common/noise.js'
import {FlowBezier} from "../common/flow-bezier.js";

window.P5 = p5;

new p5((p5) => {
    const cellSize = 50;
    const noiseIncrement = 0.01;
    const canvasSize = {
        width: Math.floor(window.innerWidth / cellSize) * cellSize,
        height: Math.floor(window.innerHeight / cellSize) * cellSize
    }
    const collatzPresets = {
        round: {"oddAngle": 0.392699081698724, "evenAngle": 0.141371669411541, "step": 18, "iterations": 1000, "roundness": 4},
        organic: {"oddAngle": 0.235619449019235, "evenAngle": 0.204203522483337, "step": 18, "iterations": 1000, "roundness": 4},
        funky: {"oddAngle": 0.235619449019235, "evenAngle": 0.549778714378214, "step": 6, "iterations": 6640, "roundness": 2},
        original: {"oddAngle": 0.141371669411541, "evenAngle": 0.141371669411541, "step": 6, "iterations": 6639, "roundness": 2}
    }
    let flowField;
    const getNoiseValue = (column, row) => p5.noise(column * noiseIncrement, row * noiseIncrement) * p5.PI
    window.save = (name) => p5.save(name)
    
    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        // p5.noiseDetail(2, 0.25)
        flowField = new FlowField(p5, {
            width: canvasSize.width / cellSize,
            height: canvasSize.height / cellSize,
            cellSize,
            initialize: getNoiseValue
        })
        window.flowField = flowField
        window.p5 = p5;
    }
    
    p5.draw = () => {
        // flowField.render()
        const startingPoints = randomSample(p5, 200, canvasSize.width, 10);
        p5.strokeWeight(1)
        p5.stroke(0, 0, 0, 100);
        p5.noFill()
        
        startingPoints.forEach((start) => {
            const curve = new FlowBezier(p5, {start, steps: 10, flowField, step: 100, handle: 50})
            curve.segments.forEach(({anchor1, anchor2, control1, control2}, index, vertices) => {
                p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
            })
            
            // curve.renderHandles()
            // curve.renderAnchors()
            // curve.renderStart()
            window.curve = curve
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));
