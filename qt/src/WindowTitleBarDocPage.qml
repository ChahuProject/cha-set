// WindowTitleBarDocPage.qml — Living Documentation for ChaSetWindowTitleBar
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Window Title Bar"
    description: "Frameless desktop application window header with app branding, icon, drag region, and caption control buttons."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property string lastAction: "Idle"

    ComponentPreview {
        title: "Window Title Bar Preview"
        reactCode: `<WindowTitleBar
  title="Render Debugger"
  icon="🍵"
  onMinimize={() => {}}
  onMaximize={() => {}}
  onClose={() => {}}
/>`
        qtCode: `ChaSetWindowTitleBar {
    width: parent.width
    title: "Chahu Render Studio"
    icon: "🍵"
    onMinimizeClicked: console.log("minimize")
    onMaximizeClicked: console.log("maximize")
    onCloseClicked: console.log("close")
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16
                width: 440

                Rectangle {
                    width: parent.width
                    height: 180
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: 8
                    clip: true

                    Column {
                        anchors.fill: parent

                        ChaSetWindowTitleBar {
                            width: parent.width
                            title: "Chahu Render Studio v2.4"
                            icon: "🍵"
                            onMinimizeClicked: root.lastAction = "Minimize clicked"
                            onMaximizeClicked: root.lastAction = "Maximize / Restore clicked"
                            onCloseClicked: root.lastAction = "Close clicked"
                        }

                        Item {
                            width: parent.width
                            height: parent.height - 36

                            Column {
                                anchors.centerIn: parent
                                spacing: 8

                                Text {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: "Desktop Mock Window Frame"
                                    color: ThemeTokens.text
                                    font.pixelSize: 13
                                    font.weight: Font.DemiBold
                                }

                                Row {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    spacing: 8

                                    Text {
                                        anchors.verticalCenter: parent.verticalCenter
                                        text: "Caption Event:"
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: 12
                                    }

                                    ChaSetBadge {
                                        anchors.verticalCenter: parent.verticalCenter
                                        variant: "secondary"
                                        text: root.lastAction
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetWindowTitleBar { title: \"App Header\" }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "window-title-bar"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "title", type: "string", default: "'ChaSet Desktop Studio'", description: "Headline text in the title bar." },
            { name: "icon", type: "string", default: "'🍵'", description: "Emoji or icon glyph for application branding." },
            { name: "maximized", type: "bool", default: "false", description: "Whether the window is in maximized state." }
        ]
    }
}
