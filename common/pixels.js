export const Pixels = function(p5, width, height) {
    const density = p5.pixelDensity();
    const levels = 4
    
    return {
        reset(initialize = (x, y) => ({r: 0, g: 0, b: 0, alpha: 255})) {
            for (let x = 0; x < width; x++) {
                for (let y = 0; y < height; y++) {
                    const index = (x + y * width) * levels * Math.pow(density, 2);
                    const {r, g, b, alpha} = initialize(x, y);
                    p5.pixels[index] = r;
                    p5.pixels[index + 1] = g;
                    p5.pixels[index + 2] = b;
                    p5.pixels[index + 3] = alpha;
                    if (density === 2) {
                        p5.pixels[index + 4] = r
                        p5.pixels[index + 5] = g
                        p5.pixels[index + 6] = b
                        p5.pixels[index + 7] = alpha
                        
                        p5.pixels[index + 8] = r
                        p5.pixels[index + 9] = g
                        p5.pixels[index + 10] = b
                        p5.pixels[index + 11] = alpha
                        
                        p5.pixels[index + 12] = r
                        p5.pixels[index + 13] = g
                        p5.pixels[index + 14] = b
                        p5.pixels[index + 15] = alpha
                    }
                }
            }
        },
        get(x, y) {
            const index = (x + y * width * density) * 4;
            const r = p5.pixels[index];
            const g = p5.pixels[index + 1];
            const b = p5.pixels[index + 2];
            const alpha = p5.pixels[index + 3];
            return {r, g, b, alpha}
        },
        set(x, y, {r, g, b, alpha} = {r: 0, g: 0, b: 0, alpha: 255}) {
            const index = (x + y * width * density) * 4;
            p5.pixels[index] = r;
            p5.pixels[index + 1] = g;
            p5.pixels[index + 2] = b;
            p5.pixels[index + 3] = alpha;
            if (density === 2) {
                p5.pixels[index + 4] = r
                p5.pixels[index + 5] = g
                p5.pixels[index + 6] = b
                p5.pixels[index + 7] = alpha
                
                p5.pixels[index + 8] = r
                p5.pixels[index + 9] = g
                p5.pixels[index + 10] = b
                p5.pixels[index + 11] = alpha
                
                p5.pixels[index + 12] = r
                p5.pixels[index + 13] = g
                p5.pixels[index + 14] = b
                p5.pixels[index + 15] = alpha
            }
        },
    }
    
}
