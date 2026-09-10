// ChaSetElidedText.qml — Cross-stack ElidedText component for Qt Quick Desktop matching React ElidedText 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    // Component API Contract per spec/components/elided-text.ts
    property string text: ""
    property string tooltipText: ""
    property string tooltipPlacement: "top"
    property int tooltipDelay: 400
    property bool alwaysShowTooltip: false
    property bool showTooltipWhenElided: true
    property int maxLines: 1
    property bool copyable: false
    property bool copied: false

    property color color: ThemeTokens.text
    property font font: Qt.font({ pixelSize: 13 })
    property int horizontalAlignment: Text.AlignLeft
    property int verticalAlignment: Text.AlignVCenter

    readonly property bool isElided: textLabel.truncated || (maxLines === 1 && textLabel.implicitWidth > root.width)
    readonly property string effectiveTooltipText: tooltipText.length > 0 ? tooltipText : text
    readonly property bool tooltipEnabled: effectiveTooltipText.length > 0 && (alwaysShowTooltip || (showTooltipWhenElided && isElided))

    implicitWidth: textLabel.implicitWidth
    implicitHeight: textLabel.implicitHeight

    Timer {
        id: resetTimer
        interval: 1500
        repeat: false
        onTriggered: root.copied = false
    }

    TextEdit {
        id: clipboardHelper
        visible: false
        width: 0
        height: 0
    }

    function copyToClipboard() {
        if (!root.copyable) return;
        var content = root.effectiveTooltipText;
        if (content && content.length > 0) {
            clipboardHelper.text = content;
            clipboardHelper.selectAll();
            clipboardHelper.copy();
            clipboardHelper.deselect();
        }
        root.copied = true;
        resetTimer.restart();
    }

    Text {
        id: textLabel
        anchors.fill: parent
        text: root.text
        color: root.color
        font: root.font
        horizontalAlignment: root.horizontalAlignment
        verticalAlignment: root.verticalAlignment
        elide: Text.ElideRight
        wrapMode: root.maxLines > 1 ? Text.Wrap : Text.NoWrap
        maximumLineCount: root.maxLines
    }

    MouseArea {
        anchors.fill: parent
        enabled: root.copyable
        cursorShape: root.copyable ? Qt.PointingHandCursor : Qt.ArrowCursor
        onClicked: root.copyToClipboard()
    }

    ChaSetTooltip {
        anchors.fill: parent
        text: root.copied ? "Copied to clipboard!" : root.effectiveTooltipText
        side: root.tooltipPlacement === "auto" ? "top" : root.tooltipPlacement
        delay: root.copied ? 0 : root.tooltipDelay
        disabled: !root.tooltipEnabled && !root.copied
    }
}

