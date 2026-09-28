// qt/src/ChaSetAddressBarSuggestPopup.qml
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

Popup {
    id: root
    focus: true

    property alias suggestionList: suggestList
    property int highlightedIndex: -1
    property var rawItems: []
    property string searchQuery: ""
    property bool isSearchOpen: false
    property int customWidth: ThemeTokens.dp(260)
    property int customHeight: ThemeTokens.dp(260)

    readonly property int naturalContentHeight: {
        var h = (root.isSearchOpen ? ThemeTokens.dp(34) : 0);
        var count = suggestModel.count;
        h += (count > 0 ? (count * ThemeTokens.dp(32)) : ThemeTokens.dp(44));
        h += ThemeTokens.dp(24) + ThemeTokens.dp(4); // footerBar + spacing
        h += ThemeTokens.dp(12); // padding
        return h;
    }

    signal navigateRequested(string path)

    function setItems(list) {
        rawItems = list || []
        searchQuery = ""
        isSearchOpen = false
        applyFilter()
    }

    function applyFilter() {
        suggestModel.clear()
        var q = searchQuery.trim().toLowerCase()
        for (var i = 0; i < rawItems.length; ++i) {
            var it = rawItems[i]
            var name = String(it.displayName || it.label || it.path || "").toLowerCase()
            if (!q || name.indexOf(q) >= 0) {
                suggestModel.append(it)
            }
        }
        root.highlightedIndex = suggestModel.count > 0 ? 0 : -1
    }

    width: customWidth
    height: Math.min(customHeight, naturalContentHeight)
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
    }

    contentItem: Item {
        id: popupContent
        focus: true

        Keys.onPressed: (event) => {
            if (event.key === Qt.Key_Escape) {
                event.accepted = true
                root.close()
            } else if (event.key === Qt.Key_Down) {
                event.accepted = true
                if (suggestModel.count > 0) {
                    root.highlightedIndex = (root.highlightedIndex + 1) % suggestModel.count
                    suggestList.positionViewAtIndex(root.highlightedIndex, ListView.Contain)
                }
            } else if (event.key === Qt.Key_Up) {
                event.accepted = true
                if (suggestModel.count > 0) {
                    root.highlightedIndex = (root.highlightedIndex - 1 + suggestModel.count) % suggestModel.count
                    suggestList.positionViewAtIndex(root.highlightedIndex, ListView.Contain)
                }
            } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                event.accepted = true
                if (root.highlightedIndex >= 0 && root.highlightedIndex < suggestModel.count) {
                    var item = suggestModel.get(root.highlightedIndex)
                    root.close()
                    root.navigateRequested(item.realPath || item.path)
                }
            } else if (!isSearchOpen && event.text && event.text.length > 0 && event.text.charCodeAt(0) >= 32) {
                event.accepted = true
                isSearchOpen = true
                searchInput.forceActiveFocus()
                searchInput.text = event.text
                searchQuery = event.text
                applyFilter()
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
                    root.applyFilter()
                }
                onCleared: {
                    root.searchQuery = ""
                    root.applyFilter()
                }
                Keys.onPressed: (event) => {
                    if (event.key === Qt.Key_Escape) {
                        event.accepted = true
                        if (root.searchQuery.length > 0) {
                            root.searchQuery = ""
                            root.applyFilter()
                        } else {
                            root.close()
                        }
                    } else if (event.key === Qt.Key_Down) {
                        if (suggestModel.count > 0) {
                            event.accepted = true
                            root.highlightedIndex = (root.highlightedIndex + 1) % suggestModel.count
                            suggestList.positionViewAtIndex(root.highlightedIndex, ListView.Contain)
                        }
                    } else if (event.key === Qt.Key_Up) {
                        if (suggestModel.count > 0) {
                            event.accepted = true
                            root.highlightedIndex = (root.highlightedIndex - 1 + suggestModel.count) % suggestModel.count
                            suggestList.positionViewAtIndex(root.highlightedIndex, ListView.Contain)
                        }
                    } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                        if (root.highlightedIndex >= 0 && root.highlightedIndex < suggestModel.count) {
                            event.accepted = true
                            var item = suggestModel.get(root.highlightedIndex)
                            root.close()
                            root.navigateRequested(item.realPath || item.path)
                        }
                    }
                }
            }

            // Results List
            ListView {
                id: suggestList
                Layout.fillWidth: true
                Layout.fillHeight: true
                clip: true
                visible: suggestModel.count > 0
                model: ListModel { id: suggestModel }
                ScrollBar.vertical: ChaSetScrollBar {}
                currentIndex: root.highlightedIndex

                delegate: ItemDelegate {
                    id: delegateRoot
                    required property var modelData
                    required property int index

                    width: suggestList.width
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

            // Empty state
            Item {
                visible: suggestModel.count === 0
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.preferredHeight: ThemeTokens.dp(44)

                Text {
                    anchors.centerIn: parent
                    text: root.searchQuery ? qsTr("未找到匹配文件夹") : qsTr("（空文件夹）")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                }
            }

            // Bottom Keyboard Shortcut & Action Footer Bar
            Rectangle {
                id: footerBar
                Layout.fillWidth: true
                Layout.preferredHeight: ThemeTokens.dp(24)
                color: ThemeTokens.panelRaised
                border.width: 1
                border.color: ThemeTokens.border
                radius: ThemeTokens.dp(4)

                Row {
                    anchors.left: parent.left
                    anchors.leftMargin: ThemeTokens.dp(8)
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: ThemeTokens.dp(10)

                    Row {
                        spacing: ThemeTokens.dp(3)
                        anchors.verticalCenter: parent.verticalCenter
                        ChaSetBadge { size: "sm"; variant: "outline"; text: "Up"; height: ThemeTokens.dp(16) }
                        ChaSetBadge { size: "sm"; variant: "outline"; text: "Down"; height: ThemeTokens.dp(16) }
                        Text {
                            text: qsTr("导航")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Row {
                        spacing: ThemeTokens.dp(3)
                        anchors.verticalCenter: parent.verticalCenter
                        ChaSetBadge { size: "sm"; variant: "outline"; text: "Enter"; height: ThemeTokens.dp(16) }
                        Text {
                            text: qsTr("打开")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    Row {
                        spacing: ThemeTokens.dp(3)
                        anchors.verticalCenter: parent.verticalCenter
                        ChaSetBadge { size: "sm"; variant: "outline"; text: "Esc"; height: ThemeTokens.dp(16) }
                        Text {
                            text: qsTr("关闭")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeCaption
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                }
            }
        }

        // Right edge resize handle
        MouseArea {
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            anchors.bottomMargin: ThemeTokens.dp(6)
            width: ThemeTokens.dp(5)
            cursorShape: Qt.SizeHorCursor
            z: 99
            property real startX: 0
            property real startW: 0
            onPressed: (mouse) => {
                startX = mouse.x
                startW = root.width
            }
            onPositionChanged: (mouse) => {
                if (pressed) {
                    root.customWidth = Math.max(ThemeTokens.dp(180), startW + (mouse.x - startX))
                }
            }
        }

        // Bottom edge resize handle
        MouseArea {
            anchors.bottom: parent.bottom
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(6)
            height: ThemeTokens.dp(5)
            cursorShape: Qt.SizeVerCursor
            z: 99
            property real startY: 0
            property real startH: 0
            onPressed: (mouse) => {
                startY = mouse.y
                startH = root.height
            }
            onPositionChanged: (mouse) => {
                if (pressed) {
                    root.customHeight = Math.max(ThemeTokens.dp(100), startH + (mouse.y - startY))
                }
            }
        }

        // Bottom-Right corner resize handle
        MouseArea {
            anchors.bottom: parent.bottom
            anchors.right: parent.right
            width: ThemeTokens.dp(8)
            height: ThemeTokens.dp(8)
            cursorShape: Qt.SizeFDiagCursor
            z: 100
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
                    root.customHeight = Math.max(ThemeTokens.dp(100), startH + (mouse.y - startY))
                }
            }
        }
    }
}
