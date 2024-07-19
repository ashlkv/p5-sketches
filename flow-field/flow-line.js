function FlowLine(p5, {column, row, noiseIncrement, cellSize, visible = false}) {
    this.update = (time = undefined) => {
        this.angle = p5.noise(column * noiseIncrement, row * noiseIncrement, time) * p5.TWO_PI;
        this.vector = P5.Vector.fromAngle(this.angle)
        this.vector.setMag(5);
        p5.strokeWeight(1)
        p5.stroke(0, 50);
        p5.push();
        p5.translate(column * cellSize, row * cellSize);
        p5.rotate(this.vector.heading());
        if (visible) {
            p5.line(0, 0, cellSize, 0)
        }
        p5.pop();
    }

    this.update()
}
