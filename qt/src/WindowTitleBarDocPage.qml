// WindowTitleBarDocPage.qml — Living Documentation for ChaSetWindowTitleBar
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Window Title Bar"
    description: "Frameless desktop application window header with app branding, icon, drag region, and caption control buttons."

    property string lastAction: "Idle"

    ComponentPreview {
        title: "Window Title Bar Sandbox"
        reactCode: `<WindowTitleBar
  title="Render Debugger"
  icon={<ChaSetLogoIcon />}
  onMinimize={() => {}}
  onMaximize={() => {}}
  onClose={() => {}}
/>`
        qtCode: `ChaSetWindowTitleBar {
    width: parent.width
    title: "Chahu Render Studio"
    icon: "logo"
    onMinimizeClicked: console.log("minimize")
    onMaximizeClicked: console.log("maximize")
    onCloseClicked: console.log("close")
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)
                width: ThemeTokens.dp(440)

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(180)
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: ThemeTokens.dp(8)
                    clip: true

                    Column {
                        anchors.fill: parent

                        ChaSetWindowTitleBar {
                            width: parent.width
                            title: "Chahu Render Studio v2.4"
                            icon: "logo"
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

                                DocText {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: "Desktop Mock Window Frame"
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeBody
                                    font.weight: Typography.weightSemibold
                                }

                                Row {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    spacing: 8

                                    DocText {
                                        anchors.verticalCenter: parent.verticalCenter
                                        text: "Caption Event:"
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeSmall
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

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetWindowTitleBar {
    width: parent.width
    title: "ChaSet Desktop"
}`
        reactCode: `import { WindowTitleBar } from '@chahu/cha-set';

<WindowTitleBar title="ChaSet Desktop" onMinimize={() => {}} onMaximize={() => {}} onClose={() => {}} />`
    }



    "
        language: "qml"
    }

    
    ComponentReference {
        name: "WindowTitleBar"
        componentId: "window-title-bar"
        propsModel: [
            { name: "title", type: "string", default: "'ChaSet Desktop Studio'", description: "Headline text in the title bar." },
            { name: "icon", type: "string", default: "'logo'", description: "Vector icon identifier for application branding." },
            { name: "maximized", type: "bool", default: "false", description: "Whether the window is in maximized state." }
        ]
    }
}
        ]
    }
}
