window.P5 = p5;

function FlowLine(p5, {column, row, noiseIncrement, cellSize, visible = false}) {
    this.angle;
    this.radius = cellSize / 2;
    this.vector;
    this.oppositeVector;
    this.anchor = { x: column * cellSize, y: row * cellSize }
    
    this.update = (time = undefined) => {
        // Using PI will make the field less wavy
        this.angle = p5.noise(column * noiseIncrement, row * noiseIncrement, time) * p5.TWO_PI * 2;
        this.vector = P5.Vector.fromAngle(this.angle, this.radius)
        this.oppositeVector = P5.Vector.fromAngle(this.angle + p5.PI, this.radius);
        if (visible) {
            const { x: x1, y: y1 } = this.anchor;
            const { x: x2, y: y2 } = { x: this.anchor.x + this.vector.x, y: this.anchor.y + this.vector.y }
            p5.strokeWeight(1)
            p5.stroke(0, 100);
            p5.line(x1, y1, x2, y2)
            
            // Dot at the end
            p5.strokeWeight(3)
            p5.stroke(0, 100);
            p5.point(x2, y2)
        }
    }

    this.update()
}

function FlowField(p5, { width, height, noiseIncrement, cellSize }) {
    this.width = width;
    this.height = height
    this.lines = Array(height).fill()
                    .map((value, row) => Array(width).fill()
                        .map((value, column) => new FlowLine(p5,{column, row, noiseIncrement, cellSize, visible: true})))
    
    /** Gets closest vector to the point specified in pixels */
    this.getVectorAt = ({x, y}) => {
        const column = Math.min(Math.max(Math.round(x / cellSize), 0), width - 1);
        const row = Math.min(Math.max(Math.round(y / cellSize), 0), height - 1);
        return this.lines[row][column].vector
    }
}

function Curve(p5, { flowField, start, steps, step = 10 }) {
    this.vertices = [start];
    for (let i = 0; i < steps; i++) {
        const point = this.vertices[i];
        const vector = p5.createVector(point.x, point.y);
        const force = flowField.getVectorAt(point);
        force.setMag(step);
        vector.add(force)
        this.vertices.push({x: vector.x, y: vector.y})
    }
}

new p5((p5) => {
    const cellSize = 15;
    const noiseIncrement = 0.01;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    let time = 0;
    let flowField;

    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height);
        
        flowField = new FlowField(p5, {width: canvasSize.width / cellSize, height: canvasSize.height / cellSize, noiseIncrement, cellSize})
        window.flowField = flowField
    }

    p5.draw = () => {
        const start = { x: 315, y: 37 }
        const curve = new Curve(p5, { start, steps: 100, flowField, step: 50 })
        
        p5.strokeWeight(3)
        p5.stroke(255, 0, 0, 100);
        p5.fill(0, 0)
        p5.beginShape();
        
        const {x, y} = curve.vertices[0];
        // Somehow it's necessary to repeat the start point twice for the curve
        p5.curveVertex(x, y);
        curve.vertices.forEach(({x, y}) => {
            p5.curveVertex(x, y);
        })
        p5.endShape();
        
        p5.strokeWeight(3)
        p5.stroke(255, 0, 0, 255);
        curve.vertices.forEach(({x, y}) => {
            p5.point(x, y)
        })
        p5.noLoop();
    }
}, document.querySelector('main'));
