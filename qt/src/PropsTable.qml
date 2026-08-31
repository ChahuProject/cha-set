// PropsTable.qml — Standard Component API Reference Table matching React PropsTable.tsx 1:1
import QtQuick 6.10
import QtQuick.Controls 6.10
import chaSet

Column {
    id: root
    width: parent ? parent.width : 760
    spacing: 10

    property string title: ""
    property var propsModel: []

    Text {
        visible: root.title !== ""
        text: root.title
        color: ThemeTokens.text
        font.pixelSize: 15
        font.weight: Font.Bold
        font.letterSpacing: -0.2
    }

    Rectangle {
        width: parent.width
        implicitHeight: tableCol.implicitHeight
        radius: 8
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        clip: true

        Column {
            id: tableCol
            width: parent.width

            // Header Row
            Rectangle {
                width: parent.width
                height: 36
                color: Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.6)
                border.color: ThemeTokens.border
                border.width: 0.5

                Row {
                    anchors.fill: parent
                    anchors.leftMargin: 16
                    anchors.rightMargin: 16
                    spacing: 12

                    Text { text: "PROP"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5; width: 160; anchors.verticalCenter: parent.verticalCenter }
                    Text { text: "TYPE"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5; width: 140; anchors.verticalCenter: parent.verticalCenter }
                    Text { text: "DEFAULT"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5; width: 90; anchors.verticalCenter: parent.verticalCenter }
                    Text { text: "DESCRIPTION"; color: ThemeTokens.subduedText; font.pixelSize: 11; font.weight: Font.Bold; font.letterSpacing: 0.5; width: parent.width - 430; anchors.verticalCenter: parent.verticalCenter }
                }
            }

            // Body Rows
            Repeater {
                model: root.propsModel
                delegate: Rectangle {
                    required property var modelData
                    required property int index
                    width: parent.width
                    implicitHeight: rowContent.implicitHeight + 20
                    color: index % 2 === 0 ? "transparent" : Qt.rgba(ThemeTokens.hover.r, ThemeTokens.hover.g, ThemeTokens.hover.b, 0.2)

                    Rectangle {
                        anchors.bottom: parent.bottom
                        width: parent.width
                        height: 1
                        color: ThemeTokens.border
                        opacity: 0.6
                    }

                    Row {
                        id: rowContent
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.leftMargin: 16
                        anchors.rightMargin: 16
                        anchors.verticalCenter: parent.verticalCenter
                        spacing: 12

                        // Prop Name
                        Row {
                            width: 160
                            spacing: 4
                            Text {
                                text: modelData.name || modelData[0]
                                color: ThemeTokens.accent
                                font.family: "Consolas, monospace"
                                font.pixelSize: 12
                                font.weight: Font.DemiBold
                            }
                            Text {
                                visible: !!(modelData.required || modelData[4])
                                text: "*"
                                color: "#ef4444"
                                font.pixelSize: 12
                            }
                        }

                        // Type Badge
                        Rectangle {
                            width: Math.min(140, typeText.implicitWidth + 12)
                            height: 22
                            radius: 4
                            color: ThemeTokens.hover
                            border.color: ThemeTokens.border
                            Text {
                                id: typeText
                                anchors.centerIn: parent
                                text: modelData.type || modelData[1]
                                color: ThemeTokens.text
                                font.family: "Consolas, monospace"
                                font.pixelSize: 10
                            }
                        }

                        // Default Value
                        Text {
                            width: 90
                            text: (modelData.default || modelData[2]) ? (modelData.default || modelData[2]) : "—"
                            color: (modelData.default || modelData[2]) ? ThemeTokens.text : ThemeTokens.subduedText
                            font.family: (modelData.default || modelData[2]) ? "Consolas, monospace" : undefined
                            font.pixelSize: 11
                            opacity: (modelData.default || modelData[2]) ? 0.9 : 0.4
                        }

                        // Description
                        Text {
                            width: parent.width - 430
                            text: modelData.description || modelData[3]
                            color: ThemeTokens.subduedText
                            font.pixelSize: 12
                            lineHeight: 1.3
                            wrapMode: Text.WordWrap
                        }
                    }
                }
            }
        }
    }
}
