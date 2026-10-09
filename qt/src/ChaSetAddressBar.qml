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
    property alias path: controller.currentPath
    property alias currentPath: controller.currentPath
    property alias controller: controller
    property bool canGoBack: controller.canGoBack
    property bool canGoForward: controller.canGoForward
    property bool showNavButtons: true
    property alias showNavigationButtons: root.showNavButtons
    property bool showRefresh: true
    property bool showSearch: true
    property string searchQuery: ""
    property string searchPlaceholder: ChaSetI18n.tr("desktopComposite.addressBar.searchPlaceholder", "搜索...")
    property alias searchText: searchInput.text
    property bool searchCollapsible: true
    readonly property bool isSearchExpanded: !searchCollapsible || searchInput.activeFocus || (root.searchQuery.length > 0)
    property bool disabled: false
    property var suggestions: []
    property bool editing: controller.editing
    readonly property bool isEditing: controller.editing
    readonly property bool anyPopupOpen: suggestPopup.opened || subfolderPopup.opened || (breadcrumbPrimitive ? breadcrumbPrimitive.isAnyPopupOpen : false)
    property int highlightedIndex: -1

    // 面包屑分段拖放：宿主可读取当前悬停级别以提示目标，或按需禁用（默认启用）。
    property bool acceptBreadcrumbDrops: true
    property alias activeDraggedPaths: breadcrumbPrimitive.activeDraggedPaths
    readonly property bool isBreadcrumbDropActive: acceptBreadcrumbDrops && breadcrumbPrimitive.isDropActive
    readonly property string activeBreadcrumbDropPath: acceptBreadcrumbDrops ? breadcrumbPrimitive.activeDropPath : ""
    readonly property alias breadcrumbDropPointerX: breadcrumbPrimitive.dropPointerX

    // 拖拽修饰键（Ctrl=复制）响应式追踪：宿主注入 dragModifierState 上下文属性时
    // 直接绑定其 ctrlHeld；独立运行/测试环境回退到 manualCtrlHeld（由宿主手动赋值）。
    property var dragModifierTracker: (typeof dragModifierState !== "undefined") ? dragModifierState : null
    property bool manualCtrlHeld: false
    readonly property bool dragCopyModifier: dragModifierTracker ? dragModifierTracker.ctrlHeld : manualCtrlHeld

    signal navigateRequested(string path)
    signal navigateRequestedWithSelection(string path, string selectionPath)
    signal backRequested()
    signal forwardRequested()
    signal upRequested()
    signal refreshRequested()
    signal searchRequested(string query)
    signal dropRequested(string targetPath, var urls)

    property string editValue: controller.editingText || controller.currentPath

    implicitHeight: ThemeTokens.dp(36)
    implicitWidth: ThemeTokens.dp(500)

    ChaSetAddressBarController {
        id: controller
        objectName: "addressBarController"
        visualItem: root
        suggestPopup: suggestPopup
        subfolderPopup: subfolderPopup
        onNavigateRequested: (targetPath) => {
            root.navigateRequested(targetPath)
        }
        onNavigateRequestedWithSelection: (targetPath, selection) => {
            root.navigateRequestedWithSelection(targetPath, selection)
        }
        onCurrentPathChanged: {
            if (!controller.editing) {
                root.editValue = controller.editingText || controller.currentPath
            }
        }
        onEditingTextChanged: {
            if (!controller.editing) {
                root.editValue = controller.editingText || controller.currentPath
            }
        }
        onEditingChanged: {
            if (controller.editing) {
                editInput.text = controller.editingText || controller.currentPath
                editInput.selectAll()
                editInput.forceActiveFocus()
            } else {
                suggestPopup.close()
                subfolderPopup.close()
            }
            if (typeof windowUi !== "undefined" && windowUi && typeof windowUi.setAddressBarEditing === "function") {
                windowUi.setAddressBarEditing(controller.editing)
            }
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
                id: backButton
                objectName: "backButton"
                property bool actionEnabled: root.canGoBack && !root.disabled
                property string tooltipText: ChaSetI18n.tr("desktopComposite.addressBar.backTooltip", "后退")
                property string iconName: "arrow_back"
                width: ThemeTokens.dp(26)
                height: ThemeTokens.dp(26)
                radius: ThemeTokens.dp(4)
                color: "transparent"
                opacity: actionEnabled ? 1.0 : 0.35

                Rectangle {
                    id: backBtnBg
                    objectName: "navBtnBg"
                    anchors.fill: parent
                    radius: ThemeTokens.dp(4)
                    color: backHover.hovered && backButton.actionEnabled ? ThemeTokens.hover : "transparent"
                }

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "arrow-left"
                    size: 16
                    color: ThemeTokens.text
                }

                HoverHandler {
                    id: backHover
                    objectName: "navHover"
                    cursorShape: backButton.actionEnabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                }

                ChaSetTooltip {
                    target: backButton
                    text: backButton.tooltipText
                    side: "bottom"
                    delay: 400
                    disabled: !backButton.actionEnabled
                }

                TapHandler {
                    enabled: backButton.actionEnabled
                    onTapped: {
                        controller.goBack()
                        root.backRequested()
                    }
                }
            }

            // Forward
            Rectangle {
                id: forwardButton
                objectName: "forwardButton"
                property bool actionEnabled: root.canGoForward && !root.disabled
                property string tooltipText: ChaSetI18n.tr("desktopComposite.addressBar.forwardTooltip", "前进")
                property string iconName: "arrow_forward"
                width: ThemeTokens.dp(26)
                height: ThemeTokens.dp(26)
                radius: ThemeTokens.dp(4)
                color: "transparent"
                opacity: actionEnabled ? 1.0 : 0.35

                Rectangle {
                    id: forwardBtnBg
                    objectName: "navBtnBg"
                    anchors.fill: parent
                    radius: ThemeTokens.dp(4)
                    color: forwardHover.hovered && forwardButton.actionEnabled ? ThemeTokens.hover : "transparent"
                }

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "arrow-right"
                    size: 16
                    color: ThemeTokens.text
                }

                HoverHandler {
                    id: forwardHover
                    objectName: "navHover"
                    cursorShape: forwardButton.actionEnabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                }

                ChaSetTooltip {
                    target: forwardButton
                    text: forwardButton.tooltipText
                    side: "bottom"
                    delay: 400
                    disabled: !forwardButton.actionEnabled
                }

                TapHandler {
                    enabled: forwardButton.actionEnabled
                    onTapped: {
                        controller.goForward()
                        root.forwardRequested()
                    }
                }
            }

            // Up
            Rectangle {
                id: upButton
                objectName: "upButton"
                readonly property bool canUp: Boolean(root.path && root.path !== "/" && !root.path.match(/^[a-zA-Z]:[/\\]?$/))
                property bool actionEnabled: canUp && !root.disabled
                property string tooltipText: ChaSetI18n.tr("desktopComposite.addressBar.upTooltip", "上一级")
                property string iconName: "arrow_upward"
                width: ThemeTokens.dp(26)
                height: ThemeTokens.dp(26)
                radius: ThemeTokens.dp(4)
                color: "transparent"
                opacity: actionEnabled ? 1.0 : 0.35

                Rectangle {
                    id: upBtnBg
                    objectName: "navBtnBg"
                    anchors.fill: parent
                    radius: ThemeTokens.dp(4)
                    color: upHover.hovered && upButton.actionEnabled ? ThemeTokens.hover : "transparent"
                }

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "arrow-up"
                    size: 16
                    color: ThemeTokens.text
                }

                HoverHandler {
                    id: upHover
                    objectName: "navHover"
                    cursorShape: upButton.actionEnabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                }

                ChaSetTooltip {
                    target: upButton
                    text: upButton.tooltipText
                    side: "bottom"
                    delay: 400
                    disabled: !upButton.actionEnabled
                }

                TapHandler {
                    enabled: upButton.actionEnabled
                    onTapped: {
                        controller.navigateUp()
                        root.upRequested()
                    }
                }
            }

            // Refresh
            Rectangle {
                id: refreshButton
                objectName: "refreshButton"
                visible: root.showRefresh
                property bool actionEnabled: !root.disabled
                property string tooltipText: ChaSetI18n.tr("desktopComposite.addressBar.refreshTooltip", "刷新")
                property string iconName: "refresh"
                width: ThemeTokens.dp(26)
                height: ThemeTokens.dp(26)
                radius: ThemeTokens.dp(4)
                color: "transparent"
                opacity: actionEnabled ? 1.0 : 0.35

                Rectangle {
                    id: refreshBtnBg
                    objectName: "navBtnBg"
                    anchors.fill: parent
                    radius: ThemeTokens.dp(4)
                    color: refreshHover.hovered && refreshButton.actionEnabled ? ThemeTokens.hover : "transparent"
                }

                ChaSetIcon {
                    anchors.centerIn: parent
                    name: "rotate-ccw"
                    size: 16
                    color: ThemeTokens.text
                }

                HoverHandler {
                    id: refreshHover
                    objectName: "navHover"
                    cursorShape: refreshButton.actionEnabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                }

                ChaSetTooltip {
                    target: refreshButton
                    text: refreshButton.tooltipText
                    side: "bottom"
                    delay: 400
                    disabled: !refreshButton.actionEnabled
                }

                TapHandler {
                    enabled: refreshButton.actionEnabled
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

            HoverHandler {
                enabled: root.editing
                cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.IBeamCursor
            }

            // 1. Breadcrumbs Mode
            Item {
                id: breadcrumbsContainer
                anchors.fill: parent
                visible: !root.editing

                ChaSetBreadcrumb {
                    id: breadcrumbPrimitive
                    objectName: "addressBarBreadcrumb"
                    anchors.left: parent.left
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    width: Math.min(parent.width, implicitWidth)
                    segments: controller.segments
                    disabled: root.disabled || !root.acceptBreadcrumbDrops

                    onNavigateRequested: (targetPath) => {
                        controller.navigate(targetPath)
                    }

                    onBlankAreaClicked: {
                        controller.enterEditMode()
                    }

                    onOpenSubfoldersRequested: (index, targetPath, chevronItem) => {
                        var list = controller.subfolders(targetPath)
                        subfolderPopup.setItems(list)
                        if (list.length > 0) {
                            if (chevronItem) {
                                var pt = chevronItem.mapToItem(root, 0, chevronItem.height)
                                subfolderPopup.x = pt.x
                                subfolderPopup.y = pt.y + ThemeTokens.dp(4)
                            } else {
                                subfolderPopup.x = centerField.x
                                subfolderPopup.y = root.height + ThemeTokens.dp(4)
                            }
                            subfolderPopup.open()
                        }
                    }

                    onDropRequested: (targetPath, urls) => {
                        root.dropRequested(targetPath, urls)
                    }
                }

                // Blank area to click into edit mode or drop onto current folder
                Item {
                    id: blankAreaWrapper
                    objectName: "blankAreaWrapper"
                    anchors.left: breadcrumbPrimitive.right
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    visible: width > 2

                    MouseArea {
                        id: blankClickArea
                        objectName: "blankClickArea"
                        anchors.fill: parent
                        cursorShape: !root.disabled ? Qt.IBeamCursor : Qt.ForbiddenCursor
                        onClicked: {
                            if (!root.disabled) {
                                controller.enterEditMode()
                            }
                        }
                    }

                    DropArea {
                        id: blankDropArea
                        objectName: "addressBarBlankDropArea"
                        anchors.fill: parent
                        enabled: root.acceptBreadcrumbDrops && !root.disabled && !root.editing

                        // 记录当前悬停的 drag 对象：Ctrl 按下/松开时无需移动鼠标即可重算接受状态
                        property var currentDrag: null

                        function dragIsCopy(drag) {
                            if (typeof windowUi !== "undefined" && windowUi && typeof windowUi.isCtrlDown === "function") {
                                return windowUi.isCtrlDown()
                            }
                            if (drag && drag.keyboardModifiers !== undefined) {
                                return ((drag.keyboardModifiers & Qt.ControlModifier) !== 0
                                        || (drag.keyboardModifiers & Qt.MetaModifier) !== 0)
                            }
                            return ((Qt.application.keyboardModifiers & Qt.ControlModifier) !== 0)
                                || ((Qt.application.keyboardModifiers & Qt.MetaModifier) !== 0)
                        }

                        function acceptIfTargeted(drag) {
                            var lastIdx = breadcrumbPrimitive.segments ? breadcrumbPrimitive.segments.length - 1 : -1
                            if (lastIdx < 0) return
                            var target = breadcrumbPrimitive.updateSegmentDrop(lastIdx, drag)
                            if (target !== "" && drag && drag.accept) {
                                drag.accept((root.dragCopyModifier || dragIsCopy(drag)) ? Qt.CopyAction : Qt.MoveAction)
                            } else if (drag && drag.accept) {
                                drag.accept(Qt.IgnoreAction)
                            }
                        }

                        Connections {
                            target: root
                            function onDragCopyModifierChanged() {
                                if (blankDropArea.currentDrag) {
                                    blankDropArea.acceptIfTargeted(blankDropArea.currentDrag)
                                }
                            }
                        }

                        onEntered: (drag) => {
                            blankDropArea.currentDrag = drag
                            var pt = blankDropArea.mapToItem(root, drag.x, drag.y)
                            breadcrumbPrimitive.dropPointerX = pt.x
                            acceptIfTargeted(drag)
                        }
                        onPositionChanged: (drag) => {
                            blankDropArea.currentDrag = drag
                            var pt = blankDropArea.mapToItem(root, drag.x, drag.y)
                            breadcrumbPrimitive.dropPointerX = pt.x
                            acceptIfTargeted(drag)
                        }
                        onExited: {
                            blankDropArea.currentDrag = null
                            breadcrumbPrimitive.clearSegmentDrop()
                        }
                        onDropped: (drop) => {
                            var lastIdx = breadcrumbPrimitive.segments ? breadcrumbPrimitive.segments.length - 1 : -1
                            if (lastIdx >= 0 && breadcrumbPrimitive.commitSegmentDrop(lastIdx, drop)) {
                                if (drop && typeof drop.acceptProposedAction === "function") {
                                    drop.acceptProposedAction()
                                }
                            }
                        }
                    }
                }
            }

            // 2. Edit Mode (Inline text field)
            TextInput {
                id: editInput
                objectName: "addressBarEditField"
                visible: root.editing
                anchors.fill: parent
                anchors.leftMargin: ThemeTokens.dp(6)
                anchors.rightMargin: ThemeTokens.dp(6)
                verticalAlignment: TextInput.AlignVCenter
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeSmall
                selectByMouse: true
                mouseSelectionMode: TextInput.SelectCharacters
                selectionColor: ThemeTokens.accent
                selectedTextColor: (typeof ThemeTokens !== "undefined" && ThemeTokens.accentText) ? ThemeTokens.accentText : "#ffffff"

                HoverHandler {
                    cursorShape: root.disabled ? Qt.ForbiddenCursor : Qt.IBeamCursor
                }

                onActiveFocusChanged: {
                    // 外部点击（失焦）：一步到位退出，同时关闭下拉和编辑态，杜绝两步轮流退出的迟滞
                    if (!activeFocus && (!suggestPopup || !suggestPopup.opened)) {
                        if (controller.editing) {
                            controller.exitEditMode()
                        }
                    }
                }

                onTextEdited: {
                    refreshSuggestions()
                }

                Keys.onPressed: (event) => {
                    if (event.key === Qt.Key_Escape) {
                        event.accepted = true
                        if (suggestPopup.opened) {
                            suggestPopup.close()
                        } else {
                            controller.exitEditMode()
                        }
                    } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                        event.accepted = true
                        commitEdit()
                    } else if (event.key === Qt.Key_Down) {
                        if (suggestPopup.opened) {
                            event.accepted = true
                            suggestPopup.highlightedIndex = Math.min(suggestPopup.highlightedIndex + 1, suggestPopup.suggestionList.count - 1)
                        } else {
                            event.accepted = true
                            showHistoryPopup()
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

        // Responsive Right Search Input ("需要用户输入就出现的搜索框")
        Rectangle {
            id: searchBox
            objectName: "searchBox"
            visible: root.showSearch
            Layout.preferredWidth: root.isSearchExpanded ? ThemeTokens.dp(180) : ThemeTokens.dp(28)
            Layout.preferredHeight: ThemeTokens.dp(26)
            radius: ThemeTokens.dp(4)
            color: (searchInput.activeFocus || searchBoxHover.hovered) ? ThemeTokens.panelRaised : ThemeTokens.panel
            border.width: 1
            border.color: searchInput.activeFocus ? ThemeTokens.accent : ThemeTokens.border
            clip: true

            Behavior on Layout.preferredWidth {
                NumberAnimation {
                    duration: (typeof ThemeTokens !== "undefined" && ThemeTokens.animationsEnabled) ? 150 : 0
                    easing.type: Easing.OutCubic
                }
            }

            HoverHandler {
                id: searchBoxHover
                cursorShape: (!root.isSearchExpanded && !root.disabled) ? Qt.PointingHandCursor : Qt.ArrowCursor
            }

            ChaSetTooltip {
                target: searchBox
                text: ChaSetI18n.tr("desktopComposite.addressBar.searchTooltip", "搜索")
                side: "bottom"
                delay: 400
                disabled: root.isSearchExpanded || root.disabled
            }

            TapHandler {
                enabled: !root.isSearchExpanded && !root.disabled
                onTapped: {
                    root.focusSearch()
                }
            }

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: ThemeTokens.dp(6)
                anchors.rightMargin: ThemeTokens.dp(6)
                spacing: ThemeTokens.dp(4)

                ChaSetIcon {
                    name: "search"
                    size: 14
                    color: searchInput.activeFocus ? ThemeTokens.accent : ThemeTokens.subduedText
                    Layout.alignment: Qt.AlignVCenter
                }

                TextInput {
                    id: searchInput
                    objectName: "addressBarSearchField"
                    visible: root.isSearchExpanded
                    Layout.fillWidth: true
                    Layout.fillHeight: true
                    verticalAlignment: TextInput.AlignVCenter
                    color: ThemeTokens.text
                    font.pixelSize: Typography.sizeSmall
                    text: root.searchQuery
                    onTextChanged: {
                        if (root.searchQuery !== text) root.searchQuery = text
                    }
                    onTextEdited: {
                        root.searchQuery = text
                        root.searchRequested(text)
                    }
                    onAccepted: {
                        root.searchRequested(text)
                    }
                    Keys.onPressed: (event) => {
                        if (event.key === Qt.Key_Escape) {
                            event.accepted = true
                            if (text.length > 0) {
                                text = ""
                                root.searchQuery = ""
                                root.searchRequested("")
                            } else {
                                searchInput.focus = false
                            }
                        }
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
                        visible: !searchInput.text
                    }
                }

                // Clear button
                Rectangle {
                    id: searchClearBtn
                    visible: root.isSearchExpanded && searchInput.text.length > 0 && !root.disabled
                    Layout.preferredWidth: ThemeTokens.dp(16)
                    Layout.preferredHeight: ThemeTokens.dp(16)
                    Layout.alignment: Qt.AlignVCenter
                    radius: ThemeTokens.dp(8)
                    color: searchClearMouse.containsMouse ? ThemeTokens.hover : "transparent"

                    ChaSetIcon {
                        name: "x"
                        size: 12
                        color: ThemeTokens.subduedText
                        anchors.centerIn: parent
                    }

                    MouseArea {
                        id: searchClearMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            searchInput.text = ""
                            root.searchQuery = ""
                            root.searchRequested("")
                            searchInput.forceActiveFocus()
                        }
                    }
                }
            }
        }
    }

    // Auto-complete / Typed History Suggestions Popup
    ChaSetAddressBarSuggestPopup {
        id: suggestPopup
        objectName: "suggestPopup"
        takeFocus: false
        x: centerField.x
        y: root.height + ThemeTokens.dp(4)
        onNavigateRequested: (targetPath) => {
            controller.navigate(targetPath)
        }
        onClosed: {
            breadcrumbPrimitive.openSegmentIndex = -1
            if (!editInput.activeFocus && controller.editing) {
                controller.exitEditMode()
            }
        }
    }

    // Subfolders dropdown popup
    ChaSetAddressBarSuggestPopup {
        id: subfolderPopup
        objectName: "subfolderPopup"
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
        // 非路径输入回车 → 触发搜索并进入搜索框
        root.searchQuery = text
        root.searchRequested(text)
        controller.exitEditMode()
    }

    function focusSearch() {
        if (root.showSearch && !root.disabled) {
            if (controller.editing) {
                controller.exitEditMode()
            }
            searchInput.forceActiveFocus()
            searchInput.selectAll()
        }
    }

    function navigateTo(targetPath) {
        return controller.navigate(targetPath)
    }

    function enterEditMode() {
        controller.enterEditMode()
    }

    function exitEditMode() {
        suggestPopup.close()
        controller.exitEditMode()
    }

    function goBack() {
        controller.goBack()
    }

    function goForward() {
        controller.goForward()
    }

    function navigateUp() {
        controller.navigateUp()
    }

    function closeAllPopups() {
        suggestPopup.close()
        subfolderPopup.close()
        if (breadcrumbPrimitive) {
            breadcrumbPrimitive.closePopups()
            breadcrumbPrimitive.openSegmentIndex = -1
        }
    }

    // Tooltip popup support for host and tests
    FontMetrics {
        id: tooltipFontMetrics
        font.pixelSize: Typography.sizeSmall
    }

    Popup {
        id: tooltipPopup
        objectName: "tooltipPopup"
        popupType: Popup.Item
        closePolicy: Popup.NoAutoClose
        property string tooltipText: ""
        padding: ThemeTokens.dp(6)
        width: Math.min(ThemeTokens.dp(320), tooltipFontMetrics.advanceWidth(tooltipPopup.tooltipText) + ThemeTokens.dp(12))
        height: ThemeTokens.dp(24)
        contentItem: Text {
            text: tooltipPopup.tooltipText
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
            elide: Text.ElideRight
            verticalAlignment: Text.AlignVCenter
        }
        background: Rectangle {
            color: ThemeTokens.panel
            radius: ThemeTokens.dp(4)
            border.color: ThemeTokens.border
            border.width: 1
        }
    }

    property var _tooltipRequest: null
    Timer {
        id: tooltipDelayTimer
        interval: 400
        repeat: false
        onTriggered: {
            if (!_tooltipRequest || !_tooltipRequest.item) return
            var req = _tooltipRequest
            tooltipPopup.tooltipText = req.text
            var mapped = req.item.mapToItem(root, req.item.width / 2 - tooltipPopup.width / 2, -tooltipPopup.height - 3)
            tooltipPopup.x = Math.max(0, Math.min(root.width - tooltipPopup.width, mapped.x))
            tooltipPopup.y = mapped.y
            tooltipPopup.open()
        }
    }

    function requestTooltip(item, text) {
        _tooltipRequest = { item: item, text: text }
        tooltipDelayTimer.restart()
    }

    function clearTooltip(item) {
        if (_tooltipRequest && _tooltipRequest.item === item) {
            _tooltipRequest = null
            tooltipDelayTimer.stop()
            tooltipPopup.close()
        }
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

    Shortcut {
        sequence: "Ctrl+F"
        onActivated: {
            if (!root.disabled && root.showSearch) focusSearch()
        }
    }
}
