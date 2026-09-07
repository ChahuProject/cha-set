// ContextMenuDocPage.qml — Living Documentation for ChaSetContextMenu
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Context Menu"
    description: "Displays a contextual popup menu at pointer coordinates triggered by right-click interaction."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "props", title: "API Reference" }
    ]

    property string lastAction: "Right-click the target area below"

    ComponentPreview {
        title: "Context Menu Preview"
        reactCode: `<ContextMenu>
  <ContextMenuTrigger className="border-dashed p-12">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Back</ContextMenuItem>
    <ContextMenuItem>Reload</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`
        qtCode: `ChaSetContextMenu {
    items: [
        { id: "back", label: "Back", icon: "◀", shortcut: "Alt+Left" },
        { id: "forward", label: "Forward", icon: "▶", shortcut: "Alt+Right" },
        { id: "reload", label: "Reload", icon: "🔄", shortcut: "Ctrl+R" },
        { id: "inspect", label: "Inspect Element", icon: "🔍", shortcut: "F12" }
    ]
    onItemSelected: function(id) { console.log(id) }

    Rectangle {
        // Target canvas to receive right-click
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                ChaSetContextMenu {
                    id: ctxMenu
                    width: 320
                    height: 160
                    items: [
                        { id: "back", label: "Back", icon: "◀", shortcut: "Alt+Left" },
                        { id: "forward", label: "Forward", icon: "▶", shortcut: "Alt+Right", disabled: true },
                        { id: "reload", label: "Reload", icon: "🔄", shortcut: "Ctrl+R" },
                        { id: "save", label: "Save As...", icon: "💾", shortcut: "Ctrl+S" },
                        { id: "inspect", label: "Inspect Element", icon: "🔍", shortcut: "F12" }
                    ]
                    onItemSelected: function(itemId) {
                        root.lastAction = "Action selected: " + itemId
                    }

                    Rectangle {
                        anchors.fill: parent
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: 8

                        Column {
                            anchors.centerIn: parent
                            spacing: 8

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "🖱️ Right Click Inside This Area"
                                color: ThemeTokens.text
                                font.pixelSize: 13
                                font.weight: Font.DemiBold
                            }

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "A native contextual popup will appear at pointer coordinates."
                                color: ThemeTokens.subduedText
                                font.pixelSize: 11
                            }
                        }
                    }
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.lastAction
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                    font.family: "monospace"
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetContextMenu { ... }"
        language: "qml"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "items", type: "var[]", default: "[]", description: "Array of menu item descriptors: { id, label, icon, shortcut, destructive, disabled }." },
            { name: "menuWidth", type: "int", default: "180", description: "Width of the context menu popup panel." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the context menu." }
        ]
    }
}
