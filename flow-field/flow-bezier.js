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
}

function BezierCurve(p5, { flowField, start, steps, step = 10, handle = 50 }) {
    this.vertices = [start];
    this.points = []
    for (let index = 0; index < steps; index++) {
        const anchor = this.vertices[index];
        const vector = p5.createVector(anchor.x, anchor.y);
        const angle = flowField.getWeightedAverageAt(anchor);
        if (angle === undefined) {
            break;
        }
        const force = P5.Vector.fromAngle(angle, step)
        vector.add(force)
        const vertex = {x: vector.x, y: vector.y}
        this.vertices.push(vertex);
        // even: control point looks forward
        // odd: control point looks back
        const handleVector1 = P5.Vector.fromAngle(angle - p5.PI, handle);
        const handleVector2 = P5.Vector.fromAngle(angle, handle);
        const controlVector1 = p5.createVector(anchor.x, anchor.y).add(handleVector1)
        const controlVector2 = p5.createVector(anchor.x, anchor.y).add(handleVector2)
        const control1 = { x: controlVector1.x, y: controlVector1.y }
        const control2 = { x: controlVector2.x, y: controlVector2.y }
        this.points.push({ anchor, control1, control2 })
    }
    this.segments = this.points.reduce((segments, { control1: control2, anchor: anchor2 }, index, points) => {
        if (index === 0) {
            return segments;
        }
        const {anchor: anchor1, control2: control1} = points[index - 1];
        segments.push({ anchor1, anchor2, control1, control2 })
        return segments
    }, [])
}

new p5((p5) => {
    const cellSize = 50;
    const noiseIncrement = 0.1;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    // const canvasSize = { width: Math.floor(640 / cellSize) * cellSize, height: Math.floor(480 / cellSize) * cellSize }
    let flowField;
    window.save = (name) => p5.save(name)

    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        // p5.noiseDetail(2, 0.25)
        flowField = new FlowField(p5, {width: canvasSize.width / cellSize, height: canvasSize.height / cellSize, noiseIncrement, cellSize})
        window.flowField = flowField
        window.p5 = p5;
    }

    p5.draw = () => {
        flowField.values.forEach((columns, row) => columns.forEach((value, column) => {
            const line = new FlowLine(p5, { column, row, cellSize, angle: value })
            line.render()
        }))
        
        const startingPoints = sample(1000, canvasSize.width, canvasSize.height);
        // const startingPoints = [{x: Math.round(p5.random(canvasSize.width)), y: Math.round(p5.random(canvasSize.height))}];
        // const startingPoints = [{x: Math.round(canvasSize.width / 2), y: Math.round(canvasSize.height / 2)}];
        startingPoints.forEach((start) => {
            const curve = new BezierCurve(p5, { start, steps: 10, flowField, step: 30, handle: 125 })
            p5.strokeWeight(1)
            // p5.stroke(244, 85, 49, 100);
            p5.stroke(0, 0, 0, 100);
            p5.fill(0, 0)
            curve.segments.forEach(({ anchor1, anchor2, control1, control2 }, index, vertices) => {
                p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
            })
            /*
            // Dots at anchor
            p5.strokeWeight(3)
            p5.stroke(0, 0, 0, 255);
            curve.segments.forEach(({anchor1, anchor2}) => {
                p5.point(anchor1.x, anchor1.y)
                p5.point(anchor2.x, anchor2.y)
            })
            
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
            
            // Red dot at start
            p5.strokeWeight(5)
            p5.stroke(255, 0, 0, 255);
            p5.point(curve.vertices[0].x, curve.vertices[0].y)*/
            window.curve = curve
        })
        
        p5.noLoop();
    }
}, document.querySelector('main'));
