import { randomSample, poissonSample } from '../common/noise.js'

window.P5 = p5;

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    let delaunay;
    let i = 0;
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        p5.background(255);
        p5.stroke(0);
        
        const points = randomSample(p5, 1000, canvasSize.width, canvasSize.height)
        // const points = poissonSample(p5, 100, canvasSize.width, canvasSize.height)
        const flatPoints = points.map(({x, y}) => [x, y]).flat();
        delaunay = new d3.Delaunay(flatPoints)
    }
    
    p5.draw = () => {
        const {points, triangles} = delaunay;
        const t0 = triangles[i * 3 + 0];
        const t1 = triangles[i * 3 + 1];
        const t2 = triangles[i * 3 + 2];
        p5.beginShape();
        p5.vertex(points[t0 * 2], points[t0 * 2 + 1]);
        p5.vertex(points[t1 * 2], points[t1 * 2 + 1]);
        p5.vertex(points[t2 * 2], points[t2 * 2 + 1]);
        p5.endShape(p5.CLOSE);
        i ++
    }
}, document.querySelector('main'));
