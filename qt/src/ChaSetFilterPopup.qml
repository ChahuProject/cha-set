pragma ComponentBehavior: Bound
// qt/src/ChaSetFilterPopup.qml
// Universal multi-dimensional facet filter popup component.
// Supports tri-state facet filtering (include/exclude), real-time pinyin fuzzy search,
// star ratings, logic mode toggle, and shortcut hints.
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

Popup {
    id: rootPopup

    property string title: ""
    property string iconName: ""
    property var items: []
    property bool hasActive: false
    property bool showLogicToggle: false
    property string logicMode: "and" // "and" | "or"

    // Search settings:
    // searchEnabled: whether search filtering is enabled
    // searchVisibility: "autoHidden" | "always"
    property bool searchEnabled: true
    property string searchVisibility: "autoHidden" // "autoHidden" | "always"
    property bool validateFileName: false
    property bool searchActive: searchVisibility === "always"
    property string searchFilterText: ""
    property real lastClosedMs: 0

    // Illegal Windows filename characters: \ / : * ? " < > |
    readonly property var invalidFileNameChars: {
        if (!validateFileName || !searchFilterText) return []
        var text = searchFilterText
        var list = []
        var seen = {}
        for (var i = 0; i < text.length; ++i) {
            var ch = text[i]
            if (/[\\/:*?"<>|\x00-\x1F]/.test(ch)) {
                if (!seen[ch]) {
                    seen[ch] = true
                    list.push(ch)
                }
            }
        }
        return list
    }
    readonly property bool hasInvalidChars: invalidFileNameChars.length > 0

    // Callbacks / overrides for dynamic inclusion & exclusion state
    property var checkIncluded: null // function(key): bool
    property var checkExcluded: null // function(key): bool
    property int refreshEpoch: 0
    function refresh() {
        refreshEpoch++
    }

    signal itemIncludeToggled(var key)
    signal itemExcludeToggled(var key)
    signal clearRequested()

    popupType: Popup.Item
    padding: ThemeTokens.dp(8)
    closePolicy: (searchFilterText.length > 0 || (searchVisibility === "autoHidden" && searchActive))
        ? Popup.CloseOnPressOutside
        : (Popup.CloseOnEscape | Popup.CloseOnPressOutside)

    width: ThemeTokens.dp(290)
    height: Math.min(ThemeTokens.dp(390), contentCol.implicitHeight + ThemeTokens.dp(16))

    function applyFocus() {
        if (!rootPopup.opened) return
        if (rootPopup.searchEnabled && searchInput) {
            searchInput.forceActiveFocus()
        } else {
            contentCol.forceActiveFocus()
        }
    }

    onAboutToShow: {
        refreshEpoch++
        ChaSetOverlayHub.register(rootPopup)
        searchFilterText = ""
        if (searchInput) searchInput.text = ""
        searchActive = (searchVisibility === "always")
    }

    onOpened: {
        applyFocus()
        Qt.callLater(applyFocus)
    }

    onClosed: {
        lastClosedMs = Date.now()
        ChaSetOverlayHub.unregister(rootPopup)
        searchFilterText = ""
        if (searchInput) searchInput.text = ""
        searchActive = (searchVisibility === "always")
    }

    Component.onDestruction: {
        ChaSetOverlayHub.unregister(rootPopup)
    }

    function itemMatchesSearch(it, query) {
        if (!it || !query) return true
        var q = query.trim()
        if (!q) return true

        if (typeof it.stars === "number") {
            var s = it.stars
            if (q === String(s)) return true
            var starChinese = ["零星", "一星", "二星", "三星", "四星", "五星"]
            var alias = s + " " + s + "星 " + (starChinese[s] || "") + " " + s + "star"
            return matchQueryText(alias, q)
        }

        var label = String(it.label || "")
        var key = String(it.key || "")
        if (matchQueryText(label, q)) return true
        if (key && matchQueryText(key, q)) return true
        return false
    }

    function matchQueryText(text, query) {
        if (!text || !query) return true
        var q = query.trim()
        if (!q) return true
        if (typeof ChaSetPinyin !== "undefined" && ChaSetPinyin && typeof ChaSetPinyin.match === "function") {
            return ChaSetPinyin.match(text, q)
        }
        var lq = q.toLowerCase()
        return String(text).toLowerCase().indexOf(lq) >= 0
    }

    readonly property var displayItems: {
        var _ = refreshEpoch
        if (!items) return []
        if (!searchEnabled || !searchFilterText) return items
        var kw = searchFilterText.trim()
        if (!kw) return items
        var filtered = []
        for (var i = 0; i < items.length; ++i) {
            var it = items[i]
            if (!it) continue
            if (itemMatchesSearch(it, kw)) {
                filtered.push(it)
            }
        }
        return filtered
    }

    function handleKeyPress(event) {
        if (!event || !rootPopup.searchEnabled) return false

        if (event.key === Qt.Key_Backspace) {
            if (searchInput && searchInput.text.length > 0) {
                searchInput.text = searchInput.text.slice(0, -1)
                rootPopup.searchFilterText = searchInput.text.trim()
                searchInput.cursorPosition = searchInput.text.length
            }
            event.accepted = true
            return true
        }

        if (event.key === Qt.Key_Escape) {
            if (rootPopup.searchFilterText.length > 0 || (rootPopup.searchVisibility === "autoHidden" && rootPopup.searchActive)) {
                rootPopup.searchFilterText = ""
                if (searchInput) searchInput.text = ""
                rootPopup.searchActive = (rootPopup.searchVisibility === "always")
                contentCol.forceActiveFocus()
                event.accepted = true
                return true
            }
            rootPopup.close()
            event.accepted = true
            return true
        }

        if (event.text && event.text.length > 0 && !Boolean(event.modifiers & (Qt.ControlModifier | Qt.AltModifier | Qt.MetaModifier))) {
            var ch = event.text
            if (ch.charCodeAt(0) >= 32) {
                rootPopup.searchActive = true
                if (searchInput) {
                    searchInput.text = ch
                    rootPopup.searchFilterText = ch
                    searchInput.forceActiveFocus()
                    searchInput.cursorPosition = ch.length
                    Qt.callLater(() => {
                        if (searchInput) {
                            searchInput.forceActiveFocus()
                            searchInput.cursorPosition = searchInput.text.length
                        }
                    })
                }
                event.accepted = true
                return true
            }
        }
        return false
    }

    background: Rectangle {
        color: ThemeTokens.panelRaised
        radius: ThemeTokens.dp(8)
        border.color: ThemeTokens.border
        border.width: 1
    }

    contentItem: ColumnLayout {
        id: contentCol
        focus: true
        spacing: ThemeTokens.dp(6)

        Keys.onPressed: (event) => {
            rootPopup.handleKeyPress(event)
        }

        // Header Row
        RowLayout {
            Layout.fillWidth: true
            Layout.preferredHeight: ThemeTokens.dp(26)
            spacing: ThemeTokens.dp(6)

            ChaSetIcon {
                name: rootPopup.iconName
                size: 14
                color: rootPopup.hasActive ? ThemeTokens.accent : ThemeTokens.subduedText
            }

            Text {
                text: rootPopup.title
                font.bold: true
                font.pixelSize: Typography.sizeCaption
                color: ThemeTokens.text
                Layout.fillWidth: true
                elide: Text.ElideRight
            }

            ChaSetSegmentedControl {
                visible: rootPopup.showLogicToggle
                size: "sm"
                options: [
                    { value: "and", label: "AND", tip: qsTr("同时满足所选标签") },
                    { value: "or", label: "OR", tip: qsTr("满足任一所选标签") }
                ]
                value: rootPopup.logicMode
                onValueChanged: {
                    if (rootPopup.logicMode !== value) {
                        rootPopup.logicMode = value
                    }
                    rootPopup.applyFocus()
                }
            }

            ChaSetButton {
                visible: rootPopup.hasActive
                variant: "ghost"
                size: "xs"
                text: qsTr("清除")
                onClicked: {
                    rootPopup.clearRequested()
                    rootPopup.refresh()
                    rootPopup.applyFocus()
                }
            }
        }

        // Search Bar
        Rectangle {
            id: searchBar
            readonly property bool isBarExpanded: rootPopup.searchEnabled && (rootPopup.searchVisibility === "always" || rootPopup.searchActive || rootPopup.searchFilterText.length > 0)
            visible: rootPopup.searchEnabled
            Layout.fillWidth: true
            Layout.preferredHeight: isBarExpanded ? ThemeTokens.dp(26) : 0
            opacity: isBarExpanded ? 1.0 : 0.0
            clip: true
            radius: ThemeTokens.dp(4)
            color: rootPopup.hasInvalidChars ? Qt.alpha(ThemeTokens.danger, 0.1) : ThemeTokens.panel
            border.color: {
                if (rootPopup.hasInvalidChars) return ThemeTokens.danger
                if (searchInput.activeFocus) return ThemeTokens.accent
                return ThemeTokens.border
            }
            border.width: 1

            Behavior on Layout.preferredHeight {
                NumberAnimation { duration: ThemeTokens.motionDurationFast; easing.type: Easing.OutQuad }
            }
            Behavior on opacity {
                NumberAnimation { duration: ThemeTokens.motionDurationFast }
            }

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: ThemeTokens.dp(6)
                anchors.rightMargin: ThemeTokens.dp(6)
                spacing: ThemeTokens.dp(4)

                ChaSetIcon {
                    name: "search"
                    size: 12
                    color: ThemeTokens.subduedText
                }

                TextInput {
                    id: searchInput
                    Layout.fillWidth: true
                    font.pixelSize: Typography.sizeCaption
                    color: ThemeTokens.text
                    selectByMouse: true
                    clip: true
                    inputMethodHints: Qt.ImhNone
                    activeFocusOnTab: true
                    onTextChanged: {
                        rootPopup.searchFilterText = text.trim()
                        if (text.length > 0) {
                            rootPopup.searchActive = true
                        }
                    }

                    HoverHandler {
                        cursorShape: Qt.IBeamCursor
                    }

                    Keys.onPressed: (event) => {
                        if (event.key === Qt.Key_Backspace && searchInput.text.length === 0) {
                            event.accepted = true
                            return
                        }
                        if (event.key === Qt.Key_Escape) {
                            if (searchInput.text.length > 0) {
                                searchInput.text = ""
                                rootPopup.searchFilterText = ""
                                if (rootPopup.searchVisibility === "autoHidden") {
                                    rootPopup.searchActive = false
                                }
                                event.accepted = true
                                return
                            }
                            rootPopup.close()
                            event.accepted = true
                            return
                        }
                    }

                    Text {
                        anchors.fill: parent
                        text: qsTr("快速搜索...")
                        font.pixelSize: Typography.sizeCaption
                        color: ThemeTokens.subduedText
                        visible: !searchInput.text && !searchInput.activeFocus
                    }
                }

                ChaSetIcon {
                    visible: searchInput.text.length > 0
                    name: "close"
                    size: 12
                    color: ThemeTokens.subduedText
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                        onClicked: {
                            searchInput.text = ""
                            rootPopup.searchFilterText = ""
                            if (rootPopup.searchVisibility === "autoHidden") {
                                rootPopup.searchActive = false
                                contentCol.forceActiveFocus()
                            } else {
                                searchInput.forceActiveFocus()
                            }
                        }
                    }
                }
            }
        }

        // Invalid filename characters warning
        RowLayout {
            id: invalidCharsNotice
            visible: searchBar.isBarExpanded && rootPopup.hasInvalidChars
            Layout.fillWidth: true
            Layout.preferredHeight: visible ? ThemeTokens.dp(16) : 0
            spacing: ThemeTokens.dp(4)
            clip: true

            ChaSetIcon {
                name: "close"
                size: 12
                color: ThemeTokens.danger
            }

            Text {
                Layout.fillWidth: true
                font.pixelSize: Typography.sizeMicro
                color: ThemeTokens.danger
                elide: Text.ElideRight
                text: qsTr("不支持字符: %1").arg(rootPopup.invalidFileNameChars.join("  "))
            }
        }

        // Items list
        ScrollView {
            id: scrollView
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.minimumHeight: ThemeTokens.dp(60)
            Layout.maximumHeight: ThemeTokens.dp(240)
            clip: true

            MouseArea {
                anchors.fill: parent
                z: -1
                onClicked: {
                    rootPopup.applyFocus()
                }
            }

            ColumnLayout {
                id: listCol
                width: scrollView.width
                spacing: ThemeTokens.dp(2)

                Repeater {
                    model: rootPopup.displayItems

                    delegate: Rectangle {
                        id: rowDelegate
                        required property var modelData
                        Layout.fillWidth: true
                        Layout.preferredHeight: ThemeTokens.dp(26)
                        radius: ThemeTokens.dp(4)

                        readonly property int starsCount: (rowDelegate.modelData && typeof rowDelegate.modelData.stars === "number")
                            ? rowDelegate.modelData.stars : -1

                        readonly property bool isInc: {
                            var _ = rootPopup.refreshEpoch
                            if (typeof rootPopup.checkIncluded === "function") {
                                return Boolean(rootPopup.checkIncluded(rowDelegate.modelData ? rowDelegate.modelData.key : null))
                            }
                            return Boolean(rowDelegate.modelData && rowDelegate.modelData.isChecked)
                        }
                        readonly property bool isExc: {
                            var _ = rootPopup.refreshEpoch
                            if (typeof rootPopup.checkExcluded === "function") {
                                return Boolean(rootPopup.checkExcluded(rowDelegate.modelData ? rowDelegate.modelData.key : null))
                            }
                            return Boolean(rowDelegate.modelData && rowDelegate.modelData.isExcluded)
                        }

                        ChaSetTooltip {
                            target: rowDelegate
                            visible: rowDelegate.starsCount >= 0
                            text: rowDelegate.starsCount > 0 ? qsTr("%1 颗星").arg(rowDelegate.starsCount) : qsTr("0 星 (未评级)")
                            delay: 400
                        }

                        color: {
                            if (isExc) return Qt.alpha(ThemeTokens.danger, 0.12)
                            if (isInc) return Qt.alpha(ThemeTokens.accent, 0.14)
                            return itemMouse.containsMouse ? ThemeTokens.hover : "transparent"
                        }

                        border.color: {
                            if (isExc) return Qt.alpha(ThemeTokens.danger, 0.4)
                            if (isInc) return Qt.alpha(ThemeTokens.accent, 0.4)
                            return "transparent"
                        }
                        border.width: 1

                        RowLayout {
                            anchors.fill: parent
                            anchors.leftMargin: ThemeTokens.dp(6)
                            anchors.rightMargin: ThemeTokens.dp(6)
                            spacing: ThemeTokens.dp(6)

                            Rectangle {
                                Layout.preferredWidth: ThemeTokens.dp(16)
                                Layout.preferredHeight: ThemeTokens.dp(16)
                                radius: ThemeTokens.dp(3)
                                color: {
                                    if (rowDelegate.isExc) return Qt.alpha(ThemeTokens.danger, 0.2)
                                    if (rowDelegate.isInc) return ThemeTokens.accent
                                    return "transparent"
                                }
                                border.color: {
                                    if (rowDelegate.isExc) return ThemeTokens.danger
                                    if (rowDelegate.isInc) return ThemeTokens.accent
                                    return ThemeTokens.border
                                }
                                border.width: 1

                                ChaSetIcon {
                                    anchors.centerIn: parent
                                    visible: rowDelegate.isInc
                                    name: "check"
                                    size: 12
                                    color: ThemeTokens.onAccentColor
                                }

                                ChaSetIcon {
                                    anchors.centerIn: parent
                                    visible: rowDelegate.isExc
                                    name: "close"
                                    size: 12
                                    color: ThemeTokens.danger
                                }
                            }

                            Rectangle {
                                visible: Boolean(rowDelegate.modelData && rowDelegate.modelData.color)
                                Layout.preferredWidth: ThemeTokens.dp(8)
                                Layout.preferredHeight: ThemeTokens.dp(8)
                                radius: ThemeTokens.dp(4)
                                color: (rowDelegate.modelData && rowDelegate.modelData.color) ? rowDelegate.modelData.color : "transparent"
                            }

                            RowLayout {
                                id: starRowLayout
                                visible: rowDelegate.starsCount >= 0
                                Layout.fillWidth: true
                                spacing: ThemeTokens.dp(3)

                                Repeater {
                                    model: 5
                                    delegate: ChaSetIcon {
                                        required property int index
                                        readonly property bool isLit: index < rowDelegate.starsCount
                                        name: "star"
                                        size: 14
                                        fill: isLit ? 1.0 : 0.0
                                        color: isLit ? "#f59e0b" : ThemeTokens.subduedText
                                        opacity: isLit ? 1.0 : 0.35
                                    }
                                }
                            }

                            Text {
                                visible: !Boolean(rowDelegate.modelData && typeof rowDelegate.modelData.stars === "number")
                                Layout.fillWidth: true
                                text: rowDelegate.modelData ? (rowDelegate.modelData.label || "") : ""
                                font.pixelSize: Typography.sizeCaption
                                font.bold: rowDelegate.isInc || rowDelegate.isExc
                                font.strikeout: rowDelegate.isExc
                                elide: Text.ElideRight
                                color: {
                                    if (rowDelegate.isExc) return ThemeTokens.danger
                                    if (rowDelegate.isInc) return ThemeTokens.accent
                                    return ThemeTokens.text
                                }
                            }

                            Text {
                                visible: Boolean(rowDelegate.modelData && typeof rowDelegate.modelData.count === "number")
                                text: (rowDelegate.modelData && typeof rowDelegate.modelData.count === "number")
                                    ? String(rowDelegate.modelData.count) : ""
                                font.pixelSize: Typography.sizeMicro
                                color: ThemeTokens.subduedText
                            }
                        }

                        MouseArea {
                            id: itemMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: Qt.PointingHandCursor
                            acceptedButtons: Qt.LeftButton | Qt.RightButton
                            onClicked: (mouse) => {
                                if (!rowDelegate.modelData) return
                                if (mouse.button === Qt.RightButton) {
                                    rootPopup.itemExcludeToggled(rowDelegate.modelData.key)
                                } else {
                                    rootPopup.itemIncludeToggled(rowDelegate.modelData.key)
                                }
                                rootPopup.refresh()
                                rootPopup.applyFocus()
                            }
                        }
                    }
                }

                Text {
                    visible: !rootPopup.displayItems || rootPopup.displayItems.length === 0
                    Layout.fillWidth: true
                    Layout.preferredHeight: ThemeTokens.dp(36)
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                    text: rootPopup.searchFilterText ? qsTr("未匹配到相关项") : qsTr("暂无可选项")
                    font.pixelSize: Typography.sizeCaption
                    color: ThemeTokens.subduedText
                }
            }
        }

        // Shortcuts Guide Bar
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: ThemeTokens.dp(26)
            color: "transparent"

            Rectangle {
                anchors.top: parent.top
                width: parent.width
                height: 1
                color: ThemeTokens.border
            }

            RowLayout {
                anchors.fill: parent
                spacing: ThemeTokens.dp(8)

                RowLayout {
                    spacing: ThemeTokens.dp(3)
                    ChaSetKbd {
                        size: "xs"
                        variant: "outline"
                        shortcut: "mouse-left"
                        Layout.alignment: Qt.AlignVCenter
                    }
                    Text {
                        text: qsTr("包含")
                        font.pixelSize: Typography.sizeMicro
                        color: ThemeTokens.subduedText
                        Layout.alignment: Qt.AlignVCenter
                    }
                }

                RowLayout {
                    spacing: ThemeTokens.dp(3)
                    ChaSetKbd {
                        size: "xs"
                        variant: "outline"
                        shortcut: "mouse-right"
                        Layout.alignment: Qt.AlignVCenter
                    }
                    Text {
                        text: qsTr("排除")
                        font.pixelSize: Typography.sizeMicro
                        color: ThemeTokens.subduedText
                        Layout.alignment: Qt.AlignVCenter
                    }
                }

                RowLayout {
                    visible: rootPopup.searchEnabled
                    spacing: ThemeTokens.dp(3)
                    ChaSetKbd {
                        size: "xs"
                        variant: "outline"
                        text: qsTr("字符")
                        Layout.alignment: Qt.AlignVCenter
                    }
                    Text {
                        text: qsTr("输入开始搜索")
                        font.pixelSize: Typography.sizeMicro
                        color: ThemeTokens.subduedText
                        Layout.alignment: Qt.AlignVCenter
                    }
                }

                Item { Layout.fillWidth: true }

                RowLayout {
                    spacing: ThemeTokens.dp(3)
                    ChaSetKbd {
                        size: "xs"
                        variant: "outline"
                        shortcut: "Esc"
                        Layout.alignment: Qt.AlignVCenter
                    }
                    Text {
                        text: qsTr("关闭")
                        font.pixelSize: Typography.sizeMicro
                        color: ThemeTokens.subduedText
                        Layout.alignment: Qt.AlignVCenter
                    }
                }
            }
        }
    }
}
