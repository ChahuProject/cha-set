// ChaSetTable.qml — Cross-Stack Table Component for Qt Quick
// Pixel-Perfect & Behavioral Parity with React Table.tsx
import QtQuick 6.10
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

    implicitWidth: 600
    implicitHeight: mainLayout.implicitHeight

    radius: customRadius
    border.color: cBorder
    border.width: 1
    color: cBg
    clip: true

    function getColWidth(index, totalWidth) {
        if (!columns || columns.length === 0) return totalWidth;
        var col = columns[index];
        if (col && col.width !== undefined && Number(col.width) > 0) {
            return Number(col.width);
        }
        var fixedTotal = 0;
        var flexCount = 0;
        for (var i = 0; i < columns.length; ++i) {
            var c = columns[i];
            if (c && c.width !== undefined && Number(c.width) > 0) {
                fixedTotal += Number(c.width);
            } else {
                flexCount++;
            }
        }
        var available = totalWidth - fixedTotal;
        if (flexCount > 0 && available > 0) {
            return available / flexCount;
        }
        return totalWidth / columns.length;
    }

    function getAlignment(alignStr) {
        if (alignStr === "center") return Text.AlignHCenter;
        if (alignStr === "right") return Text.AlignRight;
        return Text.AlignLeft;
    }

    Column {
        id: mainLayout
        width: parent.width

        // Header Row
        Rectangle {
            id: headerRow
            width: parent.width
            height: root.headerHeight
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

                        Text {
                            anchors.fill: parent
                            anchors.leftMargin: 12
                            anchors.rightMargin: 12
                            verticalAlignment: Text.AlignVCenter
                            horizontalAlignment: root.getAlignment(modelData ? modelData.align : "left")
                            text: modelData ? (modelData.title || "") : ""
                            color: root.cSubduedText
                            font.pixelSize: Typography.sizeSmall
                            font.bold: true
                            elide: Text.ElideRight
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
                height: root.rowHeight

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
                    anchors.fill: parent
                    Repeater {
                        model: root.columns
                        delegate: Item {
                            required property var modelData
                            required property int index

                            property var columnDef: modelData
                            property var rowRecord: rowItem.modelData

                            width: root.getColWidth(index, rowItem.width)
                            height: rowItem.height

                            // Badge rendering
                            ChaSetBadge {
                                visible: Boolean(columnDef && columnDef.badge)
                                anchors.verticalCenter: parent.verticalCenter
                                anchors.left: parent.left
                                anchors.leftMargin: 12
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
                            Row {
                                id: kbdContainer
                                visible: Boolean(columnDef && columnDef.kbd)
                                anchors.verticalCenter: parent.verticalCenter
                                anchors.left: parent.left
                                anchors.leftMargin: 12
                                spacing: 6

                                readonly property string rawKeyStr: {
                                    if (!rowRecord || !columnDef || columnDef.key === undefined) return "";
                                    var val = rowRecord[columnDef.key];
                                    return val !== undefined && val !== null ? String(val) : "";
                                }

                                readonly property var comboList: rawKeyStr.length > 0 ? rawKeyStr.split(" / ") : []

                                    Repeater {
                                        model: kbdContainer.comboList
                                        delegate: Row {
                                            id: comboRow
                                            required property var modelData
                                            required property int index
                                            spacing: 4

                                            Text {
                                                visible: comboRow.index > 0
                                                text: "or"
                                                color: root.cSubduedText
                                                font.pixelSize: Typography.sizeCaption
                                                anchors.verticalCenter: parent.verticalCenter
                                            }

                                            Repeater {
                                                model: comboRow.modelData ? String(comboRow.modelData).split(" + ") : []
                                                delegate: Rectangle {
                                                    id: chipRect
                                                    required property var modelData
                                                    height: 20
                                                    width: Math.max(18, keyChipLabel.implicitWidth + 10)
                                                    radius: 4
                                                    color: ThemeTokens.dark ? Qt.rgba(1, 1, 1, 0.08) : Qt.rgba(0, 0, 0, 0.05)
                                                    border.color: root.cBorder
                                                    border.width: 1

                                                    Text {
                                                        id: keyChipLabel
                                                        anchors.centerIn: parent
                                                        text: chipRect.modelData ? String(chipRect.modelData) : ""
                                                        color: root.cText
                                                        font.pixelSize: Typography.sizeMicro
                                                        font.family: Typography.familyMono
                                                        font.bold: true
                                                    }
                                                }
                                            }
                                        }
                                    }
                            }

                            // Standard Text / Code rendering
                            Text {
                                visible: !Boolean(columnDef && (columnDef.badge || columnDef.kbd))
                                anchors.fill: parent
                                anchors.leftMargin: 12
                                anchors.rightMargin: 12
                                verticalAlignment: Text.AlignVCenter
                                horizontalAlignment: root.getAlignment(columnDef ? columnDef.align : "left")
                                text: {
                                    if (!rowRecord || !columnDef || columnDef.key === undefined) return "";
                                    var val = rowRecord[columnDef.key];
                                    return val !== undefined && val !== null ? String(val) : "";
                                }
                                color: Boolean(columnDef && columnDef.code) ? ThemeTokens.accent : root.cText
                                font.family: (columnDef && columnDef.code) ? Typography.familyMono : ""
                                font.weight: Boolean(columnDef && columnDef.code) ? Typography.weightMedium : Font.Normal
                                font.pixelSize: Typography.sizeSmall
                                elide: Text.ElideRight
                            }
                        }
                    }
                }

                MouseArea {
                    id: rowMouseArea
                    anchors.fill: parent
                    hoverEnabled: root.interactive
                    enabled: root.interactive
                    cursorShape: root.interactive ? Qt.PointingHandCursor : Qt.ArrowCursor
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
            height: 60
            color: "transparent"
            bottomLeftRadius: (!root.caption || root.caption.length === 0) ? Math.max(0, root.radius - 1) : 0
            bottomRightRadius: (!root.caption || root.caption.length === 0) ? Math.max(0, root.radius - 1) : 0

            Text {
                anchors.centerIn: parent
                text: "No data available"
                color: root.cSubduedText
                font.pixelSize: Typography.sizeSmall
            }
        }

        // Caption Footer
        Rectangle {
            id: captionBox
            visible: root.caption.length > 0
            width: parent.width
            height: root.caption.length > 0 ? 36 : 0
            color: "transparent"

            Text {
                anchors.centerIn: parent
                text: root.caption
                color: root.cSubduedText
                font.pixelSize: Typography.sizeSmall
            }
        }
    }
}
