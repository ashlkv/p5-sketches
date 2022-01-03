const width = 300;
const height = 350;

function setup() {
    createCanvas(width, height);
    background(128);
    frameRate(1);
}

function draw() {
    loadPixels();
    const levelCount = 4; // 4 is red, green, blue and alpha
    for (let y = 0; y < height * pixelDensity(); y ++) {
        for (let x = 0; x < width * pixelDensity() * levelCount; x += levelCount) {
            const pixelIndex = y * width * pixelDensity() * levelCount + x;
            const radius = dist(x / levelCount, y, width / 2 * pixelDensity(), height / 2 * pixelDensity());
            const radialGradient = color(radius);
            pixels[pixelIndex] = red(radialGradient);
            pixels[pixelIndex + 1] = green(radialGradient);
            pixels[pixelIndex + 2] = blue(radialGradient);
            pixels[pixelIndex + 3] = alpha(radialGradient);
        }
    }
    updatePixels();
}
