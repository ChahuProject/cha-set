// qt/src/ChaSetPinyin.h
// ChaSet QML-exposed multi-modal Pinyin and Xiaohe Double Pinyin matching engine.
#pragma once

#include <QObject>
#include <QString>
#include <QtQml/qqmlregistration.h>

class ChaSetPinyin : public QObject
{
    Q_OBJECT
    QML_ELEMENT
    QML_SINGLETON

public:
    explicit ChaSetPinyin(QObject *parent = nullptr);

    /**
     * Matches @p text against @p query using:
     * 1. Direct Latin/literal case-insensitive substring match;
     * 2. Standard full pinyin (e.g. "weizhi" matches "位置");
     * 3. Standard initials/abbreviation (e.g. "w" or "wz" matches "位置");
     * 4. Xiaohe double pinyin initials (e.g. "wv" matches "位置", zh->v, ch->i, sh->u);
     * 5. Xiaohe double pinyin full code (e.g. "wwvi" matches "位置");
     * 6. Mixed alphanumeric & Chinese natural progression.
     */
    Q_INVOKABLE static bool match(const QString &text, const QString &query);
};
