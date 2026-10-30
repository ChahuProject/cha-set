// ChaSetKeybindingManager.qml — Cross-Stack Keybinding & Shortcut Manager Component
// 100% Feature & API Parity with React KeybindingManager.tsx
import QtQuick
import QtQuick.Controls
import ChaSet

FocusScope {
    id: root

    property var actions: []
    property var scopes: []
    property var sections: []
    property bool searchable: true
    property bool allowMultiChord: true
    property bool allowExportCheatSheet: true
    property bool allowResetAll: true
    property bool showSourceBadge: true
    property bool showScopeBadge: true
    property string layout: "grouped-list" // "grouped-list" | "flat-table"
    property bool disabled: false

    signal bindingChanged(string actionId, int chordIndex, string newKey)
    signal actionResetRequested(string actionId)
    signal resetAllRequested()
    signal exportCheatSheetRequested(string markdown)

    implicitWidth: ThemeTokens.dp(640)
    implicitHeight: ThemeTokens.dp(520)
    width: parent ? parent.width : implicitWidth
    height: parent ? parent.height : implicitHeight
    opacity: root.disabled ? 0.5 : 1.0

    // Filter states
    property string searchQuery: ""
    property string scopeFilterId: "all"
    property string sameChordFilter: ""

    // Conflict popup state
    property var activeConflictAction: null
    property string activeConflictChord: ""
    property var activeConflictOccupiers: []

    // Helper: is action modified from default
    function isActionModified(act) {
        if (!act) return false;
        var chords = act.chords || [];
        for (var i = 0; i < chords.length; i++) {
            if (chords[i] && chords[i].isUserModified) return true;
        }
        var curKeys = [];
        for (var j = 0; j < chords.length; j++) {
            if (chords[j] && chords[j].keyString && !chords[j].isMasked) {
                curKeys.push(chords[j].keyString);
            }
        }
        var defKeys = (act.defaultChords || []).slice();
        curKeys.sort();
        defKeys.sort();
        return curKeys.join("|") !== defKeys.join("|");
    }

    // Helper: find scope name
    function getScopeName(scId) {
        if (!scId) return "Global";
        for (var i = 0; i < scopes.length; i++) {
            if (scopes[i] && scopes[i].id === scId) return scopes[i].name;
        }
        return scId;
    }

    // Helper: find section name
    function getSectionName(secId) {
        if (!secId) return (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.defaultSection", "General Actions") : "General Actions";
        for (var i = 0; i < sections.length; i++) {
            if (sections[i] && sections[i].id === secId) return sections[i].name;
        }
        return secId;
    }

    // Computed conflicts map: "scope:lowercaseChord" -> [actionId]
    readonly property var conflictLookup: {
        var map = {};
        for (var i = 0; i < root.actions.length; i++) {
            var act = root.actions[i];
            if (!act) continue;
            var sc = act.scopeId || "global";
            var chs = act.chords || [];
            for (var j = 0; j < chs.length; j++) {
                var c = chs[j];
                if (!c || !c.keyString || c.isMasked) continue;
                var k = sc + ":" + c.keyString.trim().toLowerCase();
                if (!map[k]) map[k] = [];
                if (map[k].indexOf(act.id) < 0) map[k].push(act.id);
            }
        }
        return map;
    }

    function actionHasConflict(act) {
        if (!act) return false;
        if (act.hasConflict) return true;
        var sc = act.scopeId || "global";
        var chs = act.chords || [];
        for (var i = 0; i < chs.length; i++) {
            var c = chs[i];
            if (!c || !c.keyString || c.isMasked) continue;
            var k = sc + ":" + c.keyString.trim().toLowerCase();
            if (conflictLookup[k] && conflictLookup[k].length > 1) return true;
        }
        return false;
    }

    function openConflictDialog(act) {
        if (!act) return;
        var sc = act.scopeId || "global";
        var chs = act.chords || [];
        var confChord = "";
        var occList = [];

        for (var i = 0; i < chs.length; i++) {
            var c = chs[i];
            if (!c || !c.keyString || c.isMasked) continue;
            var k = sc + ":" + c.keyString.trim().toLowerCase();
            var ids = conflictLookup[k] || [];
            if (ids.length > 1) {
                confChord = c.keyString;
                for (var j = 0; j < ids.length; j++) {
                    var targetAct = null;
                    for (var m = 0; m < root.actions.length; m++) {
                        if (root.actions[m].id === ids[j]) { targetAct = root.actions[m]; break; }
                    }
                    occList.push({
                        actionId: ids[j],
                        actionName: targetAct ? targetAct.name : ids[j],
                        isResolver: ids[j] === act.id
                    });
                }
                break;
            }
        }

        root.activeConflictAction = act;
        root.activeConflictChord = confChord || (chs[0] ? chs[0].keyString : "");
        root.activeConflictOccupiers = occList;
        conflictPopup.open = true;
    }

    // Filtered flattened list model for ListView
    // Elements: { type: "header", sectionId, name } | { type: "item", action }
    readonly property var visibleModel: {
        var q = root.searchQuery.trim().toLowerCase();
        var isReverse = q.indexOf("+") >= 0 || /^(ctrl|alt|shift|meta|cmd|win)/.test(q);

        var filtered = [];
        for (var i = 0; i < root.actions.length; i++) {
            var a = root.actions[i];
            if (!a) continue;

            if (root.scopeFilterId !== "all" && a.scopeId !== root.scopeFilterId) continue;

            if (root.sameChordFilter !== "") {
                var chs = a.chords || [];
                var matchSame = false;
                for (var k = 0; k < chs.length; k++) {
                    if (chs[k] && !chs[k].isMasked && chs[k].keyString && chs[k].keyString.toLowerCase() === root.sameChordFilter.toLowerCase()) {
                        matchSame = true;
                        break;
                    }
                }
                if (!matchSame) continue;
            }

            if (q !== "") {
                if (isReverse) {
                    var chs2 = a.chords || [];
                    var matchRev = false;
                    for (var r = 0; r < chs2.length; r++) {
                        if (chs2[r] && !chs2[r].isMasked && chs2[r].keyString && chs2[r].keyString.toLowerCase().indexOf(q) >= 0) {
                            matchRev = true;
                            break;
                        }
                    }
                    if (!matchRev) continue;
                } else {
                    var nameMatch = a.name && a.name.toLowerCase().indexOf(q) >= 0;
                    var idMatch = a.id && a.id.toLowerCase().indexOf(q) >= 0;
                    var descMatch = a.description && a.description.toLowerCase().indexOf(q) >= 0;
                    if (!nameMatch && !idMatch && !descMatch) continue;
                }
            }

            filtered.push(a);
        }

        if (root.layout === "flat-table") {
            var flat = [];
            for (var f = 0; f < filtered.length; f++) {
                flat.push({ type: "item", action: filtered[f] });
            }
            return flat;
        }

        // Group by section
        var secOrder = [];
        for (var s = 0; s < root.sections.length; s++) {
            secOrder.push(root.sections[s].id);
        }
        if (secOrder.indexOf("common") < 0) secOrder.push("common");

        var secBuckets = {};
        for (var b = 0; b < filtered.length; b++) {
            var item = filtered[b];
            var sid = item.sectionId || "common";
            if (!secBuckets[sid]) secBuckets[sid] = [];
            secBuckets[sid].push(item);
            if (secOrder.indexOf(sid) < 0) secOrder.push(sid);
        }

        var out = [];
        for (var ord = 0; ord < secOrder.length; ord++) {
            var currentSec = secOrder[ord];
            var items = secBuckets[currentSec] || [];
            if (items.length === 0) continue;

            out.push({ type: "header", sectionId: currentSec, name: root.getSectionName(currentSec) });
            for (var it = 0; it < items.length; it++) {
                out.push({ type: "item", action: items[it] });
            }
        }
        return out;
    }

    function exportCheatSheet() {
        var md = "# Keyboard Shortcuts Reference\n\n";
        var acts = root.actions || [];
        for (var i = 0; i < acts.length; i++) {
            var a = acts[i];
            if (!a) continue;
            var chs = a.chords || [];
            var keys = [];
            for (var j = 0; j < chs.length; j++) {
                if (chs[j] && !chs[j].isMasked && chs[j].keyString) keys.push("`" + chs[j].keyString + "`");
            }
            md += "- **" + a.name + "**: " + (keys.join(" / ") || "*(None)*") + " (" + (a.description || "") + ")\n";
        }
        root.exportCheatSheetRequested(md);
    }

    // Outer Container Card
    Rectangle {
        id: containerRect
        anchors.fill: parent
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        radius: ThemeTokens.dp(10)
        clip: true

        Column {
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(16)
            spacing: ThemeTokens.dp(14)

            // Top Header: Search bar + Scope Selector + Action Buttons
            Item {
                id: topBar
                width: parent.width
                height: ThemeTokens.dp(34)

                Row {
                    anchors.left: parent.left
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: ThemeTokens.dp(8)

                    // Search input
                    ChaSetInput {
                        id: searchBox
                        visible: root.searchable
                        width: ThemeTokens.dp(220)
                        icon: "search"
                        placeholderText: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.searchPlaceholder", "Search actions or keys (e.g. Ctrl+)...") : "Search actions or keys..."
                        clearable: true
                        text: root.searchQuery
                        onTextChanged: {
                            if (root.searchQuery !== text) root.searchQuery = text;
                        }
                    }

                    // Scope filter buttons / pill
                    Rectangle {
                        visible: root.scopes.length > 0
                        height: ThemeTokens.dp(30)
                        width: scopeLabelText.implicitWidth + ThemeTokens.dp(18)
                        radius: ThemeTokens.dp(6)
                        color: root.scopeFilterId === "all" ? ThemeTokens.panelRaised : ThemeTokens.hover
                        border.color: ThemeTokens.border
                        border.width: 1

                        Text {
                            id: scopeLabelText
                            anchors.centerIn: parent
                            text: root.scopeFilterId === "all"
                                  ? ((typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.allScopes", "All Scopes") : "All Scopes")
                                  : root.getScopeName(root.scopeFilterId)
                            color: ThemeTokens.text
                            font.pixelSize: Typography.sizeSmall
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                // Cycle through scopes
                                if (root.scopeFilterId === "all" && root.scopes.length > 0) {
                                    root.scopeFilterId = root.scopes[0].id;
                                } else {
                                    var currIdx = -1;
                                    for (var s = 0; s < root.scopes.length; s++) {
                                        if (root.scopes[s].id === root.scopeFilterId) { currIdx = s; break; }
                                    }
                                    if (currIdx >= 0 && currIdx < root.scopes.length - 1) {
                                        root.scopeFilterId = root.scopes[currIdx + 1].id;
                                    } else {
                                        root.scopeFilterId = "all";
                                    }
                                }
                            }
                        }
                    }

                    // Same-chord filter chip
                    Rectangle {
                        visible: root.sameChordFilter !== ""
                        height: ThemeTokens.dp(26)
                        width: sameText.implicitWidth + sameClearBtn.width + ThemeTokens.dp(16)
                        radius: ThemeTokens.dp(13)
                        color: ThemeTokens.panelRaised
                        border.color: ThemeTokens.border
                        border.width: 1

                        Row {
                            anchors.centerIn: parent
                            spacing: ThemeTokens.dp(4)

                            Text {
                                id: sameText
                                text: ((typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.sameChord", "Same Chord:") : "Same:") + " " + root.sameChordFilter
                                color: ThemeTokens.accent
                                font.pixelSize: Typography.sizeCaption
                                font.family: Typography.familyMono
                                font.bold: true
                                anchors.verticalCenter: parent.verticalCenter
                            }

                            ChaSetButton {
                                id: sameClearBtn
                                icon: "x"
                                variant: "ghost"
                                size: "icon-xs"
                                height: ThemeTokens.dp(18)
                                width: ThemeTokens.dp(18)
                                anchors.verticalCenter: parent.verticalCenter
                                onClicked: root.sameChordFilter = ""
                            }
                        }
                    }
                }

                Row {
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: ThemeTokens.dp(8)

                    // Export Sheet button
                    ChaSetButton {
                        visible: root.allowExportCheatSheet
                        icon: "download"
                        text: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.export", "Export Sheet") : "Export Sheet"
                        variant: "outline"
                        size: "sm"
                        height: ThemeTokens.dp(30)
                        onClicked: root.exportCheatSheet()
                    }

                    // Reset All button
                    ChaSetButton {
                        visible: root.allowResetAll
                        icon: "rotate-ccw"
                        text: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.resetAll", "Reset All") : "Reset All"
                        variant: "outline"
                        size: "sm"
                        height: ThemeTokens.dp(30)
                        onClicked: root.resetAllRequested()
                    }
                }
            }

            // Scrollable Action List
            ListView {
                id: actionListView
                width: parent.width
                height: parent.height - topBar.height - parent.spacing
                clip: true
                boundsBehavior: Flickable.StopAtBounds
                model: root.visibleModel
                spacing: ThemeTokens.dp(4)
                ScrollBar.vertical: ChaSetScrollBar {}

                delegate: Item {
                    id: delegateRoot
                    required property var modelData
                    required property int index

                    readonly property bool isHeader: modelData && modelData.type === "header"
                    readonly property var actionData: modelData && modelData.type === "item" ? modelData.action : null
                    readonly property bool hasConflict: actionData ? root.actionHasConflict(actionData) : false
                    readonly property bool isModified: actionData ? root.isActionModified(actionData) : false

                    width: actionListView.width
                    height: isHeader ? ThemeTokens.dp(32) : ThemeTokens.dp(56)

                    // Section Header
                    Rectangle {
                        visible: delegateRoot.isHeader
                        anchors.fill: parent
                        color: "transparent"

                        Row {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            spacing: ThemeTokens.dp(8)

                            Text {
                                text: delegateRoot.isHeader ? delegateRoot.modelData.name : ""
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                                font.bold: true
                                anchors.verticalCenter: parent.verticalCenter
                            }

                            Rectangle {
                                height: 1
                                width: parent.width - ThemeTokens.dp(120)
                                color: ThemeTokens.border
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                    }

                    // Action Card (ChaSetSquircle · Continuous curvature)
                    ChaSetSquircle {
                        visible: !delegateRoot.isHeader && delegateRoot.actionData !== null
                        anchors.fill: parent
                        radius: ThemeTokens.dp(8)
                        color: delegateRoot.hasConflict ? Qt.alpha(ThemeTokens.conflict, 0.08) : ThemeTokens.panel
                        border.color: delegateRoot.hasConflict ? ThemeTokens.conflict : ThemeTokens.border
                        border.width: 1

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: ThemeTokens.dp(12)
                            anchors.rightMargin: ThemeTokens.dp(12)
                            spacing: ThemeTokens.dp(12)

                            // Left: Action Name & Description
                            Column {
                                id: titleCol
                                width: ThemeTokens.dp(200)
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: ThemeTokens.dp(2)

                                Text {
                                    width: parent.width
                                    text: delegateRoot.actionData ? delegateRoot.actionData.name : ""
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.bold: true
                                    elide: Text.ElideRight
                                }

                                Text {
                                    width: parent.width
                                    text: delegateRoot.actionData ? (delegateRoot.actionData.description || "") : ""
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: Typography.sizeCaption
                                    elide: Text.ElideRight
                                }
                            }

                            // Middle: Shortcut Capsules
                            Row {
                                id: chordsRow
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: ThemeTokens.dp(6)
                                width: parent.width - titleCol.width - badgeCol.width - parent.spacing * 2

                                readonly property var chordList: (delegateRoot.actionData && delegateRoot.actionData.chords) ? delegateRoot.actionData.chords : []

                                Repeater {
                                    model: chordsRow.chordList.length > 0 ? chordsRow.chordList : 1

                                    delegate: ChaSetKeybindingRecorder {
                                        required property var modelData
                                        required property int index

                                        width: ThemeTokens.dp(150)
                                        size: "sm"
                                        keybinding: (typeof modelData === "object" && modelData !== null) ? modelData.keyString : ""
                                        placeholder: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.unassigned", "Unassigned") : "Unassigned"
                                        clearable: true
                                        disabled: delegateRoot.actionData ? delegateRoot.actionData.disabled : false

                                        onKeybindingRecorded: function(newKey) {
                                            if (delegateRoot.actionData) {
                                                root.bindingChanged(delegateRoot.actionData.id, index, newKey);
                                            }
                                        }
                                    }
                                }

                                // Alternative chord add button
                                ChaSetButton {
                                    visible: root.allowMultiChord && chordsRow.chordList.length === 1 && (!delegateRoot.actionData || !delegateRoot.actionData.disabled)
                                    icon: "plus"
                                    variant: "ghost"
                                    size: "icon-xs"
                                    height: ThemeTokens.dp(26)
                                    width: ThemeTokens.dp(26)
                                    anchors.verticalCenter: parent.verticalCenter
                                    onClicked: {
                                        if (delegateRoot.actionData) {
                                            root.bindingChanged(delegateRoot.actionData.id, chordsRow.chordList.length, "");
                                        }
                                    }
                                }
                            }

                            // Right: Badges & Reset Action
                            Row {
                                id: badgeCol
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: ThemeTokens.dp(6)

                                // Scope Badge
                                Rectangle {
                                    visible: root.showScopeBadge
                                    height: ThemeTokens.dp(20)
                                    width: scopeText.implicitWidth + ThemeTokens.dp(10)
                                    radius: ThemeTokens.dp(4)
                                    color: ThemeTokens.panelRaised
                                    border.color: ThemeTokens.border
                                    border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter

                                    Text {
                                        id: scopeText
                                        anchors.centerIn: parent
                                        text: delegateRoot.actionData ? root.getScopeName(delegateRoot.actionData.scopeId) : ""
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                    }
                                }

                                // User / Built-in Badge
                                Rectangle {
                                    visible: root.showSourceBadge
                                    height: ThemeTokens.dp(20)
                                    width: sourceText.implicitWidth + ThemeTokens.dp(10)
                                    radius: ThemeTokens.dp(4)
                                    color: delegateRoot.isModified ? Qt.alpha(ThemeTokens.accent, 0.12) : ThemeTokens.panelRaised
                                    border.color: delegateRoot.isModified ? ThemeTokens.accent : ThemeTokens.border
                                    border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter

                                    Text {
                                        id: sourceText
                                        anchors.centerIn: parent
                                        text: delegateRoot.isModified
                                              ? ((typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.userModified", "User") : "User")
                                              : ((typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.defaultSource", "Built-in") : "Built-in")
                                        color: delegateRoot.isModified ? ThemeTokens.accent : ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                        font.bold: delegateRoot.isModified
                                    }
                                }

                                // Conflict Button
                                Rectangle {
                                    visible: delegateRoot.hasConflict
                                    height: ThemeTokens.dp(22)
                                    width: confText.implicitWidth + ThemeTokens.dp(14)
                                    radius: ThemeTokens.dp(11)
                                    color: Qt.alpha(ThemeTokens.conflict, 0.16)
                                    border.color: ThemeTokens.conflict
                                    border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter

                                    Row {
                                        anchors.centerIn: parent
                                        spacing: ThemeTokens.dp(3)
                                        ChaSetIcon {
                                            name: "alert-triangle"
                                            size: 12
                                            color: ThemeTokens.conflict
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        Text {
                                            id: confText
                                            text: (typeof ChaSetI18n !== "undefined" && ChaSetI18n.tr) ? ChaSetI18n.tr("components.keybindingManager.conflict", "Conflict") : "Conflict"
                                            color: ThemeTokens.conflict
                                            font.pixelSize: Typography.sizeCaption
                                            font.bold: true
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                    }

                                    MouseArea {
                                        anchors.fill: parent
                                        cursorShape: Qt.PointingHandCursor
                                        onClicked: {
                                            if (delegateRoot.actionData) {
                                                root.openConflictDialog(delegateRoot.actionData);
                                            }
                                        }
                                    }
                                }

                                // Action Reset Button
                                ChaSetButton {
                                    visible: delegateRoot.isModified && (!delegateRoot.actionData || !delegateRoot.actionData.disabled)
                                    icon: "rotate-ccw"
                                    variant: "ghost"
                                    size: "icon-xs"
                                    height: ThemeTokens.dp(24)
                                    width: ThemeTokens.dp(24)
                                    anchors.verticalCenter: parent.verticalCenter
                                    onClicked: {
                                        if (delegateRoot.actionData) {
                                            root.actionResetRequested(delegateRoot.actionData.id);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Modal Conflict Resolver Popup
    ChaSetKeybindingConflictPopup {
        id: conflictPopup
        chord: root.activeConflictChord
        occupiers: root.activeConflictOccupiers
        onCloseRequested: conflictPopup.open = false
    }
}
