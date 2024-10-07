export function getCenter(polygon) {
    const x = polygon.reduce((sum, { x }) => sum + x, 0)
    const y = polygon.reduce((sum, { y }) => sum + y, 0)
    return { x: x / polygon.length, y: y / polygon.length }
}

/** Removes the last vertex if it's the same as the first */
export function getOpenPolygon(polygon = []) {
    const start = polygon[0];
    const end = polygon[polygon.length - 1];
    return start.x === end.x && start.y === end.y ? polygon.slice(0, -1) : polygon;
}

export function getPolygonLines(polygon = []) {
    const open = getOpenPolygon(polygon);
    return open.reduce((lines, vertex, index, vertices) => {
        if (index === 0) {
            return lines;
        }
        const start = vertices[index - 1];
        lines.push([start, vertex])
        if (index === vertices.length - 1) {
            lines.push([vertex, vertices[0]])
        }
        return lines
    }, [])
}

/** Detects if polygon is clockwise. Convex only. */
export function isClockwise(polygon = []) {
    const sum = polygon.reduce((sum, { x: x1, y: y1 }, index, polygon) => {
        const {x: x2, y: y2} = polygon[index + 1] || polygon[0];
        sum += (x2 - x1) * (y2 + y1);
        return sum;
    }, 0)
    return sum > 0
}

/** Changes polygon starting point */
export function changePolygonStart(polygon, startFrom = 0) {
    if (typeof startFrom === "function") {
        const index = startFrom(polygon);
        return index === 0 ? polygon : polygon.slice(index).concat(polygon.slice(0, index));
    } else {
        return startFrom === 0 ? polygon : polygon.slice(startFrom).concat(polygon.slice(0, startFrom));
    }
}

export const getFacingSides = (p5, sides = [], reverse = false) => {
    return sides.filter(([{x: x1, y: y1}, {x: x2, y: y2}]) => {
        const relative = { x: x2 - x1, y: y2 - y1 };
        const vector = p5.createVector(relative.x, relative.y);
        // heading returns angle from -180 to 180
        const halfAngle = vector.heading();
        const fullAngle = halfAngle >= 0 ? halfAngle : Math.PI * 2 + halfAngle
        if (reverse) {
            return fullAngle < Math.PI / 2 || fullAngle > Math.PI / 2 * 3;
        } else {
            return fullAngle > Math.PI / 2 && fullAngle < Math.PI / 2 * 3;
        }
    })
}

export const moveVertices = (polygon = [], origin = {x: 0, y: 0}) => {
    return polygon.map(({x, y}) => ({ x: x + origin.x, y: y + origin.y }))
}
