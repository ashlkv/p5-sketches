/** Gravitational or mutual attraction, https://natureofcode.com/book/chapter-2-forces/#29-gravitational-attraction */

window.P5 = p5;

new p5((p5) => {
    const width = 400;
    const height = 400;
    const movers = [];

    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(0);
        p5.frameRate(25);
        
        movers[0] = new Mover(p5, P5.Vector.random2D(), P5.Vector.random2D(), 10)
        movers[1] = new Mover(p5, new P5.Vector(50, 200), P5.Vector.random2D(), 10)
        movers[2] = new Mover(p5, new P5.Vector(200, 350), P5.Vector.random2D(), 10)
        movers[3] = new Mover(p5, new P5.Vector(200, 50), P5.Vector.random2D(), 10)
    }

    p5.draw = () => {
        for (const mover of movers) {
            for (const other of movers) {
                if (mover !== other) {
                    mover.attract(other)
                }
            }
        }
        
        for (const mover of movers) {
            mover.update();
            mover.show();
        }
    }
}, document.querySelector('main'))
