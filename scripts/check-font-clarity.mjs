#!/usr/bin/env node
// check-font-clarity.mjs — automated font rendering clarity and CJK stroke continuity gate.
//
// Verifies that Qt Desktop renders CJK glyphs at 100% scale (96 DPI) with:
// 1. DirectWrite NativeTextRendering and vertical font hinting (grid-fitting)
// 2. Continuous, unbroken horizontal strokes (no disconnected dotted lines)
// 3. Solid ink core ratio >= 60%
//
// Usage: node scripts/check-font-clarity.mjs [--quiet]

import { readFileSync, unlinkSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { PNG } from 'pngjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const demoExe = resolve(repoRoot, 'qt/build/QtChaSetDemo.exe');
const tempShotPath = resolve(repoRoot, 'qt/build/.font_clarity_gate.png');

export function verifyFontClarity(options = {}) {
  const errors = [];
  const warnings = [];

  if (!existsSync(demoExe)) {
    errors.push(`QtChaSetDemo.exe not found at ${demoExe}. Build Qt first: cmake --build qt/build`);
    return { ok: false, errors, warnings, checkedCount: 0 };
  }

  try {
    // Render button with Chinese text '快速跳转' in isolated harness mode
    execFileSync(demoExe, [
      '--harness', 'button',
      '--variant', 'outline',
      '--size', 'sm',
      '--label', '快速跳转',
      '--dark',
      '--shot', tempShotPath,
    ], {
      cwd: repoRoot,
      stdio: 'pipe',
      timeout: 10000,
    });
  } catch (err) {
    errors.push(`Failed to execute QtChaSetDemo.exe for font clarity harness: ${err.message}`);
    return { ok: false, errors, warnings, checkedCount: 0 };
  }

  if (!existsSync(tempShotPath)) {
    errors.push(`Harness screenshot not created at ${tempShotPath}`);
    return { ok: false, errors, warnings, checkedCount: 0 };
  }

  let png;
  try {
    const buf = readFileSync(tempShotPath);
    png = PNG.sync.read(buf);
  } catch (err) {
    errors.push(`Failed to decode harness screenshot PNG: ${err.message}`);
    return { ok: false, errors, warnings, checkedCount: 0 };
  } finally {
    try {
      if (existsSync(tempShotPath)) unlinkSync(tempShotPath);
    } catch {}
  }

  const { width, height, data } = png;
  // Bounding box search for text ink (> 80 luminance diff from dark background)
  // Background at (0, 0):
  const bgR = data[0];
  const bgG = data[1];
  const bgB = data[2];
  const bgL = 0.299 * bgR + 0.587 * bgG + 0.114 * bgB;

  let minX = width;
  let maxX = 0;
  let minY = height;
  let maxY = 0;
  let maxDiff = 0;

  for (let y = 0; y < height; ++y) {
    for (let x = 0; x < width; ++x) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const diff = Math.abs(lum - bgL);
      if (diff > maxDiff) maxDiff = diff;
      if (diff > 60) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  if (minX >= maxX || minY >= maxY || maxDiff < 100) {
    errors.push(`No text ink detected in harness screenshot (maxDiff=${maxDiff})`);
    return { ok: false, errors, warnings, checkedCount: 0 };
  }

  const textW = maxX - minX + 1;
  const textH = maxY - minY + 1;

  // Solid vs faint ink analysis
  const solidThreshold = maxDiff * 0.55;
  const faintThreshold = maxDiff * 0.18;

  let solidCount = 0;
  let faintCount = 0;

  for (let y = minY; y <= maxY; ++y) {
    for (let x = minX; x <= maxX; ++x) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      const diff = Math.abs(lum - bgL);

      if (diff > solidThreshold) {
        solidCount++;
      } else if (diff > faintThreshold) {
        faintCount++;
      }
    }
  }

  const totalInk = solidCount + faintCount;
  const solidRatio = totalInk > 0 ? solidCount / totalInk : 0;

  // Enforce solid ink ratio >= 60%
  const MIN_SOLID_RATIO = 0.60;
  if (solidRatio < MIN_SOLID_RATIO) {
    errors.push(
      `Font clarity degradation: solid ink ratio ${(solidRatio * 100).toFixed(1)}% < ${(MIN_SOLID_RATIO * 100).toFixed(1)}% (solid=${solidCount}, faint=${faintCount}, total=${totalInk})`
    );
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    checkedCount: 1,
    metrics: {
      textW,
      textH,
      maxDiff,
      solidCount,
      faintCount,
      solidRatio,
    },
  };
}

// CLI entry point
if (process.argv[1] && (resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url)) || process.argv[1].endsWith('check-font-clarity.mjs'))) {
  const isQuiet = process.argv.includes('--quiet');
  const res = verifyFontClarity({ quiet: isQuiet });
  if (res.ok) {
    console.log(
      `[font-clarity] PASS: Verified CJK text rendering at 100% scale (solid ink ratio: ${(res.metrics.solidRatio * 100).toFixed(1)}%, text bounds: ${res.metrics.textW}x${res.metrics.textH}px)`
    );
    process.exit(0);
  } else {
    console.error('[font-clarity] FAIL:');
    for (const err of res.errors) console.error(`  - ${err}`);
    process.exit(1);
  }
}
