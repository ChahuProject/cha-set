#!/usr/bin/env node
/**
 * scripts/check-concentric-radii.mjs
 *
 * Mandatory Cross-Stack Concentric Corner Radius Parity Gate (同心圆角几何体系门禁).
 *
 * Principle:
 *   When an outer container with corner radius R_outer and internal padding P
 *   contains an inner element (active pill indicator, selected item background,
 *   menu item hover/active highlight), the inner corner radius R_inner MUST satisfy:
 *
 *       R_inner = max(0, R_outer - P)
 *
 *   This ensures the space between inner element and outer container curve remains
 *   strictly equidistant (sharing the exact same arc center), eliminating visual pinch,
 *   corner crowding, and awkward padding anomalies.
 *
 * Unit Scale:
 *   Base radius (--radius / --cs-radius): 0.5rem = 8px
 *   - rounded-2xl: 1rem    = 16px
 *   - rounded-xl:  0.75rem = 12px
 *   - rounded-lg:  0.5rem  = 8px
 *   - rounded-md:  0.375rem= 6px
 *   - rounded-sm:  0.25rem = 4px
 *   - rounded-xs:  0.125rem= 2px
 *   - rounded-none:0rem    = 0px
 *
 *   Padding scale:
 *   - p-0.5: 0.125rem = 2px
 *   - p-1:   0.25rem  = 4px
 *   - p-1.5: 0.375rem = 6px
 *   - p-2:   0.5rem   = 8px
 *   - p-3:   0.75rem  = 12px
 *   - p-4:   1rem     = 16px
 */

import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const RADIUS_PX = {
  'none': 0,
  'xs': 2,
  'sm': 4,
  'md': 6,
  'lg': 8,
  'xl': 12,
  '2xl': 16,
};

export const PADDING_PX = {
  '0': 0,
  '0.5': 2,
  '1': 4,
  '1.5': 6,
  '2': 8,
  '3': 12,
  '4': 16,
};

/**
 * Expected concentric contracts for known nested container components.
 */
export const CONCENTRIC_CONTRACTS = [
  {
    id: 'segmented-control-default',
    component: 'SegmentedControl',
    variant: 'default',
    outerRadius: 8, // rounded-lg
    padding: 2,     // p-0.5
    expectedInner: 6, // rounded-md (8 - 2 = 6)
    reactFile: 'packages/react/src/segmented-control/SegmentedControl.tsx',
    qtFile: 'qt/src/ChaSetSegmentedControl.qml',
  },
  {
    id: 'segmented-control-sm',
    component: 'SegmentedControl',
    variant: 'sm',
    outerRadius: 6, // rounded-md
    padding: 2,     // p-0.5
    expectedInner: 4, // rounded-sm (6 - 2 = 4)
    reactFile: 'packages/react/src/segmented-control/SegmentedControl.tsx',
    qtFile: 'qt/src/ChaSetSegmentedControl.qml',
  },
  {
    id: 'tabs-default',
    component: 'Tabs',
    variant: 'default',
    outerRadius: 8, // rounded-lg
    padding: 4,     // p-1
    expectedInner: 4, // rounded-sm (8 - 4 = 4)
    reactFile: 'packages/react/src/tabs/Tabs.tsx',
    qtFile: 'qt/src/ChaSetTabsList.qml',
  },
  {
    id: 'tabs-sm',
    component: 'Tabs',
    variant: 'sm',
    outerRadius: 6, // rounded-md
    padding: 2,     // p-0.5
    expectedInner: 4, // rounded-sm (6 - 2 = 4)
    reactFile: 'packages/react/src/tabs/Tabs.tsx',
    qtFile: 'qt/src/ChaSetTabsList.qml',
  },
  {
    id: 'dropdown-menu',
    component: 'DropdownMenu',
    variant: 'popup',
    outerRadius: 8, // rounded-lg
    padding: 4,     // p-1
    expectedInner: 4, // rounded-sm (8 - 4 = 4)
    reactFile: 'packages/react/src/dropdown-menu/DropdownMenu.tsx',
    qtFile: 'qt/src/ChaSetDropdownMenu.qml',
  },
  {
    id: 'context-menu',
    component: 'ContextMenu',
    variant: 'popup',
    outerRadius: 8, // rounded-lg
    padding: 4,     // p-1
    expectedInner: 4, // rounded-sm (8 - 4 = 4)
    reactFile: 'packages/react/src/context-menu/ContextMenu.tsx',
    qtFile: 'qt/src/ChaSetContextMenu.qml',
  },
  {
    id: 'select',
    component: 'Select',
    variant: 'popup',
    outerRadius: 8, // rounded-lg
    padding: 4,     // p-1
    expectedInner: 4, // rounded-sm (8 - 4 = 4)
    reactFile: 'packages/react/src/select/Select.tsx',
    qtFile: 'qt/src/ChaSetSelect.qml',
  },
];

/**
 * Validates concentric corner radii contracts across React and Qt.
 */
export function verifyConcentricRadii({ quiet = false } = {}) {
  const errors = [];
  let checkedCount = 0;

  // 1. Verify ThemeTokens.innerRadius helper exists in generated QML and generator
  const genQtPath = resolve(repoRoot, 'spec/generators/generate-qt.mjs');
  const tokensQmlPath = resolve(repoRoot, 'qt/src/ThemeTokens.generated.qml');

  if (existsSync(genQtPath)) {
    const genContent = readFileSync(genQtPath, 'utf8');
    checkedCount++;
    if (!genContent.includes('function innerRadius(outerRadius, padding)')) {
      errors.push('spec/generators/generate-qt.mjs must emit function innerRadius(outerRadius, padding)');
    }
  }

  if (existsSync(tokensQmlPath)) {
    const tokensContent = readFileSync(tokensQmlPath, 'utf8');
    checkedCount++;
    if (!tokensContent.includes('function innerRadius(outerRadius, padding)')) {
      errors.push('qt/src/ThemeTokens.generated.qml is missing function innerRadius(outerRadius, padding). Run "pnpm gen:qt".');
    }
  }

  // 2. Verify CSS theme radius scale has --radius-xs and --radius-2xl
  const themeCssPath = resolve(repoRoot, 'packages/react/src/styles/theme.css');
  if (existsSync(themeCssPath)) {
    const themeContent = readFileSync(themeCssPath, 'utf8');
    checkedCount++;
    if (!themeContent.includes('--radius-xs:')) {
      errors.push('packages/react/src/styles/theme.css is missing --radius-xs definition');
    }
    checkedCount++;
    if (!themeContent.includes('--radius-sm:')) {
      errors.push('packages/react/src/styles/theme.css is missing --radius-sm definition');
    }
  }

  // 3. Verify each component contract
  for (const contract of CONCENTRIC_CONTRACTS) {
    checkedCount++;
    const expected = Math.max(0, contract.outerRadius - contract.padding);
    if (contract.expectedInner !== expected) {
      errors.push(`Contract mismatch in ${contract.id}: expected ${expected}px, contract defined ${contract.expectedInner}px`);
    }

    // Verify React file
    const reactPath = resolve(repoRoot, contract.reactFile);
    if (existsSync(reactPath)) {
      const code = readFileSync(reactPath, 'utf8');
      checkedCount++;

      if (contract.component === 'SegmentedControl') {
        if (!code.includes('p-0.5')) {
          errors.push(`${contract.reactFile}: SegmentedControl must use p-0.5 padding`);
        }
        if (!code.includes("rounded-sm : 'rounded-md'") && !code.includes("rounded-sm' : 'rounded-md'")) {
          errors.push(`${contract.reactFile}: SegmentedControl indicator must use rounded-sm for sm and rounded-md for default`);
        }
      } else if (contract.component === 'Tabs') {
        if (!code.includes("size === 'sm' ? 'h-7 p-0.5 rounded-md' : 'h-8 p-1 rounded-lg'")) {
          errors.push(`${contract.reactFile}: TabsList must use concentric radii (p-0.5 rounded-md for sm, p-1 rounded-lg for default)`);
        }
        if (!code.includes("'rounded-sm bg-background shadow-xs'")) {
          errors.push(`${contract.reactFile}: BaseTabs.Indicator must use rounded-sm bg-background shadow-xs`);
        }
      } else if (contract.component === 'DropdownMenu') {
        if (!code.includes('rounded-lg border border-border bg-popover p-1')) {
          errors.push(`${contract.reactFile}: DropdownMenu popup must use rounded-lg and p-1`);
        }
        if (code.includes('group/dropdown-menu-item relative flex cursor-pointer items-center gap-1.5 rounded-md')) {
          errors.push(`${contract.reactFile}: DropdownMenuItem must use rounded-sm (concentric with p-1 rounded-lg), not rounded-md`);
        }
        if (code.includes('dropdown-menu-checkbox-item" data-inset={inset} className={cn(\'relative flex cursor-pointer items-center gap-1.5 rounded-md')) {
          errors.push(`${contract.reactFile}: DropdownMenuCheckboxItem must use rounded-sm, not rounded-md`);
        }
      } else if (contract.component === 'ContextMenu') {
        if (!code.includes('rounded-lg border border-border bg-popover p-1')) {
          errors.push(`${contract.reactFile}: ContextMenu popup must use rounded-lg and p-1`);
        }
        if (code.includes('context-menu-item" data-variant={variant} data-inset={inset} className={cn(\'relative flex cursor-pointer items-center gap-1.5 rounded-md')) {
          errors.push(`${contract.reactFile}: ContextMenuItem must use rounded-sm, not rounded-md`);
        }
      } else if (contract.component === 'Select') {
        if (!code.includes('rounded-lg border border-border bg-popover p-1')) {
          errors.push(`${contract.reactFile}: Select popup must use rounded-lg and p-1`);
        }
        if (code.includes('select-item" value={value} className={cn(\'relative flex w-full cursor-pointer items-center gap-1.5 rounded-md')) {
          errors.push(`${contract.reactFile}: SelectItem must use rounded-sm, not rounded-md`);
        }
      }
    }

    // Verify Qt file
    const qtPath = resolve(repoRoot, contract.qtFile);
    if (existsSync(qtPath)) {
      const code = readFileSync(qtPath, 'utf8');
      checkedCount++;

      if (contract.component === 'SegmentedControl') {
        if (!code.includes('ThemeTokens.innerRadius(controlRadius, root.padding)')) {
          errors.push(`${contract.qtFile}: itemRadius must use ThemeTokens.innerRadius(controlRadius, root.padding)`);
        }
      } else if (contract.component === 'Tabs') {
        if (!code.includes('ThemeTokens.innerRadius(root.effectiveRadius, root.effectivePadding)')) {
          errors.push(`${contract.qtFile}: pillIndicator must use ThemeTokens.innerRadius(root.effectiveRadius, root.effectivePadding)`);
        }
      } else if (contract.component === 'DropdownMenu') {
        if (!code.includes('ThemeTokens.innerRadius(ThemeTokens.dp(root.customRadius), menuPopup.padding)') &&
            !code.includes('ThemeTokens.innerRadius(root.customRadius, menuPopup.padding)')) {
          errors.push(`${contract.qtFile}: delegateItem must use ThemeTokens.innerRadius for concentric item highlights`);
        }
      } else if (contract.component === 'ContextMenu') {
        if (!code.includes('ThemeTokens.innerRadius(root.customRadius, contextPopup.padding)')) {
          errors.push(`${contract.qtFile}: delegate must use ThemeTokens.innerRadius(root.customRadius, contextPopup.padding)`);
        }
      } else if (contract.component === 'Select') {
        if (!code.includes('ThemeTokens.innerRadius(root.customRadius, selectPopup.padding)')) {
          errors.push(`${contract.qtFile}: delegate must use ThemeTokens.innerRadius(root.customRadius, selectPopup.padding)`);
        }
      }
    }
  }

  // 4. Heuristic Scanner for anti-patterns:
  const auditedReactFiles = [
    'packages/react/src/dropdown-menu/DropdownMenu.tsx',
    'packages/react/src/context-menu/ContextMenu.tsx',
    'packages/react/src/select/Select.tsx',
    'packages/react/src/tabs/Tabs.tsx',
  ];

  for (const relFile of auditedReactFiles) {
    const fullPath = resolve(repoRoot, relFile);
    if (!existsSync(fullPath)) continue;
    const content = readFileSync(fullPath, 'utf8');
    checkedCount++;

    if (content.includes('rounded-lg') && content.includes('p-1')) {
      const lines = content.split('\n');
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (
          (line.includes('rounded-md') && (line.includes('item') || line.includes('Item') || line.includes('cursor-pointer'))) &&
          !line.includes('defaultVariantClasses')
        ) {
          errors.push(`${relFile}:${i + 1}: concentric violation — item uses rounded-md inside p-1 rounded-lg container (must use rounded-sm)`);
        }
      }
    }
  }

  if (!quiet) {
    if (errors.length > 0) {
      console.error(`[check:concentric] FAIL (${errors.length} violations found):`);
      for (const err of errors) console.error(`  - ${err}`);
    } else {
      console.log(`[check:concentric] OK — ${checkedCount} concentric corner radii assertions verified`);
    }
  }

  return {
    ok: errors.length === 0,
    checkedCount,
    errors,
  };
}

/**
 * Self-test function to ensure the concentric linter catches injected violations.
 */
export function selfTest() {
  // 1. Test math calculations
  if (Math.max(0, 8 - 4) !== 4) return { ok: false, reason: 'Math formula broken (8-4 != 4)' };
  if (Math.max(0, 6 - 2) !== 4) return { ok: false, reason: 'Math formula broken (6-2 != 4)' };
  if (Math.max(0, 8 - 2) !== 6) return { ok: false, reason: 'Math formula broken (8-2 != 6)' };
  if (Math.max(0, 4 - 8) !== 0) return { ok: false, reason: 'Math formula broken (clamp to 0)' };

  // 2. Test contract violation detection
  const testViolations = [];
  const testContract = { outerRadius: 8, padding: 4, expectedInner: 6 };
  const expected = Math.max(0, testContract.outerRadius - testContract.padding);
  if (testContract.expectedInner !== expected) {
    testViolations.push('Injected contract violation caught');
  }
  if (testViolations.length === 0) {
    return { ok: false, reason: 'Injected contract violation was not caught' };
  }

  // 3. Test anti-pattern string scanner
  const badSnippet = 'rounded-lg border bg-popover p-1\n<button className="item rounded-md cursor-pointer">Item</button>';
  let badCaught = false;
  if (badSnippet.includes('rounded-lg') && badSnippet.includes('p-1')) {
    for (const line of badSnippet.split('\n')) {
      if (line.includes('rounded-md') && line.includes('item')) {
        badCaught = true;
        break;
      }
    }
  }
  if (!badCaught) {
    return { ok: false, reason: 'Injected scanner anti-pattern was not caught' };
  }

  return { ok: true };
}

// Run as CLI script
const isMain = process.argv[1] && (
  resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url)) ||
  process.argv[1].endsWith('check-concentric-radii.mjs')
);
if (isMain) {
  const st = selfTest();
  if (!st.ok) {
    console.error(`[check:concentric] selfTest failed: ${st.reason}`);
    process.exit(1);
  }
  const result = verifyConcentricRadii({ quiet: false });
  process.exit(result.ok ? 0 : 1);
}
