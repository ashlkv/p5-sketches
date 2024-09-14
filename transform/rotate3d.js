window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    
    p5.setup = () => {
        p5.createCanvas(width, height, p5.WEBGL);
        p5.background(255);
    }
    
    p5.draw = () => {
        p5.noFill();
        p5.stroke(0);
        p5.rect(150, 200, 400, 250)
        p5.rotateZ(p5.PI / 4 / 2);
        p5.orbitControl();
    }
}, document.querySelector('main'));
