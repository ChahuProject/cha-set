// ComponentPreview.qml — Visual Component Sandbox matching React ComponentPreview.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

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

        // Tab Navigation Header (36px height)
        Rectangle {
            width: parent.width
            height: 38
            color: ThemeTokens.hover
            border.color: ThemeTokens.border
            border.width: 0.5

            Row {
                anchors.left: parent.left
                anchors.leftMargin: 10
                anchors.verticalCenter: parent.verticalCenter
                spacing: 4

                Rectangle {
                    width: 64; height: 26; radius: 5
                    color: root.activeTab === "preview" ? ThemeTokens.panel : "transparent"
                    border.color: root.activeTab === "preview" ? ThemeTokens.border : "transparent"
                    Text { anchors.centerIn: parent; text: "Preview"; color: root.activeTab === "preview" ? ThemeTokens.text : ThemeTokens.subduedText; font.pixelSize: 11; font.weight: root.activeTab === "preview" ? Font.Bold : Font.Normal }
                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.activeTab = "preview" }
                }

                Rectangle {
                    width: 80; height: 26; radius: 5
                    color: root.activeTab === "code" ? ThemeTokens.panel : "transparent"
                    border.color: root.activeTab === "code" ? ThemeTokens.border : "transparent"
                    Text { anchors.centerIn: parent; text: "React Code"; color: root.activeTab === "code" ? ThemeTokens.text : ThemeTokens.subduedText; font.pixelSize: 11; font.weight: root.activeTab === "code" ? Font.Bold : Font.Normal }
                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.activeTab = "code" }
                }

                Rectangle {
                    width: 68; height: 26; radius: 5
                    color: root.activeTab === "qt" ? ThemeTokens.panel : "transparent"
                    border.color: root.activeTab === "qt" ? ThemeTokens.border : "transparent"
                    Text { anchors.centerIn: parent; text: "Qt QML"; color: root.activeTab === "qt" ? ThemeTokens.text : ThemeTokens.subduedText; font.pixelSize: 11; font.weight: root.activeTab === "qt" ? Font.Bold : Font.Normal }
                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.activeTab = "qt" }
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
                width: parent.width
                height: controlsContainer.implicitHeight + 20
                color: ThemeTokens.hover
                border.color: ThemeTokens.border
                border.width: 0.5

                Row {
                    id: controlsContainer
                    anchors.centerIn: parent
                    spacing: 16
                }
            }
        }

        // Code Mode Content (React JSX / Qt QML)
        Rectangle {
            visible: root.activeTab !== "preview"
            width: parent.width
            height: 200
            color: ThemeTokens.background

            TextArea {
                anchors.fill: parent
                anchors.margins: 14
                readOnly: true
                text: root.activeTab === "code" ? root.reactCode : root.qtCode
                color: ThemeTokens.text
                font.family: "Consolas, monospace"
                font.pixelSize: 12
                background: null
            }
        }
    }
}
