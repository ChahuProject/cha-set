// ComponentPreview.qml — Visual Component Sandbox matching React ComponentPreview.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

ChaSetCard {
    id: root
    width: parent ? parent.width : 760
    implicitHeight: previewContainer.implicitHeight
    clip: true

    property string title: ""
    property string reactCode: ""
    property string qtCode: ""
    property string activeTab: "preview"
    property int stageHeight: 280

    default property alias stageData: stageContainer.data
    property alias controlsData: controlsContainer.data

    Column {
        id: previewContainer
        width: parent.width

        // Tab Navigation Header (44px height matching React px-3 py-2 with default size SegmentedControl)
        Rectangle {
            id: headerRect
            width: parent.width
            height: 44
            color: root.isDark ? Qt.rgba(30/255, 41/255, 59/255, 0.4) : Qt.rgba(241/255, 245/255, 249/255, 0.4)
            radius: root.radius

            // Square bottom corners so only top-left and top-right follow the card radius
            Rectangle {
                anchors.bottom: parent.bottom
                width: parent.width
                height: parent.radius
                color: parent.color
            }

            // Bottom border matching React border-b border-border
            Rectangle {
                anchors.bottom: parent.bottom
                width: parent.width
                height: 1
                color: root.cBorder
            }

            ChaSetSegmentedControl {
                anchors.left: parent.left
                anchors.leftMargin: 12
                anchors.verticalCenter: parent.verticalCenter
                size: "default"
                value: root.activeTab
                options: [
                    { label: "Preview", value: "preview" },
                    { label: "React Code", value: "code" },
                    ...(root.qtCode !== "" ? [{ label: "Qt QML", value: "qt" }] : [])
                ]
                onValueSelected: function(val) {
                    root.activeTab = val
                }
            }

            Text {
                visible: root.title !== ""
                anchors.right: parent.right
                anchors.rightMargin: 14
                anchors.verticalCenter: parent.verticalCenter
                text: root.title
                color: ThemeTokens.subduedText
                font.pixelSize: 12
            }
        }

        // Preview Mode Content
        Column {
            visible: root.activeTab === "preview"
            width: parent.width

            // Center Stage
            Item {
                id: stageContainer
                width: parent.width
                height: root.stageHeight
                clip: true
            }

            // Controls Bar (matching React border-t border-border/40 bg-muted/20)
            Rectangle {
                id: controlsBar
                visible: controlsContainer.children.length > 0
                width: parent.width
                implicitHeight: controlsContainer.implicitHeight + 24
                color: root.isDark ? Qt.rgba(30/255, 41/255, 59/255, 0.2) : Qt.rgba(241/255, 245/255, 249/255, 0.2)
                radius: root.radius

                // Square top corners so only bottom-left and bottom-right follow the card radius
                Rectangle {
                    anchors.top: parent.top
                    width: parent.width
                    height: parent.radius
                    color: parent.color
                }

                // Top border divider matching React border-t
                Rectangle {
                    anchors.top: parent.top
                    width: parent.width
                    height: 1
                    color: root.cBorder
                }

                Flow {
                    id: controlsContainer
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.leftMargin: 16
                    anchors.rightMargin: 16
                    anchors.top: parent.top
                    anchors.topMargin: 12
                    spacing: 16
                }
            }
        }

        // React Code Tab
        ChaSetCodeBlock {
            visible: root.activeTab === "code"
            width: parent.width
            code: root.reactCode
            language: "tsx"
            radius: 0
        }

        // Qt QML Code Tab
        ChaSetCodeBlock {
            visible: root.activeTab === "qt"
            width: parent.width
            code: root.qtCode
            language: "qml"
            radius: 0
        }
    }
}
