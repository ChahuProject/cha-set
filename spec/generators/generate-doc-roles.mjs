// spec/generators/generate-doc-roles.mjs — emits the doc-role table to BOTH stacks.
//
// Source: spec/doc-roles.json (roles) + spec/tokens/primitives.json (scale).
//
// Why a generator instead of a component family: a role is a *slot in the
// typography scale*, not a behaviour. Splitting `h1…h4/code` into components
// would multiply files, DocPages, CMake entries and gate obligations while
// leaving the same role→style switch somewhere else. Generating one table keeps
// every role's numbers in one place and makes both stacks resolve identical
// values (the switch stays where it belongs: at the call site's `role` prop).
//
// Outputs:
//   packages/react/examples/basic/src/components/docRoles.generated.ts  (data, CSS-var refs)
//   qt/src/DocRoles.generated.qml                                      (singleton, scaled px)
//
// Both artifacts are DOC-LAYER scaffolding, deliberately outside the published
// component surface: product components keep using ThemeTokens / typography
// tokens directly, so the doc scale cannot leak into product UI by accident.
//
// Fails loud (exit 1) when a role references a primitive name that does not
// exist, so a typo can never silently fall back to the default role.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadTokensSync } from '../load-tokens.mjs';
import { toKebab } from '../token-helpers.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..');

const rolesPath = resolve(repoRoot, 'spec', 'doc-roles.json');
const docRoles = JSON.parse(readFileSync(rolesPath, 'utf8'));

const { tokens: spec } = loadTokensSync({ from: 'split' });
const typography = spec.primitives?.typography;
const weights = spec.primitives?.fontWeight;

if (!typography) {
  console.error('[gen:roles] spec/tokens/primitives.json has no `primitives.typography`');
  process.exit(1);
}

const ALLOWED_TAGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'code', 'blockquote', 'div'];
const ALLOWED_FAMILIES = ['sans', 'mono'];
const TONES = Object.keys(docRoles.toneVars ?? {});

const errors = [];

if (!docRoles.roles || typeof docRoles.roles !== 'object') {
  console.error('[gen:roles] spec/doc-roles.json has no `roles` map');
  process.exit(1);
}
if (!docRoles.roles[docRoles.defaultRole]) {
  console.error(`[gen:roles] defaultRole "${docRoles.defaultRole}" is not a defined role`);
  process.exit(1);
}
if (TONES.length === 0) {
  console.error('[gen:roles] spec/doc-roles.json has no `toneVars` map');
  process.exit(1);
}

for (const [role, def] of Object.entries(docRoles.roles)) {
  const at = `roles.${role}`;
  if (!ALLOWED_TAGS.includes(def.tag)) errors.push(`${at}.tag "${def.tag}" is not one of ${ALLOWED_TAGS.join('/')}`);
  if (!ALLOWED_FAMILIES.includes(def.family)) errors.push(`${at}.family "${def.family}" is not one of ${ALLOWED_FAMILIES.join('/')}`);
  if (typeof typography.fontSize?.[def.size] !== 'number') errors.push(`${at}.size "${def.size}" is not a primitives.typography.fontSize entry`);
  if (typeof typography.lineHeight?.[def.leading] !== 'number') errors.push(`${at}.leading "${def.leading}" is not a primitives.typography.lineHeight entry`);
  if (typeof typography.letterSpacing?.[def.tracking] !== 'number') errors.push(`${at}.tracking "${def.tracking}" is not a primitives.typography.letterSpacing entry`);
  if (typeof weights?.[def.weight] !== 'number') errors.push(`${at}.weight "${def.weight}" is not a primitives.fontWeight entry`);
  if (!TONES.includes(def.tone)) errors.push(`${at}.tone "${def.tone}" is not one of ${TONES.join('/')}`);
  if (typeof def.wrap !== 'boolean') errors.push(`${at}.wrap must be a boolean`);
  if (typeof def.uppercase !== 'boolean') errors.push(`${at}.uppercase must be a boolean`);
}

if (errors.length) {
  console.error(`[gen:roles] spec/doc-roles.json invalid (${errors.length}):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const roleNames = Object.entries(docRoles.roles).map(([name, def]) => ({
  name,
  tag: def.tag,
  family: def.family,
  sizeName: def.size,
  sizePx: typography.fontSize[def.size],
  sizeVar: `--cs-text-${toKebab(def.size)}`,
  weightName: def.weight,
  weight: weights[def.weight],
  weightVar: `--cs-font-weight-${def.weight}`,
  leadingName: def.leading,
  leading: typography.lineHeight[def.leading],
  leadingVar: `--cs-leading-${toKebab(def.leading)}`,
  trackingName: def.tracking,
  tracking: typography.letterSpacing[def.tracking],
  trackingVar: `--cs-tracking-${toKebab(def.tracking)}`,
  familyVar: `var(--cs-font-${def.family})`,
  tone: def.tone,
  wrap: def.wrap,
  uppercase: def.uppercase,
}));

/* -------------------------------------------------------------------------- */
/* React: data-only module of CSS-variable references                          */
/* -------------------------------------------------------------------------- */

const tsRoles = roleNames
  .map(
    (r) => `  ${r.name}: {
    tag: '${r.tag}',
    sizeVar: 'var(${r.sizeVar})',
    leadingVar: 'var(${r.leadingVar})',
    trackingVar: 'var(${r.trackingVar})',
    weightVar: 'var(${r.weightVar})',
    familyVar: '${r.familyVar}',
    tone: '${r.tone}',
    wrap: ${r.wrap},
    uppercase: ${r.uppercase},
    sizePx: ${r.sizePx},
    weight: ${r.weight},
  },`,
  )
  .join('\n');

const toneVarEntries = Object.entries(docRoles.toneVars)
  .map(([tone, cssName]) => `  ${tone}: 'var(--color-${cssName})',`)
  .join('\n');

const ts = `/**
 * GENERATED FILE - DO NOT EDIT.
 * Source: spec/doc-roles.json + spec/tokens/primitives.json (schemaVersion ${docRoles.schemaVersion})
 *         via spec/generators/generate-doc-roles.mjs
 * Refresh: \`pnpm gen:roles\` regenerates this file in place.
 *
 * Doc roles are DATA, not components. A role names a slot in the typography
 * scale plus the semantic tag and default tone; \`<DocText role="h2">\` is the
 * only primitive that consumes it. The Qt counterpart
 * (qt/src/DocRoles.generated.qml) is emitted from the SAME table, so both
 * stacks resolve identical sizes, weights, leading, tracking and tones.
 *
 * Sizes/leading/tracking are emitted as CSS-variable references, never as
 * literals: the variables are the token layer (packages/react/src/styles/
 * tokens.css) which is itself generated from primitives.json.
 */

export type DocRole =${roleNames.map((r) => `\n  | '${r.name}'`).join('')};

export type DocTone =${TONES.map((t) => `\n  | '${t}'`).join('')};

export type DocRoleTag = ${ALLOWED_TAGS.map((t) => `'${t}'`).join(' | ')};

export interface DocRoleStyle {
  /** Semantic element a role renders as when \`as\` is not overridden. */
  readonly tag: DocRoleTag;
  readonly sizeVar: string;
  readonly leadingVar: string;
  readonly trackingVar: string;
  readonly weightVar: string;
  readonly familyVar: string;
  /** Tone applied when the caller does not pass one. */
  readonly tone: DocTone;
  /** True when the role is a text block that should wrap. */
  readonly wrap: boolean;
  readonly uppercase: boolean;
  /** Resolved px at the 16px root — for docs/tables, not for styling. */
  readonly sizePx: number;
  readonly weight: number;
}

export const docRoles: Record<DocRole, DocRoleStyle> = {
${tsRoles}
};

/** Default tone → CSS variable. */
export const docToneColor: Record<DocTone, string> = {
${toneVarEntries}
};

/** Every role name, in table order (docs, playgrounds, tests). */
export const docRoleNames: DocRole[] = [${roleNames.map((r) => `'${r.name}'`).join(', ')}];

/** Role used when \`role\` is omitted or unknown. */
export const defaultDocRole: DocRole = '${docRoles.defaultRole}';

/** Resolve a role, falling back to the declared default instead of throwing. */
export function resolveDocRole(role?: string | null): DocRoleStyle {
  const key = (role ?? '') as DocRole;
  return docRoles[key] ?? docRoles[defaultDocRole];
}
`;

const tsOut = resolve(repoRoot, 'packages', 'react', 'examples', 'basic', 'src', 'components', 'docRoles.generated.ts');
mkdirSync(dirname(tsOut), { recursive: true });
writeFileSync(tsOut, ts, 'utf8');
console.log(`[gen:roles] emitted ${tsOut} (${roleNames.length} roles)`);

/* -------------------------------------------------------------------------- */
/* Qt: singleton with scaled px, weights and absolute letter spacing          */
/* -------------------------------------------------------------------------- */

// Qt's Text/TextEdit take letterSpacing in PIXELS, while the token scale is in
// em ratios relative to the font size. Precompute the product at runtime so a
// scaled UI keeps the same optical tracking: px = em × scaled font size.
const qtRoles = roleNames
  .map(
    (r) =>
      `        "${r.name}": ({ "tag": "${r.tag}", "size": ThemeTokens.sp(${r.sizePx}), "weight": ${r.weight},` +
      ` "leading": ${r.leading}, "tracking": ${r.tracking}, "mono": ${r.family === 'mono'},` +
      ` "tone": "${r.tone}", "wrap": ${r.wrap}, "uppercase": ${r.uppercase} }),`,
  )
  .join('\n');

const qml = `pragma Singleton
import QtQuick
import ChaSet

// GENERATED FILE - DO NOT EDIT.
// Source: cha-set spec/doc-roles.json + spec/tokens/primitives.json (schemaVersion ${docRoles.schemaVersion})
//         via spec/generators/generate-doc-roles.mjs
// Refresh: \`pnpm gen:roles\` regenerates this file in place.
//
// Doc roles are DATA, not components. A role names a slot in the typography
// scale plus a default tone; DocText.qml is the only consumer. The React
// counterpart (packages/react/src/typography/docRoles.generated.ts) is emitted
// from the SAME table, so both stacks resolve identical sizes, weights,
// leading, tracking and tones.
//
// Qt-specific encoding:
//   1. \`size\` is already multiplied by the global UI scale via ThemeTokens.sp(),
//      so DocText must assign it to font.pixelSize verbatim.
//   2. \`leading\` is emitted for completeness but is a WEB-ONLY field: QQuickTextEdit
//      has no lineHeight/lineHeightMode, so DocText keeps the font's natural
//      leading on the Qt side.
//   3. \`tracking\` is an em ratio; Text.letterSpacing is in px, so DocText
//      multiplies it by the scaled font size (trackingPx below).
QtObject {
    id: root

    readonly property string defaultRole: "${docRoles.defaultRole}"

    readonly property var table: ({
${qtRoles}
    })

    readonly property var roles: Object.keys(root.table)

    function has(role) {
        return role !== undefined && role !== null && root.table.hasOwnProperty(role);
    }

    /// Role definition, falling back to the declared default instead of throwing.
    function style(role) {
        return root.has(role) ? root.table[role] : root.table[root.defaultRole];
    }

    readonly property var fallback: root.table[root.defaultRole]

    function sizePx(role) { return root.style(role).size; }
    function weight(role) { return root.style(role).weight; }
    function leading(role) { return root.style(role).leading; }
    function tracking(role) { return root.style(role).tracking; }
    function trackingPx(role) { var s = root.style(role); return s.tracking * s.size; }
    function isMono(role) { return root.style(role).mono; }
    function tone(role) { return root.style(role).tone; }
    function wrap(role) { return root.style(role).wrap; }
    function uppercase(role) { return root.style(role).uppercase; }
}
`;

const qmlOut = resolve(repoRoot, 'qt', 'src', 'DocRoles.generated.qml');
mkdirSync(dirname(qmlOut), { recursive: true });
writeFileSync(qmlOut, qml, 'utf8');
console.log(`[gen:roles] emitted ${qmlOut} (${roleNames.length} roles)`);
