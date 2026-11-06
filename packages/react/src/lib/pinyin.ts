// packages/react/src/lib/pinyin.ts
// Cross-stack multi-modal Pinyin and Xiaohe Double Pinyin matching engine.
import {
  PINYIN_TABLE_START,
  PINYIN_TABLE_END,
  SYLLABLES,
  TABLE_BASE64,
  type SyllableTuple,
} from './pinyinData.generated';

let tableCache: Uint16Array | null = null;

function getTable(): Uint16Array {
  if (!tableCache) {
    if (typeof Buffer !== 'undefined') {
      const buf = Buffer.from(TABLE_BASE64, 'base64');
      tableCache = new Uint16Array(buf.buffer, buf.byteOffset, buf.byteLength / 2);
    } else {
      const binary = atob(TABLE_BASE64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      tableCache = new Uint16Array(bytes.buffer);
    }
  }
  return tableCache;
}

export function lookupSyllable(codePoint: number): SyllableTuple | null {
  if (codePoint < PINYIN_TABLE_START || codePoint > PINYIN_TABLE_END) {
    return null;
  }
  const table = getTable();
  const idx = table[codePoint - PINYIN_TABLE_START];
  return typeof idx === 'number' && idx > 0 && idx < SYLLABLES.length ? (SYLLABLES[idx] ?? null) : null;
}

interface CharInfo {
  char: string;
  isCjk: boolean;
  syllable: SyllableTuple | null;
}

function matchFromPosition(
  textInfo: readonly CharInfo[],
  textPos: number,
  query: string,
  queryPos: number
): boolean {
  if (queryPos >= query.length) {
    return true; // All query characters matched
  }
  if (textPos >= textInfo.length) {
    return false; // Text exhausted but query remains
  }

  const info = textInfo[textPos];
  if (!info) return false;
  const qc = (query[queryPos] ?? '').toLowerCase();
  if (!qc) return false;

  // 1. Literal matching
  if (!info.isCjk) {
    if (info.char.toLowerCase() === qc) {
      if (matchFromPosition(textInfo, textPos + 1, query, queryPos + 1)) {
        return true;
      }
    }
    return false;
  }

  // Exact Chinese character match in query
  if (query[queryPos] === info.char) {
    if (matchFromPosition(textInfo, textPos + 1, query, queryPos + 1)) {
      return true;
    }
  }

  const s = info.syllable;
  if (!s) return false;

  const [pinyin, stdInitial, xiaoheInitial, xiaohePinyin] = s;

  // 2. Standard initial match (1 char consumed from query)
  if (stdInitial && stdInitial === qc) {
    if (matchFromPosition(textInfo, textPos + 1, query, queryPos + 1)) {
      return true;
    }
  }

  // 3. Xiaohe double pinyin initial match (1 char consumed from query)
  if (xiaoheInitial && xiaoheInitial === qc) {
    if (matchFromPosition(textInfo, textPos + 1, query, queryPos + 1)) {
      return true;
    }
  }

  // 4. Xiaohe double pinyin full code match (2 chars consumed from query, or prefix of it)
  if (xiaohePinyin) {
    const xhLen = xiaohePinyin.length;
    const remainQ = query.length - queryPos;
    if (remainQ <= xhLen) {
      let match = true;
      for (let i = 0; i < remainQ; ++i) {
        if (xiaohePinyin[i] !== (query[queryPos + i] ?? '').toLowerCase()) {
          match = false;
          break;
        }
      }
      if (match) return true;
    } else {
      let match = true;
      for (let i = 0; i < xhLen; ++i) {
        if (xiaohePinyin[i] !== (query[queryPos + i] ?? '').toLowerCase()) {
          match = false;
          break;
        }
      }
      if (match && matchFromPosition(textInfo, textPos + 1, query, queryPos + xhLen)) {
        return true;
      }
    }
  }

  // 5. Full standard pinyin match (e.g. "wei", "zhi")
  if (pinyin) {
    const pyLen = pinyin.length;
    const remainQ = query.length - queryPos;
    if (remainQ <= pyLen) {
      let match = true;
      for (let i = 0; i < remainQ; ++i) {
        if (pinyin[i] !== (query[queryPos + i] ?? '').toLowerCase()) {
          match = false;
          break;
        }
      }
      if (match) return true;
    } else {
      let match = true;
      for (let i = 0; i < pyLen; ++i) {
        if (pinyin[i] !== (query[queryPos + i] ?? '').toLowerCase()) {
          match = false;
          break;
        }
      }
      if (match && matchFromPosition(textInfo, textPos + 1, query, queryPos + pyLen)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Matches @p text against @p query using:
 * 1. Direct Latin/literal case-insensitive substring match;
 * 2. Standard full pinyin (e.g. "weizhi" matches "位置");
 * 3. Standard initials/abbreviation (e.g. "w" or "wz" matches "位置");
 * 4. Xiaohe double pinyin initials (e.g. "wv" matches "位置", zh->v, ch->i, sh->u);
 * 5. Xiaohe double pinyin full code (e.g. "wwvi" matches "位置");
 * 6. Mixed alphanumeric & Chinese natural progression.
 */
export function matchPinyin(text: string | null | undefined, query: string | null | undefined): boolean {
  if (!text || !query) return true;
  const q = query.trim();
  if (!q) return true;

  // Fast direct substring check
  if (text.toLowerCase().includes(q.toLowerCase())) {
    return true;
  }

  const textInfo: CharInfo[] = [];
  for (let i = 0; i < text.length; ++i) {
    const cp = text.codePointAt(i) ?? 0;
    const isCjk = cp >= PINYIN_TABLE_START && cp <= PINYIN_TABLE_END;
    textInfo.push({
      char: text[i] ?? '',
      isCjk,
      syllable: isCjk ? lookupSyllable(cp) : null,
    });
  }

  // Try matching starting at every position in text
  for (let i = 0; i < textInfo.length; ++i) {
    if (matchFromPosition(textInfo, i, q, 0)) {
      return true;
    }
  }

  return false;
}
