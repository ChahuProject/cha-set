// spec/generators/generate-icons.mjs
//
// Emits the two stack-specific icon artifacts from the single icon registry.
//
//   spec/icons/registry.json ──► packages/react/src/lib/icons.generated.tsx   (React)
//                            ──► qt/src/ChaSetIcons.generated.qml             (Qt)
//
// The registry stores artwork as an explicit SVG element vocabulary. React renders that
// vocabulary natively; Qt receives the same shapes pre-compiled to SVG path data, which
// its `PathSvg` consumer draws verbatim. One geometry, two rasterizers, no per-stack
// redrawing — which is what makes "the plus is bold on one stack and thin on the other"
// structurally impossible rather than merely fixed once.

import fs from 'node:fs';
import path from 'node:path';
import { elementToPath, elementsBBox, gridStrokeFloor } from '../icons/geometry.mjs';
import { resolveActiveSpec, validateRegistry, repoRoot } from '../icons/load.mjs';
import { scanInlineSvgSites, scanTextGlyphSites } from '../icons/adoption.mjs';

const root = repoRoot();
const checkOnly = process.argv.includes('--check');
const drift = [];

/** Write the artifact, or (with --check) verify the committed artifact already matches. */
function emit(file, content) {
  if (!checkOnly) {
    fs.writeFileSync(file, content, 'utf8');
    return;
  }
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
  if (current !== content) drift.push(rel);
}

const { registry, spec, specId, source } = resolveActiveSpec(root);

const validationErrors = validateRegistry(registry);
if (validationErrors.length > 0) {
  console.error('[gen:icons] registry.json is invalid:');
  for (const err of validationErrors) console.error(`  - ${err}`);
  process.exit(1);
}

/* ------------------------------------------------------------------ *
 * Shared derivations
 * ------------------------------------------------------------------ */

const iconNames = Object.keys(spec.icons);

/**
 * Grids as the artifacts consume them: the declared metrics plus the stroke floor derived from
 * them. The floor is computed here rather than stored in the registry so there is exactly one
 * statement of it — a floor written down next to the metrics it is computed from is a second
 * copy of a fact, and the second copy is the one that rots.
 */
const grids = Object.fromEntries(
  Object.entries(spec.grids).map(([id, grid]) => [id, { ...grid, strokeFloor: gridStrokeFloor(grid) }]),
);

/** Compiled Qt drawing instructions: one flat list of SVG paths per icon. */
const compiledShapes = {};
for (const [name, def] of Object.entries(spec.icons)) {
  const grid = spec.grids[def.grid];
  compiledShapes[name] = def.elements.map((el) => {
    const { d, fill } = elementToPath(el);
    return {
      grid: def.grid,
      gridSize: grid.size,
      strokeWidth: grid.strokeWidth,
      linecap: grid.linecap,
      linejoin: grid.linejoin,
      d,
      fill,
    };
  });
}

function pascalCase(name) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

const componentOverrides = { chaset: 'ChaSetLogoIcon' };
function componentName(name) {
  return componentOverrides[name] || `${pascalCase(name)}Icon`;
}

const categories = (spec.categories || []).map((c) => ({
  ...c,
  icons: c.icons.filter((i) => iconNames.includes(i)),
}));

/**
 * Control families, narrowed to icons the specification actually owns. A family that names a
 * missing icon is a gate failure, but the artifact still has to render: dropping the unknown
 * member keeps the showcase honest about what exists rather than printing a broken name.
 */
const families = (spec.families || []).map((family) => ({
  ...family,
  icons: (family.icons || []).filter((i) => iconNames.includes(i)),
}));

/**
 * Per-icon audit. The gate derives these numbers itself; embedding them lets the showcase
 * page display the very same measurements instead of asking the reader to trust a claim.
 * `offsetX/offsetY` are the distance between the painted bounding-box centre and the grid
 * centre, which is what the optical-centring rule constrains.
 */
const round = (n) => Math.round(n * 1000) / 1000;
const tolerance = spec.metrics?.opticalCenterTolerance ?? 0.75;
const iconAudit = {};
for (const [name, def] of Object.entries(spec.icons)) {
  const grid = spec.grids[def.grid];
  const box = elementsBBox(def.elements, grid.strokeWidth);
  if (!box) continue;
  const centerX = (box.minX + box.maxX) / 2;
  const centerY = (box.minY + box.maxY) / 2;
  iconAudit[name] = {
    grid: def.grid,
    gridSize: grid.size,
    strokeWidth: grid.strokeWidth,
    centerX: round(centerX),
    centerY: round(centerY),
    offsetX: round(centerX - grid.size / 2),
    offsetY: round(centerY - grid.size / 2),
    minX: round(box.minX),
    minY: round(box.minY),
    maxX: round(box.maxX),
    maxY: round(box.maxY),
    withinTolerance: Math.abs(centerX - grid.size / 2) <= tolerance && Math.abs(centerY - grid.size / 2) <= tolerance,
  };
}

// The embedded adoption ledger carries only facts that the showcase page displays and that
// are stable under unrelated edits. Line-precise locations deliberately stay out: they
// belong to the gate's diagnostics, which re-derive them on demand. Baking line numbers in
// would make the artifact "drift" whenever any file that mentions an icon gained a line —
// a freshness assertion that fires for reasons the author cannot see is worse than none.
//
// Exempt sites are carried too, as `exempted` plus the reason strings. An escape hatch that
// is not displayed is an escape hatch nobody audits.
const { sites: inlineSvgSites, exemptionProblems } = scanInlineSvgSites(root);

const adoption = {
  maxInlineSvgSites: registry.adoption?.maxInlineSvgSites ?? 0,
  inlineSvgSites: inlineSvgSites.map(({ file, count, exempted, reasons }) => ({
    file,
    count,
    exempted,
    reasons: reasons.map((entry) => entry.reason),
  })),
  exemptionProblemCount: exemptionProblems.length,
  textGlyphSites: scanTextGlyphSites(root).map(({ file, codePoint }) => ({ file, codePoint })),
};

const specSummaries = registry.specs.map((s) => ({
  id: s.id,
  title: s.title,
  status: s.status,
  summary: s.summary,
}));

const header = (comment) =>
  [
    `${comment} GENERATED FILE - DO NOT EDIT.`,
    `${comment} Source: spec/icons/registry.json -> active specification "${specId}"`,
    `${comment} Resolved through: ${source}`,
    `${comment} Regenerate with: pnpm gen:icons`,
    '',
  ].join('\n');

/* ------------------------------------------------------------------ *
 * React artifact
 * ------------------------------------------------------------------ */

/**
 * Serialize the registry vocabulary as data. Emitting data rather than pre-baked JSX keeps the
 * artifact inspectable (a diff of the generated file reads like a diff of the registry) and
 * lets `renderElement` stay the single React compiler from vocabulary to DOM elements.
 */
const reactDefinitions = JSON.stringify(
  Object.fromEntries(
    iconNames.map((name) => [
      name,
      { grid: spec.icons[name].grid, elements: spec.icons[name].elements },
    ]),
  ),
  null,
  2,
);

const reactExports = iconNames
  .map((name) => `export const ${componentName(name)} = /*#__PURE__*/ makeIcon('${name}', '${componentName(name)}');`)
  .join('\n');

const reactCode = `import * as React from 'react';
import { cn } from './utils';
${header('//')}
export type IconGridId = ${Object.keys(spec.grids)
  .map((g) => `'${g}'`)
  .join(' | ')};

export interface IconGrid {
  size: number;
  strokeWidth: number;
  linecap: 'round' | 'butt' | 'square';
  linejoin: 'round' | 'miter' | 'bevel';
  safeMargin: number;
  note: string;
  /**
   * Smallest render size at which this grid still paints a one pixel stroke, derived as
   * \`size / strokeWidth\` rather than stored beside it. Below it the stroke is sub-pixel.
   */
  strokeFloor: number;
}

/**
 * Registry element vocabulary, carried verbatim as data in \`ICON_ELEMENTS\` and rendered by
 * \`renderElement\`. Keeping it as data (instead of pre-baked JSX) means the artifact can be
 * diffed, audited and serialized exactly like the compiled path data on the Qt side.
 */
export type IconElement =
${['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon']
  .map((t) => `  | { t: '${t}'; fill?: boolean; [key: string]: unknown }`)
  .join('\n')};

export interface IconDefinition {
  grid: IconGridId;
  elements: readonly IconElement[];
}

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, 'name'> {
  className?: string;
  /** Rendered edge length in logical units. Omit it to size the icon with CSS utilities. */
  size?: number;
}

export interface NamedIconProps extends IconProps {
  name: IconName;
}

export interface IconSpecSummary {
  id: string;
  title: string;
  status: 'implemented' | 'planned' | 'deprecated';
  summary: string;
}

export interface IconRule {
  id: string;
  title: string;
  statement: string;
  enforcement: string;
}

export interface IconCategory {
  id: string;
  title: string;
  icons: string[];
}

/**
 * A set of icons that render together inside one control. Their grids are a promise about the
 * control rather than about any single icon: drawn at one size, a member on another grid is a
 * different weight from its neighbours.
 */
export interface IconFamily {
  id: string;
  title: string;
  note: string;
  icons: IconName[];
}

export interface IconAudit {
  grid: IconGridId;
  gridSize: number;
  strokeWidth: number;
  centerX: number;
  centerY: number;
  offsetX: number;
  offsetY: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  withinTolerance: boolean;
}

/** Identifier of the specification that produced this file (see spec/icons/registry.json). */
export const ICON_SPEC_ID = '${specId}';
export const ICON_SPEC_TITLE = ${JSON.stringify(spec.title)};
export const ICON_SPEC_SOURCE = ${JSON.stringify(source)};
export const ICON_METRICS = ${JSON.stringify(spec.metrics, null, 2)} as const;
export const ICON_GRIDS: Record<IconGridId, IconGrid> = ${JSON.stringify(grids, null, 2)};
export const ICON_SIZES = ${JSON.stringify(spec.sizes, null, 2)} as const;
export const ICON_WEIGHTS = ${JSON.stringify(spec.weights, null, 2)} as const;
export const ICON_COLOR = ${JSON.stringify(spec.color, null, 2)} as const;
export const ICON_RULES: IconRule[] = ${JSON.stringify(spec.rules, null, 2)};
export const ICON_CATEGORIES: IconCategory[] = ${JSON.stringify(categories, null, 2)};
export const ICON_FAMILIES: IconFamily[] = ${JSON.stringify(families, null, 2)};
export const ICON_SPECS: IconSpecSummary[] = ${JSON.stringify(specSummaries, null, 2)};
export const ICON_ADOPTION = ${JSON.stringify(adoption, null, 2)};
export const ICON_AUDIT: Record<string, IconAudit> = ${JSON.stringify(iconAudit, null, 2)};

export type IconName = keyof typeof ICON_ELEMENTS;

export const ICON_ELEMENTS = ${reactDefinitions} as const;

export const ICON_NAMES: IconName[] = Object.keys(ICON_ELEMENTS) as IconName[];

/** Legacy desktop names resolved onto their canonical registry icon. */
export const ICON_ALIASES: Record<string, IconName> = ${JSON.stringify(spec.aliases || {}, null, 2)};

export function resolveIconName(name: string | undefined | null): IconName | undefined {
  const key = String(name ?? '').trim().toLowerCase();
  if (key in ICON_ELEMENTS) return key as IconName;
  return ICON_ALIASES[key];
}

function renderElement(el: IconElement, index: number) {
  const key = \`el-\${index}\`;
  const fill = el.fill ? 'currentColor' : undefined;
  switch (el.t) {
    case 'path':
      return <path key={key} d={el.d as string} fill={fill} />;
    case 'circle':
      return <circle key={key} cx={el.cx as number} cy={el.cy as number} r={el.r as number} fill={fill} />;
    case 'ellipse':
      return (
        <ellipse key={key} cx={el.cx as number} cy={el.cy as number} rx={el.rx as number} ry={el.ry as number} fill={fill} />
      );
    case 'rect':
      return (
        <rect
          key={key}
          x={el.x as number}
          y={el.y as number}
          width={el.width as number}
          height={el.height as number}
          rx={(el.rx as number) ?? undefined}
          ry={(el.ry as number) ?? undefined}
          fill={fill}
        />
      );
    case 'line':
      return <line key={key} x1={el.x1 as number} y1={el.y1 as number} x2={el.x2 as number} y2={el.y2 as number} />;
    case 'polyline':
      return <polyline key={key} points={el.points as string} fill={fill} />;
    case 'polygon':
      return <polygon key={key} points={el.points as string} fill={fill} />;
    default:
      return null;
  }
}

/**
 * Specification-driven icon primitive. Geometry, grid and stroke width all come from the
 * active specification, so consumers choose a name and a size and nothing else.
 */
export const Icon = React.forwardRef<SVGSVGElement, NamedIconProps>(function Icon(
  { name, size, className, ...props },
  ref,
) {
  const definition = ICON_ELEMENTS[name] as IconDefinition | undefined;
  if (!definition) return null;
  const grid = ICON_GRIDS[definition.grid];

  return (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={\`0 0 \${grid.size} \${grid.size}\`}
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={grid.strokeWidth}
      strokeLinecap={grid.linecap}
      strokeLinejoin={grid.linejoin}
      className={cn(!size && 'size-4', className)}
      aria-hidden="true"
      {...props}
    >
      {definition.elements.map(renderElement)}
    </svg>
  );
});

function makeIcon(name: IconName, displayName: string) {
  const Component = React.forwardRef<SVGSVGElement, IconProps>(function GeneratedIcon(props, ref) {
    return <Icon ref={ref} name={name} {...props} />;
  });
  Component.displayName = displayName;
  return Component;
}

${reactExports}
`;

const reactOut = path.resolve(root, 'packages', 'react', 'src', 'lib', 'icons.generated.tsx');
emit(reactOut, reactCode);

/* ------------------------------------------------------------------ *
 * Qt artifact
 * ------------------------------------------------------------------ */

const qmlCode = `pragma Singleton
import QtQuick 6.10

${header('//')}
QtObject {
    id: root

    readonly property string specId: ${JSON.stringify(specId)}
    readonly property string specTitle: ${JSON.stringify(spec.title)}
    readonly property string specSource: ${JSON.stringify(source)}
    readonly property var metrics: ${JSON.stringify(spec.metrics)}
    readonly property var sizes: ${JSON.stringify(spec.sizes)}
    readonly property var weights: ${JSON.stringify(spec.weights)}
    readonly property var colorPolicy: ${JSON.stringify(spec.color)}
    readonly property var rules: ${JSON.stringify(spec.rules)}
    readonly property var categories: ${JSON.stringify(categories)}
    readonly property var families: ${JSON.stringify(families)}
    readonly property var specs: ${JSON.stringify(specSummaries)}
    readonly property var adoption: ${JSON.stringify(adoption)}
    readonly property var audit: (${JSON.stringify(iconAudit)})
    readonly property var grids: (${JSON.stringify(grids)})
    readonly property var aliases: (${JSON.stringify(spec.aliases || {})})
    readonly property var names: ${JSON.stringify(iconNames)}

    // name -> [{ grid, gridSize, strokeWidth, linecap, linejoin, d, fill }]
    readonly property var shapes: (${JSON.stringify(compiledShapes)})

    // Unknown names keep drawing the historic "unimplemented icon" marker instead of
    // vanishing, so a typo is visible in the UI rather than silently blank.
    readonly property var fallbackShapes: [
        { "grid": "default", "gridSize": 24, "strokeWidth": 2, "linecap": "round", "linejoin": "round", "d": "M6 6 H18 V18 H6 Z", "fill": false }
    ]

    function resolveIcon(name) {
        var key = String(name === undefined || name === null ? "" : name).trim().toLowerCase();
        if (root.shapes[key] !== undefined) return key;
        if (root.aliases[key] !== undefined) return root.aliases[key];
        return "";
    }

    function shapesFor(name) {
        var key = resolveIcon(name);
        return key === "" ? root.fallbackShapes : root.shapes[key];
    }
}
`;

const qtOut = path.resolve(root, 'qt', 'src', 'ChaSetIcons.generated.qml');
emit(qtOut, qmlCode);

if (checkOnly) {
  if (drift.length > 0) {
    console.error('[gen:icons] generated artifacts are out of sync with spec/icons/registry.json:');
    for (const file of drift) console.error(`  - ${file}`);
    console.error('[gen:icons] run "pnpm gen:icons" to regenerate.');
    process.exit(1);
  }
  console.log(`[gen:icons] OK — generated artifacts match spec "${specId}" (${iconNames.length} icons)`);
} else {
  console.log(
    `[gen:icons] spec "${specId}" (${iconNames.length} icons, ${Object.keys(spec.grids).length} grid(s)) -> ` +
      `icons.generated.tsx, ChaSetIcons.generated.qml`,
  );
}
