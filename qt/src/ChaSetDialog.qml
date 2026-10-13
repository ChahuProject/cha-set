// ChaSetDialog.qml — Cross-Stack Modal Dialog Component
// 100% Behavioral and Visual Parity with React Dialog.tsx
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root
    parent: (Window.window && Window.window.contentItem)
            ? Window.window.contentItem
            : ((typeof Overlay !== "undefined" && Overlay.overlay && Overlay.overlay.width > 0)
               ? Overlay.overlay
               : undefined)
    anchors.fill: parent
    z: 200
    color: Qt.rgba(0, 0, 0, 0.6)

    property bool open: false
    property string variant: "default"  // "default" | "alert"
    property string size: "default"     // "sm" | "default" | "lg" | "xl" | "full"
    property string title: ""
    property string description: ""
    property string confirmText: ChaSetI18n.tr("components.dialog.confirmText", "Continue")
    property string cancelText: ChaSetI18n.tr("common.cancel", "Cancel")
    property bool destructive: false
    property string actionVariant: destructive ? "destructive" : "default"
    property int customRadius: 8
    property int dialogWidth: {
        switch (root.size) {
        case "sm": return ThemeTokens.dp(root.variant === "alert" ? 400 : 380)
        case "default": return ThemeTokens.dp(root.variant === "alert" ? 460 : 500)
        case "lg": return ThemeTokens.dp(root.variant === "alert" ? 560 : 680)
        case "xl": return ThemeTokens.dp(840)
        case "full": return Math.min(parent ? (parent.width - ThemeTokens.dp(40)) : ThemeTokens.dp(1100), ThemeTokens.dp(1100))
        default: return ThemeTokens.dp(root.variant === "alert" ? 460 : 500)
        }
    }
    property bool showCloseButton: root.variant !== "alert"
    property bool showEscBadge: false
    property string closeTooltip: ""
    property bool draggable: root.variant !== "alert"
    property bool userDragged: false
    property bool closeOnEscape: true
    property bool closeOnOverlayClick: root.variant !== "alert"
    property Item headerItem: null
    property Component headerComponent: null
    property Item footer: null
    property Component footerComponent: null

    signal opened()
    signal closed()
    signal accepted()
    signal rejected()
    signal confirmed()
    signal cancelled()

    default property alias contentData: bodyContent.data

    opacity: root.open ? 1.0 : 0.0
    visible: opacity > 0.0
    focus: root.open

    Behavior on opacity {
        enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
        NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
    }

    // Registry / Escape contract — see ChaSetOverlayHub. Escape dismisses only the
    // topmost layer, never leaks through to host key bindings.
    function close(reason) {
        if (!root.open) return;
        root.open = false;
        if (reason === "escape") {
            root.cancelled();
            root.rejected();
        }
    }

    onOpenChanged: {
        if (root.open) {
            root.userDragged = false
            resetCardPosition()
            ChaSetOverlayHub.register(root)
            root.forceActiveFocus()
            root.opened()
        } else {
            ChaSetOverlayHub.unregister(root)
            root.closed()
        }
    }

    function resetCardPosition() {
        root.userDragged = false
        if (!root || root.width <= 0 || root.height <= 0) return;
        if (root.draggable && root.userDragged) {
            var minX = ThemeTokens.dp(8);
            var minY = ThemeTokens.dp(8);
            var maxX = Math.max(minX, root.width - card.width - minX);
            var maxY = Math.max(minY, root.height - card.height - minY);
            var targetX = Math.round((root.width - card.width) / 2);
            var targetY = Math.round((root.height - card.height) / 2);
            card.x = Math.max(minX, Math.min(targetX, maxX));
            card.y = Math.max(minY, Math.min(targetY, maxY));
        }
    }

    function clampCardPosition() {
        if (!root || root.width <= 0 || root.height <= 0) return;
        if (!root.draggable || !root.userDragged) return;
        var minX = ThemeTokens.dp(8);
        var minY = ThemeTokens.dp(8);
        var maxX = Math.max(minX, root.width - card.width - minX);
        var maxY = Math.max(minY, root.height - card.height - minY);
        card.x = Math.max(minX, Math.min(card.x, maxX));
        card.y = Math.max(minY, Math.min(card.y, maxY));
    }

    Connections {
        target: root
        function onWidthChanged() { root.clampCardPosition(); }
        function onHeightChanged() { root.clampCardPosition(); }
    }

    onFooterChanged: {
        if (root.footer) {
            root.footer.parent = footerContainer;
            if (root.footer.width <= 0) root.footer.width = Qt.binding(function() { return footerContainer.width; });
        }
    }

    onHeaderItemChanged: {
        if (root.headerItem) {
            root.headerItem.parent = headerContainer;
        }
    }

    Component.onCompleted: {
        if (root.footer) {
            root.footer.parent = footerContainer;
            if (root.footer.width <= 0) root.footer.width = Qt.binding(function() { return footerContainer.width; });
        }
        if (root.headerItem) {
            root.headerItem.parent = headerContainer;
        }
    }

    Shortcut {
        sequence: "Escape"
        autoRepeat: false
        enabled: root.open && root.closeOnEscape && ChaSetOverlayHub.isTop(root)
        onActivated: root.close("escape")
    }

    // Local Keys path: covers the focused dialog and consumers that deliver key semantics
    // programmatically instead of through the shortcut map. When the Shortcut above is
    // enabled it consumes the key, so this handler stays inert and Escape is never
    // double-handled.
    Keys.onEscapePressed: function(event) {
        if (root.closeOnEscape) {
            event.accepted = true
            root.close("escape")
        }
    }

    // Overlay scrim click to dismiss
    MouseArea {
        anchors.fill: parent
        hoverEnabled: true
        acceptedButtons: Qt.AllButtons
        preventStealing: true
        onWheel: (wheel) => { wheel.accepted = true; }
        onClicked: (mouse) => {
            if (mouse.button === Qt.LeftButton && root.closeOnOverlayClick) {
                root.open = false
                root.rejected()
            }
        }
    }

    // Modal Card Container
    ChaSetSquircle {
        id: card
        width: Math.min((parent ? parent.width : ThemeTokens.dp(1000)) - ThemeTokens.dp(40), root.dialogWidth)
        readonly property real maxSafeHeight: Math.max(ThemeTokens.dp(120), (parent ? parent.height : ThemeTokens.dp(800)) - ThemeTokens.dp(40))
        readonly property real headerAreaHeight: headerContainer.visible ? (headerContainer.implicitHeight + ThemeTokens.dp(16)) : 0
        readonly property real footerAreaHeight: footerContainer.visible ? (footerContainer.implicitHeight + ThemeTokens.dp(16)) : (buttonRow.visible ? (buttonRow.implicitHeight + ThemeTokens.dp(20)) : 0)
        readonly property real contentPreferredHeight: headerAreaHeight + footerAreaHeight + bodyContent.implicitHeight + ThemeTokens.dp(40)
        implicitHeight: contentPreferredHeight
        height: Math.min(maxSafeHeight, contentPreferredHeight)
        anchors.horizontalCenter: (!root.draggable || !root.userDragged) ? parent.horizontalCenter : undefined
        anchors.verticalCenter: (!root.draggable || !root.userDragged) ? parent.verticalCenter : undefined
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: ThemeTokens.dp(root.customRadius)
        clip: true
        scale: root.open ? 1.0 : 0.95

        Behavior on scale {
            enabled: ThemeTokens.animationsEnabled && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeEntrance }
        }

        // Intercept clicks, hover and wheel to prevent dismissal & piercing when clicking/moving inside the card
        MouseArea {
            anchors.fill: parent
            z: -1
            hoverEnabled: true
            acceptedButtons: Qt.AllButtons
            preventStealing: true
            onWheel: (wheel) => { wheel.accepted = true; }
            onClicked: {}
        }

        // Dialog Header Container (pinned at top, drag handle confined here)
        Item {
            id: headerContainer
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            readonly property bool hasHeaderContent: !root.headerItem && !root.headerComponent
                                                     && (root.title !== "" || root.description !== "")
            height: {
                if (root.headerItem) return root.headerItem.height + ThemeTokens.dp(20);
                if (headerLoader.item) return headerLoader.item.height + ThemeTokens.dp(20);
                if (hasHeaderContent) return headerCol.implicitHeight + ThemeTokens.dp(20);
                return root.draggable ? ThemeTokens.dp(36) : 0;
            }
            implicitHeight: height
            // 可见性与高度必须只依赖根级属性，严禁读取 headerCol.visible（子的有效可见性）：
            // 弹窗以关闭态创建时整棵树有效不可见，子的 visible 首次求值即为 false 并
            // 烤进本绑定；打开后子的有效可见性因本项不可见依旧为 false，无任何依赖
            // 变化触发重算 → 有效可见性死锁。alert 变体（draggable=false）首当其冲：
            // 标题/描述区域永久隐藏，卡片塌陷成只剩按钮行。
            visible: root.draggable || !!root.headerItem || !!root.headerComponent
                     || hasHeaderContent

            DragHandler {
                id: headerDragHandler
                enabled: root.draggable
                target: card
                xAxis.minimum: ThemeTokens.dp(8)
                xAxis.maximum: Math.max(ThemeTokens.dp(8), root.width - card.width - ThemeTokens.dp(8))
                yAxis.minimum: ThemeTokens.dp(8)
                yAxis.maximum: Math.max(ThemeTokens.dp(8), root.height - card.height - ThemeTokens.dp(8))
                onActiveChanged: {
                    if (active) {
                        var curX = card.x
                        var curY = card.y
                        root.userDragged = true
                        card.x = curX
                        card.y = curY
                    }
                }
            }

            HoverHandler {
                enabled: root.draggable
                cursorShape: Qt.SizeAllCursor
            }

            Loader {
                id: headerLoader
                anchors.fill: parent
                anchors.topMargin: ThemeTokens.dp(20)
                anchors.leftMargin: ThemeTokens.dp(20)
                anchors.rightMargin: ThemeTokens.dp(20)
                visible: !root.headerItem && root.headerComponent !== null
                sourceComponent: root.headerComponent
            }

            // Dialog Header (pinned at top)
            Column {
                id: headerCol
                anchors.top: parent.top
                anchors.topMargin: ThemeTokens.dp(20)
                anchors.left: parent.left
                anchors.leftMargin: ThemeTokens.dp(20)
                anchors.right: parent.right
                anchors.rightMargin: ThemeTokens.dp(20)
                spacing: ThemeTokens.dp(6)
                visible: !root.headerItem && !root.headerComponent && (root.title !== "" || root.description !== "")

                Row {
                    width: parent.width
                    spacing: ThemeTokens.dp(8)

                    HoverHandler {
                        enabled: root.draggable
                        cursorShape: Qt.SizeAllCursor
                    }

                    TextEdit {
                        id: titleText
                        width: parent.width - (headerActions.width + (headerActions.visible ? ThemeTokens.dp(8) : 0))
                        text: root.title
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeHeading
                        font.weight: Font.Bold
                        height: contentHeight
                        readOnly: true
                        selectByMouse: true
                        selectByKeyboard: true
                        cursorVisible: false
                        activeFocusOnPress: true
                        textMargin: 0
                        padding: 0
                        selectionColor: ThemeTokens.accent
                        selectedTextColor: "#ffffff"
                        anchors.verticalCenter: parent.verticalCenter

                        HoverHandler {
                            cursorShape: Qt.IBeamCursor
                        }

                        onSelectedTextChanged: {
                            if (selectedText.length > 0) SelectionHub.claim(titleText);
                            else if (SelectionHub.activeOwner === titleText) SelectionHub.clear(titleText);
                        }

                        Keys.onPressed: function(event) {
                            if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
                                SelectionHub.copyActiveSelection();
                                event.accepted = true;
                            }
                        }

                        TapHandler {
                            acceptedButtons: Qt.RightButton
                            onTapped: function(eventPoint) {
                                var scenePos = eventPoint.scenePosition;
                                SelectionHub.showContextMenu(scenePos.x, scenePos.y, titleText);
                            }
                        }
                    }

                    Row {
                        id: headerActions
                        spacing: ThemeTokens.dp(6)
                        anchors.verticalCenter: parent.verticalCenter

                        Rectangle {
                            id: escBadge
                            visible: root.showEscBadge
                            width: ThemeTokens.dp(32)
                            height: ThemeTokens.dp(20)
                            radius: ThemeTokens.dp(4)
                            color: ThemeTokens.panelRaised
                            border.color: ThemeTokens.border
                            border.width: 1
                            anchors.verticalCenter: parent.verticalCenter

                            Text {
                                anchors.centerIn: parent
                                text: "ESC"
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeMicro
                                font.weight: Font.DemiBold
                            }
                        }

                        ChaSetTooltip {
                            id: closeBtnTooltip
                            visible: root.showCloseButton
                            text: root.closeTooltip.length > 0 ? root.closeTooltip : ChaSetI18n.tr("common.close", "Close")
                            shortcut: "Esc"
                            side: "bottom"
                            anchors.verticalCenter: parent.verticalCenter

                            ChaSetButton {
                                id: closeBtn
                                width: ThemeTokens.dp(28)
                                height: ThemeTokens.dp(28)
                                size: "icon"
                                variant: "ghost"
                                icon: "x"
                                onClicked: {
                                    root.open = false
                                    root.rejected()
                                }
                            }
                        }
                    }
                }

                TextEdit {
                    id: descText
                    width: parent.width
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeBody
                    wrapMode: TextEdit.WordWrap
                    height: contentHeight
                    visible: text !== ""
                    readOnly: true
                    selectByMouse: true
                    selectByKeyboard: true
                    cursorVisible: false
                    activeFocusOnPress: true
                    textMargin: 0
                    padding: 0
                    selectionColor: ThemeTokens.accent
                    selectedTextColor: "#ffffff"

                    HoverHandler {
                        cursorShape: Qt.IBeamCursor
                    }

                    onSelectedTextChanged: {
                        if (selectedText.length > 0) SelectionHub.claim(descText);
                        else if (SelectionHub.activeOwner === descText) SelectionHub.clear(descText);
                    }

                    Keys.onPressed: function(event) {
                        if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
                            SelectionHub.copyActiveSelection();
                            event.accepted = true;
                        }
                    }

                    TapHandler {
                        acceptedButtons: Qt.RightButton
                        onTapped: function(eventPoint) {
                            var scenePos = eventPoint.scenePosition;
                            SelectionHub.showContextMenu(scenePos.x, scenePos.y, descText);
                        }
                    }
                }
            }
        }

        // Action Buttons Row (pinned at bottom for alert variant)
        Row {
            id: buttonRow
            anchors.bottom: parent.bottom
            anchors.bottomMargin: ThemeTokens.dp(20)
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(20)
            spacing: ThemeTokens.dp(8)
            visible: root.variant === "alert" && !root.footer && !root.footerComponent

            ChaSetButton {
                text: root.cancelText
                variant: "outline"
                size: "sm"
                onClicked: root.cancel()
            }

            ChaSetButton {
                text: root.confirmText
                variant: root.actionVariant
                size: "sm"
                onClicked: root.confirm()
            }
        }

        // Dialog Body Content Area (Flickable + ChaSetScrollBar)
        Flickable {
            id: bodyFlickable
            anchors.top: headerContainer.visible ? headerContainer.bottom : parent.top
            anchors.topMargin: headerContainer.visible ? ThemeTokens.dp(16) : ThemeTokens.dp(20)
            anchors.bottom: footerContainer.visible ? footerContainer.top : (buttonRow.visible ? buttonRow.top : parent.bottom)
            anchors.bottomMargin: (footerContainer.visible || buttonRow.visible) ? ThemeTokens.dp(16) : ThemeTokens.dp(20)
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(2)
            contentWidth: width
            contentHeight: bodyContent.implicitHeight
            clip: true
            boundsBehavior: Flickable.StopAtBounds

            ScrollBar.vertical: ChaSetScrollBar {
                policy: ScrollBar.AsNeeded
            }

            Column {
                id: bodyContent
                x: ThemeTokens.dp(20)
                width: Math.max(0, bodyFlickable.width - ThemeTokens.dp(40))
                spacing: ThemeTokens.dp(14)
            }
        }

        // Dialog Footer Container (pinned at bottom)
        Item {
            id: footerContainer
            anchors.bottom: parent.bottom
            anchors.bottomMargin: visible ? ThemeTokens.dp(20) : 0
            anchors.left: parent.left
            anchors.leftMargin: ThemeTokens.dp(20)
            anchors.right: parent.right
            anchors.rightMargin: ThemeTokens.dp(20)
            visible: (root.footer !== null && root.footer !== undefined) || (root.footerComponent !== null && footerLoader.item !== null)
            height: visible ? (root.footer ? (root.footer.implicitHeight > 0 ? root.footer.implicitHeight : root.footer.height) : (footerLoader.item ? (footerLoader.item.implicitHeight > 0 ? footerLoader.item.implicitHeight : footerLoader.item.height) : 0)) : 0
            implicitHeight: height

            Loader {
                id: footerLoader
                anchors.fill: parent
                visible: !root.footer && root.footerComponent !== null
                sourceComponent: root.footerComponent
            }
        }
    }

    function openDialog() {
        root.open = true
    }

    function closeDialog() {
        root.open = false
    }

    function accept() {
        root.open = false
        root.accepted()
        root.confirmed()
    }

    function reject() {
        root.open = false
        root.rejected()
        root.cancelled()
    }

    function confirm() {
        root.open = false
        root.confirmed()
        root.accepted()
    }

    function cancel() {
        root.open = false
        root.cancelled()
        root.rejected()
    }
}
