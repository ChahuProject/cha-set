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

    // Facet variant:
    // "default": free-form facet list with search and custom input.
    // "numeric": small integer-only facets (<= 10 values, e.g. 0-5 star ratings).
    //            Digit keys 0-9 cycle each facet include -> exclude -> off,
    //            the search bar is disabled and every item stays visible.
    property string variant: "default" // "default" | "numeric"
    readonly property bool numericVariant: variant === "numeric"

    // Search settings:
    // searchEnabled: whether search filtering is enabled
    // searchVisibility: "autoHidden" | "always"
    property bool searchEnabled: true
    readonly property bool searchAvailable: searchEnabled && !numericVariant
    property string searchVisibility: "autoHidden" // "autoHidden" | "always"
    property string searchPlaceholder: ChaSetI18n.tr("overlays.filterPopup.searchPlaceholder", "Quick search...")
    property string emptyText: ChaSetI18n.tr("overlays.filterPopup.empty", "No items available")
    property string noMatchText: ChaSetI18n.tr("overlays.filterPopup.noMatch", "No matching items")
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

    // Custom item input properties:
    // allowCustomInput: whether user can manually submit a custom filter item not in list
    property bool allowCustomInput: false
    property string customActionPrefix: ""
    property string customActionText: ""
    property var customItemValidator: null // function(text): bool
    signal customItemSubmitted(string text, string mode)

    readonly property bool hasExactMatch: {
        if (!searchFilterText) return true
        var q = searchFilterText.trim().toLowerCase()
        var prefix = customActionPrefix ? customActionPrefix.toLowerCase() : ""
        var itemsList = displayItems || []
        for (var i = 0; i < itemsList.length; ++i) {
            var it = itemsList[i]
            if (!it) continue
            var k = String(it.key !== undefined && it.key !== null ? it.key : "").toLowerCase()
            var l = String(it.label || "").toLowerCase()
            if (k === q || l === q) return true
            if (prefix) {
                if (prefix + k === q || k === prefix + q || prefix + l === q || l === prefix + q) {
                    return true
                }
            }
        }
        return false
    }

    readonly property string cleanCustomInputText: {
        var t = (searchFilterText || "").trim()
        if (!t) return ""
        if (customActionPrefix && t.startsWith(customActionPrefix)) {
            t = t.slice(customActionPrefix.length).trim()
        }
        return t
    }

    readonly property bool showCustomActionItem: {
        if (!allowCustomInput || !searchFilterText) return false
        if (hasInvalidChars) return false
        var clean = cleanCustomInputText
        if (!clean) return false
        if (typeof customItemValidator === "function" && !customItemValidator(clean)) return false
        return !hasExactMatch
    }

    readonly property string displayCustomActionLabel: {
        var clean = cleanCustomInputText
        var target = customActionPrefix ? (customActionPrefix + clean) : clean
        if (customActionText) {
            return customActionText.replace("{{text}}", target)
        }
        var isZh = typeof ChaSetI18n !== "undefined" && ChaSetI18n && ChaSetI18n.locale && ChaSetI18n.locale.indexOf("zh") >= 0
        var fallback = isZh ? "添加 \"{{text}}\"" : "Add \"{{text}}\""
        return ChaSetI18n.tr("overlays.filterPopup.addCustom", fallback, { text: target })
    }

    function submitCustomItem(mode) {
        if (!showCustomActionItem) return
        var clean = cleanCustomInputText
        if (!clean) return
        rootPopup.customItemSubmitted(clean, mode || "include")
        if (searchInput) searchInput.text = ""
        rootPopup.searchFilterText = ""
        rootPopup.refresh()
        rootPopup.applyFocus()
    }

    // Callbacks / overrides for dynamic inclusion & exclusion state
    property var checkIncluded: null // function(key): bool
    property var checkExcluded: null // function(key): bool
    property int refreshEpoch: 0
    function refresh() {
        refreshEpoch++
    }

    signal itemIncludeToggled(var key)
    signal itemExcludeToggled(var key)
    // Numeric variant only: a digit key cycled the facet to the next state.
    // nextState is "include" | "exclude" | "none".
    signal itemStateCycled(var key, string nextState)
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
        if (rootPopup.searchAvailable && searchInput) {
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
        if (rootPopup.numericVariant) return items
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

    // Numeric variant: single digit key -> facet lookup.
    // Accepts an explicit numericKey, an integer key/stars value, or a single-digit label.
    function numericKeyForItem(it) {
        if (!it) return -1
        var raw = it.numericKey
        if (raw === undefined || raw === null) raw = it.key
        if (raw === undefined || raw === null) raw = it.stars
        if (raw === undefined || raw === null) raw = it.label
        if (typeof raw === "number" && raw >= 0 && raw <= 9 && Math.floor(raw) === raw) return raw
        var text = String(raw === undefined || raw === null ? "" : raw).trim()
        if (/^[0-9]$/.test(text)) return Number(text)
        return -1
    }

    function numericItemForKey(digit) {
        var list = items || []
        for (var i = 0; i < list.length; ++i) {
            if (numericKeyForItem(list[i]) === digit) return list[i]
        }
        return null
    }

    function numericIdentity(it) {
        if (!it) return null
        if (it.key !== undefined && it.key !== null) return it.key
        return numericKeyForItem(it)
    }

    function numericItemIncluded(it) {
        var key = numericIdentity(it)
        if (typeof rootPopup.checkIncluded === "function") {
            return Boolean(rootPopup.checkIncluded(key))
        }
        return Boolean(it.isChecked)
    }

    function numericItemExcluded(it) {
        var key = numericIdentity(it)
        if (typeof rootPopup.checkExcluded === "function") {
            return Boolean(rootPopup.checkExcluded(key))
        }
        return Boolean(it.isExcluded)
    }

    // Cycle one numeric facet: off -> include -> exclude -> off.
    function cycleNumericItem(digit) {
        var it = numericItemForKey(digit)
        if (!it) return false
        var nextState = "include"
        if (numericItemExcluded(it)) {
            nextState = "none"
        } else if (numericItemIncluded(it)) {
            nextState = "exclude"
        }
        rootPopup.itemStateCycled(numericIdentity(it), nextState)
        rootPopup.refresh()
        return true
    }

    function handleKeyPress(event) {
        if (!event) return false

        if (rootPopup.numericVariant) {
            if (event.key === Qt.Key_Escape) {
                rootPopup.close()
                event.accepted = true
                return true
            }
            if (!Boolean(event.modifiers & (Qt.ControlModifier | Qt.AltModifier | Qt.MetaModifier))
                    && event.key >= Qt.Key_0 && event.key <= Qt.Key_9) {
                if (rootPopup.cycleNumericItem(event.key - Qt.Key_0)) {
                    event.accepted = true
                    return true
                }
            }
            return false
        }

        if (!rootPopup.searchEnabled) return false

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
                    searchInput.text = searchInput.text + ch
                    rootPopup.searchFilterText = searchInput.text.trim()
                    searchInput.forceActiveFocus()
                    searchInput.cursorPosition = searchInput.text.length
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
                    { value: "and", label: "AND", tip: ChaSetI18n.tr("overlays.filterPopup.logicAndTip", "Match all selected tags") },
                    { value: "or", label: "OR", tip: ChaSetI18n.tr("overlays.filterPopup.logicOrTip", "Match any selected tag") }
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
                text: ChaSetI18n.tr("overlays.filterPopup.clear", "Clear")
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
            readonly property bool isBarExpanded: rootPopup.searchAvailable && (rootPopup.searchVisibility === "always" || rootPopup.searchActive || rootPopup.searchFilterText.length > 0)
            visible: rootPopup.searchAvailable
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
                        if (event.key === Qt.Key_Return || event.key === Qt.Key_Enter) {
                            if (rootPopup.showCustomActionItem) {
                                rootPopup.submitCustomItem("include")
                                event.accepted = true
                                return
                            } else if (rootPopup.displayItems && rootPopup.displayItems.length === 1) {
                                rootPopup.itemIncludeToggled(rootPopup.displayItems[0].key)
                                rootPopup.refresh()
                                rootPopup.applyFocus()
                                event.accepted = true
                                return
                            }
                        }
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
                        text: rootPopup.searchPlaceholder
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
                text: ChaSetI18n.tr("overlays.filterPopup.invalidChars", "Invalid characters: {{chars}}", { chars: rootPopup.invalidFileNameChars.join("  ") })
            }
        }

        // Items list
        ScrollView {
            id: scrollView
            Layout.fillWidth: true
            Layout.fillHeight: true
            Layout.minimumHeight: ThemeTokens.dp(60)
            Layout.maximumHeight: ThemeTokens.dp(240)
            Layout.preferredHeight: Math.min(ThemeTokens.dp(240), Math.max(ThemeTokens.dp(60), listCol.implicitHeight))
            implicitHeight: Layout.preferredHeight
            contentHeight: listCol.implicitHeight
            contentWidth: availableWidth
            clip: true
            ScrollBar.vertical: ChaSetScrollBar {
                barSize: "sm"
            }

            TapHandler {
                onTapped: rootPopup.applyFocus()
            }

            ColumnLayout {
                id: listCol
                width: Math.max(0, scrollView.availableWidth)
                spacing: ThemeTokens.dp(2)

                Repeater {
                    model: rootPopup.displayItems

                    delegate: Rectangle {
                        id: rowDelegate
                        required property var modelData
                        Layout.fillWidth: true
                        Layout.preferredHeight: ThemeTokens.dp(26)
                        implicitHeight: ThemeTokens.dp(26)
                        radius: ThemeTokens.dp(4)

                        readonly property int starsCount: (rowDelegate.modelData && typeof rowDelegate.modelData.stars === "number")
                            ? rowDelegate.modelData.stars : -1
                        readonly property int numericKeyDigit: rootPopup.numericVariant
                            ? rootPopup.numericKeyForItem(rowDelegate.modelData) : -1
                        readonly property string numericKeyText: numericKeyDigit >= 0 ? String(numericKeyDigit) : ""

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
                            text: rowDelegate.starsCount > 0 ? ChaSetI18n.tr("overlays.filterPopup.starsCount", "{{count}} Stars", { count: rowDelegate.starsCount }) : ChaSetI18n.tr("overlays.filterPopup.unrated", "0 Stars (Unrated)")
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

                            ChaSetKbd {
                                visible: rowDelegate.numericKeyText.length > 0
                                text: rowDelegate.numericKeyText
                                size: "xs"
                                variant: "outline"
                                Layout.alignment: Qt.AlignVCenter
                                Layout.preferredHeight: ThemeTokens.dp(18)
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

                // Custom Action Row (when allowCustomInput is enabled and no exact match)
                Rectangle {
                    id: customActionRow
                    visible: rootPopup.showCustomActionItem
                    Layout.fillWidth: true
                    Layout.preferredHeight: ThemeTokens.dp(26)
                    implicitHeight: ThemeTokens.dp(26)
                    radius: ThemeTokens.dp(4)
                    color: customMouse.containsMouse ? Qt.alpha(ThemeTokens.accent, 0.16) : Qt.alpha(ThemeTokens.accent, 0.08)
                    border.color: customMouse.containsMouse ? ThemeTokens.accent : Qt.alpha(ThemeTokens.accent, 0.4)
                    border.width: 1

                    RowLayout {
                        anchors.fill: parent
                        anchors.leftMargin: ThemeTokens.dp(6)
                        anchors.rightMargin: ThemeTokens.dp(6)
                        spacing: ThemeTokens.dp(6)

                        ChaSetIcon {
                            name: "add"
                            size: 14
                            color: ThemeTokens.accent
                        }

                        Text {
                            Layout.fillWidth: true
                            text: rootPopup.displayCustomActionLabel
                            font.pixelSize: Typography.sizeCaption
                            font.bold: true
                            elide: Text.ElideRight
                            color: ThemeTokens.accent
                        }

                        Text {
                            text: "Enter"
                            font.pixelSize: Typography.sizeMicro
                            color: ThemeTokens.subduedText
                        }
                    }

                    MouseArea {
                        id: customMouse
                        anchors.fill: parent
                        hoverEnabled: true
                        cursorShape: Qt.PointingHandCursor
                        acceptedButtons: Qt.LeftButton | Qt.RightButton
                        onClicked: (mouse) => {
                            if (mouse.button === Qt.RightButton) {
                                rootPopup.submitCustomItem("exclude")
                            } else {
                                rootPopup.submitCustomItem("include")
                            }
                        }
                    }
                }

                Text {
                    visible: (!rootPopup.displayItems || rootPopup.displayItems.length === 0) && !rootPopup.showCustomActionItem
                    Layout.fillWidth: true
                    Layout.preferredHeight: ThemeTokens.dp(36)
                    horizontalAlignment: Text.AlignHCenter
                    verticalAlignment: Text.AlignVCenter
                    text: rootPopup.searchFilterText ? rootPopup.noMatchText : rootPopup.emptyText
                    font.pixelSize: Typography.sizeCaption
                    color: ThemeTokens.subduedText
                }
            }
        }

        // Shortcuts Guide Bar
        Rectangle {
            Layout.fillWidth: true
            Layout.preferredHeight: ThemeTokens.dp(32)
            color: "transparent"

            Rectangle {
                anchors.top: parent.top
                width: parent.width
                height: 1
                color: ThemeTokens.border
            }

            ChaSetShortcutBar {
                anchors.fill: parent
                preset: "filter-popup"
                mode: "icon"
                exclude: rootPopup.searchAvailable ? [] : ["search"]
                additionalShortcuts: rootPopup.numericVariant ? [
                    {
                        "id": "digitCycle",
                        "keys": ["0-9"],
                        "label": ChaSetI18n.tr("overlays.filterPopup.digitCycle", "Cycle: include / exclude / off"),
                        "priority": 1
                    }
                ] : []
            }
        }
    }
}
