#pragma once

#include <QObject>
#include <QtQml/qqmlregistration.h>

// ChaSetDocSource — reads the embedded living-doc Markdown sources.
//
// QML has no file IO: XMLHttpRequest rejects the qrc scheme for both sync and async requests,
// so the Markdown that DocMarkdown.qml parses at runtime has to cross the C++ boundary. The
// file is embedded verbatim by qt/CMakeLists.txt (qt_add_resources) and parsed in QML by
// spec/shared/docAst.mjs — this class only hands over raw text.
class ChaSetDocSource : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON

public:
    explicit ChaSetDocSource(QObject *parent = nullptr);

    /// Returns the raw Markdown for spec/content/<docId>/<locale>.md, or an empty string.
    Q_INVOKABLE QString read(const QString &docId, const QString &locale) const;
};
