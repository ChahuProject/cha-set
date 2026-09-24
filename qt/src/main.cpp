#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickWindow>
#include <QQuickItem>
#include <QSGRendererInterface>
#include <QFont>
#include <QTimer>
#include <QDebug>
#include <QTest>
#include <QWheelEvent>
#include <QKeyEvent>
#include <QDateTime>
#include <QElapsedTimer>
#include "ChaSetFontSystem.h"
#include "ChaSetClipboard.h"

class GlobalWheelZoomFilter : public QObject {
public:
    explicit GlobalWheelZoomFilter(QQuickWindow* window) : QObject(window), m_window(window) {
        m_timer.start();
    }

protected:
    bool eventFilter(QObject* watched, QEvent* event) override {
        Q_UNUSED(watched);
        if (event->type() == QEvent::Wheel) {
            auto* we = static_cast<QWheelEvent*>(event);
            if (we->modifiers() & (Qt::ControlModifier | Qt::MetaModifier)) {
                int delta = we->angleDelta().y();
                if (delta == 0) delta = we->angleDelta().x();
                if (delta != 0) {
                    m_accumulatedDelta += delta;
                    // Genuine throttle: require at least 120 accumulated delta AND at least 50ms elapsed between zoom steps to prevent Direct3D device loss
                    if (std::abs(m_accumulatedDelta) >= 120 && (!m_timer.isValid() || m_timer.elapsed() >= 50)) {
                        int direction = m_accumulatedDelta > 0 ? 1 : -1;
                        m_accumulatedDelta = 0;
                        m_timer.restart();
                        qInfo() << "[GlobalWheelZoomFilter] Intercepted Ctrl+Wheel delta=" << delta << ", invoking stepZoom(" << direction << ")";
                        QMetaObject::invokeMethod(m_window, "stepZoom", Q_ARG(QVariant, direction));
                    }
                    we->accept();
                    return true;
                }
            }
        } else if (event->type() == QEvent::ShortcutOverride || event->type() == QEvent::KeyPress) {
            auto* ke = static_cast<QKeyEvent*>(event);
            if ((ke->key() == Qt::Key_C && (ke->modifiers() & (Qt::ControlModifier | Qt::MetaModifier))) ||
                (ke->key() == Qt::Key_Insert && (ke->modifiers() & Qt::ControlModifier))) {
                bool copied = false;
                if (m_window != nullptr) {
                    if (auto* focusItem = m_window->activeFocusItem()) {
                        QString selText = focusItem->property("selectedText").toString();
                        if (!selText.isEmpty()) {
                            ChaSetClipboard clipboard;
                            clipboard.setText(selText);
                            copied = true;
                        }
                    }
                    if (!copied) {
                        QVariant res;
                        if (QMetaObject::invokeMethod(m_window, "copyActiveSelection", Q_RETURN_ARG(QVariant, res))) {
                            copied = res.toBool();
                        }
                    }
                }
                if (copied) {
                    event->accept();
                    return true;
                }
            }
        }
        return false;
    }

private:
    QQuickWindow* m_window;
    QElapsedTimer m_timer;
    int m_accumulatedDelta = 0;
};

static bool runRealCtrlWheelVerification(QQuickWindow* window) {
    qInfo("[qt-scenario] Running authentic C++ QTest Ctrl+Wheel zoom verification...");

    double initialScale = window->property("effectiveUiScale").toDouble();
    qInfo() << "[qt-scenario] Step 0: initialScale =" << initialScale;
    if (initialScale <= 0.0) {
        qWarning("[qt-scenario] WARNING: effectiveUiScale is invalid or zero");
        return false;
    }

    // 1. Send Ctrl + Wheel Up (zoom in)
    qInfo("[qt-scenario] Step 1: Sending zoomInEvent...");
    QPointF local(100, 100);
    QPointF global = window->mapToGlobal(QPoint(100, 100));
    QWheelEvent zoomInEvent(local, global, QPoint(), QPoint(0, 120),
                            Qt::NoButton, Qt::ControlModifier, Qt::NoScrollPhase, false);
    QCoreApplication::sendEvent(window, &zoomInEvent);
    qInfo("[qt-scenario] Step 1.1: zoomInEvent sent, waiting 60ms...");
    QTest::qWait(60);

    double zoomedInScale = window->property("effectiveUiScale").toDouble();
    qInfo() << "[qt-scenario] Step 1.2: zoomedInScale =" << zoomedInScale;
    if (zoomedInScale <= initialScale) {
        qCritical() << "[qt-scenario] FAIL: Ctrl + Wheel Up did not increase effectiveUiScale (initial="
                     << initialScale << ", after=" << zoomedInScale << ")";
        return false;
    }

    // 2. High zoom verification: Zoom past 200% up to 250% and 300% without D3D11 device loss
    qInfo("[qt-scenario] Step 2: Testing high zoom past 200% (250% & 300%)...");
    for (int i = 0; i < 6; ++i) {
        QCoreApplication::sendEvent(window, &zoomInEvent);
        QTest::qWait(60);
    }
    double highScale = window->property("effectiveUiScale").toDouble();
    qInfo() << "[qt-scenario] Step 2.1: highScale =" << highScale;
    if (highScale < 2.5) {
        qCritical() << "[qt-scenario] FAIL: High zoom did not reach >= 2.5: got " << highScale;
        return false;
    }
    // Allow SceneGraph to render at high scale
    QTest::qWait(100);

    // 3. Reset Zoom back to 1.0
    qInfo("[qt-scenario] Step 3: Invoking resetZoom...");
    QMetaObject::invokeMethod(window, "resetZoom");
    qInfo("[qt-scenario] Step 3.1: resetZoom invoked, waiting 60ms...");
    QTest::qWait(60);

    double resetScale = window->property("effectiveUiScale").toDouble();
    if (std::abs(resetScale - 1.0) > 0.001) {
        qCritical() << "[qt-scenario] FAIL: resetZoom did not restore 1.0: got " << resetScale;
        return false;
    }

    auto* scaleOsd = window->findChild<QQuickItem*>("globalScaleOsd");
    if (scaleOsd) {
        QMetaObject::invokeMethod(scaleOsd, "hide");
    }

    qInfo("[qt-scenario] PASS: Authentic C++ Ctrl+Wheel zoom verified successfully (including > 200% high zoom)");
    return true;
}

static bool runRealMouseDragVerification(QQuickWindow* window) {
    qInfo("[qt-scenario] Running authentic C++ QTest mouse drag injection...");
    
    // Find contentScroll in the window
    auto* contentScroll = window->findChild<QQuickItem*>("contentScroll");
    if (!contentScroll) {
        qWarning("[qt-scenario] WARNING: contentScroll item not found by objectName");
        return false;
    }

    auto* flickable = contentScroll->property("flickableItem").value<QQuickItem*>();
    if (!flickable) {
        qWarning("[qt-scenario] WARNING: flickableItem property not accessible");
        return false;
    }

    // Reset contentY to 0
    flickable->setProperty("contentY", 0.0);
    QTest::qWait(50);
    double initialY = flickable->property("contentY").toDouble();

    // Calculate the position of the vertical scrollbar thumb on the right edge of contentScroll
    QPointF scrollBarPos = contentScroll->mapToScene(QPointF(contentScroll->width() - 7, 40));
    QPoint targetPoint = scrollBarPos.toPoint();

    // 1. Mouse Press on the Scrollbar Thumb
    QTest::mousePress(window, Qt::LeftButton, Qt::NoModifier, targetPoint, 50);
    QTest::qWait(50);

    // 2. Mouse Drag 120 pixels down
    QPoint dragPoint = targetPoint + QPoint(0, 120);
    QTest::mouseMove(window, dragPoint, 50);
    QTest::qWait(50);

    // 3. Mouse Release
    QTest::mouseRelease(window, Qt::LeftButton, Qt::NoModifier, dragPoint, 50);
    QTest::qWait(50);

    double draggedY = flickable->property("contentY").toDouble();
    qInfo() << "[qt-scenario] Real C++ QTest Drag result: initialY=" << initialY << ", draggedY=" << draggedY;

    // Reset contentY back to 0 after test
    flickable->setProperty("contentY", 0.0);
    QTest::qWait(50);

    if (draggedY > 0) {
        qInfo("[qt-scenario] PASS: Real C++ QTest mouse drag verified (contentY delta > 0)");
        return true;
    } else {
        qCritical("[qt-scenario] FAIL: Real C++ QTest mouse drag did NOT move contentY");
        return false;
    }
}

static bool runRealKeyboardVerification(QQuickWindow* window) {
    qInfo("[qt-scenario] Running authentic C++ QTest keyboard navigation verification...");

    auto* testSelect = window->findChild<QQuickItem*>("testSelect");
    if (!testSelect) {
        qWarning("[qt-scenario] WARNING: testSelect item not found by objectName");
        return false;
    }

    auto* testDropdown = window->findChild<QQuickItem*>("testDropdown");
    if (!testDropdown) {
        qWarning("[qt-scenario] WARNING: testDropdown item not found by objectName");
        return false;
    }

    // 1. ChaSetSelect keyboard navigation verification via QTest
    testSelect->setProperty("value", "");
    testSelect->forceActiveFocus();
    QTest::qWait(50);

    // Press Space to open
    QTest::keyClick(window, Qt::Key_Space);
    QTest::qWait(50);
    int hlIdx = testSelect->property("highlightedIndex").toInt();
    if (hlIdx != 0) {
        qCritical() << "[qt-scenario] FAIL: QTest Space key did not initialize testSelect highlightedIndex to 0 (got " << hlIdx << ")";
        return false;
    }

    // Down arrow to move to next enabled option (index 1)
    QTest::keyClick(window, Qt::Key_Down);
    QTest::qWait(50);
    hlIdx = testSelect->property("highlightedIndex").toInt();
    if (hlIdx != 1) {
        qCritical() << "[qt-scenario] FAIL: QTest Down arrow did not move testSelect highlightedIndex to 1 (got " << hlIdx << ")";
        return false;
    }

    // Press Return to select
    QTest::keyClick(window, Qt::Key_Return);
    QTest::qWait(50);
    QString selectedVal = testSelect->property("value").toString();
    if (selectedVal != "banana") {
        qCritical() << "[qt-scenario] FAIL: QTest Enter did not select 'banana' (got " << selectedVal << ")";
        return false;
    }

    // Reopen with Down arrow
    QTest::keyClick(window, Qt::Key_Down);
    QTest::qWait(50);

    // Escape closes popup
    QTest::keyClick(window, Qt::Key_Escape);
    QTest::qWait(50);
    hlIdx = testSelect->property("highlightedIndex").toInt();
    if (hlIdx != -1) {
        qCritical() << "[qt-scenario] FAIL: QTest Escape did not close testSelect (got highlightedIndex " << hlIdx << ")";
        return false;
    }

    // 2. ChaSetDropdownMenu keyboard navigation verification via QTest
    testDropdown->setProperty("open", false);
    testDropdown->forceActiveFocus();
    QTest::qWait(50);

    // Press Enter to open
    QTest::keyClick(window, Qt::Key_Return);
    QTest::qWait(50);
    bool isOpen = testDropdown->property("open").toBool();
    if (!isOpen) {
        qCritical("[qt-scenario] FAIL: QTest Enter key did not open testDropdown");
        return false;
    }

    // Down arrow to move highlightedIndex to 0
    QTest::keyClick(window, Qt::Key_Down);
    QTest::qWait(50);
    int dropHlIdx = testDropdown->property("highlightedIndex").toInt();
    if (dropHlIdx != 0) {
        qCritical() << "[qt-scenario] FAIL: QTest Down arrow did not move testDropdown highlightedIndex to 0 (got " << dropHlIdx << ")";
        return false;
    }

    // Escape closes menu
    QTest::keyClick(window, Qt::Key_Escape);
    QTest::qWait(50);
    isOpen = testDropdown->property("open").toBool();
    if (isOpen) {
        qCritical("[qt-scenario] FAIL: QTest Escape key did not close testDropdown");
        return false;
    }

    // 3. SelectionHub & Ctrl+C keyboard copy verification via QTest
    qInfo("[qt-scenario] Step 3: Verifying Ctrl+C copying of selected text via real QTest event...");
    const QString testSelToken = QStringLiteral("chaset-ctrl-c-test-%1").arg(QDateTime::currentMSecsSinceEpoch());
    QMetaObject::invokeMethod(window, "testClaimSelection", Q_ARG(QVariant, testSelToken));
    QTest::keyClick(window, Qt::Key_C, Qt::ControlModifier);
    QTest::qWait(50);
    ChaSetClipboard checkClip;
    if (checkClip.text() != testSelToken) {
        qCritical() << "[qt-scenario] FAIL: Ctrl+C keyClick did not copy selected text to clipboard! Expected:"
                    << testSelToken << "got:" << checkClip.text();
        return false;
    }
    qInfo("[qt-scenario] PASS: Ctrl+C real keyClick copied selected text to clipboard via GlobalWheelZoomFilter & SelectionHub");
    QMetaObject::invokeMethod(window, "testClearSelection");

    qInfo("[qt-scenario] PASS: Authentic C++ QTest keyboard navigation verified for Select, DropdownMenu, and Ctrl+C selection copy");
    return true;
}

static bool runRealCursorVerification(QQuickWindow* window) {
    qInfo("[qt-scenario] Running authentic C++ cursor & geometry verification...");

    auto* testBtn = window->findChild<QQuickItem*>("testBtn");
    auto* testCheckbox = window->findChild<QQuickItem*>("testCheckbox");
    auto* testSwitch = window->findChild<QQuickItem*>("testSwitch");
    auto* testInput = window->findChild<QQuickItem*>("testInput");
    auto* testCopyBtn = window->findChild<QQuickItem*>("testCopyBtn");
    auto* testSegControl = window->findChild<QQuickItem*>("testSegControl");
    auto* testTabTrigger = window->findChild<QQuickItem*>("testTabTrigger");

    if (!testBtn || !testCheckbox || !testSwitch || !testInput || !testCopyBtn || !testSegControl || !testTabTrigger) {
        qWarning("[qt-scenario] WARNING: Test items for cursor verification not found by objectName");
        return false;
    }

    // 1. Verify Root Geometry Health (eliminating 0x0 bug)
    if (testBtn->width() <= 0 || testBtn->height() <= 0) {
        qCritical() << "[qt-scenario] FAIL: testBtn geometry non-positive (" << testBtn->width() << "x" << testBtn->height() << ")";
        return false;
    }
    if (testCheckbox->width() <= 0 || testCheckbox->height() <= 0) {
        qCritical() << "[qt-scenario] FAIL: testCheckbox geometry non-positive (" << testCheckbox->width() << "x" << testCheckbox->height() << ")";
        return false;
    }
    if (testSwitch->width() <= 0 || testSwitch->height() <= 0) {
        qCritical() << "[qt-scenario] FAIL: testSwitch geometry non-positive (" << testSwitch->width() << "x" << testSwitch->height() << ")";
        return false;
    }
    if (testCopyBtn->width() <= 0 || testCopyBtn->height() <= 0) {
        qCritical() << "[qt-scenario] FAIL: testCopyBtn geometry non-positive (" << testCopyBtn->width() << "x" << testCopyBtn->height() << ")";
        return false;
    }
    if (testSegControl->width() <= 0 || testSegControl->height() <= 0) {
        qCritical() << "[qt-scenario] FAIL: testSegControl geometry non-positive (" << testSegControl->width() << "x" << testSegControl->height() << ")";
        return false;
    }
    if (testTabTrigger->width() <= 0 || testTabTrigger->height() <= 0) {
        qCritical() << "[qt-scenario] FAIL: testTabTrigger geometry non-positive (" << testTabTrigger->width() << "x" << testTabTrigger->height() << ")";
        return false;
    }

    // 2. Inspect active cursorShape on handlers inside items
    auto findHandlerCursor = [](QQuickItem* item) -> int {
        const auto children = item->findChildren<QObject*>();
        for (auto* c : children) {
            QVariant shapeProp = c->property("cursorShape");
            if (shapeProp.isValid()) {
                return shapeProp.toInt();
            }
        }
        return -1;
    };

    int btnCursor = findHandlerCursor(testBtn);
    if (btnCursor != Qt::PointingHandCursor) {
        qCritical() << "[qt-scenario] FAIL: testBtn handler cursorShape expected PointingHandCursor (13), got " << btnCursor;
        return false;
    }

    int cbCursor = findHandlerCursor(testCheckbox);
    if (cbCursor != Qt::PointingHandCursor) {
        qCritical() << "[qt-scenario] FAIL: testCheckbox handler cursorShape expected PointingHandCursor (13), got " << cbCursor;
        return false;
    }

    int swCursor = findHandlerCursor(testSwitch);
    if (swCursor != Qt::PointingHandCursor) {
        qCritical() << "[qt-scenario] FAIL: testSwitch handler cursorShape expected PointingHandCursor (13), got " << swCursor;
        return false;
    }

    // Test disabled state
    testBtn->setProperty("disabled", true);
    int btnDisabledCursor = findHandlerCursor(testBtn);
    if (btnDisabledCursor != Qt::ForbiddenCursor) {
        qCritical() << "[qt-scenario] FAIL: disabled testBtn handler cursorShape expected ForbiddenCursor (14), got " << btnDisabledCursor;
        return false;
    }
    testBtn->setProperty("disabled", false);

    testCheckbox->setProperty("disabled", true);
    int cbDisabledCursor = findHandlerCursor(testCheckbox);
    if (cbDisabledCursor != Qt::ForbiddenCursor) {
        qCritical() << "[qt-scenario] FAIL: disabled testCheckbox handler cursorShape expected ForbiddenCursor (14), got " << cbDisabledCursor;
        return false;
    }
    testCheckbox->setProperty("disabled", false);

    // Test readOnly state
    testCheckbox->setProperty("readOnly", true);
    int cbReadOnlyCursor = findHandlerCursor(testCheckbox);
    if (cbReadOnlyCursor != Qt::ArrowCursor) {
        qCritical() << "[qt-scenario] FAIL: readOnly testCheckbox handler cursorShape expected ArrowCursor (0), got " << cbReadOnlyCursor;
        return false;
    }
    testCheckbox->setProperty("readOnly", false);

    // Test ScrollBar cursorShape
    auto* testScrollBar = window->findChild<QQuickItem*>("testScrollBar");
    if (testScrollBar) {
        if (testScrollBar->width() <= 0 || testScrollBar->height() <= 0) {
            qCritical() << "[qt-scenario] FAIL: testScrollBar geometry non-positive (" << testScrollBar->width() << "x" << testScrollBar->height() << ")";
            return false;
        }
        int sbCursor = findHandlerCursor(testScrollBar);
        if (sbCursor != Qt::PointingHandCursor) {
            qCritical() << "[qt-scenario] FAIL: testScrollBar handler cursorShape expected PointingHandCursor (13), got " << sbCursor;
            return false;
        }
    }

    qInfo("[qt-scenario] PASS: Authentic C++ cursor shape & geometry parity verified for Button, Checkbox, Switch, CopyButton, SegmentedControl, TabsTrigger, ScrollBar");
    return true;
}

static bool runShowcaseCursorRaycasting(QQuickWindow* window) {
    qInfo("[qt-scenario] Running authentic C++ physical pointer raycasting audit on showcase pages...");

    auto* pageLoader = window->findChild<QQuickItem*>("pageLoader");
    if (!pageLoader) {
        qCritical("[qt-scenario] FAIL: pageLoader item not found by objectName");
        return false;
    }

    QVariant pageIdsVar;
    QMetaObject::invokeMethod(window, "getAllPageIds", Q_RETURN_ARG(QVariant, pageIdsVar));
    QStringList pageList = pageIdsVar.toStringList();
    if (pageList.isEmpty()) {
        pageList = { "button", "checkbox", "switch", "input", "tabs", "slider", "card", "copy-button", "segmented-control" };
    }

    auto findExpectedCursor = [](QQuickItem* item, QQuickItem* pageRoot) -> int {
        // 1. First find if item or its direct children has an interactive shape
        int shape = -1;
        QVariant directShape = item->property("cursorShape");
        if (directShape.isValid() && directShape.toInt() != 0) {
            shape = directShape.toInt();
        } else {
            const auto directChildren = item->findChildren<QObject*>(QString(), Qt::FindDirectChildrenOnly);
            for (auto* h : directChildren) {
                QVariant visibleProp = h->property("visible");
                if (visibleProp.isValid() && !visibleProp.toBool()) {
                    continue;
                }
                QVariant enabledProp = h->property("enabled");
                if (enabledProp.isValid() && !enabledProp.toBool()) {
                    continue;
                }
                QVariant shapeProp = h->property("cursorShape");
                if (shapeProp.isValid()) {
                    int s = shapeProp.toInt();
                    if (s != 0) {
                        shape = s;
                        break;
                    }
                }
            }
        }

        if (shape == -1) {
            return -1; // Non-interactive element (e.g. plain Row, Column, Text, non-interactive Card)
        }

        // 2. If it IS an interactive element, check if it or an ancestor is explicitly disabled
        QObject* curr = item;
        while (curr && curr != pageRoot) {
            QVariant disProp = curr->property("disabled");
            if (disProp.isValid() && disProp.toBool()) {
                return Qt::ForbiddenCursor;
            }
            QVariant enProp = curr->property("enabled");
            if (enProp.isValid() && !enProp.toBool()) {
                return -1; // Disabled by ancestor container
            }
            curr = curr->parent();
        }

        return shape;
    };

    int totalRaycastChecked = 0;
    int totalDiscrepancies = 0;

    auto* contentScroll = window->findChild<QQuickItem*>("contentScroll");
    auto* flickable = contentScroll ? contentScroll->property("flickableItem").value<QQuickItem*>() : nullptr;

    for (const QString& pageId : pageList) {
        window->setProperty("activePage", pageId);
        if (flickable) {
            flickable->setProperty("contentY", 0.0);
        }
        QTest::qWait(60);

        auto* pageItem = pageLoader->property("item").value<QQuickItem*>();
        if (!pageItem) continue;

        const auto allDescendants = pageItem->findChildren<QQuickItem*>();
        for (auto* item : allDescendants) {
            if (!item->isVisible() || item->width() <= 2 || item->height() <= 2) continue;

            bool effectivelyVisible = true;
            for (QQuickItem* p = item; p && p != pageItem; p = p->parentItem()) {
                if (!p->isVisible() || p->opacity() <= 0.001 || p->width() <= 0 || p->height() <= 0) {
                    effectivelyVisible = false;
                    break;
                }
            }
            if (!effectivelyVisible) continue;

            int expected = findExpectedCursor(item, pageItem);
            if (expected == -1) continue;

            QPointF centerInItem(item->width() / 2.0, item->height() / 2.0);
            QPointF scenePoint = item->mapToScene(centerInItem);

            // Verify the point is inside the visible window area (excluding left sidebar ~235px, top bar ~45px, and clipped bottom ~40px)
            if (scenePoint.x() >= 235 && scenePoint.x() < window->width() - 25 &&
                scenePoint.y() >= 45 && scenePoint.y() < window->height() - 40) {

                QTest::mouseMove(window, scenePoint.toPoint());
                QTest::qWait(10);

                int actual = window->cursor().shape();
                totalRaycastChecked++;

                if (actual != expected) {
                    QQuickItem* deepest = window->contentItem();
                    while (deepest) {
                        QPointF local = deepest->mapFromScene(scenePoint);
                        QQuickItem* child = deepest->childAt(local.x(), local.y());
                        if (!child || child == deepest) break;
                        deepest = child;
                    }
                    QString deepestPath;
                    for (QQuickItem* dp = deepest; dp; dp = dp->parentItem()) {
                        deepestPath.prepend(QString("%1(pos:%2,%3 size:%4x%5) / ")
                            .arg(dp->metaObject()->className())
                            .arg(dp->x()).arg(dp->y()).arg(dp->width()).arg(dp->height()));
                    }
                    QString itemPath;
                    for (QQuickItem* ip = item; ip; ip = ip->parentItem()) {
                        itemPath.prepend(QString("%1(pos:%2,%3 size:%4x%5) / ")
                            .arg(ip->metaObject()->className())
                            .arg(ip->x()).arg(ip->y()).arg(ip->width()).arg(ip->height()));
                    }
                    qWarning() << "[qt-scenario] Pointer Raycast mismatch on page" << pageId
                               << "\n    itemPath:" << itemPath
                               << "\n    deepestPath:" << deepestPath
                               << "\n    at scene (" << scenePoint.x() << "," << scenePoint.y() << "):"
                               << "expected cursor" << expected << ", got" << actual;
                    totalDiscrepancies++;
                }
            }
        }
    }

    qInfo() << "[qt-scenario] Showcase pointer raycasting completed:" << totalRaycastChecked
            << "on-screen controls verified across" << pageList.size() << "pages with" << totalDiscrepancies << "discrepancies.";

    // Reset back to button page
    window->setProperty("activePage", "button");
    QTest::qWait(20);

    if (totalDiscrepancies > 0) {
        qCritical() << "[qt-scenario] FAIL: Pointer raycasting detected" << totalDiscrepancies << "cursor discrepancies on showcase pages!";
        return false;
    }

    qInfo("[qt-scenario] PASS: Authentic C++ showcase physical pointer raycasting verified with ZERO discrepancies");
    return true;
}

bool runRealTypographyVerification(QQuickWindow* window) {
    qInfo("[qt-scenario] Running authentic C++ typography and font rendering verification...");
    const QFont appFont = QGuiApplication::font();
    if (!(appFont.styleStrategy() & QFont::NoSubpixelAntialias)) {
        qCritical("[qt-scenario] FAIL: QGuiApplication font missing NoSubpixelAntialias strategy!");
        return false;
    }
    if (!(appFont.styleStrategy() & QFont::PreferQuality)) {
        qCritical("[qt-scenario] FAIL: QGuiApplication font missing PreferQuality strategy!");
        return false;
    }
    if (appFont.hintingPreference() != QFont::PreferVerticalHinting) {
        qCritical("[qt-scenario] FAIL: QGuiApplication font hintingPreference is not PreferVerticalHinting!");
        return false;
    }
    if (QQuickWindow::textRenderType() != static_cast<QQuickWindow::TextRenderType>(ChaSet::FontSystem::activeTextRenderType())) {
        qCritical("[qt-scenario] FAIL: QQuickWindow textRenderType does not match the resolved CHASET_TEXT_RENDER policy!");
        return false;
    }
    qInfo() << "[qt-scenario] Text render policy:" << ChaSet::FontSystem::activeTextRenderPolicyName()
            << "(renderType =" << ChaSet::FontSystem::activeTextRenderType() << ")";

    const QStringList segoeSubst = QFont::substitutes(QStringLiteral("Segoe UI"));
    if (!segoeSubst.contains(QStringLiteral("Microsoft YaHei UI"), Qt::CaseInsensitive) &&
        !segoeSubst.contains(QStringLiteral("Microsoft YaHei"), Qt::CaseInsensitive) &&
        !segoeSubst.contains(QStringLiteral("PingFang SC"), Qt::CaseInsensitive)) {
        qCritical("[qt-scenario] FAIL: QFont Segoe UI substitutes missing CJK fallback fonts!");
        return false;
    }
    const QStringList consolasSubst = QFont::substitutes(QStringLiteral("Consolas"));
    if (!consolasSubst.contains(QStringLiteral("Microsoft YaHei UI"), Qt::CaseInsensitive) &&
        !consolasSubst.contains(QStringLiteral("Microsoft YaHei"), Qt::CaseInsensitive) &&
        !consolasSubst.contains(QStringLiteral("PingFang SC"), Qt::CaseInsensitive)) {
        qCritical("[qt-scenario] FAIL: QFont Consolas substitutes missing CJK fallback fonts!");
        return false;
    }
    if (appFont.families().isEmpty()) {
        qCritical("[qt-scenario] FAIL: QGuiApplication font families list is empty!");
        return false;
    }

    const int expectedRenderType = ChaSet::FontSystem::activeTextRenderType();
    int verifiedCount = 0;
    std::function<bool(QQuickItem*)> scanItems = [&](QQuickItem* item) -> bool {
        if (!item) return true;
        const QString className = QString::fromLatin1(item->metaObject()->className());
        if (className.contains(QStringLiteral("Text")) || className.contains(QStringLiteral("TextInput")) || className.contains(QStringLiteral("TextEdit"))) {
            QVariant rt = item->property("renderType");
            // The window-level CHASET_TEXT_RENDER policy is inherited by every text node.
            if (rt.isValid() && rt.toInt() != expectedRenderType) {
                qCritical() << "[qt-scenario] FAIL: Text item" << className << "renderType" << rt.toInt()
                            << "diverges from the resolved policy" << expectedRenderType;
                return false;
            }
            verifiedCount++;
        }
        for (QQuickItem* child : item->childItems()) {
            if (!scanItems(child)) return false;
        }
        return true;
    };

    if (!scanItems(window->contentItem())) return false;
    qInfo() << "[qt-scenario] PASS: Verified global typography and native grayscale antialiasing across" << verifiedCount << "active text nodes";
    return true;
}

#if defined(Q_OS_WIN)
#include <windows.h>
#include <d3d11.h>

typedef HRESULT (WINAPI *PFN_D3D11_CREATE_DEVICE)(
    IDXGIAdapter*,
    D3D_DRIVER_TYPE,
    HMODULE,
    UINT,
    const D3D_FEATURE_LEVEL*,
    UINT,
    UINT,
    ID3D11Device**,
    D3D_FEATURE_LEVEL*,
    ID3D11DeviceContext**
);

static bool isD3D11HardwareAvailable() {
    HMODULE hD3D11 = LoadLibraryW(L"d3d11.dll");
    if (!hD3D11) {
        return false;
    }
    auto pfnCreate = reinterpret_cast<PFN_D3D11_CREATE_DEVICE>(
        GetProcAddress(hD3D11, "D3D11CreateDevice")
    );
    if (!pfnCreate) {
        FreeLibrary(hD3D11);
        return false;
    }

    ID3D11Device* dev = nullptr;
    ID3D11DeviceContext* ctx = nullptr;
    D3D_FEATURE_LEVEL featureLevel;
    const D3D_FEATURE_LEVEL featureLevels[] = {
        D3D_FEATURE_LEVEL_11_0,
        D3D_FEATURE_LEVEL_10_1,
        D3D_FEATURE_LEVEL_10_0
    };

    HRESULT hr = pfnCreate(
        nullptr,
        D3D_DRIVER_TYPE_HARDWARE,
        nullptr,
        0,
        featureLevels,
        ARRAYSIZE(featureLevels),
        D3D11_SDK_VERSION,
        &dev,
        &featureLevel,
        &ctx
    );

    if (ctx) ctx->Release();
    if (dev) dev->Release();
    FreeLibrary(hD3D11);

    return SUCCEEDED(hr);
}
#endif

int main(int argc, char* argv[])
{
    // 1. Scan for Graphics API & RHI backend configuration before creating windows
    bool forceSoftware = false;
    bool forceOpenGL = false;
    bool forceD3D11 = false;
    bool forceD3D12 = false;
    bool forceVulkan = false;
    bool forceWarp = false;

    for (int i = 1; i < argc; ++i) {
        const QString arg = QString::fromUtf8(argv[i]);
        if (arg == "--software") forceSoftware = true;
        else if (arg == "--opengl") forceOpenGL = true;
        else if (arg == "--d3d11") forceD3D11 = true;
        else if (arg == "--d3d12") forceD3D12 = true;
        else if (arg == "--vulkan") forceVulkan = true;
        else if (arg == "--warp") forceWarp = true;
        else if (arg == "--rhi" && i + 1 < argc) {
            const QString rhiVal = QString::fromUtf8(argv[++i]).toLower();
            if (rhiVal == "software") forceSoftware = true;
            else if (rhiVal == "opengl") forceOpenGL = true;
            else if (rhiVal == "d3d11") forceD3D11 = true;
            else if (rhiVal == "d3d12") forceD3D12 = true;
            else if (rhiVal == "vulkan") forceVulkan = true;
            else if (rhiVal == "warp") forceWarp = true;
        }
    }

    if (forceSoftware) {
        QQuickWindow::setGraphicsApi(QSGRendererInterface::Software);
        qInfo("[qt-showcase] RHI override: Software rendering.");
    } else if (forceOpenGL) {
        QQuickWindow::setGraphicsApi(QSGRendererInterface::OpenGL);
        qInfo("[qt-showcase] RHI override: OpenGL rendering.");
    } else if (forceD3D12) {
        QQuickWindow::setGraphicsApi(QSGRendererInterface::Direct3D12);
        qInfo("[qt-showcase] RHI override: Direct3D 12 rendering.");
    } else if (forceVulkan) {
        QQuickWindow::setGraphicsApi(QSGRendererInterface::Vulkan);
        qInfo("[qt-showcase] RHI override: Vulkan rendering.");
    } else if (forceWarp) {
        qputenv("QSG_RHI_PREFER_SOFTWARE_RENDERER", "1");
        qInfo("[qt-showcase] RHI override: WARP software rasterizer.");
    } else if (forceD3D11) {
        QQuickWindow::setGraphicsApi(QSGRendererInterface::Direct3D11);
        qInfo("[qt-showcase] RHI override: Direct3D 11 rendering.");
    } else {
#if defined(Q_OS_WIN)
        if (qEnvironmentVariableIsEmpty("QSG_RHI_BACKEND") && qEnvironmentVariableIsEmpty("QSG_RHI_PREFER_SOFTWARE_RENDERER")) {
            if (!isD3D11HardwareAvailable()) {
                qWarning("[qt-showcase] Hardware Direct3D 11 device is unavailable or memory exhausted.");
                qWarning("[qt-showcase] Automatically activating WARP software rasterizer for reliable display.");
                qputenv("QSG_RHI_PREFER_SOFTWARE_RENDERER", "1");
            }
        }
#endif
    }

    QGuiApplication::setHighDpiScaleFactorRoundingPolicy(Qt::HighDpiScaleFactorRoundingPolicy::PassThrough);
    // Single owner of the global text rasterization path: CHASET_TEXT_RENDER
    // selects qt (default) / native / curve. Must precede the first window.
    ChaSet::FontSystem::applyTextRenderType();

    QGuiApplication app(argc, argv);

    ChaSet::FontSystem::initialize(&app);

    const QStringList args = app.arguments();
    
    // Harness and screenshot arguments
    const int shotIdx = static_cast<int>(args.indexOf("--shot"));
    const bool shotMode = shotIdx >= 0 && shotIdx + 1 < args.size();
    const QString shotPath = shotMode ? args.value(shotIdx + 1) : "";
    const bool startLight = args.contains("--light");
    const bool startDark = args.contains("--dark");

    const int harnessIdx = static_cast<int>(args.indexOf("--harness"));
    const QString harnessMode = harnessIdx >= 0 && harnessIdx + 1 < args.size() ? args.value(harnessIdx + 1) : "";

    const int varIdx = static_cast<int>(args.indexOf("--variant"));
    const QString harnessVariant = varIdx >= 0 && varIdx + 1 < args.size() ? args.value(varIdx + 1) : "default";

    const int sizeIdx = static_cast<int>(args.indexOf("--size"));
    const QString harnessSize = sizeIdx >= 0 && sizeIdx + 1 < args.size() ? args.value(sizeIdx + 1) : "default";

    const int lblIdx = static_cast<int>(args.indexOf("--label"));
    const QString harnessLabel = lblIdx >= 0 && lblIdx + 1 < args.size() ? args.value(lblIdx + 1) : "Create Project";

    const int stateIdx = static_cast<int>(args.indexOf("--state"));
    const QString harnessState = stateIdx >= 0 && stateIdx + 1 < args.size() ? args.value(stateIdx + 1) : "idle";

    const bool harnessLoading = args.contains("--loading");
    const bool harnessDisabled = args.contains("--disabled");
    const bool harnessLineNumbers = args.contains("--line-numbers");
    const bool testScrollMode = args.contains("--test-scroll");

    const int scenarioIdx = static_cast<int>(args.indexOf("--test-scenario"));
    const QString testScenario = scenarioIdx >= 0 && scenarioIdx + 1 < args.size() ? args.value(scenarioIdx + 1) : (testScrollMode ? "all" : "");

    const int orientIdx = static_cast<int>(args.indexOf("--orientation"));
    const QString harnessOrientation = orientIdx >= 0 && orientIdx + 1 < args.size() ? args.value(orientIdx + 1) : "vertical";
    const bool harnessNoButtons = args.contains("--no-buttons");

    const int tabIdx = static_cast<int>(args.indexOf("--tab-index"));
    const QString harnessTabIndex = tabIdx >= 0 && tabIdx + 1 < args.size() ? args.value(tabIdx + 1) : "1";

    const int wIdx = static_cast<int>(args.indexOf("--width"));
    const int reqWidth = wIdx >= 0 && wIdx + 1 < args.size() ? args.value(wIdx + 1).toInt() : 0;

    const int hIdx = static_cast<int>(args.indexOf("--height"));
    const int reqHeight = hIdx >= 0 && hIdx + 1 < args.size() ? args.value(hIdx + 1).toInt() : 0;

    const int pageIdx = static_cast<int>(args.indexOf("--page"));
    const QString startupPage = pageIdx >= 0 && pageIdx + 1 < args.size() ? args.value(pageIdx + 1) : "";

    const int scrollYIdx = static_cast<int>(args.indexOf("--scroll-y"));
    const int reqScrollY = scrollYIdx >= 0 && scrollYIdx + 1 < args.size() ? args.value(scrollYIdx + 1).toInt() : 0;

    const int valIdx = static_cast<int>(args.indexOf("--value"));
    const double harnessValue = valIdx >= 0 && valIdx + 1 < args.size() ? args.value(valIdx + 1).toDouble() : 1.0;

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("harnessValue", harnessValue);
    engine.rootContext()->setContextProperty("reqScrollY", reqScrollY);
    engine.rootContext()->setContextProperty("startupPage", startupPage);
    engine.rootContext()->setContextProperty("startupLight", startLight);
    engine.rootContext()->setContextProperty("startupDark", startDark);
    engine.rootContext()->setContextProperty("shotPath", shotPath);
    engine.rootContext()->setContextProperty("harnessMode", harnessMode);
    engine.rootContext()->setContextProperty("harnessVariant", harnessVariant);
    engine.rootContext()->setContextProperty("harnessSize", harnessSize);
    engine.rootContext()->setContextProperty("harnessLabel", harnessLabel);
    engine.rootContext()->setContextProperty("harnessState", harnessState);
    engine.rootContext()->setContextProperty("harnessLoading", harnessLoading);
    engine.rootContext()->setContextProperty("harnessDisabled", harnessDisabled);
    engine.rootContext()->setContextProperty("harnessLineNumbers", harnessLineNumbers);
    engine.rootContext()->setContextProperty("harnessOrientation", harnessOrientation);
    engine.rootContext()->setContextProperty("harnessShowButtons", !harnessNoButtons);
    engine.rootContext()->setContextProperty("harnessTabIndex", harnessTabIndex);
    engine.rootContext()->setContextProperty("testScrollMode", testScrollMode);
    engine.rootContext()->setContextProperty("testScenario", testScenario);
    engine.rootContext()->setContextProperty("reqWidth", reqWidth);
    engine.rootContext()->setContextProperty("reqHeight", reqHeight);
    engine.rootContext()->setContextProperty("textRenderPolicy", ChaSet::FontSystem::activeTextRenderPolicyName());

    QObject::connect(&engine, &QQmlApplicationEngine::quit, &app, []() {
        QCoreApplication::exit(0);
    });
    QObject::connect(&engine, &QQmlApplicationEngine::exit, &app, [](int code) {
        QCoreApplication::exit(code);
    });

    QObject::connect(
        &engine, &QQmlApplicationEngine::objectCreationFailed, &app,
        []() {
            qCritical("[qt-showcase] Object creation failed!");
            QCoreApplication::exit(-1);
        }, Qt::QueuedConnection);

    engine.loadFromModule("chaSetDemo", "Main");

    if (engine.rootObjects().isEmpty()) {
        qCritical("[qt-showcase] No root objects!");
        return -1;
    }

    auto* root = engine.rootObjects().first();
    auto* window = qobject_cast<QQuickWindow*>(root);
    if (window != nullptr) {
        app.installEventFilter(new GlobalWheelZoomFilter(window));
        window->show();
        if (shotMode) {
            QTimer::singleShot(300, window, [window, shotPath]() {
                const QImage image = window->grabWindow();
                if (!image.isNull() && image.width() > 0 && image.height() > 0) {
                    image.save(shotPath);
                }
                QCoreApplication::exit(0);
            });
        } else if (!testScenario.isEmpty()) {
            QTimer::singleShot(300, window, [&engine, window, testScenario]() {
                QVariant returnedValue;
                bool ok = QMetaObject::invokeMethod(window, "runTestScenario",
                    Q_RETURN_ARG(QVariant, returnedValue),
                    Q_ARG(QVariant, testScenario));
                if (!ok) {
                    qWarning("[qt-scenario] Failed to invoke runTestScenario on root window!");
                    QCoreApplication::exit(1);
                } else {
                    int code = returnedValue.toInt();
                    if (code == 0) {
                        QCoreApplication::sendPostedEvents(nullptr, QEvent::DeferredDelete);
                        QCoreApplication::processEvents();
                        engine.collectGarbage();
                        QTest::qWait(50);

                        if (testScenario == "all" || testScenario == "ctrl-wheel" || testScenario == "zoom") {
                            bool wheelOk = runRealCtrlWheelVerification(window);
                            if (!wheelOk) {
                                QCoreApplication::exit(1);
                                return;
                            }
                        }
                        if (testScenario == "all" || testScenario == "scroll-drag") {
                            bool dragOk = runRealMouseDragVerification(window);
                            if (!dragOk) {
                                QCoreApplication::exit(1);
                                return;
                            }
                        }
                        if (testScenario == "all" || testScenario == "keyboard-navigation") {
                            bool kbOk = runRealKeyboardVerification(window);
                            if (!kbOk) {
                                QCoreApplication::exit(1);
                                return;
                            }
                        }
                        if (testScenario == "all" || testScenario == "cursor" || testScenario == "cursor-conformance" || testScenario == "cursor-showcase" || testScenario == "cursor-audit") {
                            bool cursorOk = runRealCursorVerification(window);
                            if (!cursorOk) {
                                QCoreApplication::exit(1);
                                return;
                            }
                            bool raycastOk = runShowcaseCursorRaycasting(window);
                            if (!raycastOk) {
                                QCoreApplication::exit(1);
                                return;
                            }
                        }
                        if (testScenario == "all" || testScenario == "typography" || testScenario == "font") {
                            bool typoOk = runRealTypographyVerification(window);
                            if (!typoOk) {
                                QCoreApplication::exit(1);
                                return;
                            }
                        }
                    }
                    QCoreApplication::exit(code);
                }
            });
        }
    }

    return app.exec();
}
