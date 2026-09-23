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
        if (typeof tasks.rowCount === "function") return tasks.rowCount();
        if (typeof tasks.count !== "undefined") return tasks.count;
        if (typeof tasks.length !== "undefined") return tasks.length;
        return 0;
    }

    readonly property bool shouldShow: taskCount > 0 || forceVisible

    // Geometry defaults: bottom-right floating HUD
    implicitWidth: ThemeTokens.dp(360)
    implicitHeight: stackContainer.height + (collapsedPill.visible ? collapsedPill.height + ThemeTokens.dp(8) : 0)
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
        anchors.bottomMargin: ThemeTokens.dp(8)
        anchors.horizontalCenter: parent.horizontalCenter
        width: pillRow.implicitWidth + ThemeTokens.dp(20)
        height: ThemeTokens.dp(24)
        radius: ThemeTokens.dp(12)
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
            spacing: ThemeTokens.dp(4)

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
        implicitHeight: Math.min(stack.implicitHeight, ThemeTokens.dp(420))
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
            spacing: ThemeTokens.dp(10)

            move: Transition {
                NumberAnimation {
                    properties: "y"
                    duration: ThemeTokens.motionMedium
                    easing.type: ThemeTokens.easeStandard
                }
            }
            add: Transition {
                ParallelAnimation {
                    NumberAnimation {
                        property: "opacity"; from: 0; to: 1
                        duration: ThemeTokens.motionMedium
                        easing.type: ThemeTokens.easeStandard
                    }
                    NumberAnimation {
                        property: "x"; from: 20; to: 0
                        duration: ThemeTokens.motionMedium
                        easing.type: ThemeTokens.easeStandard
                    }
                }
            }

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
                    property var modelData: null
                    required property int index

                    visible: index < root.maxVisible

                    readonly property var itemObj: (typeof modelData !== "undefined" && modelData !== null) ? modelData : ((typeof model !== "undefined" && model !== null) ? model : {})
                    readonly property string _id: String((itemObj && itemObj.id !== undefined) ? itemObj.id : ((typeof model !== "undefined" && model?.id !== undefined) ? model.id : ""))
                    readonly property string _title: String((itemObj && itemObj.title !== undefined) ? itemObj.title : ((typeof model !== "undefined" && model?.title !== undefined) ? model.title : ""))
                    readonly property string _detail: String((itemObj && itemObj.detail !== undefined) ? itemObj.detail : ((typeof model !== "undefined" && model?.detail !== undefined) ? model.detail : ""))
                    readonly property var _rawStatus: (itemObj && itemObj.status !== undefined) ? itemObj.status : ((typeof model !== "undefined" && model?.status !== undefined) ? model.status : "running")
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
                    readonly property bool isIndeterminate: Boolean((itemObj && itemObj.indeterminate !== undefined) ? itemObj.indeterminate : ((typeof model !== "undefined" && model?.indeterminate !== undefined) ? model.indeterminate : false)) && isRunning
                    readonly property double _progress: typeof (itemObj && itemObj.progress) === "number" ? itemObj.progress : (typeof model !== "undefined" && typeof model?.progress === "number" ? model.progress : -1)
                    readonly property int _total: typeof (itemObj && itemObj.total) === "number" ? itemObj.total : (typeof model !== "undefined" && typeof model?.total === "number" ? model.total : -1)
                    readonly property int _done: typeof (itemObj && itemObj.done) === "number" ? itemObj.done : (typeof model !== "undefined" && typeof model?.done === "number" ? model.done : 0)
                    readonly property int _elapsedMs: typeof (itemObj && itemObj.elapsedMs) === "number" ? itemObj.elapsedMs : (typeof model !== "undefined" && typeof model?.elapsedMs === "number" ? model.elapsedMs : 0)

                    width: stack.width
                    implicitHeight: cardContent.implicitHeight + ThemeTokens.dp(14) + (showProgress ? ThemeTokens.dp(12) : 0)
                    height: implicitHeight
                    radius: ThemeTokens.dp(10)
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

                    // Bottom line pseudo-shadow
                    Rectangle {
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.bottom: parent.bottom
                        anchors.leftMargin: ThemeTokens.dp(8)
                        anchors.rightMargin: ThemeTokens.dp(8)
                        height: 1
                        radius: 1
                        opacity: 0.18
                        color: "black"
                        visible: !card.isError && !card.isSuccess
                    }

                    // Content Container
                    Item {
                        id: cardContent
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.top: parent.top
                        anchors.leftMargin: ThemeTokens.dp(12)
                        anchors.rightMargin: ThemeTokens.dp(12)
                        anchors.topMargin: ThemeTokens.dp(10)
                        implicitHeight: contentRow.implicitHeight

                        Row {
                            id: contentRow
                            anchors.left: parent.left
                            anchors.right: parent.right
                            spacing: ThemeTokens.dp(10)

                            // Status Icon (32px circular badge)
                            Item {
                                width: ThemeTokens.dp(32)
                                height: ThemeTokens.dp(32)
                                anchors.verticalCenter: parent.verticalCenter

                                Rectangle {
                                    anchors.fill: parent
                                    radius: height / 2
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
                                width: parent.width - ThemeTokens.dp(32) - ThemeTokens.dp(24) - ThemeTokens.dp(20)
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: ThemeTokens.dp(3)

                                Row {
                                    width: parent.width
                                    spacing: ThemeTokens.dp(6)

                                    Text {
                                        width: parent.width - (elapsedText.visible ? elapsedText.width + ThemeTokens.dp(6) : 0)
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
                                width: ThemeTokens.dp(24)
                                height: ThemeTokens.dp(24)
                                radius: height / 2
                                anchors.verticalCenter: parent.verticalCenter
                                color: dismissHover.hovered ? ThemeTokens.hover : "transparent"

                                Behavior on color {
                                    enabled: ThemeTokens.animationsEnabled
                                    ColorAnimation { duration: ThemeTokens.motionShort }
                                }

                                ChaSetIcon {
                                    anchors.centerIn: parent
                                    name: "x"
                                    size: 10
                                    color: dismissHover.hovered ? ThemeTokens.text : ThemeTokens.subduedText
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
                        anchors.leftMargin: ThemeTokens.dp(12)
                        anchors.rightMargin: ThemeTokens.dp(12)
                        anchors.bottomMargin: ThemeTokens.dp(8)
                        height: ThemeTokens.dp(3)
                        clip: true
                        visible: card.showProgress

                        Rectangle {
                            anchors.fill: parent
                            radius: height / 2
                            color: ThemeTokens.border
                            opacity: 0.35
                        }

                        // Determinate Fill
                        Rectangle {
                            id: determinateFill
                            height: parent.height
                            radius: height / 2
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
                            radius: height / 2
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
