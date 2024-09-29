import { FlowField } from '../common/flow-field.js'
import { poissonSample } from '../common/noise.js'
import {getCollatzSequence, getGrowth} from "../common/collatz.js";
import {FlowBezier} from "../common/flow-bezier.js";

window.P5 = p5;

new p5((p5) => {
    const cellSize = 50;
    const noiseIncrement = 0.1;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    // const canvasSize = { width: Math.floor(640 / cellSize) * cellSize, height: Math.floor(480 / cellSize) * cellSize }
    let flowField;
    const getNoiseValue = (column, row) => p5.noise(column, row) * p5.PI * 1.5
    window.save = (name) => p5.save(name)

    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        // p5.noiseDetail(2, 0.25)
        flowField = new FlowField(p5, {width: canvasSize.width / cellSize, height: canvasSize.height / cellSize, cellSize, initialize: getNoiseValue})
        window.flowField = flowField
        window.p5 = p5;
    }

    p5.draw = () => {
        flowField.render()
        const getSequence = (from) => getCollatzSequence(from, 4)
        
        const startingPoints = poissonSample(10, canvasSize.width, canvasSize.height);
        // const startingPoints = [{x: Math.round(p5.random(canvasSize.width)), y: Math.round(p5.random(canvasSize.height))}];
        // const startingPoints = [{x: Math.round(canvasSize.width / 2), y: Math.round(canvasSize.height / 2)}];
        startingPoints.forEach((start) => {
            const curve = new FlowBezier(p5, { start, steps: 10, flowField, step: 30, handle: 15 })
            p5.strokeWeight(1)
            // p5.stroke(244, 85, 49, 100);
            p5.stroke(0, 0, 0, 100);
            p5.fill(0, 0)
            curve.segments.forEach(({ anchor1, anchor2, control1, control2 }, index, vertices) => {
                p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
            })
            const end = curve.vertices.slice(-1)[0];
            const value = flowField.getValueAt(end)
            const initialAngle = value + p5.PI;
            const noise = value / p5.PI / 1.5
            const evenAngle = p5.map(noise, 0, 1, p5.PI / 20, p5.PI / 40)
            const oddAngle = p5.map(noise, 0, 1, p5.PI / 20, p5.PI / 40)
            const growth = getGrowth(p5, { iterations: Math.round(value * 100), origin: { x: end.x, y: end.y }, initialAngle: initialAngle, step: 10, evenAngle, oddAngle, getSequence });
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
            // curve.renderHandles()
            curve.renderAnchors()
            curve.renderStart()
            window.curve = curve
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));
