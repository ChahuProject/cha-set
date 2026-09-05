// ChaSetTabsList.qml — Container for Tab Triggers
// Matching shadcn: inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground
import QtQuick 6.10
import ChaSet

Rectangle {
    id: root

    property string orientation: "horizontal" // "horizontal" | "vertical"
    property alias spacing: contentLayout.spacing
    default property alias contentData: contentLayout.data

    property int padding: 4
    property int customRadius: 8

    readonly property bool isVert: orientation === "vertical"

    implicitHeight: isVert ? (contentLayout.implicitHeight + padding * 2) : 36
    implicitWidth: isVert ? (contentLayout.implicitWidth + padding * 2) : (contentLayout.implicitWidth + padding * 2)

    radius: customRadius
    color: ThemeTokens.dark ? Qt.rgba(30.0 / 255.0, 41.0 / 255.0, 59.0 / 255.0, 1.0) : Qt.rgba(241.0 / 255.0, 245.0 / 255.0, 249.0 / 255.0, 1.0)

    Grid {
        id: contentLayout
        anchors.fill: parent
        anchors.margins: root.padding
        columns: root.isVert ? 1 : -1
        rows: root.isVert ? -1 : 1
        spacing: 0
        verticalItemAlignment: Grid.AlignVCenter
        horizontalItemAlignment: Grid.AlignHCenter
    }
}
