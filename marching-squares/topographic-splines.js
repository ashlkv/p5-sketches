import {FlowField} from '../common/flow-field.js';
import {ColorRanges, getNoise, getLevels} from './terrain.js';

const colors = [
{color: '#00868b', range: [0, 0.15]},
{color: '#40e0d0', range: [0.15, 0.4]},
    {color: '#000000', range: [0.4, 0.7]},
    {color: '#636b2f', range: [0.7, 1]},
]


new p5((p5) => {
    // p5.pixelDensity(4);
    
    // const seed = p5.floor(p5.random(9999999));
    // const seed = 4466729;
    // const seed = 9615282;
    // const seed = 1994825;
    // const seed = 229642;
    // const seed = 8197469;
    // const seed = 9948367;
    // const seed = 64399;
    // const seed = 2886629;
    // const seed = 8473049;
    // const seed = 8165228;
    const seed = 5550490;
    
    // p5.noiseDetail(2, 0.25)
    p5.randomSeed(seed);
    p5.noiseSeed(seed);
    
    window.seed = seed;
    window.save = (name) => p5.save(name)
    
    const presets = {
        squares: {noiseScale: 500, noisePersistence: 0.5, noiseIntensity: 3, strokeWeight: 1, lineDensity: 1000, range: 0.99, cellSize: 30,},
        terrain: {noiseScale: 700, noisePersistence: 0.45, noiseIntensity: 7, strokeWeight: 1, lineDensity: 150, range: 0.99, cellSize: 10,},
        original: {noiseScale: 350, noisePersistence: 0.55, noiseIntensity: 9, strokeWeight: 1, lineDensity: 15, range: 0.5, cellSize: 2, smoothing: 0},
        large: {noiseScale: 350, noisePersistence: 0.55, noiseIntensity: 9, strokeWeight: 1, lineDensity: 15, range: 0.5, cellSize: 50,},
        large2: {noiseScale: 350, noisePersistence: 0.35, noiseIntensity: 9, strokeWeight: 1, lineDensity: 30, range: 0.99, cellSize: 10, smoothing: 8}
    }
    
    // const options = {noiseScale: 200, noisePersistence: 0.55, noiseIntensity: 5, strokeWeight: 1, lineDensity: 15, range: 0.99, cellSize: 10, smoothing: 0};
    // const options = {noiseScale: 700, noisePersistence: 0.45, noiseIntensity: 7, strokeWeight: 1, lineDensity: 150, range: 0.99, cellSize: 10,};
    const options = {noiseScale: 60, noisePersistence: 0.35, noiseIntensity: 5, strokeWeight: 1, lineDensity: 50, range: 1, cellSize: 6, smoothing: 3};
    const canvasSize = {width: window.innerWidth, height: window.innerHeight}
    const cellSize = options.cellSize
    const simplex = new SimplexNoise(seed);
    
    const initializeValue = (column, row) => getNoise(16, column, row, simplex, options.noisePersistence, options.noiseScale, options.noiseIntensity)
    
    const flowField = new FlowField(p5, {
                        width: Math.round(canvasSize.width / cellSize),
                        height: Math.round(canvasSize.height / cellSize),
                        cellSize,
                        initialize: initializeValue
                    });
    
    p5.setup = function() {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
    };
    
    p5.draw = () => {
        p5.noise();
        
        p5.strokeWeight(1)
        p5.noFill()
        const levels = getLevels(p5, flowField, options)
        
        /*
        // Use different colors for segments to highlight detached segments
        const colors = ['#ff0000', '#00ff00','#0000ff', '#00ffff', '#ffbb00', '#ff00ff']
        // const colors = ['#000000']
        Object.entries(levels).forEach(([level, splines]) => {
            const opacity = p5.map(level, 0, thresholds.length - 1, 255, 0);
            p5.stroke(0, 0, 0, opacity);
            splines.forEach((spline) => {
                const hex = colors[Math.round(p5.random(0, colors.length - 1))];
                const [r, g, b] = hex2rgb(hex)
                p5.stroke(r, g, b, opacity);
                spline.forEach((point, index, spline) => {
                    if (index === 0) {
                        return;
                    }
                    const from = spline[index - 1];
                    const to = point;
                    p5.line(from.x, from.y, to.x, to.y);
                })
            })
        })*/
        
        // Curves
        const colorRanges = new ColorRanges(p5, levels, colors);
        Object.entries(levels).forEach(([level, splines], index) => {
            const color = colorRanges.getColorAtIndex(index)
            p5.stroke(color);
            p5.strokeWeight(options.strokeWeight);
            splines.forEach((spline) => {
                p5.beginShape();
                const start = spline[0];
                const end = spline[spline.length - 1];
                p5.curveVertex(start.x, start.y);
                spline.forEach(({ x, y }) => {
                    p5.curveVertex(x, y);
                })
                p5.curveVertex(end.x, end.y);
                p5.endShape();
            })
        })
        
        // Dots
        /*Object.entries(levels).forEach(([level, splines]) => {
            p5.stroke(255, 0, 0);
            p5.strokeWeight(1);
            splines.forEach((spline) => {
                spline.forEach(({ x, y }) => {
                    p5.circle(x, y, 4);
                })
            })
        })*/
        
        window.levels = levels;
        window.colorRanges = colorRanges;
        
        p5.noLoop();
    }
    
});
