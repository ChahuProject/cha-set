// ChaSet Task HUD for Qt (QML), implementing the API contract from
// spec/components/task-hud.ts and capabilities in spec/capabilities.json.
// Floating task progress and notification HUD stack for background executions.
import QtQuick 6.10
import ChaSet

Item {
    id: root

    // API Contract
    property var tasks: []
    property int maxVisible: 3
    property int autoHideDelay: 600
    property bool forceVisible: false
    property bool hudVisible: false

    signal dismissed(string taskId)

    readonly property int taskCount: {
        if (!tasks) return 0;
        if (typeof tasks.count !== "undefined") return tasks.count;
        if (typeof tasks.length !== "undefined") return tasks.length;
        return 0;
    }

    readonly property bool shouldShow: taskCount > 0 || forceVisible

    // Geometry defaults: bottom-right floating HUD
    implicitWidth: 360
    implicitHeight: stackContainer.height + (collapsedPill.visible ? collapsedPill.height + 8 : 0)
    width: implicitWidth
    height: implicitHeight

    visible: opacity > 0.01
    opacity: hudVisible ? 1.0 : 0.0

    Behavior on opacity {
        enabled: ThemeTokens.animationsEnabled
        NumberAnimation {
            duration: ThemeTokens.motionMedium
            easing.type: ThemeTokens.easeStandard
        }
    }

    onShouldShowChanged: {
        if (shouldShow) {
            hideDelay.stop();
            hudVisible = true;
        } else if (hudVisible) {
            hideDelay.restart();
        }
    }

    Component.onCompleted: {
        if (shouldShow) {
            hudVisible = true;
        }
    }

    Timer {
        id: hideDelay
        interval: root.autoHideDelay
        running: !root.shouldShow && root.hudVisible
        onTriggered: root.hudVisible = false
    }

    // Overflow pill indicator (> maxVisible tasks)
    Rectangle {
        id: collapsedPill
        anchors.bottom: stackContainer.top
        anchors.bottomMargin: 8
        anchors.horizontalCenter: parent.horizontalCenter
        width: pillRow.implicitWidth + 20
        height: 24
        radius: 12
        visible: root.taskCount > root.maxVisible && root.hudVisible
        opacity: visible ? 1.0 : 0.0
        color: ThemeTokens.panelRaised
        border.width: 1
        border.color: ThemeTokens.border

        Behavior on opacity {
            enabled: ThemeTokens.animationsEnabled
            NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
        }

        Row {
            id: pillRow
            anchors.centerIn: parent
            spacing: 4

            Text {
                text: qsTr("还有 %1 项").arg(Math.max(0, root.taskCount - root.maxVisible))
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeCaption
                anchors.verticalCenter: parent.verticalCenter
            }

            Text {
                text: "▲"
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeNano
                anchors.verticalCenter: parent.verticalCenter
            }
        }
    }

    // Main stack container
    Item {
        id: stackContainer
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.bottom: parent.bottom
        implicitHeight: stack.implicitHeight
        height: implicitHeight
        clip: true

        Behavior on height {
            enabled: ThemeTokens.animationsEnabled
            NumberAnimation {
                duration: ThemeTokens.motionShort
                easing.type: ThemeTokens.easeStandard
            }
        }

        Column {
            id: stack
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            spacing: 10

            Repeater {
                id: repeater
                model: {
                    if (!root.tasks) return 0;
                    if (Array.isArray(root.tasks)) {
                        return root.tasks.slice(0, root.maxVisible);
                    }
                    return root.tasks;
                }

                delegate: Rectangle {
                    id: card
                    required property var modelData
                    required property int index

                    readonly property var taskObj: modelData || {}
                    readonly property string _id: String(taskObj.id || "")
                    readonly property string _title: String(taskObj.title || "")
                    readonly property string _detail: String(taskObj.detail || "")
                    readonly property var _rawStatus: taskObj.status !== undefined ? taskObj.status : "running"
                    readonly property string _statusStr: {
                        if (typeof _rawStatus === "number") {
                            if (_rawStatus === 1) return "success";
                            if (_rawStatus === 2) return "warning";
                            if (_rawStatus === 3) return "failure";
                            return "running";
                        }
                        var s = String(_rawStatus).toLowerCase();
                        if (s === "error") return "failure";
                        return s;
                    }
                    readonly property bool isRunning: _statusStr === "running"
                    readonly property bool isSuccess: _statusStr === "success"
                    readonly property bool isWarning: _statusStr === "warning"
                    readonly property bool isError: _statusStr === "failure" || _statusStr === "error"
                    readonly property bool isIndeterminate: Boolean(taskObj.indeterminate && isRunning)
                    readonly property double _progress: typeof taskObj.progress === "number" ? taskObj.progress : -1
                    readonly property int _total: typeof taskObj.total === "number" ? taskObj.total : -1
                    readonly property int _done: typeof taskObj.done === "number" ? taskObj.done : 0
                    readonly property int _elapsedMs: typeof taskObj.elapsedMs === "number" ? taskObj.elapsedMs : 0

                    width: stack.width
                    implicitHeight: cardContent.implicitHeight + 14 + (showProgress ? 12 : 0)
                    height: implicitHeight
                    radius: 10
                    color: ThemeTokens.panelRaised
                    border.width: 1
                    border.color: {
                        if (isError) return Qt.rgba(ThemeTokens.danger.r, ThemeTokens.danger.g, ThemeTokens.danger.b, 0.45);
                        if (isSuccess) return Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.38);
                        if (isWarning) return Qt.rgba(ThemeTokens.pendingAccent.r, ThemeTokens.pendingAccent.g, ThemeTokens.pendingAccent.b, 0.38);
                        return Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.6);
                    }

                    readonly property bool showProgress: isRunning || _progress >= 0

                    // Hover overlay
                    Rectangle {
                        anchors.fill: parent
                        radius: parent.radius
                        visible: cardHover.hovered
                        opacity: 0.06
                        color: ThemeTokens.text
                    }

                    HoverHandler {
                        id: cardHover
                    }

                    // Content Container
                    Item {
                        id: cardContent
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.leftMargin: 12
                        anchors.rightMargin: 12
                        anchors.topMargin: 10
                        implicitHeight: contentRow.implicitHeight

                        Row {
                            id: contentRow
                            anchors.left: parent.left
                            anchors.right: parent.right
                            spacing: 10

                            // Status Icon (32px circular badge)
                            Item {
                                width: 32
                                height: 32
                                anchors.verticalCenter: parent.verticalCenter

                                Rectangle {
                                    anchors.fill: parent
                                    radius: 16
                                    color: {
                                        if (card.isError) return Qt.rgba(ThemeTokens.danger.r, ThemeTokens.danger.g, ThemeTokens.danger.b, 0.12);
                                        if (card.isSuccess) return Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.12);
                                        if (card.isWarning) return Qt.rgba(ThemeTokens.pendingAccent.r, ThemeTokens.pendingAccent.g, ThemeTokens.pendingAccent.b, 0.14);
                                        return Qt.rgba(ThemeTokens.panel.r, ThemeTokens.panel.g, ThemeTokens.panel.b, 0.9);
                                    }
                                    border.width: 1
                                    border.color: {
                                        if (card.isError) return Qt.rgba(ThemeTokens.danger.r, ThemeTokens.danger.g, ThemeTokens.danger.b, 0.22);
                                        if (card.isSuccess) return Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.20);
                                        return Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.4);
                                    }
                                }

                                ChaSetStatusIcon {
                                    anchors.centerIn: parent
                                    size: 16
                                    status: card._statusStr
                                }
                            }

                            // Middle text column
                            Column {
                                id: midCol
                                width: parent.width - 32 - 24 - 20
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: 3

                                Row {
                                    width: parent.width
                                    spacing: 6

                                    Text {
                                        width: parent.width - (elapsedText.visible ? elapsedText.width + 6 : 0)
                                        text: card._title || qsTr("Task")
                                        color: ThemeTokens.text
                                        font.pixelSize: Typography.sizeBody
                                        font.weight: Typography.weightSemibold
                                        elide: Text.ElideRight
                                        maximumLineCount: 1
                                    }

                                    Text {
                                        id: elapsedText
                                        visible: card.isRunning && card._elapsedMs > 0
                                        text: {
                                            const ms = card._elapsedMs;
                                            if (!ms) return "";
                                            if (ms < 1000) return ms + "ms";
                                            return (ms / 1000).toFixed(1) + "s";
                                        }
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeMicro
                                        anchors.verticalCenter: parent.verticalCenter
                                    }
                                }

                                Text {
                                    width: parent.width
                                    text: {
                                        const d = card._detail || "";
                                        const total = card._total;
                                        const done = card._done;
                                        if (total > 0) {
                                            const frac = done + "/" + total;
                                            return d ? d + "  " + frac : frac;
                                        }
                                        return d;
                                    }
                                    visible: text.length > 0
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: Typography.sizeCaption
                                    elide: Text.ElideRight
                                    maximumLineCount: 1
                                }
                            }

                            // Dismiss button
                            Rectangle {
                                id: dismissBtn
                                width: 24
                                height: 24
                                radius: 12
                                anchors.verticalCenter: parent.verticalCenter
                                color: dismissHover.hovered ? ThemeTokens.hover : "transparent"

                                Behavior on color {
                                    enabled: ThemeTokens.animationsEnabled
                                    ColorAnimation { duration: ThemeTokens.motionShort }
                                }

                                Text {
                                    anchors.centerIn: parent
                                    text: "✕"
                                    color: dismissHover.hovered ? ThemeTokens.text : ThemeTokens.subduedText
                                    font.pixelSize: Typography.sizeCaption
                                }

                                HoverHandler {
                                    id: dismissHover
                                    cursorShape: Qt.PointingHandCursor
                                }

                                TapHandler {
                                    onTapped: {
                                        root.dismissed(card._id);
                                    }
                                }
                            }
                        }
                    }

                    // Progress Bar
                    Item {
                        id: progressWrap
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.bottom: parent.bottom
                        anchors.leftMargin: 12
                        anchors.rightMargin: 12
                        anchors.bottomMargin: 8
                        height: 3
                        clip: true
                        visible: card.showProgress

                        Rectangle {
                            anchors.fill: parent
                            radius: 1.5
                            color: ThemeTokens.border
                            opacity: 0.35
                        }

                        // Determinate Fill
                        Rectangle {
                            id: determinateFill
                            height: parent.height
                            radius: 1.5
                            visible: !card.isIndeterminate
                            width: {
                                const p = card._progress;
                                if (isNaN(p) || p < 0) return 0;
                                return Math.max(0, Math.min(1, p)) * parent.width;
                            }
                            color: {
                                if (card.isError) return ThemeTokens.danger;
                                if (card.isWarning) return ThemeTokens.pendingAccent;
                                return ThemeTokens.accent;
                            }

                            Behavior on width {
                                enabled: ThemeTokens.animationsEnabled
                                NumberAnimation {
                                    duration: ThemeTokens.motionMedium
                                    easing.type: ThemeTokens.easeStandard
                                }
                            }
                        }

                        // Indeterminate Shimmer
                        Rectangle {
                            id: shimmerBar
                            height: parent.height
                            radius: 1.5
                            width: parent.width * 0.36
                            visible: card.isIndeterminate
                            color: ThemeTokens.accent
                            opacity: 0.95
                            x: -width

                            SequentialAnimation on x {
                                loops: Animation.Infinite
                                running: ThemeTokens.animationsEnabled && shimmerBar.visible && card.visible && root.hudVisible
                                NumberAnimation {
                                    from: -shimmerBar.width
                                    to: progressWrap.width
                                    duration: 1200
                                    easing.type: ThemeTokens.easeStandard
                                }
                                PauseAnimation { duration: 80 }
                            }
                        }
                    }
                }
            }
        }
    }
}
