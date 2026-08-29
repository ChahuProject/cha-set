#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickWindow>
#include <QTimer>
#include <QDebug>

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

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("startupLight", startLight);
    engine.rootContext()->setContextProperty("shotPath", shotPath);
    engine.rootContext()->setContextProperty("harnessMode", harnessMode);
    engine.rootContext()->setContextProperty("harnessVariant", harnessVariant);
    engine.rootContext()->setContextProperty("harnessSize", harnessSize);
    engine.rootContext()->setContextProperty("harnessLabel", harnessLabel);
    engine.rootContext()->setContextProperty("harnessLoading", harnessLoading);
    engine.rootContext()->setContextProperty("harnessDisabled", harnessDisabled);

    QObject::connect(&engine, &QQmlApplicationEngine::quit, &app, &QGuiApplication::quit);

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
    if (window != nullptr && shotMode) {
        window->show();
        QTimer::singleShot(300, window, [window, shotPath]() {
            const QImage image = window->grabWindow();
            if (!image.isNull() && image.width() > 0 && image.height() > 0) {
                image.save(shotPath);
            }
            QCoreApplication::exit(0);
        });
    }

    return app.exec();
}
