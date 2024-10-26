export default function VectorRepeller(p5, { x, y }, power = 20000) {
    this.position = p5.createVector(x, y);
    //{!1} How strong is the repeller?
    this.power = power;
    
    this.render = () => {
        p5.noStroke();
        p5.fill(127, 127, 127, 25);
        p5.circle(this.position.x, this.position.y, this.power / 15);
    }
    
    this.repel = (vector = { x: 0, y: 0 }) => {
        //{!6 .code-wide} This is the same repel algorithm we used in Chapter 2: forces based on gravitational attraction.
        let force = P5.Vector.sub(this.position, vector instanceof P5.Vector ? vector : p5.createVector(vector.x, vector.y));
        let distance = force.mag();
        distance = p5.constrain(distance, 20, 50);
        if (distance < 50) {
            // const direction = p5.map(vector.y - this.position.y, -50, 50, -1, 1)
            const direction = -1
            let strength = (direction * this.power) / (distance * distance);
            force.setMag(strength);
            return force;
        } else {
            return p5.createVector(0, 0);
        }
    }
}
