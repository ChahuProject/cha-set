// qt/src/ChaSetAddressBarController.h
//
// Controller for ChaSetAddressBar: handles path segmentation, editing state,
// navigation stack (back/forward/up), subfolder enumeration, suggestions, and history.
#pragma once

#include <QHash>
#include <QObject>
#include <QString>
#include <QStringList>
#include <QVariantList>
#include <QtQml/qqmlregistration.h>

class ChaSetAddressBarController : public QObject {
    Q_OBJECT
    QML_ELEMENT

    Q_PROPERTY(QString currentPath READ currentPath WRITE setCurrentPath NOTIFY currentPathChanged)
    Q_PROPERTY(bool editing READ editing WRITE setEditing NOTIFY editingChanged)
    Q_PROPERTY(QVariantList segments READ segments NOTIFY segmentsChanged)
    Q_PROPERTY(QStringList history READ history NOTIFY historyChanged)
    Q_PROPERTY(bool canGoBack READ canGoBack NOTIFY navigationStackChanged)
    Q_PROPERTY(bool canGoForward READ canGoForward NOTIFY navigationStackChanged)

public:
    explicit ChaSetAddressBarController(QObject *parent = nullptr);
    ~ChaSetAddressBarController() override = default;

    [[nodiscard]] QString currentPath() const { return m_currentPath; }
    void setCurrentPath(const QString &path);

    [[nodiscard]] bool editing() const { return m_editing; }
    void setEditing(bool editing);

    [[nodiscard]] QVariantList segments() const { return m_segments; }
    [[nodiscard]] QStringList history() const;

    [[nodiscard]] bool canGoBack() const { return !m_backStack.isEmpty(); }
    [[nodiscard]] bool canGoForward() const { return !m_forwardStack.isEmpty(); }

    Q_INVOKABLE void enterEditMode();
    Q_INVOKABLE void exitEditMode();
    Q_INVOKABLE bool navigate(const QString &path);
    Q_INVOKABLE void goBack();
    Q_INVOKABLE void goForward();
    Q_INVOKABLE void navigateUp();
    Q_INVOKABLE QVariantList subfolders(const QString &path) const;
    Q_INVOKABLE QVariantList suggestions(const QString &text) const;
    Q_INVOKABLE void copyPathToClipboard(const QString &path);

signals:
    void currentPathChanged();
    void editingChanged();
    void segmentsChanged();
    void historyChanged();
    void navigationStackChanged();
    void navigateRequested(const QString &path);
    void navigateRequestedWithSelection(const QString &path, const QString &selectionPath);

private:
    void rebuildSegments();
    bool navigateValidated(const QString &rawPath, bool recordStack);
    void navigateToThisPc();
    const QHash<QString, QString> &knownFolders() const;
    const QHash<QString, QString> &driveLabels() const;
    void buildFolderMaps() const;

    QString m_currentPath;
    bool m_editing = false;
    QVariantList m_segments;
    QStringList m_backStack;
    QStringList m_forwardStack;

    mutable bool m_foldersDirty = true;
    mutable QHash<QString, QString> m_knownFolders;
    mutable QHash<QString, QString> m_driveLabels;
};
