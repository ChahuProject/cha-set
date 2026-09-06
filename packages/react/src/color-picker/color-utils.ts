/**
 * Pure color mathematical transformations and utilities for ColorPicker.
 * Zero external dependencies.
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export interface HsvColor {
  h: number; // 0-360
  s: number; // 0-100
  v: number; // 0-100
  a?: number;
}

export interface CmykColor {
  c: number; // 0-100
  m: number; // 0-100
  y: number; // 0-100
  k: number; // 0-100
}

export interface LabColor {
  l: number; // 0-100
  a: number; // -128 to 127
  b: number; // -128 to 127
}

export interface Point {
  x: number;
  y: number;
}

export interface TriangleWeights {
  pure: number;
  white: number;
  black: number;
}

export const DEFAULT_TRIANGLE_WIDTH = 260;
export const DEFAULT_TRIANGLE_HEIGHT = 260;
export const DEFAULT_TRIANGLE_PURE: Point = { x: 130, y: 0 };
export const DEFAULT_TRIANGLE_WHITE: Point = { x: 17.4167, y: 195 };
export const DEFAULT_TRIANGLE_BLACK: Point = { x: 242.5833, y: 195 };

/**
 * Clamps numeric value within [min, max] range.
 */
export function clamp(val: number, min: number, max: number): number {
  if (!Number.isFinite(val)) return min;
  return Math.min(max, Math.max(min, val));
}

/**
 * Validates whether string is a valid 3-digit or 6-digit hex color.
 */
export function isValidHex(hex: string): boolean {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex.trim());
}

/**
 * Normalizes any valid hex string to a 7-character uppercase format (#RRGGBB).
 */
export function normalizeHex(hex: string): string {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (clean.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(clean)) {
    return '#000000';
  }
  return `#${clean.toUpperCase()}`;
}

/**
 * Converts a hex color string to RGB object.
 */
export function hexToRgb(hex: string): RgbColor {
  let clean = hex.trim().replace(/^#/, '');
  if (clean.length === 3) {
    clean = clean
      .split('')
      .map((c) => c + c)
      .join('');
  }
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) {
    return { r: 0, g: 0, b: 0 };
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

/**
 * Converts RGB color object to uppercase hex string (#RRGGBB).
 */
export function rgbToHex({ r, g, b }: RgbColor): string {
  const red = clamp(Math.round(r), 0, 255).toString(16).padStart(2, '0');
  const green = clamp(Math.round(g), 0, 255).toString(16).padStart(2, '0');
  const blue = clamp(Math.round(b), 0, 255).toString(16).padStart(2, '0');
  return `#${red}${green}${blue}`.toUpperCase();
}

/**
 * Converts RGB color object to HSV color object.
 */
export function rgbToHsv({ r, g, b }: RgbColor): HsvColor {
  const rd = clamp(r, 0, 255) / 255;
  const gd = clamp(g, 0, 255) / 255;
  const bd = clamp(b, 0, 255) / 255;

  const max = Math.max(rd, gd, bd);
  const min = Math.min(rd, gd, bd);
  const delta = max - min;

  let h = 0;
  if (delta !== 0) {
    if (max === rd) {
      h = ((gd - bd) / delta) % 6;
    } else if (max === gd) {
      h = (bd - rd) / delta + 2;
    } else {
      h = (rd - gd) / delta + 4;
    }
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }

  const s = max === 0 ? 0 : (delta / max) * 100;
  const v = max * 100;

  return {
    h: Math.round(h),
    s: Math.round(s),
    v: Math.round(v),
    a: 1,
  };
}

/**
 * Converts HSV color object to RGB color object.
 */
export function hsvToRgb({ h, s, v }: HsvColor): RgbColor {
  const hd = ((h % 360) + 360) % 360;
  const sd = clamp(s, 0, 100) / 100;
  const vd = clamp(v, 0, 100) / 100;

  const c = vd * sd;
  const x = c * (1 - Math.abs(((hd / 60) % 2) - 1));
  const m = vd - c;

  let rd = 0;
  let gd = 0;
  let bd = 0;

  if (hd >= 0 && hd < 60) {
    rd = c;
    gd = x;
    bd = 0;
  } else if (hd >= 60 && hd < 120) {
    rd = x;
    gd = c;
    bd = 0;
  } else if (hd >= 120 && hd < 180) {
    rd = 0;
    gd = c;
    bd = x;
  } else if (hd >= 180 && hd < 240) {
    rd = 0;
    gd = x;
    bd = c;
  } else if (hd >= 240 && hd < 300) {
    rd = x;
    gd = 0;
    bd = c;
  } else {
    rd = c;
    gd = 0;
    bd = x;
  }

  return {
    r: Math.round((rd + m) * 255),
    g: Math.round((gd + m) * 255),
    b: Math.round((bd + m) * 255),
  };
}

/**
 * Converts hex color string to HSV color object.
 */
export function hexToHsv(hex: string): HsvColor {
  return rgbToHsv(hexToRgb(hex));
}

/**
 * Converts HSV color object to hex color string.
 */
export function hsvToHex(hsv: HsvColor): string {
  return rgbToHex(hsvToRgb(hsv));
}

/**
 * Converts RGB color to CMYK color.
 */
export function rgbToCmyk({ r, g, b }: RgbColor): CmykColor {
  const red = clamp(r, 0, 255) / 255;
  const green = clamp(g, 0, 255) / 255;
  const blue = clamp(b, 0, 255) / 255;
  const k = 1 - Math.max(red, green, blue);

  if (k >= 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  return {
    c: ((1 - red - k) / (1 - k)) * 100,
    m: ((1 - green - k) / (1 - k)) * 100,
    y: ((1 - blue - k) / (1 - k)) * 100,
    k: k * 100,
  };
}

/**
 * Converts CMYK color to RGB color.
 */
export function cmykToRgb({ c, m, y, k }: CmykColor): RgbColor {
  const cyan = clamp(c, 0, 100) / 100;
  const magenta = clamp(m, 0, 100) / 100;
  const yellow = clamp(y, 0, 100) / 100;
  const black = clamp(k, 0, 100) / 100;

  return {
    r: Math.round(255 * (1 - cyan) * (1 - black)),
    g: Math.round(255 * (1 - magenta) * (1 - black)),
    b: Math.round(255 * (1 - yellow) * (1 - black)),
  };
}

function srgbToLinear(val: number): number {
  const normalized = clamp(val, 0, 255) / 255;
  return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(val: number): number {
  const normalized = clamp(val, 0, 1);
  return Math.round(
    (normalized <= 0.0031308 ? normalized * 12.92 : 1.055 * normalized ** (1 / 2.4) - 0.055) * 255,
  );
}

function xyzToLabPivot(val: number): number {
  return val > 0.008856 ? val ** (1 / 3) : 7.787 * val + 16 / 116;
}

function labToXyzPivot(val: number): number {
  const cubed = val ** 3;
  return cubed > 0.008856 ? cubed : (val - 16 / 116) / 7.787;
}

/**
 * Converts RGB color to LAB color.
 */
export function rgbToLab({ r, g, b }: RgbColor): LabColor {
  const red = srgbToLinear(r);
  const green = srgbToLinear(g);
  const blue = srgbToLinear(b);
  const x = (red * 0.4124564 + green * 0.3575761 + blue * 0.1804375) / 0.95047;
  const y = red * 0.2126729 + green * 0.7151522 + blue * 0.072175;
  const z = (red * 0.0193339 + green * 0.119192 + blue * 0.9503041) / 1.08883;
  const fx = xyzToLabPivot(x);
  const fy = xyzToLabPivot(y);
  const fz = xyzToLabPivot(z);

  return {
    l: 116 * fy - 16,
    a: 500 * (fx - fy),
    b: 200 * (fy - fz),
  };
}

/**
 * Converts LAB color to RGB color.
 */
export function labToRgb({ l, a, b }: LabColor): RgbColor {
  const fy = (clamp(l, 0, 100) + 16) / 116;
  const fx = fy + clamp(a, -128, 127) / 500;
  const fz = fy - clamp(b, -128, 127) / 200;
  const x = 0.95047 * labToXyzPivot(fx);
  const y = labToXyzPivot(fy);
  const z = 1.08883 * labToXyzPivot(fz);

  return {
    r: linearToSrgb(x * 3.2404542 + y * -1.5371385 + z * -0.4985314),
    g: linearToSrgb(x * -0.969266 + y * 1.8760108 + z * 0.041556),
    b: linearToSrgb(x * 0.0556434 + y * -0.2040259 + z * 1.0572252),
  };
}

/**
 * Formats RGB to CSS rgb() functional syntax.
 */
export function rgbToCss({ r, g, b }: RgbColor): string {
  return `rgb(${Math.round(clamp(r, 0, 255))} ${Math.round(clamp(g, 0, 255))} ${Math.round(clamp(b, 0, 255))})`;
}

/**
 * Normalizes barycentric triangle weights ensuring non-negative values and sum = 1.
 */
export function normalizeWeights(weights: TriangleWeights): TriangleWeights {
  const pure = Math.max(0, weights.pure);
  const white = Math.max(0, weights.white);
  const black = Math.max(0, weights.black);
  const total = pure + white + black;

  if (total <= 0) {
    return { pure: 0, white: 1, black: 0 };
  }

  return {
    pure: pure / total,
    white: white / total,
    black: black / total,
  };
}

/**
 * Converts triangle barycentric weights to an (x, y) 2D coordinate inside the triangle.
 */
export function weightsToPoint(
  weights: TriangleWeights,
  purePoint: Point = DEFAULT_TRIANGLE_PURE,
  whitePoint: Point = DEFAULT_TRIANGLE_WHITE,
  blackPoint: Point = DEFAULT_TRIANGLE_BLACK,
): Point {
  return {
    x: weights.pure * purePoint.x + weights.white * whitePoint.x + weights.black * blackPoint.x,
    y: weights.pure * purePoint.y + weights.white * whitePoint.y + weights.black * blackPoint.y,
  };
}

/**
 * Converts an (x, y) 2D point into barycentric weights for the pure-white-black triangle.
 */
export function pointToWeights(
  point: Point,
  purePoint: Point = DEFAULT_TRIANGLE_PURE,
  whitePoint: Point = DEFAULT_TRIANGLE_WHITE,
  blackPoint: Point = DEFAULT_TRIANGLE_BLACK,
): TriangleWeights {
  const denominator =
    (whitePoint.y - blackPoint.y) * (purePoint.x - blackPoint.x) +
    (blackPoint.x - whitePoint.x) * (purePoint.y - blackPoint.y);

  if (denominator === 0) {
    return { pure: 0, white: 1, black: 0 };
  }

  const pure =
    ((whitePoint.y - blackPoint.y) * (point.x - blackPoint.x) +
      (blackPoint.x - whitePoint.x) * (point.y - blackPoint.y)) /
    denominator;
  const white =
    ((blackPoint.y - purePoint.y) * (point.x - blackPoint.x) +
      (purePoint.x - blackPoint.x) * (point.y - blackPoint.y)) /
    denominator;

  return normalizeWeights({
    pure,
    white,
    black: 1 - pure - white,
  });
}

/**
 * Converts HSV color values to triangle barycentric weights.
 */
export function hsvToTriangleWeights(hsv: HsvColor): TriangleWeights {
  const value = clamp(hsv.v / 100, 0, 1);
  const saturation = clamp(hsv.s / 100, 0, 1);

  return {
    pure: value * saturation,
    white: value * (1 - saturation),
    black: 1 - value,
  };
}

/**
 * Converts triangle barycentric weights back to HSV color values.
 */
export function triangleWeightsToHsv(weights: TriangleWeights, hue: number): HsvColor {
  const value = clamp(weights.pure + weights.white, 0, 1);
  const saturation = value <= 0 ? 0 : clamp(weights.pure / value, 0, 1);

  return {
    h: ((hue % 360) + 360) % 360,
    s: Math.round(saturation * 100),
    v: Math.round(value * 100),
    a: 1,
  };
}

/**
 * Calculates hue angle (0-360 deg) from pointer position relative to element center.
 * 0 deg corresponds to top (12 o'clock).
 */
export function getHueFromPointer(element: HTMLElement, clientX: number, clientY: number): number {
  const rect = element.getBoundingClientRect();
  const x = clientX - rect.left - rect.width / 2;
  const y = clientY - rect.top - rect.height / 2;
  return Math.round((Math.atan2(y, x) * 180 / Math.PI + 450) % 360);
}

/**
 * Converts client coordinates on a circular color wheel disc into Hue and Saturation.
 */
export function wheelCoordsToHsv(
  element: HTMLElement,
  clientX: number,
  clientY: number,
): { h: number; s: number } {
  const rect = element.getBoundingClientRect();
  const cx = rect.width / 2;
  const cy = rect.height / 2;
  const x = clientX - rect.left - cx;
  const y = clientY - rect.top - cy;
  const radius = Math.min(cx, cy);
  const dist = Math.sqrt(x * x + y * y);
  const s = clamp(Math.round((dist / radius) * 100), 0, 100);
  const h = Math.round((Math.atan2(y, x) * 180 / Math.PI + 450) % 360);
  return { h, s };
}

/**
 * Converts Hue and Saturation into 2D coordinates on a circular color wheel disc.
 */
export function hsvToWheelCoords(
  h: number,
  s: number,
  radius: number,
): Point {
  const rad = ((h - 90) * Math.PI) / 180;
  const dist = (clamp(s, 0, 100) / 100) * radius;
  return {
    x: radius + dist * Math.cos(rad),
    y: radius + dist * Math.sin(rad),
  };
}

