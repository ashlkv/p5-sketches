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

export function drawSpline(p5, direction, nw, ne, se, sw, threshold, size) {
  const n = {x: p5.map(threshold, nw, ne, 0, size), y: 0};
  const e = {x: size, y: p5.map(threshold, ne, se, 0, size)};
  const s = {x: p5.map(threshold, sw, se, 0, size), y: size};
  const w = {x: 0, y: p5.map(threshold, nw, sw, 0, size)};

  if (direction === 1 || direction === 14) {
    p5.curveVertex(s.x, s.y);
    p5.curveVertex(w.x, w.y);
  }
  else if (direction === 2 || direction === 13) {
    p5.curveVertex(e.x, e.y);
    p5.curveVertex(s.x, s.y);
  }
  else if (direction === 3 || direction === 12) {
    p5.curveVertex(e.x, e.y);
    p5.curveVertex(w.x, w.y);
  }
  else if (direction === 4 || direction === 11) {
    p5.curveVertex(n.x, n.y);
    p5.curveVertex(e.x, e.y);
  }
  else if (direction === 6 || direction === 9) {
    p5.curveVertex(n.x, n.y);
    p5.curveVertex(s.x, s.y);
  }
  else if (direction === 7 || direction === 8) {
    p5.curveVertex(w.x, w.y);
    p5.curveVertex(n.x, n.y)
  }
  else if (direction === 5 || direction === 10) {
    p5.curveVertex(e.x, e.y);
    p5.curveVertex(s.x, s.y);
    p5.curveVertex(w.x, w.y);
    p5.curveVertex(n.x, n.y);
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

export function draw_grid(p, dim, num) {
  const spacing = dim / num;
  p.stroke(0, 70);
  for (let i = 0; i <= num; i++) {
    p.line(i * spacing, 0, i * spacing, dim);
    p.line(0, i * spacing, dim, i * spacing);
  }
}
