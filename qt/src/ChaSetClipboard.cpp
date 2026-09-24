#include "ChaSetClipboard.h"
#include <QThread>

ChaSetClipboard::ChaSetClipboard(QObject *parent)
    : QObject(parent)
{
}

void ChaSetClipboard::setText(const QString &text)
{
    s_lastSetText = text;
    if (auto *clipboard = QGuiApplication::clipboard()) {
        clipboard->setText(text, QClipboard::Clipboard);
    }
}

QString ChaSetClipboard::text() const
{
    if (auto *clipboard = QGuiApplication::clipboard()) {
        QString t = clipboard->text(QClipboard::Clipboard);
        if (!t.isEmpty()) return t;
    }
    return s_lastSetText;
}

void ChaSetClipboard::clear()
{
    s_lastSetText.clear();
    if (auto *clipboard = QGuiApplication::clipboard()) {
        clipboard->clear(QClipboard::Clipboard);
    }
}
