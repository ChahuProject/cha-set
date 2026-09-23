// scripts/check-no-emoji.mjs
// Automated verification gate: strictly enforces zero emojis across all tracked files.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

// Emoji Unicode ranges:
// - U+1F300 to U+1F5FF: Misc Symbols & Pictographs
// - U+1F600 to U+1F64F: Emoticons
// - U+1F680 to U+1F6FF: Transport & Map
// - U+1F900 to U+1F9FF: Supplemental Symbols & Pictographs
// - U+1FA70 to U+1FAFF: Symbols & Pictographs Extended-A
// - U+2600 to U+26FF: Misc Symbols
// - U+2700 to U+27BF: Dingbats (except basic math/punctuation)
// - U+2B50, U+2B55: Heavy stars/circles
const EMOJI_REGEX = /[\u{1F300}-\u{1F5FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}]/u;

const BINARY_EXTENSIONS = new Set([
  '.png', '.ico', '.jpg', '.jpeg', '.gif', '.svg',
  '.exe', '.dll', '.obj', '.o', '.a', '.lib',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.pdf', '.zip', '.tar', '.gz'
]);

function main() {
  const trackedFiles = execSync('git ls-files', { encoding: 'utf-8' })
    .split(/\r?\n/)
    .map((f) => f.trim())
    .filter(Boolean);

  const violations = [];
  let scannedCount = 0;

  for (const file of trackedFiles) {
    const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
    if (BINARY_EXTENSIONS.has(ext)) continue;

    scannedCount++;
    let content;
    try {
      content = readFileSync(file, 'utf-8');
    } catch {
      continue;
    }

    const lines = content.split(/\r?\n/);
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];
      const match = line.match(EMOJI_REGEX);
      if (match) {
        violations.push({
          file,
          line: idx + 1,
          char: match[0],
          codePoint: 'U+' + match[0].codePointAt(0).toString(16).toUpperCase(),
          snippet: line.trim().slice(0, 100),
        });
      }
    }
  }

  if (violations.length > 0) {
    console.error(`\n[FAIL] Zero-Emoji Mandate Violation: Found ${violations.length} emoji(s) across tracked files!`);
    console.error('All emojis must be replaced with vector icons (ChaSetIcon / SVG) or structured text.\n');
    for (const v of violations) {
      console.error(`  - ${v.file}:${v.line} [${v.char} (${v.codePoint})]: ${v.snippet}`);
    }
    process.exit(1);
  }

  console.log(`[PASS] Zero-Emoji Mandate: 0 emojis found across ${scannedCount} tracked text files.`);
}

main();
