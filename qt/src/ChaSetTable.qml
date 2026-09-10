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

    signal rowClicked(int index, var rowData)

    readonly property bool isDark: ThemeTokens.dark
    readonly property color cBg: ThemeTokens.panel
    readonly property color cBorder: customBorderColor
    readonly property color cHeaderBg: Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.4)
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
                            font.pixelSize: 12
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

                            Text {
                                visible: !Boolean(columnDef && columnDef.badge)
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
                                color: root.cText
                                font.pixelSize: 12
                                elide: Text.ElideRight
                            }
                        }
                    }
                }

                MouseArea {
                    id: rowMouseArea
                    anchors.fill: parent
                    hoverEnabled: true
                    cursorShape: Qt.PointingHandCursor
                    onClicked: {
                        root.selectedIndex = rowItem.index;
                        root.rowClicked(rowItem.index, rowItem.modelData);
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

            Text {
                anchors.centerIn: parent
                text: "No data available"
                color: root.cSubduedText
                font.pixelSize: 12
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
                font.pixelSize: 12
            }
        }
    }
}
