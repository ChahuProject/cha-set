// StepTimelineDocPage.qml — Living Documentation for ChaSetStepTimeline
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

DocLayout {
    id: root
    category: "Composite Engines"
    pageTitle: "Step Timeline"
    description: ChaSetI18n.tr("components.stepTimeline.description", "Sequential vertical execution step timeline with status indicators and formatted durations.")
    tocItems: [
        { id: "overview", title: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview") },
        { id: "installation", title: ChaSetI18n.tr("showcase.installation", "Installation") },
        { id: "animations", title: ChaSetI18n.tr("showcase.animations", "Animations") },
        { id: "keyboard", title: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation") },
        { id: "props", title: ChaSetI18n.tr("showcase.propsReference", "Props Reference") }
    ]

    readonly property var initialSteps: [
        {
            name: ChaSetI18n.tr("desktopComposite.stepTimeline.stepLint", "Lint & Typecheck"),
            status: "success",
            durationMs: 1450
        },
        {
            name: ChaSetI18n.tr("desktopComposite.stepTimeline.stepBuild", "Compile Application Bundle"),
            status: "success",
            durationMs: 8200
        },
        {
            name: ChaSetI18n.tr("desktopComposite.stepTimeline.stepTest", "Unit & Integration Test Suite"),
            status: "running",
            durationMs: null
        },
        {
            name: ChaSetI18n.tr("desktopComposite.stepTimeline.stepPackage", "Generate Release Package"),
            status: "pending",
            durationMs: null
        },
        {
            name: ChaSetI18n.tr("desktopComposite.stepTimeline.stepDeploy", "Deploy to Edge Cluster"),
            status: "skipped",
            durationMs: null
        }
    ]

    property var demoSteps: root.initialSteps.slice()
    property bool showEmpty: false

    function toggleEmpty() {
        root.showEmpty = !root.showEmpty
    }

    function addStep() {
        var copy = root.demoSteps.slice()
        copy.push({
            name: ChaSetI18n.tr("desktopComposite.stepTimeline.stepBuild", "Compile Application Bundle") + " (" + (copy.length + 1) + ")",
            status: "pending",
            durationMs: null
        })
        root.demoSteps = copy
        root.showEmpty = false
    }

    function resetSteps() {
        root.demoSteps = root.initialSteps.slice()
        root.showEmpty = false
    }

    ComponentPreview {
        id: previewContainer
        width: parent ? parent.width : ThemeTokens.dp(500)
        title: ChaSetI18n.tr("desktopComposite.stepTimeline.sandboxTitle", "Step Timeline Sandbox")
        stageHeight: ThemeTokens.dp(280)
        reactCode: `<StepTimeline
  steps={[
    { name: "${ChaSetI18n.tr("desktopComposite.stepTimeline.stepLint", "Lint & Typecheck")}", status: "success", durationMs: 1450 },
    { name: "${ChaSetI18n.tr("desktopComposite.stepTimeline.stepBuild", "Compile Application Bundle")}", status: "success", durationMs: 8200 },
    { name: "${ChaSetI18n.tr("desktopComposite.stepTimeline.stepTest", "Unit & Integration Test Suite")}", status: "running", durationMs: null },
    { name: "${ChaSetI18n.tr("desktopComposite.stepTimeline.stepPackage", "Generate Release Package")}", status: "pending", durationMs: null },
  ]}
  emptyText="${ChaSetI18n.tr("components.stepTimeline.emptyText", "No steps")}"
/>`
        qtCode: `ChaSetStepTimeline {
    steps: [
        { name: "${ChaSetI18n.tr("desktopComposite.stepTimeline.stepLint", "Lint & Typecheck")}", status: "success", durationMs: 1450 },
        { name: "${ChaSetI18n.tr("desktopComposite.stepTimeline.stepBuild", "Compile Application Bundle")}", status: "success", durationMs: 8200 },
        { name: "${ChaSetI18n.tr("desktopComposite.stepTimeline.stepTest", "Unit & Integration Test Suite")}", status: "running", durationMs: null },
        { name: "${ChaSetI18n.tr("desktopComposite.stepTimeline.stepPackage", "Generate Release Package")}", status: "pending", durationMs: null }
    ]
    emptyText: "${ChaSetI18n.tr("components.stepTimeline.emptyText", "No steps")}"
}`

        Column {
            anchors.centerIn: parent
            spacing: ThemeTokens.dp(16)
            width: ThemeTokens.dp(360)

            Row {
                anchors.horizontalCenter: parent.horizontalCenter
                spacing: ThemeTokens.dp(8)

                ChaSetButton {
                    variant: "outline"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.stepTimeline.toggleEmpty", "Toggle Empty State")
                    onClicked: root.toggleEmpty()
                }

                ChaSetButton {
                    variant: "outline"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.stepTimeline.addStep", "Add Step")
                    onClicked: root.addStep()
                }

                ChaSetButton {
                    variant: "secondary"
                    size: "sm"
                    text: ChaSetI18n.tr("desktopComposite.stepTimeline.reset", "Reset Steps")
                    onClicked: root.resetSteps()
                }
            }

            Rectangle {
                width: parent.width
                height: timeline.implicitHeight + ThemeTokens.dp(24)
                color: ThemeTokens.card
                border.color: ThemeTokens.border
                border.width: 1
                radius: ThemeTokens.panelRadius

                ChaSetStepTimeline {
                    id: timeline
                    anchors.centerIn: parent
                    width: parent.width - ThemeTokens.dp(24)
                    steps: root.showEmpty ? [] : root.demoSteps
                    emptyText: ChaSetI18n.tr("components.stepTimeline.emptyText", "No steps")
                }
            }
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "step-timeline"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "step-timeline"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "step-timeline"
        section: "props"
    }
}
