// qt/src/ChaSetAddressBarSuggestPopup.qml
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Popup {
    id: root

    property alias suggestionList: suggestList
    property int highlightedIndex: -1
    signal navigateRequested(string path)

    function setItems(list) {
        suggestModel.clear()
        for (var i = 0; i < list.length; ++i) {
            suggestModel.append(list[i])
        }
        root.highlightedIndex = list.length > 0 ? 0 : -1
    }

    width: ThemeTokens.dp(360)
    height: Math.min(ThemeTokens.dp(300), suggestList.contentHeight + ThemeTokens.dp(16))
    padding: ThemeTokens.dp(4)
    closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

    background: Rectangle {
        color: ThemeTokens.panel
        radius: ThemeTokens.dp(6)
        border.color: ThemeTokens.border
        border.width: 1
    }

    contentItem: ListView {
        id: suggestList
        clip: true
        model: ListModel { id: suggestModel }
        ScrollBar.vertical: ChaSetScrollBar {}
        currentIndex: root.highlightedIndex

        delegate: ItemDelegate {
            id: delegateRoot
            required property var modelData
            required property int index

            width: suggestList.width
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
                        suggestList.currentIndex = delegateRoot.index
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
