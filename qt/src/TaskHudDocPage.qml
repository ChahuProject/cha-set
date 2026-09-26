// TaskHudDocPage.qml — Living documentation for ChaSetTaskHud.
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Task HUD"
    description: "Floating task progress and notification HUD stack for background executions."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "overflow", title: "Collapse & Overflow" },
        { id: "anatomy", title: "Anatomy" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    ComponentPreview {
        width: parent.width
        title: "Task HUD Sandbox"
        stageHeight: 360
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
                    text: "Simulate Tasks:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Add Running"
                    onClicked: root.addRunning()
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Add Indeterminate"
                    onClicked: root.addIndeterminate()
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Succeed Task"
                    onClicked: root.settleFirstRunning("success")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Fail Task"
                    onClicked: root.settleFirstRunning("error")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Clear All"
                    onClicked: root.clearAll()
                }
            }
        ]

        Rectangle {
            id: hudSandbox
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(16)
            radius: ThemeTokens.dp(12)
            color: Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.2)
            border.width: 1
            border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.7)

            Text {
                anchors.centerIn: parent
                visible: root.demoTasks.length === 0
                text: "Task HUD is idle and hidden. Press \"Add Running\" to simulate background jobs."
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
        property string sectionTitle: "Collapse & Overflow"
        width: parent.width
        title: "Collapsed & Overflow"
        stageHeight: 380
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
                    text: "Max Visible:"
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
                    text: "Placement:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    size: "sm"
                    value: root.overflowPlacement
                    options: [
                        { label: "Bottom Right", value: "bottom-right" },
                        { label: "Top Right", value: "top-right" },
                        { label: "Bottom Left", value: "bottom-left" }
                    ]
                    onValueSelected: function(val) { root.overflowPlacement = val }
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: overflowStack.collapsed ? "Expand Stack" : "Collapse Stack"
                    onClicked: overflowStack.collapsed = !overflowStack.collapsed
                }
            }
        ]

        Rectangle {
            id: overflowSandbox
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(16)
            radius: ThemeTokens.dp(12)
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

            Text {
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.bottom: parent.bottom
                anchors.bottomMargin: ThemeTokens.dp(8)
                text: "anchor: " + root.overflowPlacement
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeCaption
                font.family: Typography.familyMono
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
            text: "Animations"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Motion tokens and kinematic timing contracts for the activity stack and its cards."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: "New cards enter over ThemeTokens.motionMedium (180ms) with the ThemeTokens.easeStandard curve, sliding in from the anchored edge."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Dismissed cards linger as exit ghosts for the same 180ms so the stack reorders underneath them instead of snapping."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Determinate progress transitions over ThemeTokens.motionDuration(300); indeterminate tasks run an infinite 1.6s shimmer rail."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: "An emptied HUD holds its last frame for autoHideDelay (600ms) before fading out."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Every transition is guarded by ThemeTokens.animationsEnabled, which resolves durations to zero when motion is disabled."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }
    }

    Column {
        property string sectionId: "keyboard"
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: "Keyboard Navigation"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: "The stack is a single tab stop: cards are roving-focus entries inside it."
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
            text: "Props Reference"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        PropsTable {
            width: parent.width
            title: ""
            propsModel: [
                { name: "tasks", type: "var", default: "[]", description: "Background executions to surface, oldest first; the newest card sits nearest the anchor." },
                { name: "onDismissed", type: "(id: string) => void", default: "undefined", description: "Renders the per-card dismiss control; omit to make cards non-dismissible." },
                { name: "onCancelled", type: "(id: string) => void", default: "undefined", description: "Renders a cancel control on running tasks flagged cancellable." },
                { name: "maxVisible", type: "int", default: "3", description: "Cards rendered before the stack overflows into its \"show all\" pill." },
                { name: "autoHideDelay", type: "int", default: "600", description: "Grace period in milliseconds an emptied HUD stays on screen before fading out." },
                { name: "placement", type: "string", default: "\"bottom-right\"", description: "Viewport anchor. Cards enter and exit through the anchored edge." },
                { name: "offset", type: "int", default: "16", description: "Inset from the anchored viewport edges, in logical units." },
                { name: "collapsible", type: "bool", default: "true", description: "Offers the collapse-to-summary-row control." },
                { name: "defaultCollapsed", type: "bool", default: "false", description: "Renders the stack collapsed on first paint." },
                { name: "forceVisible", type: "bool", default: "false", description: "Keeps the HUD mounted while no task is running (used by static sandboxes)." },
                { name: "label", type: "string", default: "\"Task Progress HUD\"", description: "Accessible name of the HUD region." }
            ]
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Each task carries id, title, an optional detail, a status of queued | running | success | warning | error | cancelled, a progress ratio (or indeterminate), a total/done step counter and elapsedMs."
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
            title: "Packaging Bundle",
            detail: "Compiling assets and modules",
            progress: 0.65,
            status: "running",
            elapsedMs: 2400,
            cancellable: true
        },
        {
            id: "task-2",
            title: "Database Migration",
            detail: "Applied 12 schema patches",
            progress: 1,
            status: "success",
            total: 12,
            done: 12
        }
    ]

    property var backlog: [
        { id: "queue-1", title: "Indexing Symbols", detail: "Scanning 4,182 files", status: "running", indeterminate: true },
        { id: "queue-2", title: "Optimizing Images", detail: "Re-encoding 38 assets", status: "running", progress: 0.42 },
        { id: "queue-3", title: "Running Unit Tests", detail: "Suite 7 of 12", status: "running", progress: 0.58, total: 12, done: 7 },
        { id: "queue-4", title: "Uploading Artifacts", detail: "Waiting for credentials", status: "queued" },
        { id: "queue-5", title: "Generating Report", detail: "Coverage summary", status: "running", progress: -1 }
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
            title: "Build Job #" + (root.demoTasks.length + 1),
            detail: "Processing dependencies",
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
            title: "Analyzing AST #" + (root.demoTasks.length + 1),
            detail: "Indexing symbols",
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
                    detail: status === "success" ? "Completed successfully" : "Compilation error (exit code 1)",
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
                    detail: "Cancelled by user",
                    status: "cancelled",
                    elapsedMs: list[i].elapsedMs
                }
                break
            }
        }
        root.demoTasks = list
    }
}
