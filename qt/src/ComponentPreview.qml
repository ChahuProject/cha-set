// ComponentPreview.qml — Visual Component Sandbox matching React ComponentPreview.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root
    width: parent ? parent.width : 760
    implicitHeight: previewContainer.implicitHeight
    radius: 8
    color: ThemeTokens.panel
    border.color: ThemeTokens.border
    border.width: 1
    clip: true

    property string title: ""
    property string reactCode: ""
    property string qtCode: ""
    property string activeTab: "preview"

    default property alias stageData: stageContainer.data
    property alias controlsData: controlsContainer.data

    Column {
        id: previewContainer
        width: parent.width

        // Tab Navigation Header (38px height)
        Rectangle {
            width: parent.width
            height: 38
            color: Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.5)
            border.color: ThemeTokens.border
            border.width: 0.5

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 8
                anchors.verticalCenter: parent.verticalCenter
                spacing: 4

                ChaSetButton {
                    size: "sm"
                    variant: root.activeTab === "preview" ? "secondary" : "ghost"
                    text: "Preview"
                    onClicked: root.activeTab = "preview"
                }

                ChaSetButton {
                    size: "sm"
                    variant: root.activeTab === "code" ? "secondary" : "ghost"
                    text: "React Code"
                    onClicked: root.activeTab = "code"
                }

                ChaSetButton {
                    visible: root.qtCode !== ""
                    size: "sm"
                    variant: root.activeTab === "qt" ? "secondary" : "ghost"
                    text: "Qt QML"
                    onClicked: root.activeTab = "qt"
                }
            }

            Text {
                visible: root.title !== ""
                anchors.right: parent.right
                anchors.rightMargin: 14
                anchors.verticalCenter: parent.verticalCenter
                text: root.title
                color: ThemeTokens.subduedText
                font.pixelSize: 11
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
                height: 280
                clip: true
            }

            // Controls Bar
            Rectangle {
                visible: controlsContainer.children.length > 0
                width: parent.width
                implicitHeight: controlsContainer.implicitHeight + 24
                color: ThemeTokens.hover
                border.color: ThemeTokens.border
                border.width: 0.5

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
        CodeBlock {
            visible: root.activeTab === "code"
            width: parent.width
            code: root.reactCode
            language: "tsx"
            radius: 0
        }

        // Qt QML Code Tab
        CodeBlock {
            visible: root.activeTab === "qt"
            width: parent.width
            code: root.qtCode
            language: "qml"
            radius: 0
        }
    }
}
