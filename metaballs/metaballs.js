const width = 300;
const height = 350;

let myBlob;

function setup() {
    createCanvas(width, height);
    background(128);
    // frameRate(1);
    myBlob = new MyBlob(100, 100)
    
}

function draw() {
    loadPixels();
    const levelCount = 4; // 4 is red, green, blue and alpha
    for (let y = 0; y < height * pixelDensity(); y ++) {
        for (let x = 0; x < width * pixelDensity() * levelCount; x += levelCount) {
            const pixelIndex = y * width * pixelDensity() * levelCount + x;
            const distance = dist(x / levelCount, y, myBlob.position.x * pixelDensity(), myBlob.position.y * pixelDensity());
            const radialGradient = color(myBlob.radius / distance * 1000);
            pixels[pixelIndex] = red(radialGradient);
            pixels[pixelIndex + 1] = green(radialGradient);
            pixels[pixelIndex + 2] = blue(radialGradient);
            pixels[pixelIndex + 3] = alpha(radialGradient);
        }
    }
    updatePixels();
    myBlob.update();
    // myBlob.show();
}
