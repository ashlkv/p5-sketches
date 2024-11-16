import {FlowField} from "../common/flow-field.js";

window.P5 = p5;

const collatz = (number) => {
    return number % 2 === 0 ? number / 2 : Math.max((number * 3 + 1) / 4, 2)
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
    const cellSize = 20;
    const noiseIncrement = 0.01
    const getNoiseValue = (column, row) => {
        return p5.noise(column * noiseIncrement, row * noiseIncrement) * p5.TWO_PI
    }
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        p5.background(255);
    }
    
    p5.draw = () => {
        p5.stroke(0)
        const iterations = 500
        const flowField = new FlowField(p5, {
            width: iterations,
            height: iterations,
            cellSize,
            initialize: getNoiseValue
        })
        for (let index = 2; index < iterations; index++) {
            if (index % 2 === 0) {
                continue;
            }
            
            p5.resetMatrix();
            p5.translate(canvasSize.width / 2, canvasSize.height / 2)
            const sequence = getSequence(index);
            sequence.forEach((number) => {
                const angle = Math.abs(flowField.getValueAtPoint({ x: number, y: index }) / 20)
                // const angle = flowField.get({ column: number, row: index }) / 20
                // const angle = p5.PI / 20
                // const length = angle * 20;
                const length = 20
                p5.rotate(number % 2 === 0 ? angle : -angle);
                p5.line(0, 0, 0, -length)
                p5.translate(0, -length);
            })
        }
        p5.noLoop();
    }
}, document.querySelector('main'));
