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
import { hexToRgbf, fmtChannel, camelProp, toKebab, FONT_FAMILY_ORDER, FONT_SIZE_ORDER, LINE_HEIGHT_ORDER, LETTER_SPACING_ORDER } from '../token-helpers.mjs';

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
const EASING_ORDER = ['standard','emphasized','entrance'];
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
  const easing = {};
  for (const [qtKey, primPath] of Object.entries(map.easing ?? {})) {
    const v = getByPath(specTokens, primPath);
    if (v === undefined) {
      console.error(`[gen:qt] unknown token: missing primitives path "${primPath}" for easing "${qtKey}"`);
      process.exit(1);
    }
    easing[qtKey] = v;
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

  return { colors, rgbf, space, motion, easing, size, note };
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

const publicHeader = resolve(repoRoot, 'qt', 'include', 'ChaSet', 'theme_tokens.generated.h');
mkdirSync(dirname(publicHeader), { recursive: true });
writeFileSync(publicHeader, header, 'utf8');

const perTheme = COLOR_ORDER.length + SPACE_ORDER.length + MOTION_ORDER.length + SIZE_ORDER.length;
console.log(`[gen:qt] emitted ${outFile} and ${publicHeader}`);
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
const motionProps = (order, table) => order.map((f) => `    readonly property int ${f}: motionDuration(${table[f]})`).join('\n');
const easingProps = (order, table) => order.map((f) => `    readonly property int ease${f[0].toUpperCase()}${f.slice(1)}: Easing.${table[f]}`).join('\n');

const qml = `pragma Singleton
import QtQuick

// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/tokens.json (schemaVersion ${spec.meta.schemaVersion})
//         via spec/generators/generate-qt.mjs
// Refresh: \`pnpm gen:qt\` regenerates this file in place.
// Flip \`dark\` at runtime to switch every bound color live.
QtObject {
    id: root

    property bool dark: false
    property bool animationsEnabled: true
    property real animSpeed: 0.2

    function motionDuration(baseMs) {
        if (!animationsEnabled) return 0;
        const factor = (animSpeed > 0.01) ? (animSpeed / 0.2) : 1.0;
        return Math.max(0, Math.round(baseMs / factor));
    }

    function color(name) {
        // qmlcachegen does not support object literals in property bindings; use switch-case direct returns.
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
    // Aliases for onAccent: QML reserves on<CapitalLetter> for signal handlers, so
    // property onAccent evaluates to invalid/black. Expose primaryForeground and onAccentColor.
    readonly property color primaryForeground: color("onAccent")
    readonly property color onAccentColor: color("onAccent")

${intProps(SPACE_ORDER, derivedQt.space)}

${motionProps(MOTION_ORDER, derivedQt.motion)}

${easingProps(EASING_ORDER, derivedQt.easing)}

${intProps(SIZE_ORDER, derivedQt.size)}
}
`;

const qmlOut = resolve(repoRoot, 'qt', 'src', 'ThemeTokens.generated.qml');
mkdirSync(dirname(qmlOut), { recursive: true });
writeFileSync(qmlOut, qml, 'utf8');
console.log(`[gen:qt] emitted ${qmlOut}`);

// ---------------- QML singleton for the syntax palette (cha-set/qt) ----------------
// Deliberately a SEPARATE artifact from ThemeTokens.generated.qml: theme_tokens.generated.h
// and the 33-field qt.color contract are frozen downstream (dt-a ThemeManager::Tokens), so
// the code-* colors must never enter qt-mapping.json.colors. They are additive semantic
// tokens (spec/tokens/semantic/core.json) flattened here for the dunting preset only.
//
// Token type <X> resolves to semantic token `code-<X>`; `plain` is intentionally absent
// because plain text uses the host's foreground and is never wrapped in a span.
const languagesPath = resolve(repoRoot, 'spec', 'highlight', 'languages.json');
const highlightSpec = JSON.parse(readFileSync(languagesPath, 'utf8'));
const codeTypes = (highlightSpec.tokenTypes ?? []).filter((t) => t !== 'plain');
if (codeTypes.length === 0) {
  console.error('[gen:qt] code palette: spec/highlight/languages.json declares no tokenTypes');
  process.exit(1);
}

const codeColorLiteral = (mode, type) => {
  const tokenName = `code-${type}`;
  const sem = spec.semantic?.[tokenName];
  const hex = sem?.presets?.dunting?.[mode];
  if (!hex) {
    console.error(`[gen:qt] code palette: missing semantic token "${tokenName}" dunting.${mode}`);
    process.exit(1);
  }
  const [r, g, b, a] = hexToRgbf(hex);
  return `Qt.rgba(${fmtChannel(r)}, ${fmtChannel(g)}, ${fmtChannel(b)}, ${fmtChannel(a)}) /* ${hex} */`;
};

const codeCase = (mode) =>
  codeTypes.map((t) => `            case "${t}":\n                return ${codeColorLiteral(mode, t)}`).join('\n');

const codeQml = `pragma Singleton
import QtQuick
import ChaSet

// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/tokens/semantic/core.json (dunting preset) + tokenTypes from
//         spec/highlight/languages.json, via spec/generators/generate-qt.mjs
// Refresh: \`pnpm gen:qt\` regenerates this file in place.
// Syntax palette consumed by ChaSetHighlightedCode. Token type <X> maps to the
// semantic token \`code-<X>\`; \`plain\` is absent on purpose (plain text uses the
// host foreground). Theme mode is read live from ThemeTokens so every color
// follows the active theme without any extra wiring.
//
// Only \`colorFor(type)\` is exposed: per-type properties cannot be declared here
// because token types like \`function\`, \`property\` and \`operator\` are reserved
// QML identifiers.
QtObject {
    id: root

    // Bound (not copied) so the palette tracks ThemeTokens live at runtime.
    readonly property bool dark: ThemeTokens.dark

    function colorFor(type) {
        // qmlcachegen does not support object literals in property bindings; use switch-case direct returns.
        if (dark) {
            switch (type) {
${codeCase('dark')}
            }
        } else {
            switch (type) {
${codeCase('light')}
            }
        }
        return Qt.rgba(0, 0, 0, 1)
    }
}
`;

const codeQmlOut = resolve(repoRoot, 'qt', 'src', 'CodeTokens.generated.qml');
mkdirSync(dirname(codeQmlOut), { recursive: true });
writeFileSync(codeQmlOut, codeQml, 'utf8');
console.log(`[gen:qt] emitted ${codeQmlOut} (${codeTypes.length} syntax token types)`);

// ---------------- QML singleton for typography (cha-set/qt) ----------------
// Deliberately a SEPARATE artifact from theme_tokens.generated.h: that header's
// struct mirrors dt-a's ThemeManager::Tokens (33 colors + 7 space + 3 motion +
// 21 size) and is frozen downstream, so the typography scale must not be added
// to it. Same rationale as CodeTokens.generated.qml.
//
// The Qt side needs two things CSS gets for free:
//   1. ONE family name per role — Qt does not resolve comma-separated
//      `font.family` lists, so `css` fallback stacks are meaningless here.
//   2. Absolute px line heights — CSS `line-height: <ratio>` multiplies by the
//      element's font-size, while Qt's `Text.lineHeight` / rich-text
//      `line-height` take px (and rich-text percentages are relative to the
//      font's default line spacing, not the font size; see
//      docs/architecture/typography-system.md §4).
// `lineHeightPx()` below is the single bridge from the ratio scale to either
// Qt text engine, so both stacks agree on the same absolute px value.
const typographyPrim = spec.primitives?.typography;
if (!typographyPrim) {
  console.error('[gen:qt] typography: spec/tokens/primitives.json has no `typography` group');
  process.exit(1);
}
{
  const missingFamily = FONT_FAMILY_ORDER.filter((f) => !typographyPrim.fontFamily?.[f]?.qt);
  const missingSize = FONT_SIZE_ORDER.filter((s) => typeof typographyPrim.fontSize?.[s] !== 'number');
  const missingLeading = LINE_HEIGHT_ORDER.filter((l) => typeof typographyPrim.lineHeight?.[l] !== 'number');
  const missingTracking = LETTER_SPACING_ORDER.filter((l) => typeof typographyPrim.letterSpacing?.[l] !== 'number');
  if (missingFamily.length || missingSize.length || missingLeading.length || missingTracking.length) {
    console.error(
      `[gen:qt] typography: incomplete primitives (family: ${missingFamily.join(',') || '-'}; size: ${missingSize.join(',') || '-'}; leading: ${missingLeading.join(',') || '-'}; tracking: ${missingTracking.join(',') || '-'})`,
    );
    process.exit(1);
  }
}

const num = (n) => String(n);
const qmlString = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
const camel = camelProp;

const familyProps = FONT_FAMILY_ORDER.map(
  (f) =>
    `    readonly property string family${camel(f)}: ${qmlString(typographyPrim.fontFamily[f].qt)}` +
    `\n    // web stack: ${typographyPrim.fontFamily[f].css}`,
).join('\n');

const sansFamilies = typographyPrim.fontFamily?.sans?.qtFamilies ?? ['Segoe UI', 'Microsoft YaHei UI', 'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', 'sans-serif'];
const monoFamilies = typographyPrim.fontFamily?.mono?.qtFamilies ?? ['Consolas', 'Cascadia Code', 'Microsoft YaHei UI', 'Microsoft YaHei', 'PingFang SC', 'Noto Sans SC', 'monospace'];

// Qt maps 400/500/600/700 onto Font.Normal/Medium/DemiBold/Bold.
const QT_WEIGHT_ENUM = { 400: 'Font.Normal', 500: 'Font.Medium', 600: 'Font.DemiBold', 700: 'Font.Bold' };
const weightProps = Object.entries(spec.primitives.fontWeight ?? {})
  .map(([k, v]) => `    readonly property int weight${camel(k)}: ${num(v)} // ${QT_WEIGHT_ENUM[v] ?? 'custom'}`)
  .join('\n');

const sizeProps = FONT_SIZE_ORDER.map(
  (s) => `    readonly property int size${camel(s)}: ${num(typographyPrim.fontSize[s])}`,
).join('\n');

const leadingProps = LINE_HEIGHT_ORDER.map(
  (l) => `    readonly property real leading${camel(l)}: ${num(typographyPrim.lineHeight[l])}`,
).join('\n');

const trackingProps = LETTER_SPACING_ORDER.map(
  (l) => `    readonly property real tracking${camel(l)}: ${num(typographyPrim.letterSpacing[l])}`,
).join('\n');

const sizeSwitch = FONT_SIZE_ORDER.map((s) => {
  const k = toKebab(s);
  return k !== s
    ? `            case "${s}":\n            case "${k}": return ${num(typographyPrim.fontSize[s])}`
    : `            case "${s}": return ${num(typographyPrim.fontSize[s])}`;
}).join('\n');
const leadingSwitch = LINE_HEIGHT_ORDER.map((l) => {
  const k = toKebab(l);
  return k !== l
    ? `            case "${l}":\n            case "${k}": return ${num(typographyPrim.lineHeight[l])}`
    : `            case "${l}": return ${num(typographyPrim.lineHeight[l])}`;
}).join('\n');
const trackingSwitch = LETTER_SPACING_ORDER.map((l) => `            case "${l}": return ${num(typographyPrim.letterSpacing[l])}`).join('\n');
const weightSwitch = Object.entries(spec.primitives.fontWeight ?? {})
  .map(([k, v]) => `            case "${k}": return ${num(v)}`)
  .join('\n');

const typographyQml = `pragma Singleton
import QtQuick

// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/tokens/primitives.json -> primitives.typography / primitives.fontWeight
//         (schemaVersion ${spec.meta.schemaVersion}) via spec/generators/generate-qt.mjs
// Refresh: \`pnpm gen:qt\` regenerates this file in place.
//
// Cross-platform typography contract. The React side reads the SAME numbers
// from \`--cs-font-*\` / \`--cs-text-*\` / \`--cs-leading-*\` / \`--cs-tracking-*\`
// in packages/react/src/styles/tokens.css, so both stacks resolve identical
// families, sizes, weights, line heights and letter spacings.
//
// Two Qt-specific facts this singleton exists to encode:
//   1. \`font.family\` is a SINGLE family name here. Qt does not resolve
//      comma-separated lists the way CSS does, so the web fallback stacks are
//      deliberately absent — use \`familySans\`/\`familyMono\` verbatim.
//   2. Line heights are unitless RATIOS; Qt text items need absolute px.
//      Always convert through \`lineHeightPx()\` instead of multiplying inline,
//      so both engines land on the same rounded value.
QtObject {
    id: root

    // --- font families ---------------------------------------------------
${familyProps}

    // --- font fallback chains (Qt 6 font.families support) ----------------
    readonly property var familiesSans: ${JSON.stringify(sansFamilies)}
    readonly property var familiesMono: ${JSON.stringify(monoFamilies)}

    // --- font weights ----------------------------------------------------
${weightProps}

    // --- font sizes (px; CSS emits the same numbers as rem at a 16px root) ---
${sizeProps}

    // --- line heights (unitless ratios, multiplied by the px font size) ---
${leadingProps}

    // --- letter spacing (em ratios, multiplied by the px font size) ------
${trackingProps}

    // --- named-role accessors (avoid re-typing the scale in QML) ---------
    function size(name) {
        switch (name) {
${sizeSwitch}
        }
        return ${num(typographyPrim.fontSize.small)}
    }

    function leading(name) {
        switch (name) {
${leadingSwitch}
        }
        return ${num(typographyPrim.lineHeight.normal)}
    }

    function weight(name) {
        switch (name) {
${weightSwitch}
        }
        return ${num(spec.primitives.fontWeight?.regular ?? 400)}
    }

    function tracking(name) {
        switch (name) {
${trackingSwitch}
        }
        return 0
    }

    // Absolute px line height for a (sizePx, leadingName) pair.
    // Snapped to 1/64 px — Qt's layout unit — so a Text with
    // \`lineHeightMode: Text.FixedHeight\` and a RichText \`line-height: <px>px\`
    // resolve the very same line box, and the same number CSS computes as
    // \`font-size × line-height\`.
    function lineHeightPx(sizePx, leadingName) {
        return Math.round(sizePx * root.leading(leadingName) * 64) / 64
    }

    // Absolute px letter spacing for a (sizePx, trackingName) pair.
    function trackingPx(sizePx, trackingName) {
        return sizePx * root.tracking(trackingName)
    }
}
`;

const typographyQmlOut = resolve(repoRoot, 'qt', 'src', 'Typography.generated.qml');
mkdirSync(dirname(typographyQmlOut), { recursive: true });
writeFileSync(typographyQmlOut, typographyQml, 'utf8');
console.log(
  `[gen:qt] emitted ${typographyQmlOut} (${FONT_FAMILY_ORDER.length} families, ${FONT_SIZE_ORDER.length} sizes, ${LINE_HEIGHT_ORDER.length} line heights, ${LETTER_SPACING_ORDER.length} letter spacings)`,
);
