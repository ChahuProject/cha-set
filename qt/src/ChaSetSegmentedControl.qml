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
    property bool equalWidth: false
    property real itemWidth: 0

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

    FontMetrics {
        id: textFontMetrics
        font.pixelSize: root.itemFontSize
        font.bold: true
    }

    FontMetrics {
        id: badgeFontMetrics
        font.pixelSize: Math.max(8, root.itemFontSize - 2)
        font.bold: true
    }

    function calculateItemContentWidth(opt) {
        if (!opt) return 40;
        var pad = root.size === "sm" ? 16 : (root.size === "lg" ? 24 : 20);
        var label = opt.label !== undefined ? String(opt.label) : "";
        var w = textFontMetrics.advanceWidth(label) + pad;
        if (opt.icon !== undefined && String(opt.icon).length > 0) {
            w += (root.itemFontSize + 4);
        }
        if (opt.badge !== undefined && String(opt.badge).length > 0) {
            w += (badgeFontMetrics.advanceWidth(String(opt.badge)) + 12);
        }
        return Math.ceil(w);
    }

    readonly property var naturalWidths: {
        var arr = [];
        if (!options || options.length === 0) return arr;
        for (var i = 0; i < options.length; i++) {
            arr.push(calculateItemContentWidth(options[i]));
        }
        return arr;
    }

    readonly property real totalNaturalWidth: {
        var sum = 0;
        for (var i = 0; i < naturalWidths.length; i++) {
            sum += naturalWidths[i];
        }
        return sum;
    }

    function getItemWidth(idx) {
        if (idx < 0 || !options || idx >= options.length) return 0;
        if (root.itemWidth > 0) {
            return root.itemWidth;
        }
        if (root.equalWidth || root.fullWidth) {
            var totalSpacing = (options.length - 1) * track.segSpacing;
            return Math.max(20, (track.width - 6 - totalSpacing) / options.length);
        }
        return naturalWidths[idx] || 40;
    }

    function getItemX(idx) {
        if (idx <= 0) return 3;
        var x = 3;
        for (var i = 0; i < idx; i++) {
            x += getItemWidth(i) + track.segSpacing;
        }
        return x;
    }

    implicitHeight: effectiveHeight
    implicitWidth: {
        var base = hasTitle ? titleWidth : 0;
        if (root.fullWidth) return parent ? parent.width : 200;
        if (root.itemWidth > 0) {
            return base + 6 + (options.length * root.itemWidth) + ((options.length - 1) * track.segSpacing);
        }
        if (root.equalWidth) {
            var maxW = 40;
            for (var i = 0; i < naturalWidths.length; i++) {
                if (naturalWidths[i] > maxW) maxW = naturalWidths[i];
            }
            return base + 6 + (options.length * maxW) + ((options.length - 1) * track.segSpacing);
        }
        var totalSpacing = options.length > 1 ? (options.length - 1) * track.segSpacing : 0;
        return base + 6 + totalNaturalWidth + totalSpacing;
    }
    width: implicitWidth
    height: implicitHeight

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

        // Sliding indicator pill
        Rectangle {
            id: indicator
            readonly property int selIdx: root.getSelectedIndex()
            visible: selIdx >= 0
            y: (track.height - root.itemHeight) / 2
            x: selIdx >= 0 ? root.getItemX(selIdx) : 0
            width: selIdx >= 0 ? root.getItemWidth(selIdx) : 0
            height: root.itemHeight
            radius: root.itemRadius
            color: ThemeTokens.dark ? ThemeTokens.panel : "#ffffff"
            border.color: ThemeTokens.border
            border.width: 1

            Behavior on x {
                enabled: ThemeTokens.animationsEnabled
                NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
            }
            Behavior on width {
                enabled: ThemeTokens.animationsEnabled
                NumberAnimation { duration: 180; easing.type: Easing.OutCubic }
            }
        }

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

                x: root.getItemX(index)
                y: (track.height - root.itemHeight) / 2
                width: root.getItemWidth(index)
                height: root.itemHeight
                radius: root.itemRadius
                clip: true

                color: {
                    if (isHighlighted && !isSelected) {
                        return ThemeTokens.dark ? Qt.rgba(255, 255, 255, 0.08) : Qt.rgba(0, 0, 0, 0.05);
                    }
                    return "transparent";
                }

                border.color: "transparent"
                border.width: 0

                Behavior on color { ColorAnimation { duration: ThemeTokens.motionQuick } }

                Row {
                    anchors.centerIn: parent
                    spacing: 4

                    Text {
                        id: iconItem
                        visible: modelData && modelData.icon !== undefined && String(modelData.icon).length > 0
                        anchors.verticalCenter: parent.verticalCenter
                        text: modelData && modelData.icon ? String(modelData.icon) : ""
                        font.pixelSize: root.itemFontSize
                        color: segItem.isSelected ? ThemeTokens.text : ThemeTokens.subduedText
                    }

                    Text {
                        id: labelItem
                        anchors.verticalCenter: parent.verticalCenter
                        text: modelData && modelData.label ? String(modelData.label) : ""
                        font.pixelSize: root.itemFontSize
                        font.bold: segItem.isSelected
                        elide: Text.ElideRight
                        width: {
                            var avail = segItem.width - 12;
                            if (iconItem.visible) avail -= (iconItem.implicitWidth + 4);
                            if (badgeItem.visible) avail -= (badgeItem.width + 4);
                            return Math.max(10, Math.min(implicitWidth, avail));
                        }
                        color: {
                            if (segItem.isItemDisabled) return ThemeTokens.subduedText;
                            if (segItem.isSelected) return ThemeTokens.text;
                            if (segItem.isHighlighted) return ThemeTokens.text;
                            return ThemeTokens.subduedText;
                        }
                    }

                    Rectangle {
                        id: badgeItem
                        visible: modelData && modelData.badge !== undefined && String(modelData.badge).length > 0
                        anchors.verticalCenter: parent.verticalCenter
                        radius: 8
                        height: root.itemFontSize + 2
                        width: badgeText.implicitWidth + 8
                        color: segItem.isSelected ? Qt.rgba(14/255, 165/255, 233/255, 0.15) : Qt.rgba(100/255, 116/255, 139/255, 0.15)

                        Text {
                            id: badgeText
                            anchors.centerIn: parent
                            text: modelData && modelData.badge !== undefined ? String(modelData.badge) : ""
                            font.pixelSize: root.itemFontSize - 2
                            font.bold: true
                            color: segItem.isSelected ? ThemeTokens.accent : ThemeTokens.subduedText
                        }
                    }
                }

                MouseArea {
                    id: mouseArea
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: segItem.isItemDisabled ? Qt.ForbiddenCursor : Qt.PointingHandCursor
                    acceptedButtons: Qt.LeftButton

                    property real lastX: 0
                    property real lastY: 0

                    onPositionChanged: function(mouse) {
                        if (segItem.isItemDisabled) return;
                        if (Math.abs(mouse.x - lastX) > 1 || Math.abs(mouse.y - lastY) > 1) {
                            root.modality = "pointer";
                            root.highlightedIndex = index;
                            lastX = mouse.x;
                            lastY = mouse.y;
                        }
                    }

                    onClicked: {
                        if (segItem.isItemDisabled) return;
                        root.modality = "pointer";
                        root.highlightedIndex = index;
                        root.selectIndex(index);
                    }
                }
            }
        }
    }
}
