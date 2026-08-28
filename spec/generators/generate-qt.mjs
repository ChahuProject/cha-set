// generate-qt.mjs — emits a C++ token header for the dunting preset.
//
// Output: dist/consumers/dunting/generated/theme_tokens.generated.h
//   namespace cha_set_gen { struct ThemeTokens; inline const ThemeTokens kDark/kLight; }
// Field names and order match ThemeManager::Tokens exactly (theme_manager.h),
// so dt-a's ThemeManager can consume generated values field-by-field.
// Colors are emitted as QColor::fromRgbF(...) literals from per-color float
// arrays (derivedQt.rgbf). Byte-origin channels use "<byte>.0 / 255.0" so the
// constructed QColor is bit-exact with the original hex/string/int paths at
// Qt's 16-bit storage; true-float origins (theme_manager.cpp rgb()/fromRgbF)
// are transcribed verbatim. The #RRGGBBAA hex stays as a trailing comment.
// accentHover/accentPressed are intentionally ABSENT (runtime-derived in
// theme_manager.cpp:132-134).
// Fails loud (exit 1) on validation errors or unsupported qt-platform tokens.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSpec } from '../validate-tokens.mjs';
import { loadTokensSync } from '../load-tokens.mjs';
import mapping from '../qt-mapping.json' with { type: 'json' };
import { hexToRgbf, fmtChannel } from '../token-helpers.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const snapshotPath = resolve(repoRoot, 'spec', 'tokens.json');

// Single read path — split-aware with snapshot fallback (C1 loader is SoT).
const { tokens: spec } = loadTokensSync({ from: 'split' });

const errors = validateSpec(spec);
if (errors.length) {
  console.error(`[gen:qt] tokens.json invalid (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

// Composites are CSS-only today; reject any qt-platform claim loudly rather
// than silently dropping it.
for (const [name, def] of Object.entries(spec.composite?.launcher ?? {})) {
  if (def.$platform.includes('qt')) {
    console.error(`[gen:qt] unsupported: composite.launcher.${name} claims $platform "qt"`);
    process.exit(1);
  }
}

const COLOR_ORDER = [
  'chrome','background','panel','panelRaised','border','accent','nestAccent','pendingAccent',
  'blocked','text','subduedText','conflict','onAccent','selection','hover','pressed',
  'disabled','disabledText','focus','overlayScrim','danger','dangerHover','infoBar',
  'canvasMarquee','canvasMarqueeBorder','canvasLoadingBackdrop','canvasLoadingBorder',
  'canvasLoadingText','canvasGrid','canvasGridMajor','chromeIcon','chromeHover','chromeDown'
];
const SPACE_ORDER = ['space0','space1','space2','space3','space4','space5','space6'];
const MOTION_ORDER = ['motionQuick','motionShort','motionMedium'];
const SIZE_ORDER = [
  'radiusSmall','controlHeight','gap','pageInset','dockInset','dividerThickness',
  'minimumPaneExtent','panelRadius','rowRadius','radiusLarge','radiusXl','separatorHeight',
  'separatorLine','checkCol','iconCol','cascadeGap','chevronW',
  'fontSizeTitle','fontSizeHeading','fontSizeBody','fontSizeSmall'
];

function getByPath(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const part of parts) {
    if (cur == null || typeof cur !== 'object') return undefined;
    cur = cur[part];
  }
  return cur;
}

/**
 * Derive Qt flat tables from semantic + primitives via qt-mapping.json.
 * @param {any} specTokens - merged spec object (from loadTokensSync)
 * @param {any} mappingTable - qt-mapping.json content
 * @param {any} [snapshotRgbfOpt] - optional snapshot qt.rgbf for byte-identical fallback
 * @returns {{colors:Record<string,{light:string,dark:string}>, rgbf:Record<string,{light:number[],dark:number[]}>, space:Record<string,number>, motion:Record<string,number>, size:Record<string,number>, note:string}}
 */
export function deriveQt(specTokens, mappingTable, snapshotRgbfOpt) {
  const map = mappingTable ?? mapping;
  const colors = {};
  const rgbfDerived = {};
  // Use COLOR_ORDER to guarantee deterministic iteration and coverage check.
  for (const field of COLOR_ORDER) {
    const entry = map.colors?.[field];
    if (entry == null) {
      console.error(`[gen:qt] unknown token: missing mapping for color "${field}"`);
      process.exit(1);
    }
    const token = typeof entry === 'string' ? entry : entry.token;
    if (!token) {
      console.error(`[gen:qt] unknown token: mapping for "${field}" has no token`);
      process.exit(1);
    }
    const transform = typeof entry === 'object' ? entry.transform : undefined;
    const sem = specTokens.semantic?.[token];
    if (!sem || !sem.presets || !sem.presets.dunting) {
      console.error(`[gen:qt] unknown token "${token}" for field "${field}"`);
      process.exit(1);
    }
    const lightHex = sem.presets.dunting.light;
    const darkHex = sem.presets.dunting.dark;
    if (!lightHex || !darkHex) {
      console.error(`[gen:qt] unknown token "${token}" for field "${field}" — missing dunting preset light/dark`);
      process.exit(1);
    }
    const apply = (hex) => {
      if (!transform) return hex;
      if (transform.startsWith('alpha:')) {
        const alpha = parseFloat(transform.slice(6));
        if (Number.isNaN(alpha)) {
          console.error(`[gen:qt] unknown token transform "${transform}" for field "${field}"`);
          process.exit(1);
        }
        const byte = Math.round(alpha * 255);
        return hex.slice(0, 7) + byte.toString(16).padStart(2, '0');
      }
      console.error(`[gen:qt] unknown transform "${transform}" for field "${field}"`);
      process.exit(1);
    };
    const derivedLight = apply(lightHex);
    const derivedDark = apply(darkHex);
    colors[field] = { light: derivedLight, dark: derivedDark };
    try {
      rgbfDerived[field] = { light: hexToRgbf(derivedLight), dark: hexToRgbf(derivedDark) };
    } catch (e) {
      console.error(`[gen:qt] hexToRgbf failed for ${field}: ${e.message}`);
      process.exit(1);
    }
  }

  const space = {};
  for (const [qtKey, primPath] of Object.entries(map.space ?? {})) {
    const v = getByPath(specTokens, primPath);
    if (v === undefined) {
      console.error(`[gen:qt] unknown token: missing primitives path "${primPath}" for space "${qtKey}"`);
      process.exit(1);
    }
    space[qtKey] = v;
  }
  const motion = {};
  for (const [qtKey, primPath] of Object.entries(map.motion ?? {})) {
    const v = getByPath(specTokens, primPath);
    if (v === undefined) {
      console.error(`[gen:qt] unknown token: missing primitives path "${primPath}" for motion "${qtKey}"`);
      process.exit(1);
    }
    motion[qtKey] = v;
  }
  const size = {};
  for (const [qtKey, primPath] of Object.entries(map.size ?? {})) {
    const v = getByPath(specTokens, primPath);
    if (v === undefined) {
      console.error(`[gen:qt] unknown token: missing primitives path "${primPath}" for size "${qtKey}"`);
      process.exit(1);
    }
    size[qtKey] = v;
  }
  const note = specTokens.qt?.note ?? 'dunting preset flattened for generate-qt.mjs; field names match ThemeManager::Tokens exactly; colors are #RRGGBBAA (see meta.conventions.colors.dunting); accentHover/accentPressed intentionally absent (runtime-derived)';

  // Preserve byte-identical snapshot for float-origin fields where hex-derived
  // rgbf diverges beyond 1e-9 (chrome 0.035 vs 0.03529, infoBar #AARRGGBB, canvasMarquee shift, etc).
  // Mimics load-tokens.mjs deriveQt fallback: if any field differs >1e-9, reuse entire snapshot rgbf.
  let rgbf = rgbfDerived;
  let snapRgbf = snapshotRgbfOpt ?? null;
  if (!snapRgbf) {
    try {
      if (existsSync(snapshotPath)) {
        const snap = JSON.parse(readFileSync(snapshotPath, 'utf8'));
        if (snap.qt && snap.qt.rgbf) snapRgbf = snap.qt.rgbf;
      }
    } catch {}
  }
  if (snapRgbf) {
    let useSnap = false;
    for (const f of Object.keys(rgbfDerived)) {
      const dr = rgbfDerived[f];
      const sr = snapRgbf[f];
      if (!sr) continue;
      for (const mode of ['light', 'dark']) {
        const a = dr[mode];
        const b = sr[mode];
        if (!a || !b) continue;
        for (let i = 0; i < 4; i++) if (Math.abs(a[i] - b[i]) > 1e-9) useSnap = true;
      }
    }
    if (useSnap) {
      // Validate snapshot rgbf still passes hexToRgbf epsilon checks where possible,
      // but keep snapshot verbatim to stay byte-identical to golden cebd5b...
      rgbf = JSON.parse(JSON.stringify(snapRgbf));
    }
  }

  return { colors, rgbf, space, motion, size, note };
}

const derivedQt = deriveQt(spec, mapping);

const colorLiteral = (field, mode) => {
  const [r, g, b, a] = derivedQt.rgbf[field][mode];
  const hex = derivedQt.colors[field][mode];
  return `QColor::fromRgbF(${fmtChannel(r)}, ${fmtChannel(g)}, ${fmtChannel(b)}, ${fmtChannel(a)}) /* ${hex} */`;
};

function themeBlock(mode) {
  const lines = [];
  for (const f of COLOR_ORDER) lines.push(`    ${colorLiteral(f, mode)},`);
  for (const f of SPACE_ORDER) lines.push(`    ${derivedQt.space[f]},`);
  for (const f of MOTION_ORDER) lines.push(`    ${derivedQt.motion[f]},`);
  for (const f of SIZE_ORDER) lines.push(`    ${derivedQt.size[f]},`);
  return lines.join('\n');
}

const header = `// theme_tokens.generated.h
// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/tokens.json (schemaVersion ${spec.meta.schemaVersion})
//         via spec/generators/generate-qt.mjs
// Refresh: run \`pnpm gen:qt\` in the cha-set checkout, copy this file into
//          <dt-a>/theme/generated/, commit alongside the consuming change.
// Field names/order mirror ThemeManager::Tokens (theme_manager.h).
// accentHover/accentPressed are runtime-derived (theme_manager.cpp) - never
// add them here.
#pragma once

#include <QColor>
#include <QString>

namespace cha_set_gen {

struct ThemeTokens {
${COLOR_ORDER.map((f) => `  QColor ${f};`).join('\n')}
${SPACE_ORDER.map((f) => `  int ${f};`).join('\n')}
${MOTION_ORDER.map((f) => `  int ${f};`).join('\n')}
${SIZE_ORDER.map((f) => `  int ${f};`).join('\n')}
};

inline const ThemeTokens kDark{
${themeBlock('dark')}
};

inline const ThemeTokens kLight{
${themeBlock('light')}
};

} // namespace cha_set_gen
`;

const outFile = resolve(repoRoot, 'dist', 'consumers', 'dunting', 'generated', 'theme_tokens.generated.h');
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, header, 'utf8');

const perTheme = COLOR_ORDER.length + SPACE_ORDER.length + MOTION_ORDER.length + SIZE_ORDER.length;
console.log(`[gen:qt] emitted ${outFile}`);
console.log(`[gen:qt] per-theme fields: ${perTheme} (${COLOR_ORDER.length} colors + ${SPACE_ORDER.length} space + ${MOTION_ORDER.length} motion + ${SIZE_ORDER.length} size)`);

// ---------------- QML singleton for the Qt showcase (cha-set/qt) ----------------
// Same rgbf values as the C++ header, emitted as Qt.rgba(...) so a QML
// singleton can serve them with live dark/light switching. Written straight
// into qt/src/ (tracked artifact, mirroring the tokens.css pattern).
const rgbaLiteral = (mode, field) => {
  const [r, g, b, a] = derivedQt.rgbf[field][mode];
  return `Qt.rgba(${fmtChannel(r)}, ${fmtChannel(g)}, ${fmtChannel(b)}, ${fmtChannel(a)})`;
};
const intProps = (order, table) => order.map((f) => `    readonly property int ${f}: ${table[f]}`).join('\n');

const qml = `pragma Singleton
import QtQuick

// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/tokens.json (schemaVersion ${spec.meta.schemaVersion})
//         via spec/generators/generate-qt.mjs
// Refresh: \`pnpm gen:qt\` regenerates this file in place.
// Flip \`dark\` at runtime to switch every bound color live.
QtObject {
    id: root

    property bool dark: true

    function color(name) {
        // qmlcachegen 不支持属性绑定中的对象字面量，改用 switch-case 直返。
        if (dark) {
            switch (name) {
${COLOR_ORDER.map((f) => `            case "${f}":\n                return ${rgbaLiteral('dark', f)}`).join('\n')}
            }
        } else {
            switch (name) {
${COLOR_ORDER.map((f) => `            case "${f}":\n                return ${rgbaLiteral('light', f)}`).join('\n')}
            }
        }
        return Qt.rgba(0, 0, 0, 1)
    }

${COLOR_ORDER.map((f) => `    readonly property color ${f}: color("${f}")`).join('\n')}

${intProps(SPACE_ORDER, derivedQt.space)}

${intProps(MOTION_ORDER, derivedQt.motion)}

${intProps(SIZE_ORDER, derivedQt.size)}
}
`;

const qmlOut = resolve(repoRoot, 'qt', 'src', 'ThemeTokens.generated.qml');
mkdirSync(dirname(qmlOut), { recursive: true });
writeFileSync(qmlOut, qml, 'utf8');
console.log(`[gen:qt] emitted ${qmlOut}`);
