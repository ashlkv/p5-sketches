import {curve} from './curve.js';
import {movePolygon, getPolygonDirection, rotatePolygon} from '../common/geometry.js';

window.P5 = p5;

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        p5.background(255);
    }
    
    p5.draw = () => {
        p5.stroke('#000000')
        p5.strokeWeight(1)
        p5.noFill()
        
        p5.beginShape()
        curve.forEach(({x, y}) => {
            p5.curveVertex(x, y)
        })
        p5.endShape()
        
        
        const direction = getPolygonDirection(p5, curve);
        const start = curve[0];
        const { x: x1, y: y1 } = start
        const vector = P5.Vector.fromAngle(direction);
        vector.setMag(300);
        p5.stroke('#0000ff');
        p5.line(x1, y1, x1 + vector.x, y1 + vector.y)
    
        const rotated = rotatePolygon(curve, start, -direction);
        p5.stroke('#ff0000')
        p5.beginShape()
        rotated.forEach(({x, y}) => {
            p5.curveVertex(x, y)
        })
        p5.endShape()
        
        p5.noLoop();
    }
}, document.querySelector('main'));
