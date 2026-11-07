// qt/src/ChaSetPinyin.cpp
#include "ChaSetPinyin.h"
#include "ChaSetPinyinTable.h"

#include <QChar>
#include <QStringView>
#include <string_view>
#include <vector>

namespace {

using chaset::pinyin::PinyinSyllable;
using chaset::pinyin::lookupSyllable;

struct UnicodeCharInfo {
  char32_t codePoint = 0;
  char32_t caseFolded = 0;
  char asciiLower = 0; // 'a'..'z' if ASCII letter, otherwise 0
  const PinyinSyllable *syllable = nullptr;
};

std::vector<UnicodeCharInfo> toCharInfoList(QStringView str) {
  std::vector<UnicodeCharInfo> list;
  list.reserve(static_cast<size_t>(str.size()));
  for (qsizetype i = 0; i < str.size(); ++i) {
    char32_t cp = 0;
    const QChar c1 = str[i];
    if (c1.isHighSurrogate() && (i + 1 < str.size()) && str[i + 1].isLowSurrogate()) {
      cp = QChar::surrogateToUcs4(c1, str[i + 1]);
      ++i;
    } else {
      cp = c1.unicode();
    }
    UnicodeCharInfo info;
    info.codePoint = cp;
    info.caseFolded = QChar::toCaseFolded(cp);
    if (cp >= 'A' && cp <= 'Z') {
      info.asciiLower = static_cast<char>(cp + ('a' - 'A'));
    } else if (cp >= 'a' && cp <= 'z') {
      info.asciiLower = static_cast<char>(cp);
    } else {
      info.asciiLower = 0;
    }
    info.syllable = lookupSyllable(cp);
    list.push_back(info);
  }
  return list;
}

bool hasAnyAsciiLetter(QStringView str) {
  for (const QChar ch : str) {
    const char16_t u = ch.unicode();
    if ((u >= 'a' && u <= 'z') || (u >= 'A' && u <= 'Z')) {
      return true;
    }
  }
  return false;
}

bool matchFromPosition(const std::vector<UnicodeCharInfo> &textInfo,
                       size_t textPos,
                       const std::vector<UnicodeCharInfo> &queryInfo,
                       size_t queryPos) {
  if (queryPos >= queryInfo.size()) {
    return true; // All query characters matched
  }
  if (textPos >= textInfo.size()) {
    return false; // Ran out of text but query remains
  }

  const UnicodeCharInfo &t = textInfo[textPos];
  const UnicodeCharInfo &q = queryInfo[queryPos];

  // 1. Literal / case-folded Unicode code point match (applies to all languages/scripts)
  if (t.caseFolded == q.caseFolded) {
    if (matchFromPosition(textInfo, textPos + 1, queryInfo, queryPos + 1)) {
      return true;
    }
  }

  // Pinyin matching is only possible if the text character has a pinyin syllable
  // AND the query character is an ASCII Latin letter ('a'..'z').
  if (!t.syllable || q.asciiLower == 0) {
    return false;
  }

  const PinyinSyllable &s = *t.syllable;
  const char qc = q.asciiLower;

  // 2. Standard initial match (1 char consumed from query)
  if (s.stdInitial && s.stdInitial == qc) {
    if (matchFromPosition(textInfo, textPos + 1, queryInfo, queryPos + 1)) {
      return true;
    }
  }

  // 3. Xiaohe double pinyin initial match (1 char consumed from query)
  // e.g. zh->v, ch->i, sh->u
  if (s.xiaoheInitial && s.xiaoheInitial == qc) {
    if (matchFromPosition(textInfo, textPos + 1, queryInfo, queryPos + 1)) {
      return true;
    }
  }

  // 4. Xiaohe double pinyin full code match (up to 2 chars consumed from query)
  // e.g. "ww" for wei, "vi" for zhi
  if (s.xiaohePinyin[0] != '\0') {
    const size_t xhLen = (s.xiaohePinyin[1] != '\0') ? 2 : 1;
    const size_t remainQ = queryInfo.size() - queryPos;
    if (remainQ <= xhLen) {
      bool match = true;
      for (size_t i = 0; i < remainQ; ++i) {
        if (s.xiaohePinyin[i] != queryInfo[queryPos + i].asciiLower) {
          match = false;
          break;
        }
      }
      if (match) {
        return true;
      }
    } else {
      bool match = true;
      for (size_t i = 0; i < xhLen; ++i) {
        if (s.xiaohePinyin[i] != queryInfo[queryPos + i].asciiLower) {
          match = false;
          break;
        }
      }
      if (match) {
        if (matchFromPosition(textInfo, textPos + 1, queryInfo, queryPos + xhLen)) {
          return true;
        }
      }
    }
  }

  // 5. Full standard pinyin match (e.g. "wei", "zhi")
  if (s.pinyin && s.pinyin[0] != '\0') {
    const std::string_view py(s.pinyin);
    const size_t remainQ = queryInfo.size() - queryPos;
    if (remainQ <= py.size()) {
      bool match = true;
      for (size_t i = 0; i < remainQ; ++i) {
        if (py[i] != queryInfo[queryPos + i].asciiLower) {
          match = false;
          break;
        }
      }
      if (match) {
        return true;
      }
    } else {
      bool match = true;
      for (size_t i = 0; i < py.size(); ++i) {
        if (py[i] != queryInfo[queryPos + i].asciiLower) {
          match = false;
          break;
        }
      }
      if (match) {
        if (matchFromPosition(textInfo, textPos + 1, queryInfo, queryPos + py.size())) {
          return true;
        }
      }
    }
  }

  return false;
}

} // namespace

ChaSetPinyin::ChaSetPinyin(QObject *parent) : QObject(parent) {}

bool ChaSetPinyin::match(const QString &text, const QString &query) {
  const QString q = query.trimmed();
  if (q.isEmpty() || text.isEmpty()) {
    return true;
  }

  // Fast direct substring check
  if (text.contains(q, Qt::CaseInsensitive)) {
    return true;
  }

  // If query does not contain any ASCII Latin letter, exact substring is the only possibility
  if (!hasAnyAsciiLetter(q)) {
    return false;
  }

  const auto textInfo = toCharInfoList(text);
  const auto queryInfo = toCharInfoList(q);

  for (size_t i = 0; i < textInfo.size(); ++i) {
    if (matchFromPosition(textInfo, i, queryInfo, 0)) {
      return true;
    }
  }

  return false;
}
