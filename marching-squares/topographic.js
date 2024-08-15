function getNoise(count, column, row, simplex, noisePersistance = 0.55, noiseScale = 350, noiseIntensity = 9) {
    let noise = 0;
    let maxAmplitude = 0;
    let amplitude = 1;
    let frequency = 1 / noiseScale;
    
    function sigmoid(x) {
        return 1 / (1 + Math.exp(-x));
    }
    
    for (let i = 0; i < count; i++) {
        noise += simplex.noise3D(column * frequency, row * frequency, i) * amplitude;
        maxAmplitude += amplitude;
        amplitude *= noisePersistance;
        frequency *= 2;
    }
    const value = noise / maxAmplitude;
    if (noiseIntensity === 0) {
        return value
    } else {
        return 2 * sigmoid(value * noiseIntensity) - 1
    }
}

export function drawLine(p5, direction, nw, ne, se, sw, threshold, size) {
  const n = {x: p5.map(threshold, nw, ne, 0, size), y: 0};
  const e = {x: size, y: p5.map(threshold, ne, se, 0, size)};
  const s = {x: p5.map(threshold, sw, se, 0, size), y: size};
  const w = {x: 0, y: p5.map(threshold, nw, sw, 0, size)};

  if (direction === 1 || direction === 14) p5.line(s.x, s.y, w.x, w.y);
  else if (direction === 2 || direction === 13) p5.line(e.x, e.y, s.x, s.y);
  else if (direction === 3 || direction === 12) p5.line(e.x, e.y, w.x, w.y);
  else if (direction === 4 || direction === 11) p5.line(n.x, n.y, e.x, e.y);
  else if (direction === 6 || direction === 9) p5.line(n.x, n.y, s.x, s.y);
  else if (direction === 7 || direction === 8) p5.line(w.x, w.y, n.x, n.y);
  else if (direction === 5 || direction === 10) {
    p5.line(e.x, e.y, s.x, s.y);
    p5.line(w.x, w.y, n.x, n.y);
  }
}

export function drawPoly(p5, id, v1, v2, v3, v4, threshold, size) {
  const n = [p5.map(threshold, v1, v2, 0, size), 0];
  const e = [size, p5.map(threshold, v2, v3, 0, size)];
  const s = [p5.map(threshold, v4, v3, 0, size), size];
  const w = [0, p5.map(threshold, v1, v4, 0, size)];
  const nw = [0, 0];
  const ne = [size, 0];
  const se = [size, size];
  const sw = [0, size];

  p5.noStroke();
  p5.beginShape();
  if (id === 1) {
    p5.vertex(...s);
    p5.vertex(...w);
    p5.vertex(...sw);
  } else if (id === 2) {
    p5.vertex(...e);
    p5.vertex(...s);
    p5.vertex(...se);
  } else if (id === 3) {
    p5.vertex(...e);
    p5.vertex(...w);
    p5.vertex(...sw);
    p5.vertex(...se);
  } else if (id === 4) {
    p5.vertex(...n);
    p5.vertex(...e);
    p5.vertex(...ne);
  } else if (id === 5) {
    p5.vertex(...e);
    p5.vertex(...s);
    p5.vertex(...sw);
    p5.vertex(...w);
    p5.vertex(...n);
    p5.vertex(...ne);
  } else if (id === 6) {
    p5.vertex(...n);
    p5.vertex(...s);
    p5.vertex(...se);
    p5.vertex(...ne);
  } else if (id === 7) {
    p5.vertex(...w);
    p5.vertex(...n);
    p5.vertex(...ne);
    p5.vertex(...se);
    p5.vertex(...sw);
  } else if (id === 15) {
    p5.vertex(...nw);
    p5.vertex(...ne);
    p5.vertex(...se);
    p5.vertex(...sw);
  } else if (id === 14) {
    p5.vertex(...s);
    p5.vertex(...w);
    p5.vertex(...nw);
    p5.vertex(...ne);
    p5.vertex(...se);
  } else if (id === 13) {
    p5.vertex(...e);
    p5.vertex(...s);
    p5.vertex(...sw);
    p5.vertex(...nw);
    p5.vertex(...ne);
  } else if (id === 12) {
    p5.vertex(...e);
    p5.vertex(...w);
    p5.vertex(...nw);
    p5.vertex(...ne);
  } else if (id === 11) {
    p5.vertex(...n);
    p5.vertex(...e);
    p5.vertex(...se);
    p5.vertex(...sw);
    p5.vertex(...nw);
  } else if (id === 10) {
    p5.vertex(...e);
    p5.vertex(...se);
    p5.vertex(...s);
    p5.vertex(...w);
    p5.vertex(...nw);
    p5.vertex(...n);
  } else if (id === 9) {
    p5.vertex(...n);
    p5.vertex(...s);
    p5.vertex(...sw);
    p5.vertex(...nw);
  } else if (id === 8) {
    p5.vertex(...w);
    p5.vertex(...n);
    p5.vertex(...nw);
  }
  p5.endShape(p5.CLOSE);
}


function Grid(p5, {
    canvasSize = {width: 640, height: 480}, cellSize = 2, initializeValue = (column, row) => {
    }
}) {
    this.cellSize = cellSize;
    this.columns = Math.floor(canvasSize.width / cellSize);
    this.rows = Math.floor(canvasSize.height / cellSize);
    this.values = Array(this.rows + 1).fill()
        .map((value, row) => Array(this.columns + 1).fill()
            .map((value, column) => initializeValue(column, row)))
    this.getValue = (column, row) => {
        return this.values[row][column];
    }
    this.render = () => {
        this.values.forEach((columns, row) => columns.forEach((value, column) => {
            const color = p5.map(value, -1, 0, 0, 255)
            p5.strokeWeight(3)
            p5.stroke(color)
            p5.point(column * cellSize, row * cellSize)
        }))
    }
}

new p5((p5) => {
    const options = {
        noise_scale: 350,
        noise_persistence: 0.55,
        noise_intensity: 9,
        color: '#ffc70b',
        bg_color: '#ffffff',
        stroke_weight: 1,
        line_density: 15,
        range: 0.5,
        cellSize: 2,
    };
    const maxWeights = {nw: 8, ne: 4, se: 2, sw: 1}
    
    const canvasSize = {width: window.innerWidth, height: window.innerHeight}
    let grid
    
    p5.setup = function() {
        p5.createCanvas(canvasSize.width, canvasSize.height);
        p5.pixelDensity(4);
        
        const seed = p5.floor(p5.random(9999999));
        const simplex = new SimplexNoise(seed);
        p5.randomSeed(seed);
        const initializeValue = (column, row) => getNoise(16, column, row, simplex, options.noise_persistence, options.noise_scale, options.noise_intensity)
        grid = new Grid(p5, {canvasSize, cellSize: options.cellSize, initializeValue});
    };
    
    p5.draw = () => {
        const ratio = options.range * 2;
        const lineCount = ratio * options.line_density;
        
        p5.push();
        p5.background(options.bg_color);
        // Render "sea"
        render(-1 + ratio, 1, 2 - ratio, [options.color]);
        // Render lines
        render(-1, lineCount, 1 / options.line_density, []);
        p5.pop();
        p5.noise();
        p5.noLoop()
    }
    
    function render(initialThreshold, steps, delta, colors) {
        const thresholds = getThresholds(initialThreshold, steps, delta, colors);
        const filled = colors.length !== 0;
        
        // grid.render();
        
        p5.push();
        for (let y = 0; y < grid.rows; y++) {
            p5.push();
            for (let x = 0; x < grid.columns; x++) {
                renderCell(x, y, filled, thresholds, delta);
                p5.translate(grid.cellSize, 0);
            }
            p5.pop();
            p5.translate(0, grid.cellSize);
        }
        p5.pop();
    }
    
    function renderCell(x, y, filled, allThresholds, delta) {
        const square = {
            nw: grid.getValue(x, y),
            ne: grid.getValue(x + 1, y),
            se: grid.getValue(x + 1, y + 1),
            sw: grid.getValue(x, y + 1)
        }
        const min = p5.min(Object.values(square));
        const max = p5.max(Object.values(square));
        const thresholdIndices = allThresholds
            .map((threshold, index) => threshold.value >= min - delta && threshold.value <= max ? index : -1)
            .filter(index => index !== -1);
        
        for (const index of thresholdIndices) {
            const threshold = allThresholds[index];
            const direction = Object.entries(square).reduce((sum, [key, value]) => {
                return value > threshold.value ? sum + maxWeights[key] : sum;
            }, 0);
            
            if (filled) {
                p5.fill(threshold.color);
                drawPoly(p5, direction, ...Object.values(square), threshold.value, grid.cellSize);
            } else {
                p5.stroke(0);
                p5.strokeWeight(options.stroke_weight);
                drawLine(p5, direction, ...Object.values(square), threshold.value, grid.cellSize);
            }
        }
    }
    
    function getThresholds(initial, steps, delta, colors) {
        return Array(steps + 1).fill().map((value, index) => {
            const color = colors.length === 0 ? '#fff' : colors[p5.floor(p5.random(colors.length))];
            return {value: initial + index * delta, color};
        })
    }
});
