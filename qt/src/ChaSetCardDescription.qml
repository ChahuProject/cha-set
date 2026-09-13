// ChaSetCardDescription.qml — Card Description Text
// Matching React: text-sm text-muted-foreground
import QtQuick 6.10
import ChaSet

Text {
    id: root

    property bool isDark: ThemeTokens.dark

    font.pixelSize: Typography.sizeBody
    font.weight: Font.Normal
    // React twin: text-sm -> 14px on a 20px line box.
    lineHeight: Typography.lineHeightPx(Typography.sizeBody, "body")
    lineHeightMode: Text.FixedHeight
    color: isDark ? Qt.rgba(148/255, 163/255, 184/255, 1.0) : Qt.rgba(100/255, 116/255, 139/255, 1.0)
    wrapMode: Text.Wrap
    width: parent ? parent.width : implicitWidth
}
