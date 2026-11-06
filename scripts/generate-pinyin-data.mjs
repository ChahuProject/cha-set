// scripts/generate-pinyin-data.mjs
// Generates compact TypeScript Pinyin dataset from C++ table for React Web stack.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cppSourcePath = 'D:/pengj/dunting-qt-d/core/pinyin/pinyin_table.cpp';
const cppContent = fs.readFileSync(cppSourcePath, 'utf8');

// 1. Extract syllables
const syllMatch = cppContent.match(/const PinyinSyllable kSyllables\[\] = \{([\s\S]*?)\};/);
if (!syllMatch) throw new Error('Failed to find kSyllables in ' + cppSourcePath);

const syllables = [];
const lines = syllMatch[1].split('\n');
for (const line of lines) {
  const m = line.match(/\{\s*"([^"]*)",\s*('[^']+'|0),\s*('[^']+'|0),\s*"([^"]*)"\s*\}/);
  if (m) {
    const stdInit = m[2] === '0' ? '' : m[2].replace(/'/g, '');
    const xhInit = m[3] === '0' ? '' : m[3].replace(/'/g, '');
    syllables.push([m[1], stdInit, xhInit, m[4]]);
  }
}

// 2. Extract code point table
const tableMatch = cppContent.match(/const uint16_t kCodePointToSyllable\[kPinyinTableSize\] = \{([\s\S]*?)\};/);
if (!tableMatch) throw new Error('Failed to find kCodePointToSyllable in ' + cppSourcePath);

const nums = tableMatch[1].match(/\d+/g).map(Number);
const uint16 = new Uint16Array(nums);
const base64Data = Buffer.from(uint16.buffer).toString('base64');

// 3. Emit TypeScript module
const outputTsPath = path.resolve(__dirname, '../packages/react/src/lib/pinyinData.generated.ts');

const tsContent = `// packages/react/src/lib/pinyinData.generated.ts
// Generated automatically from core/pinyin/pinyin_table.cpp. DO NOT EDIT.

export type SyllableTuple = readonly [
  pinyin: string,
  stdInitial: string,
  xiaoheInitial: string,
  xiaohePinyin: string
];

export const PINYIN_TABLE_START = 0x4E00;
export const PINYIN_TABLE_END = 0x9FA5;
export const PINYIN_TABLE_SIZE = 20902;

export const SYLLABLES: readonly SyllableTuple[] = ${JSON.stringify(syllables, null, 2)} as const;

export const TABLE_BASE64 = "${base64Data}";
`;

fs.writeFileSync(outputTsPath, tsContent, 'utf8');
console.log(`[gen-pinyin] Emitted ${outputTsPath} (Syllables: ${syllables.length}, Base64: ${base64Data.length} bytes)`);
