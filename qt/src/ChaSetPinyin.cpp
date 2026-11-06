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

struct CharPinyinInfo {
  uint32_t codePoint = 0;
  char asciiLower = 0;
  bool isCjk = false;
  const PinyinSyllable *syllable = nullptr;
};

bool matchFromPosition(const std::vector<CharPinyinInfo> &textInfo,
                       size_t textPos,
                       QStringView query,
                       size_t queryPos) {
  if (queryPos >= static_cast<size_t>(query.size())) {
    return true; // All query characters matched
  }
  if (textPos >= textInfo.size()) {
    return false; // Ran out of text but query remains
  }

  const CharPinyinInfo &info = textInfo[textPos];
  const QChar qCh = query[static_cast<qsizetype>(queryPos)].toLower();
  const char qc = qCh.toLatin1();

  // 1. Literal character match
  if (!info.isCjk) {
    if (info.asciiLower == qc) {
      if (matchFromPosition(textInfo, textPos + 1, query, queryPos + 1)) {
        return true;
      }
    }
    return false;
  }

  // Exact Chinese character match in query
  if (query[static_cast<qsizetype>(queryPos)] == QChar(info.codePoint)) {
    if (matchFromPosition(textInfo, textPos + 1, query, queryPos + 1)) {
      return true;
    }
  }

  if (!info.syllable || qc == 0) {
    return false;
  }

  const PinyinSyllable &s = *info.syllable;

  // 2. Standard initial match (1 char consumed from query)
  if (s.stdInitial && s.stdInitial == qc) {
    if (matchFromPosition(textInfo, textPos + 1, query, queryPos + 1)) {
      return true;
    }
  }

  // 3. Xiaohe double pinyin initial match (1 char consumed from query)
  if (s.xiaoheInitial && s.xiaoheInitial == qc) {
    if (matchFromPosition(textInfo, textPos + 1, query, queryPos + 1)) {
      return true;
    }
  }

  // 4. Xiaohe double pinyin full code match (2 chars consumed from query, or prefix of it)
  if (s.xiaohePinyin[0] != '\0') {
    const size_t xhLen = (s.xiaohePinyin[1] != '\0') ? 2 : 1;
    const size_t remainQ = query.size() - queryPos;
    if (remainQ <= xhLen) {
      bool match = true;
      for (size_t i = 0; i < remainQ; ++i) {
        if (s.xiaohePinyin[i] != query[static_cast<qsizetype>(queryPos + i)].toLower().toLatin1()) {
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
        if (s.xiaohePinyin[i] != query[static_cast<qsizetype>(queryPos + i)].toLower().toLatin1()) {
          match = false;
          break;
        }
      }
      if (match) {
        if (matchFromPosition(textInfo, textPos + 1, query, queryPos + xhLen)) {
          return true;
        }
      }
    }
  }

  // 5. Full standard pinyin match (e.g. "wei", "zhi")
  if (s.pinyin && s.pinyin[0] != '\0') {
    const std::string_view py(s.pinyin);
    const size_t remainQ = query.size() - queryPos;
    if (remainQ <= py.size()) {
      bool match = true;
      for (size_t i = 0; i < remainQ; ++i) {
        if (py[i] != query[static_cast<qsizetype>(queryPos + i)].toLower().toLatin1()) {
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
        if (py[i] != query[static_cast<qsizetype>(queryPos + i)].toLower().toLatin1()) {
          match = false;
          break;
        }
      }
      if (match) {
        if (matchFromPosition(textInfo, textPos + 1, query, queryPos + py.size())) {
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
  if (query.isEmpty() || text.isEmpty()) {
    return true;
  }

  const QString q = query.trimmed();
  if (q.isEmpty()) {
    return true;
  }

  // Fast direct substring check
  if (text.contains(q, Qt::CaseInsensitive)) {
    return true;
  }

  std::vector<CharPinyinInfo> textInfo;
  textInfo.reserve(static_cast<size_t>(text.size()));

  for (qsizetype i = 0; i < text.size(); ++i) {
    const QChar ch = text[i];
    CharPinyinInfo info;
    info.codePoint = ch.unicode();
    info.asciiLower = ch.toLower().toLatin1();
    info.isCjk = (info.codePoint >= chaset::pinyin::kPinyinTableStart &&
                  info.codePoint <= chaset::pinyin::kPinyinTableEnd);
    if (info.isCjk) {
      info.syllable = lookupSyllable(info.codePoint);
    }
    textInfo.push_back(info);
  }

  const QStringView qView(q);
  for (size_t i = 0; i < textInfo.size(); ++i) {
    if (matchFromPosition(textInfo, i, qView, 0)) {
      return true;
    }
  }

  return false;
}
