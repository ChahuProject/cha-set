// ChaSetCardHeader.qml — Header container for Card
// Matching React: flex flex-col space-y-1.5 p-6 (24px padding, 6px spacing)
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property int padding: 24
    property int spacing: 6

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
