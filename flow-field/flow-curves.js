window.P5 = p5;

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

function FlowField(p5, { width, height, noiseIncrement, cellSize }) {
    this.width = width;
    this.height = height
    this.values = Array(height).fill()
                    .map((value, row) => Array(width).fill()
                        .map((value, column) => p5.noise(column * noiseIncrement, row * noiseIncrement) * p5.TWO_PI * 3))
    
    /** Gets closest vector to the point specified in pixels */
    this.getValueAt = ({x, y}) => {
        const column = Math.round(x / cellSize);
        const row = Math.round(y / cellSize);
        if (column < 0 || row < 0 || column > width - 1 || row > height - 1) {
            return undefined;
        }
        return this.values[row][column]
    }
}

function Curve(p5, { flowField, start, steps, step = 10 }) {
    this.vertices = [start];
    for (let i = 0; i < steps; i++) {
        const point = this.vertices[i];
        const vector = p5.createVector(point.x, point.y);
        const value = flowField.getValueAt(point);
        if (!value) {
            break;
        }
        const force = P5.Vector.fromAngle(value, step)
        vector.add(force)
        this.vertices.push({x: vector.x, y: vector.y})
    }
}

new p5((p5) => {
    const cellSize = 50;
    const noiseIncrement = 0.05;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    let flowField;
    window.save = (name) => p5.save(name)

    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        flowField = new FlowField(p5, {width: canvasSize.width / cellSize, height: canvasSize.height / cellSize, noiseIncrement, cellSize})
        window.flowField = flowField
    }

    p5.draw = () => {
        flowField.values.forEach((columns, row) => columns.forEach((value, column) => {
            const line = new FlowLine(p5, { column, row, cellSize, angle: value })
            line.render()
        }))
        
        const startingPoints = sample(1, canvasSize.width, canvasSize.height);
        startingPoints.forEach((start) => {
            const curve = new Curve(p5, { start, steps: 10, flowField, step: cellSize })
            p5.strokeWeight(1)
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
            
            p5.strokeWeight(3)
            p5.stroke(0, 0, 0, 255);
            curve.vertices.forEach(({x, y}) => {
                p5.point(x, y)
            })
            
            p5.strokeWeight(5)
            p5.stroke(255, 0, 0, 255);
            p5.point(curve.vertices[0].x, curve.vertices[0].y)
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));