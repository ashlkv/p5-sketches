new p5((p5) => {
    let img;
    let font1;
    let firstCopyW, firstCopyH;
    let angle1 = 0;
    let scalar = 20;
    const sizeRatio = 0.5;
    p5.preload = () => {
        font1 = p5.loadFont('./circe4p5.ttf');
    };
    
    p5.setup = () => {
        // const { width, height } = container.getBoundingClientRect();
        // const renderer = p5.createCanvas(width, width * sizeRatio);
        // renderer.parent(container.getAttribute('id'));
        const width = 375;
        p5.createCanvas(width, width * sizeRatio)
        
        // slider = p5.createSlider(3, 20, 10);
        // slider.position(10, 10);
        // slider.style('width', '80px');
        
        p5.background(127);
        // For some reason, it is important that the createGraphics width is smaller than canvas width
        const imageWidth = width - 1;
        img = p5.createGraphics(imageWidth, imageWidth * sizeRatio);
        img.background(255);
        img.fill(255, 0, 0);
        img.textFont(font1);
        img.textSize(400);
        img.translate(p5.width / 2, p5.height / 3.5);
        img.textAlign(p5.CENTER, p5.CENTER);
    };
    
    p5.draw = () => {
        const {width} = /*container.getBoundingClientRect()*/ {width: 375};
        p5.background(0);
        
        firstCopyW = width / 4;
        firstCopyH = (width * sizeRatio) / 4;
        
        let ang1 = p5.radians(angle1);
        let x1 = scalar * p5.cos(ang1);
        //
        img.background(255);
        p5.push();
        img.translate(x1, 0);
        p5.pop();
        img.text('White Label', 0, 0);
        
        p5.image(img, 0, 0, firstCopyW * 4, firstCopyH * 4);
        for (let i = 4; i > 1; i--) {
            p5.imageMode(p5.CENTER);
            p5.push();
            p5.translate(p5.width / 2, p5.height / 2);
            p5.image(img, 0, 0, firstCopyW * i, firstCopyH * i);
            p5.pop();
        }
        
        angle1 += 2;
    };
})


