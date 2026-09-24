// scripts/check-ui-scale-dimensions.mjs
// Mechanical verification gate preventing double-scaling / UI zoom gap blowouts in React components.
//
// In ChaSet, UI scale modifies root html font-size (`html.style.fontSize = 16 * uiScale`).
// Runtime DOM measurements (e.g. `virtualRow.start`, `virtualizer.getTotalSize()`, `element.offsetTop`,
// `getBoundingClientRect()`, mouse `clientX/Y` deltas) are ALREADY rendered and measured in scaled CSS pixels.
// Multiplying them by `0.0625rem` (or dividing by 16) assumes 1rem = 16px, causing a quadratic (scale^2) blowout
// where row spacing and offsets expand enormously when zoomed in.
//
// This script verifies that all runtime measurements are either expressed in `px` / unitless values
// or dynamically divided by `rootFontSize`.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const ROOT = resolve(process.cwd());
const REACT_SRC = resolve(ROOT, 'packages/react/src');

// Explicit exemptions: Component design props that represent static design units (not runtime DOM measurements)
// intended to convert to rem via `* 0.0625rem`.
const ALLOWLISTED_SITES = new Set([
  // design props: hitThickness, visualThickness, itemWidth, topOffset, sideOffset, toLength
  'splitter-handle/SplitterHandle.tsx',
  'code-block/CodeBlock.tsx',
  'segmented-control/SegmentedControl.tsx',
  'tooltip/Tooltip.tsx',
  'table/Table.tsx',
]);

function getAllFiles(dir, exts = ['.ts', '.tsx']) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const full = resolve(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      results.push(...getAllFiles(full, exts));
    } else if (exts.some((ext) => entry.endsWith(ext)) && !entry.endsWith('.test.tsx') && !entry.endsWith('.test.ts')) {
      results.push(full);
    }
  }
  return results;
}

export function verifyUiScaleDimensions({ quiet = false } = {}) {
  const files = getAllFiles(REACT_SRC);
  const violations = [];
  let checkedCount = 0;

  // Patterns that indicate runtime DOM / virtualizer measurements being multiplied by 0.0625rem or / 16 rem
  const dangerousPatterns = [
    {
      regex: /virtual(?:Row|Item)\.(?:start|end)\s*\*\s*0\.0625\s*(?:rem|`)/g,
      reason: 'Virtualizer item start/end multiplied by 0.0625rem (causes gap blowout on UI scale; use px instead)',
    },
    {
      regex: /getTotalSize\(\)\s*\*\s*0\.0625\s*(?:rem|`)/g,
      reason: 'Virtualizer getTotalSize() multiplied by 0.0625rem (causes scroll container blowout on UI scale; use px or unitless height instead)',
    },
    {
      regex: /(?:offsetTop|offsetLeft|scrollTop|scrollLeft|offsetHeight|offsetWidth)\s*\*\s*0\.0625\s*(?:rem|`)/g,
      reason: 'DOM offset metric multiplied by 0.0625rem without dynamic root font size division',
    },
    {
      regex: /(?:moveOffset\.[xy]|dragStart\.[a-zA-Z]+|clientX|clientY)\s*\*\s*0\.0625/g,
      reason: 'Pointer / mouse offset coordinate multiplied by 0.0625rem (diverges from physical cursor on UI scale)',
    },
  ];

  for (const file of files) {
    const rel = relative(REACT_SRC, file).replace(/\\/g, '/');
    const content = readFileSync(file, 'utf8');
    checkedCount++;

    for (const { regex, reason } of dangerousPatterns) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (!ALLOWLISTED_SITES.has(rel)) {
          const linesBefore = content.slice(0, match.index).split('\n');
          const lineNum = linesBefore.length;
          violations.push({
            file: `packages/react/src/${rel}`,
            line: lineNum,
            matched: match[0],
            reason,
          });
        }
      }
    }
  }

  return {
    ok: violations.length === 0,
    checkedCount,
    violations,
  };
}

if (process.argv[1] && process.argv[1].endsWith('check-ui-scale-dimensions.mjs')) {
  const res = verifyUiScaleDimensions();
  if (!res.ok) {
    console.error(`[check-ui-scale-dimensions] FAIL: Found ${res.violations.length} UI scaling measurement violation(s):`);
    for (const v of res.violations) {
      console.error(`  - ${v.file}:${v.line}: "${v.matched}" -> ${v.reason}`);
    }
    process.exit(1);
  }
  console.log(`[check-ui-scale-dimensions] PASS: All ${res.checkedCount} React components verified for UI scale dimension parity.`);
}
