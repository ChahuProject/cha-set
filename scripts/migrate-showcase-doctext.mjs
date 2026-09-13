#!/usr/bin/env node
// scripts/migrate-showcase-doctext.mjs
// Systematically migrates raw Text items in Qt showcase doc pages to DocText for full text selectability.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcDir = path.resolve(repoRoot, 'qt/src');

function migrateQmlFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  let result = '';
  let i = 0;
  const n = content.length;
  let replacedCount = 0;

  while (i < n) {
    // Single line comment
    if (content[i] === '/' && content[i + 1] === '/') {
      const start = i;
      while (i < n && content[i] !== '\n') i++;
      result += content.slice(start, i);
      continue;
    }

    // Multi-line comment
    if (content[i] === '/' && content[i + 1] === '*') {
      const start = i;
      i += 2;
      while (i < n && !(content[i - 1] === '*' && content[i] === '/')) i++;
      i++; // consume '/'
      result += content.slice(start, i);
      continue;
    }

    // Double-quoted string
    if (content[i] === '"') {
      const start = i;
      i++;
      while (i < n && content[i] !== '"') {
        if (content[i] === '\\') i++;
        i++;
      }
      i++; // consume closing quote
      result += content.slice(start, i);
      continue;
    }

    // Single-quoted string
    if (content[i] === "'") {
      const start = i;
      i++;
      while (i < n && content[i] !== "'") {
        if (content[i] === '\\') i++;
        i++;
      }
      i++; // consume closing quote
      result += content.slice(start, i);
      continue;
    }

    // Backtick template string
    if (content[i] === '`') {
      const start = i;
      i++;
      while (i < n && content[i] !== '`') {
        if (content[i] === '\\') i++;
        i++;
      }
      i++; // consume closing backtick
      result += content.slice(start, i);
      continue;
    }

    // Check for Text { outside of strings/comments
    if (content.startsWith('Text', i)) {
      const isWordStart = (i === 0 || !/[A-Za-z0-9_]/.test(content[i - 1]));
      if (isWordStart) {
        const afterText = content.slice(i + 4);
        const match = afterText.match(/^\s*\{/);
        if (match) {
          // Keep Text for interactive right-click target area inside ContextMenu sandbox
          if (afterText.slice(0, 200).includes('Right Click Inside This Area') || afterText.slice(0, 200).includes('native contextual popup')) {
            result += 'Text' + match[0];
            i += 4 + match[0].length;
            continue;
          }
          result += 'DocText {';
          i += 4 + match[0].length;
          replacedCount++;
          continue;
        }
      }
    }

    // Normalize wrapMode: Text.(WordWrap|Wrap|WrapAnywhere|NoWrap) outside strings
    if (content.startsWith('wrapMode', i)) {
      const sub = content.slice(i);
      const wrapMatch = sub.match(/^wrapMode\s*:\s*Text\.(WordWrap|Wrap|WrapAnywhere|NoWrap)/);
      if (wrapMatch) {
        const mode = wrapMatch[1];
        result += `wrapMode: TextEdit.${mode}`;
        i += wrapMatch[0].length;
        continue;
      }
    }

    result += content[i];
    i++;
  }

  if (replacedCount > 0) {
    fs.writeFileSync(filePath, result, 'utf8');
  }
  return replacedCount;
}

const files = fs.readdirSync(srcDir).filter(f => 
  (f.endsWith('DocPage.qml') || f.endsWith('Page.qml')) && 
  f !== 'DocText.qml'
);

let totalReplaced = 0;
let modifiedFiles = 0;

for (const f of files) {
  const p = path.join(srcDir, f);
  const count = migrateQmlFile(p);
  if (count > 0) {
    console.log(`[migrate-doctext] ${f}: migrated ${count} Text items to DocText`);
    totalReplaced += count;
    modifiedFiles++;
  }
}

console.log(`\n[migrate-doctext] Summary: Migrated ${totalReplaced} Text items across ${modifiedFiles} files.`);

