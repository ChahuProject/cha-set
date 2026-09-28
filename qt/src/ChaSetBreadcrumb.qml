// qt/src/ChaSetBreadcrumb.qml
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

Item {
    id: root

    property var segments: []
    property bool disabled: false
    property int openSegmentIndex: -1
    property int firstVisibleIndex: 0
    property bool overflowVisible: false
    readonly property bool isAnyPopupOpen: overflowPopup.opened

    function closePopups() {
        overflowPopup.close()
    }

    signal navigateRequested(string path)
    signal openSubfoldersRequested(int index, string path, Item chevronItem)
    signal dropRequested(string targetPath, var urls)
    signal blankAreaClicked()

    implicitHeight: ThemeTokens.dp(30)
    implicitWidth: {
        var total = 0
        if (root.segments) {
            for (var i = 0; i < root.segments.length; i++) {
                total += getSegmentWidth(i)
            }
        }
        return total
    }

    FontMetrics {
        id: segFontMetrics
        font.pixelSize: Typography.sizeSmall
        font.weight: Typography.weightRegular
    }

    FontMetrics {
        id: segBoldFontMetrics
        font.pixelSize: Typography.sizeSmall
        font.weight: Typography.weightSemibold
    }

    function getSegmentWidth(index) {
        if (!root.segments || index < 0 || index >= root.segments.length)
            return 0
        var seg = root.segments[index]
        var name = String(seg.displayName || seg.label || "")
        var fm = (index === root.segments.length - 1) ? segBoldFontMetrics : segFontMetrics
        var textW = fm.advanceWidth(name)
        var pillW = textW + ThemeTokens.dp(12)
        var hasChevron = (index < root.segments.length - 1) || (root.segments.length === 1) || Boolean(seg.hasSubfolders)
        var chevronW = hasChevron ? ThemeTokens.dp(20) : 0
        return pillW + chevronW
    }

    function relayoutSegments() {
        var count = root.segments ? root.segments.length : 0
        if (count <= 1) {
            root.firstVisibleIndex = 0
            root.overflowVisible = false
            return
        }
        var avail = root.width
        if (avail <= 0) {
            root.firstVisibleIndex = 0
            root.overflowVisible = false
            return
        }

        var overflowW = ThemeTokens.dp(26)
        var lastW = getSegmentWidth(count - 1)
        var total = lastW
        var first = count - 1

        for (var i = count - 2; i >= 0; --i) {
            var w = getSegmentWidth(i)
            var neededOverflow = (i > 0) ? overflowW : 0
            if (total + w + neededOverflow > avail) {
                break
            }
            total += w
            first = i
        }

        root.firstVisibleIndex = first
        root.overflowVisible = (first > 0)
    }

    onWidthChanged: relayoutSegments()
    onSegmentsChanged: relayoutSegments()
    Component.onCompleted: relayoutSegments()

    RowLayout {
        id: crumbsRow
        objectName: "crumbsRow"
        anchors.fill: parent
        spacing: 0

        // Overflow ellipsis button
        Rectangle {
            id: overflowBtn
            objectName: "overflowBtn"
            visible: root.overflowVisible
            Layout.preferredWidth: ThemeTokens.dp(24)
            Layout.preferredHeight: ThemeTokens.dp(26)
            Layout.alignment: Qt.AlignVCenter
            radius: ThemeTokens.dp(4)
            color: overflowMouse.containsMouse && !root.disabled ? ThemeTokens.hover : "transparent"

            Text {
                anchors.centerIn: parent
                text: "…"
                color: ThemeTokens.text
                font.pixelSize: Typography.sizeSmall
                font.bold: true
            }

            MouseArea {
                id: overflowMouse
                anchors.fill: parent
                hoverEnabled: true
                cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                onClicked: {
                    if (!root.disabled) {
                        overflowPopup.open()
                    }
                }
            }

            ChaSetTooltip {
                target: overflowBtn
                text: qsTr("显示隐藏的祖先文件夹")
                side: "bottom"
                delay: 400
                disabled: root.disabled
            }
        }

        Repeater {
            id: segRepeater
            objectName: "segRepeater"
            model: root.segments

            delegate: Item {
                id: segItem
                required property var modelData
                required property int index

                readonly property string segPath: modelData.realPath || modelData.path || ""
                readonly property string segName: modelData.displayName || modelData.label || ""
                readonly property string segIcon: modelData.icon || "folder"
                readonly property bool segHasSubfolders: Boolean(modelData.hasSubfolders)
                readonly property bool isCurrent: segItem.index === (root.segments.length - 1)
                readonly property bool isMenuOpen: segItem.index === root.openSegmentIndex

                visible: segItem.index >= root.firstVisibleIndex
                Layout.preferredWidth: segPill.implicitWidth + (chevronBox.visible ? chevronBox.width : 0)
                Layout.preferredHeight: ThemeTokens.dp(26)
                Layout.alignment: Qt.AlignVCenter

                Row {
                    anchors.fill: parent
                    spacing: 0

                    // Segment Pill (No leading icon, auto-expanding content width)
                    Rectangle {
                        id: segPill
                        width: pillContent.implicitWidth + ThemeTokens.dp(12)
                        height: parent.height
                        implicitWidth: width
                        radius: ThemeTokens.dp(4)
                        color: pillMouse.containsMouse && !root.disabled ? ThemeTokens.hover : "transparent"

                        Row {
                            id: pillContent
                            anchors.centerIn: parent

                            Text {
                                text: segItem.segName
                                color: segItem.isCurrent ? ThemeTokens.text : ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                                font.weight: segItem.isCurrent ? Typography.weightSemibold : Typography.weightRegular
                                verticalAlignment: Text.AlignVCenter
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }

                        MouseArea {
                            id: pillMouse
                            objectName: "pillMouse"
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                            onClicked: {
                                if (!root.disabled) {
                                    if (segItem.isCurrent) {
                                        root.blankAreaClicked()
                                    } else {
                                        root.navigateRequested(segItem.segPath)
                                    }
                                }
                            }
                        }

                        ChaSetTooltip {
                            target: segPill
                            text: segItem.segPath || segItem.segName
                            side: "bottom"
                            delay: 400
                            disabled: root.disabled
                        }
                    }

                    // Independent Chevron dropdown
                    Item {
                        id: chevronBox
                        width: ThemeTokens.dp(20)
                        height: parent.height
                        visible: segItem.index < (root.segments.length - 1) || root.segments.length === 1 || segItem.segHasSubfolders

                        Rectangle {
                            anchors.fill: parent
                            radius: ThemeTokens.dp(4)
                            color: (chevronMouse.containsMouse || segItem.isMenuOpen) && !root.disabled ? ThemeTokens.hover : "transparent"
                        }

                        ChaSetIcon {
                            id: chevronIcon
                            objectName: "segChevronIcon"
                            name: "chevron-right"
                            size: 14
                            color: (chevronMouse.containsMouse || segItem.isMenuOpen) ? ThemeTokens.text : ThemeTokens.subduedText
                            anchors.centerIn: parent

                            transform: Rotation {
                                origin.x: ThemeTokens.dp(7)
                                origin.y: ThemeTokens.dp(7)
                                angle: segItem.isMenuOpen ? 90 : 0
                                Behavior on angle {
                                    NumberAnimation {
                                        duration: 120
                                        easing.type: Easing.OutCubic
                                    }
                                }
                            }
                        }

                        MouseArea {
                            id: chevronMouse
                            objectName: "chevronMouse"
                            anchors.fill: parent
                            hoverEnabled: true
                            cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ForbiddenCursor
                            onClicked: {
                                if (!root.disabled) {
                                    if (root.openSegmentIndex === segItem.index) {
                                        root.openSegmentIndex = -1
                                    } else {
                                        root.openSegmentIndex = segItem.index
                                        root.openSubfoldersRequested(segItem.index, segItem.segPath, chevronBox)
                                    }
                                }
                            }
                        }

                        ChaSetTooltip {
                            target: chevronBox
                            text: qsTr("展开 %1 的子文件夹").arg(segItem.segName)
                            side: "bottom"
                            delay: 400
                            disabled: root.disabled
                        }
                    }
                }
            }
        }

        // Blank space filler to click into edit mode
        Item {
            Layout.fillWidth: true
            Layout.fillHeight: true
            MouseArea {
                anchors.fill: parent
                cursorShape: !root.disabled ? Qt.IBeamCursor : Qt.ForbiddenCursor
                onClicked: {
                    if (!root.disabled) {
                        root.blankAreaClicked()
                    }
                }
            }
        }
    }

    ChaSetAddressBarOverflowPopup {
        id: overflowPopup
        items: {
            var list = []
            for (var i = 0; i < root.firstVisibleIndex; i++) {
                if (root.segments[i]) list.push(root.segments[i])
            }
            return list
        }
        onNavigateRequested: (targetPath) => {
            root.navigateRequested(targetPath)
        }
    }
}
