export function getRange(start, end) {
    return new Array(end - start).fill().map((element, index) => start + index)
}

export function ColorRanges(p5, levels, colors) {
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

export function getNoise(count, column, row, simplex, noisePersistance = 0.55, noiseScale = 350, noiseIntensity = 9) {
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

export function getThresholds(p5, initial, steps, delta, colors) {
    return Array(steps + 1).fill().map((value, index) => {
        const color = colors.length === 0 ? '#fff' : colors[p5.floor(p5.random(colors.length))];
        return {value: initial + index * delta, color};
    })
}

export function getSegments(p5, direction, nw, ne, se, sw, threshold, cellSize, column, row) {
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

export function hex2rgb(rawHex = '') {
    const hex = rawHex.replace('#', '');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
}

/**
 * Attaches source points to matching destination points, mutating the destination
 */
export function attachTo(destination = [], source = [], precision = 0.0001) {
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
export function sortSegments(segments) {
    segments.forEach(segment => {
        if (segment[1].x < segment[0].x) {
            segment.reverse();
        }
    })
    segments.sort(([first], [second]) => first.x - second.x)
}

/** Given all segments of a level, connects adjacent segments */
export function connectSegments(segments) {
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

export function averagePoint(points = []) {
    if (points.length === 0) {
        return { x: undefined, y: undefined };
    } else if (points.length === 1) {
        return points[0];
    }
    const sum = points.slice(1).reduce((sum, { x, y }) => ({ x: sum.x + x, y: sum.y + y }), points[0])
    return { x: sum.x / points.length, y: sum.y / points.length }
}

/** Smoothes the curve by replacing all points within given radius with a single point */
export function smoothSplines(p5, splines, threshold = 5) {
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

const maxWeights = {nw: 8, ne: 4, se: 2, sw: 1}

export function getLevels(p5, flowField, options = {noiseScale: 60, noisePersistence: 0.35, noiseIntensity: 5, strokeWeight: 1, lineDensity: 50, range: 1, cellSize: 6, smoothing: 3}) {
    const levels = {};
    const ratio = options.range * 2;
    const lineCount = ratio * options.lineDensity;
    const delta = 1 / options.lineDensity;
    const thresholds = getThresholds(p5, -1, Math.round(lineCount), 1 / options.lineDensity, []);
    // grid.render();
    
    for (let row = 0; row < flowField.values.length; row++) {
        for (let column = 0; column < flowField.values[row].length; column++) {
            const square = {
                nw: flowField.get({column, row}),
                ne: flowField.get({column: column + 1, row}),
                se: flowField.get({column: column + 1, row: row + 1}),
                sw: flowField.get({column, row: row + 1})
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
                const segments = getSegments(p5, weight, ...Object.values(square), threshold.value, options.cellSize, column, row);
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
    
    return levels;
}
