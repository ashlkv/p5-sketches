window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    let p5bezier
    p5.setup = () => {
        const canvas = p5.createCanvas(width, height);
        p5.background(255);
        p5.stroke(0)
        p5.noFill()
        p5bezier = initBezier(canvas)
    }
    
    p5.draw = () => {
        const controlPoints = [
            {x: 50, y: 100},
            {x: 200, y: 300},
            {x: 400, y: 200},
            {x: 350, y: 500},
            {x: 600, y: 450},
        ]
        p5bezier.draw(controlPoints.map(({x, y}) => [x, y]))
        p5.stroke(255, 0, 0)
        p5.strokeWeight(5)
        controlPoints.forEach(({ x, y }) => {
            p5.point(x, y);
        })
        p5.noLoop()
    }
}, document.querySelector('main'));
