// ChaSetMediaProgressBar.qml — Cross-Stack Media Progress Bar Component
// 支持拖拽擦洗、点击 seek、悬停预览、左下方「位置 / 总长」时间显示、
// 点击翻转正/倒计时、状态 Tooltip 与右键格式/计时菜单。
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root
    objectName: "chaSetMediaProgressBar"

    // —— 播放比例、位置与时长 ——
    property real ratio: 0.0
    property real position: 0.0      // 当前播放位置（毫秒）
    property real duration: 0.0      // 总时长（毫秒）
    property real frameRate: 30.0    // 帧率（fps）

    // —— 计时与显示配置 ——
    property string timingMode: "elapsed"   // "elapsed" (正计时) | "remaining" (倒计时)
    property string timeFormat: "hms"       // "hms" (时分秒) | "seconds" (秒) | "frames" (帧率)
    property bool showTime: true
    property bool showThumb: true
    property bool interactive: true
    property bool disabled: false
    // 帧率概念是否可用（音频等无逐帧概念的媒体应设为 false，隐藏「按帧率显示」菜单项）
    property bool framesAvailable: true

    // —— 状态 ——
    property bool dragging: false
    property real dragRatio: 0.0
    property bool hoverActive: false
    property real hoverRatio: -1.0

    // —— 视觉样式 ——
    property color trackColor: Qt.rgba(1, 1, 1, 0.25)
    property color progressColor: ThemeTokens.accent
    property color thumbColor: dragging ? "#FFFFFF" : progressColor
    property color timeColor: ThemeTokens.text
    property color timeSubduedColor: ThemeTokens.subduedText
    property real trackHeight: ThemeTokens.dp(4)
    property real thumbSize: ThemeTokens.dp(10)

    // —— 信号 ——
    signal seekRequested(real ratio)
    signal hoverChanged(real ratio, bool active)

    // Registry / Escape contract — see ChaSetOverlayHub.
    property bool closeOnEscape: true

    Shortcut {
        sequence: "Escape"
        autoRepeat: false
        enabled: contextMenuPopup.opened && root.closeOnEscape && ChaSetOverlayHub.isTop(contextMenuPopup)
        onActivated: contextMenuPopup.close()
    }

    implicitHeight: root.showTime ? ThemeTokens.dp(36) : ThemeTokens.dp(22)
    height: implicitHeight
    opacity: root.disabled ? 0.45 : 1.0

    readonly property real effectiveRatio: root.dragging
        ? Math.max(0.0, Math.min(1.0, root.dragRatio))
        : Math.max(0.0, Math.min(1.0, root.ratio))

    // 实际生效的时间格式：无帧率概念时，即便被设为 "frames" 也回退到时分秒
    readonly property string effectiveTimeFormat: (root.timeFormat === "frames" && !root.framesAvailable) ? "hms" : root.timeFormat

    // —— 格式化辅助函数 ——
    function pad2(n) {
        return n < 10 ? "0" + n : "" + n
    }

    function formatHms(ms) {
        const totalSec = Math.max(0, Math.floor(ms / 1000))
        const h = Math.floor(totalSec / 3600)
        const m = Math.floor((totalSec % 3600) / 60)
        const s = totalSec % 60
        if (root.duration >= 3600000 || h > 0) {
            return h + ":" + pad2(m) + ":" + pad2(s)
        }
        return pad2(m) + ":" + pad2(s)
    }

    function formatSeconds(ms) {
        const s = Math.max(0, ms / 1000)
        return s.toFixed(1) + "s"
    }

    function formatFrames(ms) {
        const fps = root.frameRate > 0 ? root.frameRate : 30.0
        const f = Math.max(0, Math.floor((ms / 1000.0) * fps))
        return ChaSetI18n.tr("components.mediaProgressBar.framesUnit", "{{f}} 帧", { f: f })
    }

    readonly property real currentPositionMs: {
        if (root.dragging && root.duration > 0) {
            return root.dragRatio * root.duration
        }
        return root.position
    }

    readonly property real currentElapsedMs: Math.max(0, root.currentPositionMs)
    readonly property real currentRemainingMs: Math.max(0, root.duration - root.currentPositionMs)

    readonly property string positionText: {
        const isRemaining = root.timingMode === "remaining"
        const ms = isRemaining ? root.currentRemainingMs : root.currentElapsedMs
        const prefix = isRemaining ? "-" : ""
        if (root.effectiveTimeFormat === "seconds") {
            return prefix + formatSeconds(ms)
        } else if (root.effectiveTimeFormat === "frames") {
            return prefix + formatFrames(ms)
        } else {
            return prefix + formatHms(ms)
        }
    }

    readonly property string durationText: {
        if (root.effectiveTimeFormat === "seconds") {
            return formatSeconds(root.duration)
        } else if (root.effectiveTimeFormat === "frames") {
            return formatFrames(root.duration)
        } else {
            return formatHms(root.duration)
        }
    }

    function openContextMenu() {
        const globalPos = root.mapToItem(null, 0, 0)
        const winHeight = (root.Window && root.Window.window) ? root.Window.window.height : 800
        const menuHeight = contextMenuPopup.implicitHeight || ThemeTokens.dp(180)
        if (globalPos.y + timeRow.y + timeRow.height + menuHeight > winHeight) {
            contextMenuPopup.y = timeRow.y - menuHeight - ThemeTokens.dp(4)
        } else {
            contextMenuPopup.y = timeRow.y + timeRow.height + ThemeTokens.dp(4)
        }
        contextMenuPopup.open()
    }

    // —— 1. 进度条上层轨道区 ——
    Item {
        id: trackContainer
        anchors.top: parent.top
        anchors.left: parent.left
        anchors.right: parent.right
        height: root.showTime ? ThemeTokens.dp(22) : parent.height

        // 底轨
        Rectangle {
            id: track
            anchors.verticalCenter: parent.verticalCenter
            anchors.left: parent.left
            anchors.right: parent.right
            height: root.trackHeight
            radius: root.trackHeight * 0.5
            color: root.trackColor
        }

        // 已播放填充
        Rectangle {
            id: fill
            anchors.verticalCenter: parent.verticalCenter
            anchors.left: parent.left
            height: root.trackHeight
            radius: root.trackHeight * 0.5
            width: Math.max(0, Math.min(parent.width, parent.width * root.effectiveRatio))
            color: root.progressColor
        }

        // 拖动把柄
        Rectangle {
            id: thumb
            visible: root.showThumb
            x: Math.max(0, Math.min(parent.width - width, parent.width * root.effectiveRatio - width / 2))
            anchors.verticalCenter: parent.verticalCenter
            width: root.thumbSize
            height: root.thumbSize
            radius: root.thumbSize * 0.5
            color: root.thumbColor

            Behavior on scale {
                enabled: ThemeTokens.animationsEnabled
                NumberAnimation { duration: ThemeTokens.motionShort }
            }
            scale: root.dragging ? 1.25 : (root.hoverActive ? 1.1 : 1.0)
        }

        // 交互响应区
        MouseArea {
            id: mouseArea
            anchors.fill: parent
            hoverEnabled: root.interactive && !root.disabled
            enabled: root.interactive && !root.disabled
            cursorShape: Qt.PointingHandCursor
            acceptedButtons: Qt.LeftButton

            onEntered: {
                root.hoverActive = true
                root.hoverChanged(root.hoverRatio, true)
            }
            onExited: {
                root.hoverActive = false
                root.hoverRatio = -1.0
                root.hoverChanged(-1.0, false)
            }

            onPositionChanged: (m) => {
                const r = trackContainer.width > 0 ? Math.max(0.0, Math.min(1.0, m.x / trackContainer.width)) : -1.0
                root.hoverRatio = r
                root.hoverChanged(r, true)
                if (pressed && trackContainer.width > 0) {
                    root.dragRatio = r
                    root.seekRequested(r)
                }
            }

            onPressed: (m) => {
                root.dragging = true
                root.hoverActive = true
                if (trackContainer.width > 0) {
                    const r = Math.max(0.0, Math.min(1.0, m.x / trackContainer.width))
                    root.hoverRatio = r
                    root.dragRatio = r
                    root.seekRequested(r)
                    root.hoverChanged(r, true)
                }
            }

            onReleased: root.dragging = false
            onCanceled: root.dragging = false
        }

        // 外部预览插槽容器（例如 VideoProgressPreview 或波形图）
        Item {
            id: previewSlot
            anchors.fill: parent
            z: 20
        }
    }

    // —— 2. 进度条下层左侧时间区 ——
    Row {
        id: timeRow
        visible: root.showTime
        anchors.top: trackContainer.bottom
        anchors.topMargin: 0
        anchors.left: parent.left
        anchors.leftMargin: ThemeTokens.dp(2)
        spacing: ThemeTokens.dp(4)
        height: ThemeTokens.dp(14)

        // 位置胶囊（支持悬停高亮、点击切换正/倒计时、右键菜单）
        Rectangle {
            id: posPill
            objectName: "mediaTimePositionPill"
            anchors.verticalCenter: parent.verticalCenter
            height: ThemeTokens.dp(14)
            width: posText.implicitWidth + ThemeTokens.dp(8)
            radius: ThemeTokens.dp(3)
            color: posMouseArea.pressed
                   ? Qt.rgba(1, 1, 1, 0.22)
                   : (posMouseArea.containsMouse ? (ThemeTokens.hover ? ThemeTokens.hover : Qt.rgba(1, 1, 1, 0.12)) : "transparent")

            Behavior on color {
                enabled: ThemeTokens.animationsEnabled
                ColorAnimation { duration: ThemeTokens.motionQuick }
            }

            Text {
                id: posText
                objectName: "mediaTimePositionText"
                anchors.centerIn: parent
                text: root.positionText
                color: posMouseArea.containsMouse ? ThemeTokens.text : root.timeColor
                font.pixelSize: Typography.sizeCaption
            }

            MouseArea {
                id: posMouseArea
                objectName: "mediaTimePositionMouseArea"
                anchors.fill: parent
                hoverEnabled: root.interactive && !root.disabled
                enabled: root.interactive && !root.disabled
                cursorShape: Qt.PointingHandCursor
                acceptedButtons: Qt.LeftButton | Qt.RightButton

                onClicked: (mouse) => {
                    if (mouse.button === Qt.LeftButton) {
                        root.timingMode = (root.timingMode === "elapsed" ? "remaining" : "elapsed")
                    } else if (mouse.button === Qt.RightButton) {
                        root.openContextMenu()
                    }
                }
            }

            ChaSetTooltip {
                anchors.fill: parent
                target: posPill
                // 时间胶囊位于控制条最底部：tooltip 必须朝上（top）显示，
                // 否则 "bottom" 的浮泡会超出窗口底边被 clampedY 拉回，
                // 正好叠回胶囊上，遮挡鼠标悬停处的内容（用户反馈看不清）。
                side: "top"
                active: posMouseArea.containsMouse && !contextMenuPopup.visible
                text: root.timingMode === "elapsed"
                      ? ChaSetI18n.tr("components.mediaProgressBar.currentElapsedTooltip", "当前：正计时 (已播放时间)")
                      : ChaSetI18n.tr("components.mediaProgressBar.currentRemainingTooltip", "当前：倒计时 (剩余时间)")
                shortcut: ChaSetI18n.tr("components.mediaProgressBar.toggleTooltip", "点击切换 · 右键打开菜单")
            }
        }

        // 分隔符
        Text {
            id: sepText
            anchors.verticalCenter: parent.verticalCenter
            text: "/"
            color: root.timeSubduedColor
            font.pixelSize: Typography.sizeCaption
        }

        // 总时长
        Text {
            id: durText
            objectName: "mediaTimeDurationText"
            anchors.verticalCenter: parent.verticalCenter
            text: root.durationText
            color: root.timeSubduedColor
            font.pixelSize: Typography.sizeCaption

            MouseArea {
                anchors.fill: parent
                hoverEnabled: false
                acceptedButtons: Qt.RightButton
                onClicked: (mouse) => {
                    if (mouse.button === Qt.RightButton) {
                        root.openContextMenu()
                    }
                }
            }
        }
    }

    // —— 3. 专属右键上下文菜单 ——
    Popup {
        id: contextMenuPopup
        objectName: "mediaTimeContextMenu"
        onOpened: ChaSetOverlayHub.register(contextMenuPopup)
        onClosed: ChaSetOverlayHub.unregister(contextMenuPopup)
        x: timeRow.x
        width: ThemeTokens.dp(168)
        padding: ThemeTokens.dp(4)
        modal: false
        focus: true
        closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

        background: Rectangle {
            color: ThemeTokens.panelRaised
            border.color: ThemeTokens.border
            border.width: 1
            radius: ThemeTokens.dp(6)
        }

        contentItem: Column {
            spacing: ThemeTokens.dp(2)
            width: parent.width

            // 计时方式标题
            Text {
                text: ChaSetI18n.tr("components.mediaProgressBar.timingModeMenuTitle", "计时方式")
                font.pixelSize: Typography.sizeMicro
                font.bold: true
                color: ThemeTokens.subduedText
                leftPadding: ThemeTokens.dp(8)
                topPadding: ThemeTokens.dp(2)
                bottomPadding: ThemeTokens.dp(2)
            }

            // 正计时
            Rectangle {
                objectName: "mediaMenuElapsedItem"
                width: parent.width
                height: ThemeTokens.dp(24)
                radius: ThemeTokens.dp(4)
                color: elapsedMouse.containsMouse ? ThemeTokens.hover : "transparent"
                Row {
                    anchors.fill: parent
                    anchors.leftMargin: ThemeTokens.dp(6)
                    anchors.rightMargin: ThemeTokens.dp(6)
                    spacing: ThemeTokens.dp(6)
                    Item {
                        anchors.verticalCenter: parent.verticalCenter
                        width: ThemeTokens.dp(14)
                        height: ThemeTokens.dp(14)
                        ChaSetIcon {
                            anchors.centerIn: parent
                            name: "check"
                            size: ThemeTokens.dp(12)
                            color: ThemeTokens.accent
                            visible: root.timingMode === "elapsed"
                        }
                    }
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("components.mediaProgressBar.elapsedMode", "正计时 (已播放)")
                        font.pixelSize: Typography.sizeCaption
                        color: ThemeTokens.text
                    }
                }
                MouseArea {
                    id: elapsedMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        root.timingMode = "elapsed"
                        contextMenuPopup.close()
                    }
                }
            }

            // 倒计时
            Rectangle {
                objectName: "mediaMenuRemainingItem"
                width: parent.width
                height: ThemeTokens.dp(24)
                radius: ThemeTokens.dp(4)
                color: remainingMouse.containsMouse ? ThemeTokens.hover : "transparent"
                Row {
                    anchors.fill: parent
                    anchors.leftMargin: ThemeTokens.dp(6)
                    anchors.rightMargin: ThemeTokens.dp(6)
                    spacing: ThemeTokens.dp(6)
                    Item {
                        anchors.verticalCenter: parent.verticalCenter
                        width: ThemeTokens.dp(14)
                        height: ThemeTokens.dp(14)
                        ChaSetIcon {
                            anchors.centerIn: parent
                            name: "check"
                            size: ThemeTokens.dp(12)
                            color: ThemeTokens.accent
                            visible: root.timingMode === "remaining"
                        }
                    }
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("components.mediaProgressBar.remainingMode", "倒计时 (剩余)")
                        font.pixelSize: Typography.sizeCaption
                        color: ThemeTokens.text
                    }
                }
                MouseArea {
                    id: remainingMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        root.timingMode = "remaining"
                        contextMenuPopup.close()
                    }
                }
            }

            // 分割线
            Rectangle {
                width: parent.width - ThemeTokens.dp(8)
                anchors.horizontalCenter: parent.horizontalCenter
                height: 1
                color: ThemeTokens.border
            }

            // 时间格式标题
            Text {
                text: ChaSetI18n.tr("components.mediaProgressBar.timeFormatMenuTitle", "时间格式")
                font.pixelSize: Typography.sizeMicro
                font.bold: true
                color: ThemeTokens.subduedText
                leftPadding: ThemeTokens.dp(8)
                topPadding: ThemeTokens.dp(2)
                bottomPadding: ThemeTokens.dp(2)
            }

            // 时分秒
            Rectangle {
                objectName: "mediaMenuHmsItem"
                width: parent.width
                height: ThemeTokens.dp(24)
                radius: ThemeTokens.dp(4)
                color: hmsMouse.containsMouse ? ThemeTokens.hover : "transparent"
                Row {
                    anchors.fill: parent
                    anchors.leftMargin: ThemeTokens.dp(6)
                    anchors.rightMargin: ThemeTokens.dp(6)
                    spacing: ThemeTokens.dp(6)
                    Item {
                        anchors.verticalCenter: parent.verticalCenter
                        width: ThemeTokens.dp(14)
                        height: ThemeTokens.dp(14)
                        ChaSetIcon {
                            anchors.centerIn: parent
                            name: "check"
                            size: ThemeTokens.dp(12)
                            color: ThemeTokens.accent
                            visible: root.effectiveTimeFormat === "hms"
                        }
                    }
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("components.mediaProgressBar.formatHms", "时分秒 (00:00)")
                        font.pixelSize: Typography.sizeCaption
                        color: ThemeTokens.text
                    }
                }
                MouseArea {
                    id: hmsMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        root.timeFormat = "hms"
                        contextMenuPopup.close()
                    }
                }
            }

            // 按秒显示
            Rectangle {
                objectName: "mediaMenuSecondsItem"
                width: parent.width
                height: ThemeTokens.dp(24)
                radius: ThemeTokens.dp(4)
                color: secMouse.containsMouse ? ThemeTokens.hover : "transparent"
                Row {
                    anchors.fill: parent
                    anchors.leftMargin: ThemeTokens.dp(6)
                    anchors.rightMargin: ThemeTokens.dp(6)
                    spacing: ThemeTokens.dp(6)
                    Item {
                        anchors.verticalCenter: parent.verticalCenter
                        width: ThemeTokens.dp(14)
                        height: ThemeTokens.dp(14)
                        ChaSetIcon {
                            anchors.centerIn: parent
                            name: "check"
                            size: ThemeTokens.dp(12)
                            color: ThemeTokens.accent
                            visible: root.effectiveTimeFormat === "seconds"
                        }
                    }
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("components.mediaProgressBar.formatSeconds", "按秒显示 (0.0s)")
                        font.pixelSize: Typography.sizeCaption
                        color: ThemeTokens.text
                    }
                }
                MouseArea {
                    id: secMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        root.timeFormat = "seconds"
                        contextMenuPopup.close()
                    }
                }
            }

            // 按帧率显示
            Rectangle {
                objectName: "mediaMenuFramesItem"
                visible: root.framesAvailable
                width: parent.width
                height: root.framesAvailable ? ThemeTokens.dp(24) : 0
                radius: ThemeTokens.dp(4)
                color: frameMouse.containsMouse ? ThemeTokens.hover : "transparent"
                Row {
                    anchors.fill: parent
                    anchors.leftMargin: ThemeTokens.dp(6)
                    anchors.rightMargin: ThemeTokens.dp(6)
                    spacing: ThemeTokens.dp(6)
                    Item {
                        anchors.verticalCenter: parent.verticalCenter
                        width: ThemeTokens.dp(14)
                        height: ThemeTokens.dp(14)
                        ChaSetIcon {
                            anchors.centerIn: parent
                            name: "check"
                            size: ThemeTokens.dp(12)
                            color: ThemeTokens.accent
                            visible: root.effectiveTimeFormat === "frames"
                        }
                    }
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("components.mediaProgressBar.formatFrames", "按帧率显示 (0 帧)")
                        font.pixelSize: Typography.sizeCaption
                        color: ThemeTokens.text
                    }
                }
                MouseArea {
                    id: frameMouse
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        root.timeFormat = "frames"
                        contextMenuPopup.close()
                    }
                }
            }
        }
    }
}
