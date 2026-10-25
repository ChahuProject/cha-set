// ChaSetCopyableBadge.qml — CopyableBadge preset (thin parameter colimation)
// Fixed params: pill radius (full), Badge variant secondary; everything else
// forwards to ChaSetHoverCopy. No logic, no new state, no new timing.
// Contract: docs/architecture/hover-copy.md section 7.
import QtQuick
import ChaSet

Item {
    id: root

    property string text: ""
    property string displayText: ""
    property string size: "default"
    property bool disabled: false

    signal copiedToClipboard(string text)
    signal copyFailed(string reason)

    // Explicit geometry (0x0-collapse red line): hug the inner HoverCopy.
    implicitWidth: hoverCopy.implicitWidth
    implicitHeight: hoverCopy.implicitHeight
    width: implicitWidth
    height: implicitHeight

    ChaSetHoverCopy {
        id: hoverCopy
        text: root.text
        radius: "full"
        disabled: root.disabled
        onCopiedToClipboard: function(copiedText) {
            root.copiedToClipboard(copiedText)
        }
        onCopyFailed: function(reason) {
            root.copyFailed(reason)
        }

        ChaSetBadge {
            variant: "secondary"
            size: root.size
            text: root.displayText !== "" ? root.displayText : root.text
        }
    }
}
