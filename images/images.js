window.P5 = p5;

// Make sure to serve the corresponding html file with yarn serve from the project root.
// Otherwise, attempting to load an image will give a cors error.
new p5((p5) => {
    const width = 600;
    const height = 600;
    let img;

    p5.preload = () => {
        // Note that svg image intrinsic dimensions, have to be approximately the same size as rendered on p5 canvas.
        // Otherwise, svg will be blurry if resized.
        img = p5.loadImage('./icon.svg');
    }

    p5.setup = () => {
        p5.createCanvas(width, height);
        p5.background(122);
        // p5.image(img, 10, 10, width - 10, height - 10);
        p5.image(img, 10, 10, 300, 300);
    }

    p5.draw = () => {
    }
}, document.querySelector('main'));
