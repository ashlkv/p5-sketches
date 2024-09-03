function getRange(start, end) {
    return new Array(end - start).fill().map((element, index) => start + index)
}

function ColorRanges(p5, levels, colors) {
    const numbers = Object.keys(levels).map(key => Number(key));
    const levelCount = numbers.length;
    const colorKeys = colors.map(entry => entry.color);
    this.colorRanges = colors.map(({ color, range: [min, max]}, index, entries) => {
        const start = Math.floor(levelCount * min);
        const end = Math.floor(levelCount * max);
        return getRange(start, index === entries.length - 1 ? levelCount : end);
    });
    this.getColorAtIndex = (index) => {
        const colorIndex = this.colorRanges.findIndex(range => range.includes(index))
        return colorKeys[colorIndex];
    };
}

function getNoise(count, column, row, simplex, noisePersistance = 0.55, noiseScale = 350, noiseIntensity = 9) {
    let noise = 0;
    let maxAmplitude = 0;
    let amplitude = 1;
    let frequency = 1 / noiseScale;
    
    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    for (let i = 0; i < count; i++) {
        noise += simplex.noise3D(column * frequency, row * frequency, i) * amplitude;
        maxAmplitude += amplitude;
        amplitude *= noisePersistance;
        frequency *= 2;
    }
    const value = noise / maxAmplitude;
    if (noiseIntensity === 0) {
        return value
    } else {
        return 2 * sigmoid(value * noiseIntensity) - 1
    }
}

function getThresholds(p5, initial, steps, delta, colors) {
    return Array(steps + 1).fill().map((value, index) => {
        const color = colors.length === 0 ? '#fff' : colors[p5.floor(p5.random(colors.length))];
        return {value: initial + index * delta, color};
    })
}

function getSegments(p5, direction, nw, ne, se, sw, threshold, size, cellSize, column, row) {
    const n = {x: column * cellSize + p5.map(threshold, nw, ne, 0, cellSize), y: row * cellSize};
    const e = {x: column * cellSize + cellSize, y: row * cellSize + p5.map(threshold, ne, se, 0, cellSize)};
    const s = {x: column * cellSize + p5.map(threshold, sw, se, 0, cellSize), y: row * cellSize + cellSize};
    const w = {x: column * cellSize, y: row * cellSize + p5.map(threshold, nw, sw, 0, cellSize)};
    
    if (direction === 1 || direction === 14) {
        return [[s, w]];
    } else if (direction === 2 || direction === 13) {
        return [[e, s]];
    } else if (direction === 3 || direction === 12) {
        return [[e, w]]
    } else if (direction === 4 || direction === 11) {
        return [[n, e]]
    } else if (direction === 6 || direction === 9) {
        return [[n, s]]
    } else if (direction === 7 || direction === 8) {
        return [[w, n]];
    } else if (direction === 5 || direction === 10) {
        return [[e, s], [w, n]]
    }
}

function hex2rgb(rawHex = '') {
    const hex = rawHex.replace('#', '');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

/**
 * Attaches source points to matching destination points, mutating the destination
 */
function attachTo(destination = [], source = [], precision = 0.0001) {
    if (source.length < 2 || destination.length === 0) {
        return false;
    }
    const destinationStart = destination[0];
    const destinationEnd = destination[destination.length - 1]
    const sourceStart = source[0];
    const sourceEnd = source[source.length - 1];
    if (Math.abs(destinationEnd.x - sourceStart.x) <= precision && Math.abs(destinationEnd.y - sourceStart.y) <= precision) {
        const [, ...tail] = source
        destination.splice(destination.length, 0, ...tail);
        return true;
    } else if (Math.abs(destinationEnd.x - sourceEnd.x) <= precision && Math.abs(destinationEnd.y - sourceEnd.y) <= precision) {
        const head = source.slice(0, -1);
        destination.splice(destination.length, 0, ...head.reverse());
        return true;
    } else if (Math.abs(destinationStart.x - sourceEnd.x) <= precision && Math.abs(destinationStart.y - sourceEnd.y) <= precision) {
        const head = source.slice(0, -1)
        destination.splice(0, 0, ...head);
        return true;
    } else if (Math.abs(destinationStart.x - sourceStart.x) <= precision && Math.abs(destinationStart.y - sourceStart.y) <= precision) {
        const [, ...tail] = source;
        destination.splice(0, 0, ...tail.reverse());
        return true;
    } else {
        return false;
    }
}

/** Sorts all segments of given level by x */
function sortSegments(segments) {
    segments.forEach(segment => {
        if (segment[1].x < segment[0].x) {
            segment.reverse();
        }
    })
    segments.sort(([first], [second]) => first.x - second.x)
}

/** Given all segments of a level, connects adjacent segments */
function connectSegments(segments) {
    // Connects adjacent segments
    for (let i = 0; i < segments.length; i++) {
        const destination = segments[i]
        for (let j = 0; j < segments.length; j++) {
            if (i === j) {
                continue;
            }
            const source = segments[j];
            const attached = attachTo(destination, source, 0.1);
            if (attached) {
                segments[j] = [];
            }
        }
    }
    // Removes empty segments
    for (let index = 0; index < segments.length; index++) {
        if (segments[index]?.length === 0) {
            segments.splice(index, 1)
        }
    }
}

function averagePoint(points = []) {
    if (points.length === 0) {
        return { x: undefined, y: undefined };
    } else if (points.length === 1) {
        return points[0];
    }
    const sum = points.slice(1).reduce((sum, { x, y }) => ({ x: sum.x + x, y: sum.y + y }), points[0])
    return { x: sum.x / points.length, y: sum.y / points.length }
}

/** Smoothes the curve by replacing all points within given radius with a single point */
function smoothSplines(p5, splines, threshold = 5) {
    splines.forEach((points) => {
        for (let index = 0; index < points.length; index++) {
            if (index === 0) {
                continue;
            }
            const {x: x1, y: y1} = points[index - 1];
            const {x: x2, y: y2} = points[index];
            if (p5.dist(x1, y1, x2, y2) <= threshold) {
                points[index] = index === 1 ? points[index - 1] : index === points.length - 1 ? points[index] : averagePoint([{ x: x1, y: y1 }, {x: x2, y: y2}])
                points[index - 1] = undefined;
            }
        }
    })
    
    // Removes empty points
    for (let index = 0; index < splines.length; index++) {
        splines[index] = splines[index].filter(Boolean);
    }
}

function Grid(p5, {
    canvasSize = {width: 640, height: 480}, cellSize = 2, initializeValue = (column, row) => {
    }
}) {
    this.cellSize = cellSize;
    this.columns = Math.floor(canvasSize.width / cellSize);
    this.rows = Math.floor(canvasSize.height / cellSize);
    this.values = Array(this.rows + 1).fill()
        .map((value, row) => Array(this.columns + 1).fill()
            .map((value, column) => initializeValue(column, row)))
    this.getValue = (column, row) => {
        return this.values[row][column];
    }
    this.render = () => {
        this.values.forEach((columns, row) => columns.forEach((value, column) => {
            const color = p5.map(value, -1, 0, 0, 255)
            p5.strokeWeight(3)
            p5.stroke(color)
            p5.point(column * cellSize, row * cellSize)
        }))
    }
}

new p5((p5) => {
    
    const presets = {
        squares: {noiseScale: 500, noisePersistence: 0.5, noiseIntensity: 3, strokeWeight: 1, lineDensity: 1000, range: 0.99, cellSize: 30,},
        terrain: {noiseScale: 700, noisePersistence: 0.45, noiseIntensity: 7, strokeWeight: 1, lineDensity: 150, range: 0.99, cellSize: 10,},
        original: {noiseScale: 350, noisePersistence: 0.55, noiseIntensity: 9, strokeWeight: 1, lineDensity: 15, range: 0.5, cellSize: 2, smoothing: 0},
        large: {noiseScale: 350, noisePersistence: 0.55, noiseIntensity: 9, strokeWeight: 1, lineDensity: 15, range: 0.5, cellSize: 50,},
        large2: {noiseScale: 350, noisePersistence: 0.35, noiseIntensity: 9, strokeWeight: 1, lineDensity: 30, range: 0.99, cellSize: 10, smoothing: 8}
    }
    const colors = [
    {color: '#00868b', range: [0, 0.15]},
    {color: '#40e0d0', range: [0.15, 0.4]},
        {color: '#000000', range: [0.4, 0.7]},
        {color: '#636b2f', range: [0.7, 1]},
    ]
    
    // const options = {noiseScale: 200, noisePersistence: 0.55, noiseIntensity: 5, strokeWeight: 1, lineDensity: 15, range: 0.99, cellSize: 10, smoothing: 0};
    // const options = {noiseScale: 700, noisePersistence: 0.45, noiseIntensity: 7, strokeWeight: 1, lineDensity: 150, range: 0.99, cellSize: 10,};
    const options = {noiseScale: 60, noisePersistence: 0.35, noiseIntensity: 5, strokeWeight: 1, lineDensity: 50, range: 1, cellSize: 6, smoothing: 3};
    const maxWeights = {nw: 8, ne: 4, se: 2, sw: 1}
    const canvasSize = {width: window.innerWidth, height: window.innerHeight}
    const levels = {};
    let grid
    let colorRanges
    
    p5.setup = function() {
        p5.createCanvas(canvasSize.width, canvasSize.height, p5.SVG);
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
        const simplex = new SimplexNoise(seed);
        p5.randomSeed(seed);
        p5.noiseSeed(seed);
        const initializeValue = (column, row) => getNoise(16, column, row, simplex, options.noisePersistence, options.noiseScale, options.noiseIntensity)
        grid = new Grid(p5, {canvasSize, cellSize: options.cellSize, initializeValue});
        
        window.seed = seed;
    };
    
    p5.draw = () => {
        p5.noise();
        
        const ratio = options.range * 2;
        const lineCount = ratio * options.lineDensity;
        const delta = 1 / options.lineDensity;
        const thresholds = getThresholds(p5, -1, Math.round(lineCount), 1 / options.lineDensity, []);
        // grid.render();
        
        for (let row = 0; row < grid.rows; row++) {
            for (let column = 0; column < grid.columns; column++) {
                const square = {
                    nw: grid.getValue(column, row),
                    ne: grid.getValue(column + 1, row),
                    se: grid.getValue(column + 1, row + 1),
                    sw: grid.getValue(column, row + 1)
                }
                const min = p5.min(Object.values(square));
                const max = p5.max(Object.values(square));
                const matchingIndexes = thresholds
                    .map((threshold, index) => threshold.value >= min - delta && threshold.value <= max ? index : -1)
                    .filter(index => index !== -1);
                
                for (const index of matchingIndexes) {
                    const threshold = thresholds[index];
                    const weight = Object.entries(square).reduce((sum, [key, value]) => {
                        return value > threshold.value ? sum + maxWeights[key] : sum;
                    }, 0);
                    const segments = getSegments(p5, weight, ...Object.values(square), threshold.value, grid.cellSize, options.cellSize, column, row);
                    if (!segments) {
                        continue;
                    }
                    if (!Array.isArray(levels[index])) {
                        levels[index] = [...segments];
                    } else {
                        // FIXME Mutate instead?
                        levels[index] = levels[index].concat(segments)
                    }
                }
            }
        }
        
        Object.values(levels).forEach(sortSegments)
        // Repeats connecting algorithm several times to be sure
        Array(10).fill().forEach(() => Object.values(levels).forEach(connectSegments))
        // Replaces two close points with one point. Take care with small closed contours.
        Array(5).fill().forEach(() => Object.values(levels).forEach((splines) => smoothSplines(p5, splines, options.smoothing)))
        
        p5.strokeWeight(1)
        p5.noFill()
        
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
        colorRanges = new ColorRanges(p5, levels, colors);
        Object.entries(levels).forEach(([level, splines], index) => {
            const color = colorRanges.getColorAtIndex(index)
            if (color !== '#000000') {
                return
            }
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
        
        p5.noLoop();
        
        window.colorRanges = colorRanges;
    }
    
    window.levels = levels;
    window.save = (name) => p5.save(name)
});
