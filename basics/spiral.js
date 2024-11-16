import {Path} from "../common/path.js";
import {Spiral} from "../common/spiral.js";

window.P5 = p5;

new p5((p5) => {
    const canvasSize = {width: window.innerWidth, height: window.innerHeight};
    
    p5.setup = () => {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        p5.background(255);
        p5.noFill();
    }
    
    p5.draw = () => {
        const vertices = [{"x": 20, "y": 837}, {"x": 37.368335335185094, "y": 764.6556768215004}, {
            "x": 69.71553769092912,
            "y": 701.1707176544163
        }, {"x": 114.10137698229234, "y": 649.2015769785829}, {
            "x": 145.7414419668952,
            "y": 591.6485124280563
        }, {"x": 188.32068462959379, "y": 544.8545357310475}, {
            "x": 239.30145830643113,
            "y": 510.2080377173255
        }, {"x": 295.9263580937015, "y": 488.8112711052548}, {
            "x": 354.1309877069739,
            "y": 481.45831642352425
        }, {"x": 407.1862780972753, "y": 463.2934304281666}, {
            "x": 453.720136269112,
            "y": 435.7733834210856
        }, {"x": 493.1765792259142, "y": 399.87078274786705}, {
            "x": 539.9950815236599,
            "y": 374.1320933009835
        }, {"x": 591.5102299987702, "y": 360.03914342840824}, {
            "x": 638.3891481907109,
            "y": 336.15314156484715
        }, {"x": 688.6957742717203, "y": 324.07558920181106}, {
            "x": 740.068351101832,
            "y": 324.0755892018111
        }, {"x": 789.6200681801841, "y": 335.971903948271}, {
            "x": 839.324743253921,
            "y": 337.5339362907367
        },]
        
        const path = new Path(p5, vertices)
        // Path
        p5.stroke(255, 0, 0, 100)
        p5.beginShape();
        path.vertices.forEach(({x, y}, index, curve) => {
            if (index === 0 || index === curve.length - 1) {
                p5.curveVertex(x, y);
            }
            p5.curveVertex(x, y)
        })
        p5.endShape();
        
        const spiral = new Spiral(p5, { path, step: 20, steps: Infinity })
        p5.strokeWeight(3);
        p5.point(spiral.vertices[0].x, spiral.vertices[0].y)
        p5.strokeWeight(1);
        p5.stroke(0, 0, 255, 100)
        p5.beginShape();
        spiral.vertices.forEach(({x, y}, index, curve) => {
            if (index === 0 || index === curve.length - 1) {
                p5.curveVertex(x, y);
            }
            p5.curveVertex(x, y)
        })
        p5.endShape();
        
        p5.noLoop();
    }
}, document.querySelector('main'));
