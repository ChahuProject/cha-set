import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Task HUD"
    description: "Floating task progress and notification HUD stack for background executions."

    property var demoTasks: [
        {
            id: "task-1",
            title: "Packaging Bundle",
            detail: "Compiling assets and modules",
            progress: 0.65,
            status: "running",
            elapsedMs: 2400
        },
        {
            id: "task-2",
            title: "Database Migration",
            detail: "Applied 12 schema patches",
            status: "success",
            total: 12,
            done: 12
        }
    ]

    function addRunningTask() {
        var id = "task-" + Date.now();
        var newTask = {
            id: id,
            title: "Build Job #" + (demoTasks.length + 1),
            detail: "Processing dependencies",
            progress: 0.35,
            status: "running",
            elapsedMs: 800
        };
        var list = [newTask];
        for (var i = 0; i < demoTasks.length; i++) {
            list.push(demoTasks[i]);
        }
        demoTasks = list;
    }

    function addIndeterminateTask() {
        var id = "task-" + Date.now();
        var newTask = {
            id: id,
            title: "Analyzing AST #" + (demoTasks.length + 1),
            detail: "Indexing symbols",
            status: "running",
            indeterminate: true
        };
        var list = [newTask];
        for (var i = 0; i < demoTasks.length; i++) {
            list.push(demoTasks[i]);
        }
        demoTasks = list;
    }

    function succeedFirstTask() {
        var list = [];
        var updated = false;
        for (var i = 0; i < demoTasks.length; i++) {
            var t = demoTasks[i];
            if (!updated && t.status === "running") {
                list.push({
                    id: t.id,
                    title: t.title,
                    detail: "Completed successfully",
                    progress: 1.0,
                    status: "success",
                    elapsedMs: t.elapsedMs
                });
                updated = true;
            } else {
                list.push(t);
            }
        }
        demoTasks = list;
    }

    function failFirstTask() {
        var list = [];
        var updated = false;
        for (var i = 0; i < demoTasks.length; i++) {
            var t = demoTasks[i];
            if (!updated && t.status === "running") {
                list.push({
                    id: t.id,
                    title: t.title,
                    detail: "Compilation error (exit code 1)",
                    status: "failure",
                    elapsedMs: t.elapsedMs
                });
                updated = true;
            } else {
                list.push(t);
            }
        }
        demoTasks = list;
    }

    function clearAllTasks() {
        demoTasks = [];
    }

    function dismissTask(taskId) {
        var list = [];
        for (var i = 0; i < demoTasks.length; i++) {
            if (demoTasks[i].id !== taskId) {
                list.push(demoTasks[i]);
            }
        }
        demoTasks = list;
    }

    // 1. Overview Section
    Item {
        id: overviewSection
        width: parent ? parent.width : 0
        height: overviewCol.implicitHeight

        Column {
            id: overviewCol
            width: parent.width
            spacing: 16

            DocText {
                text: "Interactive Overview"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            ComponentPreview {
                id: heroPreview
                width: parent.width
                title: "Task HUD Sandbox"
                reactCode: "<TaskHud\n  tasks={tasks}\n  maxVisible={3}\n  autoHideDelay={600}\n  onDismiss={(id) => setTasks((prev) => prev.filter((t) => t.id !== id))}\n/>"
                qtCode: "ChaSetTaskHud {\n    tasks: demoTasks\n    maxVisible: 3\n    autoHideDelay: 600\n    onDismissed: (id) => dismissTask(id)\n}"

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
                            text: "+ Add Running"
                            onClicked: root.addRunningTask()
                        }
                        ChaSetButton {
                            size: "sm"
                            variant: "outline"
                            text: "+ Add Indeterminate"
                            onClicked: root.addIndeterminateTask()
                        }
                        ChaSetButton {
                            size: "sm"
                            variant: "outline"
                            text: "Succeed Task"
                            onClicked: root.succeedFirstTask()
                        }
                        ChaSetButton {
                            size: "sm"
                            variant: "outline"
                            text: "Fail Task"
                            onClicked: root.failFirstTask()
                        }
                        ChaSetButton {
                            size: "sm"
                            variant: "outline"
                            text: "Clear All"
                            onClicked: root.clearAllTasks()
                        }
                    }
                ]

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(320)
                    color: ThemeTokens.panel
                    radius: ThemeTokens.dp(8)
                    border.color: ThemeTokens.border
                    border.width: 1
                    clip: true

                    Text {
                        anchors.centerIn: parent
                        visible: root.demoTasks.length === 0
                        text: "Task HUD is idle and hidden. Click \"+ Add Running\" to simulate background jobs."
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }

                    ChaSetTaskHud {
                        id: previewHud
                        anchors.centerIn: parent
                        tasks: root.demoTasks
                        maxVisible: 3
                        forceVisible: true
                        onDismissed: function(id) {
                            root.dismissTask(id);
                        }
                    }
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetTaskHud {
    title: "Build Process"
    progress: 0.65
    status: "running"
}`
        reactCode: `import { TaskHud } from '@chahu/cha-set';

<TaskHud title="Build Process" progress={0.65} status="running" />`
    }

    // Animations Section
    Item {
        id: animationsSection
        width: parent ? parent.width : 0
        height: animCol.implicitHeight

        Column {
            id: animCol
            width: parent.width
            spacing: 8

            DocText {
                text: "Animations"
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            DocText {
                width: parent.width
                wrap: true
                text: "Card push-up and slide-in transitions animate smoothly over ThemeTokens.motionMedium (180ms) using ThemeTokens.easeStandard. Determinate progress width animates over 220ms, while indeterminate running tasks display an infinite 1.2s shimmer guarded by ThemeTokens.animationsEnabled."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }
        }
    }

    ComponentReference {
        name: "TaskHud"
        componentId: "task-hud"
        propsModel: [
            { name: "tasks", type: "var", defaultVal: "[]", description: "Array or list model of active or completed task objects." },
            { name: "maxVisible", type: "int", defaultVal: "3", description: "Maximum number of task cards displayed before displaying the collapsed pill." },
            { name: "autoHideDelay", type: "int", defaultVal: "600", description: "Delay in ms before fading out after the task queue is empty." },
            { name: "forceVisible", type: "bool", defaultVal: "false", description: "Forces visibility for static previews or testing harnesses." },
            { name: "hudVisible", type: "bool", defaultVal: "false", description: "Current visibility state of the HUD container." }
        ]
    }
}
