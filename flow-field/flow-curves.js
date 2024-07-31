window.P5 = p5;

function FlowLine(p5, {column, row, noiseIncrement, cellSize, visible = false}) {
    this.angle;
    this.radius = cellSize / 2;
    this.vector;
    this.oppositeVector;
    this.anchor = { x: column * cellSize, y: row * cellSize }
    
    this.update = (time = undefined) => {
        // Using PI will make the field less wavy
        this.angle = p5.noise(column * noiseIncrement, row * noiseIncrement, time) * p5.TWO_PI * 3;
        this.vector = P5.Vector.fromAngle(this.angle, this.radius)
        this.oppositeVector = P5.Vector.fromAngle(this.angle + p5.PI, this.radius);
        if (visible) {
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

    this.update()
}

function FlowField(p5, { width, height, noiseIncrement, cellSize, visible }) {
    this.width = width;
    this.height = height
    this.lines = Array(height).fill()
                    .map((value, row) => Array(width).fill()
                        .map((value, column) => new FlowLine(p5,{column, row, noiseIncrement, cellSize, visible})))
    
    /** Gets closest vector to the point specified in pixels */
    this.getVectorAt = ({x, y}) => {
        const column = Math.round(x / cellSize);
        const row = Math.round(y / cellSize);
        if (column < 0 || row < 0 || column > width - 1 || row > height - 1) {
            return undefined;
        }
        return this.lines[row][column].vector
    }
}

function Curve(p5, { flowField, start, steps, step = 10 }) {
    this.vertices = [start];
    for (let i = 0; i < steps; i++) {
        const point = this.vertices[i];
        const vector = p5.createVector(point.x, point.y);
        const force = flowField.getVectorAt(point);
        if (!force) {
            break;
        }
        force.setMag(step);
        vector.add(force)
        this.vertices.push({x: vector.x, y: vector.y})
    }
}

new p5((p5) => {
    const cellSize = 15;
    const noiseIncrement = 0.05;
    const canvasSize = { width: Math.floor(window.innerWidth / cellSize) * cellSize, height: Math.floor(window.innerHeight / cellSize) * cellSize }
    let time = 0;
    let flowField;
    let canvas;

    p5.setup = () => {
        p5.frameRate(5)
        canvas = p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        
        flowField = new FlowField(p5, {width: canvasSize.width / cellSize, height: canvasSize.height / cellSize, noiseIncrement, cellSize, visible: true})
        window.flowField = flowField
    }

    p5.draw = () => {
        Array(100).fill().forEach((element, index) => {
            const start = {
                x: p5.random(canvasSize.width),
                y: p5.random(canvasSize.height)
            }
            const curve = new Curve(p5, { start, steps: 10, flowField, step: 30 })
            
            p5.strokeWeight(1)
            p5.stroke(0, 0, 0, 100);
            p5.fill(0, 0)
            p5.beginShape();
            
            const {x, y} = curve.vertices[0];
            // Somehow it's necessary to repeat the start point twice for the curve
            p5.curveVertex(x, y);
            curve.vertices.forEach(({x, y}) => {
                p5.curveVertex(x, y);
            })
            p5.endShape();
            
            /*p5.strokeWeight(3)
            p5.stroke(255, 0, 0, 255);
            p5.point(curve.vertices[0].x, curve.vertices[0].y);*/
            
            p5.strokeWeight(3)
            p5.stroke(0, 0, 0, 255);
            curve.vertices.forEach(({x, y}) => {
                p5.point(x, y)
            })
        })
        
        // p5.save('flow-curves.svg')
        p5.noLoop();
    }
}, document.querySelector('main'));
