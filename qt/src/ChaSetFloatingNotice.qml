// ChaSetFloatingNotice.qml — Compact floating notice pill with queue and priority (Qt Quick).
import QtQuick 6.10
import ChaSet

Item {
    id: root

    // ---- Contract ---------------------------------------------------------

    /** Notices list: JS array or ListModel of notice objects. */
    property var notices: []
    /** Placement anchor ('top' | 'bottom'). Default 'top'. */
    property string placement: "top"
    /** Inset from the anchored viewport edge in logical dp. Default 16. */
    property int offset: 16
    /** Fallback lifetime in ms for items that do not state duration. Default 3000. */
    property int defaultDuration: 3000
    /** Suspends countdown and cycling while pointer rests on the notice. Default true. */
    property bool pauseOnHover: true
    /** Mild scale zoom on hover (1.05x). Default true. */
    property bool zoomOnHover: true
    /** Global default for displaying close controls on hover. Default true. */
    property bool closable: true
    /** Custom delegate component for notice content slot. */
    property Component customDelegate: null

    // Outputs
    signal dismissed(string id)
    signal actionTriggered(string id, string actionId)
    signal activeChanged(string id, int index)

    // State
    property int _activeIndex: 0
    property bool _hovered: false
    property var _sorted: []
    property var _budgets: ({})
    property int _revision: 0

    readonly property bool hasNotices: root._sorted.length > 0
    readonly property var activeItem: root.hasNotices && root._activeIndex < root._sorted.length
        ? root._sorted[root._activeIndex] : null

    // ---- Stack geometry: positions are fixed by sorted order, but sizes are
    // driven by DISTANCE from the raised card — the raised card is always the
    // largest (full size) and cards shrink the farther they sit from it. While
    // the stack is hovered, gaps expand so peeking strips stay reachable.
    function expandFactor() {
        return root._hovered ? 1.75 : 1.0;
    }

    function stackGap(depth) {
        if (depth <= 0) return 0;
        return Math.max(ThemeTokens.dp(4), ThemeTokens.dp(14) * Math.pow(0.85, depth - 1));
    }

    function stackOffset(idx) {
        var total = 0;
        for (var d = 1; d <= idx; d++) total += root.stackGap(d);
        return total * root.expandFactor();
    }

    function stackDistance(idx) {
        return Math.abs(idx - root._activeIndex);
    }

    function stackInsetForDistance(dist) {
        var total = 0;
        for (var d = 1; d <= dist; d++) total += Math.max(ThemeTokens.dp(4), ThemeTokens.dp(16) * Math.pow(0.8, d - 1));
        return total;
    }

    function stackScaleForDistance(idx) {
        if (idx === root._activeIndex) return 1.0;
        return Math.max(0.6, 1 - root.stackDistance(idx) * 0.05);
    }

    function stackOpacityForDistance(idx) {
        if (idx === root._activeIndex) return 1.0;
        return Math.max(0.25, 0.85 - root.stackDistance(idx) * 0.15);
    }

    function stackZForDistance(idx) {
        if (idx === root._activeIndex) return 100;
        return (root._sorted.length - root.stackDistance(idx)) * 2 + (idx < root._activeIndex ? 1 : 0);
    }

    function stackMaxOffset() {
        var total = 0;
        var gap = ThemeTokens.dp(14);
        for (var i = 1; i < root._sorted.length; i++) {
            total += gap;
            gap = Math.max(ThemeTokens.dp(4), gap * 0.85);
        }
        return total * root.expandFactor();
    }

    // Geometry (extra peek room for the dispersed stack layers)
    implicitWidth: pill.implicitWidth
    implicitHeight: pill.implicitHeight + root.stackMaxOffset()
    width: implicitWidth
    height: implicitHeight

    // Default anchoring inside parent if parent exists
    anchors.horizontalCenter: parent ? parent.horizontalCenter : undefined
    anchors.top: (parent && root.placement === "top") ? parent.top : undefined
    anchors.bottom: (parent && root.placement === "bottom") ? parent.bottom : undefined
    anchors.topMargin: ThemeTokens.dp(root.offset)
    anchors.bottomMargin: ThemeTokens.dp(root.offset)

    onNoticesChanged: root.sync()
    onDefaultDurationChanged: root.sync()
    on_ActiveIndexChanged: {
        if (root.activeItem) {
            root.activeChanged(String(root.activeItem.id), root._activeIndex);
        }
    }

    // ---- Sorting & Lifetime Management -----------------------------------

    function sync() {
        root.rebuildSorted();
        root.syncBudgets();
        root._revision++;
    }

    function rebuildSorted() {
        var source = root.notices;
        var list = [];
        if (!source) {
            root._sorted = [];
            return;
        }
        var count = (typeof source.count === "number") ? source.count : (source.length || 0);
        for (var i = 0; i < count; i++) {
            var item = (typeof source.get === "function") ? source.get(i) : source[i];
            if (!item) continue;
            var lvl = (item.level !== undefined && item.level !== null) ? String(item.level) : "default";
            var defaultPri = 0;
            if (lvl === "error") defaultPri = 30;
            else if (lvl === "warning") defaultPri = 20;
            else if (lvl === "info") defaultPri = 10;
            var p = (item.priority !== undefined && item.priority !== null) ? Number(item.priority) : defaultPri;
            list.push({ item: item, origIndex: i, priority: p, id: String(item.id) });
        }
        list.sort(function(a, b) {
            if (b.priority !== a.priority) return b.priority - a.priority;
            return a.origIndex - b.origIndex;
        });
        root._sorted = list.map(function(e) { return e.item; });
        if (root._activeIndex >= root._sorted.length) {
            root._activeIndex = Math.max(0, root._sorted.length - 1);
        }
    }

    function syncBudgets() {
        var seen = {};
        for (var i = 0; i < root._sorted.length; i++) {
            var item = root._sorted[i];
            var id = String(item.id);
            seen[id] = true;
            if (!root._budgets.hasOwnProperty(id)) {
                var declared = (item.duration !== undefined && item.duration !== null)
                    ? Number(item.duration) : root.defaultDuration;
                root._budgets[id] = declared > 0 ? declared : 0;
            }
        }
        var known = Object.keys(root._budgets);
        for (var j = 0; j < known.length; j++) {
            if (!seen.hasOwnProperty(known[j])) {
                delete root._budgets[known[j]];
            }
        }
    }

    Timer {
        id: ticker
        interval: 100
        repeat: true
        running: root.hasNotices && (root.pauseOnHover ? !root._hovered : true)
        onTriggered: {
            if (!root.activeItem) return;
            var id = String(root.activeItem.id);
            var remaining = root._budgets[id];
            if (remaining === undefined || remaining <= 0) return;
            remaining -= 100;
            root._budgets[id] = remaining > 0 ? remaining : 0;
            if (remaining <= 0) {
                delete root._budgets[id];
                root.dismissed(id);
            }
        }
    }

    // ---- Visual Appearance Helpers ----------------------------------------

    function levelTone(level) {
        if (level === "error") return "error";
        if (level === "warning") return "warning";
        if (level === "info") return "info";
        return "default";
    }

    function levelColor(lvl) {
        if (lvl === "error") return ThemeTokens.danger;
        if (lvl === "warning") return "#f59e0b";
        if (lvl === "info") return ThemeTokens.accent;
        return ThemeTokens.text;
    }

    function levelIcon(lvl, itemIcon) {
        if (itemIcon) return itemIcon;
        if (lvl === "error") return "x";
        if (lvl === "warning") return "alert-triangle";
        if (lvl === "info") return "check";
        return "info";
    }

    readonly property string currentLevel: root.activeItem
        ? root.levelTone(root.activeItem.level) : "default"

    // ---- Card Stack Surface (raised pill + full-quantity behind stack) -----------

    Item {
        id: stackWrapper
        anchors.fill: parent
        visible: root.hasNotices
        opacity: root.hasNotices ? 1.0 : 0.0

        Behavior on opacity {
            enabled: ThemeTokens.animationsEnabled
            NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
        }

        scale: (root.zoomOnHover && root._hovered) ? 1.05 : 1.0
        transformOrigin: root.placement === "top" ? Item.Top : Item.Bottom

        Behavior on scale {
            enabled: ThemeTokens.animationsEnabled
            NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
        }

        // Keyboard: Enter/Space/Arrows raise the stacked position in place.
        // No default button action exists on the stack, so activation raises.
        activeFocusOnTab: true
        Keys.onPressed: (event) => {
            if (event.key === Qt.Key_Enter || event.key === Qt.Key_Return || event.key === Qt.Key_Space
                    || event.key === Qt.Key_Right || event.key === Qt.Key_Down) {
                if (root._sorted.length > 1) {
                    root._activeIndex = (root._activeIndex + 1) % root._sorted.length;
                    event.accepted = true;
                }
            } else if (event.key === Qt.Key_Left || event.key === Qt.Key_Up) {
                if (root._sorted.length > 1) {
                    root._activeIndex = (root._activeIndex - 1 + root._sorted.length) % root._sorted.length;
                    event.accepted = true;
                }
            }
        }

        HoverHandler {
            id: stackHover
            onHoveredChanged: {
                root._hovered = hovered;
            }
        }

        // Behind stack (full quantity): every non-raised notice keeps its fixed
        // sorted position, sized by distance from the raised card (raised is
        // always the largest). Gaps widen while hovered so peeking strips stay
        // reachable; offsets never depend on which card is raised, so raising
        // causes no motion and the hover target cannot chase away mid-flight.
        Repeater {
            id: stackRepeater
            model: root._sorted.length

            delegate: Rectangle {
                required property int index
                readonly property var stackedItem: root._sorted[index]
                readonly property string stackedLevel: stackedItem ? root.levelTone(stackedItem.level) : "default"
                property color lvlColor: root.levelColor(stackedLevel)

                visible: root.hasNotices && stackedItem !== undefined && index !== root._activeIndex
                width: Math.max(ThemeTokens.dp(80), pill.width - root.stackInsetForDistance(root.stackDistance(index)))
                height: pill.height
                anchors.horizontalCenter: parent.horizontalCenter
                y: root.placement === "top"
                    ? root.stackOffset(index)
                    : Math.max(0, root.stackMaxOffset() - root.stackOffset(index))
                z: root.stackZForDistance(index)
                radius: pill.radius
                scale: root.stackScaleForDistance(index)
                opacity: root.stackOpacityForDistance(index)

                Behavior on y {
                    enabled: ThemeTokens.animationsEnabled
                    NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
                }

                Behavior on scale {
                    enabled: ThemeTokens.animationsEnabled
                    NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                }

                Behavior on opacity {
                    enabled: ThemeTokens.animationsEnabled
                    NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                }

                color: Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.92)
                border.color: Qt.rgba(lvlColor.r, lvlColor.g, lvlColor.b, 0.5)
                border.width: 1

                Row {
                    anchors.centerIn: parent
                    spacing: ThemeTokens.dp(6)

                    ChaSetIcon {
                        anchors.verticalCenter: parent.verticalCenter
                        name: root.levelIcon(stackedLevel, stackedItem ? stackedItem.icon : undefined)
                        size: 16
                        color: root.levelColor(stackedLevel)
                    }

                    Text {
                        text: stackedItem ? (stackedItem.title || "") : ""
                        font.pixelSize: Typography.sizeSmall
                        font.weight: Font.Medium
                        color: ThemeTokens.text
                        anchors.verticalCenter: parent.verticalCenter
                        elide: Text.ElideRight
                        maximumLineCount: 1
                        width: Math.min(implicitWidth, ThemeTokens.dp(200))
                    }

                    Text {
                        visible: text !== ""
                        text: stackedItem ? (stackedItem.description || "") : ""
                        font.pixelSize: Typography.sizeCaption
                        color: ThemeTokens.subduedText
                        elide: Text.ElideMiddle
                        maximumLineCount: 1
                        width: Math.min(implicitWidth, ThemeTokens.dp(160))
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }

                // Hover intent (anti-jitter, mirrors React): while the spread
                // animation is still gliding, delegates slide under a
                // stationary cursor and transient hovers flap between
                // neighbours. Only a rested hover raises the card; taps and
                // keyboard cycling stay immediate.
                HoverHandler {
                    id: intentHover
                    cursorShape: Qt.PointingHandCursor
                    onHoveredChanged: {
                        if (hovered) intentTimer.restart();
                        else intentTimer.stop();
                    }
                }

                Timer {
                    id: intentTimer
                    interval: 150
                    repeat: false
                    onTriggered: {
                        if (intentHover.hovered) root._activeIndex = index;
                    }
                }

                TapHandler {
                    onTapped: {
                        intentTimer.stop();
                        root._activeIndex = index;
                    }
                }
            }
        }

        // Raised pill (full-size, top of the stack, kept at its sorted position).
        Rectangle {
            id: pill

            width: implicitWidth
            height: implicitHeight
            anchors.horizontalCenter: parent.horizontalCenter
            y: root.placement === "top"
                ? root.stackOffset(root._activeIndex)
                : Math.max(0, root.stackMaxOffset() - root.stackOffset(root._activeIndex))
            z: 100

            Behavior on y {
                enabled: ThemeTokens.animationsEnabled
                NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
            }

            implicitWidth: Math.max(ThemeTokens.dp(160), contentRow.implicitWidth + ThemeTokens.dp(24))
            implicitHeight: Math.max(ThemeTokens.dp(36), contentRow.implicitHeight + ThemeTokens.dp(12))
            radius: height / 2

            color: {
                if (root.currentLevel === "error")
                    return Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.95);
                if (root.currentLevel === "warning")
                    return Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.95);
                if (root.currentLevel === "info")
                    return Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.95);
                return Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.92);
            }

            border.color: {
                if (root.currentLevel === "error") return ThemeTokens.danger;
                if (root.currentLevel === "warning") return "#f59e0b";
                if (root.currentLevel === "info") return ThemeTokens.accent;
                return ThemeTokens.border;
            }
            border.width: 1

            Row {
                id: contentRow
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(8)

                // Leading Icon (when using standard item presentation)
                ChaSetIcon {
                    id: noticeIcon
                    anchors.verticalCenter: parent.verticalCenter
                    visible: !contentLoader.item || !root.activeItem || !root.activeItem.customComponent
                    name: root.activeItem ? root.levelIcon(root.currentLevel, root.activeItem.icon) : "info"
                    size: 16
                    color: root.levelColor(root.currentLevel)
                }

                // Notice Content Slot / Loader
                Loader {
                    id: contentLoader
                    anchors.verticalCenter: parent.verticalCenter
                    sourceComponent: {
                        if (root.activeItem && root.activeItem.customComponent)
                            return root.activeItem.customComponent;
                        if (root.customDelegate)
                            return root.customDelegate;
                        return defaultContentComponent;
                    }
                    property var modelData: root.activeItem
                }

                // Close button ('x'): smoothly reveals on hover
                Item {
                    id: closeBtn
                    anchors.verticalCenter: parent.verticalCenter
                    width: ThemeTokens.dp(18)
                    height: ThemeTokens.dp(18)
                    visible: root.closable && root.activeItem && (root.activeItem.closable !== false)
                    opacity: (root._hovered && visible) ? 1.0 : 0.0

                    Behavior on opacity {
                        enabled: ThemeTokens.animationsEnabled
                        NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
                    }

                    Rectangle {
                        anchors.fill: parent
                        radius: width / 2
                        color: closeHover.hovered ? ThemeTokens.hover : "transparent"

                        ChaSetIcon {
                            anchors.centerIn: parent
                            name: "x"
                            size: 14
                            color: closeHover.hovered ? ThemeTokens.text : ThemeTokens.subduedText
                        }
                    }

                    HoverHandler {
                        id: closeHover
                        cursorShape: Qt.PointingHandCursor
                    }

                    TapHandler {
                        onTapped: {
                            if (root.activeItem) {
                                root.dismissed(String(root.activeItem.id));
                            }
                        }
                    }
                }
            }
        }
    }

    // Default Content Slot Component
    Component {
        id: defaultContentComponent
        Row {
            spacing: ThemeTokens.dp(6)
            anchors.verticalCenter: parent ? parent.verticalCenter : undefined

            Text {
                text: root.activeItem ? (root.activeItem.title || "") : ""
                font.pixelSize: Typography.sizeSmall
                font.weight: Font.Medium
                color: ThemeTokens.text
                anchors.verticalCenter: parent.verticalCenter
            }

            Text {
                visible: text !== ""
                text: root.activeItem ? (root.activeItem.description || "") : ""
                font.pixelSize: Typography.sizeCaption
                color: ThemeTokens.subduedText
                elide: Text.ElideMiddle
                maximumLineCount: 1
                width: Math.min(implicitWidth, ThemeTokens.dp(260))
                anchors.verticalCenter: parent.verticalCenter
            }
        }
    }
}
