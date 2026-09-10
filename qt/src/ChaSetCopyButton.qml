// ChaSetCopyButton.qml — Cross-Stack Copy Button Component
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property string textToCopy: ""
    property int timeout: 2000
    property string variant: "outline"
    property string size: "icon-xs"
    property bool copied: false
    readonly property bool hovered: btn.effectiveHovered

    signal copiedToClipboard(string text)

    implicitWidth: btn.implicitWidth
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
        if (root.textToCopy && root.textToCopy.length > 0) {
            clipboardHelper.text = root.textToCopy
            clipboardHelper.selectAll()
            clipboardHelper.copy()
            clipboardHelper.deselect()
        }
        root.copied = true
        resetTimer.restart()
        root.copiedToClipboard(root.textToCopy)
    }

    ChaSetButton {
        id: btn
        anchors.fill: parent
        variant: root.variant
        size: root.size
        onClicked: root.copy()

        Item {
            anchors.centerIn: parent
            width: 14
            height: 14

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
    }
}
