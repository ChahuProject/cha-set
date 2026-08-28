// spec/build-tokens.mjs — deterministic snapshot builder + sha256 + --check drift gate.
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { loadTokensSync } from './load-tokens.mjs';
import { stringifySorted } from './token-helpers.mjs';
import { validateSpec } from './validate-tokens.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const snapshotPath = resolve(__dirname, 'tokens.json');
const tokensDir = resolve(__dirname, 'tokens');

function shardsExist() {
  if (!existsSync(tokensDir)) return false;
  try {
    // check known shards first
    const checks = ['meta.json', 'primitives.json'];
    for (const c of checks) if (existsSync(resolve(tokensDir, c))) return true;
    const entries = readdirSync(tokensDir);
    return entries.length > 0;
  } catch {
    return false;
  }
}

function computeSha256(str) {
  return createHash('sha256').update(str, 'utf8').digest('hex');
}

function formatSnapshot(obj) {
  return JSON.stringify(obj, stringifySorted, 2) + '\n';
}

function main() {
  const args = process.argv.slice(2);
  const isCheck = args.includes('--check');
  const hasShards = shardsExist();

  // For --check on monolith (no shards), just validate snapshot and print sha256
  if (isCheck && !hasShards) {
    let snapshot;
    try {
      snapshot = JSON.parse(readFileSync(snapshotPath, 'utf8'));
    } catch (e) {
      console.error(`[build-tokens] failed to read snapshot: ${e.message}`);
      process.exit(1);
    }
    const errors = validateSpec(snapshot);
    if (errors.length) {
      console.error(`[build-tokens] snapshot invalid (${errors.length}):`);
      for (const e of errors) console.error(`  - ${e}`);
      process.exit(1);
    }
    const raw = readFileSync(snapshotPath, 'utf8');
    const normalized = formatSnapshot(snapshot);
    const rawHash = computeSha256(raw);
    const normHash = computeSha256(normalized);
    console.log(`[build-tokens] --check (monolith fallback): snapshot valid`);
    console.log(`[build-tokens] raw sha256:        ${rawHash}`);
    console.log(`[build-tokens] normalized sha256: ${normHash}`);
    // On monolith, raw vs normalized may differ due to key order. We only require structural validity here.
    // Do not fail on raw vs normalized drift when no shards exist — that is expected until split lands.
    console.log(`[build-tokens] OK — no shards present, snapshot fallback validated`);
    return;
  }

  if (isCheck && hasShards) {
    // Compare shards-built snapshot vs committed snapshot
    let snapshotRaw;
    let snapshotObj;
    try {
      snapshotRaw = readFileSync(snapshotPath, 'utf8');
      snapshotObj = JSON.parse(snapshotRaw);
    } catch (e) {
      console.error(`[build-tokens] failed to read committed snapshot: ${e.message}`);
      process.exit(1);
    }
    const { tokens: built } = loadTokensSync({ from: 'split' });
    const errors = validateSpec(built);
    if (errors.length) {
      console.error(`[build-tokens] built snapshot invalid (${errors.length}):`);
      for (const e of errors) console.error(`  - ${e}`);
      process.exit(1);
    }
    const builtFormatted = formatSnapshot(built);
    const committedFormatted = formatSnapshot(snapshotObj);
    const builtHash = computeSha256(builtFormatted);
    const committedHash = computeSha256(committedFormatted);
    const rawBuiltHash = computeSha256(builtFormatted);
    console.log(`[build-tokens] --check: comparing shards -> snapshot`);
    console.log(`[build-tokens] built sha256:     ${builtHash}`);
    console.log(`[build-tokens] committed sha256: ${committedHash}`);
    if (builtHash !== committedHash) {
      console.error(`[build-tokens] FAIL — shards diverge from committed spec/tokens.json`);
      console.error(`[build-tokens] built vs committed normalized diff:`);
      // simple line diff for diagnosis
      const builtLines = builtFormatted.split('\n');
      const commLines = committedFormatted.split('\n');
      const max = Math.max(builtLines.length, commLines.length);
      let diffCount = 0;
      for (let i = 0; i < max && diffCount < 80; i++) {
        if (builtLines[i] !== commLines[i]) {
          console.error(`  line ${i + 1} built:    ${JSON.stringify(builtLines[i])}`);
          console.error(`  line ${i + 1} committed:${JSON.stringify(commLines[i])}`);
          diffCount++;
        }
      }
      if (diffCount >= 80) console.error(`  ... truncated`);
      process.exit(1);
    }
    console.log(`[build-tokens] OK — shards match committed snapshot (sha256 ${builtHash})`);
    return;
  }

  // Normal build: if shards exist, build and write snapshot; else just validate + print sha256
  if (hasShards) {
    const { tokens: built } = loadTokensSync({ from: 'split' });
    const errors = validateSpec(built);
    if (errors.length) {
      console.error(`[build-tokens] built snapshot invalid (${errors.length}):`);
      for (const e of errors) console.error(`  - ${e}`);
      process.exit(1);
    }
    const formatted = formatSnapshot(built);
    const hash = computeSha256(formatted);
    mkdirSync(dirname(snapshotPath), { recursive: true });
    writeFileSync(snapshotPath, formatted, 'utf8');
    console.log(`[build-tokens] wrote ${snapshotPath}`);
    console.log(`[build-tokens] sha256: ${hash}`);
  } else {
    // monolith: no shards to build from — validate snapshot only
    let snapshot;
    let raw;
    try {
      raw = readFileSync(snapshotPath, 'utf8');
      snapshot = JSON.parse(raw);
    } catch (e) {
      console.error(`[build-tokens] failed to read snapshot: ${e.message}`);
      process.exit(1);
    }
    const errors = validateSpec(snapshot);
    if (errors.length) {
      console.error(`[build-tokens] snapshot invalid (${errors.length}):`);
      for (const e of errors) console.error(`  - ${e}`);
      process.exit(1);
    }
    const hash = computeSha256(raw);
    const norm = computeSha256(formatSnapshot(snapshot));
    console.log(`[build-tokens] no shards — snapshot fallback validated`);
    console.log(`[build-tokens] raw sha256:        ${hash}`);
    console.log(`[build-tokens] normalized sha256: ${norm}`);
    console.log(`[build-tokens] spec/tokens.json untouched (no shards to build from)`);
  }
}

// ESM main guard
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    main();
  } catch (e) {
    console.error(`[build-tokens] unexpected error: ${e?.stack ?? e?.message ?? String(e)}`);
    process.exit(1);
  }
}

export { formatSnapshot, computeSha256 };
