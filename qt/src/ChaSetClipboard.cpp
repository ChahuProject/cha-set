#include "ChaSetClipboard.h"
#include <QThread>

ChaSetClipboard::ChaSetClipboard(QObject *parent)
    : QObject(parent)
{
}

void ChaSetClipboard::setText(const QString &text)
{
    m_lastSetText = text;
    if (auto *clipboard = QGuiApplication::clipboard()) {
        for (int retry = 0; retry < 5; ++retry) {
            clipboard->setText(text, QClipboard::Clipboard);
            if (clipboard->text(QClipboard::Clipboard) == text) {
                break;
            }
            QThread::msleep(10);
        }
    }
}

QString ChaSetClipboard::text() const
{
    if (auto *clipboard = QGuiApplication::clipboard()) {
        QString t = clipboard->text(QClipboard::Clipboard);
        if (!t.isEmpty()) return t;
    }
    return m_lastSetText;
}

void ChaSetClipboard::clear()
{
    m_lastSetText.clear();
    if (auto *clipboard = QGuiApplication::clipboard()) {
        clipboard->clear(QClipboard::Clipboard);
    }
}
