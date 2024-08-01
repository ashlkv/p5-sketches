window.P5 = p5;

import {Vector} from "./modules/vector.js";
import {Curve} from "./modules/curve.js";

const range = (start, end) => {
    const isEndDef = typeof end !== 'undefined'
    end = isEndDef ? end : start
    start = isEndDef ? start : 0
    
    const increment = Math.sign(end - start)
    const length = Math.abs((end - start) / (increment || 1))
    
    const {result} = Array.from({length}).reduce(
        ({result, current}) => ({
            result: [...result, current],
            current: current + increment,
        }),
        {current: start, result: []}
    )
    return result
}

const sample = function(count, width, height) {
  let distance = width / Math.sqrt((count * height) / width);
  let sampling = new PoissonDiskSampling({
    shape: [width, height],
    minDistance: distance * 0.8,
    maxDistance: distance * 1.6,
    tries: 15
  });
  return sampling.fill().map(([x, y]) => ({x, y}));
}

function fieldCurve(field, x, y, stepLength, numSteps) {
  let p = new Vector(x, y);
  let q = new Vector(x, y);
  let n = numSteps >> 1;
  let curve = new Curve(p);
  while (--n > 0) {
    let angle = field.getCell(p.x, p.y);
    if (angle === undefined) {
        break;
    }
    let v = new Vector(1, 0).rotate(angle).scale(stepLength);
    p = p.add(v);
    curve.push(p);
  }
  curve = curve.reverse();
  n = numSteps - (numSteps >> 1);
  while (--n > 0) {
    let angle = field.getCell(q.x, q.y);
        if (angle === undefined) {
          break;
      }
    let v = new Vector(-1, 0).rotate(angle).scale(stepLength);
    q = q.add(v);
    curve.push(q);
  }
  return curve;
}

function FlowLine(p5, {column, row, angle, radius, cellSize}) {
    this.vector = P5.Vector.fromAngle(angle, radius)
    this.anchor = { x: column * cellSize, y: row * cellSize }
    
    this.render = () => {
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

function Grid(width, height, cellSize) {
    const defaultAngle = Math.PI * 0.25
    
    this.width = width;
    this.height = height;
    this.cellSize = cellSize
    this.nx = Math.round(width / cellSize);
    this.ny = Math.round(height / cellSize);
    this.grid = range(this.nx)
        .map((ix) => range(this.ny).map((iy) => defaultAngle));
    
    this.getCell = (floatingColumn, floatingRow) => {
        const row = Math.round(floatingRow)
        const column = Math.round(floatingColumn)
        if (column < 0 || row < 0 || column > this.nx - 1 || row > this.ny - 1) {
            return undefined;
        }
        return this.grid[column][row];
    }
    this.getCellAtPoint = (x, y) => {
        const column = x / cellSize;
        const row = y / cellSize;
        return this.getCell(Math.round(column), Math.round(row));
    }
    // this.getCellAtPoint2 = (x, y) => {
    //     const column = x / cellSize;
    //     const row = y / cellSize;
    //     const angle1 = this.getCell(Math.floor(column), Math.floor(row));
    //     const angle2 = this.getCell(Math.ceil(column), Math.floor(row));
    //     const angle3 = this.getCell(Math.ceil(column), Math.ceil(row));
    //     const angle4 = this.getCell(Math.floor(column), Math.ceil(row));
    //     const value1 = p5.lerp(angle1, angle3, p5.dist())
    // }
    this.setCell = (ix, iy, angle) => {
      if (ix < this.nx && ix >= 0 && iy < this.ny && iy >= 0)
        this.grid[ix][iy] = angle;
    }
}
function FlowField(p5,
                    {
                        width,
                        height,
                        cellSize,
                        noiseScale = 1,
                        noiseOctaves = 2,
                        noiseOffset = 0,
                        seeds = [0, 0],
                        angleScale = 4
                    }) {
  let grid = new Grid(width, height, cellSize);
  let [seedX, seedY] = seeds;
  p5.noiseDetail(noiseOctaves);
  for (let i of range(grid.nx)) {
    for (let j of range(grid.ny)) {
      let angle =
        (noiseOffset +
          p5.noise(
            (seedX + i / grid.nx) * noiseScale,
            (seedY + j / grid.ny) * noiseScale
          )) *
        Math.PI *
        0.6 *
        angleScale;
      grid.setCell(i, j, angle);
    }
  }
  return grid;
}

/*function Curve(p5, { flowField, start, steps, step = 10 }) {
    this.vertices = [start];
    for (let i = 0; i < steps; i++) {
        const point = this.vertices[i];
        const vector = p5.createVector(point.x, point.y);
        const angle = flowField.getCellAtPoint(point.x, point.y);
        if (angle === undefined) {
            break;
        }
        const force = P5.Vector.fromAngle(angle, step)
        vector.add(force)
        this.vertices.push({x: vector.x, y: vector.y})
    }
}*/

new p5((p5) => {
    const cellSize = 10;
    const sizeRatio = 297 / 210;
    // const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerWidth / sizeRatio / cellSize) * cellSize }
    // const canvasSize = { width: 300, height: 200 }
    let time = 0;
    let flowField;
    let context;
    const seeds = [Math.random(), Math.random()]

    p5.setup = () => {
        p5.frameRate(5)
        const p5canvas = p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        context = p5canvas.canvas.getContext('2d');
        
        flowField = new FlowField(p5, {width: canvasSize.width, height: canvasSize.height, noiseOffset: 1, noiseScale: 1.4, noiseOctaves: 2, cellSize, angleScale: 10, seeds})
        window.flowField = flowField
    }

    p5.draw = () => {
        for (let i = 0; i < flowField.nx; i++) {
          for (let j = 0; j < flowField.ny; j++) {
              const angle = flowField.getCell(i, j);
              const line = new FlowLine(p5, { column: i, row: j, angle, radius: cellSize * 0.8, cellSize })
              line.render();
          }
        }
        const startingPoints = sample(100, canvasSize.width, canvasSize.height);
        startingPoints.forEach((start, index) => {
            // const curve = new Curve(p5, { start, steps: 7, flowField, step: 30 })
            const curve = fieldCurve(flowField, start.x, start.y, 2, 100)
            p5.strokeWeight(1)
            p5.stroke(0, 0, 0, 255);
            p5.fill(0, 0)
            p5.beginShape();
            
            curve.forEach(({x, y}, index) => {
                p5.curveVertex(x, y);
                if (index === 0 || index === curve.length - 1) {
                    // First and last vertices are curve control points, so we are repeating them to get anchor points.
                    p5.curveVertex(x, y);
                }
            })
            p5.endShape();
            
            /*p5.strokeWeight(3)
            p5.stroke(0, 0, 0, 255);
            curve.vertices.forEach(({x, y}) => {
                p5.point(x, y)
            })*/
        })
        
        window.save = (name) => p5.save(name)
        p5.noLoop();
    }
}, document.querySelector('main'));
