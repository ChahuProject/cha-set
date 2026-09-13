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
    property bool disabled: false
    property var suggestions: []
    property bool editing: false

    signal navigateRequested(string path)
    signal backRequested()
    signal forwardRequested()
    signal upRequested()
    signal refreshRequested()

    property string editValue: path

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
        editInput.selectAll();
        editInput.forceActiveFocus();
    }

    function commitEdit(targetPath) {
        var trimmed = (targetPath !== undefined ? targetPath : editValue).trim();
        editing = false;
        if (trimmed !== root.path) {
            root.path = trimmed;
            root.navigateRequested(trimmed);
        }
    }

    function cancelEdit() {
        editing = false;
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

                    Keys.onReturnPressed: {
                        root.commitEdit(editInput.text);
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
    }
}
