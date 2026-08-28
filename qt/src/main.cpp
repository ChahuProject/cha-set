#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQuickWindow>
#include <QTimer>

// ChaSet Qt showcase app.
// Screenshot mode (for evidence chain): QtChaSetDemo.exe --shot out.png [--light]
//   Capture the window after rendering completes, save as PNG, and exit.
int main(int argc, char* argv[])
{
    QGuiApplication app(argc, argv);

    const QStringList args = app.arguments();
    const int shotIdx = static_cast<int>(args.indexOf("--shot"));
    const bool shotMode = shotIdx >= 0 && shotIdx + 1 < args.size();
    const bool startLight = args.contains("--light");

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("startupLight", startLight);

    QObject::connect(
        &engine, &QQmlApplicationEngine::objectCreationFailed, &app,
        []() { QCoreApplication::exit(-1); }, Qt::QueuedConnection);

    // Screenshot connection must be registered before loadFromModule: QRC-embedded QML loads synchronously,
    // objectCreated is emitted before load returns.
    if (shotMode) {
        const QString outPath = args.value(shotIdx + 1);
        QObject::connect(
            &engine, &QQmlApplicationEngine::objectCreated, &app,
            [outPath](QObject* root, const QUrl&) {
                auto* window = qobject_cast<QQuickWindow*>(root);
                if (window == nullptr) {
                    qWarning("[shot] root object is not a QQuickWindow");
                    QCoreApplication::exit(-2);
                    return;
                }
                QTimer::singleShot(400, window, [window, outPath]() {
                    const QImage image = window->grabWindow();
                    if (!image.save(outPath)) {
                        qWarning("[shot] failed to save %s",
                                 qPrintable(outPath));
                        QCoreApplication::exit(-3);
                        return;
                    }
                    qInfo("[shot] saved %s", qPrintable(outPath));
                    QCoreApplication::exit(0);
                });
            },
            Qt::QueuedConnection);
    }

    engine.loadFromModule("chaSet", "Main");

    return app.exec();
}
