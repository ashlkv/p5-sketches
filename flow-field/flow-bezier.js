import { FlowField } from '../common/flow-field.js'
import { poissonSample, randomSample, anchorSample } from '../common/noise.js'
import {debugBezier} from "../common/bezier.js";
import {BezierCurve} from "../marching-squares/curve.js";

window.P5 = p5;

new p5((p5) => {
    const cellSize = 50;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    // const canvasSize = { width: Math.floor(640 / cellSize) * cellSize, height: Math.floor(480 / cellSize) * cellSize }
    let flowField;
    window.save = (name) => p5.save(name)
    
    const getNoiseValue = (column, row, p5, ) => {
        const noiseIncrement = 0.03
        return p5.noise(column * noiseIncrement, row * noiseIncrement) * p5.PI * 2;
    };
    

    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.noiseDetail(2, 0.25)
        flowField = new FlowField(p5, {width: canvasSize.width / cellSize, height: canvasSize.height / cellSize, cellSize, initialize: getNoiseValue})
        window.flowField = flowField
        window.p5 = p5;
    }

    p5.draw = () => {
        // flowField.render()
        
        const origin = { x: 0, y: canvasSize.height };
        
        const startingPoints = poissonSample( 100, canvasSize.width, canvasSize.height).sort((first, second) => {
            const distance1 = p5.dist(origin.x, origin.y, first.x, first.y)
            const distance2 = p5.dist(origin.x, origin.y, second.x, second.y)
            return distance1 - distance2
        });
        
        // const startingPoints = anchorSample(p5, 200, {x: 20, y: canvasSize.height / 2}, 10, canvasSize.height);
        
        window.startingPoints = startingPoints;
        // const startingPoints = [{x: Math.round(p5.random(canvasSize.width)), y: Math.round(p5.random(canvasSize.height))}];
        // const startingPoints = [{x: Math.round(canvasSize.width / 2), y: Math.round(canvasSize.height / 2)}];
        
        const curves = startingPoints.map((start) => {
            const curve = new BezierCurve(p5, { start, steps: 30, flowField, step: 50, handle: 10 })
            const end = curve.getEnd();
            const fromStart = p5.dist(origin.x, origin.y, start.x, start.y)
            const fromEnd = p5.dist(origin.x, origin.y, end.x, end.y)
            if (fromEnd < fromStart) {
                curve.reflow();
            }
            return curve;
        })
        window.curves = curves;
        
        curves.forEach((curve, index, curves) => {
            p5.strokeWeight(1)
            // p5.stroke(244, 85, 49, 100);
            p5.stroke(0, 0, 0, 100);
            p5.fill(0, 0)
            curve.segments.forEach(({ anchor1, anchor2, control1, control2 }, index, vertices) => {
                p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
                // debugBezier(p5, anchor1, control1, control2, anchor2)
            })
            
            p5.circle(origin.x, origin.y, 20)
            
            // Dots at anchor
            /*p5.strokeWeight(3)
            p5.stroke(0, 0, 0, 255);
            curve.segments.forEach(({anchor1, anchor2}) => {
                p5.point(anchor1.x, anchor1.y)
                p5.point(anchor2.x, anchor2.y)
            })*/
            
            /*
            
            // Dots at handles
            curve.segments.forEach(({ control1, control2, anchor1, anchor2}) => {
                p5.stroke(0, 0, 255, 255);
                p5.strokeWeight(1)
                p5.line(control1.x, control1.y, anchor1.x, anchor1.y)
                p5.line(control2.x, control2.y, anchor2.x, anchor2.y)
                
                p5.strokeWeight(5)
                p5.point(control1.x, control1.y)
                p5.point(control2.x, control2.y)
            })
            */
           
            /*
            // Red dot at start
            p5.strokeWeight(5)
            // 0 - transparent, 255 – opaque
            p5.stroke(255, 0, 0, p5.map(index, 0, curves.length - 1, 255, 0));
            p5.point(curve.vertices[0].x, curve.vertices[0].y)
            window.curve = curve
            */
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));
