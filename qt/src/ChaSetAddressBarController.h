// qt/src/ChaSetAddressBarController.h
//
// Controller for ChaSetAddressBar: handles path segmentation, editing state,
// navigation stack (back/forward/up), subfolder enumeration, suggestions, and
// history.
#pragma once

#include <QHash>
#include <QObject>
#include <QPointer>
#include <QQuickItem>
#include <QString>
#include <QStringList>
#include <QVariantList>
#include <QtQml/qqmlregistration.h>

class ChaSetAddressBarController : public QObject {
  Q_OBJECT
  QML_ELEMENT

  Q_PROPERTY(QString currentPath READ currentPath WRITE setCurrentPath NOTIFY
                 currentPathChanged)
  Q_PROPERTY(QString editingText READ editingText NOTIFY editingTextChanged)
  Q_PROPERTY(bool editing READ editing WRITE setEditing NOTIFY editingChanged)
  Q_PROPERTY(QVariantList segments READ segments NOTIFY segmentsChanged)
  Q_PROPERTY(QStringList history READ history NOTIFY historyChanged)
  Q_PROPERTY(bool canGoBack READ canGoBack NOTIFY navigationStackChanged)
  Q_PROPERTY(bool canGoForward READ canGoForward NOTIFY navigationStackChanged)
  Q_PROPERTY(QQuickItem *visualItem READ visualItem WRITE setVisualItem NOTIFY
                 visualItemChanged)
  Q_PROPERTY(QObject *suggestPopup READ suggestPopup WRITE setSuggestPopup
                 NOTIFY suggestPopupChanged)
  Q_PROPERTY(QObject *subfolderPopup READ subfolderPopup WRITE setSubfolderPopup
                 NOTIFY subfolderPopupChanged)

public:
  explicit ChaSetAddressBarController(QObject *parent = nullptr);
  ~ChaSetAddressBarController() override;

  [[nodiscard]] QQuickItem *visualItem() const { return m_visualItem; }
  void setVisualItem(QQuickItem *item);

  [[nodiscard]] QObject *suggestPopup() const { return m_suggestPopup; }
  void setSuggestPopup(QObject *popup);

  [[nodiscard]] QObject *subfolderPopup() const { return m_subfolderPopup; }
  void setSubfolderPopup(QObject *popup);

  bool eventFilter(QObject *watched, QEvent *event) override;

  [[nodiscard]] QString currentPath() const { return m_currentPath; }
  void setCurrentPath(const QString &path);

  [[nodiscard]] QString editingText() const;

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
  void editingTextChanged();
  void editingChanged();
  void segmentsChanged();
  void historyChanged();
  void navigationStackChanged();
  void visualItemChanged();
  void suggestPopupChanged();
  void subfolderPopupChanged();
  void navigateRequested(const QString &path);
  void navigateRequestedWithSelection(const QString &path,
                                      const QString &selectionPath);

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

  QString m_virtualBase;
  QString m_virtualName;
  QString m_virtualIcon;

  QPointer<QQuickItem> m_visualItem;
  QPointer<QObject> m_suggestPopup;
  QPointer<QObject> m_subfolderPopup;

  mutable bool m_foldersDirty = true;
  mutable QHash<QString, QString> m_knownFolders;
  mutable QHash<QString, QString> m_driveLabels;
};
