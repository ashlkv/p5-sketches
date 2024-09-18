import { FlowField } from "../collision/flow-field.js";
import { debugBezier } from "./bezier.js";

window.P5 = p5;

new p5((p5) => {
    const cellSize = 20;
    const noiseIncrement = 0.1;
    const canvasSize = {
        width: Math.floor(window.innerWidth / cellSize) * cellSize,
        height: Math.floor(window.innerHeight / cellSize) * cellSize
    }
    const getNoiseValue = (column, row) => {
        return p5.noise(column * noiseIncrement, row * noiseIncrement) * p5.TWO_PI
    }
    let flowField = new FlowField(p5, { width: canvasSize.width / cellSize, height: canvasSize.height / cellSize, cellSize, initialize: getNoiseValue });
    
    window.flowField = flowField;
    window.save = (name) => p5.save(name)
    
    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.noFill()
        p5.strokeWeight(1)
        p5.stroke(0);
    }

    p5.draw = () => {
        flowField.forEach(({value: value2, x: x2, y: y2}, {value: value1, x: x1, y: y1}) => {
            if (value1 === undefined) {
                return;
            }
            const vector1 = P5.Vector.fromAngle(value1 + p5.PI, value1 / p5.TWO_PI * 200);
            const vector2 = P5.Vector.fromAngle(value2, value2 / p5.TWO_PI * 200)
            const anchor1 = {x: x1, y: y1}
            const control1 = {x: anchor1.x + vector1.x, y: anchor1.y + vector1.y}
            const anchor2 = {x: x2, y: y2}
            const control2 = {x: anchor2.x + vector2.x, y: anchor2.y + vector2.y}
            
            p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
            // debugBezier(p5, anchor1, control1, control2, anchor2);
        })
        p5.noLoop();
    }
}, document.querySelector('main'));
