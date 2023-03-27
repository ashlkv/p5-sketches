function Particle(p5, {canvasWidth, canvasHeight, cellSize}) {
    this.update = () => {
        // TODO Why is velocity added to position?
        this.velocity.add(this.acceleration);
        this.velocity.limit(maxVelocity);
        this.position.add(this.velocity);

        // Multiplying acceleration by zero is a way to reset it to zero.
        this.acceleration.mult(0);
    }

    this.show = () => {
        p5.stroke(0, 10);
        p5.strokeWeight(1)
        p5.line(this.position.x, this.position.y, this.previousPosition.x, this.previousPosition.y)
        this.cacheCurrentCoordinates();
    }

    this.applyForce = (force) => {
        this.acceleration.add(force);
    }

    this.wrapAround = () => {
        const overRightEdge = this.position.x > canvasWidth;
        const overLeftEdge = this.position.x < 0;
        const overBottomEdge = this.position.y > canvasHeight;
        const overTopEdge = this.position.y < 0;
        this.position.x = overRightEdge ? 0 : overLeftEdge ? canvasWidth : this.position.x;
        this.position.y = overBottomEdge ? 0 : overTopEdge ? canvasHeight : this.position.y;
        if (overRightEdge || overLeftEdge || overBottomEdge || overTopEdge) {
            this.cacheCurrentCoordinates();
        }
    }

    this.follow = (flowField) => {
        const row = Math.min(Math.floor(this.position.x / cellSize), flowField.length - 1);
        const column = Math.min(Math.floor(this.position.y / cellSize), flowField[0].length - 1);
        this.applyForce(flowField[row][column].vector);
    }

    this.cacheCurrentCoordinates = () => {
        this.previousPosition.x = this.position.x;
        this.previousPosition.y = this.position.y;
    }

    const maxVelocity = 2;
    this.position = p5.createVector(p5.random(canvasWidth), p5.random(canvasHeight));
    this.velocity = p5.createVector(0, 0);
    this.acceleration = p5.createVector(0, 0);
    this.previousPosition = this.position.copy();
}
