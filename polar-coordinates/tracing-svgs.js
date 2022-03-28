window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    const particleLimit = 20;
    const particleChance = 1 / 50;

    let images = [];
    let particles = [];

    const getNewWave = () => {
        const amplitude = p5.random(20, 30);
        const wavelength = p5.random(width / 2, width);
        const phase = p5.TWO_PI / p5.random(0, 1);
        return new Wave(p5, amplitude, wavelength, phase, {vertical: true, expanding: 0.003})
    };
    const getParticle = () => {
        const offset = p5.random(-width / 2, width / 2);
        const diameter = p5.random(20, 36)
        const startingAngle = p5.random(0, p5.TWO_PI)
        const rotateSpeed = p5.random(0.02, 0.05);
        const imageIndex = Math.round(p5.random(0, images.length - 1));
        let count = 0;
        return {
            render: (x, y) => {
                p5.fill(0);
                p5.noStroke();
                const absoluteX = x + offset + width / 2
                const absoluteY = height - y;
                p5.push();
                p5.translate(absoluteX, absoluteY);
                p5.rotate(startingAngle + rotateSpeed * count);
                p5.imageMode(p5.CENTER)
                p5.image(images[imageIndex], 0, 0, diameter, diameter);
                p5.pop();
                count++;
            },
            track: getNewWave(),
            speed: Math.round(p5.random(500, 600)),
        }
    }

    p5.setup = () => {
        p5.createCanvas(width, height);
        images.push(p5.loadImage('./svg/kind-page.svg'));
        images.push(p5.loadImage('./svg/kind-email.svg'));
        images.push(p5.loadImage('./svg/kind-picture-choice.svg'));
        images.push(p5.loadImage('./svg/kind-rating.svg'));
        images.push(p5.loadImage('./svg/kind-scale.svg'));
        images.push(p5.loadImage('./svg/kind-text-choice-single.svg'));
        images.push(p5.loadImage('./svg/kind-write-text.svg'));
    }

    p5.draw = () => {
        p5.rotate(0);
        p5.background(0);

        if (particles.length < particleLimit) {
            if (p5.random(0, 1) <= particleChance) {
                particles.push(getParticle())
            }
        }
        for (const particle of particles) {
            const onTraceEnd = () => particles.splice(particles.indexOf(particle), 1);
            particle.track.trace(particle.render, width, particle.speed, onTraceEnd)
        }
    }
}, document.querySelector('main'));
