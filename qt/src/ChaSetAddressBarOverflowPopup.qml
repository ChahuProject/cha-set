// qt/src/ChaSetAddressBarOverflowPopup.qml
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

Popup {
    id: root

    property var items: []
    property int highlightedIndex: -1
    property string searchQuery: ""
    property bool isSearchOpen: false
    property int customWidth: ThemeTokens.dp(260)
    property int customHeight: ThemeTokens.dp(260)

    signal navigateRequested(string path)

    readonly property var filteredItems: {
        var list = root.items || []
        var q = root.searchQuery.trim().toLowerCase()
        if (!q) return list
        return list.filter(function(it) {
            var name = String(it.displayName || it.label || it.path || "").toLowerCase()
            return name.indexOf(q) >= 0
        })
    }

    onItemsChanged: {
        root.searchQuery = ""
        root.isSearchOpen = false
        root.highlightedIndex = filteredItems.length > 0 ? 0 : -1
    }

    width: customWidth
    height: customHeight
    padding: ThemeTokens.dp(6)
    closePolicy: Popup.CloseOnEscape | Popup.CloseOnPressOutside

    background: Rectangle {
        color: ThemeTokens.panel
        radius: ThemeTokens.dp(6)
        border.color: ThemeTokens.border
        border.width: 1
    }

    onOpened: {
        popupContent.forceActiveFocus()
        root.highlightedIndex = filteredItems.length > 0 ? 0 : -1
    }

    contentItem: Item {
        id: popupContent

        Keys.onPressed: (event) => {
            if (event.key === Qt.Key_Escape) {
                event.accepted = true
                root.close()
            } else if (event.key === Qt.Key_Down) {
                event.accepted = true
                if (filteredItems.length > 0) {
                    root.highlightedIndex = (root.highlightedIndex + 1) % filteredItems.length
                    overflowList.positionViewAtIndex(root.highlightedIndex, ListView.Contain)
                }
            } else if (event.key === Qt.Key_Up) {
                event.accepted = true
                if (filteredItems.length > 0) {
                    root.highlightedIndex = (root.highlightedIndex - 1 + filteredItems.length) % filteredItems.length
                    overflowList.positionViewAtIndex(root.highlightedIndex, ListView.Contain)
                }
            } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                event.accepted = true
                if (root.highlightedIndex >= 0 && root.highlightedIndex < filteredItems.length) {
                    var item = filteredItems[root.highlightedIndex]
                    root.close()
                    root.navigateRequested(item.realPath || item.path)
                }
            } else if (!isSearchOpen && event.text && event.text.length > 0 && event.text.charCodeAt(0) >= 32) {
                event.accepted = true
                isSearchOpen = true
                searchInput.forceActiveFocus()
                searchInput.text = event.text
                searchQuery = event.text
                root.highlightedIndex = filteredItems.length > 0 ? 0 : -1
            }
        }
        ColumnLayout {
            anchors.fill: parent
            spacing: ThemeTokens.dp(4)

            // Search box on typing
            ChaSetInput {
                id: searchInput
                visible: root.isSearchOpen
                Layout.fillWidth: true
                size: "sm"
                placeholderText: qsTr("搜索...")
                clearable: true
                text: root.searchQuery
                onTextEdited: {
                    root.searchQuery = text
                    root.highlightedIndex = root.filteredItems.length > 0 ? 0 : -1
                }
                onCleared: {
                    root.searchQuery = ""
                    root.highlightedIndex = root.filteredItems.length > 0 ? 0 : -1
                }
                Keys.onEscapePressed: {
                    if (text.length > 0) {
                        text = ""
                        root.searchQuery = ""
                        root.highlightedIndex = root.filteredItems.length > 0 ? 0 : -1
                    } else {
                        root.isSearchOpen = false
                        root.forceActiveFocus()
                    }
                }
                Keys.onDownPressed: {
                    if (root.filteredItems.length > 0) {
                        root.highlightedIndex = (root.highlightedIndex + 1) % root.filteredItems.length
                        overflowList.positionViewAtIndex(root.highlightedIndex, ListView.Contain)
                    }
                }
                Keys.onUpPressed: {
                    if (root.filteredItems.length > 0) {
                        root.highlightedIndex = (root.highlightedIndex - 1 + root.filteredItems.length) % root.filteredItems.length
                        overflowList.positionViewAtIndex(root.highlightedIndex, ListView.Contain)
                    }
                }
                Keys.onReturnPressed: {
                    if (root.highlightedIndex >= 0 && root.highlightedIndex < root.filteredItems.length) {
                        var item = root.filteredItems[root.highlightedIndex]
                        root.close()
                        root.navigateRequested(item.realPath || item.path)
                    }
                }
            }

            // Results List
            ListView {
                id: overflowList
                Layout.fillWidth: true
                Layout.fillHeight: true
                clip: true
                model: root.filteredItems
                ScrollBar.vertical: ChaSetScrollBar {}
                currentIndex: root.highlightedIndex

                delegate: ItemDelegate {
                    id: delegateRoot
                    required property var modelData
                    required property int index

                    width: overflowList.width
                    height: ThemeTokens.dp(32)
                    padding: ThemeTokens.dp(4)

                    onClicked: {
                        root.close()
                        root.navigateRequested(modelData.realPath || modelData.path)
                    }

                    HoverHandler {
                        cursorShape: Qt.PointingHandCursor
                        onHoveredChanged: {
                            if (hovered) {
                                root.highlightedIndex = delegateRoot.index
                                overflowList.currentIndex = delegateRoot.index
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
                            text: modelData.displayName || modelData.label || ""
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

        // Drag resize corner handle
        Item {
            id: resizeHandle
            width: ThemeTokens.dp(16)
            height: ThemeTokens.dp(16)
            anchors.right: parent.right
            anchors.bottom: parent.bottom
            z: 50

            ChaSetIcon {
                name: "grip-horizontal"
                size: 12
                anchors.centerIn: parent
                color: ThemeTokens.subduedText
            }

            MouseArea {
                anchors.fill: parent
                cursorShape: Qt.SizeFDiagCursor
                property real startX: 0
                property real startY: 0
                property real startW: 0
                property real startH: 0
                onPressed: (mouse) => {
                    startX = mouse.x
                    startY = mouse.y
                    startW = root.width
                    startH = root.height
                }
                onPositionChanged: (mouse) => {
                    if (pressed) {
                        root.customWidth = Math.max(ThemeTokens.dp(180), startW + (mouse.x - startX))
                        root.customHeight = Math.max(ThemeTokens.dp(140), startH + (mouse.y - startY))
                    }
                }
            }
        }
    }
}
