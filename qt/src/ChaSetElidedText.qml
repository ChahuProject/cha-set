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

    property color color: ThemeTokens.text
    property font font: Qt.font({ pixelSize: 13 })
    property int horizontalAlignment: Text.AlignLeft
    property int verticalAlignment: Text.AlignVCenter

    readonly property bool isElided: textLabel.truncated || (maxLines === 1 && textLabel.implicitWidth > root.width)
    readonly property string effectiveTooltipText: tooltipText.length > 0 ? tooltipText : text
    readonly property bool tooltipEnabled: effectiveTooltipText.length > 0 && (alwaysShowTooltip || (showTooltipWhenElided && isElided))

    implicitWidth: textLabel.implicitWidth
    implicitHeight: textLabel.implicitHeight

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

    ChaSetTooltip {
        anchors.fill: parent
        text: root.effectiveTooltipText
        side: root.tooltipPlacement === "auto" ? "top" : root.tooltipPlacement
        delay: root.tooltipDelay
        disabled: !root.tooltipEnabled
    }
}
