import {FlowField, FlowLine} from "../common/flow-field.js";

window.P5 = p5;

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    const noiseIncrement = 0.1
    const cellSize = 30
    const getNoiseValue = (column, row, p5, ) => {
        return p5.noise(column * noiseIncrement, row * noiseIncrement);
    };
    const flowField = new FlowField(p5, { width: Math.ceil(canvasSize.width / cellSize), height: Math.ceil(canvasSize.height / cellSize), cellSize, initialize: getNoiseValue });
    
    window.save = (name) => p5.save(name)
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.background(255);
        p5.noFill();
    }
    
    p5.draw = () => {
        // -0.1 to 0.1
        flowField.values.forEach((columns, row) => columns.forEach((value, column) => {
            const weight = p5.map(value, -1, 1, 1, 27)
            const count = p5.map(value, -1, 1, 1, 10)
            // const angle = p5.map(value, -1, 1, 0, 1)
            // p5.push()
            p5.strokeWeight(weight)
            // p5.rotate(angle)
            new Array(count).fill().forEach((element, index, array) => {
                const x = column * cellSize + cellSize / array.length * index 
                p5.line(x, row * cellSize, x, (row + 1) * cellSize)
            })
            // p5.pop()
        }))
        p5.noLoop()
    }
}, document.querySelector('main'));
