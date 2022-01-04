function MyBlob(x, y) {
    this.position = new p5.Vector(x, y);
    this.radius = 40
    this.velocity = p5.Vector.random2D();
    this.velocity.mult(random(2, 5))
    
    this.update = () => {
        this.position.add(this.velocity);
    }
    
    this.show = () => {
        noFill();
        stroke(128);
        ellipse(this.position.x, this.position.y, this.radius * 2, this.radius * 2);
    }
}
