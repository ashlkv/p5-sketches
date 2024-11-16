import '../libraries/poisson-disk-sampling.min.js'

export function poissonSample(p5, count, width, height) {
  let distance = width / Math.sqrt((count * height) / width);
  let sampling = new PoissonDiskSampling({
    shape: [width, height],
    minDistance: distance * 0.8,
    maxDistance: distance * 1.6,
    tries: 15
  }, p5.random);
  return sampling.fill().map(([x, y]) => ({x, y}));
}

export function randomSample(p5, count, width, height) {
  return Array(count).fill().map(() => ({x: Math.round(p5.random(0, width - 1)), y: Math.round(p5.random(0, height - 1)) }))
}

export const anchorSample = (p5, count, anchor, width, height) => {
    return Array(count).fill().map(() => ({x: Math.round(p5.random(0, width - 1) + anchor.x - width / 2), y: Math.round(p5.random(0, height - 1) + anchor.y - height / 2) }))
}

