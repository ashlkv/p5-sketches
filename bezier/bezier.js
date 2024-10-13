import {debugBezier} from "../common/bezier.js";

window.P5 = p5;

new p5((p5) => {
    const canvasSize = { width: window.innerWidth, height: window.innerHeight }
    
    const curve8 = ({ x, y } = {x: 0, y: 0}) => {
        const anchor1 = { x, y }
        const anchor2 = { x: x + 50, y }
        const control1 = { x: x + 100, y: y - 200 }
        const control2 = { x, y: y + 100 }
        return { anchor1, control1, control2, anchor2 };
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
        return { anchor1, control1, control2, anchor2 };
    }
    
    const curve1 = ({x, y} = {x: 0, y: 0}) => {
        const anchor1 = { x, y }
        const anchor2 = { x, y }
        const control1 = { x: x + 5, y: y - 5 }
        const control2 = { x: x - 5, y: y - 5 }
        return { anchor1, control1, control2, anchor2 };
    }
    
    const connectBezier = (curve1, curve2) => {
        const { anchor2: anchor12, control2: control12 } = Array.isArray(curve1) ? curve1.slice(-1)[0] : curve1;
        const { anchor1: anchor21, control1: control21 } = Array.isArray(curve2) ? curve2[0] : curve2;
        const handle1 = p5.createVector(control12.x - anchor12.x, control12.y - anchor12.y).rotate(p5.PI);
        const handle2 = p5.createVector(control21.x - anchor21.x, control21.y - anchor21.y).rotate(p5.PI)
        const distance = p5.dist(anchor12.x, anchor12.y, anchor21.x, anchor21.y)
        handle1.setMag(handle1.mag() / distance * 3)
        handle2.setMag(handle2.mag() / distance * 3)
        return {
            anchor1: anchor12,
            control1: { x: anchor12.x + handle1.x, y: anchor12.y + handle1.y },
            control2: { x: anchor21.x + handle2.x, y: anchor21.y + handle2.y },
            anchor2: anchor21,
        }
    }
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        p5.background(255);
        p5.stroke(0)
        p5.noFill()
    }
    
    p5.draw = () => {
        const curve1 = curve8({ x: canvasSize.width / 2.5, y: canvasSize.height / 2 });
        const curve2 = curve7({ x: curve1.anchor2.x + 10, y: curve1.anchor2.y });
        // const curve3 = curve6({ x: curve2[1].anchor2.x + 10, y: curve2[1].anchor2.y });
        const connection1 = connectBezier(curve1, curve2);
        // const connection2 = connectBezier(curve2, curve3);
        (() => {
            const { anchor1, control1, control2, anchor2 } = curve1
            p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
        })();
        (() => {
            const { anchor1, control1, control2, anchor2 } = connection1
            p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
            // debugBezier(p5, anchor1, control1, control2, anchor2);
        })();
        (() => {
            curve2.forEach((segment) => {
                const { anchor1, control1, control2, anchor2 } = segment
                p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
            })
        })();
        /*(() => {
            const { anchor1, control1, control2, anchor2 } = connection2
            p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
        })();
        (() => {
            curve3.forEach((segment) => {
                const { anchor1, control1, control2, anchor2 } = segment
                p5.bezier(anchor1.x, anchor1.y, control1.x, control1.y, control2.x, control2.y, anchor2.x, anchor2.y)
            })
        })();*/
        p5.noLoop()
    }
}, document.querySelector('main'));
