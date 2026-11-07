// ChaSetDocumentTabs.qml — Cross-Stack Desktop Document Tab Bar Container
// 100% Pixel-Perfect & Behavioral Parity with ChaSet Theme & Interaction Standards.
import QtQuick
import QtQuick.Controls
import ChaSet

Rectangle {
    id: root

    // =========================================================================
    // 视觉与度量契约 (Design Tokens & Dimensions)
    // =========================================================================
    property real controlHeight: ThemeTokens.controlHeight
    property real gap: ThemeTokens.gap
    property bool useShellChrome: false
    property color shellTabFill: "transparent"

    // 默认背景色与圆角
    color: useShellChrome ? shellTabFill : ThemeTokens.panelRaised
    radius: useShellChrome ? gap / 2 : 0

    // =========================================================================
    // 数据模型与委托 (Model & Delegate)
    // =========================================================================
    property var model: []
    property Component delegate: null
    property alias repeater: tabRepeater
    property alias row: tabRow
    property alias flickable: tabFlickable

    // =========================================================================
    // 尾部操作插槽 (Trailing Items)
    // =========================================================================
    property list<Item> trailingItems: []

    // 默认插槽：允许直接在 ChaSetDocumentTabs 内部追加子元素（如 AddTabButton）
    default property alias contentData: tabRow.data

    // =========================================================================
    // 内部水平条带与溢出滚动
    // =========================================================================
    implicitHeight: root.controlHeight
    implicitWidth: childrenRect.width

    Flickable {
        id: tabFlickable
        objectName: "documentTabsFlickable"
        anchors.left: parent.left
        anchors.leftMargin: root.gap
        anchors.right: trailingContainer.left
        anchors.rightMargin: root.trailingItems.length > 0 ? (root.gap / 2) : 0
        anchors.verticalCenter: parent.verticalCenter
        height: root.controlHeight
        clip: true
        boundsBehavior: Flickable.StopAtBounds
        flickableDirection: Flickable.HorizontalFlick

        contentWidth: tabRow.width
        contentHeight: tabRow.height

        // 桌面滚轮横向滚动支持
        WheelHandler {
            target: tabFlickable
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                const dy = event.angleDelta.y !== 0 ? event.angleDelta.y : event.angleDelta.x;
                if (dy !== 0) {
                    const step = ThemeTokens.dp(40);
                    tabFlickable.contentX = Math.max(0, Math.min(Math.max(0, tabFlickable.contentWidth - tabFlickable.width), tabFlickable.contentX - (dy > 0 ? step : -step)));
                }
            }
        }

        Row {
            id: tabRow
            objectName: "documentTabsRow"
            height: root.controlHeight
            spacing: root.gap / 2

            Repeater {
                id: tabRepeater
                objectName: "tabRepeater"
                model: root.model
                delegate: root.delegate
            }
        }
    }

    // 尾部右固定插槽容器
    Row {
        id: trailingContainer
        anchors.right: parent.right
        anchors.rightMargin: root.gap / 2
        anchors.verticalCenter: parent.verticalCenter
        spacing: root.gap / 2
        children: root.trailingItems
    }
}
