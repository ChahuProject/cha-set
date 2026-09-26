// qt/src/ChaSetAddressBarOverflowPopup.qml
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Popup {
    id: root

    property var items: []
    property int highlightedIndex: -1
    signal navigateRequested(string path)

    width: ThemeTokens.dp(280)
    height: Math.min(ThemeTokens.dp(300), overflowList.contentHeight + ThemeTokens.dp(16))
    padding: ThemeTokens.dp(4)
    closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

    background: Rectangle {
        color: ThemeTokens.panel
        radius: ThemeTokens.dp(6)
        border.color: ThemeTokens.border
        border.width: 1
    }

    contentItem: ListView {
        id: overflowList
        clip: true
        model: root.items
        ScrollBar.vertical: ChaSetScrollBar {}

        delegate: ItemDelegate {
            id: delegateRoot
            required property var modelData
            required property int index

            width: overflowList.width
            height: ThemeTokens.dp(34)
            padding: ThemeTokens.dp(4)

            onClicked: {
                root.close()
                root.navigateRequested(modelData.realPath)
            }

            HoverHandler {
                cursorShape: Qt.PointingHandCursor
                onHoveredChanged: {
                    if (hovered) {
                        root.highlightedIndex = delegateRoot.index
                    }
                }
            }

            contentItem: Row {
                spacing: ThemeTokens.dp(8)
                anchors.verticalCenter: parent.verticalCenter

                ChaSetIcon {
                    name: modelData.icon || "folder"
                    size: 16
                    color: ThemeTokens.subduedText
                    anchors.verticalCenter: parent.verticalCenter
                }

                Text {
                    text: modelData.displayName
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeSmall
                    elide: Text.ElideMiddle
                    verticalAlignment: Text.AlignVCenter
                    width: delegateRoot.width - ThemeTokens.dp(40)
                }
            }

            background: Rectangle {
                color: (delegateRoot.index === root.highlightedIndex) ? ThemeTokens.hover : "transparent"
                radius: ThemeTokens.dp(4)
            }
        }
    }
}
