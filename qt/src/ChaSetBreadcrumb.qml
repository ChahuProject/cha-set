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

    signal navigateRequested(string path)
    signal openSubfoldersRequested(int index, string path)
    signal dropRequested(string targetPath, var urls)

    implicitHeight: ThemeTokens.dp(30)
    implicitWidth: crumbsRow.implicitWidth

    RowLayout {
        id: crumbsRow
        anchors.fill: parent
        spacing: 0
        clip: true

        // Overflow ellipsis button
        Rectangle {
            id: overflowBtn
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
                cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ArrowCursor
                onClicked: {
                    if (!root.disabled) {
                        overflowPopup.open()
                    }
                }
            }
        }

        Repeater {
            id: segRepeater
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

                    // Segment Pill
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
                            spacing: ThemeTokens.dp(4)

                            ChaSetIcon {
                                name: segItem.segIcon
                                size: 16
                                color: segItem.isCurrent ? ThemeTokens.accent : ThemeTokens.subduedText
                                anchors.verticalCenter: parent.verticalCenter
                            }

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
                            cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ArrowCursor
                            onClicked: {
                                if (!root.disabled) {
                                    root.navigateRequested(segItem.segPath)
                                }
                            }
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
                            cursorShape: !root.disabled ? Qt.PointingHandCursor : Qt.ArrowCursor
                            onClicked: {
                                if (!root.disabled) {
                                    if (root.openSegmentIndex === segItem.index) {
                                        root.openSegmentIndex = -1
                                    } else {
                                        root.openSegmentIndex = segItem.index
                                        root.openSubfoldersRequested(segItem.index, segItem.segPath)
                                    }
                                }
                            }
                        }
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
