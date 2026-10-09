// qt/src/ChaSetPathUtil.h
//
// Pure path utility functions for ChaSetAddressBar (no UI / Quick
// dependencies). Supports path splitting (This PC root, Drive segments, Known
// Folders, UNC), environment variable expansion, natural sorting, and subfolder
// probing.
#pragma once

#include <QCollator>
#include <QCoreApplication>
#include <QDir>
#include <QDirIterator>
#include <QFileInfo>
#include <QHash>
#include <QString>
#include <QStringList>
#include <QVariantMap>

#include <algorithm>
#include <vector>

namespace chaset {

struct Segment {
  QString displayName;
  QString realPath;
  QString icon;
  bool isTopRoot = false;
  bool isRoot = false;
  bool isDrive = false;
  bool isKnownFolder = false;
  bool hasSubfolders = false;
};

inline QString formatDriveName(const QChar &driveLetter, const QString &label) {
  const QString letter = QString(driveLetter).toUpper();
  const QString driveText = QStringLiteral("%1:").arg(letter);
  if (label.isEmpty()) {
    return QCoreApplication::translate("ChaSet", "本地磁盘 (%1)")
        .arg(driveText);
  }
  return QStringLiteral("%1 (%2)").arg(label, driveText);
}

inline QString expandEnvVars(const QString &text) {
  QString out = text;
  int from = 0;
  while ((from = out.indexOf(QLatin1Char('%'), from)) >= 0) {
    const int end = out.indexOf(QLatin1Char('%'), from + 1);
    if (end < 0)
      break;
    const QString var = out.mid(from + 1, end - from - 1);
    const QString value = qEnvironmentVariable(var.toLocal8Bit().constData());
    if (!var.isEmpty() && !value.isEmpty()) {
      out.replace(from, end - from + 1, value);
      from += value.size();
    } else {
      from = end + 1;
    }
  }
  return out;
}

inline bool hasSubfolders(const QString &path) {
  if (path.isEmpty())
    return false;
  QDirIterator it(path, QDir::Dirs | QDir::NoDotAndDotDot,
                  QDirIterator::NoIteratorFlags);
  return it.hasNext();
}

inline void naturalSort(QStringList &names) {
  QCollator collator;
  collator.setNumericMode(true);
  collator.setCaseSensitivity(Qt::CaseInsensitive);
  std::sort(names.begin(), names.end(), collator);
}

namespace detail {

inline QString
knownFolderDisplayName(const QString &path,
                       const QHash<QString, QString> &knownFolders) {
  for (auto it = knownFolders.constBegin(); it != knownFolders.constEnd();
       ++it) {
    if (QString::compare(path, it.key(), Qt::CaseInsensitive) == 0) {
      return it.value();
    }
  }
  return {};
}

inline void appendDriveSegment(std::vector<Segment> &segs, const QChar &letter,
                               const QHash<QString, QString> &driveLabels) {
  const QString driveRoot = QStringLiteral("%1:/").arg(QString(letter));
  const QString label = driveLabels.value(QString(letter).toUpper());
  Segment seg;
  seg.displayName = formatDriveName(letter, label);
  seg.realPath = driveRoot;
  seg.icon = QStringLiteral("storage");
  seg.isDrive = true;
  segs.push_back(std::move(seg));
}

} // namespace detail

inline std::vector<Segment>
splitPath(const QString &absPath,
          const QHash<QString, QString> &knownFolders = {},
          const QHash<QString, QString> &driveLabels = {},
          const QString &virtualBase = {}, const QString &virtualName = {},
          const QString &virtualIcon = {}) {
  std::vector<Segment> segs;

  // 0. 顶层命名空间根：电脑 icon，无文本标签
  Segment topRoot;
  topRoot.displayName = QString();
  topRoot.realPath = QStringLiteral("::root");
  topRoot.icon = QStringLiteral("computer");
  topRoot.isTopRoot = true;
  topRoot.hasSubfolders = true;
  segs.push_back(std::move(topRoot));

  // 回收站模式：直接属于顶层根，不属于此电脑
  if (absPath == QLatin1String("recycle-bin:")) {
    Segment bin;
    bin.displayName = QCoreApplication::translate("ChaSet", "回收站");
    bin.realPath = QStringLiteral("recycle-bin:");
    bin.icon = QStringLiteral("recycling");
    bin.isRoot = false;
    bin.hasSubfolders = false;
    segs.push_back(std::move(bin));
    return segs;
  }

  // 虚拟已知文件夹模式：用户从顶层已知文件夹（音乐/文档/下载...）进入时，不显示真实物理前缀
  if (!virtualBase.isEmpty()) {
    const QString cleanBase =
        QDir::fromNativeSeparators(QDir::cleanPath(virtualBase));
    const QString cleanAbs =
        absPath.isEmpty()
            ? QString()
            : QDir::fromNativeSeparators(QDir::cleanPath(absPath));
    if (!cleanAbs.isEmpty() &&
        cleanAbs.startsWith(cleanBase, Qt::CaseInsensitive)) {
      Segment kfSeg;
      kfSeg.displayName =
          virtualName.isEmpty() ? QFileInfo(cleanBase).fileName() : virtualName;
      kfSeg.realPath = cleanBase;
      kfSeg.icon =
          virtualIcon.isEmpty() ? QStringLiteral("folder") : virtualIcon;
      kfSeg.isKnownFolder = true;
      kfSeg.hasSubfolders = hasSubfolders(cleanBase);
      segs.push_back(std::move(kfSeg));

      if (cleanAbs.size() > cleanBase.size()) {
        const QString rest = cleanAbs.mid(cleanBase.size());
        const QStringList parts =
            rest.split(QLatin1Char('/'), Qt::SkipEmptyParts);
        QString acc = cleanBase;
        for (const QString &part : parts) {
          acc += QLatin1Char('/');
          acc += part;
          Segment seg;
          seg.displayName = part;
          seg.realPath = acc;
          seg.icon = QStringLiteral("folder");
          seg.hasSubfolders = hasSubfolders(acc);
          segs.push_back(std::move(seg));
        }
      }
      return segs;
    }
  }

  // 此电脑段
  Segment root;
  root.displayName = QCoreApplication::translate("ChaSet", "此电脑");
  root.realPath = QString();
  root.icon = QStringLiteral("computer");
  root.isRoot = true;
  root.hasSubfolders = true;
  segs.push_back(std::move(root));

  if (absPath.isEmpty())
    return segs;

  QString p = QDir::fromNativeSeparators(QDir::cleanPath(absPath));
  if (p.isEmpty())
    return segs;

  // UNC: //server/share/dir
  if (p.startsWith(QLatin1String("//"))) {
    QString rest = p.mid(2);
    const int firstSlash = rest.indexOf(QLatin1Char('/'));
    if (firstSlash <= 0)
      return segs;
    const QString server = rest.left(firstSlash);
    const QString serverPath = QStringLiteral("//%1").arg(server);
    Segment srv;
    srv.displayName = server;
    srv.realPath = serverPath;
    srv.icon = QStringLiteral("computer");
    srv.isRoot = true;
    segs.push_back(std::move(srv));

    QString acc = serverPath;
    const QStringList parts =
        rest.mid(firstSlash + 1).split(QLatin1Char('/'), Qt::SkipEmptyParts);
    for (const QString &part : parts) {
      acc += QLatin1Char('/');
      acc += part;
      Segment seg;
      seg.displayName = part;
      seg.realPath = acc;
      seg.icon = QStringLiteral("folder");
      segs.push_back(std::move(seg));
    }
    return segs;
  }

  // Windows drive: C:/...
  if (p.size() >= 2 && p.at(0).isLetter() && p.at(1) == QLatin1Char(':')) {
    const QChar letter = p.at(0).toUpper();
    detail::appendDriveSegment(segs, letter, driveLabels);
    const QString driveRoot = QStringLiteral("%1:/").arg(QString(letter));
    const bool isDriveRoot =
        (p.size() == 2 || (p.size() == 3 && p.at(2) == QLatin1Char('/')));
    if (isDriveRoot)
      return segs;

    const QStringList parts =
        p.mid(3).split(QLatin1Char('/'), Qt::SkipEmptyParts);
    QString acc = driveRoot;
    for (const QString &part : parts) {
      acc += part;
      Segment seg;
      const QString known = detail::knownFolderDisplayName(acc, knownFolders);
      seg.displayName = known.isEmpty() ? part : known;
      seg.realPath = acc;
      seg.icon = QStringLiteral("folder");
      segs.push_back(std::move(seg));
      acc += QLatin1Char('/');
    }
    return segs;
  }

  // POSIX path: /var/log/...
  if (p.startsWith(QLatin1Char('/'))) {
    const QStringList parts = p.split(QLatin1Char('/'), Qt::SkipEmptyParts);
    QString acc = QString();
    for (const QString &part : parts) {
      acc += QLatin1Char('/');
      acc += part;
      Segment seg;
      seg.displayName = part;
      seg.realPath = acc;
      seg.icon = QStringLiteral("folder");
      segs.push_back(std::move(seg));
    }
    return segs;
  }

  // Generic fallback: relative or unusual path
  Segment seg;
  seg.displayName =
      QFileInfo(p).fileName().isEmpty() ? p : QFileInfo(p).fileName();
  seg.realPath = p;
  seg.icon = QStringLiteral("folder");
  segs.push_back(std::move(seg));
  return segs;
}

inline QVariantMap segmentToVariantMap(const Segment &seg) {
  QVariantMap map;
  map.insert(QStringLiteral("displayName"), seg.displayName);
  map.insert(QStringLiteral("realPath"), seg.realPath);
  map.insert(QStringLiteral("label"), seg.displayName);
  map.insert(QStringLiteral("path"), seg.realPath);
  map.insert(QStringLiteral("icon"), seg.icon);
  map.insert(QStringLiteral("isTopRoot"), seg.isTopRoot);
  map.insert(QStringLiteral("isRoot"), seg.isRoot);
  map.insert(QStringLiteral("isDrive"), seg.isDrive);
  map.insert(QStringLiteral("isKnownFolder"), seg.isKnownFolder);
  map.insert(QStringLiteral("hasSubfolders"), seg.hasSubfolders);
  return map;
}

} // namespace chaset
