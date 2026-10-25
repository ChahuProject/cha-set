#pragma once

#include <QObject>
#include <QVariantList>
#include <QtQml/qqmlregistration.h>

// ChaSetTextFragments — line geometry for marked inline fragments.
//
// Qt's rich text cannot round corners and has no inline-item API, so a "chip" cannot be a
// QQuickItem inside the text flow. The workaround used here (and by KDE Dolphin's query
// builder before us) is to let QTextLayout own the text and ask it where a fragment ended up:
//
//   <a href="chip:duration-quick"><span ...>duration-quick</span></a>
//        ^ unambiguous marker            ^ characters that occupy real space
//
// QML then paints a rounded Rectangle *behind* the text at those coordinates. Nothing about
// line breaking, shaping, selection or copy changes — we only read the layout.
//
// Chip and marker are the same thing on purpose: the anchor href doubles as the payload for
// click-to-copy (linkActivated), so no extra bookkeeping is needed.
class ChaSetTextFragments : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON

public:
    explicit ChaSetTextFragments(QObject *parent = nullptr);

    /// Rects for every run of fragments whose anchor href starts with @p prefix.
    ///
    /// @p document is the QQuickTextDocument exposed by TextEdit.textDocument.
    /// Consecutive marked fragments are merged first: a chip is authored as three fragments
    /// (smaller padding cell, token, padding cell), and emitting one box per fragment would
    /// draw three pills. A run that wrapped across lines still yields one rect per line
    /// segment, so a chip that breaks in two is drawn as two boxes rather than one crossing
    /// the whole block.
    /// Returned entries are {x, y, w, h} in the text item's content coordinates.
    Q_INVOKABLE QVariantList fragmentRects(QObject *document, const QString &prefix) const;
};
