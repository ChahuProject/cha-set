#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickWindow>
#include <QQuickItem>
#include <QTimer>
#include <QDebug>
#include <QTest>

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
    QPointF scrollBarPos = contentScroll->mapToScene(QPointF(contentScroll->width() - 4, 30));
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

    if (draggedY > 0) {
        qInfo("[qt-scenario] PASS: Real C++ QTest mouse drag verified (contentY delta > 0)");
        return true;
    } else {
        qCritical("[qt-scenario] FAIL: Real C++ QTest mouse drag did NOT move contentY");
        return false;
    }
}

int main(int argc, char* argv[])
{
    QGuiApplication app(argc, argv);

    const QStringList args = app.arguments();
    
    // Harness and screenshot arguments
    const int shotIdx = static_cast<int>(args.indexOf("--shot"));
    const bool shotMode = shotIdx >= 0 && shotIdx + 1 < args.size();
    const QString shotPath = shotMode ? args.value(shotIdx + 1) : "";
    const bool startLight = args.contains("--light");

    const int harnessIdx = static_cast<int>(args.indexOf("--harness"));
    const QString harnessMode = harnessIdx >= 0 && harnessIdx + 1 < args.size() ? args.value(harnessIdx + 1) : "";

    const int varIdx = static_cast<int>(args.indexOf("--variant"));
    const QString harnessVariant = varIdx >= 0 && varIdx + 1 < args.size() ? args.value(varIdx + 1) : "primary";

    const int sizeIdx = static_cast<int>(args.indexOf("--size"));
    const QString harnessSize = sizeIdx >= 0 && sizeIdx + 1 < args.size() ? args.value(sizeIdx + 1) : "md";

    const int lblIdx = static_cast<int>(args.indexOf("--label"));
    const QString harnessLabel = lblIdx >= 0 && lblIdx + 1 < args.size() ? args.value(lblIdx + 1) : "Create Project";

    const bool harnessLoading = args.contains("--loading");
    const bool harnessDisabled = args.contains("--disabled");
    const bool testScrollMode = args.contains("--test-scroll");

    const int scenarioIdx = static_cast<int>(args.indexOf("--test-scenario"));
    const QString testScenario = scenarioIdx >= 0 && scenarioIdx + 1 < args.size() ? args.value(scenarioIdx + 1) : (testScrollMode ? "all" : "");

    const int wIdx = static_cast<int>(args.indexOf("--width"));
    const int reqWidth = wIdx >= 0 && wIdx + 1 < args.size() ? args.value(wIdx + 1).toInt() : 0;

    const int hIdx = static_cast<int>(args.indexOf("--height"));
    const int reqHeight = hIdx >= 0 && hIdx + 1 < args.size() ? args.value(hIdx + 1).toInt() : 0;

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("startupLight", startLight);
    engine.rootContext()->setContextProperty("shotPath", shotPath);
    engine.rootContext()->setContextProperty("harnessMode", harnessMode);
    engine.rootContext()->setContextProperty("harnessVariant", harnessVariant);
    engine.rootContext()->setContextProperty("harnessSize", harnessSize);
    engine.rootContext()->setContextProperty("harnessLabel", harnessLabel);
    engine.rootContext()->setContextProperty("harnessLoading", harnessLoading);
    engine.rootContext()->setContextProperty("harnessDisabled", harnessDisabled);
    engine.rootContext()->setContextProperty("testScrollMode", testScrollMode);
    engine.rootContext()->setContextProperty("testScenario", testScenario);
    engine.rootContext()->setContextProperty("reqWidth", reqWidth);
    engine.rootContext()->setContextProperty("reqHeight", reqHeight);

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

    engine.loadFromModule("chaSet", "Main");

    if (engine.rootObjects().isEmpty()) {
        qCritical("[qt-showcase] No root objects!");
        return -1;
    }

    auto* root = engine.rootObjects().first();
    auto* window = qobject_cast<QQuickWindow*>(root);
    if (window != nullptr) {
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
            QTimer::singleShot(300, window, [window, testScenario]() {
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
                        bool dragOk = runRealMouseDragVerification(window);
                        if (!dragOk) {
                            QCoreApplication::exit(1);
                            return;
                        }
                    }
                    QCoreApplication::exit(code);
                }
            });
        }
    }

    return app.exec();
}
