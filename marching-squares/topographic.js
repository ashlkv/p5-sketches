import { draw_line, draw_poly } from './display.js';

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

function Grid(canvasSize = { width: 640, height: 480 }, cellSize = 2, initializeValue = (column, row) => {}) {
  this.cellSize = cellSize;
  this.columns = Math.floor(canvasSize.width / cellSize);
  this.rows = Math.floor(canvasSize.height / cellSize);
  this.values = Array(this.rows + 1).fill()
                  .map((value, row) => Array(this.columns + 1).fill()
                      .map((value, column) => initializeValue(column, row)))
  this.getValue = (column, row) => {
    return this.values[row][column];
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
  };
  
  const canvasSize = { width: window.innerWidth, height: window.innerHeight }
  let grid

  p5.setup = function () {
    p5.createCanvas(canvasSize.width, canvasSize.height);
    p5.pixelDensity(4);

    const seed = p5.floor(p5.random(9999999));
    const simplex = new SimplexNoise(seed);
    p5.randomSeed(seed);
    const initializeValue = (column, row) => getNoise(16, column, row, simplex, options.noise_persistence, options.noise_scale, options.noise_intensity)
    grid = new Grid(canvasSize, 2, initializeValue);
  };
  
  p5.draw = () => {
    const ratio = options.range * 2;
    const number_of_lines = ratio * options.line_density;
  
    p5.push();
    p5.background(options.bg_color);
    render(-1 + ratio, 1, 2 - ratio, [options.color]);
    render(-1, number_of_lines, 1 / options.line_density, []);
    p5.pop();
    p5.noise();
  }

  function render(initialThreshold, steps, delta, colors) {
    const thresholds = getThresholds(initialThreshold, steps, delta, colors);
    const filled = colors.length !== 0;

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
    const values = { nw: grid.getValue(x, y), ne: grid.getValue(x + 1, y), se: grid.getValue(x + 1, y + 1), sw: grid.getValue(x, y + 1) }
    const min = p5.min(Object.values(values));
    const max = p5.max(Object.values(values));
    const thresholds = allThresholds.filter((t) => t.value >= min - delta && t.value <= max);

    for (const threshold of thresholds) {
      const borders = {
        nw: values.nw > threshold.value ? 8 : 0,
        ne: values.ne > threshold.value ? 4 : 0,
        se: values.se > threshold.value ? 2 : 0,
        sw: values.sw > threshold.value ? 1 : 0
      }

      const number = Object.values(borders).reduce((sum, value) => sum + value, 0);

      if (filled) {
        p5.fill(threshold.color);
        draw_poly(p5, number, ...Object.values(values), threshold.value, grid.cellSize);
      } else {
        p5.stroke('#000');
        p5.strokeWeight(options.stroke_weight);
        draw_line(p5, number, ...Object.values(values), threshold.value, grid.cellSize);
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
