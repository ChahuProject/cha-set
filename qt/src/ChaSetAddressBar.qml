// qt/src/ChaSetAddressBar.qml
// ChaSet AddressBar for Qt (QML) — Explorer and browser-style navigation bar
// with interactive breadcrumbs, subfolder enumeration, inline editing, and typed path history.
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

Item {
    id: root

    // API Contract
    property string path: ""
    property bool canGoBack: controller.canGoBack
    property bool canGoForward: controller.canGoForward
    property bool showNavButtons: true
    property bool showRefresh: true
    property bool showSearch: false
    property string searchQuery: ""
    property string searchPlaceholder: qsTr("搜索...")
    property bool disabled: false
    property var suggestions: []
    property bool editing: controller.editing
    property int highlightedIndex: -1

    signal navigateRequested(string path)
    signal navigateRequestedWithSelection(string path, string selectionPath)
    signal backRequested()
    signal forwardRequested()
    signal upRequested()
    signal refreshRequested()
    signal searchRequested(string query)
    signal dropRequested(string targetPath, var urls)

    property string editValue: path

    implicitHeight: ThemeTokens.dp(36)
    implicitWidth: ThemeTokens.dp(500)

    ChaSetAddressBarController {
        id: controller
        currentPath: root.path
        onNavigateRequested: (targetPath) => {
            root.path = targetPath
            root.navigateRequested(targetPath)
        }
        onNavigateRequestedWithSelection: (targetPath, selection) => {
            root.path = targetPath
            root.navigateRequestedWithSelection(targetPath, selection)
        }
        onEditingChanged: {
            if (controller.editing) {
                editInput.text = root.path
                editInput.selectAll()
                editInput.forceActiveFocus()
                showHistoryPopup()
            } else {
                suggestPopup.close()
                subfolderPopup.close()
            }
        }
    }

    onPathChanged: {
        if (!editing) {
            editValue = path
            controller.currentPath = path
        }
    }

    // Outer container surface
    Rectangle {
        id: bgRect
        anchors.fill: parent
        radius: ThemeTokens.dp(6)
        color: editInput.activeFocus ? ThemeTokens.panel : ThemeTokens.panelRaised
        border.width: 1
        border.color: editInput.activeFocus ? ThemeTokens.accent : ThemeTokens.border
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: ThemeTokens.dp(4)
        anchors.rightMargin: ThemeTokens.dp(4)
        spacing: ThemeTokens.dp(2)

        // Navigation Command Buttons
        Row {
            id: navButtonsRow
            visible: root.showNavButtons
            spacing: ThemeTokens.dp(2)
            Layout.alignment: Qt.AlignVCenter

            // Back
            Rectangle {
                width: ThemeTokens.dp(26)
                height: ThemeTokens.dp(26)
                radius: ThemeTokens.dp(4)
                color: backHover.hovered && root.canGoBack && !root.disabled ? ThemeTokens.hover : "transparent"
                opacity: (root.canGoBack && !root.disabled) ? 1.0 : 0.35

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "arrow-left"
                    size: 16
                    color: ThemeTokens.text
                }

                HoverHandler {
                    id: backHover
                    cursorShape: (root.canGoBack && !root.disabled) ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                }

                TapHandler {
                    enabled: root.canGoBack && !root.disabled
                    onTapped: {
                        controller.goBack()
                        root.backRequested()
                    }
                }
            }

            // Forward
            Rectangle {
                width: ThemeTokens.dp(26)
                height: ThemeTokens.dp(26)
                radius: ThemeTokens.dp(4)
                color: forwardHover.hovered && root.canGoForward && !root.disabled ? ThemeTokens.hover : "transparent"
                opacity: (root.canGoForward && !root.disabled) ? 1.0 : 0.35

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "arrow-right"
                    size: 16
                    color: ThemeTokens.text
                }

                HoverHandler {
                    id: forwardHover
                    cursorShape: (root.canGoForward && !root.disabled) ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                }

                TapHandler {
                    enabled: root.canGoForward && !root.disabled
                    onTapped: {
                        controller.goForward()
                        root.forwardRequested()
                    }
                }
            }

            // Up
            Rectangle {
                width: ThemeTokens.dp(26)
                height: ThemeTokens.dp(26)
                radius: ThemeTokens.dp(4)
                readonly property bool canUp: Boolean(root.path && root.path !== "/" && !root.path.match(/^[a-zA-Z]:[/\\]?$/))
                color: upHover.hovered && canUp && !root.disabled ? ThemeTokens.hover : "transparent"
                opacity: (canUp && !root.disabled) ? 1.0 : 0.35

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "arrow-up"
                    size: 16
                    color: ThemeTokens.text
                }

                HoverHandler {
                    id: upHover
                    cursorShape: (parent.canUp && !root.disabled) ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                }

                TapHandler {
                    enabled: parent.canUp && !root.disabled
                    onTapped: {
                        controller.navigateUp()
                        root.upRequested()
                    }
                }
            }

            // Refresh
            Rectangle {
                visible: root.showRefresh
                width: ThemeTokens.dp(26)
                height: ThemeTokens.dp(26)
                radius: ThemeTokens.dp(4)
                color: refreshHover.hovered && !root.disabled ? ThemeTokens.hover : "transparent"
                opacity: !root.disabled ? 1.0 : 0.35

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "rotate-ccw"
                    size: 16
                    color: ThemeTokens.text
                }

                HoverHandler {
                    id: refreshHover
                    cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                }

                TapHandler {
                    enabled: !root.disabled
                    onTapped: root.refreshRequested()
                }
            }

            // Divider
            Rectangle {
                width: 1
                height: ThemeTokens.dp(16)
                color: ThemeTokens.border
                anchors.verticalCenter: parent.verticalCenter
            }
        }

        // Central Address Bar Field (Breadcrumbs + Input)
        Item {
            id: centerField
            Layout.fillWidth: true
            Layout.fillHeight: true

            // 1. Breadcrumbs Mode
            RowLayout {
                id: breadcrumbsContainer
                anchors.fill: parent
                visible: !root.editing
                spacing: 0

                ChaSetBreadcrumb {
                    id: breadcrumbPrimitive
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    segments: controller.segments
                    disabled: root.disabled

                    onNavigateRequested: (targetPath) => {
                        controller.navigate(targetPath)
                    }

                    onOpenSubfoldersRequested: (index, targetPath) => {
                        var list = controller.subfolders(targetPath)
                        subfolderPopup.setItems(list)
                        if (list.length > 0) {
                            subfolderPopup.open()
                        }
                    }

                    onDropRequested: (targetPath, urls) => {
                        root.dropRequested(targetPath, urls)
                    }
                }

                // Blank area to click into edit mode
                MouseArea {
                    id: blankClickArea
                    objectName: "blankClickArea"
                    Layout.preferredWidth: ThemeTokens.dp(30)
                    Layout.fillHeight: true
                    cursorShape: Qt.IBeamCursor
                    onClicked: {
                        if (!root.disabled) {
                            controller.enterEditMode()
                        }
                    }
                }
            }

            // 2. Edit Mode (Inline text field)
            TextInput {
                id: editInput
                visible: root.editing
                anchors.fill: parent
                anchors.leftMargin: ThemeTokens.dp(6)
                anchors.rightMargin: ThemeTokens.dp(6)
                verticalAlignment: TextInput.AlignVCenter
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeSmall
                selectByMouse: true
                selectionColor: ThemeTokens.accent

                HoverHandler {
                    cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.IBeamCursor
                }

                onTextEdited: {
                    refreshSuggestions()
                }

                Keys.onPressed: (event) => {
                    if (event.key === Qt.Key_Escape) {
                        event.accepted = true
                        controller.exitEditMode()
                    } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                        event.accepted = true
                        commitEdit()
                    } else if (event.key === Qt.Key_Down) {
                        if (suggestPopup.opened) {
                            event.accepted = true
                            suggestPopup.highlightedIndex = Math.min(suggestPopup.highlightedIndex + 1, suggestPopup.suggestionList.count - 1)
                        }
                    } else if (event.key === Qt.Key_Up) {
                        if (suggestPopup.opened) {
                            event.accepted = true
                            suggestPopup.highlightedIndex = Math.max(suggestPopup.highlightedIndex - 1, 0)
                        }
                    }
                }
            }
        }

        // Optional Right Search Input
        Rectangle {
            id: searchBox
            visible: root.showSearch
            Layout.preferredWidth: ThemeTokens.dp(160)
            Layout.preferredHeight: ThemeTokens.dp(26)
            radius: ThemeTokens.dp(4)
            color: ThemeTokens.panel
            border.width: 1
            border.color: searchInput.activeFocus ? ThemeTokens.accent : ThemeTokens.border

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: ThemeTokens.dp(6)
                anchors.rightMargin: ThemeTokens.dp(6)
                spacing: ThemeTokens.dp(4)

                ChaSetIcon {
                    name: "search"
                    size: 14
                    color: ThemeTokens.subduedText
                    Layout.alignment: Qt.AlignVCenter
                }

                TextInput {
                    id: searchInput
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    verticalAlignment: TextInput.AlignVCenter
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeSmall
                    text: root.searchQuery
                    onTextEdited: {
                        root.searchQuery = text
                        root.searchRequested(text)
                    }

                    HoverHandler {
                        cursorShape: Qt.IBeamCursor
                    }

                    Text {
                        anchors.fill: parent
                        verticalAlignment: Text.AlignVCenter
                        text: root.searchPlaceholder
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                        visible: !searchInput.text && !searchInput.activeFocus
                    }
                }
            }
        }
    }

    // Auto-complete / Typed History Suggestions Popup
    ChaSetAddressBarSuggestPopup {
        id: suggestPopup
        x: centerField.x
        y: root.height + ThemeTokens.dp(4)
        onNavigateRequested: (targetPath) => {
            controller.navigate(targetPath)
        }
    }

    // Subfolders dropdown popup
    ChaSetAddressBarSuggestPopup {
        id: subfolderPopup
        x: centerField.x
        y: root.height + ThemeTokens.dp(4)
        onNavigateRequested: (targetPath) => {
            breadcrumbPrimitive.openSegmentIndex = -1
            controller.navigate(targetPath)
        }
        onClosed: {
            breadcrumbPrimitive.openSegmentIndex = -1
        }
    }

    function showHistoryPopup() {
        var hist = controller.history
        var entries = []
        for (var i = 0; i < hist.length; i++) {
            entries.push({ displayName: hist[i], realPath: hist[i], icon: "clock" })
        }
        suggestPopup.setItems(entries)
        if (entries.length > 0) {
            suggestPopup.open()
        }
    }

    function refreshSuggestions() {
        var items = controller.suggestions(editInput.text)
        suggestPopup.setItems(items)
        if (items.length > 0) {
            suggestPopup.open()
        } else {
            suggestPopup.close()
        }
    }

    function commitEdit() {
        var text = editInput.text.trim()
        if (controller.navigate(text)) {
            return
        }
        if (suggestPopup.opened && suggestPopup.highlightedIndex >= 0) {
            var item = suggestPopup.suggestionList.model.get(suggestPopup.highlightedIndex)
            if (item && item.realPath && controller.navigate(item.realPath)) {
                return
            }
        }
        // Fallback: search or cancel
        root.searchRequested(text)
        controller.exitEditMode()
    }

    // Global focus shortcut (Alt+D or Ctrl+L or F4)
    Shortcut {
        sequence: "Alt+D"
        onActivated: {
            if (!root.disabled) controller.enterEditMode()
        }
    }

    Shortcut {
        sequence: "Ctrl+L"
        onActivated: {
            if (!root.disabled) controller.enterEditMode()
        }
    }

    Shortcut {
        sequence: "F4"
        onActivated: {
            if (!root.disabled) controller.enterEditMode()
        }
    }
}
