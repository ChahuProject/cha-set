// ChaSetCardContent.qml — Card Body Container
// Matching React: p-6 pt-0
import QtQuick 6.10
import ChaSet

Item {
    id: root

    property int topPadding: 0
    property int bottomPadding: 24
    property int horizontalPadding: 24

    default property alias contentData: col.data

    implicitWidth: col.implicitWidth + horizontalPadding * 2
    implicitHeight: col.implicitHeight + topPadding + bottomPadding
    width: parent ? parent.width : implicitWidth

    Column {
        id: col
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: root.horizontalPadding
        anchors.rightMargin: root.horizontalPadding
        anchors.topMargin: root.topPadding
        anchors.bottomMargin: root.bottomPadding
        spacing: 0
    }
}
