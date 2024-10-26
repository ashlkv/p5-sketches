import { FlowField } from '../common/flow-field.js'
import { poissonSample, randomSample, anchorSample } from '../common/noise.js'

window.P5 = p5;

function Curve(p5, { flowField, start, steps, step = 10 }) {
    this.vertices = [start];
    for (let index = 0; index < steps; index++) {
        const point = this.vertices[index];
        const vector = p5.createVector(point.x, point.y);
        const value = flowField.getValueAt(point);
        if (value === undefined) {
            break;
        }
        const force = P5.Vector.fromAngle(value - index * 0.1, step)
        vector.add(force)
        this.vertices.push({x: vector.x, y: vector.y})
    }
}

new p5((p5) => {
    const cellSize = 50;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    let flowField;
    let image;
    window.save = (name) => p5.save(name)
    
    p5.preload = () => {
      image = p5.loadImage('./images/worley-noise.jpg');
    }

    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.noiseDetail(2, 0.25)
        flowField = FlowField.fromImage(p5, image, {left: 0, top: 0, width: 1024, height: 1024},  { cellSize: 5 })
        // flowField = new FlowField(p5, { width: canvasSize.width, height: canvasSize.height, cellSize: 20 })
        window.flowField = flowField
        window.p5 = p5;
    }

    p5.draw = () => {
        // flowField.render()
        // flowField.renderGrid()
        
        
        const origin = { x: 0, y: canvasSize.height };
        
        const startingPoints = randomSample(p5,  1000, canvasSize.width, canvasSize.height).sort((first, second) => {
            const distance1 = p5.dist(origin.x, origin.y, first.x, first.y)
            const distance2 = p5.dist(origin.x, origin.y, second.x, second.y)
            return distance1 - distance2
        });
        
        // const startingPoints = anchorSample(p5, 200, {x: 20, y: canvasSize.height / 2}, 10, canvasSize.height);
        
        window.startingPoints = startingPoints;
        // const startingPoints = [{x: Math.round(p5.random(canvasSize.width)), y: Math.round(p5.random(canvasSize.height))}];
        // const startingPoints = [{x: Math.round(canvasSize.width / 2), y: Math.round(canvasSize.height / 2)}];
        
        const curves = startingPoints.map((start) => {
            const curve = new Curve(p5, { start, steps: 1000, flowField, step: 10 })
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
            // p5.stroke(244, 85, 49, 100);
            p5.stroke(0, 0, 0, 100);
            p5.fill(0, 0)
            p5.beginShape();
            curve.vertices.forEach(({x, y}, index) => {
                p5.curveVertex(x, y);
                if (index === 0 || index === curve.vertices.length - 1) {
                    // First and last vertices are curve control points, so we are repeating them to get anchor points.
                    p5.curveVertex(x, y);
                }
            })
            p5.endShape();
            /*
            // Dots at vertices
            p5.strokeWeight(3)
            p5.stroke(0, 0, 0, 255);
            curve.vertices.forEach(({x, y}) => {
                p5.point(x, y)
            })
            
            // Red dot at start
            p5.strokeWeight(5)
            p5.stroke(255, 0, 0, 255);
            p5.point(curve.vertices[0].x, curve.vertices[0].y)*/
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));

