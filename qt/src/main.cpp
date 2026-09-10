#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickWindow>
#include <QQuickItem>
#include <QSGRendererInterface>
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

    qInfo("[qt-scenario] PASS: Authentic C++ QTest keyboard navigation verified for Select and DropdownMenu");
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

    QGuiApplication app(argc, argv);

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

    QQmlApplicationEngine engine;
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
    engine.rootContext()->setContextProperty("harnessOrientation", harnessOrientation);
    engine.rootContext()->setContextProperty("harnessShowButtons", !harnessNoButtons);
    engine.rootContext()->setContextProperty("harnessTabIndex", harnessTabIndex);
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

    engine.loadFromModule("chaSetDemo", "Main");

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
                    }
                    QCoreApplication::exit(code);
                }
            });
        }
    }

    return app.exec();
}
