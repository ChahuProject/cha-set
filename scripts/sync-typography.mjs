#!/usr/bin/env node
// scripts/sync-typography.mjs — automated codemod to synchronize typography tokens across Qt DocPages.
//
// Usage:
//   node scripts/sync-typography.mjs --check   (report drift without modifying files)
//   node scripts/sync-typography.mjs --write   (apply transformations in place)
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const qtSrcDir = resolve(repoRoot, 'qt', 'src');

const SIZE_MAP = {
  '10': 'Typography.sizeMicro',
  '11': 'Typography.sizeCaption',
  '12': 'Typography.sizeSmall',
  '13': 'Typography.sizeBody',
  '14': 'Typography.sizeBody',
  '15': 'Typography.sizeHeading',
  '16': 'Typography.sizeHeading',
  '18': 'Typography.sizeTitleSm',
  '20': 'Typography.sizeTitleSm',
  '22': 'Typography.sizeTitleMd',
  '24': 'Typography.sizeTitleMd',
  '28': 'Typography.sizeTitle',
  '36': 'Typography.sizeDisplay'
};

const WEIGHT_MAP = {
  'Font.Bold': 'Typography.weightBold',
  'Font.DemiBold': 'Typography.weightSemibold',
  'Font.Medium': 'Typography.weightMedium',
  'Font.Normal': 'Typography.weightRegular'
};

export function syncTypography({ write = false } = {}) {
  const files = readdirSync(qtSrcDir)
    .filter(f => f.endsWith('DocPage.qml') || f === 'Main.qml' || f === 'IntroductionPage.qml' || f === 'TokensPage.qml' || f === 'ThemeTunerPage.qml' || f === 'ComponentPreview.qml')
    .map(f => join(qtSrcDir, f));

  let totalReplacements = 0;
  let modifiedFiles = 0;
  const reports = [];

  for (const file of files) {
    const rel = relative(repoRoot, file).replace(/\\/g, '/');
    const content = readFileSync(file, 'utf8');
    const lines = content.split(/\r?\n/);
    let inBackticks = false;
    let fileChanged = false;
    let fileReplacements = 0;

    const newLines = lines.map((line, idx) => {
      // Track multi-line template literal / code strings
      const tickCount = (line.split('`').length - 1);
      if (tickCount % 2 === 1) {
        inBackticks = !inBackticks;
      }

      // Skip code string lines
      if (inBackticks || line.includes('qtCode:') || line.includes('code:') || line.includes('reactCode:')) {
        return line;
      }

      let newLine = line;

      // 1. Replace bare font.pixelSize: <num>
      for (const [sizeStr, token] of Object.entries(SIZE_MAP)) {
        const regex = new RegExp(`(\\bfont\\.pixelSize\\s*:\\s*)${sizeStr}(\\b|;|,|\\s|$)`, 'g');
        if (regex.test(newLine)) {
          newLine = newLine.replace(regex, `$1${token}$2`);
          fileReplacements++;
        }
      }

      // 2. Replace font.weight: Font.<Weight>
      for (const [fontWeight, token] of Object.entries(WEIGHT_MAP)) {
        if (newLine.includes(fontWeight)) {
          newLine = newLine.replace(new RegExp(`\\b${fontWeight.replace('.', '\\.')}\\b`, 'g'), token);
          fileReplacements++;
        }
      }

      if (newLine !== line) {
        fileChanged = true;
      }

      return newLine;
    });

    if (fileChanged) {
      modifiedFiles++;
      totalReplacements += fileReplacements;
      reports.push(`${rel}: ${fileReplacements} typography replacements`);
      if (write) {
        writeFileSync(file, newLines.join('\n'), 'utf8');
      }
    }
  }

  return { totalReplacements, modifiedFiles, reports };
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const isWrite = process.argv.includes('--write');
  const res = syncTypography({ write: isWrite });
  console.log(`[sync-typography] ${isWrite ? 'Applied' : 'Found'} ${res.totalReplacements} replacement(s) across ${res.modifiedFiles} file(s).`);
  for (const r of res.reports) {
    console.log(`  ${r}`);
  }
  if (!isWrite && res.totalReplacements > 0) {
    console.log('[sync-typography] Run with --write to apply these replacements in place.');
  }
}
