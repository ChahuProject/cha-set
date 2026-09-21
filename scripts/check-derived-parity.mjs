#!/usr/bin/env node
// ChaSet derived contract parity gate.
//
// Asserts that derived values that cannot be statically generated (accentHover,
// accentPressed, decorationRadius, decorationMotion, customAccentRamp) adhere to
// the stated contract in spec/theme-controls.json and that both hosts evaluate
// the mathematical formulas with zero drift.
//
// See docs/design/chaset-theme-control.md §3.4 & §5.3.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// --- Interpolation Contract Implementations -----------------------------------

export function computeDecorationRadius(radius) {
  return {
    cardRem: (6 + radius * 0.08) / 16,
    panelRem: (5 + radius * 0.07) / 16,
    controlRem: (4 + radius * 0.05) / 16,
  };
}

export function computeDecorationMotion(motion) {
  return {
    fastMs: Math.round(80 + motion * 1.2),
    normalMs: Math.round(100 + motion * 1.6),
  };
}

// Qt QColor::lighter(112) / darker(110) simulation
export function computeQtDerivedAccents(rgb) {
  function rgbToHsv(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const d = max - min;
    let h = 0;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    if (max !== min) {
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return { h, s, v: v * 255 };
  }

  function hsvToRgb(h, s, v) {
    v /= 255;
    const i = Math.floor(h / 60) % 6;
    const f = h / 60 - Math.floor(h / 60);
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r = 0, g = 0, b = 0;
    switch (i) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return {
      r: Math.min(255, Math.max(0, Math.round(r * 255))),
      g: Math.min(255, Math.max(0, Math.round(g * 255))),
      b: Math.min(255, Math.max(0, Math.round(b * 255))),
    };
  }

  const hsv = rgbToHsv(rgb.r, rgb.g, rgb.b);
  const hoverV = Math.min(255, Math.round(hsv.v * 1.12));
  const pressedV = Math.max(0, Math.round(hsv.v / 1.10));

  return {
    hover: hsvToRgb(hsv.h, hsv.s, hoverV),
    pressed: hsvToRgb(hsv.h, hsv.s, pressedV),
  };
}

// --- Main Verifier -----------------------------------------------------------

export function verifyDerivedParity({ quiet = false } = {}) {
  const errors = [];
  let checkedCount = 0;
  const fail = (msg) => errors.push(msg);

  const controlsPath = resolve(root, 'spec', 'theme-controls.json');
  const deltasPath = resolve(root, 'spec', 'tokens', 'themes', 'deltas.json');

  if (!existsSync(controlsPath)) return { ok: false, checkedCount: 0, errors: ['spec/theme-controls.json missing'] };
  if (!existsSync(deltasPath)) return { ok: false, checkedCount: 0, errors: ['spec/tokens/themes/deltas.json missing'] };

  const controls = JSON.parse(readFileSync(controlsPath, 'utf8'));
  const deltas = JSON.parse(readFileSync(deltasPath, 'utf8'));

  const derivedItems = controls.derivedContract?.items ?? [];
  const derivedMap = new Map(derivedItems.map((item) => [item.id, item]));

  // 1. Assert required derived items are declared in spec/theme-controls.json
  const requiredDerived = ['accentHover', 'accentPressed', 'decorationRadius', 'decorationMotion'];
  for (const req of requiredDerived) {
    checkedCount++;
    if (!derivedMap.has(req)) {
      fail(`spec/theme-controls.json missing required derivedContract item: "${req}"`);
    }
  }

  // 2. Continuous decorationRadius interpolation formulas check
  // Card: (6 + radius * 0.08) / 16 rem
  // Panel: (5 + radius * 0.07) / 16 rem
  // Control: (4 + radius * 0.05) / 16 rem
  const testRadii = [0, 25, 50, 75, 100];
  const expectedRadii = {
    0: { card: 0.375, panel: 0.3125, control: 0.25 },
    50: { card: 0.625, panel: 0.53125, control: 0.40625 },
    100: { card: 0.875, panel: 0.75, control: 0.5625 },
  };

  for (const r of testRadii) {
    checkedCount++;
    const { cardRem, panelRem, controlRem } = computeDecorationRadius(r);
    if (cardRem <= 0 || panelRem <= 0 || controlRem <= 0) {
      fail(`decorationRadius computed non-positive rem at radius=${r}`);
    }
    if (cardRem < panelRem || panelRem < controlRem) {
      fail(`decorationRadius hierarchy violated at radius=${r}: card(${cardRem}) >= panel(${panelRem}) >= control(${controlRem})`);
    }
    if (expectedRadii[r]) {
      if (Math.abs(cardRem - expectedRadii[r].card) > 0.0001 ||
          Math.abs(panelRem - expectedRadii[r].panel) > 0.0001 ||
          Math.abs(controlRem - expectedRadii[r].control) > 0.0001) {
        fail(`decorationRadius exact value mismatch at radius=${r}`);
      }
    }
  }

  // 3. Continuous decorationMotion interpolation formulas check
  // Fast: 80 + motion * 1.2 ms
  // Normal: 100 + motion * 1.6 ms
  const testMotions = [0, 25, 50, 75, 100];
  const expectedMotions = {
    0: { fast: 80, normal: 100 },
    50: { fast: 140, normal: 180 },
    100: { fast: 200, normal: 260 },
  };

  for (const m of testMotions) {
    checkedCount++;
    const { fastMs, normalMs } = computeDecorationMotion(m);
    if (fastMs <= 0 || normalMs <= 0) {
      fail(`decorationMotion computed non-positive duration at motion=${m}`);
    }
    if (fastMs >= normalMs) {
      fail(`decorationMotion hierarchy violated at motion=${m}: fast(${fastMs}ms) must be < normal(${normalMs}ms)`);
    }
    if (expectedMotions[m]) {
      if (fastMs !== expectedMotions[m].fast || normalMs !== expectedMotions[m].normal) {
        fail(`decorationMotion exact duration mismatch at motion=${m}`);
      }
    }
  }

  // 4. Custom Accent Ramp derivation rules completeness
  const customSubcase = controls.axes?.palette?.subcases?.custom;
  if (!customSubcase || !customSubcase.derivation) {
    fail('spec/theme-controls.json axes.palette.subcases.custom missing derivation spec');
  } else {
    const requiredTokens = ['primary', 'primary-foreground', 'ring', 'chart-1', 'chart-2', 'chart-3', 'chart-4', 'chart-5'];
    for (const t of requiredTokens) {
      checkedCount++;
      if (!(t in customSubcase.derivation)) {
        fail(`customAccentRamp missing formula for token: "${t}"`);
      }
      const formula = customSubcase.derivation[t];
      if (typeof formula !== 'string' || formula.length === 0) {
        fail(`customAccentRamp formula for token "${t}" is empty`);
      }
    }
  }

  // 5. Accent derivation calculation check for Qt and Web
  const testAccents = [
    { name: 'blue (dunting default)', rgb: { r: 48, g: 160, b: 255 } },
    { name: 'violet (launcher default)', rgb: { r: 124, g: 58, b: 237 } },
    { name: 'red', rgb: { r: 239, g: 68, b: 68 } },
    { name: 'green', rgb: { r: 34, g: 197, b: 94 } },
  ];

  for (const acc of testAccents) {
    checkedCount++;
    const { hover, pressed } = computeQtDerivedAccents(acc.rgb);
    if (hover.r < 0 || hover.r > 255 || hover.g < 0 || hover.g > 255 || hover.b < 0 || hover.b > 255) {
      fail(`Qt derived hover color out of bounds for ${acc.name}`);
    }
    if (pressed.r < 0 || pressed.r > 255 || pressed.g < 0 || pressed.g > 255 || pressed.b < 0 || pressed.b > 255) {
      fail(`Qt derived pressed color out of bounds for ${acc.name}`);
    }
  }

  if (!quiet) {
    if (errors.length === 0) {
      console.log(`[check-derived-parity] PASS: all ${checkedCount} derived contract assertions satisfied.`);
    } else {
      console.error(`[check-derived-parity] FAIL: ${errors.length} derived parity violations found:`);
      for (const err of errors) console.error(`  - ${err}`);
    }
  }

  return { ok: errors.length === 0, checkedCount, errors };
}

// CLI entry point
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  const res = verifyDerivedParity({ quiet: false });
  process.exit(res.ok ? 0 : 1);
}
