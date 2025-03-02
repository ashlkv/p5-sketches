import {randomSample} from '../common/noise.js'
import {Quadtree} from '../common/quadtree.js'

window.P5 = p5;

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    let points;
    let quadtree;
    window.save = (name) => p5.save(name)

    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        const size = Math.min(canvasSize.width, canvasSize.height);
        const boundary = {x: canvasSize.width / 2, y: canvasSize.height / 2, width: size, height: size};
        quadtree = new Quadtree(p5, boundary, 4)
        points = randomSample(p5, 100, quadtree.boundary.width, quadtree.boundary.height)
            .map(({ x, y }) => ({ x: quadtree.left + x, y: quadtree.top + y }))
        points.forEach((point) => {
            quadtree.add(point)
        });

        p5.background(255);
        p5.noFill();

        window.quadtree = quadtree
        window.points = points
    }

    p5.draw = () => {
        quadtree.render();

        points.forEach(({x, y}) => {
            p5.strokeWeight(5)
            p5.stroke(0)
            p5.point(x, y)
        })
        p5.noLoop()
    }
}, document.querySelector('main'));
