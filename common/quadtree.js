/**
 * Utility classes for Quadtree data structure
 */

class Rectangle {
    /**
     * @param x center of the rectangle
     * @param y center of the rectangle
     * @param width
     * @param height
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    contains(point = {x: 0, y: 0}) {
        const { x, y, width, height } = this;
        const box = { left: x - width / 2, top: y - height / 2, right: x + width / 2, bottom: y + height / 2 }
        return point.x >= box.left && point.x <= box.right && point.y >= box.top && point.y <= box.bottom;
    }
}

function Quadtree(p5, boundary, capacity) {
    this.boundary = new Rectangle(boundary.x, boundary.y, boundary.width, boundary.height);
    this.capacity = capacity;
    this.points = [];
    this.divided = false;
    this.top = this.boundary.y - this.boundary.height / 2;
    this.left = this.boundary.x - this.boundary.width / 2;
    this.width = this.boundary.width;
    this.height = this.boundary.height;

    this.subdivide = function () {
        const {x, y, width, height} = this.boundary;
        const northwest = {x: x - width / 4, y: y - height / 4, width: width / 2, height: height / 2};
        const northeast = {x: x + width / 4, y: y - height / 4, width: width / 2, height: height / 2};
        const southeast = {x: x + width / 4, y: y + height / 4, width: width / 2, height: height / 2};
        const southwest = {x: x - width / 4, y: y + height / 4, width: width / 2, height: height / 2};
        this.northwest = new Quadtree(p5, northwest, this.capacity);
        this.northeast = new Quadtree(p5, northeast, this.capacity);
        this.southeast = new Quadtree(p5, southeast, this.capacity);
        this.southwest = new Quadtree(p5, southwest, this.capacity);
    }

    this.add = function(point) {
        if (!this.boundary.contains(point)) {
            return;
        }
        if (this.points.length < this.capacity) {
            this.points.push(point)
            return;
        }
        if (!this.divided) {
            this.subdivide()
            this.divided = true;
        }
        if (this.northwest.contains(point)) {
            this.northwest.add(point)
        } else if (this.northeast.contains(point)) {
            this.northeast.add(point);
        } else if (this.southeast.contains(point)) {
            this.southeast.add(point);
        } else if (this.southwest.contains(point)) {
            this.southwest.add(point);
        }
    }

    this.contains = function(point) {
        return this.boundary.contains(point)
    }

    this.render = function() {
        if (this.divided) {
            this.northwest.render();
            this.northeast.render();
            this.southeast.render();
            this.southwest.render();
        } else {
            const {x, y, width, height} = this.boundary;
            p5.strokeWeight(1)
            p5.stroke(0)
            p5.rect(x - width / 2, y - height / 2, width, height)
        }
    }
}

export { Rectangle, Quadtree };