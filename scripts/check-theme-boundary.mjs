#!/usr/bin/env node
// ChaSet theme-control boundary gate.
//
// The whole point of a "shared theme control" is that it manages SOME axes and
// leaves others alone. That boundary is only real if it is checkable. This script
// turns spec/theme-controls.json into assertions over spec/schemas/theme-config.schema.json
// and the token axes, so a future edit that quietly widens the control's reach
// (or forgets to widen it after a deliberate decision) fails `pnpm gate`.
//
// Checks:
//   B1  every covered axis in theme-controls.json has a matching schema property
//   B2  no hostOnly field name appears anywhere in the schema (recursively)
//   B3  no duntingUnique field name appears anywhere in the schema
//   B4  schema property set == covered axis set (no undocumented extra reach)
//   B5  the palette enum is byte-identical in theme-controls.json and the schema
//   B6  the palette enum in the schema matches themes.axes.accentTheme (the token axis)
//   B7  theme-controls.json is well-formed and carries the required sections
//
// Self-test: --self-test injects a hostOnly field into an in-memory copy of the
// schema and asserts B2 catches it. Without this, a typo that makes B2 vacuous
// would go unnoticed forever.

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function verifyThemeBoundary({ quiet = false, schemaOverride = null, controlsOverride = null } = {}) {
  const errors = [];

  const controlsPath = resolve(root, 'spec', 'theme-controls.json');
  const schemaPath = resolve(root, 'spec', 'schemas', 'theme-config.schema.json');
  const axesPath = resolve(root, 'spec', 'tokens', 'themes', 'axes.json');

  if (!existsSync(controlsPath)) return { ok: false, checkedCount: 0, errors: ['spec/theme-controls.json is missing'] };
  if (!existsSync(schemaPath)) return { ok: false, checkedCount: 0, errors: ['spec/schemas/theme-config.schema.json is missing'] };

  const controls = controlsOverride ?? JSON.parse(readFileSync(controlsPath, 'utf8'));
  const schema = schemaOverride ?? JSON.parse(readFileSync(schemaPath, 'utf8'));
  const axes = existsSync(axesPath) ? JSON.parse(readFileSync(axesPath, 'utf8')) : null;

  const fail = (msg) => errors.push(msg);

  // --- B7: structural sanity of the boundary declaration -------------------
  // (B7 runs first so the later checks can trust the file's shape.)
  for (const section of ['principles', 'canonical', 'axes', 'hostOnly', 'derivedContract']) {
    if (!(section in controls)) fail(`theme-controls.json: missing required section "${section}"`);
  }
  if (!Array.isArray(controls.hostOnly?.items) || controls.hostOnly.items.length === 0) {
    fail('theme-controls.json: hostOnly.items must be a non-empty array — a boundary with no excluded axes is not a boundary');
  }
  const hostOnlyItems = Array.isArray(controls.hostOnly?.items) ? controls.hostOnly.items : [];
  const duntingItems = Array.isArray(controls.duntingUnique?.items) ? controls.duntingUnique.items : [];

  // --- Collect the schema's real property names ----------------------------
  // `version` is schema envelope metadata (it identifies the payload shape), not a
  // user-facing theme axis. It is declared below rather than as a covered axis so
  // that B4's "schema ⊆ declared axes" check stays meaningful.
  const ENVELOPE_KEYS = new Set(['version']);
  const schemaProps = new Set(Object.keys(schema.properties ?? {}).filter((k) => !ENVELOPE_KEYS.has(k)));
  const coveredProps = new Set(Object.entries(controls.axes ?? {}).filter(([, v]) => v?.covered === true).map(([k]) => k));

  // --- B1: every covered axis is representable ------------------------------
  for (const axis of coveredProps) {
    if (!schemaProps.has(axis)) fail(`B1: theme-controls.json marks axis "${axis}" covered, but theme-config.schema.json has no such property`);
  }

  // --- B4: no undeclared reach ---------------------------------------------
  for (const prop of schemaProps) {
    if (!coveredProps.has(prop)) fail(`B4: theme-config.schema.json declares "${prop}", but theme-controls.json does not mark it covered (boundary is wider than declared)`);
  }

  // --- B2/B3: hostOnly and duntingUnique names must not leak into the schema --
  // Scan the schema text (not just properties) so a leaked name buried in a
  // description, default, or nested enum still trips the gate.
  const schemaText = JSON.stringify(schema);

  // A property key only counts as a leak if it is used as a KEY in the schema
  // (": \"name\":"). Prose mentions inside descriptions are how we document WHY a
  // field is excluded, so they must not trip the gate.
  const keyPattern = (name) => new RegExp(`"${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"\\s*:`);

  const allExcluded = [
    ...hostOnlyItems.map((i) => ({ ...i, bucket: 'hostOnly' })),
    ...duntingItems.map((i) => ({ ...i, bucket: 'duntingUnique' })),
  ];

  for (const item of allExcluded) {
    const id = item.id ?? '';
    // Check the declared id, the label, and the host field name. Host field names
    // are frequently the exact schema key an over-reach would introduce.
    const candidates = [id, item.configField].filter((x) => typeof x === 'string' && x.length > 0);
    for (const candidate of candidates) {
      if (keyPattern(candidate).test(schemaText)) {
        fail(`B${item.bucket === 'hostOnly' ? 2 : 3}: schema contains a key "${candidate}" for ${item.bucket} item "${id}" — ChaSet must not manage this axis`);
      }
    }
  }

  // Also catch non-ASCII labels used as keys (e.g. a Chinese field name lifted verbatim).
  for (const item of allExcluded) {
    if (typeof item.label === 'string' && /[^\x00-\x7F]/.test(item.label) && keyPattern(item.label).test(schemaText)) {
      fail(`B${item.bucket === 'hostOnly' ? 2 : 3}: schema contains the localised host key "${item.label}" for ${item.bucket} item "${item.id}"`);
    }
  }

  // --- B5: palette enum agreement between declaration and schema -----------
  const declaredPalette = controls.axes?.palette?.values;
  const schemaPalette = schema.properties?.palette?.properties?.id?.enum;
  if (!Array.isArray(declaredPalette) || !Array.isArray(schemaPalette)) {
    fail('B5: could not read a palette enum from both theme-controls.json and the schema');
  } else if (JSON.stringify(declaredPalette) !== JSON.stringify(schemaPalette)) {
    fail(`B5: palette enum drift — theme-controls.json=[${declaredPalette.join(',')}] schema=[${schemaPalette.join(',')}]`);
  }

  // --- B6: palette enum agreement with the token axis ---------------------
  const axisPalette = axes?.themes?.axes?.accentTheme;
  if (!Array.isArray(axisPalette)) {
    fail('B6: spec/tokens/themes/axes.json themes.axes.accentTheme is missing or not an array');
  } else if (Array.isArray(declaredPalette) && JSON.stringify(axisPalette) !== JSON.stringify(declaredPalette)) {
    fail(`B6: themes.axes.accentTheme=[${axisPalette.join(',')}] does not match the declared palette=[${declaredPalette.join(',')}]`);
  }

  const checkedCount = coveredProps.size + allExcluded.length + 2;
  if (!quiet && errors.length === 0) {
    console.log(`[theme-boundary] OK — ${coveredProps.size} covered axes, ${allExcluded.length} excluded axes (${hostOnlyItems.length} hostOnly + ${duntingItems.length} duntingUnique), palette of ${declaredPalette?.length ?? 0} ids verified`);
  }
  return { ok: errors.length === 0, checkedCount, errors };
}

// --- self-test: prove the hostOnly guard actually fires --------------------
export function selfTest() {
  const schemaPath = resolve(root, 'spec', 'schemas', 'theme-config.schema.json');
  const controlsPath = resolve(root, 'spec', 'theme-controls.json');
  const schema = JSON.parse(readFileSync(schemaPath, 'utf8'));
  const controls = JSON.parse(readFileSync(controlsPath, 'utf8'));

  // Inject a leak: add windowMaterial (a hostOnly axis) as a schema property.
  const poisoned = JSON.parse(JSON.stringify(schema));
  poisoned.properties.windowMaterial = { type: 'string' };
  const leaked = verifyThemeBoundary({ quiet: true, schemaOverride: poisoned, controlsOverride: controls });
  const caughtLeak = !leaked.ok && leaked.errors.some((e) => e.startsWith('B2') && e.includes('windowMaterial'));

  // Inject the reverse: drop a covered axis from the schema.
  const holey = JSON.parse(JSON.stringify(schema));
  delete holey.properties.typography;
  const holed = verifyThemeBoundary({ quiet: true, schemaOverride: holey, controlsOverride: controls });
  const caughtHole = !holed.ok && holed.errors.some((e) => e.startsWith('B1') && e.includes('typography'));

  // Inject palette drift.
  const drifted = JSON.parse(JSON.stringify(schema));
  drifted.properties.palette.properties.id.enum = ['slate'];
  const drift = verifyThemeBoundary({ quiet: true, schemaOverride: drifted, controlsOverride: controls });
  const caughtDrift = !drift.ok && drift.errors.some((e) => e.startsWith('B5'));

  const results = [
    ['B2 catches an injected hostOnly field (windowMaterial)', caughtLeak],
    ['B1 catches a covered axis missing from the schema (typography)', caughtHole],
    ['B5 catches palette enum drift', caughtDrift],
  ];

  let ok = true;
  for (const [name, passed] of results) {
    if (!passed) ok = false;
    console.log(`[theme-boundary] self-test ${passed ? 'PASS' : 'FAIL'} — ${name}`);
  }
  // And the real files must still be clean.
  const live = verifyThemeBoundary({ quiet: true });
  if (!live.ok) {
    ok = false;
    console.log('[theme-boundary] self-test FAIL — the real spec files fail the boundary gate:');
    for (const e of live.errors) console.log(`  - ${e}`);
  } else {
    console.log('[theme-boundary] self-test PASS — real spec files satisfy the boundary gate');
  }
  return { ok, results, live };
}

// --- CLI -------------------------------------------------------------------
const isMain = process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
  if (process.argv.includes('--self-test')) {
    const { ok, live } = selfTest();
    if (!live.ok) for (const e of live.errors) console.error(`  - ${e}`);
    process.exit(ok ? 0 : 1);
  }
  const res = verifyThemeBoundary({});
  if (!res.ok) {
    console.error(`[theme-boundary] FAIL — ${res.errors.length} boundary violation(s):`);
    for (const e of res.errors) console.error(`  - ${e}`);
    process.exit(1);
  }
}
