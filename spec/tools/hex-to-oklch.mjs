// spec/tools/hex-to-oklch.mjs — sRGB hex -> CSS oklch() converter.
//
// Why this exists: core.json semantic tokens carry a `launcher` preset whose
// values MUST use oklch()/color-mix()/var() (see validate-tokens.mjs
// isValidLauncherValue), while the `dunting` preset is plain #RRGGBBAA. When a
// new color family must look identical in BOTH presets (e.g. the syntax
// palette), the launcher value is the oklch() form of the dunting hex. This
// tool performs that conversion so the two presets denote the same color.
//
// Usage:
//   node spec/tools/hex-to-oklch.mjs "#C678DD"
//   node spec/tools/hex-to-oklch.mjs "#C678DD" "#A626A4"
//
// Sourcing: Björn Ottosson's OKLab definition (https://bottosson.github.io/posts/oklab/).
// Alpha is emitted as `/ <a>` only when the hex is not fully opaque.
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const linearize = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));

/**
 * Convert an #RRGGBB or #RRGGBBAA hex string to an oklch() CSS string.
 * @param {string} hex
 * @param {{ l?: number, c?: number, h?: number }} [prec] decimal places
 * @returns {string}
 */
export function hexToOklch(hex, prec = {}) {
  const m = /^#?([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/.exec(hex.trim());
  if (!m) throw new Error(`hexToOklch: not a #RRGGBB[AA] hex "${hex}"`);
  const int = parseInt(m[1], 16);
  const a = m[2] === undefined ? 1 : parseInt(m[2], 16) / 255;

  const r = linearize(((int >> 16) & 0xff) / 255);
  const g = linearize(((int >> 8) & 0xff) / 255);
  const b = linearize((int & 0xff) / 255);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const mm = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * mm - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * mm + 0.4505937099 * s;
  const B = 0.0259040371 * l + 0.7827717662 * mm - 0.808675766 * s;

  const chroma = Math.sqrt(A * A + B * B);
  let hue = (Math.atan2(B, A) * 180) / Math.PI;
  if (hue < 0) hue += 360;

  const pl = prec.l ?? 4;
  const pc = prec.c ?? 4;
  const ph = prec.h ?? 1;
  const parts = [
    Number(L.toFixed(pl)),
    Number(chroma.toFixed(pc)),
    Number(hue.toFixed(ph)),
  ];
  const alpha = a >= 1 ? '' : ` / ${Number(a.toFixed(3))}`;
  return `oklch(${parts[0]} ${parts[1]} ${parts[2]}${alpha})`;
}

// CLI
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error('usage: node spec/tools/hex-to-oklch.mjs "#RRGGBB[AA]" [...]');
    process.exit(1);
  }
  for (const hex of args) console.log(`${hex}  ->  ${hexToOklch(hex)}`);
}
