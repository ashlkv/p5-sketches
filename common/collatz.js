const collatz = (number, roundness = 2) => {
    return number % 2 === 0 ? number / 2 : Math.max((number * 3 + 1) / roundness, 2)
}

export const getCollatzSequence = (from = 100, roundness = 2) => {
    const sequence = [];
    let hardLimit = 0
    for (let number = from; number > 1 && hardLimit < 1000; number = collatz(number, roundness)) {
        hardLimit++;
        sequence.push(number);
    }
    sequence.push(1);
    return sequence.reverse();
}

export const getCurve = (p5, {from = 100, origin = {x: 0, y: 0}, initialAngle = 0, oddAngle = 0.15, evenAngle = 0.15, step = 20, accumulateAngle = true, getSequence = getCollatzSequence} = {}) => {
    const sequence = getSequence(from);
    const vertices = []
    let angle = initialAngle;
    sequence.forEach((number, index, sequence) => {
        const previous = vertices[index - 1];
        if (previous) {
            if (accumulateAngle) {
                angle += number % 2 === 0 ? evenAngle : -oddAngle;
            } else {
                angle = number % 2 === 0 ? evenAngle : -oddAngle;
            }
            const vector = p5.createVector(previous.x, previous.y);
            const direction = P5.Vector.fromAngle(angle, -step)
            vector.add(direction);
            vertices.push({x: vector.x, y: vector.y})
        } else {
            const {x, y} = origin
            vertices.push({x, y})
        }
    })
    return vertices;
}

const curvesMatch = (first, second, threshold = 2, strict = true) => {
    if (strict && first.length !== second.length) {
        return false;
    }
    for (let index = 0; index < first.length; index++) {
        if (!strict && !second[index]) {
            return true;
        }
        const { x: x1, y: y1 } = first[index];
        const { x: x2, y: y2 } = second[index];
        if (Math.abs(x1 - x2) > threshold || Math.abs(y1 - y2) > threshold) {
            return false;
        }
    }
    return true;
}

export const getGrowth = (p5, {iterations = 1000, origin = {x: 0, y: 0}, initialAngle = 0, oddAngle = 0.15, evenAngle = 0.15, step = 20, accumulateAngle = true, filter = (index) => true, optimized = false, getSequence = getCollatzSequence} = {}) => {
    const growth = [];
    for (let index = 2; index < iterations; index++) {
        if (!filter(index)) {
            continue;
        }
        const curve = getCurve(p5, { from: index, origin, initialAngle, oddAngle, evenAngle, step, accumulateAngle, getSequence })
        growth.push(curve)
    }
    // Starting from longer curves to be able to remove subset curves.
    growth.sort((first, second) => first.length - second.length)
    if (!optimized) {
        return growth;
    }
    const uniqueCurves = [];
    let curve;
    while (curve = growth.pop()) {
        uniqueCurves.push(curve);
        growth.forEach((otherCurve, index) => {
            if (curvesMatch(curve, otherCurve, 2, true)) {
                growth.splice(index, 1);
            }
        })
    }
    return uniqueCurves;
}

export const getMesh = (p5, options) => {
    return getGrowth(p5, { ...options, accumulateAngle: false })
}
