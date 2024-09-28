window.P5 = p5;

const collatz = (number) => {
    return number % 2 === 0 ? number / 2 : Math.max((number * 3 + 1) / 2, 2)
}

const getSequence = (from = 100) => {
    const sequence = [];
    let hardLimit = 0
    for (let number = from; number > 1 && hardLimit < 1000; number = collatz(number)) {
        hardLimit ++;
        sequence.push(number);
    }
    sequence.push(1);
    return sequence.reverse();
}

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    const controls = {}
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        
        const container = document.querySelector('#controls');
        
        p5.createP('Odd angle').parent(container);
        controls.oddAngle = p5.createSlider(2, 40, 20, 1);
        controls.oddAngle.parent(container)
        controls.oddAngle.elt.onchange = () => p5.draw();
        
        p5.createP('Even angle').parent(container);
        controls.evenAngle = p5.createSlider(2, 40, 20, 1);
        controls.evenAngle.parent(container)
        controls.evenAngle.elt.onchange = () => p5.draw();
        
        p5.createP('Length').parent(container);
        controls.length = p5.createSlider(1, 100, 20, 1);
        controls.length.parent(container)
        controls.length.elt.onchange = () => p5.draw();
        
        p5.createP('Iterations').parent(container);
        controls.iterations = p5.createSlider(10, 10000, 1000, 1);
        controls.iterations.parent(container)
        controls.iterations.elt.onchange = () => p5.draw();
    }
    
    p5.draw = () => {
        p5.background(255);
        p5.stroke(0)
        const iterations = controls.iterations.value()
        for (let index = 2; index < iterations; index++) {
            if (index % 2 === 0) {
                continue;
            }
            
            p5.resetMatrix();
            p5.translate(canvasSize.width / 2, canvasSize.height / 2)
            const sequence = getSequence(index);
            sequence.forEach((number) => {
                const oddAngle = p5.PI / controls.oddAngle.value()
                const evenAngle = p5.PI / controls.evenAngle.value()
                const length = controls.length.value()
                p5.rotate(number % 2 === 0 ? evenAngle : -oddAngle);
                p5.line(0, 0, 0, -length)
                p5.translate(0, -length);
            })
        }
        p5.noLoop();
    }
}, document.querySelector('main'));
