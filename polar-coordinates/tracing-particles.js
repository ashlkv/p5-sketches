window.P5 = p5;

new p5((p5) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const particleLimit = 300;
    const particleChance = 1 / 20;

    const getNewWave = () => {
        const amplitude = p5.random(30, 50);
        const wavelength = p5.random(width / 2, width);
        const phase = p5.TWO_PI / p5.random(0, 1);
        return new Wave(p5, amplitude, wavelength, phase, {vertical: true, expanding: 0.003})
    };
    const getParticle = () => {
        const offset = p5.random(-width / 2, width / 2);
        const diameter = p5.random(4, 36)
        const startingAngle = p5.random(0, p5.TWO_PI)
        const rotateSpeed = p5.random(0.03, 0.07);
        let count = 0;
        return {
            render: (x, y) => {
                p5.fill(0);
                p5.noStroke();
                const absoluteX = x + offset + width / 2
                const absoluteY = height - y;
                renderStar(p5, absoluteX, absoluteY, diameter / 4, diameter / 2, 5, startingAngle + rotateSpeed * count);
                count++;
            },
            track: getNewWave(),
            speed: Math.round(p5.random(300, 500)),
        }
    }

    let particles = [];
    let image;

    p5.setup = () => {
        p5.createCanvas(width, height);
        image = p5.loadImage('./svg/kind-page.svg');
    }

    p5.draw = () => {
        p5.rotate(0);
        p5.background(255);

        if (particles.length < particleLimit) {
            if (p5.random(0, 1) <= particleChance) {
                particles.push(getParticle())
            }
        }
        for (const particle of particles) {
            const onTraceEnd = () => particles.splice(particles.indexOf(particle), 1);
            particle.track.trace(particle.render, width, particle.speed, /*onTraceEnd*/)
        }
    }
}, document.querySelector('main'));
