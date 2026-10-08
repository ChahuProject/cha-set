// TaskHudDocPage.qml — Living documentation for ChaSetTaskHud.
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Task HUD"
    description: ChaSetI18n.tr("components.taskHud.description", "Floating stack of background executions with progress, overflow and collapse-to-summary.")
    tocItems: [
        { id: "overview", title: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview") },
        { id: "installation", title: ChaSetI18n.tr("showcase.installation", "Installation") },
        { id: "anatomy", title: ChaSetI18n.tr("showcase.anatomy", "Anatomy") },
        { id: "animations", title: ChaSetI18n.tr("showcase.animations", "Animations") },
        { id: "keyboard", title: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation") },
        { id: "props", title: ChaSetI18n.tr("showcase.propsReference", "Props Reference") }
    ]

    ComponentPreview {
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.taskHud.sandboxTitle", "Task HUD Sandbox")
        stageHeight: 420
        reactCode: `const [tasks, setTasks] = useState<TaskItem[]>(initialTasks);

<TaskHud
  tasks={tasks}
  maxVisible={3}
  autoHideDelay={600}
  onDismiss={(id) => setTasks((prev) => prev.filter((task) => task.id !== id))}
  onCancel={(id) => markCancelled(id)}
/>`
        qtCode: `ChaSetTaskHud {
    tasks: demoTasks
    maxVisible: 3
    autoHideDelay: 600
    onDismissed: function(id) { removeTask(id) }
    onCancelled: function(id) { markCancelled(id) }
}`

        controlsData: [
            Row {
                spacing: 8
                DocText {
                    text: ChaSetI18n.tr("overlays.taskHud.simulateTasks", "Simulate Tasks:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.taskHud.addRunning", "Add Running")
                    onClicked: root.addRunning()
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.taskHud.addIndeterminate", "Add Indeterminate")
                    onClicked: root.addIndeterminate()
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.taskHud.succeedTask", "Succeed Task")
                    onClicked: root.settleFirstRunning("success")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.taskHud.failTask", "Fail Task")
                    onClicked: root.settleFirstRunning("error")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.taskHud.clearAll", "Clear All")
                    onClicked: root.clearAll()
                }
            }
        ]

        Rectangle {
            id: hudSandbox
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(16)
            radius: ThemeTokens.dp(12)
            clip: true
            color: Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.2)
            border.width: 1
            border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.7)

            Text {
                anchors.centerIn: parent
                visible: root.demoTasks.length === 0
                text: ChaSetI18n.tr("overlays.taskHud.idleHidden", "Task HUD is idle and hidden. Press \"Add Running\" to simulate background jobs.")
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
                font.family: Typography.familySans
            }

            ChaSetTaskHud {
                id: hudSandboxStack
                anchorItem: hudSandbox
                tasks: root.demoTasks
                maxVisible: 3
                autoHideDelay: 600
                forceVisible: true
                onDismissed: function(id) { root.dismissTask(id) }
                onCancelled: function(id) { root.cancelTask(id) }
            }
        }
    }

    ComponentPreview {
        property string sectionId: "overflow"
        property string sectionTitle: ChaSetI18n.tr("showcase.collapseOverflow", "Collapse & Overflow")
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.taskHud.overflowSandboxTitle", "Collapsed & Overflow")
        stageHeight: 420
        reactCode: `// maxVisible caps the rendered cards; the remaining jobs collapse into an
// overflow pill that expands the stack into a scrollable list.
<TaskHud
  tasks={backlog}
  maxVisible={3}
  placement="bottom-right"
  collapsible
  defaultCollapsed={false}
/>`
        qtCode: `ChaSetTaskHud {
    tasks: backlogTasks
    maxVisible: 3
    placement: "bottom-right"
    collapsible: true
    defaultCollapsed: false
}`

        controlsData: [
            Row {
                spacing: 16
                DocText {
                    text: ChaSetI18n.tr("overlays.taskHud.maxVisible", "Max Visible:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    size: "sm"
                    value: root.overflowMaxVisible
                    options: [
                        { label: "2", value: 2 },
                        { label: "3", value: 3 },
                        { label: "5", value: 5 }
                    ]
                    onValueSelected: function(val) { root.overflowMaxVisible = val }
                }
                DocText {
                    text: ChaSetI18n.tr("overlays.taskHud.placement", "Placement:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    size: "sm"
                    value: root.overflowPlacement
                    options: [
                        { label: ChaSetI18n.tr("overlays.taskHud.placementBottomRight", "Bottom Right"), value: "bottom-right" },
                        { label: ChaSetI18n.tr("overlays.taskHud.placementBottomLeft", "Bottom Left"), value: "bottom-left" },
                        { label: ChaSetI18n.tr("overlays.taskHud.placementTopRight", "Top Right"), value: "top-right" },
                        { label: ChaSetI18n.tr("overlays.taskHud.placementTopLeft", "Top Left"), value: "top-left" },
                        { label: ChaSetI18n.tr("overlays.taskHud.placementBottomCenter", "Bottom Center"), value: "bottom-center" }
                    ]
                    onValueSelected: function(val) { root.overflowPlacement = val }
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: overflowStack.collapsed ? ChaSetI18n.tr("overlays.taskHud.expandStack", "Expand Stack") : ChaSetI18n.tr("overlays.taskHud.collapseStack", "Collapse Stack")
                    onClicked: overflowStack.collapsed = !overflowStack.collapsed
                }
            }
        ]

        Rectangle {
            id: overflowSandbox
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(16)
            radius: ThemeTokens.dp(12)
            clip: true
            color: Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.2)
            border.width: 1
            border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.7)

            ChaSetTaskHud {
                id: overflowStack
                anchorItem: overflowSandbox
                tasks: root.backlog
                maxVisible: root.overflowMaxVisible
                placement: root.overflowPlacement
                dismissEnabled: false
                cancelEnabled: false
            }

            ChaSetBadge {
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.bottom: parent.bottom
                anchors.bottomMargin: ThemeTokens.dp(8)
                text: ChaSetI18n.tr("desktopComposite.taskHud.anchorLabel", "anchor: {{placement}}", { placement: root.overflowPlacement })
                variant: "secondary"
                size: "sm"
            }
        }
    }

    Rectangle {
        property string sectionId: "installation"
        width: parent.width
        implicitHeight: instCol.implicitHeight + ThemeTokens.dp(16)
        color: "transparent"

        Column {
            id: instCol
            width: parent.width
            spacing: ThemeTokens.dp(8)

            DocText {
                text: ChaSetI18n.tr("showcase.installation", "Installation")
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            ChaSetCodeBlock {
                width: parent.width
                language: "bash"
                code: "pnpm add @chahu/cha-set"
            }
        }
    }

    DocAnatomy {
        width: parent.width
        reactCode: `import { TaskHud } from '@chahu/cha-set';

<TaskHud
  tasks={tasks}
  onDismiss={(id) => removeTask(id)}
  placement="bottom-right"
/>`
        qtCode: `import ChaSet

ChaSetTaskHud {
    tasks: demoTasks
    placement: "bottom-right"
    onDismissed: function(id) { removeTask(id) }
}`
    }

    Column {
        property string sectionId: "animations"
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: ChaSetI18n.tr("showcase.animations", "Animations")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.taskHud.animationsDesc", "Motion tokens and kinematic timing contracts for the activity stack and its cards.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.taskHud.animEnterFull", "New cards enter over ThemeTokens.motionMedium (180ms) with the ThemeTokens.easeStandard curve, sliding in from the anchored edge.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.taskHud.animExitGhosts", "Dismissed cards linger as exit ghosts for the same 180ms so the stack reorders underneath them instead of snapping.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.taskHud.animProgressFull", "Determinate progress transitions over ThemeTokens.motionDuration(300); indeterminate tasks run an infinite 1.6s shimmer rail.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.taskHud.animAutoHideFull", "An emptied HUD holds its last frame for autoHideDelay (600ms) before fading out.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.taskHud.animReducedFull", "Every transition is guarded by ThemeTokens.animationsEnabled, which resolves durations to zero when motion is disabled.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }
    }

    Column {
        property string sectionId: "keyboard"
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.taskHud.keyboardDesc", "The stack is a single tab stop: cards are roving-focus entries inside it.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }

        KeyboardShortcutsTable {
            width: parent.width
            componentId: "task-hud"
            title: ""
        }
    }

    Column {
        property string sectionId: "props"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: ChaSetI18n.tr("showcase.propsReference", "Props Reference")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        PropsTable {
            width: parent.width
            title: ""
            propsModel: [
                { name: "tasks", type: "var", default: "[]", description: ChaSetI18n.tr("components.taskHud.propTasks", "Background executions to surface, oldest first; the newest card sits nearest the anchor.") },
                { name: "onDismissed", type: "(id: string) => void", default: "undefined", description: ChaSetI18n.tr("components.taskHud.propOnDismiss", "Renders the per-card dismiss control; omit to make cards non-dismissible.") },
                { name: "onCancelled", type: "(id: string) => void", default: "undefined", description: ChaSetI18n.tr("components.taskHud.propOnCancel", "Renders a cancel control on running tasks flagged cancellable.") },
                { name: "maxVisible", type: "int", default: "3", description: ChaSetI18n.tr("components.taskHud.propMaxVisible", "Cards rendered before the stack overflows into its \"show all\" pill.") },
                { name: "autoHideDelay", type: "int", default: "600", description: ChaSetI18n.tr("components.taskHud.propAutoHideDelay", "Grace period in milliseconds an emptied HUD stays on screen before fading out.") },
                { name: "placement", type: "string", default: "\"bottom-right\"", description: ChaSetI18n.tr("components.taskHud.propPlacement", "Viewport anchor. Cards enter and exit through the anchored edge.") },
                { name: "offset", type: "int", default: "16", description: ChaSetI18n.tr("components.taskHud.propOffset", "Inset from the anchored viewport edges, in logical units.") },
                { name: "collapsible", type: "bool", default: "true", description: ChaSetI18n.tr("components.taskHud.propCollapsible", "Offers the collapse-to-summary-row control.") },
                { name: "defaultCollapsed", type: "bool", default: "false", description: ChaSetI18n.tr("components.taskHud.propDefaultCollapsed", "Renders the stack collapsed on first paint.") },
                { name: "forceVisible", type: "bool", default: "false", description: ChaSetI18n.tr("components.taskHud.propForceVisible", "Keeps the HUD mounted while no task is running (used by static sandboxes).") },
                { name: "label", type: "string", default: "\"Task Progress HUD\"", description: ChaSetI18n.tr("components.taskHud.propLabel", "Accessible name of the HUD region.") }
            ]
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("components.taskHud.taskItemFooter", "Each TaskItem carries id, title, an optional detail, a status of queued | running | success | warning | error | cancelled, a progress ratio (or indeterminate), a total/done step counter and elapsedMs.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }
    }

    // ---- Demo state -------------------------------------------------------

    property int overflowMaxVisible: 3
    property string overflowPlacement: "bottom-right"

    property var demoTasks: [
        {
            id: "task-1",
            title: ChaSetI18n.tr("overlays.taskHud.taskPackagingBundle", "Packaging Bundle"),
            detail: ChaSetI18n.tr("overlays.taskHud.taskPackagingBundleDetail", "Compiling assets and modules"),
            progress: 0.65,
            status: "running",
            elapsedMs: 2400,
            cancellable: true
        },
        {
            id: "task-2",
            title: ChaSetI18n.tr("overlays.taskHud.taskDatabaseMigration", "Database Migration"),
            detail: ChaSetI18n.tr("overlays.taskHud.taskDatabaseMigrationDetail", "Applied 12 schema patches"),
            progress: 1,
            status: "success",
            total: 12,
            done: 12
        }
    ]

    property var backlog: [
        { id: "queue-1", title: ChaSetI18n.tr("overlays.taskHud.taskIndexingSymbols", "Indexing Symbols"), detail: ChaSetI18n.tr("overlays.taskHud.taskIndexingSymbolsDetail", "Scanning 4,182 files"), status: "running", indeterminate: true },
        { id: "queue-2", title: ChaSetI18n.tr("overlays.taskHud.taskOptimizingImages", "Optimizing Images"), detail: ChaSetI18n.tr("overlays.taskHud.taskOptimizingImagesDetail", "Re-encoding 38 assets"), status: "running", progress: 0.42 },
        { id: "queue-3", title: ChaSetI18n.tr("overlays.taskHud.taskRunningUnitTests", "Running Unit Tests"), detail: ChaSetI18n.tr("overlays.taskHud.taskRunningUnitTestsDetail", "Suite 7 of 12"), status: "running", progress: 0.58, total: 12, done: 7 },
        { id: "queue-4", title: ChaSetI18n.tr("overlays.taskHud.taskUploadingArtifacts", "Uploading Artifacts"), detail: ChaSetI18n.tr("overlays.taskHud.taskUploadingArtifactsDetail", "Waiting for credentials"), status: "queued" },
        { id: "queue-5", title: ChaSetI18n.tr("overlays.taskHud.taskGeneratingReport", "Generating Report"), detail: ChaSetI18n.tr("overlays.taskHud.taskGeneratingReportDetail", "Coverage summary"), status: "running", progress: -1 }
    ]

    function copyList(list) {
        var out = []
        for (var i = 0; i < list.length; i++) out.push(list[i])
        return out
    }

    function addRunning() {
        var list = root.copyList(root.demoTasks)
        list.push({
            id: "task-" + Date.now(),
            title: ChaSetI18n.tr("overlays.taskHud.buildJob", "Build Job #{{num}}", { num: (root.demoTasks.length + 1) }),
            detail: ChaSetI18n.tr("overlays.taskHud.processingDependencies", "Processing dependencies"),
            progress: 0.35,
            status: "running",
            elapsedMs: 800,
            cancellable: true
        })
        root.demoTasks = list
    }

    function addIndeterminate() {
        var list = root.copyList(root.demoTasks)
        list.push({
            id: "task-" + Date.now(),
            title: ChaSetI18n.tr("overlays.taskHud.analyzingAst", "Analyzing AST #{{num}}", { num: (root.demoTasks.length + 1) }),
            detail: ChaSetI18n.tr("overlays.taskHud.indexingSymbols", "Indexing symbols"),
            status: "running",
            indeterminate: true
        })
        root.demoTasks = list
    }

    function settleFirstRunning(status) {
        var list = root.copyList(root.demoTasks)
        for (var i = 0; i < list.length; i++) {
            if (list[i].status === "running") {
                list[i] = {
                    id: list[i].id,
                    title: list[i].title,
                    detail: status === "success" ? ChaSetI18n.tr("overlays.taskHud.completedSuccessfully", "Completed successfully") : ChaSetI18n.tr("overlays.taskHud.compilationError", "Compilation error (exit code 1)"),
                    progress: status === "success" ? 1 : list[i].progress,
                    status: status,
                    elapsedMs: list[i].elapsedMs
                }
                break
            }
        }
        root.demoTasks = list
    }

    function clearAll() {
        root.demoTasks = []
    }

    function dismissTask(taskId) {
        var list = []
        for (var i = 0; i < root.demoTasks.length; i++) {
            if (String(root.demoTasks[i].id) !== String(taskId)) list.push(root.demoTasks[i])
        }
        root.demoTasks = list
    }

    function cancelTask(taskId) {
        var list = root.copyList(root.demoTasks)
        for (var i = 0; i < list.length; i++) {
            if (String(list[i].id) === String(taskId)) {
                list[i] = {
                    id: list[i].id,
                    title: list[i].title,
                    detail: ChaSetI18n.tr("overlays.taskHud.cancelledByUser", "Cancelled by user"),
                    status: "cancelled",
                    elapsedMs: list[i].elapsedMs
                }
                break
            }
        }
        root.demoTasks = list
    }
}
