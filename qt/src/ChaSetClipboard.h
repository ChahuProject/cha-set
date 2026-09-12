#pragma once

#include <QObject>
#include <QtQml/qqmlregistration.h>
#include <QGuiApplication>
#include <QClipboard>

class ChaSetClipboard : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON

public:
    explicit ChaSetClipboard(QObject *parent = nullptr);

    Q_INVOKABLE void setText(const QString &text);
    Q_INVOKABLE QString text() const;
    Q_INVOKABLE void clear();
};
