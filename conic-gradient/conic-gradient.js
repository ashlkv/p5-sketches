new p5((p5) => {
    const colorStops = ['#ff0000', '#00ff00', '#0000ff'];
    
    function range(from, to, step = 1) {
        let array = [];
        if (to === undefined) [from, to] = [0, from];
        for (let i = from; step > 0 ? i < to : i > to; i += step) array.push(i);
        return array;
    }
    
    function mapColor(index, min, max, ...palette) {
        let gradient = chroma.scale(palette).mode('lab')
        let mixture = p5.map(index, min, max, 0, 1)
        return gradient(mixture).hex()
    }
    
    function polarToCartesian(x, y, angle, dist) {
        return {x: x + p5.cos(angle) * dist, y: y + p5.sin(angle) * dist}
    }
    
    p5.setup = () => {
        const canvasDimension = (colorStops.length - 1) * 200;
        p5.createCanvas(canvasDimension, canvasDimension);
        p5.angleMode(p5.DEGREES)
        p5.background(0);
        p5.noStroke();
        
        let density = 1000 // The count of radial lines with stroke color gradually changing, creating a gradient.
        let radius = 100
        for (let colorStopIndex = 0; colorStopIndex < colorStops.length - 1; colorStopIndex ++) {
            p5.translate(100, 100)
            for (const i of range(density)) {
                let hexColor = mapColor(i, 0, density - 1, colorStops[colorStopIndex], colorStops[colorStopIndex + 1])
                let angle = p5.map(i, 0, density - 1, 0, 270)
                let point = polarToCartesian(0, 0, angle, radius)
                p5.stroke(hexColor)
                p5.line(0, 0, point.x, point.y)
            }
        }
        
    }
})


