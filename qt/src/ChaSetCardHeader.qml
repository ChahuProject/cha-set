// ChaSetCardHeader.qml — Header container for Card
// Matching React: flex flex-col space-y-1.5 p-6
import QtQuick 6.10
import ChaSet

Item {
    id: root

    function findCard() {
        var p = root.parent;
        while (p) {
            if (p.size !== undefined && p.variant !== undefined) return p;
            p = p.parent;
        }
        return null;
    }
    readonly property Item parentCard: findCard()
    readonly property bool isSm: parentCard && parentCard.size === "sm"

    property int padding: isSm ? 16 : 24
    property int spacing: isSm ? 4 : 6

    default property alias contentData: col.data

    implicitWidth: col.implicitWidth + padding * 2
    implicitHeight: col.implicitHeight + padding * 2
    width: parent ? parent.width : implicitWidth

    Column {
        id: col
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: root.padding
        anchors.rightMargin: root.padding
        anchors.topMargin: root.padding
        spacing: root.spacing
    }
}
