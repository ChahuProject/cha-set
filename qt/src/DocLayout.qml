// DocLayout.qml — Standard Documentation Page Template matching React DocLayout.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

Item {
    id: root
    width: parent ? parent.width : 1000
    implicitHeight: layoutRow.implicitHeight + 60

    property string category: "Components"
    property string pageTitle: "Button"
    property string description: ""
    property var tocItems: []
    default property alias contentData: pageContentCol.data

    property bool copiedLink: false

    Timer {
        id: copyTimer
        interval: 2000
        onTriggered: root.copiedLink = false
    }

    Row {
        id: layoutRow
        anchors.horizontalCenter: parent.horizontalCenter
        width: Math.min(parent.width - 48, 1000)
        spacing: 32

        // Main Center Content Column (max-w-4xl)
        Column {
            id: mainCol
            width: root.tocItems && root.tocItems.length > 0 ? (layoutRow.width - 180 - layoutRow.spacing) : layoutRow.width
            spacing: 24

            // Breadcrumb
            Row {
                spacing: 6
                Text { text: "Docs"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                Text { text: "/"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                Text { text: root.category; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                Text { text: "/"; color: ThemeTokens.subduedText; font.pixelSize: 12 }
                Text { text: root.pageTitle; color: ThemeTokens.text; font.pixelSize: 12; font.weight: Font.DemiBold }
            }

            // Page Header with Copy Link
            Column {
                width: parent.width
                spacing: 8

                Item {
                    width: parent.width
                    height: Math.max(titleText.implicitHeight, copyBtn.height)

                    Text {
                        id: titleText
                        anchors.left: parent.left
                        anchors.verticalCenter: parent.verticalCenter
                        text: root.pageTitle
                        color: ThemeTokens.text
                        font.pixelSize: 32
                        font.weight: Font.Bold
                        font.letterSpacing: -0.5
                    }

                    Rectangle {
                        id: copyBtn
                        anchors.right: parent.right
                        anchors.verticalCenter: parent.verticalCenter
                        width: 96; height: 28; radius: 6
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1

                        Row {
                            anchors.centerIn: parent
                            spacing: 5
                            Text {
                                text: root.copiedLink ? "✓" : "📋"
                                font.pixelSize: 11
                                color: root.copiedLink ? "#10b981" : ThemeTokens.subduedText
                            }
                            Text {
                                text: root.copiedLink ? "Copied" : "Copy Link"
                                color: root.copiedLink ? "#10b981" : ThemeTokens.text
                                font.pixelSize: 11
                                font.weight: Font.Medium
                            }
                        }

                        MouseArea {
                            anchors.fill: parent
                            cursorShape: Qt.PointingHandCursor
                            onClicked: {
                                root.copiedLink = true
                                copyTimer.restart()
                            }
                        }
                    }
                }

                Text {
                    text: root.description
                    color: ThemeTokens.subduedText
                    font.pixelSize: 14
                    lineHeight: 1.4
                    wrapMode: Text.WordWrap
                    width: parent.width
                }

                Rectangle {
                    width: parent.width
                    height: 1
                    color: ThemeTokens.border
                }
            }

            // Page Dynamic Content
            Column {
                id: pageContentCol
                width: parent.width
                spacing: 28
            }
        }

        // Right Table of Contents (TOC, 180px width)
        Column {
            id: tocCol
            visible: root.tocItems && root.tocItems.length > 0
            width: 180
            spacing: 12

            Text {
                text: "ON THIS PAGE"
                color: ThemeTokens.text
                font.pixelSize: 11
                font.weight: Font.Bold
                font.letterSpacing: 0.5
            }

            Repeater {
                model: root.tocItems
                delegate: Text {
                    required property var modelData
                    text: modelData.title
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                    wrapMode: Text.WordWrap
                    width: parent.width
                    MouseArea {
                        anchors.fill: parent
                        cursorShape: Qt.PointingHandCursor
                    }
                }
            }
        }
    }
}
