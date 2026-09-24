// scripts/check-qt-scaling.mjs
// Automated verification gate: strictly enforces authentic UI scaling (ThemeTokens.dp / sp)
// across all ChaSet Qt Quick components, preventing unscaled raw pixel regressions.
import { readFileSync, readdirSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const rootDir = resolve(fileURLToPath(import.meta.url), '../..');
const srcDir = resolve(rootDir, 'qt/src');

/**
 * Audit all ChaSet*.qml component files for unscaled geometry numbers (> 2px).
 * Values of 0, 1, 2 are exempt as they represent hairlines, crisp borders, and optical alignment.
 */
export function verifyQtScaling({ quiet = false } = {}) {
  const files = readdirSync(srcDir).filter(f => (f.startsWith('ChaSet') || f === 'CommandSearchModal.qml') && f.endsWith('.qml'));
  const errors = [];
  let checkedCount = 0;

  for (const file of files) {
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

  const ok = errors.length === 0;
  if (!quiet) {
    if (ok) {
      console.log(`[check-qt-scaling] OK — All ${checkedCount} ChaSet Qt components adhere to authentic UI scaling (ThemeTokens.dp/sp)`);
    } else {
      console.error(`[check-qt-scaling] FAIL — Found ${errors.length} unscaled geometry violation(s):`);
      for (const err of errors) {
        console.error(`  - ${err}`);
      }
    }
  }

  return { ok, errors, checkedCount };
}

// Direct CLI execution
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const { ok } = verifyQtScaling({ quiet: false });
  process.exit(ok ? 0 : 1);
}
