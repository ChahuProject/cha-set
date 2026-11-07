// ChaSetTabItem.qml — Cross-Stack Document / Workspace Tab Primitive
// 100% Pixel-Perfect & Behavioral Parity with ChaSet Theme & Interaction Standards.
import QtQuick
import QtQuick.Controls
import ChaSet

Button {
    id: root

    // Core Tab Contract
    property string text: ""
    property bool selected: false
    property bool canClose: true
    property bool useShellChrome: false
    property string tabWidthMode: "content" // "content" | "fixed"
    property real tabMinWidth: ThemeTokens.dp(56)
    property real tabMaxWidth: ThemeTokens.dp(240)
    property int controlHeight: ThemeTokens.controlHeight
    property int gap: ThemeTokens.gap

    // Tooltip Contract
    property string tooltipText: text
    property string tooltipDescription: ""
    property bool tooltipDisabled: Boolean(tabDrag && tabDrag.active)
    property int tooltipDelay: 400

    // Object Names for Accessibility & Testing
    property string labelObjectName: ""
    property string closeButtonObjectName: ""

    // Drag & Drop
    property bool dragEnabled: true
    readonly property bool isDragging: Boolean(tabDrag && tabDrag.active)

    // Signals
    signal closeClicked()
    signal middleClicked()
    signal contextMenuRequested(var mouse)
    signal dragStarted(var position)
    signal dragUpdated(var position)
    signal dragEnded()

    focusPolicy: Qt.NoFocus
    hoverEnabled: true
    padding: 0
    property bool suppressClick: false

    // 隐藏测量 Text：content 模式下计算标签宽度的文本宽度
    Text {
        id: tabMeasure
        visible: false
        text: root.text
        font.pixelSize: root.controlHeight / 2
        font.family: Typography.familySans
        font.weight: root.selected ? Typography.weightMedium : Typography.weightRegular
    }

    readonly property real tabWidth: {
        const minW = root.tabMinWidth
        let w
        if (root.tabWidthMode === "fixed") {
            const maxW = root.tabMaxWidth
            w = Math.max(minW, Math.min(root.controlHeight * 3, maxW))
        } else {
            w = root.leftPadding
                + root.gap / 2
                + (tabMeasure ? tabMeasure.contentWidth : 0)
                + root.gap / 2
                + (root.canClose
                   ? root.controlHeight / 2 + root.gap / 2
                   : 0)
                + root.rightPadding
            w = Math.max(minW, w)
        }
        return w
    }

    implicitWidth: tabWidth
    implicitHeight: root.controlHeight
    width: tabWidth
    height: root.controlHeight

    contentItem: Item {
        clip: true

        ChaSetTooltip {
            target: root
            text: root.tooltipText
            description: root.tooltipDescription
            delay: root.tooltipDelay
            disabled: root.tooltipDisabled
        }

        Text {
            id: tabLabel
            objectName: root.labelObjectName
            color: root.selected || root.hovered ? ThemeTokens.text : ThemeTokens.subduedText
            font.pixelSize: root.controlHeight / 2
            font.family: Typography.familySans
            font.weight: root.selected ? Typography.weightMedium : Typography.weightRegular
            horizontalAlignment: root.canClose ? Text.AlignLeft : Text.AlignHCenter
            text: root.text
            verticalAlignment: Text.AlignVCenter
            height: parent.height
            elide: Text.ElideRight
            anchors.left: parent.left
            anchors.leftMargin: root.gap / 2
            anchors.right: parent.right
            anchors.rightMargin: root.gap / 2 + (root.canClose ? root.controlHeight / 2 : 0)
        }

        Button {
            id: closeArea
            objectName: root.closeButtonObjectName
            width: root.controlHeight / 2
            height: root.controlHeight / 2
            visible: root.canClose
            anchors.right: parent.right
            anchors.rightMargin: root.gap / 2
            anchors.verticalCenter: parent.verticalCenter
            focusPolicy: Qt.NoFocus
            hoverEnabled: true
            padding: 0

            contentItem: ChaSetIcon {
                anchors.centerIn: parent
                name: "close"
                size: Math.max(10, Math.round(closeArea.height * 0.75))
                color: closeArea.hovered
                       ? (ThemeTokens.danger !== undefined ? ThemeTokens.danger : ThemeTokens.text)
                       : (root.selected ? ThemeTokens.text : ThemeTokens.subduedText)
            }

            background: ChaSetSquircle {
                anchors.fill: parent
                radius: width / 2
                border.width: closeArea.hovered ? 1 : 0
                border.color: closeArea.hovered ? ThemeTokens.accent : "transparent"
                color: closeArea.hovered ? ThemeTokens.hover : "transparent"
            }

            onClicked: {
                root.suppressClick = true;
                root.closeClicked();
            }
        }
    }

    background: Item {
        implicitHeight: root.controlHeight
        implicitWidth: root.tabWidth

        layer.enabled: true
        layer.smooth: true

        ChaSetSquircle {
            anchors.fill: parent
            border.color: root.selected ? ThemeTokens.accent
                          : (root.hovered ? ThemeTokens.border : "transparent")
            border.width: 1
            color: root.useShellChrome
                   ? (root.selected ? ThemeTokens.panelRaised : "transparent")
                   : (root.selected ? ThemeTokens.panel : "transparent")
            radius: root.gap / 2
        }

        ChaSetSquircle {
            anchors.fill: parent
            visible: root.hovered
            color: ThemeTokens.hover
            radius: root.gap / 2
        }
    }

    onClicked: {
        if (root.suppressClick) return;
    }

    MouseArea {
        id: tabRmb
        anchors.fill: parent
        acceptedButtons: Qt.RightButton
        z: 10
        onClicked: function (mouse) {
            if (mouse.button === Qt.RightButton)
                root.contextMenuRequested(mouse);
        }
    }

    MouseArea {
        id: tabMmb
        anchors.fill: parent
        acceptedButtons: Qt.MiddleButton
        z: 10
        onClicked: function (mouse) {
            if (mouse.button === Qt.MiddleButton)
                root.middleClicked();
        }
    }

    DragHandler {
        id: tabDrag
        acceptedButtons: Qt.LeftButton
        target: null
        enabled: root.dragEnabled && !(closeArea.visible && closeArea.hovered)
        onActiveChanged: {
            if (active) {
                root.suppressClick = true;
                root.dragStarted(centroid.position);
            } else {
                root.dragEnded();
                root.suppressClick = false;
            }
        }
        onCentroidChanged: {
            if (active) {
                root.dragUpdated(centroid.position);
            }
        }
    }
}
