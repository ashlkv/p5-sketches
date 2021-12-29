const width = 600;
const height = 700;

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
            const redColor = color(x / levelCount / pixelDensity(), 0, y / levelCount / pixelDensity());
            const pixelIndex = y * width * pixelDensity() * levelCount + x;
            pixels[pixelIndex] = red(redColor);
            pixels[pixelIndex + 1] = green(redColor);
            pixels[pixelIndex + 2] = blue(redColor);
            pixels[pixelIndex + 3] = alpha(redColor);
        }
    }
    updatePixels();
}
