#include "ChaSetClipboard.h"

ChaSetClipboard::ChaSetClipboard(QObject *parent)
    : QObject(parent)
{
}

void ChaSetClipboard::setText(const QString &text)
{
    if (auto *clipboard = QGuiApplication::clipboard()) {
        clipboard->setText(text, QClipboard::Clipboard);
    }
}

QString ChaSetClipboard::text() const
{
    if (auto *clipboard = QGuiApplication::clipboard()) {
        return clipboard->text(QClipboard::Clipboard);
    }
    return QString();
}

void ChaSetClipboard::clear()
{
    if (auto *clipboard = QGuiApplication::clipboard()) {
        clipboard->clear(QClipboard::Clipboard);
    }
}
