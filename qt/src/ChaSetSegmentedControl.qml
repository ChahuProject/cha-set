// ChaSetSegmentedControl.qml — Cross-Stack Pill Segmented Control
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Item {
    id: root

    property var options: []
    property var value: undefined
    property string size: "default" // "sm" | "default" | "lg"
    property string title: ""
    property bool disabled: false
    property bool fullWidth: false

    signal valueSelected(var val)

    readonly property bool hasTitle: root.title.length > 0
    readonly property real titleWidth: hasTitle ? (titleLabel.implicitWidth + 8) : 0
    readonly property real availableWidth: Math.max(0, root.width - titleWidth)

    readonly property int effectiveHeight: {
        switch (root.size) {
        case "sm": return 22;
        case "lg": return 36;
        default:   return 28;
        }
    }

    readonly property int itemHeight: {
        switch (root.size) {
        case "sm": return 18;
        case "lg": return 30;
        default:   return 22;
        }
    }

    readonly property int itemFontSize: {
        switch (root.size) {
        case "sm": return 11;
        case "lg": return 13;
        default:   return 12;
        }
    }

    readonly property int controlRadius: {
        switch (root.size) {
        case "sm": return 5;
        case "lg": return 8;
        default:   return 6;
        }
    }

    readonly property int itemRadius: controlRadius - 1

    implicitHeight: effectiveHeight
    implicitWidth: {
        var base = hasTitle ? titleWidth : 0;
        if (root.fullWidth) return parent ? parent.width : 200;
        return base + (options.length * 60) + 8;
    }

    opacity: root.disabled ? 0.5 : 1.0
    activeFocusOnTab: !root.disabled

    property string modality: "pointer"
    property int highlightedIndex: -1

    function getSelectedIndex() {
        if (!options || options.length === 0 || root.value === undefined) return -1;
        for (var i = 0; i < options.length; i++) {
            if (options[i] && options[i].value === root.value) return i;
        }
        return -1;
    }

    function selectIndex(idx) {
        if (root.disabled) return;
        if (idx >= 0 && idx < options.length) {
            var opt = options[idx];
            if (opt && !opt.disabled) {
                root.value = opt.value;
                root.valueSelected(opt.value);
            }
        }
    }

    Keys.onLeftPressed: function(event) {
        event.accepted = true;
        root.modality = "keyboard";
        var cur = root.highlightedIndex >= 0 ? root.highlightedIndex : getSelectedIndex();
        var next = cur <= 0 ? options.length - 1 : cur - 1;
        root.highlightedIndex = next;
        root.selectIndex(next);
    }

    Keys.onRightPressed: function(event) {
        event.accepted = true;
        root.modality = "keyboard";
        var cur = root.highlightedIndex >= 0 ? root.highlightedIndex : getSelectedIndex();
        var next = (cur + 1) % Math.max(1, options.length);
        root.highlightedIndex = next;
        root.selectIndex(next);
    }

    Keys.onSpacePressed: function(event) {
        event.accepted = true;
        if (root.highlightedIndex >= 0) root.selectIndex(root.highlightedIndex);
    }

    Keys.onReturnPressed: function(event) {
        event.accepted = true;
        if (root.highlightedIndex >= 0) root.selectIndex(root.highlightedIndex);
    }

    Keys.onPressed: function(event) {
        if (event.key === Qt.Key_Home) {
            event.accepted = true;
            root.modality = "keyboard";
            root.highlightedIndex = 0;
            root.selectIndex(0);
        } else if (event.key === Qt.Key_End) {
            event.accepted = true;
            root.modality = "keyboard";
            var last = Math.max(0, options.length - 1);
            root.highlightedIndex = last;
            root.selectIndex(last);
        }
    }

    Text {
        id: titleLabel
        visible: root.hasTitle
        anchors.left: parent.left
        anchors.verticalCenter: parent.verticalCenter
        text: root.title
        color: ThemeTokens.subduedText
        font.pixelSize: root.itemFontSize
    }

    Rectangle {
        id: track
        anchors.left: root.hasTitle ? titleLabel.right : parent.left
        anchors.leftMargin: root.hasTitle ? 6 : 0
        anchors.right: parent.right
        anchors.top: parent.top
        anchors.bottom: parent.bottom

        radius: root.controlRadius
        color: ThemeTokens.dark ? Qt.rgba(30/255, 41/255, 59/255, 0.6) : Qt.rgba(241/255, 245/255, 249/255, 1.0)
        border.color: root.activeFocus ? ThemeTokens.accent : ThemeTokens.border
        border.width: 1

        readonly property real segSpacing: 2
        readonly property real segWidth: root.options.length > 0
            ? (track.width - 6 - (root.options.length - 1) * segSpacing) / root.options.length
            : 0

        Repeater {
            model: root.options
            delegate: Rectangle {
                id: segItem
                required property int index
                required property var modelData

                property bool isSelected: root.value !== undefined && modelData && modelData.value === root.value
                property bool isItemDisabled: root.disabled || (modelData && modelData.disabled === true)
                property bool isHighlighted: root.modality === "keyboard"
                    ? (root.highlightedIndex === index)
                    : (mouseArea.containsMouse && !isItemDisabled)

                x: 3 + index * (track.segWidth + track.segSpacing)
                y: (track.height - root.itemHeight) / 2
                width: track.segWidth
                height: root.itemHeight
                radius: root.itemRadius

                color: {
                    if (isSelected) {
                        return ThemeTokens.dark ? ThemeTokens.panel : "#ffffff";
                    }
                    if (isHighlighted) {
                        return ThemeTokens.dark ? Qt.rgba(255, 255, 255, 0.08) : Qt.rgba(0, 0, 0, 0.05);
                    }
                    return "transparent";
                }

                border.color: isSelected ? ThemeTokens.border : "transparent"
                border.width: isSelected ? 1 : 0

                Behavior on color { ColorAnimation { duration: 100 } }

                Text {
                    anchors.centerIn: parent
                    text: modelData && modelData.label ? String(modelData.label) : ""
                    font.pixelSize: root.itemFontSize
                    font.bold: segItem.isSelected
                    color: {
                        if (segItem.isItemDisabled) return ThemeTokens.subduedText;
                        if (segItem.isSelected) return ThemeTokens.text;
                        if (segItem.isHighlighted) return ThemeTokens.text;
                        return ThemeTokens.subduedText;
                    }
                }

                MouseArea {
                    id: mouseArea
                    anchors.fill: parent
                    hoverEnabled: !segItem.isItemDisabled
                    cursorShape: segItem.isItemDisabled ? Qt.ArrowCursor : Qt.PointingHandCursor
                    acceptedButtons: Qt.LeftButton

                    property real lastX: 0
                    property real lastY: 0

                    onPositionChanged: function(mouse) {
                        if (Math.abs(mouse.x - lastX) > 1 || Math.abs(mouse.y - lastY) > 1) {
                            root.modality = "pointer";
                            root.highlightedIndex = index;
                            lastX = mouse.x;
                            lastY = mouse.y;
                        }
                    }

                    onClicked: {
                        root.modality = "pointer";
                        root.highlightedIndex = index;
                        root.selectIndex(index);
                    }
                }
            }
        }
    }
}
