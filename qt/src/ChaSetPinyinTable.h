// qt/src/ChaSetPinyinTable.h
// Compact read-only Pinyin and Xiaohe Double Pinyin syllable table for Unicode BMP CJK.
#pragma once

#include <cstdint>
#include <string_view>

namespace chaset::pinyin {

struct PinyinSyllable {
  const char *pinyin;          // Full pinyin, e.g. "wei"
  char stdInitial;             // Standard initial letter, e.g. 'w'
  char xiaoheInitial;          // Xiaohe double pinyin initial, e.g. 'w' (zh->v, ch->i, sh->u)
  char xiaohePinyin[4];        // Xiaohe double pinyin 2-char code, e.g. "ww"
};

constexpr uint32_t kPinyinTableStart = 0x4E00;
constexpr uint32_t kPinyinTableEnd = 0x9FA5;
constexpr uint32_t kPinyinTableSize = kPinyinTableEnd - kPinyinTableStart + 1;

// Returns syllable pointer for a Unicode code point, or nullptr if not a CJK ideograph.
const PinyinSyllable *lookupSyllable(uint32_t codePoint);

} // namespace chaset::pinyin
