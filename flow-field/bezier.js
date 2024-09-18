export function debugBezier(p5, anchor1, control1, control2, anchor2) {
    p5.line(anchor1.x, anchor1.y, control1.x, control1.y)
    p5.line(anchor2.x, anchor2.y, control2.x, control2.y)
    p5.fill(0)
    p5.circle(anchor1.x, anchor1.y, 5)
    p5.circle(anchor2.x, anchor2.y, 5)
    p5.noFill(0)
    p5.strokeWeight(1)
    p5.circle(control1.x, control1.y, 5)
    p5.circle(control2.x, control2.y, 5)
}
