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
    property bool userResized: false

    readonly property int naturalContentHeight: {
        var h = (root.isSearchOpen ? ThemeTokens.dp(36) : 0);
        var count = suggestModel.count;
        h += (count > 0 ? (count * ThemeTokens.dp(32)) : ThemeTokens.dp(44));
        h += ThemeTokens.dp(26); // footerBar
        h += ThemeTokens.dp(12); // content spacing
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
    height: userResized ? customHeight : Math.min(customHeight, naturalContentHeight)
    padding: 0
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
            spacing: 0

            // Search box on typing
            Item {
                visible: root.isSearchOpen
                Layout.fillWidth: true
                Layout.preferredHeight: searchInput.implicitHeight + ThemeTokens.dp(6)
                Layout.leftMargin: ThemeTokens.dp(6)
                Layout.rightMargin: ThemeTokens.dp(6)
                Layout.topMargin: ThemeTokens.dp(6)

                ChaSetInput {
                    id: searchInput
                    anchors.fill: parent
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
            }

            // Results List
            ListView {
                id: suggestList
                Layout.fillWidth: true
                Layout.fillHeight: true
                Layout.leftMargin: ThemeTokens.dp(6)
                Layout.rightMargin: ThemeTokens.dp(6)
                Layout.topMargin: root.isSearchOpen ? ThemeTokens.dp(4) : ThemeTokens.dp(6)
                Layout.bottomMargin: ThemeTokens.dp(4)
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
                Layout.leftMargin: ThemeTokens.dp(6)
                Layout.rightMargin: ThemeTokens.dp(6)

                Text {
                    anchors.centerIn: parent
                    text: root.searchQuery ? qsTr("未找到匹配文件夹") : qsTr("（空文件夹）")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                }
            }

            // Bottom Keyboard Shortcut & Action Footer Bar (Flush to bottom, no margins, no enclosing card)
            Rectangle {
                id: footerBar
                Layout.fillWidth: true
                Layout.preferredHeight: ThemeTokens.dp(26)
                color: ThemeTokens.panelRaised

                Rectangle {
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.right: parent.right
                    height: 1
                    color: ThemeTokens.border
                }

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

        // Right edge resize handle (Sitting on the true outer right edge)
        MouseArea {
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.bottom: parent.bottom
            width: ThemeTokens.dp(6)
            cursorShape: Qt.SizeHorCursor
            z: 99
            property real startGlobalX: 0
            property real startW: 0
            onPressed: (mouse) => {
                var pt = mapToGlobal(mouse.x, mouse.y)
                startGlobalX = pt.x
                startW = root.width
                root.userResized = true
            }
            onPositionChanged: (mouse) => {
                if (pressed) {
                    var pt = mapToGlobal(mouse.x, mouse.y)
                    root.customWidth = Math.max(ThemeTokens.dp(180), startW + (pt.x - startGlobalX))
                }
            }
        }

        // Bottom edge resize handle (Sitting on the true outer bottom edge)
        MouseArea {
            anchors.bottom: parent.bottom
            anchors.left: parent.left
            anchors.right: parent.right
            height: ThemeTokens.dp(6)
            cursorShape: Qt.SizeVerCursor
            z: 99
            property real startGlobalY: 0
            property real startH: 0
            onPressed: (mouse) => {
                var pt = mapToGlobal(mouse.x, mouse.y)
                startGlobalY = pt.y
                startH = root.height
                root.userResized = true
            }
            onPositionChanged: (mouse) => {
                if (pressed) {
                    var pt = mapToGlobal(mouse.x, mouse.y)
                    root.customHeight = Math.max(ThemeTokens.dp(100), startH + (pt.y - startGlobalY))
                }
            }
        }

        // Bottom-Right corner resize handle
        MouseArea {
            anchors.bottom: parent.bottom
            anchors.right: parent.right
            width: ThemeTokens.dp(10)
            height: ThemeTokens.dp(10)
            cursorShape: Qt.SizeFDiagCursor
            z: 100
            property real startGlobalX: 0
            property real startGlobalY: 0
            property real startW: 0
            property real startH: 0
            onPressed: (mouse) => {
                var pt = mapToGlobal(mouse.x, mouse.y)
                startGlobalX = pt.x
                startGlobalY = pt.y
                startW = root.width
                startH = root.height
                root.userResized = true
            }
            onPositionChanged: (mouse) => {
                if (pressed) {
                    var pt = mapToGlobal(mouse.x, mouse.y)
                    root.customWidth = Math.max(ThemeTokens.dp(180), startW + (pt.x - startGlobalX))
                    root.customHeight = Math.max(ThemeTokens.dp(100), startH + (pt.y - startGlobalY))
                }
            }
        }
    }
}
