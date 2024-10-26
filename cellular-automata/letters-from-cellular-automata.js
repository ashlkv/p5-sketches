import {Grid} from "../common/grid.js";

window.P5 = p5;


const hasTriangle = (grid, columnIndex, rowIndex, width, height) => {
    // Should start with 0. Previous should be 1.
    if (grid[rowIndex - 1]?.[columnIndex] !== 1 || grid[rowIndex][columnIndex - 1] !== 1) {
        return false;
    } else if (rowIndex + height > grid.length || columnIndex + width > grid[rowIndex].length || grid[rowIndex][columnIndex] !== 0) {
        return false;
    }
    for (let i = 0; i < height; i++) {
        const layer = grid[rowIndex + i].slice(columnIndex + i, columnIndex + i + width - i * 2);
        if (!layer.every(element => element === 0)) {
            return false;
        }
    }
    return true;
}

new p5((p5) => {
    const canvasSize = { width: window.innerWidth, height: window.innerHeight }
    const height = 200;
    // Width has to be an odd number
    const width = 41;
    // Rule 30 https://en.wikipedia.org/wiki/Rule_30
    // 111	110	101	100	011	010	001	000
    // 0	0	0	1	1	1	1	0
    const getRuleset = (ruleNumber = 30) => {
        const radix = 2;
        return ((ruleNumber ?? p5.random(0, 255)) >>> 0)
            .toString(radix)
            .padStart(8, '0')
            .split('')
            .map(value => parseInt(value, radix));
    }
    
    const ruleset = getRuleset(30)
    const firstGeneration = CellularAutomata.getGenerationWithCenterPoint(width);
    
    const grid = new Grid(width, height)
    const renderPoint = (x, y, value) => {
        grid[y][x] = value;
    }
    
    const curve8 = ({ x, y } = {x: 0, y: 0}) => {
        const anchor1 = { x, y }
        const anchor2 = { x: x + 50, y }
        const control1 = { x: x + 100, y: y - 200 }
        const control2 = { x, y: y + 100 }
        return [{ anchor1, control1, control2, anchor2 }];
    }
    
    const curve7 = ({x, y} = {x: 0, y: 0}) => {
        const segments = [];
        (() => {
            const anchor1 = { x, y }
            const anchor2 = { x: x + 2, y }
            const control1 = { x: x + 50, y: y - 100 }
            const control2 = { x: x + 60, y: y - 100 }
            segments.push({ anchor1, control1, control2, anchor2 })
        })();
        
        (() => {
            const anchor1 = { x: x + 2, y }
            const anchor2 = { x: x + 30 , y }
            const control1 = { x: x + 50, y: y - 75 }
            const control2 = { x: x + 60, y: y - 75 }
            segments.push({ anchor1, control1, control2, anchor2 })
        })()
        return segments;
    }
    
    const curve6 = ({x, y} = {x: 0, y: 0}) => {
        /*let beziers = [
          [0, 53.71033, 5.818579, 29.98843, 23.721903, 0, 23.721903, 0],
          [23.721903, 0, -7.168593, 55.80658, 15.217821, 56.84305, 39.397634, 57.96258],
          [39.397634, 57.96258, 45.928379, 33.224, 56.843045, 3.133115, 63.978699, -16.53933],
          [63.978699, -16.53933, 17.46979, 56.27554, 52.367214, 57.29066, 83.408059, 58.1936],
          [83.408059, 58.1936, 96.517909, -10.31975, 91.754529, 1.670368, 79.216519, 33.23191],
          [79.216519, 33.23191, 62.214042, 57.61825, 94.441019, 58.06583, 94.441019, 58.06583]
        ];
        const segments = beziers.map(bezier => {
            return { anchor1: { x: bezier[0], y: bezier[1] }, control1: { x: bezier[2], y: bezier[3] }, control2: { x: bezier[4], y: bezier[5] }, anchor2: { x: bezier[6], y: bezier[7] }}
        })
        return segments;*/
    }
    
    const curve2 = ({x, y} = {x: 0, y: 0}) => {
        const anchor1 = { x, y }
        const anchor2 = { x, y }
        const control1 = { x: x + 25, y: y - 25 }
        const control2 = { x: x - 25, y: y - 25 }
        return [{ anchor1, control1, control2, anchor2 }];
    }
    
    const curve1 = ({x, y} = {x: 0, y: 0}) => {
        const anchor1 = { x, y }
        const anchor2 = { x, y }
        const control1 = { x: x + 5, y: y - 5 }
        const control2 = { x: x - 5, y: y - 5 }
        return [{ anchor1, control1, control2, anchor2 }];
    }
    
    const connectBezier = (curve1, curve2) => {
        const { anchor2: anchor12, control2: control12 } = Array.isArray(curve1) ? curve1.slice(-1)[0] : curve1;
        const { anchor1: anchor21, control1: control21 } = Array.isArray(curve2) ? curve2[0] : curve2;
        const handle1 = p5.createVector(control12.x - anchor12.x, control12.y - anchor12.y).rotate(p5.PI);
        const handle2 = p5.createVector(control21.x - anchor21.x, control21.y - anchor21.y).rotate(p5.PI)
        const distance = p5.dist(anchor12.x, anchor12.y, anchor21.x, anchor21.y)
        handle1.setMag(handle1.mag() / distance * 3)
        handle2.setMag(handle2.mag() / distance * 3)
        return [{
            anchor1: anchor12,
            control1: { x: anchor12.x + handle1.x, y: anchor12.y + handle1.y },
            control2: { x: anchor21.x + handle2.x, y: anchor21.y + handle2.y },
            anchor2: anchor21,
        }]
    }
    
    const getBezier = ({x, y}, size = 1) => {
        if (size === 8) {
            return curve8({x, y})
        } else if (size === 7) {
            return curve7({x, y})
        } else if (size > 1) {
            return curve2({x, y})
        } else {
            return curve1({x, y})
        }
    }
    
    const automata = new CellularAutomata(p5, width, height, firstGeneration, ruleset, undefined, renderPoint)
    window.grid = grid;
    window.save = (name) => p5.save(name)
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
        p5.background(255);
        p5.frameRate(60)
        p5.noFill()
        p5.stroke(0)
        new Array(height).fill().forEach(() => {
            automata.renderGeneration();
        })
    };
    
    const offsetFactor = 10;
    p5.draw = () => {
        const startAt = grid.findIndex(row => row[0] === 1)
        grid.forEach((row, rowIndex) => {
            if (rowIndex < startAt) {
                return;
            }
            const curves = [];
            row.forEach((value, columnIndex, row) => {
                let origin = {x: 50, y: 50 + (rowIndex - startAt) * 10};
                const previous = curves.length > 0 ? curves.slice(-1)[0] : undefined;
                if (previous) {
                    const lastSegment = previous.slice(-1)[0]
                    origin = { x: lastSegment.anchor2.x + 10, y: lastSegment.anchor2.y }
                }
                const { x, y } = origin
                let curve;
                if (hasTriangle(grid, columnIndex, rowIndex, 11, 6)) {
                    curve = getBezier({x, y}, 8)
                } else if (hasTriangle(grid, columnIndex, rowIndex, 9, 5)) {
                    curve = getBezier({x, y}, 8)
                } else if (hasTriangle(grid, columnIndex, rowIndex, 7, 4)) {
                    curve = getBezier({x, y}, 8)
                } else if (hasTriangle(grid, columnIndex, rowIndex, 5, 3)) {
                    curve = getBezier({x, y}, 7)
                } else if (hasTriangle(grid, columnIndex, rowIndex, 3, 2)) {
                    curve = getBezier({x, y}, 2)
                } else {
                    curve = getBezier({x, y}, 1)
                }
                if (curve && previous) {
                    const connection = connectBezier(curve, previous)
                    curves.push(connection);
                }
                if (curve) {
                    curves.push(curve);
                }
            })
            curves.forEach((curve, curveIndex, curves) => {
                const { x, y } = { x: 0, y: (rowIndex - startAt) * offsetFactor }
                // p5.beginShape();
                // p5.curveVertex(x, y)
                // p5.curveVertex(x, y)
                curve.forEach((segment) => {
                    const { anchor1, control1, control2, anchor2 } = segment;
                    p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
                })
                // if (curveIndex < curves.length - 1) {
                //     const previous = curves[curveIndex - 1]
                //     const connection = connectBezier(curve, previous)
                // }
                // p5.curveVertex(x + 20 * offsetFactor, y)
                // p5.curveVertex(x + 20 * offsetFactor, y)
                // p5.endShape();
            });
        })
        p5.noLoop()
    };
}, document.querySelector('main'))



