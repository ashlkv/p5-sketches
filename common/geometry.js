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

export const absoluteToRelativePolygon = (polygon, origin) => {
    return polygon.map(({x, y}) => ({ x: x - origin.x, y: y - origin.y }))
}
export const relativeToAbsolutePolygon = (polygon, origin) => {
    return polygon.map((x, y) => ({ x: x + origin.x, y: y + origin.y }))
}

export const movePolygon = (polygon = [], offset = {x: 0, y: 0}) => {
    return polygon.map(({x, y}) => ({ x: x + offset.x, y: y + offset.y }))
}

// FIXME Rewrite with vector math
export const rotatePolygon = (vertices = [], origin = {x: 0, y: 0}, radians = 0) => {
    return vertices.map(({ x, y }) => {
        const dx = x - origin.x;
        const dy = y - origin.y;
        return {
            x: origin.x + dx * Math.cos(radians) - dy * Math.sin(radians),
            y: origin.y + dx * Math.sin(radians) + dy * Math.cos(radians)
        };
    });
}

// FIXME Rewrite with vector math
export function scalePolygon(polygon, factor) {
  // Calculate the center of the polygon
  let center = getCenter(polygon);
  
  // Scale each point
  return polygon.map(point => ({
    x: center.x + (point.x - center.x) * factor,
    y: center.y + (point.y - center.y) * factor
  }));
}

// Produces funny "sharp teeth" effect when joining adjacent voronoi cells together
export function getOverlappingPolygonUnion(polygons = []) {
    const allPoints = polygons.flat().filter((p, index, self) => {
        return index === self.findIndex((t) => t.x === p.x && t.y === p.y);
    });
    
    // Sort points by polar angle
    const center = getCenter(allPoints);
    allPoints.sort((a, b) => {
        return Math.atan2(a.y - center.y, a.x - center.x) - Math.atan2(b.y - center.y, b.x - center.x);
    });
    
    return allPoints;
}

/** Detects that polygons touch at least on one side. */
export const getTouchingSide = (polygon1, polygon2, threshold = 1) => {
    const sides = getPolygonLines(polygon1)
    return sides.find((side) => {
        // Neighboring side has opposite direction
        const [start1, end1] = [...side].reverse();
        return polygon2.find((end2, index, vertices) => {
            const start2 = index === 0 ? vertices[vertices.length - 1] : vertices[index - 1];
            return Math.abs(start1.x - start2.x) < threshold &&
                Math.abs(start1.y - start2.y) < threshold &&
                Math.abs(end1.x - end2.x) < threshold &&
                Math.abs(end1.y - end2.y) < threshold;
        })
    })
}

export const getClosestPoints = (p5, polygon1, polygon2) => {
    const grid = polygon1.map(({x: x1, y: y1}) => {
        return polygon2.map(({x: x2, y: y2}) => {
            return p5.dist(x1, y1, x2, y2);
        })
    })
    const flat = grid.flat();
    const min = Math.min.apply(null, flat);
    const index = flat.indexOf(min);
    const index1 = Math.floor(index / polygon2.length);
    const index2 = index % polygon2.length;
    return [polygon1[index1], polygon2[index2]];
}

export const getPolygonDirection = (p5, polygon) => {
    if (polygon.length < 2) {
        return 0;
    }
    const {x: x1, y: y1} = polygon[0]
    const {x: x2, y: y2} = polygon.slice(-1)[0]
    const vector = p5.createVector(x1 - x2, y1 - y2);
    return vector.heading();
}
