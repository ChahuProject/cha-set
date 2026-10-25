#include "ChaSetTextFragments.h"

#include <QAbstractTextDocumentLayout>
#include <QFontMetricsF>
#include <QQuickTextDocument>
#include <QTextBlock>
#include <QTextDocument>
#include <QTextLayout>
#include <QTextLine>

ChaSetTextFragments::ChaSetTextFragments(QObject *parent)
    : QObject(parent)
{
}

QVariantList ChaSetTextFragments::fragmentRects(QObject *document, const QString &prefix) const
{
    QVariantList out;

    auto *quickDocument = qobject_cast<QQuickTextDocument *>(document);
    if (!quickDocument)
        return out;

    QTextDocument *doc = quickDocument->textDocument();
    if (!doc)
        return out;

    QAbstractTextDocumentLayout *documentLayout = doc->documentLayout();
    if (!documentLayout)
        return out;

    for (QTextBlock block = doc->begin(); block.isValid(); block = block.next()) {
        const QTextLayout *layout = block.layout();
        if (!layout || layout->lineCount() == 0)
            continue;

        // Block position inside the document (the block layout itself is 0-based).
        const qreal blockTop = documentLayout->blockBoundingRect(block).top();

        for (QTextBlock::iterator it = block.begin(); !it.atEnd(); ++it) {
            const QTextFragment fragment = it.fragment();
            if (!fragment.isValid())
                continue;

            const QTextCharFormat format = fragment.charFormat();
            if (!format.isAnchor() || !format.anchorHref().startsWith(prefix))
                continue;

            const QFontMetricsF metrics(format.font());
            const int fragmentStart = fragment.position() - block.position();
            const int fragmentEnd = fragmentStart + fragment.length();

            // A chip that wrapped occupies two boxes; walk it line by line.
            int position = fragmentStart;
            while (position < fragmentEnd) {
                const QTextLine line = layout->lineForTextPosition(position);
                if (!line.isValid())
                    break;

                const int lineStart = line.textStart();
                const int lineEnd = lineStart + line.textLength();
                if (lineEnd <= position)
                    break; // no forward progress; avoid an infinite loop on degenerate layouts

                int from = qMax(position, lineStart);
                int to = qMin(fragmentEnd, lineEnd);
                const qreal x0 = line.cursorToX(&from, QTextLine::Leading);
                const qreal x1 = line.cursorToX(&to, QTextLine::Trailing);

                // Align the box with the fragment's own baseline: the line's ascent belongs to
                // the tallest font on the line (body text), which is larger than the chip font.
                const qreal baseline = line.y() + line.ascent();
                QVariantMap rect;
                rect.insert(QStringLiteral("x"), x0);
                rect.insert(QStringLiteral("y"), blockTop + baseline - metrics.ascent());
                rect.insert(QStringLiteral("w"), qMax<qreal>(0, x1 - x0));
                rect.insert(QStringLiteral("h"), metrics.ascent() + metrics.descent());
                out.append(rect);

                position = to;
            }
        }
    }

    return out;
}
