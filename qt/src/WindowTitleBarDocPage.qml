// WindowTitleBarDocPage.qml — Living Documentation for ChaSetWindowTitleBar
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Window Title Bar"
    description: ChaSetI18n.tr("components.windowTitleBar.description", "Desktop window frame header with title, drag region, and minimize/maximize/close control buttons for frameless native windows.")

    property string lastActionKey: "idle"

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.windowTitleBar.sandboxTitle", "Window Title Bar Sandbox")
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
                            title: ChaSetI18n.tr("desktopComposite.windowTitleBar.appTitle", "Chahu Render Studio v2.4")
                            icon: "logo"
                            onMinimizeClicked: root.lastActionKey = "minimizeClicked"
                            onMaximizeClicked: root.lastActionKey = "maximizeClicked"
                            onCloseClicked: root.lastActionKey = "closeClicked"
                        }

                        Item {
                            width: parent.width
                            height: parent.height - 36

                            Column {
                                anchors.centerIn: parent
                                spacing: 8

                                DocText {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: ChaSetI18n.tr("desktopComposite.windowTitleBar.clientArea", "Desktop Mock Window Frame")
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeBody
                                    font.weight: Typography.weightSemibold
                                }

                                Row {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    spacing: 8

                                    DocText {
                                        anchors.verticalCenter: parent.verticalCenter
                                        text: ChaSetI18n.tr("desktopComposite.windowTitleBar.captionEvent", "Caption Event:")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeSmall
                                    }

                                    ChaSetBadge {
                                        anchors.verticalCenter: parent.verticalCenter
                                        variant: "secondary"
                                        text: ChaSetI18n.tr("desktopComposite.windowTitleBar." + root.lastActionKey, "Idle")
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

    
    ComponentReference {
        name: "WindowTitleBar"
        componentId: "window-title-bar"
        propsModel: [
            { name: "title", type: "string", default: "'ChaSet Desktop Studio'", description: ChaSetI18n.tr("components.windowTitleBar.titleDesc", "Window title label or element.") },
            { name: "icon", type: "string", default: "'logo'", description: ChaSetI18n.tr("components.windowTitleBar.iconDesc", "Application icon rendered at left edge.") },
            { name: "maximized", type: "bool", default: "false", description: ChaSetI18n.tr("components.windowTitleBar.maximizedDesc", "Whether the window is in maximized state.") }
        ]
    }
}
