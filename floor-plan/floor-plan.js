const framesPerSecond = 5;
const canvasWidth = 600;
const canvasHeight = 700;
const startRectangleWidth = 200;
const startRectangleHeight = 100;

const dotRadius = 7;

let points = [];
let randomPointIndex = -1;
let randomSide = new Line({x: 0, y: 0}, {x: 0, y: 0});
let extrusionLength = 20;

function setup() {
    frameRate(framesPerSecond)
    createCanvas(canvasWidth, canvasHeight);
    points.push({x: (canvasWidth - startRectangleWidth) / 2, y: (canvasHeight - startRectangleHeight) / 2})
    points.push({x: (canvasWidth - startRectangleWidth) / 2 + startRectangleWidth, y: (canvasHeight - startRectangleHeight) / 2})
    points.push({x: (canvasWidth - startRectangleWidth) / 2 + startRectangleWidth, y: (canvasHeight - startRectangleHeight) / 2 + startRectangleHeight})
    points.push({x: (canvasWidth - startRectangleWidth) / 2, y: (canvasHeight - startRectangleHeight) / 2 + startRectangleHeight})
}

function draw() {
    extrusionLength = Math.round(random(20, 60));
    background(255);
    noFill();
    beginShape();
    for (const point of points) {
        vertex(point.x, point.y);
        circle(point.x, point.y, dotRadius)
    }
    vertex(points[0].x, points[0].y);
    endShape();
    randomPointIndex = Math.round(random(0, points.length - 1));
    randomSide = new Line(points[randomPointIndex], points[randomPointIndex !== points.length - 1 ? randomPointIndex + 1 : 0]);
    points.splice(randomPointIndex, 1, ...randomSide.extrude(extrusionLength).slice(0, 3));
}

