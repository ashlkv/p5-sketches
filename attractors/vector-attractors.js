/** Gravitational or mutual attraction, https://natureofcode.com/book/chapter-2-forces/#29-gravitational-attraction */

import {Attractor} from "./attractor.js";

window.P5 = p5;

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const attractors = [];

    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(255);
        p5.frameRate(25);
        
        attractors[0] = new Attractor(p5, P5.Vector.random2D(), P5.Vector.random2D(), 10)
        attractors[1] = new Attractor(p5, new P5.Vector(50, 200), P5.Vector.random2D(), 10)
        attractors[2] = new Attractor(p5, new P5.Vector(200, 350), P5.Vector.random2D(), 10)
        attractors[3] = new Attractor(p5, new P5.Vector(200, 50), P5.Vector.random2D(), 10)
    }

    p5.draw = () => {
        p5.stroke(0);
        
        Array(100).fill().forEach(() => {
            for (const attractor of attractors) {
                for (const other of attractors) {
                    if (attractor !== other) {
                        attractor.attract(other)
                    }
                }
            }
            
            
        })
        for (const attractor of attractors) {
            attractor.update();
            attractor.render();
        }
        
        
    }
}, document.querySelector('main'))
