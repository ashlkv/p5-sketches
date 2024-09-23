import { FlowField } from "../collision/flow-field.js";
import { debugBezier } from "./bezier.js";
import {poissonSample, randomSample} from "../common/noise.js";

window.P5 = p5;

new p5((p5) => {
    const cellSize = 100;
    const noiseIncrement = 0.1;
    const canvasSize = {
        width: Math.floor(window.innerWidth / cellSize) * cellSize,
        height: Math.floor(window.innerHeight / cellSize) * cellSize
    }
    
    let noiseGrid = new FlowField(p5, {
        width: canvasSize.width / cellSize,
        height: canvasSize.height / cellSize,
        cellSize,
        initialize: (column, row) => p5.noise(column * 0.1, row * 0.1) * p5.PI / 2
    });
    
    const getButterfly = (anchor, angle1 = p5.PI / 2, angle2 = p5.PI / 2, radius1 = 100, radius2 = 100) => {
        const anchor1 = anchor
        const anchor2 = anchor
        const normalizedAngle1 = p5.map(angle1 % p5.TWO_PI, 0, p5.TWO_PI, 0, p5.PI);
        const normalizedAngle2 = p5.map(angle2 % p5.TWO_PI, 0, p5.TWO_PI, 0, p5.PI);
        const handle1 = P5.Vector.fromAngle(normalizedAngle1 / 2, radius1)
        const handle2 = P5.Vector.fromAngle(normalizedAngle2 / 2 + p5.PI + p5.HALF_PI, radius2)
        const handle3 = P5.Vector.fromAngle(normalizedAngle1 / 2 + p5.PI, radius1)
        const handle4 = P5.Vector.fromAngle(normalizedAngle2 / 2 + p5.HALF_PI, radius2)
        const control1 = { x: anchor1.x + handle1.x, y: anchor1.y + handle1.y }
        const control2 = { x: anchor2.x + handle2.x, y: anchor2.y + handle2.y }
        const control3 = { x: anchor1.x + handle3.x, y: anchor1.y + handle3.y }
        const control4 = { x: anchor2.x + handle4.x, y: anchor2.y + handle4.y }
        return [
            { anchor1, control1, control2, anchor2, radius: radius1 },
            { anchor1, control1: control3, control2: control4, anchor2, radius: radius2 },
        ]
    }
    
    window.save = (name) => p5.save(name)
    window.p5 = p5
    
    p5.setup = () => {
        p5.frameRate(5)
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.noFill()
        p5.strokeWeight(1)
        p5.stroke(0);
    }

    p5.draw = () => {
        // const origins = poissonSample(100, canvasSize.width, canvasSize.height);
        const origins = randomSample(p5, 200, canvasSize.width - 150, canvasSize.height - 100);
        origins.forEach(({x, y}) => {
            if (y < 200 || x < 250) {
                return;
            }
            const size = noiseGrid.getValueAt({ x, y })
            const clam = [];
            const clamCellSize = cellSize;
            p5.noiseSeed(Date.now())
            let clamNoiseGrid = new FlowField(p5, {
                width: canvasSize.width / clamCellSize,
                height: canvasSize.height / clamCellSize,
                cellSize: clamCellSize,
                initialize: (column, row) => p5.noise(column * noiseIncrement, row * noiseIncrement) * p5.TWO_PI
            });
            clamNoiseGrid.forEach(({value: value1}, {value: value2}) => {
                if (!value2) {
                    return;
                }
                const radius1 = value1 / p5.TWO_PI * 100 * size;
                const radius2 = value2 / p5.TWO_PI * 100 * size;
                const butterfly = getButterfly({ x, y }, value1, value2, radius1 * 5, radius2 * 5)
                clam.push(butterfly);
            })
            clam.sort(([{ radius: first }], [{ radius: second }]) => second - first)
            p5.fill(255)
            p5.push()
            if (size) {
                // p5.rotate(size)
            }
            clam.forEach((butterfly) => {
                butterfly.forEach(({ anchor1, control1, control2, anchor2 }, index) => {
                    p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
                    // debugBezier(p5, anchor1, control1, control2, anchor2, index === 0 ? '#ff0000' : '#0000ff');
                })
            })
            p5.pop()
        })
        
        
        p5.noLoop();
    }
}, document.querySelector('main'));
