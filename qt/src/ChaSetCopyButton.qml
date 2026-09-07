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

    signal copiedToClipboard(string text)

    implicitWidth: btn.width
    implicitHeight: btn.height

    Timer {
        id: resetTimer
        interval: root.timeout
        onTriggered: root.copied = false
    }

    ChaSetButton {
        id: btn
        variant: root.variant
        size: root.size
        text: root.copied ? "✓" : "📋"
        onClicked: {
            root.copied = true
            resetTimer.restart()
            // In Qt Quick desktop or harness, emit signal
            root.copiedToClipboard(root.textToCopy)
        }
    }
}
