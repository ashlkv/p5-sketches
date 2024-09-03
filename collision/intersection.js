export function getPolygonLines(polygon = []) {
    return polygon.reduce((lines, end, index, polygon) => {
        if (index === 0) {
            return lines;
        }
        const start = polygon[index - 1];
        lines.push([start, end])
        if (index === polygon.length - 1) {
            lines.push([end, polygon[0]])
        }
        return lines
    }, [])
}

export function getCenter(polygon) {
    const x = polygon.reduce((sum, { x }) => sum + x, 0)
    const y = polygon.reduce((sum, { y }) => sum + y, 0)
    return { x: x / polygon.length, y: y / polygon.length }
}

/** Returns the intersecting lines with a polygon */
export function getIntersectingLines(p5, lines = [], polygon = []) {
    const polygonLines = getPolygonLines(polygon);
    return lines.reduce((intersecting, source) => {
        const [start, end] = source;
        if (!p5.collideLinePoly(start.x, start.y, end.x, end.y, polygon)) {
            return intersecting;
        }
        const points = polygonLines.reduce((points, target) => {
            const [start1, end1] = target;
            const [start2, end2] = source;
            const { x, y } = p5.collideLineLine(start1.x, start1.y, end1.x, end1.y, start2.x, start2.y, end2.x, end2.y, true);
            if (x !== false && y !== false) {
                points.push({x, y});
            }
            return points;
        }, [])
        if (points.length === 2) {
            intersecting.push([points[0], points[1]])
        }
        return intersecting;
    }, [])
}
