// qt/src/ChaSetAddressBarSuggestPopup.qml
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

Popup {
    id: root
    focus: root.takeFocus

    property bool takeFocus: true
    property alias suggestionList: suggestList
    property int highlightedIndex: -1
    property var rawItems: []
    property string searchQuery: ""
    property bool isSearchOpen: false
    property int customWidth: ThemeTokens.dp(260)
    property int customHeight: ThemeTokens.dp(260)
    property bool userResized: false

    // 特殊状态与剪贴板状态注入 (SPEC-FB-042)
    property var pathClipboardStateCallback: null
    property int clipboardRevision: 0

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
        if (root.takeFocus) {
            popupContent.forceActiveFocus()
        }
    }

    contentItem: Item {
        id: popupContent
        focus: root.takeFocus

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
                    placeholderText: ChaSetI18n.tr("desktopComposite.addressBar.searchPlaceholder", "Search...")
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

                    readonly property string itemPath: modelData.realPath || modelData.path || ""
                    readonly property bool isItemHidden: Boolean(modelData.isHidden)
                    readonly property bool isItemSystem: Boolean(modelData.isSystem)
                    readonly property int itemClipboardState: {
                        const rev = root.clipboardRevision
                        if (typeof root.pathClipboardStateCallback === "function" && delegateRoot.itemPath) {
                            return root.pathClipboardStateCallback(delegateRoot.itemPath)
                        }
                        return 0
                    }
                    readonly property real itemOpacity: {
                        let base = 1.0
                        if (isItemSystem) {
                            base = 0.50
                        } else if (isItemHidden) {
                            base = 0.65
                        }
                        if (itemClipboardState === 1) { // Cut
                            base = base * 0.55
                        }
                        return base
                    }
                    opacity: delegateRoot.itemOpacity

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
                            color: delegateRoot.itemClipboardState === 2 ? ThemeTokens.accent : ThemeTokens.subduedText
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        Text {
                            text: modelData.displayName || modelData.label || ""
                            color: delegateRoot.itemClipboardState === 2 ? ThemeTokens.accent : ThemeTokens.text
                            font.pixelSize: Typography.sizeSmall
                            elide: Text.ElideMiddle
                            verticalAlignment: Text.AlignVCenter
                            width: delegateRoot.width - ThemeTokens.dp(56)
                        }

                        ChaSetIcon {
                            visible: delegateRoot.isItemSystem
                            name: "lock"
                            size: 12
                            color: (typeof Theme !== "undefined" && Theme && Theme.warning)
                                   ? Theme.warning
                                   : "#E5A93C"
                            anchors.verticalCenter: parent.verticalCenter
                        }

                        ChaSetIcon {
                            visible: delegateRoot.itemClipboardState === 2
                            name: "copy"
                            size: 12
                            color: ThemeTokens.accent
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }

                    background: Rectangle {
                        color: {
                            if (delegateRoot.index === root.highlightedIndex) return ThemeTokens.hover
                            if (delegateRoot.itemClipboardState === 2) {
                                return Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.08)
                            }
                            if (delegateRoot.isItemSystem) {
                                return (typeof Theme !== "undefined" && Theme && Theme.warning)
                                       ? Qt.rgba(Theme.warning.r, Theme.warning.g, Theme.warning.b, 0.08)
                                       : Qt.rgba(0.9, 0.6, 0.1, 0.08)
                            }
                            if (delegateRoot.itemClipboardState === 1) {
                                return (typeof Theme !== "undefined" && Theme)
                                       ? Qt.rgba(Theme.panel.r, Theme.panel.g, Theme.panel.b, 0.16)
                                       : Qt.rgba(0, 0, 0, 0.16)
                            }
                            return "transparent"
                        }
                        radius: ThemeTokens.dp(4)
                        border.width: (delegateRoot.itemClipboardState === 2 || delegateRoot.isItemSystem || delegateRoot.itemClipboardState === 1) ? 1 : 0
                        border.color: {
                            if (delegateRoot.itemClipboardState === 2) {
                                return Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.75)
                            }
                            if (delegateRoot.isItemSystem) {
                                return (typeof Theme !== "undefined" && Theme && Theme.warning)
                                       ? Qt.rgba(Theme.warning.r, Theme.warning.g, Theme.warning.b, 0.35)
                                       : Qt.rgba(0.9, 0.6, 0.1, 0.35)
                            }
                            if (delegateRoot.itemClipboardState === 1) {
                                return (typeof Theme !== "undefined" && Theme)
                                       ? Qt.rgba(Theme.subduedText.r, Theme.subduedText.g, Theme.subduedText.b, 0.35)
                                       : Qt.rgba(0.6, 0.6, 0.6, 0.35)
                            }
                            return "transparent"
                        }
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
                    text: root.searchQuery ? ChaSetI18n.tr("desktopComposite.breadcrumb.noMatch", "No matching folders") : ChaSetI18n.tr("desktopComposite.breadcrumb.emptyFolder", "(Empty folder)")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                }
            }

            // Bottom Keyboard Shortcut & Action Footer Bar (Flush to bottom, no margins, no enclosing card)
            ChaSetShortcutBar {
                id: footerBar
                Layout.fillWidth: true
                Layout.preferredHeight: ThemeTokens.dp(26)
                Layout.leftMargin: 1
                Layout.rightMargin: 1
                Layout.bottomMargin: 1
                preset: "address-bar"
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
