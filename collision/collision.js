window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    
    var hit = false;
    const poly = Array(16).fill(); // stores the vertices for our polygon.
    
    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(0);
        
        p5.collideDebug(true); // enable debug mode
        
            // Generate a 16-sided polygon:
            const angle = p5.TAU / poly.length;
            for (var i = 0; i < poly.length; ++i) {
                const a = angle * i;
                const x = p5.cos(a) * 100 + 300;
                const y = p5.sin(a) * 100 + 200;
                poly[i] = p5.createVector(x, y);
            }
        
    }
    
    p5.draw = () => {
        p5.background(255);
        // Draw the polygon from the 16 created vectors{x, y} stored in poly[]:
        p5.beginShape();
        for (const { x, y } of poly)  p5.vertex(x, y);
        p5.endShape(p5.CLOSE);
    
        p5.line(10, 10, p5.mouseX, p5.mouseY);
    
        hit = p5.collideLinePoly(p5.mouseX, p5.mouseY, 45, 100, poly);
    
        p5.stroke(hit ? p5.color('red') : 0);
        p5.print('colliding?', hit);
    }
}, document.querySelector('main'));
