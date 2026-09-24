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
//   ratchet       the count of hand-authored inline <svg> sites grew, or an exemption
//                 marker was misused (no reason, dangling, or not attached to an <svg>)
//   resolution    a component references an icon by name that the active specification does
//                 not own
//   unowned       (warning) references render icon components the specification does not own
//   sibling-grids one file renders icons at one size from more than one grid
//   families      a declared control family names unknown icons or spans more than one grid
//   grid-render   a grid declares a render size that is not a ramp step, or is below the size
//                 at which its own stroke is a full pixel
//   stroke-floor  (warning) a reference renders below the size at which its grid's stroke is
//                 still one pixel
//
// See docs/architecture/icon-system.md.

import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

import { elementsBBox, gridStrokeAt, gridStrokeFloor } from '../spec/icons/geometry.mjs';
import { resolveActiveSpec, repoRoot, CONFIG_FILE, ENV_VAR } from '../spec/icons/load.mjs';
import {
  scanInlineSvgSites,
  scanTextGlyphSites,
  scanIconUsages,
  EXEMPTION_MARKER,
} from '../spec/icons/adoption.mjs';

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
  //    Sites excused as non-iconography are excluded from the budget, but only when their
  //    marker is well formed — so an exemption is a documented decision, not a silence.
  const { sites: inlineSites, exemptionProblems } = scanInlineSvgSites(root);
  const inlineTotal = inlineSites.reduce((sum, s) => sum + s.count, 0);
  const exemptedTotal = inlineSites.reduce((sum, s) => sum + s.exempted, 0);
  const budget = registry.adoption?.maxInlineSvgSites ?? 0;

  checkedCount += 1;
  for (const problem of exemptionProblems) {
    errors.push(
      `[ratchet] ${problem.file}:${problem.line} has an unusable exemption marker — ${problem.problem}. ` +
        `The marker is "${EXEMPTION_MARKER} <reason>" and must sit directly above the <svg> it excuses.`,
    );
  }
  checkedCount += exemptedTotal;

  if (inlineTotal > budget) {
    errors.push(
      `[ratchet] hand-authored inline <svg> sites grew to ${inlineTotal} (budget ${budget}). ` +
        `Render a registry icon through <Icon name="..."/> instead of drawing new artwork. ` +
        `Current sites: ${inlineSites.map((s) => `${s.file}(${s.count})`).join(', ')}`,
    );
  } else if (inlineTotal > 0) {
    warnings.push(
      `[ratchet] ${inlineTotal} hand-authored inline <svg> site(s) remain in the frozen migration backlog ` +
        `(budget ${budget}): ${inlineSites
          .filter((s) => s.count > 0)
          .map((s) => `${s.file} (${s.count})`)
          .join(', ')}`,
    );
  }
  if (exemptedTotal > 0) {
    warnings.push(
      `[ratchet] ${exemptedTotal} site(s) are excused as non-iconography: ${inlineSites
        .filter((s) => s.exempted > 0)
        .map((s) => `${s.file} (${s.exempted}: ${s.reasons.map((r) => r.reason).join('; ')})`)
        .join(', ')}`,
    );
  }

  // 6. Every reference resolves, and every reference that names its own render size is checked
  //    against the grid it asks for.
  //
  //    The two reference shapes fail differently on purpose. `<Icon name="...">` and a QML
  //    `name:` ask the registry by name, so an unknown name is a broken call site and fails the
  //    gate. A named export is resolved by the bundler and may be anything — a locally
  //    hand-authored icon set, a brand mark — so unresolvable ones are counted as a backlog
  //    instead of reported as one failure each. Before this scan learned about named exports it
  //    saw 40 of the repository's 155 references and none of the 116 that use the export form.
  const usages = scanIconUsages(root, {
    iconNames: Object.keys(spec.icons),
    aliases: spec.aliases,
    defaultSize: spec.sizes.default ?? null,
  });

  const foreignReferences = new Map();
  for (const usage of usages) {
    checkedCount += 1;
    if (usage.known) continue;
    if (usage.reference === 'name') {
      errors.push(
        `[resolution] ${usage.file}:${usage.line} references icon "${usage.written}" by name, which specification ` +
          `"${specId}" does not define (add it to spec/icons/registry.json or use an existing name)`,
      );
      continue;
    }
    if (!foreignReferences.has(usage.written)) foreignReferences.set(usage.written, []);
    foreignReferences.get(usage.written).push(`${usage.file}:${usage.line}`);
  }
  if (foreignReferences.size > 0) {
    const total = [...foreignReferences.values()].reduce((sum, file) => sum + file.length, 0);
    warnings.push(
      `[unowned] ${total} reference(s) render icon components the specification does not own, across ` +
        `${foreignReferences.size} name(s): ` +
        [...foreignReferences]
          .map(([written, sites]) => `${written} (${sites.length}: ${sites[0]}${sites.length > 1 ? ', …' : ''})`)
          .join(', ') +
        '. These are locally authored artwork — the migration backlog the inline-svg ratchet also ' +
        'counts — or components that are not icons at all. The gate cannot tell them apart; a ' +
        'migration removes one from this list.',
    );
  }

  // 7. Sibling grids. Icons rendered at one size inside one file sit in one visual context, so
  //    they have to come from one grid. This is the rule the caption close button broke: it
  //    rendered the generic 24 unit `x` at 10px beside two chrome-grid glyphs, and because `x`
  //    covers half its grid while the caption glyphs cover nine tenths of theirs, the close
  //    shipped at a third the size of the buttons next to it. Nothing else in the specification
  //    could see it: every icon involved was individually valid.
  const siblingGroups = new Map();
  for (const usage of usages) {
    if (!usage.known || usage.sizes.length === 0) continue;
    const gridId = spec.icons[usage.name].grid;
    for (const size of usage.sizes) {
      const key = `${usage.file}\u0000${size}`;
      if (!siblingGroups.has(key)) siblingGroups.set(key, new Map());
      const group = siblingGroups.get(key);
      if (!group.has(gridId)) group.set(gridId, []);
      group.get(gridId).push(`${usage.written}@${usage.line}`);
    }
  }
  checkedCount += siblingGroups.size;
  for (const [key, group] of siblingGroups) {
    if (group.size < 2) continue;
    const [file, size] = key.split('\u0000');
    errors.push(
      `[sibling-grids] ${file} renders icons at ${size}px from ${group.size} different grids: ` +
        `${[...group].map(([gridId, sites]) => `${gridId} (${sites.join(', ')})`).join(' and ')}. ` +
        `Icons drawn at one size in one component are read as one weight, and two grids at one size ` +
        `means one of them is lighter than the other. Use one grid per size, or give the outlier its own size.`,
    );
  }

  // 8. Control families. A family names the icons that render together inside one control, so
  //    their grids are a promise about the control rather than about any single icon. Unlike the
  //    sibling scan it needs no source parsing: it is a property of the registry, which means it
  //    also protects icons whose call sites have not been written yet.
  for (const family of spec.families ?? []) {
    checkedCount += 1;
    const members = family.icons ?? [];
    if (members.length < 2) {
      errors.push(
        `[families] family "${family.id}" has ${members.length} member(s); a family exists to constrain ` +
          `icons that render together, so it needs at least two`,
      );
    }
    const missing = members.filter((name) => !spec.icons[name]);
    if (missing.length > 0) {
      errors.push(
        `[families] family "${family.id}" names icon(s) specification "${specId}" does not define: ${missing.join(', ')}`,
      );
    }
    const grids = new Set(members.filter((name) => spec.icons[name]).map((name) => spec.icons[name].grid));
    if (grids.size > 1) {
      errors.push(
        `[families] family "${family.id}" spans ${grids.size} grids (${[...grids].sort().join(', ')}): ` +
          `${members.join(', ')}. These render in one control, so a member on another grid is a different ` +
          `weight from the rest.`,
      );
    }
  }

  // 9. Grid render size. A grid is a shape *and* the size that shape is meant to be read at, and
  //    the registry states the second half. Three things then have to agree, none of them visible
  //    by looking at the artwork: the size exists, it is a step the interface actually renders
  //    at, and it is not below the size at which the grid's own stroke is a full pixel — a grid
  //    designed to be blurry at its own target size is a contradiction.
  const ramp = spec.sizes?.ramp ?? [];
  for (const [id, grid] of Object.entries(spec.grids)) {
    checkedCount += 1;
    const renderSize = grid.renderSize;
    if (!Number.isFinite(renderSize) || renderSize <= 0) {
      errors.push(
        `[grid-render] grid "${id}" does not declare a positive renderSize. Without the size its artwork ` +
          `was drawn for, "is this glyph rendered too small" has no answer in the registry.`,
      );
      continue;
    }
    const floor = gridStrokeFloor(grid);
    if (renderSize < floor) {
      errors.push(
        `[grid-render] grid "${id}" declares renderSize ${renderSize} but its stroke only reaches a full ` +
          `pixel at ${floor}px, so the grid would be sub-pixel at the size it was drawn for.`,
      );
    }
    if (ramp.length > 0 && !ramp.includes(renderSize)) {
      errors.push(
        `[grid-render] grid "${id}" declares renderSize ${renderSize}, which is not a step of the size ramp ` +
          `(${ramp.join(', ')}). A grid drawn for a size the interface never renders at is a target nobody ` +
          `can hit.`,
      );
    }
  }

  // 10. Stroke floor ledger. Below `grid.size / grid.strokeWidth` a grid's stroke is sub-pixel, so
  //     it antialiases into a fainter line — tolerable on a 2x display, visibly weak on a 1x one.
  //     That makes it a judgement rather than a violation, so the sites are listed and each one is
  //     decided deliberately: keep the coarse glyph where its artwork suits the size, declare a
  //     denser grid, or accept the lighter stroke on purpose. Each entry prints the stroke it
  //     actually paints, so the reader is not asked to divide one number by another to see how
  //     far off it is, and the render size declared above says what the grid is meant to weigh.
  const floors = Object.fromEntries(
    Object.entries(spec.grids).map(([id, grid]) => [id, gridStrokeFloor(grid)]),
  );
  const belowFloor = [];
  let unknownSize = 0;
  for (const usage of usages) {
    if (!usage.known) continue;
    if (usage.sizes.length === 0) {
      unknownSize += 1;
      continue;
    }
    const gridId = spec.icons[usage.name].grid;
    const smallest = Math.min(...usage.sizes);
    if (smallest < floors[gridId]) {
      belowFloor.push({
        usage,
        gridId,
        smallest,
        floor: floors[gridId],
        painted: gridStrokeAt(spec.grids[gridId], smallest),
      });
    }
  }
  checkedCount += 1;
  if (belowFloor.length > 0) {
    warnings.push(
      `[stroke-floor] ${belowFloor.length} reference(s) render below the size at which their grid still ` +
        `paints a full pixel of stroke — ${Object.entries(floors)
          .map(([id, px]) => `${id} ${px}px, drawn for ${spec.grids[id].renderSize}px`)
          .join('; ')}: ` +
        belowFloor
          .map(
            ({ usage, gridId, smallest, floor, painted }) =>
              `${usage.file}:${usage.line} ${usage.written} ${gridId} ${smallest}px < ${floor}px ` +
              `(paints ${Math.round(painted * 100) / 100}px)`,
          )
          .join('; '),
    );
  }
  if (unknownSize > 0) {
    warnings.push(
      `[stroke-floor] ${unknownSize} reference(s) compute their render size at run time, so the floor ` +
        `cannot be checked for them. The sizes seen in source are: ` +
        `${[...new Set(usages.filter((u) => u.sizes.length > 0).map((u) => u.sizeSource))].slice(0, 12).join(', ')}`,
    );
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
