/** Gravitational or mutual attraction, https://natureofcode.com/book/chapter-2-forces/#29-gravitational-attraction */

import {Attractor} from "./attractor.js";
import {poissonSample, randomSample} from '../common/noise.js'
import {getClosestPoints} from "../common/geometry.js";

window.P5 = p5;

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let attractors = [];
    const count = 4;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#000000', '#ff00ff', '#ffff00', '#00ffff']
    
    // const curves = new Array(count).fill(undefined).map(() => [])
    
    // Intentional error: will push points to the same array
    const curves = new Array(count).fill([])
    
    window.curves = curves;
    
    window.stop = () => {
        p5.noLoop()
        p5.noFill();
        /*const polygon1 = curves[0]
        const polygon2 = curves[1]
        const points = getClosestPoints(p5, polygon1, polygon2)
        return points;*/
        
        curves.forEach((vertices, index) => {
            p5.strokeWeight(1)
            p5.stroke(0)
            p5.noFill();
            p5.beginShape();
            vertices.forEach(({x, y}) => {
                p5.curveVertex(x, y)
            })
            p5.endShape();
        })
    }
    window.save = (name) => p5.save(name)
    
    p5.setup = () => {
        p5.createCanvas(width, height, p5.SVG);
        p5.background(255);
        p5.frameRate(5);
        p5.noFill();
        
        // attractors = randomSample(p5, count, width, height).map(({ x, y }) => {
        //     return new Attractor(p5, p5.createVector(x, y), P5.Vector.random2D(), 10)
        // })
        // attractors = poissonSample(p5, count, width, height).slice(0, count).map(({ x, y }) => {
        //     return new Attractor(p5, p5.createVector(x, y), P5.Vector.random2D(), 10)
        // })
        
        // Top, right, bottom and left quarters
        attractors[0] = new Attractor(p5, new P5.Vector(p5.random(0, width * 0.25), p5.random(0, height * 0.25)), P5.Vector.random2D(), 40)
        attractors[1] = new Attractor(p5, new P5.Vector(p5.random(width * 0.75, width), p5.random(0, height * 0.25)), P5.Vector.random2D(), 40)
        attractors[3] = new Attractor(p5, new P5.Vector(p5.random(width * 0.75, width), p5.random(height * 0.75, height)), P5.Vector.random2D(), 40)
        attractors[2] = new Attractor(p5, new P5.Vector(p5.random(0, width * 0.25), p5.random(height * 0.75, height)), P5.Vector.random2D(), 40)
        
        // attractors[0] = new Attractor(p5, P5.Vector.random2D(), P5.Vector.random2D(), 10)
        // attractors[1] = new Attractor(p5, new P5.Vector(50, 200), P5.Vector.random2D(), 10)
        // attractors[2] = new Attractor(p5, new P5.Vector(200, 350), P5.Vector.random2D(), 10)
        // attractors[3] = new Attractor(p5, new P5.Vector(200, 50), P5.Vector.random2D(), 10)
    }
    
    p5.draw = () => {
        p5.noFill();
        p5.stroke(0);
        p5.strokeWeight(1)
        
        for (const attractor of attractors) {
            for (const other of attractors) {
                if (attractor !== other) {
                    attractor.attract(other)
                }
            }
        }
        
        attractors.forEach((attractor, index) => {
            attractor.update();
            p5.stroke(colors[index] || '#000000')
            p5.point(attractor.position.x, attractor.position.y)
            curves[index].push({x: attractor.position.x, y: attractor.position.y})
        });
    }
}, document.querySelector('main'))
