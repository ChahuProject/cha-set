// ChaSetTable.qml — Cross-Stack Table Component for Qt Quick
// Pixel-Perfect & Behavioral Parity with React Table.tsx
import QtQuick
import QtQuick.Controls
import ChaSet

Rectangle {
    id: root

    property var columns: []
    property var rows: []
    property string caption: ""
    property int headerHeight: 36
    property int rowHeight: 36
    property int selectedIndex: -1
    property int customRadius: 8
    property color customBorderColor: ThemeTokens.border
    property bool interactive: true

    signal rowClicked(int index, var rowData)

    readonly property int effectiveHeaderHeight: ThemeTokens.dp(headerHeight)
    readonly property int effectiveRowHeight: ThemeTokens.dp(rowHeight)
    readonly property int effectiveRadius: ThemeTokens.dp(customRadius)

    readonly property bool isDark: ThemeTokens.dark
    readonly property color cBg: ThemeTokens.panel
    readonly property color cBorder: customBorderColor
    // Header strip = React `bg-muted/50`. Scale the token's own alpha instead of
    // passing a literal: hover is an alpha-carrying token (0.06 light / 0.09 dark),
    // and Qt.rgba(r, g, b, <literal>) would discard it and paint an opaque band
    // that flips to near-white in dark mode.
    readonly property color cHeaderBg: Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, ThemeTokens.hover.a * 0.5)
    readonly property color cText: ThemeTokens.text
    readonly property color cSubduedText: ThemeTokens.subduedText
    readonly property color cHover: ThemeTokens.hover
    readonly property color cSelection: ThemeTokens.selection

    implicitWidth: ThemeTokens.dp(600)
    implicitHeight: mainLayout.implicitHeight + 2
    height: implicitHeight

    radius: effectiveRadius
    border.color: cBorder
    border.width: 1
    color: cBg
    clip: true

    TextMetrics {
        id: monoMetrics
        font.family: Typography.familyMono
        font.pixelSize: Typography.sizeSmall
        font.weight: Typography.weightMedium
    }

    TextMetrics {
        id: sansMetrics
        font.family: Typography.familySans
        font.pixelSize: Typography.sizeSmall
        font.weight: Typography.weightRegular
    }

    function isFlexCol(col) {
        if (!col) return true;
        if (col.wrap) return true;
        return (col.width === undefined || Number(col.width) <= 0);
    }

    function getColContentWidth(index) {
        if (!columns || index < 0 || index >= columns.length) return 0;
        var col = columns[index];
        if (!col) return 0;
        if (col.wrap) {
            return (col.width !== undefined && Number(col.width) > 0)
                ? ThemeTokens.dp(Number(col.width))
                : ThemeTokens.dp(160);
        }
        var maxWidth = (col.width !== undefined && Number(col.width) > 0)
            ? ThemeTokens.dp(Number(col.width))
            : ThemeTokens.dp(80);

        if (col.title) {
            sansMetrics.font.weight = Typography.weightSemibold;
            sansMetrics.text = String(col.title);
            var hWidth = sansMetrics.width + ThemeTokens.dp(28);
            if (hWidth > maxWidth) maxWidth = hWidth;
        }

        if (rows && rows.length > 0) {
            var isMono = Boolean(col.code || col.copyableBadge || col.kbd);
            for (var r = 0; r < rows.length; ++r) {
                var rowRecord = rows[r];
                if (!rowRecord || col.key === undefined) continue;
                var val = rowRecord[col.key];
                if (val === undefined || val === null) continue;
                var strVal = String(val);
                if (strVal === "" || strVal === "—") continue;

                var cellW = 0;
                if (isMono) {
                    monoMetrics.text = strVal;
                    // mono text width + 12dp badge padding + 24dp cell margins/padding
                    cellW = monoMetrics.width + ThemeTokens.dp(38);
                } else {
                    sansMetrics.font.weight = Typography.weightRegular;
                    sansMetrics.text = strVal;
                    cellW = sansMetrics.width + ThemeTokens.dp(28);
                }
                if (cellW > maxWidth) {
                    maxWidth = cellW;
                }
            }
        }
        return Math.ceil(maxWidth);
    }

    property var _colWidths: []

    readonly property real availableTableWidth: Math.max(0, root.width - 2)

    function updateColWidths() {
        if (!columns || columns.length === 0) {
            _colWidths = [];
            return;
        }
        var fixedTotal = 0;
        var flexCount = 0;
        var widths = [];
        for (var i = 0; i < columns.length; ++i) {
            var col = columns[i];
            if (isFlexCol(col)) {
                flexCount++;
                widths.push(0);
            } else {
                var w = getColContentWidth(i);
                widths.push(w);
                fixedTotal += w;
            }
        }
        var minFlexW = ThemeTokens.dp(160);
        var baseW = Math.max(0, root.width - 2);
        var avail = Math.max(baseW, fixedTotal + flexCount * minFlexW);
        var remainingForFlex = avail - fixedTotal;
        var flexColWidth = flexCount > 0 ? Math.max(minFlexW, remainingForFlex / flexCount) : 0;
        for (var j = 0; j < columns.length; ++j) {
            if (isFlexCol(columns[j])) {
                widths[j] = Math.ceil(flexColWidth);
            }
        }
        // If content fits within available width, adjust the last flex column
        // so the sum of column widths exactly equals availableTableWidth (zero fake overflow).
        if (flexCount > 0 && avail === baseW) {
            var currentSum = 0;
            var lastFlexIdx = -1;
            for (var k = 0; k < widths.length; ++k) {
                currentSum += widths[k];
                if (isFlexCol(columns[k])) lastFlexIdx = k;
            }
            if (lastFlexIdx >= 0 && currentSum !== baseW) {
                widths[lastFlexIdx] += (baseW - currentSum);
            }
        }
        _colWidths = widths;
    }

    onColumnsChanged: updateColWidths()
    onRowsChanged: updateColWidths()
    onWidthChanged: updateColWidths()
    onAvailableTableWidthChanged: updateColWidths()
    Component.onCompleted: updateColWidths()

    Connections {
        target: ThemeTokens
        function onUiScaleChanged() { root.updateColWidths(); }
    }

    readonly property real tableContentWidth: {
        var baseW = Math.max(0, root.width - 2);
        if (!_colWidths || _colWidths.length === 0) return baseW;
        var sum = 0;
        for (var i = 0; i < _colWidths.length; ++i) {
            sum += _colWidths[i];
        }
        return Math.max(baseW, sum);
    }

    function resolveParentScrollArea() {
        var p = root.parent;
        while (p) {
            if (p.flickableItem && typeof p.handleVerticalWheel === "function") {
                return p;
            }
            if (typeof p.handleVerticalWheel === "function") {
                return p;
            }
            if (p.scrollToY !== undefined && typeof p.handleVerticalWheel === "function") {
                return p;
            }
            if (p.flickableDirection !== undefined && p.contentY !== undefined && p.contentHeight !== undefined) {
                return p;
            }
            p = p.parent;
        }
        return null;
    }

    function getColWidth(index, totalWidth) {
        if (_colWidths && index >= 0 && index < _colWidths.length && _colWidths[index] > 0) {
            return _colWidths[index];
        }
        if (!columns || columns.length === 0) return totalWidth;
        var col = columns[index];
        if (col && col.width !== undefined && Number(col.width) > 0) {
            return ThemeTokens.dp(Number(col.width));
        }
        return ThemeTokens.dp(80);
    }

    function getAlignment(alignStr) {
        if (alignStr === "center") return Text.AlignHCenter;
        if (alignStr === "right") return Text.AlignRight;
        return Text.AlignLeft;
    }

    Flickable {
        id: flickable
        anchors.fill: parent
        anchors.margins: 1
        contentWidth: mainLayout.width
        contentHeight: mainLayout.height
        clip: true
        boundsBehavior: Flickable.StopAtBounds
        flickableDirection: Flickable.HorizontalFlick

        ScrollBar.horizontal: ChaSetScrollBar {
            id: hScrollBar
            scrollArea: flickable
            barSize: "sm"
            showButtons: false
            policy: ScrollBar.AsNeeded
            visible: (flickable.contentWidth - flickable.width) > 1.0
        }

        WheelHandler {
            id: tableWheelHandler
            target: null
            acceptedDevices: PointerDevice.Mouse | PointerDevice.TouchPad
            onWheel: function(event) {
                if (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)) return;

                var isShift = Boolean(event.modifiers & Qt.ShiftModifier);
                var isHorizontal = (event.angleDelta.x !== 0) || isShift;

                if (!isHorizontal) {
                    // Vertical mouse wheel: this table has NO vertical scrollbar,
                    // so forward the vertical wheel event directly to parent scroll area!
                    var deltaY = event.angleDelta.y;
                    if (deltaY === 0) return;
                    var parentArea = root.resolveParentScrollArea();
                    if (parentArea) {
                        if (typeof parentArea.handleVerticalWheel === "function") {
                            parentArea.handleVerticalWheel(deltaY);
                            event.accepted = true;
                            return;
                        } else if (parentArea.contentY !== undefined) {
                            var maxScrollY = Math.max(0, parentArea.contentHeight - parentArea.height);
                            var scrollPixels = (deltaY / 120.0) * 80.0;
                            parentArea.contentY = Math.max(0, Math.min(maxScrollY, parentArea.contentY - scrollPixels));
                            event.accepted = true;
                            return;
                        }
                    }
                    return;
                }

                // Horizontal mouse wheel (angleDelta.x != 0 or Shift + angleDelta.y)
                var deltaX = event.angleDelta.x !== 0 ? event.angleDelta.x : event.angleDelta.y;
                if (deltaX === 0) return;

                var maxContentX = Math.max(0, flickable.contentWidth - flickable.width);
                if (maxContentX > 1.0) {
                    var scrollingRight = (deltaX < 0);
                    var scrollingLeft = (deltaX > 0);
                    var atLeft = flickable.contentX <= 0.5;
                    var atRight = flickable.contentX >= maxContentX - 0.5;

                    if ((scrollingLeft && !atLeft) || (scrollingRight && !atRight)) {
                        var scrollPx = (deltaX / 120.0) * 80.0;
                        var newContentX = Math.max(0, Math.min(maxContentX, flickable.contentX - scrollPx));
                        flickable.contentX = newContentX;
                        event.accepted = true;
                        return;
                    }
                }

                // If this table cannot scroll horizontally (or reached horizontal bound),
                // forward horizontal wheel to parent if parent can scroll horizontally
                var pArea = root.resolveParentScrollArea();
                if (pArea && typeof pArea.handleHorizontalWheel === "function") {
                    if (pArea.handleHorizontalWheel(deltaX)) {
                        event.accepted = true;
                    }
                }
            }
        }

        Column {
            id: mainLayout
            width: root.tableContentWidth

        // Header Row
        Rectangle {
            id: headerRow
            width: parent.width
            height: root.effectiveHeaderHeight
            color: root.cHeaderBg
            topLeftRadius: Math.max(0, root.radius - 1)
            topRightRadius: Math.max(0, root.radius - 1)

            Rectangle {
                anchors.bottom: parent.bottom
                width: parent.width
                height: 1
                color: root.cBorder
            }

            Row {
                anchors.fill: parent
                Repeater {
                    model: root.columns
                    delegate: Item {
                        required property var modelData
                        required property int index

                        width: root.getColWidth(index, headerRow.width)
                        height: headerRow.height
                        clip: true

                        TextEdit {
                            id: headerCellText
                            width: Math.min(parent.width - ThemeTokens.dp(24), contentWidth)
                            height: Math.min(headerRow.height, contentHeight)
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.left: (modelData && (modelData.align === "right" || modelData.align === "center")) ? undefined : parent.left
                            anchors.right: (modelData && modelData.align === "right") ? parent.right : undefined
                            anchors.horizontalCenter: (modelData && modelData.align === "center") ? parent.horizontalCenter : undefined
                            anchors.leftMargin: (modelData && (modelData.align === "right" || modelData.align === "center")) ? 0 : ThemeTokens.dp(12)
                            anchors.rightMargin: (modelData && modelData.align === "right") ? ThemeTokens.dp(12) : 0
                            verticalAlignment: TextEdit.AlignVCenter
                            horizontalAlignment: root.getAlignment(modelData ? modelData.align : "left")
                            text: modelData ? (modelData.title || "") : ""
                            color: root.cSubduedText
                            font.family: Typography.familySans
                            font.pixelSize: Typography.sizeSmall
                            font.weight: Typography.weightSemibold
                            readOnly: true
                            clip: true
                            selectByMouse: !root.interactive
                            selectByKeyboard: true
                            cursorVisible: false
                            activeFocusOnPress: !root.interactive
                            textMargin: 0
                            padding: 0
                            selectionColor: ThemeTokens.accent
                            selectedTextColor: "#ffffff"

                            HoverHandler {
                                enabled: !root.interactive
                                cursorShape: Qt.IBeamCursor
                            }

                            onSelectedTextChanged: {
                                if (selectedText.length > 0) SelectionHub.claim(headerCellText);
                                else if (SelectionHub.activeOwner === headerCellText) SelectionHub.clear(headerCellText);
                            }

                            Keys.onPressed: function(event) {
                                if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
                                    SelectionHub.copyActiveSelection();
                                    event.accepted = true;
                                }
                            }

                            TapHandler {
                                enabled: !root.interactive
                                acceptedButtons: Qt.RightButton
                                onTapped: function(eventPoint) {
                                    var scenePos = eventPoint.scenePosition;
                                    SelectionHub.showContextMenu(scenePos.x, scenePos.y, headerCellText);
                                }
                            }
                        }
                    }
                }
            }
        }

        // Data Rows
        Repeater {
            id: rowsRepeater
            model: root.rows

            delegate: Rectangle {
                id: rowItem
                required property var modelData
                required property int index

                width: mainLayout.width
                property real cellMaxNeededHeight: root.effectiveRowHeight
                height: Math.max(root.effectiveRowHeight, cellMaxNeededHeight)

                function updateRowHeight() {
                    var maxNeeded = root.effectiveRowHeight;
                    for (var i = 0; i < cellsRow.children.length; ++i) {
                        var childItem = cellsRow.children[i];
                        if (childItem && childItem.neededCellHeight !== undefined) {
                            if (childItem.neededCellHeight > maxNeeded) {
                                maxNeeded = childItem.neededCellHeight;
                            }
                        }
                    }
                    cellMaxNeededHeight = maxNeeded;
                }

                Connections {
                    target: root
                    function onEffectiveRowHeightChanged() {
                        rowItem.updateRowHeight();
                    }
                }
                onWidthChanged: {
                    rowItem.updateRowHeight();
                }

                property bool isLastRow: index === (root.rows.length - 1) && (!root.caption || root.caption.length === 0)
                bottomLeftRadius: isLastRow ? Math.max(0, root.radius - 1) : 0
                bottomRightRadius: isLastRow ? Math.max(0, root.radius - 1) : 0

                property bool isSelected: root.selectedIndex === index
                property bool isHovered: rowMouseArea.containsMouse

                color: isSelected ? root.cSelection : (isHovered ? root.cHover : "transparent")

                Behavior on color {
                    ColorAnimation { duration: ThemeTokens.motionQuick }
                }

                Rectangle {
                    anchors.bottom: parent.bottom
                    width: parent.width
                    height: 1
                    color: root.cBorder
                    opacity: 0.7
                    visible: !rowItem.isLastRow
                }

                Row {
                    id: cellsRow
                    anchors.fill: parent
                    Repeater {
                        model: root.columns
                        delegate: Item {
                            id: cellDelegate
                            required property var modelData
                            required property int index

                            property var columnDef: modelData
                            property var rowRecord: rowItem.modelData
                            property real neededCellHeight: (columnDef && columnDef.wrap && bodyCellText.contentHeight > 0)
                                ? (bodyCellText.contentHeight + ThemeTokens.dp(16))
                                : root.effectiveRowHeight

                            onNeededCellHeightChanged: rowItem.updateRowHeight()

                            width: root.getColWidth(index, rowItem.width)
                            height: rowItem.height
                            clip: true

                            // Badge rendering
                            ChaSetBadge {
                                visible: Boolean(columnDef && columnDef.badge)
                                anchors.verticalCenter: parent.verticalCenter
                                anchors.left: parent.left
                                anchors.leftMargin: ThemeTokens.dp(12)
                                text: {
                                    if (!rowRecord || !columnDef || columnDef.key === undefined) return "";
                                    var val = rowRecord[columnDef.key];
                                    return val !== undefined && val !== null ? String(val) : "";
                                }
                                size: "sm"
                                variant: {
                                    var t = String(text).toLowerCase();
                                    if (t === "paid" || t === "complete" || t === "active" || t === "healthy") return "default";
                                    if (t === "pending" || t === "in review" || t === "planned") return "secondary";
                                    return "outline";
                                }
                            }

                            // Key Combo Chips rendering (kbd)
                            ChaSetKbd {
                                id: kbdContainer
                                visible: Boolean(columnDef && columnDef.kbd)
                                anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                                anchors.left: parent.left
                                anchors.leftMargin: ThemeTokens.dp(12)
                                size: "xs"
                                variant: "outline"
                                compact: "never"
                                shortcut: {
                                    if (!rowRecord || !columnDef || columnDef.key === undefined) return "";
                                    var val = rowRecord[columnDef.key];
                                    return val !== undefined && val !== null ? String(val) : "";
                                }
                            }

                            // CopyableBadge rendering
                            ChaSetCopyableBadge {
                                visible: Boolean(columnDef && columnDef.copyableBadge)
                                anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                                anchors.left: parent.left
                                anchors.leftMargin: ThemeTokens.dp(12)
                                size: "sm"
                                text: {
                                    if (!rowRecord || !columnDef || columnDef.key === undefined) return "";
                                    var val = rowRecord[columnDef.key];
                                    return val !== undefined && val !== null ? String(val) : "";
                                }
                            }

                            // Code Chip with HoverCopy rendering
                            Item {
                                id: codeCellItem
                                visible: Boolean(columnDef && columnDef.code && !columnDef.badge && !columnDef.copyableBadge)
                                anchors.verticalCenter: parent ? parent.verticalCenter : undefined
                                anchors.left: parent.left
                                anchors.leftMargin: ThemeTokens.dp(12)
                                implicitHeight: ThemeTokens.dp(20)
                                implicitWidth: isDash ? dashText.implicitWidth : hoverCode.implicitWidth

                                readonly property string rawVal: {
                                    if (!rowRecord || !columnDef || columnDef.key === undefined) return "";
                                    var val = rowRecord[columnDef.key];
                                    return val !== undefined && val !== null ? String(val) : "";
                                }
                                readonly property bool isDash: rawVal === "—" || rawVal === ""

                                Text {
                                    id: dashText
                                    visible: codeCellItem.isDash
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: "—"
                                    color: ThemeTokens.subduedText
                                    opacity: 0.4
                                    font.pixelSize: Typography.sizeSmall
                                }

                                ChaSetHoverCopy {
                                    id: hoverCode
                                    visible: !codeCellItem.isDash
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: codeCellItem.rawVal
                                    radius: "sm"

                                    Rectangle {
                                        id: codeBg
                                        implicitHeight: ThemeTokens.dp(20)
                                        implicitWidth: Math.max(ThemeTokens.dp(20), codeText.implicitWidth + ThemeTokens.dp(12))
                                        radius: ThemeTokens.dp(4)
                                        color: ThemeTokens.panelRaised

                                        Text {
                                            id: codeText
                                            anchors.centerIn: parent
                                            text: codeCellItem.rawVal
                                            color: ThemeTokens.text
                                            font.family: Typography.familyMono
                                            font.pixelSize: Typography.sizeSmall
                                        }
                                    }
                                }
                            }

                            // Standard Text rendering
                            TextEdit {
                                id: bodyCellText
                                visible: !Boolean(columnDef && (columnDef.badge || columnDef.kbd || columnDef.copyableBadge || columnDef.code))
                                width: (columnDef && columnDef.wrap)
                                    ? (parent.width - ThemeTokens.dp(24))
                                    : Math.min(parent.width - ThemeTokens.dp(24), contentWidth)
                                height: (columnDef && columnDef.wrap)
                                    ? contentHeight
                                    : Math.min(parent.height, contentHeight)
                                anchors.verticalCenter: (columnDef && columnDef.wrap) ? undefined : parent.verticalCenter
                                anchors.top: (columnDef && columnDef.wrap) ? parent.top : undefined
                                anchors.topMargin: (columnDef && columnDef.wrap) ? ThemeTokens.dp(8) : 0
                                anchors.left: (columnDef && (columnDef.align === "right" || columnDef.align === "center")) ? undefined : parent.left
                                anchors.right: (columnDef && columnDef.align === "right") ? parent.right : undefined
                                anchors.horizontalCenter: (columnDef && columnDef.align === "center") ? parent.horizontalCenter : undefined
                                anchors.leftMargin: (columnDef && (columnDef.align === "right" || columnDef.align === "center")) ? 0 : ThemeTokens.dp(12)
                                anchors.rightMargin: (columnDef && columnDef.align === "right") ? ThemeTokens.dp(12) : 0
                                verticalAlignment: (columnDef && columnDef.wrap) ? TextEdit.AlignTop : TextEdit.AlignVCenter
                                horizontalAlignment: root.getAlignment(columnDef ? columnDef.align : "left")
                                text: {
                                    if (!rowRecord || !columnDef || columnDef.key === undefined) return "";
                                    var val = rowRecord[columnDef.key];
                                    return val !== undefined && val !== null ? String(val) : "";
                                }
                                color: Boolean(columnDef && columnDef.code) ? ThemeTokens.accent : root.cText
                                font.family: (columnDef && columnDef.code) ? Typography.familyMono : Typography.familySans
                                font.weight: Boolean(columnDef && columnDef.code) ? Typography.weightMedium : Typography.weightRegular
                                font.pixelSize: Typography.sizeSmall
                                // Column values are DATA, not markup: a type such as
                                // `Map<string, T>` must not be sniffed as rich text. A caller
                                // that deliberately passes markup opts in per column with
                                // `rich: true` (living-doc prose cells do).
                                textFormat: Boolean(columnDef && columnDef.rich) ? TextEdit.RichText : TextEdit.PlainText
                                readOnly: true
                                clip: true
                                wrapMode: (columnDef && columnDef.wrap) ? TextEdit.WordWrap : TextEdit.NoWrap
                                selectByMouse: !root.interactive
                                selectByKeyboard: true
                                cursorVisible: false
                                activeFocusOnPress: !root.interactive
                                textMargin: 0
                                padding: 0
                                selectionColor: ThemeTokens.accent
                                selectedTextColor: "#ffffff"

                                onContentHeightChanged: {
                                    if (columnDef && columnDef.wrap) {
                                        rowItem.updateRowHeight();
                                    }
                                }

                                HoverHandler {
                                    enabled: !root.interactive
                                    cursorShape: Qt.IBeamCursor
                                }

                                onSelectedTextChanged: {
                                    if (selectedText.length > 0) SelectionHub.claim(bodyCellText);
                                    else if (SelectionHub.activeOwner === bodyCellText) SelectionHub.clear(bodyCellText);
                                }

                                Keys.onPressed: function(event) {
                                    if (event.matches(StandardKey.Copy) || (event.key === Qt.Key_C && (event.modifiers & (Qt.ControlModifier | Qt.MetaModifier)))) {
                                        SelectionHub.copyActiveSelection();
                                        event.accepted = true;
                                    }
                                }

                                TapHandler {
                                    enabled: !root.interactive
                                    acceptedButtons: Qt.RightButton
                                    onTapped: function(eventPoint) {
                                        var scenePos = eventPoint.scenePosition;
                                        SelectionHub.showContextMenu(scenePos.x, scenePos.y, bodyCellText);
                                    }
                                }
                            }
                        }
                    }
                }

                MouseArea {
                    id: rowMouseArea
                    anchors.fill: parent
                    visible: root.interactive
                    hoverEnabled: root.interactive
                    enabled: root.interactive
                    cursorShape: root.interactive ? Qt.PointingHandCursor : undefined
                    onClicked: {
                        if (root.interactive) {
                            root.selectedIndex = rowItem.index;
                            root.rowClicked(rowItem.index, rowItem.modelData);
                        }
                    }
                }
            }
        }

        // Empty state placeholder
        Rectangle {
            visible: (!root.rows || root.rows.length === 0)
            width: parent.width
            height: ThemeTokens.dp(60)
            color: "transparent"
            bottomLeftRadius: (!root.caption || root.caption.length === 0) ? Math.max(0, root.radius - 1) : 0
            bottomRightRadius: (!root.caption || root.caption.length === 0) ? Math.max(0, root.radius - 1) : 0

            Text {
                anchors.centerIn: parent
                text: ChaSetI18n.tr("components.table.emptyState", "No data available")
                color: root.cSubduedText
                font.pixelSize: Typography.sizeSmall
            }
        }

        // Caption Footer
        Rectangle {
            id: captionBox
            visible: root.caption.length > 0
            width: parent.width
            height: root.caption.length > 0 ? root.effectiveHeaderHeight : 0
            color: "transparent"

            Text {
                anchors.centerIn: parent
                text: root.caption
                color: root.cSubduedText
                font.pixelSize: Typography.sizeSmall
            }
        }

        // Bottom spacer for scrollbar clearance when horizontal scrollbar is active
        Item {
            width: parent.width
            height: hScrollBar.visible ? ThemeTokens.dp(12) : 0
        }
    }
}
}
