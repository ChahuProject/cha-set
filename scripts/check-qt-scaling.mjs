// scripts/check-qt-scaling.mjs
// Automated verification gate: strictly enforces authentic UI scaling (ThemeTokens.dp / sp)
// across all ChaSet Qt Quick components, preventing unscaled raw pixel regressions
// and eliminating call-site double-scaling anti-patterns.
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const rootDir = resolve(fileURLToPath(import.meta.url), '../..');
const srcDir = resolve(rootDir, 'qt/src');

/**
 * List of known ChaSet component properties that internally scale their values
 * via ThemeTokens.dp(...) according to Style A (Internal Component Scaling).
 * Callers MUST pass raw logical units and MUST NEVER wrap arguments with ThemeTokens.dp(...).
 */
export const INTERNALLY_SCALED_PROPS = [
  'customRadius',
  'itemWidth',
  'rowHeight',
  'headerHeight',
  'gutterSize',
  'hitThickness',
  'handleThickness',
  'cellWidth',
  'cellHeight',
  'estimateSize',
  'sideMargin',
  'contentLeftMargin',
  'contentRightMargin',
  'customSheetSize',
  'sidebarWidth',
  'iconWidth',
  'sideOffset',
  'menuWidth',
  'popoverWidth',
  'popoverHeight',
];

/**
 * Audit:
 * 1. All ChaSet*.qml component files for unscaled geometry numbers (> 2px).
 * 2. All QML files in qt/src for call-site double-scaling invocations.
 */
export function verifyQtScaling({ quiet = false } = {}) {
  const componentFiles = readdirSync(srcDir).filter(f => (f.startsWith('ChaSet') || f === 'CommandSearchModal.qml') && f.endsWith('.qml'));
  const allQmlFiles = readdirSync(srcDir).filter(f => f.endsWith('.qml'));
  const errors = [];
  let checkedCount = 0;

  // =========================================================================
  // Pass 1: Audit ChaSet*.qml component internal scaling integrity
  // =========================================================================
  for (const file of componentFiles) {
    checkedCount++;
    const content = readFileSync(join(srcDir, file), 'utf8');
    const lines = content.split(/\r?\n/);

    // 1. Check icon components use ThemeTokens.dp
    if (file === 'ChaSetIcon.qml' || file === 'ChaSetStatusIcon.qml') {
      if (!content.includes('ThemeTokens.dp')) {
        errors.push(`[${file}] Icon component must use ThemeTokens.dp for scale responsiveness`);
      }
    }

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        return;
      }

      // 2. Direct raw integer assignments for geometry properties > 2
      // e.g. implicitHeight: 36, width: 200, radius: 8, spacing: 12
      const geoMatch = trimmed.match(/^(?:readonly\s+property\s+\w+\s+|property\s+\w+\s+)?(implicitHeight|implicitWidth|height|width|radius|customRadius|spacing|padding|topPadding|bottomPadding|leftPadding|rightPadding|horizontalPadding|verticalPadding|headerHeight|rowHeight|boxSize|estimateSize|itemHeight|thumbThickness|expandedThumbThickness|hitThickness|buttonLength)\s*:\s*(\d+)(?:\s*;|\s*$)/);
      if (geoMatch) {
        const prop = geoMatch[1];
        const val = Number(geoMatch[2]);
        // 0, 1, 2 are permitted for borders/hairlines.
        // Also permit default/initial property definitions where the component computes an effectiveDp value
        // e.g. property int rowHeight: 36 accompanied by readonly property int effectiveRowHeight: ThemeTokens.dp(rowHeight)
        const isPublicConfigProp = trimmed.startsWith('property int ') || trimmed.startsWith('property real ');
        const hasEffectiveProp = isPublicConfigProp && (
          content.includes(`effective${prop.charAt(0).toUpperCase() + prop.slice(1)}`) ||
          content.includes(`ThemeTokens.dp(${prop})`) ||
          content.includes(`ThemeTokens.dp(root.${prop})`)
        );

        if (val > 2 && !trimmed.includes('ThemeTokens.dp') && !trimmed.includes('ThemeTokens.sp') && !hasEffectiveProp) {
          // Check if scale-invariant overlay like ChaSetScaleOsd
          if (file === 'ChaSetScaleOsd.qml' && (content.includes('ignoreUiScale') || trimmed.includes('ignoreUiScale'))) {
            return;
          }
          errors.push(`[${file}:L${lineNum}] Raw unscaled geometry "${prop}: ${val}" found. Wrap with ThemeTokens.dp(${val})`);
        }
      }

      // 3. Ternary assignments with raw integers > 2 e.g. height: isSm ? 28 : 36
      const ternaryMatch = trimmed.match(/^(implicitHeight|implicitWidth|height|width|radius|customRadius|spacing|padding|topPadding|bottomPadding|leftPadding|rightPadding|horizontalPadding|verticalPadding)\s*:\s*[^?:]+\?\s*(\d+)\s*:\s*(\d+)/);
      if (ternaryMatch) {
        const val1 = Number(ternaryMatch[2]);
        const val2 = Number(ternaryMatch[3]);
        if (!trimmed.includes('ThemeTokens.dp') && !trimmed.includes('ThemeTokens.sp') && (val1 > 2 || val2 > 2)) {
          // Check if scale-invariant overlay
          if (file === 'ChaSetScaleOsd.qml' && content.includes('ignoreUiScale')) {
            return;
          }
          errors.push(`[${file}:L${lineNum}] Raw ternary geometry found: "${trimmed}". Wrap values with ThemeTokens.dp(...)`);
        }
      }
    });
  }

  // =========================================================================
  // Pass 2: Audit all QML files for call-site double-scaling anti-patterns
  // =========================================================================
  const doubleScalePropRegex = new RegExp(`^(?:(?:[a-zA-Z_]\\w*\\.)?(${INTERNALLY_SCALED_PROPS.join('|')}))\\s*:\\s*(.*ThemeTokens\\.dp.*)$`);

  for (const file of allQmlFiles) {
    const content = readFileSync(join(srcDir, file), 'utf8');
    const lines = content.split(/\r?\n/);

    lines.forEach((line, idx) => {
      const lineNum = idx + 1;
      const trimmed = line.trim();

      // Skip comments
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
        return;
      }

      // Skip property declarations inside component definitions (e.g. property int hitThickness: ThemeTokens.dp(...))
      if (/^(?:readonly\s+)?property\s+/.test(trimmed)) {
        return;
      }

      const match = trimmed.match(doubleScalePropRegex);
      if (match) {
        const prop = match[1];
        errors.push(`[${file}:L${lineNum}] Double-scaling anti-pattern detected: "${trimmed}". Property "${prop}" is already scaled internally by the component contract. Pass raw logical number (e.g. "${prop}: 120") instead of ThemeTokens.dp(...)`);
      }
    });
  }

  const ok = errors.length === 0;
  if (!quiet) {
    if (ok) {
      console.log(`[check-qt-scaling] OK — All ${checkedCount} ChaSet Qt components adhere to authentic UI scaling (ThemeTokens.dp/sp), and all ${allQmlFiles.length} QML files have zero double-scaling anti-patterns.`);
    } else {
      console.error(`[check-qt-scaling] FAIL — Found ${errors.length} UI scaling violation(s):`);
      for (const err of errors) {
        console.error(`  - ${err}`);
      }
    }
  }

  return { ok, errors, checkedCount, allQmlCheckedCount: allQmlFiles.length };
}

// Direct CLI execution
if (process.argv[1] && fileURLToPath(import.meta.url).toLowerCase() === resolve(process.argv[1]).toLowerCase()) {
  const { ok } = verifyQtScaling({ quiet: false });
  process.exit(ok ? 0 : 1);
}
