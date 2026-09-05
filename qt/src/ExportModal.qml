// ExportModal.qml — Multi-Stack Config Exporter
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

ChaSetDialog {
    id: root

    property string exportTab: "qt"
    title: "Export & Copy Theme Configuration"
    description: "One-click copy tailored styles and component code for your target framework."
    dialogWidth: 680

    signal close()

    onClosed: root.close()
    onRejected: root.close()

    // Support both open and visible bindings
    onVisibleChanged: {
        if (visible !== open) open = visible
    }

    // Tabs
    ChaSetTabs {
        width: parent.width
        currentValue: root.exportTab
        onCurrentValueChanged: root.exportTab = currentValue

        ChaSetTabsList {
            ChaSetTabsTrigger { value: "qt"; text: "Qt / QML" }
            ChaSetTabsTrigger { value: "react"; text: "React Code" }
            ChaSetTabsTrigger { value: "css"; text: "CSS Variables" }
            ChaSetTabsTrigger { value: "tailwind"; text: "Tailwind v4" }
            ChaSetTabsTrigger { value: "json"; text: "JSON Spec" }
        }
    }

    Rectangle {
        width: parent.width
        height: 220
        color: ThemeTokens.background
        border.color: ThemeTokens.border
        radius: 4

        ChaSetScrollArea {
            anchors.fill: parent
            anchors.margins: 10
            showVerticalScrollBar: true
            showHorizontalScrollBar: true
            showButtons: false
            contentWidth: Math.max(width, exportText.implicitWidth)
            contentHeight: exportText.implicitHeight

            TextEdit {
                id: exportText
                readOnly: true
                selectByMouse: true
                text: {
                    if (root.exportTab === 'qt') {
                        return '// ChaSet Qt QML Component Usage\nimport QtQuick 6.10\nimport ChaSet\n\nChaSetButton {\n    variant: \"default\"\n    size: \"default\"\n    text: \"Launch Workspace\"\n}\n\nChaSetScrollArea {\n    width: 400; height: 300\n    showButtons: true\n}';
                    }
                    if (root.exportTab === 'react') {
                        return 'import { Button, ScrollArea } from \'@chahu/cha-set\';\nimport \'@chahu/cha-set/styles.css\';\n\n<Button variant=\"default\" size=\"default\">Launch Workspace</Button>\n<ScrollArea className=\"h-72 w-full\">...</ScrollArea>';
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
            }
        }
    }

    Row {
        anchors.right: parent.right
        spacing: 10
        ChaSetButton { size: "sm"; variant: "secondary"; text: "Close"; onClicked: { root.close(); root.closeDialog() } }
        ChaSetButton { size: "sm"; variant: "default"; text: "✓ Done"; onClicked: { root.close(); root.closeDialog() } }
    }
}
