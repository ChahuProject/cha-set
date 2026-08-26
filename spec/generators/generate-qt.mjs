// generate-qt.mjs — emits a C++ token header for the dunting preset.
//
// Output: dist/consumers/dunting/generated/theme_tokens.generated.h
//   namespace cha_set_gen { struct ThemeTokens; inline const ThemeTokens kDark/kLight; }
// Field names and order match ThemeManager::Tokens exactly (theme_manager.h),
// so dt-a's ThemeManager can consume generated values field-by-field.
// Colors are emitted as QColor::fromRgbF(...) literals from per-color float
// arrays (spec.qt.rgbf). Byte-origin channels use "<byte>.0 / 255.0" so the
// constructed QColor is bit-exact with the original hex/string/int paths at
// Qt's 16-bit storage; true-float origins (theme_manager.cpp rgb()/fromRgbF)
// are transcribed verbatim. The #RRGGBBAA hex stays as a trailing comment.
// accentHover/accentPressed are intentionally ABSENT (runtime-derived in
// theme_manager.cpp:132-134).
// Fails loud (exit 1) on validation errors or unsupported qt-platform tokens.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSpec } from '../validate-tokens.mjs';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
const spec = JSON.parse(readFileSync(resolve(repoRoot, 'spec', 'tokens.json'), 'utf8'));

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

// Byte-origin channels emit as "<byte>.0 / 255.0" (exact at Qt's 16-bit
// storage: v/255*65535 == v*257 == parsed-hex ushort); true-float origins
// (transcribed verbatim from theme_manager.cpp) emit as decimals.
const fmtChannel = (v) => {
  const b = v * 255;
  return Math.abs(b - Math.round(b)) < 1e-9 ? `${Math.round(b)}.0 / 255.0` : String(v);
};
const colorLiteral = (field, mode) => {
  const [r, g, b, a] = spec.qt.rgbf[field][mode];
  const hex = spec.qt.colors[field][mode];
  return `QColor::fromRgbF(${fmtChannel(r)}, ${fmtChannel(g)}, ${fmtChannel(b)}, ${fmtChannel(a)}) /* ${hex} */`;
};

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

function themeBlock(mode) {
  const lines = [];
  for (const f of COLOR_ORDER) lines.push(`    ${colorLiteral(f, mode)},`);
  for (const f of SPACE_ORDER) lines.push(`    ${spec.qt.space[f]},`);
  for (const f of MOTION_ORDER) lines.push(`    ${spec.qt.motion[f]},`);
  for (const f of SIZE_ORDER) lines.push(`    ${spec.qt.size[f]},`);
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
  const [r, g, b, a] = spec.qt.rgbf[field][mode];
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

${intProps(SPACE_ORDER, spec.qt.space)}

${intProps(MOTION_ORDER, spec.qt.motion)}

${intProps(SIZE_ORDER, spec.qt.size)}
}
`;

const qmlOut = resolve(repoRoot, 'qt', 'src', 'ThemeTokens.generated.qml');
mkdirSync(dirname(qmlOut), { recursive: true });
writeFileSync(qmlOut, qml, 'utf8');
console.log(`[gen:qt] emitted ${qmlOut}`);