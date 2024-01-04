/** Home-made worley noise, https://en.wikipedia.org/wiki/Worley_noise */

window.P5 = p5;

new p5((p5) => {
    const pixelDensity = p5.pixelDensity();
    const intrinsicWidth = 400;
    const intrinsicHeight = 400;
    const intrinsicDepth = 400;
    const width = intrinsicWidth * pixelDensity;
    const height = intrinsicHeight * pixelDensity;
    const depth = intrinsicHeight * pixelDensity;
    const levelCount = 4; // 4 is red, green, blue and alpha
    const featurePoints = Array(25);

    p5.setup = () => {
        p5.createCanvas(intrinsicWidth, intrinsicHeight);
        p5.background(255);
        p5.frameRate(2);
        for (let i = 0; i < featurePoints.length; i++) {
            const [x, y, z] = [p5.random(intrinsicWidth), p5.random(intrinsicHeight), p5.random(intrinsicDepth)]
            featurePoints[i] = new P5.Vector(x, y, z)
        }
    }

    p5.draw = () => {
        p5.loadPixels();
        for (let y = 0; y < height; y ++) {
            for (let x = 0; x < width; x ++) {
                // Distance from the given pixel to all feature points
                const distances = Array(featurePoints.length)
                for (let i = 0; i < featurePoints.length; i++) {
                    const point = featurePoints[i];
                    const z = p5.frameCount % width;
                    distances[i] = p5.dist(x, y, z, point.x * pixelDensity, point.y * pixelDensity, point.z * pixelDensity)
                }
                // Sorting moves the shortest distance to the beginning of the array
                const shortestDistances = p5.sort(distances)
                const closestPointIndex = 0;
                const noise = p5.map(shortestDistances[closestPointIndex], 0, width / 4, 0, 255);
                const color = p5.color(noise);
                const pixelIndex = y * width * levelCount + x * levelCount;
                p5.pixels[pixelIndex] = p5.red(color);
                p5.pixels[pixelIndex + 1] = p5.green(color);
                p5.pixels[pixelIndex + 2] = p5.blue(color);
                p5.pixels[pixelIndex + 3] = p5.alpha(color);
            }
        }
        p5.updatePixels();
    
        // Paints feature points
       /* for (const point of featurePoints) {
            p5.strokeWeight(6)
            p5.stroke(0, 255, 0)
            p5.point(point.x, point.y)
        }*/
        // p5.noLoop();
    }
}, document.querySelector('main'))

