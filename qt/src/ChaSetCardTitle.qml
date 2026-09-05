// ChaSetCardTitle.qml — Card Title Text
// Matching React: font-semibold leading-none tracking-tight text-lg text-card-foreground
import QtQuick 6.10
import ChaSet

Text {
    id: root

    property bool isDark: ThemeTokens.dark

    font.pixelSize: 18
    font.weight: Font.DemiBold
    color: isDark ? Qt.rgba(248/255, 250/255, 252/255, 1.0) : Qt.rgba(2/255, 8/255, 23/255, 1.0)
    wrapMode: Text.Wrap
    width: parent ? parent.width : implicitWidth
}
