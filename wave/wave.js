window.P5 = p5;

new p5((p5) => {
    let xspacing = 16; // Distance between each horizontal location
    let w; // Width of entire wave
    let theta = 0.0; // Start angle at 0
    let amplitude = 75.0; // Height of wave
    let period = 500.0; // How many pixels before the wave repeats
    let dx; // Value for incrementing x
    let yvalues; // Using an array to store height values for the wave

    p5.setup = () => {
        p5.createCanvas(710, 400);
        w = p5.height + 16;
        dx = (p5.TWO_PI / period) * xspacing;
        yvalues = new Array(Math.floor(w / xspacing));
    }

    p5.draw = () => {
        p5.background(0);
        calcWave();
        renderWave();
    }

    function calcWave() {
        // Increment theta (try different values for
        // 'angular velocity' here)
        theta += 0.02;

        // For every x value, calculate a y value with sine function
        let x = theta;
        for (let i = 0; i < yvalues.length; i++) {
            yvalues[i] = p5.sin(x) * amplitude;
            x += dx;
        }
    }

    function renderWave() {
        p5.noStroke();
        p5.fill(255);
        // A simple way to draw the wave with an ellipse at each location
        for (let x = 0; x < yvalues.length; x++) {
            p5.ellipse(x * xspacing, p5.width / 2 + yvalues[x], 16, 16);
        }
    }
}, document.querySelector('main'));
