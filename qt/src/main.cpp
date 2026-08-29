#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>
#include <QQmlError>
#include <QDebug>

int main(int argc, char* argv[])
{
    QGuiApplication app(argc, argv);

    const QStringList args = app.arguments();
    const int shotIdx = static_cast<int>(args.indexOf("--shot"));
    const bool shotMode = shotIdx >= 0 && shotIdx + 1 < args.size();
    const QString shotPath = shotMode ? args.value(shotIdx + 1) : "";
    const bool startLight = args.contains("--light");

    QQmlApplicationEngine engine;
    engine.rootContext()->setContextProperty("startupLight", startLight);
    engine.rootContext()->setContextProperty("shotPath", shotPath);

    QObject::connect(
        &engine, &QQmlApplicationEngine::objectCreationFailed, &app,
        []() {
            qCritical("[qt-showcase] Object creation failed!");
            QCoreApplication::exit(-1);
        }, Qt::QueuedConnection);

    QObject::connect(&engine, &QQmlApplicationEngine::warnings, [](const QList<QQmlError> &warnings) {
        for (const auto &w : warnings) {
            qWarning() << "[QML Warning]" << w.toString();
        }
    });

    engine.loadFromModule("chaSet", "Main");

    if (engine.rootObjects().isEmpty()) {
        qCritical("[qt-showcase] No root objects!");
        return -1;
    }

    return app.exec();
}
