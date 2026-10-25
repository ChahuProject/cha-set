#include "ChaSetDocSource.h"

#include <QFile>

ChaSetDocSource::ChaSetDocSource(QObject *parent)
    : QObject(parent)
{
}

QString ChaSetDocSource::read(const QString &docId, const QString &locale) const
{
    // Defensive: doc ids and locale codes come from QML properties, never from user input,
    // but a crafted id such as "../.." must not escape the embedded content prefix.
    if (docId.isEmpty() || locale.isEmpty()) return {};
    if (docId.contains('/') || docId.contains('\\') || docId.contains(QStringLiteral(".."))) return {};
    if (locale.contains('/') || locale.contains('\\') || locale.contains(QStringLiteral(".."))) return {};

    QFile file(QStringLiteral(":/spec/content/%1/%2.md").arg(docId, locale));
    if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) return {};
    return QString::fromUtf8(file.readAll());
}
