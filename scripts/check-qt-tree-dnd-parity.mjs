// scripts/check-qt-tree-dnd-parity.mjs
// Mechanical verification gate for Qt Virtual Tree drag & drop state machines,
// reactive Ctrl modifier detection, container padding, and selection styling.

import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(process.cwd());
const TREE_QML = resolve(ROOT, 'qt/src/ChaSetVirtualTree.qml');
const DOC_QML = resolve(ROOT, 'qt/src/VirtualTreeDocPage.qml');

export function verifyQtTreeDndParity({ quiet = false } = {}) {
  const violations = [];
  let checkedCount = 0;

  if (!existsSync(TREE_QML)) {
    violations.push(`Missing component file: ${TREE_QML}`);
    return { ok: false, checkedCount, violations };
  }

  const treeContent = readFileSync(TREE_QML, 'utf8');

  // Check 1: isCtrlHeld property declared
  checkedCount++;
  if (!treeContent.includes('property bool isCtrlHeld')) {
    violations.push('ChaSetVirtualTree.qml must declare "property bool isCtrlHeld" for reactive modifier tracking.');
  }

  // Check 2: Keys.onPressed and Keys.onReleased handle Qt.Key_Control
  checkedCount++;
  if (!treeContent.includes('event.key === Qt.Key_Control') || !treeContent.includes('root.isCtrlHeld = true')) {
    violations.push('ChaSetVirtualTree.qml Keys.onPressed must detect Qt.Key_Control to update root.isCtrlHeld.');
  }
  checkedCount++;
  if (!treeContent.includes('Keys.onReleased') || !treeContent.includes('root.isCtrlHeld = false')) {
    violations.push('ChaSetVirtualTree.qml Keys.onReleased must detect Qt.Key_Control release to clear root.isCtrlHeld.');
  }

  // Check 3: isDropTarget must require root.isDragging
  checkedCount++;
  const dropTargetRegex = /readonly\s+property\s+bool\s+isDropTarget:\s*root\.enableDnd\s*&&\s*root\.isDragging\s*&&\s*root\.dropTargetId\s*===\s*modelData\.id/;
  if (!dropTargetRegex.test(treeContent)) {
    violations.push('ChaSetVirtualTree.qml isDropTarget must enforce root.isDragging (prevents stuck insertion lines).');
  }

  // Check 4: Container margins on ListView (matching React p-2)
  checkedCount++;
  if (!treeContent.includes('anchors.margins: ThemeTokens.dp(8)')) {
    violations.push('ChaSetVirtualTree.qml treeList must enforce anchors.margins: ThemeTokens.dp(8) to match React p-2 container inset.');
  }

  // Check 5: Selection border styling on delegateRow
  checkedCount++;
  const selectedBorderRegex = /border\.color:\s*isSelected\s*\?\s*Qt\.rgba\(ThemeTokens\.focus\.r,\s*ThemeTokens\.focus\.g,\s*ThemeTokens\.focus\.b,\s*0\.35\)/;
  if (!selectedBorderRegex.test(treeContent)) {
    violations.push('ChaSetVirtualTree.qml delegateRow must declare subtle border outline when isSelected.');
  }
  checkedCount++;
  if (!treeContent.includes('border.width: isSelected || isCopied || isKeyboardFocused ? 1 : 0')) {
    violations.push('ChaSetVirtualTree.qml delegateRow must declare border.width: 1 when isSelected.');
  }

  // Check 6: VirtualTreeDocPage.qml must connect onNodeDropped
  if (existsSync(DOC_QML)) {
    const docContent = readFileSync(DOC_QML, 'utf8');
    checkedCount++;
    if (!docContent.includes('onNodeDropped: function(sourceIds, targetId, pos, isCopy)') &&
        !docContent.includes('onNodeDropped: function(sourceIds, targetId, position, isCopy)')) {
      violations.push('VirtualTreeDocPage.qml ChaSetVirtualTree instance must connect onNodeDropped handler.');
    }
  }

  return {
    ok: violations.length === 0,
    checkedCount,
    violations,
  };
}

if (process.argv[1] && process.argv[1].endsWith('check-qt-tree-dnd-parity.mjs')) {
  const res = verifyQtTreeDndParity();
  if (!res.ok) {
    console.error(`[check-qt-tree-dnd-parity] FAIL: Found ${res.violations.length} violation(s):`);
    for (const v of res.violations) {
      console.error(`  - ${v}`);
    }
    process.exit(1);
  }
  console.log(`[check-qt-tree-dnd-parity] PASS: Verified ${res.checkedCount} Qt VirtualTree DnD and visual parity invariants.`);
}
