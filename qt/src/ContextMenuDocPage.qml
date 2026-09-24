// ContextMenuDocPage.qml — Living Documentation for ChaSetContextMenu
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Context Menu"
    description: "Displays a contextual popup menu at pointer coordinates triggered by right-click interaction."

    property string lastAction: "Right-click the target area below"

    ComponentPreview {
        title: "Context Menu Sandbox"
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
        { id: "back", label: "Back", shortcut: "Alt+Left" },
        { id: "forward", label: "Forward", shortcut: "Alt+Right" },
        { id: "reload", label: "Reload", shortcut: "Ctrl+R" },
        { id: "inspect", label: "Inspect Element", shortcut: "F12" }
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
                spacing: ThemeTokens.dp(16)

                ChaSetContextMenu {
                    id: ctxMenu
                    width: ThemeTokens.dp(320)
                    height: ThemeTokens.dp(160)
                    items: [
                        { id: "back", label: "Back", shortcut: "Alt+Left" },
                        { id: "forward", label: "Forward", shortcut: "Alt+Right", disabled: true },
                        { id: "reload", label: "Reload", shortcut: "Ctrl+R" },
                        { id: "save", label: "Save As...", shortcut: "Ctrl+S" },
                        { id: "inspect", label: "Inspect Element", shortcut: "F12" }
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
                                text: "Right Click Inside This Area"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                            }

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "A native contextual popup will appear at pointer coordinates."
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                            }
                        }
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.lastAction
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetContextMenu {
    items: [
        { id: "back", label: "Back", shortcut: "Alt+Left" },
        { id: "forward", label: "Forward", shortcut: "Alt+Right" }
    ]
}`
        reactCode: `import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from '@chahu/cha-set';

<ContextMenu>
  <ContextMenuTrigger className="p-8 border rounded">
    Right click here
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem onSelect={() => console.log('Back')}>Back</ContextMenuItem>
    <ContextMenuItem onSelect={() => console.log('Forward')}>Forward</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>`
    }



    ComponentReference {
        name: "ContextMenu"
        componentId: "context-menu"
        propsModel: [
            { name: "items", type: "var[]", default: "[]", description: "Array of menu item descriptors: { id, label, icon, shortcut, destructive, disabled }." },
            { name: "menuWidth", type: "int", default: "180", description: "Width of the context menu popup panel." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the context menu." }
        ]
    }
}
        ]
    }
}
