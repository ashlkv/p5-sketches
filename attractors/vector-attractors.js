/** Gravitational or mutual attraction, https://natureofcode.com/book/chapter-2-forces/#29-gravitational-attraction */

import {Attractor} from "./attractor.js";
import {poissonSample, randomSample} from '../common/noise.js'

window.P5 = p5;

function Repeller(p5, {x, y}, power = 150) {
    this.position = p5.createVector(x, y);
    this.power = power;
    
    this.repel = function(particle) {
        let force = P5.Vector.sub(this.position, particle.position);
        let distance = force.mag();
        distance = p5.constrain(distance, 5, 50);
        let strength = (-1 * this.power) / (distance * distance);
        force.setMag(strength);
        return force;
    }
}

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    let attractors = [];
    let repellers = [];
    const count = 4;
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#000000', '#ff00ff', '#ffff00', '#00ffff']
    const curves = new Array(count).fill(undefined).map(() => [])
    
    window.stop = () => {
        p5.noLoop()
        curves.forEach((vertices, index) => {
            p5.strokeWeight(1)
            p5.stroke(colors[index])
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
        p5.frameRate(60);
        
        // repellers = randomSample(p5, 4, width, height).map(({x, y}) => {
        //     return new Repeller(p5, {x, y}, 200)
        // })
        // repellers = [new Repeller(p5, {x: width / 2, y: height / 2}, 1000)]
        
        // attractors = randomSample(p5, count, width, height).map(({ x, y }) => {
        //     return new Attractor(p5, p5.createVector(x, y), P5.Vector.random2D(), 10)
        // })
        // attractors = poissonSample(count, width, height).slice(0, count).map(({ x, y }) => {
        //     return new Attractor(p5, p5.createVector(x, y), P5.Vector.random2D(), 10)
        // })
        
        // Top, right, bottom and left quarters
        // attractors[0] = new Attractor(p5, new P5.Vector(p5.random(0, width * 0.25), p5.random(0, height * 0.25)), P5.Vector.random2D(), 40)
        // attractors[1] = new Attractor(p5, new P5.Vector(p5.random(width * 0.75, width), p5.random(0, height * 0.25)), P5.Vector.random2D(), 40)
        // attractors[3] = new Attractor(p5, new P5.Vector(p5.random(width * 0.75, width), p5.random(height * 0.75, height)), P5.Vector.random2D(), 40)
        // attractors[2] = new Attractor(p5, new P5.Vector(p5.random(0, width * 0.25), p5.random(height * 0.75, height)), P5.Vector.random2D(), 40)
        
        attractors[0] = new Attractor(p5, P5.Vector.random2D(), P5.Vector.random2D(), 10)
        attractors[1] = new Attractor(p5, new P5.Vector(50, 200), P5.Vector.random2D(), 10)
        attractors[2] = new Attractor(p5, new P5.Vector(200, 350), P5.Vector.random2D(), 10)
        attractors[3] = new Attractor(p5, new P5.Vector(200, 50), P5.Vector.random2D(), 10)
        
        repellers.forEach((repeller) => {
            const { x, y } = repeller.position;
            p5.circle(x, y, 50)
        })
        console.log('say stop() when enough')
    }
    
    p5.draw = () => {
        p5.noFill();
        p5.stroke(0);
        p5.strokeWeight(2)
        
        for (const attractor of attractors) {
            for (const other of attractors) {
                if (attractor !== other) {
                    attractor.attract(other)
                }
            }
            for (const repeller of repellers) {
                let force = repeller.repel(attractor);
                attractor.applyForce(force);
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
