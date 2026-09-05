// ChaSetCardFooter.qml — Card Footer Container
// Matching React: flex items-center p-6 pt-0 gap-2
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property int topPadding: 0
    property int bottomPadding: 24
    property int horizontalPadding: 24
    property int spacing: 8

    default property alias contentData: row.data

    implicitWidth: row.implicitWidth + horizontalPadding * 2
    implicitHeight: row.implicitHeight + topPadding + bottomPadding
    width: parent ? parent.width : implicitWidth

    Row {
        id: row
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: root.horizontalPadding
        anchors.rightMargin: root.horizontalPadding
        anchors.topMargin: root.topPadding
        anchors.bottomMargin: root.bottomPadding
        spacing: root.spacing
    }
}
