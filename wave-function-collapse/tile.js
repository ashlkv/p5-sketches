import {Pixels} from "../common/pixels.js";

export const directions = {
    right: 0,
    left: 1,
    top: 2,
    bottom: 3,
}

/**
 * @param p5
 * @param pixels Pixels instance
 */
export const Tile = function(p5, pixels) {
    this.pixels = pixels;
    
    const overlaps = (tile, direction) => {
        const {width: width1, height: height1} = this.pixels;
        const {width: width2, height: height2} = tile.pixels;
        if ((direction === directions.right || direction === directions.left) && height1 !== height2) {
            return false;
        } else if ((direction === directions.top || direction === directions.bottom) && width1 !== width2) {
            return false;
        }
        let slice1;
        let slice2;
        if (direction === directions.right) {
            // FIXME Pixels.slice makes a copy, this is not too optimal
            slice1 = Pixels.slice(p5, this.pixels, {left: width1 - 2, top: 0, width: 2, height: height1})
            slice2 = Pixels.slice(p5, tile.pixels, {left: 0, top: 0, width: 2, height: height2})
        } else if (direction === directions.left) {
            slice1 = Pixels.slice(p5, this.pixels, {left: 0, top: 0, width: 2, height: height1})
            slice2 = Pixels.slice(p5, tile.pixels, {left: width2 - 2, top: 0, width: 2, height: height2})
        } else if (direction === directions.top) {
            slice1 = Pixels.slice(p5, this.pixels, {left: 0, top: 0, width: width1, height: 2})
            slice2 = Pixels.slice(p5, tile.pixels, {left: 0, top: height2 - 2, width: width2, height: 2})
        } else if (direction === directions.bottom) {
            slice1 = Pixels.slice(p5, this.pixels, {left: 0, top: height1 - 2, width: width1, height: 2})
            slice2 = Pixels.slice(p5, tile.pixels, {left: 0, top: 0, width: width2, height: 2})
        } else {
            throw 'Unknown direction when detecting overlapping tiles'
        }
        return slice1.equals(slice2)
    }
    
    this.getNeighbors = (tiles = []) => {
        /** Dictionary of indexes of overlapping tiles per direction. */
        const neighbors = {
            [directions.right]: [],
            [directions.left]: [],
            [directions.top]: [],
            [directions.bottom]: [],
        }
        tiles.forEach((tile, index) => {
            if (Object.is(this, tile)) {
                return;
            }
            if (overlaps(tile, directions.right)) {
                neighbors[directions.right].push(index)
            } else if (overlaps(tile, directions.left)) {
                neighbors[directions.left].push(index)
            } else if (overlaps(tile, directions.top)) {
                neighbors[directions.top].push(index)
            } else if (overlaps(tile, directions.bottom)) {
                neighbors[directions.bottom].push(index)
            }
        })
        return neighbors;
    }
}
