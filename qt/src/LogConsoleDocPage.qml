// LogConsoleDocPage.qml — Living Documentation for ChaSetLogConsole
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Log Console"
    description: ChaSetI18n.tr("components.logConsole.description", "High-performance virtualized terminal log viewer with auto-scroll, ANSI color parsing, and copy support.")
    tocItems: [
        { id: "overview", title: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview") },
        { id: "installation", title: ChaSetI18n.tr("showcase.installation", "Installation") },
        { id: "animations", title: ChaSetI18n.tr("showcase.animations", "Animations") },
        { id: "keyboard", title: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation") },
        { id: "props", title: ChaSetI18n.tr("showcase.propsReference", "Props Reference") }
    ]

    readonly property var initialLogs: [
        "[compiler] Initializing Vulkan GLSL compiler v1.3.268...",
        "[compiler] Loading target target-spirv64-vulkan1.3 architecture...",
        "\u001B[32mStage 1/2: Vertex shader compiled successfully (0.04s)\u001B[0m",
        "\u001B[33m[warn] Uniform block binding 2 (CameraParams) exceeds 256 bytes\u001B[0m",
        "\u001B[32mStage 2/2: Fragment shader compiled successfully (0.07s)\u001B[0m",
        "[linker] Generating SPIR-V binary module: pipeline.spv (14.2 KB)",
        "\u001B[32m[ok] Pipeline layout validated (0 errors, 1 warning)\u001B[0m"
    ]

    property var demoLines: root.initialLogs.slice()

    function appendOne() {
        var copy = root.demoLines.slice()
        var now = new Date()
        var timeStr = now.toTimeString().split(" ")[0]
        copy.push("[" + timeStr + "] \u001B[36m[telemetry] Worker thread heartbeat ping #" + (copy.length + 1) + " (frame latency 0.12ms)\u001B[0m")
        root.demoLines = copy
    }

    function appendStream() {
        var copy = root.demoLines.slice()
        var now = new Date()
        var timeStr = now.toTimeString().split(" ")[0]
        copy.push("[" + timeStr + "] \u001B[35m[optimizer] Running scalar dead-code elimination pass...\u001B[0m")
        copy.push("[" + timeStr + "] \u001B[35m[optimizer] Inlining 14 functions, pruned 18 instructions\u001B[0m")
        copy.push("[" + timeStr + "] \u001B[32m[optimizer] Optimization pass concluded in 3.4ms\u001B[0m")
        root.demoLines = copy
    }

    function clearLogs() {
        root.demoLines = []
    }

    function resetLogs() {
        root.demoLines = root.initialLogs.slice()
    }

    ComponentPreview {
        id: previewContainer
        width: parent ? parent.width : ThemeTokens.dp(500)
        title: ChaSetI18n.tr("desktopComposite.logConsole.sandboxTitle", "Log Console Sandbox")
        stageHeight: ThemeTokens.dp(340)
        reactCode: `<LogConsole
  lines={[
    "[compiler] Initializing Vulkan GLSL compiler v1.3.268...",
    "\\u001B[32mStage 1/2: Vertex shader compiled successfully (0.04s)\\u001B[0m",
    "\\u001B[33m[warn] Uniform block binding 2 exceeds 256 bytes\\u001B[0m",
    "\\u001B[32m[ok] Pipeline layout validated (0 errors, 1 warning)\\u001B[0m",
  ]}
  showCopy
  showLineCount
  autoScroll
  emptyText="${ChaSetI18n.tr("components.logConsole.empty", "No logs")}"
/>`
        qtCode: `ChaSetLogConsole {
    width: ThemeTokens.dp(480)
    height: ThemeTokens.dp(260)
    lines: [
        "[compiler] Initializing Vulkan GLSL compiler v1.3.268...",
        "\\u001B[32mStage 1/2: Vertex shader compiled successfully (0.04s)\\u001B[0m",
        "\\u001B[33m[warn] Uniform block binding 2 exceeds 256 bytes\\u001B[0m",
        "\\u001B[32m[ok] Pipeline layout validated (0 errors, 1 warning)\\u001B[0m"
    ]
    showCopy: true
    showLineCount: true
    autoScroll: true
    emptyText: "${ChaSetI18n.tr("components.logConsole.empty", "No logs")}"
}`

        Column {
            anchors.centerIn: parent
            spacing: ThemeTokens.dp(14)
            width: ThemeTokens.dp(500)

            Row {
                anchors.horizontalCenter: parent.horizontalCenter
                spacing: ThemeTokens.dp(8)

                ChaSetButton {
                    variant: "outline"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.logConsole.appendLog", "Append Log Line")
                    onClicked: root.appendOne()
                }

                ChaSetButton {
                    variant: "outline"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.logConsole.appendStream", "Append Batch Stream")
                    onClicked: root.appendStream()
                }

                ChaSetButton {
                    variant: "outline"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.logConsole.clearLogs", "Clear Logs")
                    onClicked: root.clearLogs()
                }

                ChaSetButton {
                    variant: "secondary"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.logConsole.reset", "Reset Logs")
                    onClicked: root.resetLogs()
                }
            }

            ChaSetLogConsole {
                width: parent.width
                height: ThemeTokens.dp(220)
                lines: root.demoLines
                showCopy: true
                showLineCount: true
                autoScroll: true
                emptyText: ChaSetI18n.tr("components.logConsole.empty", "No logs")
            }
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "log-console"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "log-console"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "log-console"
        section: "props"
    }
}
