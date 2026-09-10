// ChaSetCopyButton.qml — Cross-Stack Copy Button Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string text: ""
    property alias textToCopy: root.text
    property string label: ""
    property string copiedLabel: "Copied!"
    property int timeout: 2000
    property string variant: "outline"
    property string size: label.length > 0 ? "sm" : "icon-xs"
    property bool copied: false
    readonly property bool hovered: btn.effectiveHovered

    signal copiedToClipboard(string text)

    implicitWidth: root.label.length > 0 ? (labelRow.implicitWidth + 24) : btn.implicitWidth
    implicitHeight: btn.implicitHeight

    Timer {
        id: resetTimer
        interval: root.timeout
        repeat: false
        onTriggered: root.copied = false
    }

    // Hidden helper for real clipboard access in Qt Quick
    TextEdit {
        id: clipboardHelper
        visible: false
        width: 0
        height: 0
    }

    function copy() {
        var content = root.text.length > 0 ? root.text : root.textToCopy
        if (content && content.length > 0) {
            clipboardHelper.text = content
            clipboardHelper.selectAll()
            clipboardHelper.copy()
            clipboardHelper.deselect()
        }
        root.copied = true
        resetTimer.restart()
        root.copiedToClipboard(content)
    }

    ChaSetButton {
        id: btn
        anchors.fill: parent
        variant: root.variant
        size: root.size
        onClicked: root.copy()

        // Icon-only presentation (centered)
        Item {
            anchors.centerIn: parent
            width: 14
            height: 14
            visible: root.label.length === 0

            // Copy icon (two overlapping rectangles)
            Item {
                anchors.fill: parent
                visible: !root.copied

                Rectangle {
                    x: 3; y: 0; width: 9; height: 9; radius: 1
                    color: "transparent"
                    border.color: btn.effectiveHovered ? ThemeTokens.text : ThemeTokens.subduedText
                    border.width: 1.2
                }
                Rectangle {
                    x: 0; y: 3; width: 9; height: 9; radius: 1
                    color: btn.variant === "outline" ? ThemeTokens.background : (btn.variant === "ghost" ? "transparent" : ThemeTokens.panel)
                    border.color: btn.effectiveHovered ? ThemeTokens.text : ThemeTokens.subduedText
                    border.width: 1.2
                }
            }

            // Checkmark icon
            Text {
                anchors.centerIn: parent
                visible: root.copied
                text: "✓"
                color: "#10b981"
                font.pixelSize: 13
                font.bold: true
                verticalAlignment: Text.AlignVCenter
                horizontalAlignment: Text.AlignHCenter
            }
        }

        // Icon + companion label presentation
        Row {
            id: labelRow
            anchors.centerIn: parent
            spacing: 6
            visible: root.label.length > 0

            Item {
                width: 14
                height: 14
                anchors.verticalCenter: parent.verticalCenter

                Item {
                    anchors.fill: parent
                    visible: !root.copied

                    Rectangle {
                        x: 3; y: 0; width: 9; height: 9; radius: 1
                        color: "transparent"
                        border.color: btn.effectiveHovered ? ThemeTokens.text : ThemeTokens.subduedText
                        border.width: 1.2
                    }
                    Rectangle {
                        x: 0; y: 3; width: 9; height: 9; radius: 1
                        color: btn.variant === "outline" ? ThemeTokens.background : (btn.variant === "ghost" ? "transparent" : ThemeTokens.panel)
                        border.color: btn.effectiveHovered ? ThemeTokens.text : ThemeTokens.subduedText
                        border.width: 1.2
                    }
                }

                Text {
                    anchors.centerIn: parent
                    visible: root.copied
                    text: "✓"
                    color: "#10b981"
                    font.pixelSize: 13
                    font.bold: true
                    verticalAlignment: Text.AlignVCenter
                    horizontalAlignment: Text.AlignHCenter
                }
            }

            Text {
                anchors.verticalCenter: parent.verticalCenter
                text: root.copied ? (root.copiedLabel ? root.copiedLabel : "Copied!") : root.label
                color: btn.effectiveHovered ? ThemeTokens.text : ThemeTokens.subduedText
                font.pixelSize: 12
            }
        }
    }
}
