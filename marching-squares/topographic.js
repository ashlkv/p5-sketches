import { drawLine, drawPoly } from './display.js';

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

function Grid(p5, { canvasSize = { width: 640, height: 480 }, cellSize = 2, initializeValue = (column, row) => {}}) {
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
    cellSize: 10,
  };
  const maxWeights = {nw: 8, ne: 4, se: 2, sw: 1}
  
  const canvasSize = { width: window.innerWidth, height: window.innerHeight }
  let grid

  p5.setup = function () {
    p5.createCanvas(canvasSize.width, canvasSize.height);
    p5.pixelDensity(4);

    const seed = p5.floor(p5.random(9999999));
    const simplex = new SimplexNoise(seed);
    p5.randomSeed(seed);
    const initializeValue = (column, row) => getNoise(16, column, row, simplex, options.noise_persistence, options.noise_scale, options.noise_intensity)
    grid = new Grid(p5, { canvasSize, cellSize: options.cellSize, initializeValue });
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
    let counter = 0;

    grid.render();
    
    p5.push();
    for (let y = 0; y < grid.rows; y++) {
      p5.push();
      for (let x = 0; x < grid.columns; x++) {
        counter ++;
        renderCell(x, y, filled, thresholds, delta, counter);
        p5.translate(grid.cellSize, 0);
      }
      p5.pop();
      p5.translate(0, grid.cellSize);
    }
    p5.pop();
  }

  function renderCell(x, y, filled, allThresholds, delta) {
    const square = { nw: grid.getValue(x, y), ne: grid.getValue(x + 1, y), se: grid.getValue(x + 1, y + 1), sw: grid.getValue(x, y + 1) }
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
        p5.stroke(p5.map(index, 0, allThresholds.length - 1, 0, 250));
        p5.strokeWeight(options.stroke_weight);
        drawLine(p5, direction, ...Object.values(square), threshold.value, grid.cellSize);
      }
    }
  }

  function getThresholds(initial, steps, delta, colors) {
    return Array(steps + 1).fill().map((value, index) => {
      const color = colors.length === 0 ? '#fff' : colors[p5.floor(p5.random(colors.length))];
      return { value: initial + index * delta, color };
    })
  }
});
