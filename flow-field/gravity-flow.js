window.P5 = p5;

import Repeller from './Repeller.js';

const poissonSample = function(count, width, height) {
  let distance = width / Math.sqrt((count * height) / width);
  let sampling = new PoissonDiskSampling({
    shape: [width, height],
    minDistance: distance * 0.8,
    maxDistance: distance * 1.6,
    tries: 15
  });
  return sampling.fill().map(([x, y]) => ({x, y}));
}

const randomSample = function(p5, count, width, height) {
  return Array(count).fill().map(() => ({x: Math.round(p5.random(0, width - 1)), y: Math.round(p5.random(0, height - 1)) }))
}

const anchorSample = (p5, count, anchor, width, height) => {
    return Array(count).fill().map(() => ({x: Math.round(p5.random(0, width - 1) + anchor.x - width / 2), y: Math.round(p5.random(0, height - 1) + anchor.y - height / 2) }))
}

function FlowLine(p5, {column, row, cellSize, angle}) {
    this.angle = angle;
    this.radius = cellSize / 2;
    this.vector = P5.Vector.fromAngle(this.angle, this.radius)
    this.anchor = { x: column * cellSize, y: row * cellSize }
    
    this.render = () => {
        this.vector = P5.Vector.fromAngle(this.angle, this.radius)
        const { x: x1, y: y1 } = this.anchor;
        const { x: x2, y: y2 } = { x: this.anchor.x + this.vector.x, y: this.anchor.y + this.vector.y }
        p5.strokeWeight(1)
        p5.stroke(255, 0, 0, 50);
        p5.line(x1, y1, x2, y2)
        
        // Dot at the end
        p5.strokeWeight(3)
        p5.stroke(255, 0, 0, 50);
        p5.point(x2, y2)
    }
}

function FlowField(p5, { width, height, cellSize, initialize = (column, row) => {} }) {
    this.width = width;
    this.height = height
    this.values = Array(height).fill()
                    .map((value, row) => Array(width).fill()
                        .map((value, column) => initialize(column, row)))
    const cellDiagonal = p5.dist(0, 0, cellSize, cellSize);
    
    const isInBounds = ({ column, row }, {width, height}) => {
        return column >= 0 && row >= 0 && column <= width - 1 && row <= height - 1
    }
    
    /** Gets closest vector to the point specified in pixels */
    this.getValueAt = ({x, y}) => {
        const column = Math.round(x / cellSize);
        const row = Math.round(y / cellSize);
        if (!isInBounds({ column, row }, { width, height })) {
            return undefined;
        }
        return this.values[row][column]
    }
    
    this.getWeightedAverageAt = ({x, y}) => {
        const column = x / cellSize;
        const row = y / cellSize;
        const anchor1 = { row: Math.floor(row), column: Math.floor(column) }
        const anchor2 = { row: Math.floor(row), column: Math.ceil(column) }
        const anchor3 = { row: Math.ceil(row), column: Math.ceil(column) }
        const anchor4 = { row: Math.ceil(row), column: Math.floor(column) }
        const values = [anchor1, anchor2, anchor3, anchor4]
            .filter(({ column, row }) => isInBounds({ column, row }, { width, height }))
            .map(({ column, row }) => {
                const value = this.values[row][column];
                const distance = p5.dist(x, y, column * cellSize, row * cellSize);
                return { value, weight: cellDiagonal - distance }
            })
        if (values.length === 0) {
            return undefined
        }
        const weights = values.reduce((sum, {weight}) => sum + weight, 0)
        return values.reduce((sum, {value, weight}) => sum + value * weight, 0) / weights
    }
    
    this.render = () => {
        this.values.forEach((columns, row) => columns.forEach((value, column) => {
            const line = new FlowLine(p5, { column, row, cellSize, angle: value })
            line.render()
        }))
    }
}

function Curve(p5, { flowField, repellers = [], start, steps, step = 10, darkMode = false }) {
    this.vertices = [start];
    for (let i = 0; i < steps; i++) {
        const point = this.vertices[i];
        const vector = p5.createVector(point.x, point.y);
        const value = flowField.getWeightedAverageAt(point);
        if (value === undefined) {
            break;
        }
        const force = P5.Vector.fromAngle(value, step)
        vector.add(force)
        if (repellers.length > 0) {
            for (const repeller of repellers) {
                const repel = repeller.repel(vector);
                vector.add(repel);
            }
        }
        this.vertices.push({x: vector.x, y: vector.y})
    }
    
    this.render = () => {
        p5.strokeWeight(1)
        // p5.stroke(244, 85, 49, 100);
        darkMode ? p5.stroke(255, 255, 255, 100) : p5.stroke(0, 0, 0, 100);
        p5.fill(0, 0)
        p5.beginShape();
        const length = this.vertices.length;
        this.vertices.forEach(({x, y}, index) => {
            p5.curveVertex(x, y);
            if (index === 0 || index === length - 1) {
                // First and last vertices are curve control points, so we are repeating them to get anchor points.
                p5.curveVertex(x, y);
            }
        })
        p5.endShape();
    }
    
    this.renderVertices = () => {
        // Dots at vertices
        p5.strokeWeight(3)
        p5.stroke(0, 0, 0, 255);
        this.vertices.forEach(({x, y}) => {
            p5.point(x, y)
        })
    }
    
    this.renderStartingVertex = () => {
        p5.strokeWeight(5)
        p5.stroke(255, 0, 0, 255);
        p5.point(this.vertices[0].x, this.vertices[0].y)
    }
}

new p5((p5) => {
    const cellSize = 20;
    const noiseIncrement = 0.1;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    const controls = {};
    // const canvasSize = { width: Math.floor(640 / cellSize) * cellSize, height: Math.floor(480 / cellSize) * cellSize }
    let flowField;
    let repellers = [];
    window.save = (name) => p5.save(name)
    window.p5 = p5
    
    const initialize = (initialSeed) => {
        const seed = initialSeed ?? p5.floor(p5.random(9999999));
        console.log('seed:', seed)
        p5.noiseSeed(seed);
        p5.randomSeed(seed);
        window.seed = seed;
        
        // const getNoiseValue = (column, row) => p5.noise(column * noiseIncrement, row * noiseIncrement) * p5.TWO_PI * 3
        // const getConstantValue = () => p5.PI / 2
        const getSlightNoiseValue = (column, row) => {
            const main = p5.PI / 2;
            const range = p5.PI / 2;
            const variation = p5.noise(column * noiseIncrement, row * noiseIncrement) * range;
            return main - range / 2 + variation
        }
        flowField = new FlowField(p5, {width: canvasSize.width / cellSize, height: canvasSize.height / cellSize, cellSize, initialize: getSlightNoiseValue})
        window.flowField = flowField
    }
    
    const initializeRepellers = () => {
        if (controls.repellerOn.checked()) {
            // repellers = poissonSample( 10, canvasSize.width, canvasSize.height * 0.66).map(({ x, y }) => new Repeller(p5, x, canvasSize.height * 0.33 + y))
            repellers = randomSample(p5,  25, canvasSize.width, canvasSize.height * 0.66).map(({ x, y }) => new Repeller(p5, x, canvasSize.height * 0.33 + y))
            repellers.forEach((repeller) => {
                repeller.power = p5.random(controls.repellerPower.value());
            })
            // repellers = [
            //     new Repeller(p5, canvasSize.width * 0.5, canvasSize.height * 0.5, power)
            // ];
        } else {
            repellers = [];
        }
    }
    
    p5.setup = () => {
        p5.frameRate(1)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        // p5.noiseDetail(2, 0.25)
        
        const container = document.querySelector('#controls');
        controls.count = p5.createSlider(0, 1000, 500, 10);
        controls.count.parent(container)
        controls.count.elt.onchange = () => {
            p5.draw();
        }
        controls.repellerPower = p5.createSlider(0, 2000, 1000, 10);
        controls.repellerPower.parent(container)
        controls.repellerPower.elt.onchange = () => {
            const power = p5.random(controls.repellerPower.value());
            repellers.forEach(repeller => {
                repeller.power = p5.random(controls.repellerPower.value());
            })
            p5.draw();
        }
        controls.repellerOn = p5.createCheckbox('Repellers', true);
        controls.repellerOn.parent(container)
        controls.repellerOn.elt.onchange = () => {
            initializeRepellers();
            p5.draw();
        }
        controls.seed = p5.createButton('Seed');
        controls.seed.parent(container)
        controls.seed.elt.onclick = () => {
            initialize();
            p5.draw();
        }
        controls.rerender = p5.createButton('Re-render');
        controls.rerender.parent(container)
        controls.rerender.elt.onclick = () => {
            p5.draw();
        }
        
        const initialSeed = /*1009208*/ 6888242;
        initialize(initialSeed);
        initializeRepellers();
    }

    p5.draw = () => {
        p5.background(0, 0, 0)
        
        repellers.forEach((repeller) => repeller.render())
        flowField.render()
        
        const count = controls.count.value()
        // const startingPoints = poissonSample(count, canvasSize.width, canvasSize.height);
        // const startingPoints = randomSample(p5, count, canvasSize.width, canvasSize.height);
        // const startingPoints = [{x: Math.round(p5.random(canvasSize.width)), y: Math.round(p5.random(canvasSize.height))}];
        // const startingPoints = [{x: Math.round(p5.random(canvasSize.width)), y: Math.round(p5.random(canvasSize.height))}];
        // const startingPoints = [{x: Math.round(canvasSize.width * 0.25), y: Math.round(canvasSize.height * 0.25)}];
        const startingPoints = anchorSample(p5, count, {x: canvasSize.width / 2, y: 20}, canvasSize.width, 10);
        
        startingPoints.forEach((start) => {
            const curve = new Curve(p5, {start, steps: 500, flowField, repellers, step: 5, darkMode: true})
            curve.render();
            // curve.renderVertices();
            // curve.renderStartingVertex();
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));
