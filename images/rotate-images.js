window.P5 = p5;

// Make sure to serve the corresponding html file with yarn serve from the project root.
// Otherwise, attempting to load an image will give a cors error.
new p5((p5) => {
    const width = 600;
    const height = 600;
    let img;
    let angle = 0;

    p5.preload = () => {
        img = p5.loadImage('./icon.svg');
    }

    p5.setup = () => {
        p5.createCanvas(width, height);
    }

    p5.draw = () => {
        p5.background(122);
        p5.imageMode(p5.CENTER);

        for (let i = 0; i < 5; i++) {
            p5.push()
            p5.translate(100 * i, 100 * i)
            p5.rotate(angle)
            p5.image(img, 0, 0, 24, 24);
            p5.pop()
        }

        angle += 0.01;

    }
}, document.querySelector('main'));
