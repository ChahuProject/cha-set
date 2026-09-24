// spec/icons/load.mjs
//
// Registry loading + external configuration resolution + structural validation.
//
// The active icon specification is resolved through an explicit precedence chain so a
// host project can pin the whole of ChaSet to one specification without editing any
// library file:
//
//   1. environment variable  CHASET_ICON_SPEC=<spec-id>
//   2. project config file   <repo>/chaset.config.json  ->  { "icons": { "spec": "<spec-id>" } }
//   3. registry default      spec/icons/registry.json   ->  "activeSpec"
//   4. first implemented specification in the registry
//
// The resolved id is baked into every generated artifact, which is what makes the choice
// observable at runtime (`ICON_SPEC_ID` on the web, `ChaSetIcons.specId` on the desktop).

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ENV_VAR = 'CHASET_ICON_SPEC';
export const CONFIG_FILE = 'chaset.config.json';
export const REGISTRY_PATH = 'spec/icons/registry.json';

export const ELEMENT_TYPES = ['path', 'circle', 'ellipse', 'rect', 'line', 'polyline', 'polygon'];
export const SPEC_STATUSES = ['implemented', 'planned', 'deprecated'];

export function repoRoot() {
  return resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');
}

export function loadRegistry(root = repoRoot()) {
  return JSON.parse(readFileSync(resolve(root, REGISTRY_PATH), 'utf8'));
}

/** Read `icons.spec` out of the external configuration file, if present. */
export function readExternalConfig(root = repoRoot()) {
  const path = resolve(root, CONFIG_FILE);
  if (!existsSync(path)) return { path, spec: null, present: false };
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, 'utf8'));
  } catch (err) {
    throw new Error(`${CONFIG_FILE} is not valid JSON: ${err.message}`);
  }
  const spec = parsed?.icons?.spec ?? null;
  if (spec !== null && typeof spec !== 'string') {
    throw new Error(`${CONFIG_FILE}: "icons.spec" must be a string (got ${typeof spec})`);
  }
  return { path, spec, present: true };
}

/**
 * Resolve the active specification. Throws a descriptive error when the requested id is
 * unknown or not implemented, because failing loudly is the entire point of the switch.
 */
export function resolveActiveSpec(root = repoRoot(), env = process.env) {
  const registry = loadRegistry(root);
  const config = readExternalConfig(root);

  const fromEnv = env[ENV_VAR] ? String(env[ENV_VAR]).trim() : null;
  const fromConfig = config.spec;
  const fromRegistry = registry.activeSpec ?? null;
  const firstImplemented = (registry.specs || []).find((s) => s.status === 'implemented')?.id ?? null;

  let specId = null;
  let source = null;
  if (fromEnv) {
    specId = fromEnv;
    source = `environment variable ${ENV_VAR}`;
  } else if (fromConfig) {
    specId = fromConfig;
    source = `${CONFIG_FILE} (icons.spec)`;
  } else if (fromRegistry) {
    specId = fromRegistry;
    source = `${REGISTRY_PATH} (activeSpec)`;
  } else if (firstImplemented) {
    specId = firstImplemented;
    source = 'first implemented specification';
  } else {
    throw new Error(`no icon specification available: ${REGISTRY_PATH} declares none`);
  }

  const spec = (registry.specs || []).find((s) => s.id === specId);
  if (!spec) {
    const known = (registry.specs || []).map((s) => `${s.id} (${s.status})`).join(', ');
    throw new Error(
      `unknown icon specification "${specId}" requested by ${source}. Registered specifications: ${known}.`,
    );
  }
  if (spec.status !== 'implemented') {
    throw new Error(
      `icon specification "${specId}" (requested by ${source}) has status "${spec.status}" and carries no geometry. ` +
        `Implement it in ${REGISTRY_PATH} or point the configuration at an implemented specification.`,
    );
  }

  return { registry, spec, specId, source, config };
}

/** Structural validation. Returns a list of human readable errors (empty when valid). */
export function validateRegistry(registry) {
  const errors = [];
  const fail = (msg) => errors.push(msg);

  if (typeof registry?.version !== 'number') fail('registry.version must be a number');
  if (!Array.isArray(registry?.specs) || registry.specs.length === 0) {
    fail('registry.specs must be a non-empty array');
    return errors;
  }

  const specIds = new Set();
  for (const spec of registry.specs) {
    if (!spec.id) fail('every specification needs an id');
    if (specIds.has(spec.id)) fail(`duplicate specification id "${spec.id}"`);
    specIds.add(spec.id);
    if (!SPEC_STATUSES.includes(spec.status)) {
      fail(`specification "${spec.id}": status must be one of ${SPEC_STATUSES.join(', ')}`);
    }
    if (!spec.title) fail(`specification "${spec.id}": title is required`);
    if (!spec.summary) fail(`specification "${spec.id}": summary is required`);

    const grids = spec.grids || {};
    for (const [gridId, grid] of Object.entries(grids)) {
      for (const key of ['size', 'strokeWidth', 'safeMargin']) {
        if (typeof grid[key] !== 'number' || !Number.isFinite(grid[key])) {
          fail(`specification "${spec.id}" grid "${gridId}": ${key} must be a finite number`);
        }
      }
      if (grid.size <= 0) fail(`specification "${spec.id}" grid "${gridId}": size must be positive`);
      if (grid.strokeWidth <= 0) fail(`specification "${spec.id}" grid "${gridId}": strokeWidth must be positive`);
    }

    const icons = spec.icons || {};
    for (const [name, def] of Object.entries(icons)) {
      if (!grids[def.grid]) {
        fail(`icon "${name}": unknown grid "${def.grid}" (declared grids: ${Object.keys(grids).join(', ') || 'none'})`);
      }
      if (!Array.isArray(def.elements) || def.elements.length === 0) {
        fail(`icon "${name}": elements must be a non-empty array`);
        continue;
      }
      def.elements.forEach((el, index) => {
        if (!ELEMENT_TYPES.includes(el.t)) {
          fail(`icon "${name}" element ${index}: unsupported type "${el.t}"`);
          return;
        }
        if (el.t === 'path' && typeof el.d !== 'string') fail(`icon "${name}" element ${index}: path requires "d"`);
        if ((el.t === 'polyline' || el.t === 'polygon') && typeof el.points !== 'string') {
          fail(`icon "${name}" element ${index}: ${el.t} requires "points"`);
        }
        if (el.t === 'circle' && ['cx', 'cy', 'r'].some((k) => typeof el[k] !== 'number')) {
          fail(`icon "${name}" element ${index}: circle requires cx, cy and r`);
        }
        if (el.t === 'rect' && ['x', 'y', 'width', 'height'].some((k) => typeof el[k] !== 'number')) {
          fail(`icon "${name}" element ${index}: rect requires x, y, width and height`);
        }
        if (el.t === 'line' && ['x1', 'y1', 'x2', 'y2'].some((k) => typeof el[k] !== 'number')) {
          fail(`icon "${name}" element ${index}: line requires x1, y1, x2 and y2`);
        }
      });
    }

    for (const [alias, target] of Object.entries(spec.aliases || {})) {
      if (!icons[target]) fail(`specification "${spec.id}": alias "${alias}" points at unknown icon "${target}"`);
      if (icons[alias]) fail(`specification "${spec.id}": alias "${alias}" shadows a real icon`);
    }

    const seen = new Set();
    for (const category of spec.categories || []) {
      if (!category.id || !category.title) fail(`specification "${spec.id}": every category needs id and title`);
      for (const iconName of category.icons || []) {
        if (!icons[iconName]) fail(`specification "${spec.id}" category "${category.id}": unknown icon "${iconName}"`);
        if (seen.has(iconName)) fail(`specification "${spec.id}": icon "${iconName}" appears in more than one category`);
        seen.add(iconName);
      }
    }
  }

  if (registry.activeSpec && !specIds.has(registry.activeSpec)) {
    fail(`registry.activeSpec "${registry.activeSpec}" is not a registered specification`);
  }
  if (typeof registry?.adoption?.maxInlineSvgSites !== 'number') {
    fail('registry.adoption.maxInlineSvgSites must be a number');
  }
  return errors;
}
