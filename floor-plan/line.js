const Line = function(from = {x: 0, y: 0}, to = {x: 0, y: 0}) {
    this.from = from;
    this.to = to;
    this.getAngle = () => {
        if (this.from.y === this.to.y) {
            return this.from.x < this.to.x ? 0 : PI;
        } else if (this.from.x === this.to.x) {
            return this.from.y < this.to.y ? 1.5 * PI : 0.5 * PI;
        }
    }
    this.extrude = (length) => {
        const angle = this.getAngle();
        return [
            {x: this.from.x, y: this.from.y},
            {
                x: angle === 1.5 * PI ? this.from.x + length : angle === 0.5 * PI ? this.from.x - length : this.from.x,
                y: angle === 0 ? this.from.y - length : angle === PI ? this.from.y + length : this.from.y,
            },
            {
                x: angle === 1.5 * PI ? this.to.x + length : angle === 0.5 * PI ? this.to.x - length : this.to.x,
                y: angle === 0 ? this.to.y - length : angle === PI ? this.to.y + length : this.to.y,
            },
            {x: this.to.x, y: this.to.y}
        ]
    }
}
