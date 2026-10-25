#include "ChaSetTextFragments.h"

#include <QAbstractTextDocumentLayout>
#include <QFontMetricsF>
#include <QQuickTextDocument>
#include <QTextBlock>
#include <QTextCharFormat>
#include <QTextDocument>
#include <QTextFragment>
#include <QTextLayout>
#include <QTextLine>
#include <QVector>

namespace {

/// One contiguous range of marked characters, flattened to what the painter needs.
struct Run
{
    int start = 0;   // block-relative character index (inclusive)
    int end = 0;     // block-relative character index (exclusive)
    qreal ascent = 0;
    qreal descent = 0;
    QString payload;
};

} // namespace

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

        // A chip is built from more than one fragment: the padding cells use a smaller font
        // than the token itself so the pill hugs the text instead of ballooning. Merge
        // consecutive marked fragments so one chip yields one box, not one per fragment.
        QVector<Run> runs;
        for (QTextBlock::iterator it = block.begin(); !it.atEnd(); ++it) {
            const QTextFragment fragment = it.fragment();
            if (!fragment.isValid())
                continue;

            const QTextCharFormat format = fragment.charFormat();
            if (!format.isAnchor() || !format.anchorHref().startsWith(prefix))
                continue;

            const QString href = format.anchorHref();
            const QString payload = href.startsWith(prefix) ? href.mid(prefix.length()) : QString();
            const QFontMetricsF metrics(format.font());
            const int start = fragment.position() - block.position();
            const int end = start + fragment.length();

            if (!runs.isEmpty() && runs.last().end == start) {
                Run &run = runs.last();
                run.end = end;
                // The pill is as tall as the tallest part of the chip (the token, not the
                // padding cells).
                if (metrics.ascent() + metrics.descent() > run.ascent + run.descent) {
                    run.ascent = metrics.ascent();
                    run.descent = metrics.descent();
                }
                if (run.payload.isEmpty())
                    run.payload = payload;
            } else {
                runs.append(Run{start, end, metrics.ascent(), metrics.descent(), payload});
            }
        }

        for (const Run &run : runs) {
            // A chip that wrapped occupies two boxes; walk it line by line.
            int position = run.start;
            while (position < run.end) {
                const QTextLine line = layout->lineForTextPosition(position);
                if (!line.isValid())
                    break;

                const int lineStart = line.textStart();
                const int lineEnd = lineStart + line.textLength();
                if (lineEnd <= position)
                    break; // no forward progress; avoid an infinite loop on degenerate layouts

                int from = qMax(position, lineStart);
                int to = qMin(run.end, lineEnd);
                // Both edges use Leading: Trailing at the end position would return the right
                // edge of the *next* character, overshooting the pill by one advance width
                // (measured: 3 CSS px too much on the right).
                const qreal x0 = line.cursorToX(&from, QTextLine::Leading);
                const qreal x1 = line.cursorToX(&to, QTextLine::Leading);

                // Align the box with the run's own baseline: the line's ascent belongs to the
                // tallest font on the line (body text), which is larger than the chip font.
                const qreal baseline = line.y() + line.ascent();
                QVariantMap rect;
                rect.insert(QStringLiteral("x"), x0);
                rect.insert(QStringLiteral("y"), blockTop + baseline - run.ascent);
                rect.insert(QStringLiteral("w"), qMax<qreal>(0, x1 - x0));
                rect.insert(QStringLiteral("h"), run.ascent + run.descent);
                rect.insert(QStringLiteral("payload"), run.payload);
                out.append(rect);

                position = to;
            }
        }
    }

    return out;
}
