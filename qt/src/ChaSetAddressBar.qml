// ChaSet AddressBar for Qt (QML), implementing the API contract from
// spec/components/address-bar.ts and capabilities in spec/capabilities.json.
// Explorer and browser-style navigation bar with interactive breadcrumbs and inline path editing.
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

Item {
    id: root

    // API Contract
    property string path: ""
    property bool canGoBack: false
    property bool canGoForward: false
    property bool showNavButtons: true
    property bool showRefresh: true
    property bool showSearch: false
    property string searchQuery: ""
    property string searchPlaceholder: qsTr("搜索...")
    property bool disabled: false
    property var suggestions: []
    property bool editing: false
    property int highlightedIndex: -1

    signal navigateRequested(string path)
    signal backRequested()
    signal forwardRequested()
    signal upRequested()
    signal refreshRequested()
    signal searchRequested(string query)

    property string editValue: path

    readonly property var filteredSuggestions: {
        if (!root.suggestions || !root.suggestions.length) return [];
        if (!root.editValue) return root.suggestions;
        var lower = root.editValue.toLowerCase();
        var result = [];
        for (var i = 0; i < root.suggestions.length; i++) {
            var item = String(root.suggestions[i]);
            if (item.toLowerCase().indexOf(lower) >= 0) {
                result.push(item);
            }
        }
        return result;
    }

    onPathChanged: {
        if (!editing) {
            editValue = path;
        }
    }

    function parseSegments(rawPath) {
        if (!rawPath) return [];
        var normalized = String(rawPath).replace(/\\/g, "/");

        // Windows drive: C:/ or C:/foo/bar
        var winMatch = normalized.match(/^([a-zA-Z]:)(?:\/(.*))?$/);
        if (winMatch) {
            var drive = winMatch[1];
            var rest = winMatch[2] || "";
            var segments = [{ label: drive, path: drive + "/" }];
            if (rest) {
                var parts = rest.split("/").filter(function(p) { return p.length > 0; });
                var accum = drive + "/";
                for (var i = 0; i < parts.length; i++) {
                    accum = accum + (accum.endsWith("/") ? "" : "/") + parts[i];
                    segments.push({ label: parts[i], path: accum });
                }
            }
            return segments;
        }

        // POSIX path: /home/user or /
        if (normalized.startsWith("/")) {
            var pParts = normalized.split("/").filter(function(p) { return p.length > 0; });
            var pSegments = [{ label: "/", path: "/" }];
            var pAccum = "";
            for (var j = 0; j < pParts.length; j++) {
                pAccum = pAccum + "/" + pParts[j];
                pSegments.push({ label: pParts[j], path: pAccum });
            }
            return pSegments;
        }

        // Relative path
        var rParts = normalized.split("/").filter(function(p) { return p.length > 0; });
        var rSegments = [];
        var rAccum = "";
        for (var k = 0; k < rParts.length; k++) {
            rAccum = rAccum ? (rAccum + "/" + rParts[k]) : rParts[k];
            rSegments.push({ label: rParts[k], path: rAccum });
        }
        return rSegments;
    }

    function getParent(rawPath) {
        if (!rawPath) return "";
        var normalized = String(rawPath).replace(/\\/g, "/").replace(/\/+$/, "");
        var lastSlash = normalized.lastIndexOf("/");
        if (lastSlash < 0) return "";
        if (lastSlash === 2 && normalized.charAt(1) === ":") {
            return normalized.slice(0, 3);
        }
        if (lastSlash === 0) return "/";
        return normalized.slice(0, lastSlash);
    }

    function startEditing() {
        if (disabled) return;
        editing = true;
        editValue = path;
        highlightedIndex = -1;
        editInput.selectAll();
        editInput.forceActiveFocus();
    }

    function commitEdit(targetPath) {
        var trimmed = (targetPath !== undefined ? targetPath : editValue).trim();
        editing = false;
        highlightedIndex = -1;
        if (trimmed !== root.path) {
            root.path = trimmed;
            root.navigateRequested(trimmed);
        }
    }

    function cancelEdit() {
        editing = false;
        highlightedIndex = -1;
        editValue = path;
    }

    function navigateUp() {
        if (disabled) return;
        var p = getParent(path);
        if (p) {
            root.path = p;
            root.upRequested();
            root.navigateRequested(p);
        }
    }

    // Geometry binding
    implicitWidth: 500
    implicitHeight: 36
    width: implicitWidth
    height: implicitHeight

    opacity: disabled ? 0.6 : 1.0

    // Background panel
    Rectangle {
        id: bgPanel
        anchors.fill: parent
        radius: 6
        color: root.editing ? ThemeTokens.panel : ThemeTokens.panelRaised
        border.width: 1
        border.color: root.editing ? ThemeTokens.accent : ThemeTokens.border

        Behavior on color {
            enabled: ThemeTokens.animationsEnabled
            ColorAnimation { duration: ThemeTokens.motionQuick }
        }
    }

    RowLayout {
        anchors.fill: parent
        anchors.leftMargin: 4
        anchors.rightMargin: 4
        spacing: 2

        // Back Button
        Rectangle {
            id: backBtn
            visible: root.showNavButtons
            Layout.preferredWidth: 26
            Layout.preferredHeight: 26
            radius: 4
            color: backHover.hovered && root.canGoBack && !root.disabled ? ThemeTokens.hover : "transparent"
            opacity: (root.canGoBack && !root.disabled) ? 1.0 : 0.35

            Text {
                anchors.centerIn: parent
                text: "←"
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeBody
                font.weight: Typography.weightBold
            }

            HoverHandler {
                id: backHover
                cursorShape: (root.canGoBack && !root.disabled) ? Qt.PointingHandCursor : Qt.ForbiddenCursor
            }

            TapHandler {
                enabled: root.canGoBack && !root.disabled
                onTapped: root.backRequested()
            }
        }

        // Forward Button
        Rectangle {
            id: forwardBtn
            visible: root.showNavButtons
            Layout.preferredWidth: 26
            Layout.preferredHeight: 26
            radius: 4
            color: forwardHover.hovered && root.canGoForward && !root.disabled ? ThemeTokens.hover : "transparent"
            opacity: (root.canGoForward && !root.disabled) ? 1.0 : 0.35

            Text {
                anchors.centerIn: parent
                text: "→"
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeBody
                font.weight: Typography.weightBold
            }

            HoverHandler {
                id: forwardHover
                cursorShape: (root.canGoForward && !root.disabled) ? Qt.PointingHandCursor : Qt.ForbiddenCursor
            }

            TapHandler {
                enabled: root.canGoForward && !root.disabled
                onTapped: root.forwardRequested()
            }
        }

        // Up Button
        Rectangle {
            id: upBtn
            visible: root.showNavButtons
            Layout.preferredWidth: 26
            Layout.preferredHeight: 26
            radius: 4
            readonly property bool canUp: Boolean(root.path && root.path !== "/" && !root.path.match(/^[a-zA-Z]:[/\\]?$/))
            color: upHover.hovered && canUp && !root.disabled ? ThemeTokens.hover : "transparent"
            opacity: (canUp && !root.disabled) ? 1.0 : 0.35

            Text {
                anchors.centerIn: parent
                text: "↑"
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeBody
                font.weight: Typography.weightBold
            }

            HoverHandler {
                id: upHover
                cursorShape: (upBtn.canUp && !root.disabled) ? Qt.PointingHandCursor : Qt.ForbiddenCursor
            }

            TapHandler {
                enabled: upBtn.canUp && !root.disabled
                onTapped: root.navigateUp()
            }
        }

        // Refresh Button
        Rectangle {
            id: refreshBtn
            visible: root.showNavButtons && root.showRefresh
            Layout.preferredWidth: 26
            Layout.preferredHeight: 26
            radius: 4
            color: refreshHover.hovered && !root.disabled ? ThemeTokens.hover : "transparent"
            opacity: !root.disabled ? 1.0 : 0.35

            Text {
                anchors.centerIn: parent
                text: "⟳"
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeBody
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
            visible: root.showNavButtons
            Layout.preferredWidth: 1
            Layout.preferredHeight: 16
            Layout.leftMargin: 2
            Layout.rightMargin: 4
            color: ThemeTokens.border
        }

        // Central Path & Breadcrumb Area
        Item {
            id: pathArea
            Layout.fillWidth: true
            Layout.fillHeight: true

            // Breadcrumbs Mode
            Row {
                id: breadcrumbsRow
                visible: !root.editing
                anchors.fill: parent
                anchors.leftMargin: 4
                anchors.rightMargin: 4
                spacing: 2

                Repeater {
                    model: root.parseSegments(root.path)
                    delegate: Row {
                        id: segRow
                        required property var modelData
                        required property int index
                        spacing: 2
                        anchors.verticalCenter: parent.verticalCenter

                        Rectangle {
                            id: segPill
                            height: 24
                            width: segText.implicitWidth + 10
                            radius: 4
                            color: segHover.hovered && !root.disabled ? ThemeTokens.hover : "transparent"

                            Text {
                                id: segText
                                anchors.centerIn: parent
                                text: segRow.modelData.label
                                color: (segRow.index === root.parseSegments(root.path).length - 1) ? ThemeTokens.text : ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                                font.weight: (segRow.index === root.parseSegments(root.path).length - 1) ? Typography.weightSemibold : Typography.weightRegular
                            }

                            HoverHandler {
                                id: segHover
                                cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ArrowCursor
                            }

                            TapHandler {
                                enabled: !root.disabled
                                onTapped: {
                                    root.path = segRow.modelData.path;
                                    root.navigateRequested(segRow.modelData.path);
                                }
                            }
                        }

                        Text {
                            visible: segRow.index < root.parseSegments(root.path).length - 1
                            text: "›"
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeSmall
                            anchors.verticalCenter: parent.verticalCenter
                        }
                    }
                }
            }

            // Click empty space in breadcrumb area to enter edit mode
            TapHandler {
                enabled: !root.editing && !root.disabled
                onTapped: root.startEditing()
            }

            // Edit Mode Input Field
            Item {
                visible: root.editing
                anchors.fill: parent
                anchors.leftMargin: 6
                anchors.rightMargin: 6

                TextInput {
                    id: editInput
                    anchors.fill: parent
                    verticalAlignment: TextInput.AlignVCenter
                    text: root.editValue
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                    color: ThemeTokens.text
                    selectionColor: ThemeTokens.accent
                    selectedTextColor: ThemeTokens.text
                    selectByMouse: true

                    onTextChanged: {
                        root.editValue = text;
                    }

                    Keys.onDownPressed: {
                        if (root.filteredSuggestions.length > 0) {
                            root.highlightedIndex = Math.min(root.filteredSuggestions.length - 1, root.highlightedIndex + 1);
                        }
                    }

                    Keys.onUpPressed: {
                        if (root.filteredSuggestions.length > 0) {
                            root.highlightedIndex = Math.max(-1, root.highlightedIndex - 1);
                        }
                    }

                    Keys.onReturnPressed: {
                        if (root.highlightedIndex >= 0 && root.highlightedIndex < root.filteredSuggestions.length) {
                            root.commitEdit(root.filteredSuggestions[root.highlightedIndex]);
                        } else {
                            root.commitEdit(editInput.text);
                        }
                    }

                    Keys.onEscapePressed: {
                        root.cancelEdit();
                    }

                    HoverHandler {
                        cursorShape: Qt.IBeamCursor
                    }
                }
            }
        }

        // Search Input Box
        Rectangle {
            id: searchBox
            visible: root.showSearch
            Layout.preferredWidth: 140
            Layout.preferredHeight: 26
            Layout.alignment: Qt.AlignVCenter
            radius: 4
            color: searchInput.activeFocus ? ThemeTokens.panel : ThemeTokens.panelRaised
            border.width: 1
            border.color: searchInput.activeFocus ? ThemeTokens.accent : ThemeTokens.border

            RowLayout {
                anchors.fill: parent
                anchors.leftMargin: 6
                anchors.rightMargin: 6
                spacing: 4

                Text {
                    text: "⌕"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                TextInput {
                    id: searchInput
                    Layout.fillWidth: true
                    verticalAlignment: TextInput.AlignVCenter
                    text: root.searchQuery
                    font.pixelSize: Typography.sizeSmall
                    color: ThemeTokens.text
                    selectionColor: ThemeTokens.accent
                    selectedTextColor: ThemeTokens.text
                    selectByMouse: true

                    Text {
                        anchors.fill: parent
                        verticalAlignment: Text.AlignVCenter
                        text: root.searchPlaceholder
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                        visible: !searchInput.text && !searchInput.activeFocus
                    }

                    onTextChanged: {
                        root.searchQuery = text;
                        root.searchRequested(text);
                    }

                    Keys.onReturnPressed: {
                        root.searchRequested(root.searchQuery);
                    }
                }

                // Clear button
                Rectangle {
                    visible: root.searchQuery.length > 0
                    Layout.preferredWidth: 16
                    Layout.preferredHeight: 16
                    radius: 8
                    color: clearHover.hovered ? ThemeTokens.hover : "transparent"

                    Text {
                        anchors.centerIn: parent
                        text: "✕"
                        font.pixelSize: Typography.sizeMicro
                        color: ThemeTokens.subduedText
                    }

                    HoverHandler {
                        id: clearHover
                        cursorShape: Qt.PointingHandCursor
                    }

                    TapHandler {
                        onTapped: {
                            searchInput.text = "";
                            root.searchQuery = "";
                            root.searchRequested("");
                        }
                    }
                }
            }
        }
    }

    // Suggestions Popover
    Rectangle {
        id: suggestionsDropdown
        visible: root.editing && root.filteredSuggestions.length > 0
        z: 999
        anchors.top: parent.bottom
        anchors.topMargin: 4
        anchors.left: parent.left
        anchors.right: parent.right
        implicitHeight: Math.min(sugCol.implicitHeight + 8, 200)
        height: implicitHeight
        radius: 6
        color: ThemeTokens.panelRaised
        border.width: 1
        border.color: ThemeTokens.border
        clip: true

        Flickable {
            anchors.fill: parent
            anchors.margins: 4
            contentWidth: width
            contentHeight: sugCol.implicitHeight
            clip: true

            Column {
                id: sugCol
                width: parent.width
                spacing: 2

                Repeater {
                    model: root.filteredSuggestions
                    delegate: Rectangle {
                        id: sugRow
                        required property var modelData
                        required property int index

                        width: sugCol.width
                        height: 28
                        radius: 4
                        color: (root.highlightedIndex === index || sugRowHover.hovered)
                               ? ThemeTokens.hover : "transparent"

                        Text {
                            anchors.fill: parent
                            anchors.leftMargin: 8
                            anchors.rightMargin: 8
                            verticalAlignment: Text.AlignVCenter
                            text: sugRow.modelData
                            color: ThemeTokens.text
                            font.pixelSize: Typography.sizeSmall
                            font.family: Typography.familyMono
                            elide: Text.ElideMiddle
                        }

                        HoverHandler {
                            id: sugRowHover
                            cursorShape: Qt.PointingHandCursor
                            onHoveredChanged: {
                                if (hovered) root.highlightedIndex = sugRow.index;
                            }
                        }

                        TapHandler {
                            onTapped: {
                                root.commitEdit(sugRow.modelData);
                            }
                        }
                    }
                }
            }
        }
    }

    Shortcut {
        sequence: "Alt+D"
        enabled: !root.disabled
        onActivated: root.startEditing()
    }

    Shortcut {
        sequence: "Ctrl+L"
        enabled: !root.disabled
        onActivated: root.startEditing()
    }
}
