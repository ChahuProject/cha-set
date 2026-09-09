// ChaSetDraggableModal.qml — Cross-Stack Draggable Modal Component
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property bool open: true
    property string title: "Inspector Window"
    property int customRadius: 8
    property string initialPositionMode: "center" // "center" | "top"
    property int topMargin: 72
    property var sizeOptions: []
    property string sizeMenuTooltip: "Adjust Size"
    property real remBase: 16
    property bool autoFitHeight: true
    property bool showEscBadge: false
    property Item fixedFooter: null
    property Item topControls: null

    default property alias contentData: bodyContent.data

    width: 320
    height: 220
    color: ThemeTokens.panel
    border.color: ThemeTokens.border
    border.width: 1
    radius: root.customRadius
    visible: root.open
    clip: true

    Shortcut {
        sequence: "Escape"
        enabled: root.open
        onActivated: root.open = false
    }

    Keys.onEscapePressed: function(event) {
        event.accepted = true
        root.open = false
    }

    Component.onCompleted: {
        applyInitialPosition()
    }

    onParentChanged: {
        applyInitialPosition()
    }

    function applyInitialPosition() {
        if (!parent) return
        var pw = parent.width
        var ph = parent.height
        root.x = Math.max(16, (pw - root.width) / 2)
        if (root.initialPositionMode === "top" || root.initialPositionMode === "顶部靠上") {
            root.y = root.topMargin
            var maxAvailableH = Math.max(100, ph - root.topMargin - 32)
            if (root.height > maxAvailableH) {
                root.height = maxAvailableH
            }
        } else {
            root.y = Math.max(16, (ph - root.height) / 2)
        }
    }

    function applySizeOption(opt) {
        if (!opt) return
        var pw = parent ? parent.width : 1024
        var ph = parent ? parent.height : 768
        var targetW = root.width
        var targetH = root.height

        if (opt.special === "fullscreen" || opt.special === "全窗口") {
            targetW = pw - 16
            targetH = ph - 16
        } else if (opt.special === "default" || opt.special === "默认") {
            targetW = 320
            targetH = 220
        } else {
            if (opt.widthRem !== undefined) targetW = opt.widthRem * root.remBase
            else if (opt.width !== undefined) targetW = opt.width

            if (opt.heightRem !== undefined) targetH = opt.heightRem * root.remBase
            else if (opt.height !== undefined) targetH = opt.height

            targetW = Math.min(targetW, pw - 16)
            targetH = Math.min(targetH, ph - 16)
        }

        root.width = targetW
        root.height = targetH

        root.x = Math.max(8, Math.min((pw - targetW) / 2, Math.max(8, pw - targetW - 8)))
        root.y = Math.max(8, Math.min((ph - targetH) / 2, Math.max(8, ph - targetH - 8)))
    }

    Column {
        anchors.fill: parent

        // Drag Bar Header
        Rectangle {
            id: titleBar
            width: parent.width
            height: 36
            color: ThemeTokens.hover

            MouseArea {
                id: dragArea
                anchors.fill: parent
                drag.target: root
                drag.axis: Drag.XAndYAxis
                drag.minimumX: 0
                drag.maximumX: parent.parent ? parent.parent.parent.width - root.width : 1000
                drag.minimumY: 0
                drag.maximumY: parent.parent ? parent.parent.parent.height - root.height : 1000
                cursorShape: Qt.SizeAllCursor
                z: 0
            }

            Text {
                anchors.left: parent.left
                anchors.leftMargin: 12
                anchors.right: controlsRow.left
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                text: root.title
                color: ThemeTokens.text
                font.pixelSize: 13
                font.weight: Font.DemiBold
                elide: Text.ElideRight
                z: 1
            }

            Row {
                id: controlsRow
                anchors.right: parent.right
                anchors.rightMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                spacing: 4
                z: 1

                // ESC Badge
                Rectangle {
                    id: escBadge
                    visible: root.showEscBadge
                    width: 28
                    height: 18
                    radius: 4
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1
                    anchors.verticalCenter: parent.verticalCenter

                    Text {
                        anchors.centerIn: parent
                        text: "ESC"
                        color: ThemeTokens.subduedText
                        font.pixelSize: 10
                        font.family: "monospace"
                        font.weight: Font.DemiBold
                    }
                }

                // Size Switcher Menu
                ChaSetDropdownMenu {
                    id: sizeMenu
                    visible: root.sizeOptions && root.sizeOptions.length > 0
                    width: 24
                    height: 24
                    anchors.verticalCenter: parent.verticalCenter
                    items: {
                        var res = []
                        if (!root.sizeOptions) return res
                        for (var i = 0; i < root.sizeOptions.length; ++i) {
                            var opt = root.sizeOptions[i]
                            res.push({
                                id: "opt_" + i,
                                label: opt.name || ("Option " + (i + 1)),
                                onSelect: (function(option) {
                                    return function() {
                                        root.applySizeOption(option)
                                    }
                                })(opt)
                            })
                        }
                        return res
                    }

                    ChaSetButton {
                        anchors.fill: parent
                        text: "⤢"
                        variant: "ghost"
                        size: "icon-xs"
                        onClicked: sizeMenu.open = !sizeMenu.open
                    }
                }

                // Custom Top Controls Container
                Item {
                    id: topControlsHost
                    width: root.topControls ? root.topControls.width : 0
                    height: root.topControls ? root.topControls.height : 0
                    visible: !!root.topControls
                    anchors.verticalCenter: parent.verticalCenter
                    children: root.topControls ? [root.topControls] : []
                }

                // Close Button
                ChaSetButton {
                    id: closeBtn
                    text: "✕"
                    variant: "ghost"
                    size: "icon-xs"
                    anchors.verticalCenter: parent.verticalCenter
                    onClicked: root.open = false
                }
            }
        }

        Rectangle {
            width: parent.width
            height: 1
            color: ThemeTokens.border
        }

        Item {
            id: bodyContent
            width: parent.width
            height: parent.height - 37 - (footerArea.visible ? footerArea.height : 0)
        }

        // Fixed Footer
        Rectangle {
            id: footerArea
            width: parent.width
            height: root.fixedFooter ? root.fixedFooter.height : 0
            visible: !!root.fixedFooter
            color: "transparent"

            Rectangle {
                anchors.top: parent.top
                width: parent.width
                height: 1
                color: ThemeTokens.border
            }

            Item {
                anchors.fill: parent
                children: root.fixedFooter ? [root.fixedFooter] : []
            }
        }
    }
}

