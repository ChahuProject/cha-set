// ChaSetCardContent.qml — Card Body Container
// Matching React: p-6 pt-0
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

    property int topPadding: 0
    property int bottomPadding: isSm ? 16 : 24
    property int horizontalPadding: isSm ? 16 : 24
    property int spacing: 0

    readonly property int effectiveTopPadding: ThemeTokens.dp(topPadding)
    readonly property int effectiveBottomPadding: ThemeTokens.dp(bottomPadding)
    readonly property int effectiveHorizontalPadding: ThemeTokens.dp(horizontalPadding)
    readonly property int effectiveSpacing: ThemeTokens.dp(spacing)

    default property alias contentData: col.data

    implicitWidth: Math.max(col.implicitWidth, col.childrenRect.width) + effectiveHorizontalPadding * 2
    implicitHeight: Math.max(col.implicitHeight, col.childrenRect.height) + effectiveTopPadding + effectiveBottomPadding
    width: parent ? parent.width : implicitWidth
    height: implicitHeight

    Column {
        id: col
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.leftMargin: root.effectiveHorizontalPadding
        anchors.rightMargin: root.effectiveHorizontalPadding
        anchors.topMargin: root.effectiveTopPadding
        spacing: root.effectiveSpacing
    }
}
