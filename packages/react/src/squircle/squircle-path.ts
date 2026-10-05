/**
 * squircle-path.ts — Mathematical generation of iOS-style continuous corner curvature (squircles).
 *
 * Implements the Figma / Apple continuous corner smoothing algorithm (G2 continuity).
 * Curvature increases smoothly from 0 at the straight edge to 1/r at the arc segment,
 * avoiding the abrupt curvature discontinuity of traditional circular arcs.
 */

export interface SquircleParams {
  width: number;
  height: number;
  cornerRadius?: number;
  topLeftRadius?: number;
  topRightRadius?: number;
  bottomLeftRadius?: number;
  bottomRightRadius?: number;
  cornerSmoothing?: number; // 0.0 to 1.0 (0.6 is the Apple iOS standard)
  roundTopLeft?: boolean;
  roundTopRight?: boolean;
  roundBottomLeft?: boolean;
  roundBottomRight?: boolean;
  roundLeft?: boolean;
  roundRight?: boolean;
  roundTop?: boolean;
  roundBottom?: boolean;
}

interface CornerMath {
  p: number;
  a: number;
  b: number;
  c: number;
  d: number;
  theta: number; // in radians
  beta: number;  // in radians
  k: number;     // cubic tangent factor
  r: number;
}

const DEG2RAD = Math.PI / 180;

function calcCorner(radius: number, s: number, shortest_l: number): CornerMath {
  const r = Math.max(0, Math.min(radius, shortest_l / 2));
  if (r <= 0.001) {
    return { p: 0, a: 0, b: 0, c: 0, d: 0, theta: 0, beta: 0, k: 0, r: 0 };
  }

  const smoothing = Math.max(0, Math.min(1, s));
  const p = Math.min(shortest_l / 2, (1 + smoothing) * r);

  let angle_beta_deg: number;
  let angle_alpha_deg: number;

  if (r > shortest_l / 4) {
    const cp = (r - shortest_l / 4) / (shortest_l / 4);
    angle_beta_deg = 90 * (1 - smoothing * (1 - cp));
    angle_alpha_deg = 45 * smoothing * (1 - cp);
  } else {
    angle_beta_deg = 90 * (1 - smoothing);
    angle_alpha_deg = 45 * smoothing;
  }

  const angle_theta_deg = (90 - angle_beta_deg) / 2;

  const theta = angle_theta_deg * DEG2RAD;
  const beta = angle_beta_deg * DEG2RAD;
  const alpha = angle_alpha_deg * DEG2RAD;

  const d_div_c = Math.tan(alpha);
  const h_longest = r * Math.tan(theta / 2);
  const l = Math.sin(beta / 2) * r * Math.SQRT2;
  const c = h_longest * Math.cos(alpha);
  const d = c * d_div_c;
  const b = ((p - l) - (1 + d_div_c) * c) / 3;
  const a = 2 * b;
  const k = (4 / 3) * Math.tan(beta / 4);

  return { p, a, b, c, d, theta, beta, k, r };
}

/**
 * Returns an SVG path string ('M ... C ... Z') representing a rectangle with
 * iOS continuous curvature corners.
 */
export function getSquircleSvgPath(params: SquircleParams): string {
  const {
    width: W,
    height: H,
    cornerRadius = 0,
    topLeftRadius,
    topRightRadius,
    bottomLeftRadius,
    bottomRightRadius,
    cornerSmoothing = 0.6,
    roundTopLeft = true,
    roundTopRight = true,
    roundBottomLeft = true,
    roundBottomRight = true,
    roundLeft = true,
    roundRight = true,
    roundTop = true,
    roundBottom = true,
  } = params;

  if (W <= 0 || H <= 0) return '';

  const shortest_l = Math.min(W, H);

  const rTL = topLeftRadius !== undefined ? topLeftRadius : cornerRadius;
  const rTR = topRightRadius !== undefined ? topRightRadius : cornerRadius;
  const rBR = bottomRightRadius !== undefined ? bottomRightRadius : cornerRadius;
  const rBL = bottomLeftRadius !== undefined ? bottomLeftRadius : cornerRadius;

  const tlActive = roundLeft && roundTop && roundTopLeft;
  const trActive = roundRight && roundTop && roundTopRight;
  const brActive = roundRight && roundBottom && roundBottomRight;
  const blActive = roundLeft && roundBottom && roundBottomLeft;

  const mTL = tlActive ? calcCorner(rTL, cornerSmoothing, shortest_l) : calcCorner(0, 0, shortest_l);
  const mTR = trActive ? calcCorner(rTR, cornerSmoothing, shortest_l) : calcCorner(0, 0, shortest_l);
  const mBR = brActive ? calcCorner(rBR, cornerSmoothing, shortest_l) : calcCorner(0, 0, shortest_l);
  const mBL = blActive ? calcCorner(rBL, cornerSmoothing, shortest_l) : calcCorner(0, 0, shortest_l);

  const parts: string[] = [];

  // Start at top center
  parts.push(`M ${W / 2} 0`);

  // 1. Top Edge -> Top-Right Corner
  if (mTR.r <= 0.001) {
    parts.push(`L ${W} 0`);
  } else {
    parts.push(`L ${W - mTR.p} 0`);
    parts.push(
      `C ${W - (mTR.p - mTR.a)} 0, ${W - (mTR.p - mTR.a - mTR.b)} 0, ${W - (mTR.p - mTR.a - mTR.b - mTR.c)} ${mTR.d}`
    );
    const cp1x = W - (mTR.p - mTR.a - mTR.b - mTR.c) + mTR.k * mTR.r * Math.cos(mTR.theta);
    const cp1y = mTR.d + mTR.k * mTR.r * Math.sin(mTR.theta);
    const cp2x = W - mTR.d - mTR.k * mTR.r * Math.sin(mTR.theta);
    const cp2y = mTR.p - mTR.a - mTR.b - mTR.c - mTR.k * mTR.r * Math.cos(mTR.theta);
    parts.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${W - mTR.d} ${mTR.p - mTR.a - mTR.b - mTR.c}`);
    parts.push(
      `C ${W} ${mTR.p - mTR.a - mTR.b}, ${W} ${mTR.p - mTR.a}, ${W} ${mTR.p}`
    );
  }

  // 2. Right Edge -> Bottom-Right Corner
  if (mBR.r <= 0.001) {
    parts.push(`L ${W} ${H}`);
  } else {
    parts.push(`L ${W} ${H - mBR.p}`);
    parts.push(
      `C ${W} ${H - (mBR.p - mBR.a)}, ${W} ${H - (mBR.p - mBR.a - mBR.b)}, ${W - mBR.d} ${H - (mBR.p - mBR.a - mBR.b - mBR.c)}`
    );
    const cp1x = W - mBR.d - mBR.k * mBR.r * Math.sin(mBR.theta);
    const cp1y = H - (mBR.p - mBR.a - mBR.b - mBR.c) + mBR.k * mBR.r * Math.cos(mBR.theta);
    const cp2x = W - (mBR.p - mBR.a - mBR.b - mBR.c) + mBR.k * mBR.r * Math.cos(mBR.theta);
    const cp2y = H - mBR.d - mBR.k * mBR.r * Math.sin(mBR.theta);
    parts.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${W - (mBR.p - mBR.a - mBR.b - mBR.c)} ${H - mBR.d}`);
    parts.push(
      `C ${W - (mBR.p - mBR.a - mBR.b)} ${H}, ${W - (mBR.p - mBR.a)} ${H}, ${W - mBR.p} ${H}`
    );
  }

  // 3. Bottom Edge -> Bottom-Left Corner
  if (mBL.r <= 0.001) {
    parts.push(`L 0 ${H}`);
  } else {
    parts.push(`L ${mBL.p} ${H}`);
    parts.push(
      `C ${mBL.p - mBL.a} ${H}, ${mBL.p - mBL.a - mBL.b} ${H}, ${mBL.p - mBL.a - mBL.b - mBL.c} ${H - mBL.d}`
    );
    const cp1x = mBL.p - mBL.a - mBL.b - mBL.c - mBL.k * mBL.r * Math.cos(mBL.theta);
    const cp1y = H - mBL.d - mBL.k * mBL.r * Math.sin(mBL.theta);
    const cp2x = mBL.d + mBL.k * mBL.r * Math.sin(mBL.theta);
    const cp2y = H - (mBL.p - mBL.a - mBL.b - mBL.c) + mBL.k * mBL.r * Math.cos(mBL.theta);
    parts.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${mBL.d} ${H - (mBL.p - mBL.a - mBL.b - mBL.c)}`);
    parts.push(
      `C 0 ${H - (mBL.p - mBL.a - mBL.b)}, 0 ${H - (mBL.p - mBL.a)}, 0 ${H - mBL.p}`
    );
  }

  // 4. Left Edge -> Top-Left Corner
  if (mTL.r <= 0.001) {
    parts.push('L 0 0');
  } else {
    parts.push(`L 0 ${mTL.p}`);
    parts.push(
      `C 0 ${mTL.p - mTL.a}, 0 ${mTL.p - mTL.a - mTL.b}, ${mTL.d} ${mTL.p - mTL.a - mTL.b - mTL.c}`
    );
    const cp1x = mTL.d + mTL.k * mTL.r * Math.sin(mTL.theta);
    const cp1y = mTL.p - mTL.a - mTL.b - mTL.c - mTL.k * mTL.r * Math.cos(mTL.theta);
    const cp2x = mTL.p - mTL.a - mTL.b - mTL.c - mTL.k * mTL.r * Math.cos(mTL.theta);
    const cp2y = mTL.d + mTL.k * mTL.r * Math.sin(mTL.theta);
    parts.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${mTL.p - mTL.a - mTL.b - mTL.c} ${mTL.d}`);
    parts.push(
      `C ${mTL.p - mTL.a - mTL.b} 0, ${mTL.p - mTL.a} 0, ${mTL.p} 0`
    );
  }

  parts.push('Z');
  return parts.join(' ');
}
