// scripts/check-icon-spec.mjs
//
// Icon specification conformance gate.
//
// Every rule published on the Icon System showcase page has an assertion here. A rule
// that is not machine-checked is a slogan, so the gate refuses to pass when:
//
//   registry      the registry is structurally invalid, or the configured specification
//                 does not exist / is not implemented
//   generated     icons.generated.tsx / ChaSetIcons.generated.qml drifted from the registry
//   optical       an icon's painted bounding box is not centred on its grid
//   live-area     artwork escapes the grid's safe margin
//   text-glyphs   a character is used where an icon belongs
//   ratchet       the count of hand-authored inline <svg> sites grew
//   resolution    a component references an icon name the active specification does not own
//
// See docs/architecture/icon-system.md.

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

import { elementsBBox } from '../spec/icons/geometry.mjs';
import { resolveActiveSpec, repoRoot, CONFIG_FILE, ENV_VAR } from '../spec/icons/load.mjs';
import { scanInlineSvgSites, scanTextGlyphSites, scanIconUsages } from '../spec/icons/adoption.mjs';

/**
 * Painted artwork may sit this far off the grid centre (grid units). The active
 * specification may tighten it through `metrics.opticalCenterTolerance`.
 */
export const DEFAULT_OPTICAL_CENTER_TOLERANCE = 0.75;

const EPSILON = 0.001;

export function verifyIconSpec({ quiet = false, root = repoRoot() } = {}) {
  const errors = [];
  const warnings = [];
  let checkedCount = 0;

  // 1. Active specification resolution (external configuration chain).
  let spec;
  let specId;
  let source;
  let registry;
  try {
    ({ spec, specId, source, registry } = resolveActiveSpec(root));
  } catch (err) {
    errors.push(`[registry] ${err.message}`);
    if (!quiet) report(errors, warnings, 0);
    return { ok: false, errors, warnings, checkedCount: 0 };
  }

  // 2. Generated artifacts must match the registry byte for byte.
  const generator = resolve(root, 'spec/generators/generate-icons.mjs');
  const gen = spawnSync(process.execPath, [generator, '--check'], { encoding: 'utf8' });
  if (gen.status !== 0) {
    const detail = `${gen.stdout}${gen.stderr}`
      .split(/\r?\n/)
      .filter((l) => l.trim() && !l.startsWith('[gen:icons] OK'))
      .join(' ')
      .trim();
    errors.push(`[generated] ${detail || 'icon artifacts are out of sync with the registry'}`);
  }
  checkedCount += 1;

  // 3. Per-icon geometry: optical centring and live area.
  const tolerance = spec.metrics?.opticalCenterTolerance ?? DEFAULT_OPTICAL_CENTER_TOLERANCE;
  for (const [name, def] of Object.entries(spec.icons)) {
    const grid = spec.grids[def.grid];
    // Optical centring is judged on the *painted* extent, because half the stroke paints
    // outside the artwork coordinates and it is the painted ink that has to look centred.
    const painted = elementsBBox(def.elements, grid.strokeWidth);
    // The live area is judged on the artwork coordinates themselves.
    const artwork = elementsBBox(def.elements, 0);
    if (!painted || !artwork) {
      errors.push(`[optical] icon "${name}" has no measurable geometry`);
      continue;
    }
    checkedCount += 1;

    const gridCenter = grid.size / 2;
    const iconCenterX = (painted.minX + painted.maxX) / 2;
    const iconCenterY = (painted.minY + painted.maxY) / 2;
    const dx = Math.abs(iconCenterX - gridCenter);
    const dy = Math.abs(iconCenterY - gridCenter);
    if (dx > tolerance || dy > tolerance) {
      errors.push(
        `[optical] icon "${name}" is off-centre on the ${def.grid} grid: ` +
          `centre (${iconCenterX.toFixed(2)}, ${iconCenterY.toFixed(2)}) vs grid (${gridCenter}, ${gridCenter}) ` +
          `— dx ${dx.toFixed(2)}, dy ${dy.toFixed(2)} exceed ${tolerance}. ` +
          `Fix the artwork coordinates; never compensate with anchors or padding.`,
      );
    }

    const margin = grid.safeMargin ?? 1;
    if (
      artwork.minX < margin - EPSILON ||
      artwork.minY < margin - EPSILON ||
      artwork.maxX > grid.size - margin + EPSILON ||
      artwork.maxY > grid.size - margin + EPSILON
    ) {
      errors.push(
        `[live-area] icon "${name}" artwork spans (${artwork.minX.toFixed(2)}, ${artwork.minY.toFixed(2)})-(${artwork.maxX.toFixed(2)}, ${artwork.maxY.toFixed(2)}), ` +
          `outside the ${def.grid} grid safe area [${margin}, ${grid.size - margin}]`,
      );
    }

    // A stroke may use the safe margin, but it must never bleed past the grid itself:
    // the glyph would then collide with a neighbouring icon or clip inside a clipped parent.
    if (painted.minX < -EPSILON || painted.minY < -EPSILON || painted.maxX > grid.size + EPSILON || painted.maxY > grid.size + EPSILON) {
      errors.push(
        `[live-area] icon "${name}" stroke bleeds past the ${def.grid} grid: painted extent ` +
          `(${painted.minX.toFixed(2)}, ${painted.minY.toFixed(2)})-(${painted.maxX.toFixed(2)}, ${painted.maxY.toFixed(2)}) exceeds [0, ${grid.size}]`,
      );
    }
  }

  // 4. Text glyphs must never stand in for an icon.
  const glyphSites = scanTextGlyphSites(root);
  checkedCount += 1;
  if (glyphSites.length > 0) {
    for (const site of glyphSites) {
      errors.push(
        `[text-glyphs] ${site.file}:${site.line} uses "${site.glyph}" (${site.codePoint}) as an icon — ${site.snippet}`,
      );
    }
  }

  // 5. Adoption ratchet: hand-authored inline <svg> artwork may shrink, never grow.
  const inlineSites = scanInlineSvgSites(root);
  const inlineTotal = inlineSites.reduce((sum, s) => sum + s.count, 0);
  const budget = registry.adoption?.maxInlineSvgSites ?? 0;
  checkedCount += 1;
  if (inlineTotal > budget) {
    errors.push(
      `[ratchet] hand-authored inline <svg> sites grew to ${inlineTotal} (budget ${budget}). ` +
        `Render a registry icon through <Icon name="..."/> instead of drawing new artwork. ` +
        `Current sites: ${inlineSites.map((s) => `${s.file}(${s.count})`).join(', ')}`,
    );
  } else if (inlineTotal > 0) {
    warnings.push(
      `[ratchet] ${inlineTotal} hand-authored inline <svg> site(s) remain in the frozen migration backlog ` +
        `(budget ${budget}): ${inlineSites.map((s) => `${s.file} (${s.count})`).join(', ')}`,
    );
  }

  // 6. Every referenced icon name must resolve in the active specification.
  const knownNames = new Set([...Object.keys(spec.icons), ...Object.keys(spec.aliases || {})]);
  for (const usage of scanIconUsages(root)) {
    checkedCount += 1;
    const key = usage.name.trim().toLowerCase();
    if (!knownNames.has(key)) {
      errors.push(
        `[resolution] ${usage.file}:${usage.line} references icon "${usage.name}" which specification ` +
          `"${specId}" does not define (add it to spec/icons/registry.json or use an existing name)`,
      );
    }
  }

  if (!quiet) report(errors, warnings, checkedCount, { specId, source, config: resolve(root, CONFIG_FILE) });
  return { ok: errors.length === 0, errors, warnings, checkedCount };
}

function report(errors, warnings, checkedCount, context = {}) {
  for (const warn of warnings) console.warn(`[check-icon-spec] WARN ${warn}`);
  if (errors.length === 0) {
    const where = context.specId ? ` — active specification "${context.specId}" via ${context.source}` : '';
    console.log(`[check-icon-spec] OK — ${checkedCount} icon specification assertion(s) verified${where}`);
    return;
  }
  console.error(`[check-icon-spec] FAIL — ${errors.length} violation(s) of the icon specification:`);
  for (const err of errors) console.error(`  - ${err}`);
  console.error(
    `[check-icon-spec] Specifications are declared in spec/icons/registry.json; the external switch is ` +
      `"${ENV_VAR}" (environment) or ${CONFIG_FILE} (icons.spec).`,
  );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { ok } = verifyIconSpec({ quiet: false });
  process.exit(ok ? 0 : 1);
}
