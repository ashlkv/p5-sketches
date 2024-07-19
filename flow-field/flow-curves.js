window.P5 = p5;

function FlowLine(p5, {column, row, noiseIncrement, cellSize, visible = false}) {
    this.angle;
    this.radius = 20;
    this.vector;
    this.oppositeVector;
    this.anchor = { x: column * cellSize, y: row * cellSize }
    
    this.update = (time = undefined) => {
        this.angle = p5.noise(column * noiseIncrement, row * noiseIncrement, time) * p5.TWO_PI;
        this.vector = P5.Vector.fromAngle(this.angle, this.radius)
        this.oppositeVector = P5.Vector.fromAngle(this.angle + p5.PI, this.radius);
        if (visible) {
            const { x: x1, y: y1 } = this.anchor;
            const { x: x2, y: y2 } = { x: this.anchor.x + this.vector.x, y: this.anchor.y + this.vector.y }
            p5.strokeWeight(1)
            p5.stroke(0, 50);
            p5.line(x1, y1, x2, y2)
        }
    }

    this.update()
}

function FlowBezier(p5, { anchor1, vector1, anchor2, vector2, visible = false }) {
    const control1 = { x: anchor1.x + vector1.x, y: anchor1.y + vector1.y }
    const control2 = { x: anchor2.x + vector2.x, y: anchor2.y + vector2.y };
    if (visible) {
        p5.strokeWeight(1)
        p5.stroke(0, 150);
        p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
    }
}

// FIXME There are probably built-in p5 methods
const cartesianToPolar = (point = { x, y }) => {
  const radius = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
  const degrees = (Math.atan2(point.y, point.x) * 180) / Math.PI;
  return { radius, degrees };
};

const polarToCartesian = (vector = { radius, degrees }) => {
  const radians = (vector.degrees * Math.PI) / 180.0;
  return { x: vector.radius * Math.cos(radians), y: vector.radius * Math.sin(radians) };
};

new p5((p5) => {
    const cellSize = 20;
    const noiseIncrement = 0.1;
    const canvasWidth = Math.floor(400 / cellSize) * cellSize;
    const canvasHeight = Math.floor(400 / cellSize) * cellSize;
    let time = 0;
    let flowField = [];

    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasWidth, canvasHeight);
        
        // Grid of dots
        // Array(canvasHeight / cellSize).fill()
        //     .forEach((value, row) => Array(canvasWidth / cellSize).fill()
        //         .forEach((value, column) => {
        //             p5.strokeWeight(3)
        //             p5.stroke(0, 100);
        //             p5.point(column * cellSize, row * cellSize)
        //         }));
        
        flowField = Array(canvasHeight / cellSize).fill()
            .map((value, row) => Array(canvasWidth / cellSize).fill()
                .map((value, column) => new FlowLine(p5,{column, row, noiseIncrement, cellSize, visible: false})));
    }
    

    p5.draw = () => {
        flowField.forEach((flowLines, row) => {
            flowLines.forEach((flowLine2, column) => {
                if (column === 0) {
                    return;
                }
                const flowLine1 = flowLines[column - 1]
                new FlowBezier(p5, {anchor1: flowLine1.anchor, vector1: flowLine1.oppositeVector, anchor2: flowLine2.anchor, vector2: flowLine2.vector, visible: true })
            })
        })
        p5.noLoop();
    }
}, document.querySelector('main'));
