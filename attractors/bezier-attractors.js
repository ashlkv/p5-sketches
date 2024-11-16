/** Gravitational or mutual attraction, https://natureofcode.com/book/chapter-2-forces/#29-gravitational-attraction */

import {Attractor} from "./attractor.js";
import {poissonSample, randomSample} from '../common/noise.js'
import {absoluteToRelativePolygon, getClosestPoints, getPolygonDirection, rotatePolygon} from "../common/geometry.js";
import {FlowField} from "../common/flow-field.js";
import {getGrowth} from "../common/collatz.js";
import {Grid} from "../common/grid.js";

window.P5 = p5;

new p5((p5) => {
    const seed = Date.now() /*1729449584522*/;
    console.log('seed', seed)
    p5.randomSeed(seed)
    p5.noiseSeed(seed)
    
    const width = window.innerWidth;
    const height = window.innerHeight;
    const canvasSize = { width, height };
    const center = { x: canvasSize.width / 2, y: canvasSize.height / 2 };
    let attractors = [];
    const count = 2;
    const colors = ['#ff0000ff', '#00ff0066', '#0000ff', '#000000', '#ff00ff', '#ffff00', '#00ffff']
    const opacities = [1, 0.5, 0.5]
    let steps = 200;
    const flowField = new FlowField(p5, {width, height, cellSize: 1, initialize: (column, row) => p5.noise(column, row)    });
    let growth = getGrowth(p5, {
        from: 400,
        origin: {x: width * 0.4, y: height * 0.25},
        initialAngle: - p5.PI,
        roundness: 3,
        step: 75,
        optimized: true
    }).reverse()
    
    
    const getNextOriginInGrowth = () => {
        if (growth[0].length === 0) {
            growth = growth.slice(1)
        }
        return growth[0].pop();
    }
    
    let angle = 0
    let phase = 0
    const noiseMax = 5;
    
    let frameCount = 0;
    
    window.save = (name) => {
        console.log('seed', seed)
        p5.save(name);
    }
    window.stop = () => {
        p5.endShape()
        p5.noLoop()
    }
    
    const getAttractors = (radius = 100, origin = {x: 0, y: 0}, even = false) => {
        const startingAngle = p5.random(0, p5.TWO_PI);
        return new Array(count).fill({ x: 0, y: 0 }).map((element, index) => {
            const angle = even ? startingAngle + p5.TWO_PI / count * index : p5.random(0, p5.TWO_PI);
            const vector = P5.Vector.fromAngle(angle, radius)
            const position = { x: origin.x + vector.x, y: origin.y + vector.y };
            return new Attractor(p5, p5.createVector(position.x, position.y), P5.Vector.random2D(), 10)
            // return new Attractor(p5, p5.createVector(position.x, position.y), P5.Vector.fromAngle(index ? startingAngle : -startingAngle), 10)
        })
    }
    
    const getNextOriginInLoop = (angle, phase, noiseMax, origin, radiusMax = 200) => {
        const xOffset = p5.map(p5.cos(angle + phase), -1, 1, 0, noiseMax);
        const yOffset = p5.map(p5.sin(angle + phase), -1, 1, 0, noiseMax);
        const noise = p5.noise(xOffset, yOffset);
        const radius = p5.map(noise, 0, 1, radiusMax / 2, radiusMax);
        const vector = P5.Vector.fromAngle(angle, radius);
        return { x: origin.x + vector.x, y: origin.x + vector.y }
    }
    
    const grid = new Grid(p5, Math.round(width / 100), Math.round(height / 100))
    const getNextOriginInGrid = () => {
        const { column, row } = grid.next()
        return { x: column * 100 + 50, y: row * 100 + 50 }
    }
    
    p5.setup = () => {
        p5.createCanvas(width, height, p5.SVG);
        p5.background(255);
        p5.frameRate(2);
        p5.noFill();
        p5.noLoop()
        
        // p5.beginShape()
    }
    
    p5.draw = () => {
        p5.noFill();
        p5.stroke(0);
        p5.strokeWeight(2)
        const first = []
        const second = []
        
        new Array(125).fill().forEach(() => {
            let curves = new Array(count).fill(undefined).map(() => [])
            
            // const origin = randomSample(p5, 1, canvasSize.width, canvasSize.height)[0];
            // const origin = poissonSample(p5, 1, canvasSize.width, canvasSize.height)[0];
            // const origin = getNextOriginInLoop(angle, phase, noiseMax, center, 400)
            // const origin = getNextOriginInGrid()
            const origin = getNextOriginInGrowth()
            // const origin = getNextOriginInLines()
            // const origin = endOfWord;
            // const origin = {x: canvasSize.width / 2, y: canvasSize.height / 2}
            
            // Centers
            // p5.strokeWeight(5)
            // p5.stroke(0)
            // p5.point(origin.x, origin.y)
            
            angle += 0.1
            phase += p5.PI / 3
            
            const noise = flowField.getValueAtPoint(origin)
            let radius = Math.round(noise * 50);
            if (!radius) {
                return;
            }
            radius = Math.min(radius, 30)
            attractors = getAttractors(radius, origin, false);
            steps = /*Math.abs(noise) < 0.5 ? radius * 10 : radius * 50*/ radius * 20;
            
            Array(steps).fill().forEach(() => {
                for (const attractor of attractors) {
                    for (const other of attractors) {
                        if (attractor !== other) {
                            attractor.attract(other)
                        }
                    }
                }
                
                attractors.forEach((attractor, index) => {
                    attractor.update();
                    p5.strokeWeight(2)
                    // if (index > 0) {
                    //     return;
                    // }
                    p5.stroke(colors[index] || '#000000')
                    // p5.point(attractor.position.x, attractor.position.y)
                    curves[index].push({x: attractor.position.x, y: attractor.position.y})
                });
            })
            
            // const start = getNextOriginInGrowth()
            
            if (curves[0].length >= 2) {
                first.push(curves[0])
                second.push(curves[1])
            }
        })
        
        // const averageStart = {x: (curves[0][0].x + curves[1][0].x) / 2, y: (curves[0][0].y + curves[1][0].y) / 2};
        // let isReversed = getPolygonDirection(p5, curves[0]) < 0;
        // const direction = getPolygonDirection(p5, curves[0]);
        // vertices = absoluteToRelativePolygon(vertices, averageStart);
        // if (isReversed) {
        //     vertices = vertices.reverse();
        // }
        // vertices = rotatePolygon(vertices, averageStart, -direction);
        first.forEach((vertices, index) => {
            p5.strokeWeight(1)
            p5.stroke(colors[0])
            p5.beginShape()
            vertices.forEach(({x, y}) => {
                p5.curveVertex(x, y)
            })
            p5.endShape()
        })
        second.forEach((vertices, index) => {
            p5.strokeWeight(1)
            p5.stroke(colors[1])
            p5.beginShape()
            vertices.forEach(({x, y}) => {
                p5.curveVertex(x, y)
            })
            p5.endShape()
        })
        
    }
}, document.querySelector('main'))
