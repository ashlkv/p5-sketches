/**
 * Simplifies work with p5 pixels array.
 * Width and height are required, because pixels is a single-dimensional array
 * In a single-dimensional array there is no way to tell when one line ends and the other begins.
 */
const Pixels = function(p5, pixels = undefined, { width, height }, density = 1) {
    pixels = pixels || p5.pixels;
    density = density || p5.pixelDensity();
    const levels = 4 // rgba
    
    const get = ({ x, y }) => {
        const index = (x + y * width) * levels * Math.pow(density, 2);
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];
        const alpha = pixels[index + 3];
        return {r, g, b, alpha}
    }
    
    return {
        width,
        height,
        reset(initialize = ({x, y}) => ({r: 0, g: 0, b: 0, alpha: 255})) {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (x + y * width) * levels * Math.pow(density, 2);
                    const {r, g, b, alpha} = initialize({x, y});
                    pixels[index] = r;
                    pixels[index + 1] = g;
                    pixels[index + 2] = b;
                    pixels[index + 3] = alpha;
                    if (density === 2) {
                        pixels[index + 4] = r
                        pixels[index + 5] = g
                        pixels[index + 6] = b
                        pixels[index + 7] = alpha
                        
                        pixels[index + 8] = r
                        pixels[index + 9] = g
                        pixels[index + 10] = b
                        pixels[index + 11] = alpha
                        
                        pixels[index + 12] = r
                        pixels[index + 13] = g
                        pixels[index + 14] = b
                        pixels[index + 15] = alpha
                    }
                }
            }
        },
        get,
        set({x, y}, {r, g, b, alpha} = {r: 0, g: 0, b: 0, alpha: 255}) {
            const index = (x + y * width * density) * 4;
            pixels[index] = r;
            pixels[index + 1] = g;
            pixels[index + 2] = b;
            pixels[index + 3] = alpha;
            if (density === 2) {
                pixels[index + 4] = r
                pixels[index + 5] = g
                pixels[index + 6] = b
                pixels[index + 7] = alpha
                
                pixels[index + 8] = r
                pixels[index + 9] = g
                pixels[index + 10] = b
                pixels[index + 11] = alpha
                
                pixels[index + 12] = r
                pixels[index + 13] = g
                pixels[index + 14] = b
                pixels[index + 15] = alpha
            }
        },
        forEach(predicate = (value, x, y) => {}) {
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const value = get({x, y});
                    predicate(value, x, y)
                }
            }
            
        },
        pixels
    }
}

Pixels.slice = (p5, whole, { left = 0, top = 0, width, height } = {}) => {
    const slice = new Pixels(p5, [], { width, height });
    slice.reset(({ x, y }) => {
        return whole.get({ x: left + x, y: top + y })
    })
    return slice;
}

export { Pixels };
