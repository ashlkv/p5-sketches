window.P5 = p5;

new p5((p5) => {
    const width = 600;
    const height = 600;
    const particleLimit = 100;
    const particleChance = 1 / 50;

    const getNewWave = () => {
        const amplitude = p5.random(30, 50);
        const wavelength = p5.random(width / 2, width);
        const phase = p5.TWO_PI / p5.random(0, 1);
        return new Wave(p5, amplitude, wavelength, phase, {vertical: true, reversed: true, expanding: 0.003})
    };
    const getParticle = () => {
        const offset = p5.random(-width / 2, width / 2);
        const diameter = p5.random(4, 20)
        const startingAngle = p5.random(0, p5.TWO_PI)
        const rotateSpeed = p5.random(0.03, 0.07);
        let count = 0;
        return {
            render: (x, y) => {
                p5.fill(0);
                p5.noStroke();
                renderStar(x + offset, y, diameter / 4, diameter / 2, 5, startingAngle + rotateSpeed * count);
                count++;
            },
            track: getNewWave(),
            speed: Math.round(p5.random(300, 500)),
        }
    }
    const renderStar = (x, y, radius1, radius2, npoints, startingAngle = 0) => {
        let angle = p5.TWO_PI / npoints;
        let halfAngle = angle / 2.0;
        p5.beginShape();
        for (let a = startingAngle; a < p5.TWO_PI + startingAngle; a += angle) {
            let sx = x + p5.cos(a) * radius2;
            let sy = y + p5.sin(a) * radius2;
            p5.vertex(sx, sy);
            sx = x + p5.cos(a + halfAngle) * radius1;
            sy = y + p5.sin(a + halfAngle) * radius1;
            p5.vertex(sx, sy);
        }
        p5.endShape(p5.CLOSE);
    }

    let particles = [];

    p5.setup = () => {
        p5.createCanvas(width, height);
    }

    p5.draw = () => {
        p5.background(255);
        p5.translate(width / 2, height)
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
