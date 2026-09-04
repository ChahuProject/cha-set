// ExportModal.qml — Multi-Stack Config Exporter
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

Rectangle {
    id: root
    anchors.fill: parent
    z: 200
    color: Qt.rgba(0, 0, 0, 0.6)

    property string exportTab: "qt"
    property int customRadius: 8

    signal close()

    MouseArea { anchors.fill: parent; onClicked: root.close() }

    Rectangle {
        width: Math.min(parent.width - 40, 680)
        height: Math.min(parent.height - 60, 480)
        radius: root.customRadius
        color: ThemeTokens.panel
        border.color: ThemeTokens.border
        border.width: 1
        anchors.centerIn: parent

        MouseArea { anchors.fill: parent }

        Column {
            anchors.fill: parent
            anchors.margins: 20
            spacing: 14

            Row {
                width: parent.width
                Text { text: "Export & Copy Theme Configuration"; color: ThemeTokens.text; font.pixelSize: 16; font.weight: Font.Bold }
                Item { width: parent.width - 320; height: 1 }
                Text {
                    text: "✕"
                    color: ThemeTokens.subduedText
                    font.pixelSize: 16
                    MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.close() }
                }
            }

            // Tabs
            Row {
                spacing: 8
                Repeater {
                    model: [
                        ["qt", "Qt / QML"],
                        ["react", "React Code"],
                        ["css", "CSS Variables"],
                        ["tailwind", "Tailwind v4"],
                        ["json", "JSON Spec"]
                    ]
                    delegate: Rectangle {
                        required property var modelData
                        width: 100; height: 28; radius: 4
                        color: root.exportTab === modelData[0] ? ThemeTokens.accent : ThemeTokens.hover
                        Text { anchors.centerIn: parent; text: parent.modelData[1]; color: root.exportTab === parent.modelData[0] ? "#ffffff" : ThemeTokens.text; font.pixelSize: 12 }
                        MouseArea { anchors.fill: parent; cursorShape: Qt.PointingHandCursor; onClicked: root.exportTab = parent.modelData[0] }
                    }
                }
            }

            Rectangle {
                width: parent.width
                height: parent.height - 130
                color: ThemeTokens.background
                border.color: ThemeTokens.border
                radius: 4

                TextArea {
                    anchors.fill: parent
                    anchors.margins: 10
                    readOnly: true
                    text: {
                        if (root.exportTab === 'qt') {
                            return '// ChaSet Qt QML Component Usage\nimport QtQuick 6.10\nimport ChaSet\n\nChaSetButton {\n    variant: \"primary\"\n    size: \"md\"\n    text: \"Launch Workspace\"\n}\n\nChaSetScrollView {\n    width: 400; height: 300\n    showButtons: true\n}';
                        }
                        if (root.exportTab === 'react') {
                            return 'import { Button, ScrollArea } from \'@chahu/cha-set\';\nimport \'@chahu/cha-set/styles.css\';\n\n<Button variant=\"primary\" size=\"md\">Launch Workspace</Button>\n<ScrollArea className=\"h-72 w-full\">...</ScrollArea>';
                        }
                        if (root.exportTab === 'css') {
                            return ':root {\n  --radius: ' + root.customRadius + 'px;\n  --primary: ' + (ThemeTokens.dark ? '#30a0ff' : '#1d7ae0') + ';\n  --background: ' + (ThemeTokens.dark ? '#020817' : '#ffffff') + ';\n}';
                        }
                        if (root.exportTab === 'tailwind') {
                            return '@theme inline {\n  --color-primary: var(--primary);\n  --radius: ' + root.customRadius + 'px;\n}';
                        }
                        return '{\n  \"theme\": {\n    \"mode\": \"' + (ThemeTokens.dark ? 'dark' : 'light') + '\",\n    \"radius\": ' + root.customRadius + '\n  }\n}';
                    }
                    color: ThemeTokens.text
                    font.family: 'Consolas, monospace'
                    font.pixelSize: 12
                    background: null
                }
            }

            Row {
                anchors.right: parent.right
                spacing: 10
                ChaSetButton { size: "sm"; variant: "secondary"; text: "Close"; onClicked: root.close() }
                ChaSetButton { size: "sm"; variant: "primary"; text: "✓ Done"; onClicked: root.close() }
            }
        }
    }
}
