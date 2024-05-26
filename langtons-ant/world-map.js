// Langton's ant on world map

new p5((p5) => {
    const width = 200
    const height = 140
    const palette = new Set()
    let image;
    let ruleDictionary;
    let position = {x: Math.round(p5.random(0, width - 1)), y: Math.round(p5.random(0, height - 1))}
    let direction = DIRECTION.UP
    let density = p5.pixelDensity();
    
    const getNextColor = (color) => {
        return ruleDictionary[color].color;
    }
    const getNextDirection = (color, direction) => {
        return ruleDictionary[color].turn === 'clockwise' ? turnClockwise(direction) : turnCounterClockwise(direction);
    }
    const getRgbAtCoordinates = ({ x, y }) => {
        const index = (y * width + x) * density * 4;
        return [p5.pixels[index], p5.pixels[index + 1], p5.pixels[index + 2]]
    }
    const setRgbAtCoordinates = ({ x, y }, [r, g, b]) => {
        const index = (y * width + x) * density * 4;
        p5.pixels[index] = r
        p5.pixels[index + 1] = g
        p5.pixels[index + 2] = b
        
        if (density === 2) {
            p5.pixels[index + 4] = r
            p5.pixels[index + 5] = g
            p5.pixels[index + 6] = b
            
            p5.pixels[index + 8] = r
            p5.pixels[index + 9] = g
            p5.pixels[index + 10] = b
            
            p5.pixels[index + 12] = r
            p5.pixels[index + 13] = g
            p5.pixels[index + 14] = b
        }
    }
    
    p5.preload = () => {
      image = p5.loadImage('./world-map-2x2.png');
    }
    
    p5.setup = () => {
        p5.frameRate(25)
        p5.createCanvas(width, height);
        p5.image(image, 0, 0, width, height)
        p5.loadPixels();
    
        for (let i = 0; i < p5.pixels.length / 4; i = i + 4) {
            const rgb = [p5.pixels[i], p5.pixels[i + 1], p5.pixels[i + 2]]
            const hex = rgb2Hex(rgb);
            palette.add(hex);
        }
        const rules = getRandomRules(Array.from(palette));
        ruleDictionary = getRuleDictionary(rules);
    }

    p5.draw = () => {
        p5.strokeWeight(1)
        for (let i = 0; i < 10; i++) {
            const { x, y } = position;
            
            const previousRgb = getRgbAtCoordinates({ x, y });
            const previousHex = rgb2Hex(previousRgb)
            const nextHex = getNextColor(previousHex);
            const nextRgb = hex2rgb(nextHex)
            setRgbAtCoordinates({ x, y }, nextRgb)
            direction = getNextDirection(previousHex, direction);
            position = moveForward(position, direction, { width, height });
            
            const [r, g, b] = nextRgb
            p5.stroke(r, g, b);
            p5.rect(x, y, 2, 2);
        }
    }
}, document.querySelector('main'))
