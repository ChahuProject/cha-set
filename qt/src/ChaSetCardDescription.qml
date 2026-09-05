// ChaSetCardDescription.qml — Card Description Text
// Matching React: text-sm text-muted-foreground
import QtQuick 6.10
import ChaSet

Text {
    id: root

    property bool isDark: ThemeTokens.dark

    font.pixelSize: 14
    font.weight: Font.Normal
    color: isDark ? Qt.rgba(148/255, 163/255, 184/255, 1.0) : Qt.rgba(100/255, 116/255, 139/255, 1.0)
    wrapMode: Text.Wrap
    width: parent ? parent.width : implicitWidth
}
