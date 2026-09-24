// spec/icons/geometry.mjs
//
// Geometry toolkit shared by the icon code generator (spec/generators/generate-icons.mjs)
// and the icon conformance gate (scripts/check-icon-spec.mjs).
//
// The icon registry stores artwork as a small, explicit SVG element vocabulary
// (path / circle / ellipse / rect / line / polyline / polygon). React can render that
// vocabulary natively, but Qt needs a single normalized drawing instruction per shape,
// so every element is converted to an SVG path `d` string here. Both stacks therefore
// rasterize the *same* numbers.
//
// The same module also flattens paths into polylines so the gate can measure a painted
// bounding box (used to prove optical centering) without pulling in a renderer.

/* ------------------------------------------------------------------ *
 * Path parsing: SVG path data -> absolute M/L/C/Z segments
 * ------------------------------------------------------------------ */

const NUMBER_RE = /[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g;

/** Split `d` into [command, params[]] tokens, expanding implicit command repeats. */
export function parseCommands(d) {
  const out = [];
  const tokens = String(d).match(/[MmLlHhVvCcSsQqTtAaZz]|[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g) || [];
  let i = 0;
  let current = null;
  const arity = { M: 2, L: 2, H: 1, V: 1, C: 6, S: 4, Q: 4, T: 2, A: 7, Z: 0 };

  while (i < tokens.length) {
    const token = tokens[i];
    if (/[A-Za-z]/.test(token)) {
      current = token;
      i += 1;
    } else if (current === null) {
      throw new Error(`path data must start with a command: ${d}`);
    } else if (current === 'M') {
      // Implicit repetition of moveto becomes lineto (SVG spec 8.3.2).
      current = 'L';
    } else if (current === 'm') {
      current = 'l';
    }
    const n = arity[current.toUpperCase()];
    if (n === undefined) throw new Error(`unsupported path command "${current}" in ${d}`);
    if (n === 0) {
      out.push([current, []]);
      continue;
    }
    const params = tokens.slice(i, i + n).map(Number);
    if (params.length < n || params.some((v) => Number.isNaN(v))) {
      throw new Error(`malformed "${current}" segment in ${d}`);
    }
    i += n;
    out.push([current, params]);
  }
  return out;
}

/** Convert quadratic control point to the cubic equivalent. */
function quadToCubic(x0, y0, qx, qy, x, y) {
  return [
    x0 + (2 / 3) * (qx - x0),
    y0 + (2 / 3) * (qy - y0),
    x + (2 / 3) * (qx - x),
    y + (2 / 3) * (qy - y),
    x,
    y,
  ];
}

/** Endpoint-parameterised elliptical arc -> list of cubic bezier segments. */
function arcToCubics(x0, y0, rx, ry, rotationDeg, largeArc, sweep, x, y) {
  if (rx === 0 || ry === 0) return [[x0, y0, x, y, x, y]];
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  const phi = (rotationDeg * Math.PI) / 180;
  const cosPhi = Math.cos(phi);
  const sinPhi = Math.sin(phi);

  const dx2 = (x0 - x) / 2;
  const dy2 = (y0 - y) / 2;
  const x1p = cosPhi * dx2 + sinPhi * dy2;
  const y1p = -sinPhi * dx2 + cosPhi * dy2;

  let rxSq = rx * rx;
  let rySq = ry * ry;
  const lambda = (x1p * x1p) / rxSq + (y1p * y1p) / rySq;
  if (lambda > 1) {
    const s = Math.sqrt(lambda);
    rx *= s;
    ry *= s;
    rxSq = rx * rx;
    rySq = ry * ry;
  }

  const sign = largeArc === sweep ? -1 : 1;
  const numer = rxSq * rySq - rxSq * y1p * y1p - rySq * x1p * x1p;
  const denom = rxSq * y1p * y1p + rySq * x1p * x1p;
  const coef = sign * Math.sqrt(Math.max(0, numer / denom));
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (-coef * ry * x1p) / rx;
  const cx = cosPhi * cxp - sinPhi * cyp + (x0 + x) / 2;
  const cy = sinPhi * cxp + cosPhi * cyp + (y0 + y) / 2;

  const angle = (ux, uy, vx, vy) => {
    const dot = ux * vx + uy * vy;
    const len = Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);
    let a = Math.acos(Math.min(1, Math.max(-1, dot / (len || 1))));
    if (ux * vy - uy * vx < 0) a = -a;
    return a;
  };

  const startAngle = angle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let deltaAngle = angle((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (sweep === 0 && deltaAngle > 0) deltaAngle -= 2 * Math.PI;
  if (sweep === 1 && deltaAngle < 0) deltaAngle += 2 * Math.PI;

  const segments = Math.ceil(Math.abs(deltaAngle / (Math.PI / 2)));
  const result = [];
  let theta = startAngle;
  const step = deltaAngle / segments;
  for (let i = 0; i < segments; i += 1) {
    const t1 = theta;
    const t2 = theta + step;
    const alpha = (4 / 3) * Math.tan((t2 - t1) / 4);
    const p = (t) => [cosPhi * rx * Math.cos(t) - sinPhi * ry * Math.sin(t) + cx, sinPhi * rx * Math.cos(t) + cosPhi * ry * Math.sin(t) + cy];
    const [p1x, p1y] = p(t1);
    const [p2x, p2y] = p(t2);
    const d1 = [cosPhi * -rx * Math.sin(t1) - sinPhi * ry * Math.cos(t1), sinPhi * -rx * Math.sin(t1) + cosPhi * ry * Math.cos(t1)];
    const d2 = [cosPhi * -rx * Math.sin(t2) - sinPhi * ry * Math.cos(t2), sinPhi * -rx * Math.sin(t2) + cosPhi * ry * Math.cos(t2)];
    result.push([
      p1x + alpha * d1[0],
      p1y + alpha * d1[1],
      p2x - alpha * d2[0],
      p2y - alpha * d2[1],
      p2x,
      p2y,
    ]);
    theta = t2;
  }
  return result;
}

/** Absolute segments of type M / L / C / Z. */
export function toAbsoluteSegments(d) {
  const segs = [];
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;
  let prevCubicCtrl = null;
  let prevQuadCtrl = null;

  for (const [rawCmd, params] of parseCommands(d)) {
    const cmd = rawCmd.toUpperCase();
    const rel = rawCmd !== cmd;

    if (cmd === 'M') {
      const x = rel ? cx + params[0] : params[0];
      const y = rel ? cy + params[1] : params[1];
      segs.push(['M', x, y]);
      cx = sx = x;
      cy = sy = y;
      prevCubicCtrl = null;
      prevQuadCtrl = null;
    } else if (cmd === 'L') {
      const x = rel ? cx + params[0] : params[0];
      const y = rel ? cy + params[1] : params[1];
      segs.push(['L', x, y]);
      cx = x;
      cy = y;
      prevCubicCtrl = null;
      prevQuadCtrl = null;
    } else if (cmd === 'H') {
      const x = rel ? cx + params[0] : params[0];
      segs.push(['L', x, cy]);
      cx = x;
      prevCubicCtrl = null;
      prevQuadCtrl = null;
    } else if (cmd === 'V') {
      const y = rel ? cy + params[0] : params[0];
      segs.push(['L', cx, y]);
      cy = y;
      prevCubicCtrl = null;
      prevQuadCtrl = null;
    } else if (cmd === 'C') {
      const p = rel ? [cx + params[0], cy + params[1], cx + params[2], cy + params[3], cx + params[4], cy + params[5]] : params;
      segs.push(['C', ...p]);
      prevCubicCtrl = [p[2], p[3]];
      prevQuadCtrl = null;
      cx = p[4];
      cy = p[5];
    } else if (cmd === 'S') {
      const p = rel ? [cx + params[0], cy + params[1], cx + params[2], cy + params[3]] : params;
      const c1 = prevCubicCtrl ? [2 * cx - prevCubicCtrl[0], 2 * cy - prevCubicCtrl[1]] : [cx, cy];
      segs.push(['C', c1[0], c1[1], p[0], p[1], p[2], p[3]]);
      prevCubicCtrl = [p[0], p[1]];
      prevQuadCtrl = null;
      cx = p[2];
      cy = p[3];
    } else if (cmd === 'Q') {
      const p = rel ? [cx + params[0], cy + params[1], cx + params[2], cy + params[3]] : params;
      const c = quadToCubic(cx, cy, p[0], p[1], p[2], p[3]);
      segs.push(['C', ...c]);
      prevQuadCtrl = [p[0], p[1]];
      prevCubicCtrl = [c[2], c[3]];
      cx = p[2];
      cy = p[3];
    } else if (cmd === 'T') {
      const p = rel ? [cx + params[0], cy + params[1]] : params;
      const q = prevQuadCtrl ? [2 * cx - prevQuadCtrl[0], 2 * cy - prevQuadCtrl[1]] : [cx, cy];
      const c = quadToCubic(cx, cy, q[0], q[1], p[0], p[1]);
      segs.push(['C', ...c]);
      prevQuadCtrl = q;
      prevCubicCtrl = [c[2], c[3]];
      cx = p[0];
      cy = p[1];
    } else if (cmd === 'A') {
      const [rx, ry, rot, largeArc, sweep, dx, dy] = params;
      const x = rel ? cx + dx : dx;
      const y = rel ? cy + dy : dy;
      for (const c of arcToCubics(cx, cy, rx, ry, rot, largeArc, sweep, x, y)) {
        segs.push(['C', ...c]);
      }
      cx = x;
      cy = y;
      prevCubicCtrl = null;
      prevQuadCtrl = null;
    } else if (cmd === 'Z') {
      segs.push(['Z']);
      cx = sx;
      cy = sy;
      prevCubicCtrl = null;
      prevQuadCtrl = null;
    }
  }
  return segs;
}

/** Flatten a path into a point list (cubic segments sampled uniformly). */
export function flattenPath(d, samples = 16) {
  const points = [];
  let cx = 0;
  let cy = 0;
  let sx = 0;
  let sy = 0;

  const push = (x, y) => {
    points.push([x, y]);
  };

  for (const seg of toAbsoluteSegments(d)) {
    if (seg[0] === 'M') {
      cx = sx = seg[1];
      cy = sy = seg[2];
      push(cx, cy);
    } else if (seg[0] === 'L') {
      cx = seg[1];
      cy = seg[2];
      push(cx, cy);
    } else if (seg[0] === 'C') {
      const [x0, y0] = [cx, cy];
      for (let i = 1; i <= samples; i += 1) {
        const t = i / samples;
        const mt = 1 - t;
        const a = mt * mt * mt;
        const b = 3 * mt * mt * t;
        const c = 3 * mt * t * t;
        const dd = t * t * t;
        push(
          a * x0 + b * seg[1] + c * seg[3] + dd * seg[5],
          a * y0 + b * seg[2] + c * seg[4] + dd * seg[6],
        );
      }
      cx = seg[5];
      cy = seg[6];
    } else if (seg[0] === 'Z') {
      cx = sx;
      cy = sy;
      push(cx, cy);
    }
  }
  return points;
}

/** Tight-ish bounding box of a path, ignoring stroke width. */
export function pathBBox(d, samples = 24) {
  if (!d) return null;
  const pts = flattenPath(d, samples);
  if (pts.length === 0) return null;
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [x, y] of pts) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/* ------------------------------------------------------------------ *
 * Element vocabulary -> SVG path data
 * ------------------------------------------------------------------ */

/** Compact number formatting so generated artifacts stay readable and diffable. */
export function fmt(n) {
  const v = Math.round(n * 1000) / 1000;
  return String(v);
}

function pointList(raw) {
  const nums = String(raw).match(NUMBER_RE)?.map(Number) ?? [];
  const pts = [];
  for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
  return pts;
}

/**
 * Convert one registry element into an SVG path `d` string.
 * Circles/ellipses/rounded rects use arc commands; Qt's PathSvg understands the full
 * grammar, and every other renderer that consumes SVG does too.
 */
export function elementToPath(el) {
  const t = el.t;
  if (t === 'path') return { d: el.d, fill: Boolean(el.fill) };

  if (t === 'circle') {
    const { cx, cy, r } = el;
    return {
      d: `M ${fmt(cx - r)} ${fmt(cy)} a ${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(2 * r)} 0 a ${fmt(r)} ${fmt(r)} 0 1 0 ${fmt(-2 * r)} 0`,
      fill: Boolean(el.fill),
    };
  }

  if (t === 'ellipse') {
    const { cx, cy, rx, ry } = el;
    return {
      d: `M ${fmt(cx - rx)} ${fmt(cy)} a ${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(2 * rx)} 0 a ${fmt(rx)} ${fmt(ry)} 0 1 0 ${fmt(-2 * rx)} 0`,
      fill: Boolean(el.fill),
    };
  }

  if (t === 'rect') {
    const { x, y, width: w, height: h } = el;
    const rx = el.rx ?? el.ry ?? 0;
    const ry = el.ry ?? el.rx ?? 0;
    if (!rx || !ry) {
      return { d: `M ${fmt(x)} ${fmt(y)} H ${fmt(x + w)} V ${fmt(y + h)} H ${fmt(x)} Z`, fill: Boolean(el.fill) };
    }
    const kx = Math.min(rx, w / 2);
    const ky = Math.min(ry, h / 2);
    return {
      d: [
        `M ${fmt(x + kx)} ${fmt(y)}`,
        `H ${fmt(x + w - kx)}`,
        `A ${fmt(kx)} ${fmt(ky)} 0 0 1 ${fmt(x + w)} ${fmt(y + ky)}`,
        `V ${fmt(y + h - ky)}`,
        `A ${fmt(kx)} ${fmt(ky)} 0 0 1 ${fmt(x + w - kx)} ${fmt(y + h)}`,
        `H ${fmt(x + kx)}`,
        `A ${fmt(kx)} ${fmt(ky)} 0 0 1 ${fmt(x)} ${fmt(y + h - ky)}`,
        `V ${fmt(y + ky)}`,
        `A ${fmt(kx)} ${fmt(ky)} 0 0 1 ${fmt(x + kx)} ${fmt(y)}`,
        'Z',
      ].join(' '),
      fill: Boolean(el.fill),
    };
  }

  if (t === 'line') {
    return { d: `M ${fmt(el.x1)} ${fmt(el.y1)} L ${fmt(el.x2)} ${fmt(el.y2)}`, fill: false };
  }

  if (t === 'polyline' || t === 'polygon') {
    const pts = pointList(el.points);
    if (pts.length === 0) throw new Error('polyline/polygon requires points');
    const d = pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${fmt(x)} ${fmt(y)}`).join(' ');
    return { d: t === 'polygon' ? `${d} Z` : d, fill: Boolean(el.fill) };
  }

  throw new Error(`unsupported icon element type "${t}"`);
}

/** Painted bounding box of an icon (path extents grown by half the stroke width). */
export function elementsBBox(elements, strokeWidth = 0) {
  let box = null;
  for (const el of elements) {
    const path = elementToPath(el);
    const b = pathBBox(path.d);
    if (!b) continue;
    box = box
      ? {
          minX: Math.min(box.minX, b.minX),
          minY: Math.min(box.minY, b.minY),
          maxX: Math.max(box.maxX, b.maxX),
          maxY: Math.max(box.maxY, b.maxY),
        }
      : { minX: b.minX, minY: b.minY, maxX: b.maxX, maxY: b.maxY };
  }
  if (!box) return null;
  const pad = strokeWidth / 2;
  const minX = box.minX - pad;
  const minY = box.minY - pad;
  const maxX = box.maxX + pad;
  const maxY = box.maxY + pad;
  return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
}

/**
 * Painted stroke width, in pixels, when a grid is rendered at `size`.
 *
 * A grid is scaled as one piece, so its stroke scales with it: the painted line is
 * `size / grid.size * grid.strokeWidth` pixels wide for every `size`. Every weight statement
 * this system makes is this one expression evaluated at a different point — the stroke floor,
 * the weight a grid carries at the size it was drawn for, the reason a 24 unit glyph reads
 * thin at 10. Stating it once means those three can never disagree.
 */
export function gridStrokeAt(grid, size) {
  return (size / grid.size) * grid.strokeWidth;
}

/**
 * Smallest render size at which a grid's stroke is still one pixel: the `size` at which
 * `gridStrokeAt` returns exactly 1, which solves to `grid.size / grid.strokeWidth`.
 *
 * Below it the stroke is sub-pixel: it antialiases into a fainter, fuzzier line, so the glyph
 * ships lighter than its artwork declares and lighter than every sibling rendered a step
 * larger — the defect that makes a 10px close button look like a mistake next to a 10px
 * minimise bar.
 *
 * It is derived rather than stored beside the metrics on purpose: a second hand-maintained
 * copy of a fact nothing verifies is exactly how the numbers in this system rot.
 */
export function gridStrokeFloor(grid) {
  return grid.size / grid.strokeWidth;
}
