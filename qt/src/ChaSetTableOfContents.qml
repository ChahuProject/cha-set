// ChaSetTableOfContents.qml — Cross-Stack Hierarchical Outline & Anchor Navigation Component
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root
    width: implicitWidth
    height: implicitHeight
    implicitWidth: ThemeTokens.dp(180)
    implicitHeight: mainCol.implicitHeight + (root.topOffset > 0 ? ThemeTokens.dp(root.topOffset) : 0)

    property var items: []
    property string activeId: ""
    property string title: "ON THIS PAGE"
    property bool showTitle: true
    property bool showTrack: true
    property real topOffset: 0
    property real targetOffset: 0
    property string variant: "default" // "default" | "track" | "flat"
    property string size: "default" // "default" | "sm"
    property bool disabled: false

    signal selectItem(var item)

    property int focusedIndex: -1
    property string modality: "pointer"

    activeFocusOnTab: true

    function flattenItems(rawItems, parentDepth) {
        if (!rawItems || !rawItems.length) return [];
        var res = [];
        var d = parentDepth !== undefined ? parentDepth : 1;
        for (var i = 0; i < rawItems.length; i++) {
            var item = rawItems[i];
            if (!item) continue;
            var depth = (item.level !== undefined && item.level > 0) ? item.level : d;
            var entry = {
                id: item.id ? String(item.id) : "",
                title: item.title ? String(item.title) : "",
                level: depth,
                depth: depth,
                disabled: !!item.disabled,
                targetItem: item.targetItem !== undefined ? item.targetItem : null
            };
            res.push(entry);
            if (item.children && item.children.length > 0) {
                var sub = flattenItems(item.children, depth + 1);
                for (var j = 0; j < sub.length; j++) {
                    res.push(sub[j]);
                }
            }
        }
        return res;
    }

    readonly property var flatItems: root.flattenItems(root.items, 1)

    function selectByIndex(index) {
        if (index < 0 || index >= root.flatItems.length) return;
        var item = root.flatItems[index];
        if (!item || item.disabled || root.disabled) return;
        root.activeId = item.id;
        root.selectItem(item);
    }

    Keys.onPressed: function(event) {
        if (root.disabled || root.flatItems.length === 0) return;

        if (event.key === Qt.Key_Down) {
            root.modality = "keyboard";
            var next = root.focusedIndex + 1;
            while (next < root.flatItems.length && root.flatItems[next].disabled) {
                next++;
            }
            if (next < root.flatItems.length) {
                root.focusedIndex = next;
            }
            event.accepted = true;
        } else if (event.key === Qt.Key_Up) {
            root.modality = "keyboard";
            var prev = root.focusedIndex - 1;
            while (prev >= 0 && root.flatItems[prev].disabled) {
                prev--;
            }
            if (prev >= 0) {
                root.focusedIndex = prev;
            }
            event.accepted = true;
        } else if (event.key === Qt.Key_Home) {
            root.modality = "keyboard";
            for (var h = 0; h < root.flatItems.length; h++) {
                if (!root.flatItems[h].disabled) {
                    root.focusedIndex = h;
                    break;
                }
            }
            event.accepted = true;
        } else if (event.key === Qt.Key_End) {
            root.modality = "keyboard";
            for (var e = root.flatItems.length - 1; e >= 0; e--) {
                if (!root.flatItems[e].disabled) {
                    root.focusedIndex = e;
                    break;
                }
            }
            event.accepted = true;
        } else if (event.key === Qt.Key_Return || event.key === Qt.Key_Space || event.key === Qt.Key_Enter) {
            if (root.focusedIndex >= 0 && root.focusedIndex < root.flatItems.length) {
                root.selectByIndex(root.focusedIndex);
                event.accepted = true;
            }
        }
    }

    Column {
        id: mainCol
        anchors.left: parent.left
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.topMargin: root.topOffset > 0 ? ThemeTokens.dp(root.topOffset) : 0
        spacing: ThemeTokens.dp(12)

        Text {
            id: headerTitle
            visible: root.showTitle && root.title !== ""
            text: root.title
            color: ThemeTokens.subduedText
            font.family: Typography.familySans
            font.pixelSize: Typography.sizeCaption
            font.weight: Typography.weightSemibold
            font.letterSpacing: Typography.trackingPx(Typography.sizeCaption, "wider")
        }

        Item {
            id: trackContainer
            width: mainCol.width
            implicitHeight: itemsCol.implicitHeight

            // Vertical Track Line
            Rectangle {
                id: verticalTrack
                visible: root.showTrack && root.variant !== "flat"
                anchors.left: parent.left
                anchors.top: parent.top
                anchors.bottom: parent.bottom
                width: 1
                color: ThemeTokens.border
                opacity: 0.6
            }

            Column {
                id: itemsCol
                anchors.left: parent.left
                anchors.right: parent.right
                spacing: ThemeTokens.dp(4)

                Repeater {
                    id: repeater
                    model: root.flatItems

                    delegate: Item {
                        id: delegateRoot
                        required property var modelData
                        required property int index
                        width: itemsCol.width
                        implicitHeight: Math.max(ThemeTokens.dp(24), tocLabel.implicitHeight + ThemeTokens.dp(6))

                        readonly property bool isActive: root.activeId === modelData.id
                        readonly property bool isFocused: root.modality === "keyboard" && root.focusedIndex === index
                        readonly property real indentPx: ThemeTokens.dp((modelData.depth - 1) * 12 + 10)

                        // Active Indicator Marker on Vertical Track
                        Rectangle {
                            id: activeMarker
                            visible: delegateRoot.isActive && root.showTrack && root.variant !== "flat"
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            width: 2
                            height: ThemeTokens.dp(14)
                            radius: 1
                            color: ThemeTokens.accent

                            Behavior on opacity {
                                enabled: ThemeTokens.animationsEnabled
                                NumberAnimation {
                                    duration: ThemeTokens.motionQuick
                                    easing.type: ThemeTokens.easeStandard
                                }
                            }
                        }

                        // Focus Ring
                        Rectangle {
                            visible: delegateRoot.isFocused
                            anchors.fill: parent
                            color: "transparent"
                            border.width: 1
                            border.color: ThemeTokens.accent
                            radius: ThemeTokens.dp(4)
                            opacity: 0.5
                        }

                        Text {
                            id: tocLabel
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.leftMargin: delegateRoot.indentPx
                            anchors.verticalCenter: parent.verticalCenter
                            text: modelData.title
                            color: modelData.disabled
                                   ? ThemeTokens.subduedText
                                   : (delegateRoot.isActive
                                      ? ThemeTokens.accent
                                      : (itemMouse.containsMouse ? ThemeTokens.text : ThemeTokens.subduedText))
                            font.family: Typography.familySans
                            font.pixelSize: root.size === "sm" ? Typography.sizeCaption : Typography.sizeSmall
                            font.weight: delegateRoot.isActive ? Typography.weightMedium : Typography.weightRegular
                            opacity: modelData.disabled ? 0.4 : 1.0
                            elide: Text.ElideRight

                            Behavior on color {
                                enabled: ThemeTokens.animationsEnabled
                                ColorAnimation {
                                    duration: ThemeTokens.motionQuick
                                    easing.type: ThemeTokens.easeStandard
                                }
                            }
                        }

                        MouseArea {
                            id: itemMouse
                            anchors.fill: parent
                            hoverEnabled: true
                            enabled: !root.disabled && !modelData.disabled
                            cursorShape: (root.disabled || modelData.disabled) ? Qt.ForbiddenCursor : Qt.PointingHandCursor

                            onPositionChanged: {
                                if (root.modality !== "pointer") {
                                    root.modality = "pointer";
                                }
                            }

                            onClicked: {
                                root.selectByIndex(index);
                            }
                        }
                    }
                }
            }
        }
    }
}
