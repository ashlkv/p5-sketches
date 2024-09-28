window.P5 = p5;

const collatz = (number) => {
    return number % 2 === 0 ? number / 2 : (number * 3 + 1) / 2
}

const getSequence = (from = 100) => {
    const sequence = [];
    for (let number = from; number !== 1; number = collatz(number)) {
        sequence.push(number);
    }
    sequence.push(1);
    return sequence.reverse();
}

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    const angle = p5.PI / 20
    const length = 10
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        p5.background(255);
    }
    
    p5.draw = () => {
        p5.stroke(0)
        for (let index = 2; index < 10000; index++) {
            p5.resetMatrix();
            p5.translate(canvasSize.width / 2, canvasSize.height)
            const sequence = getSequence(index);
            sequence.forEach((number) => {
                p5.rotate(number % 2 === 0 ? angle : -angle);
                p5.line(0, 0, 0, -length)
                p5.translate(0, -length);
            })
        }
        p5.noLoop();
    }
}, document.querySelector('main'));
