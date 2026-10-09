// ContextMenuDocPage.qml — Living Documentation for ChaSetContextMenu
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Context Menu"
    description: ChaSetI18n.tr("components.contextMenu.description", "Displays a menu located at the pointer coordinates on right-click or desktop context gesture.")

    property string lastAction: "idle"

    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.contextMenu.overviewDesc", "Right-click (or long press) inside the dashed container below to reveal the context menu.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.contextMenu.sandboxTitle", "Context Menu Sandbox")
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
                        { id: "back", label: ChaSetI18n.tr("overlays.contextMenu.back", "Back"), shortcut: "Alt+Left" },
                        { id: "forward", label: ChaSetI18n.tr("overlays.contextMenu.forward", "Forward"), shortcut: "Alt+Right", disabled: true },
                        { id: "reload", label: ChaSetI18n.tr("overlays.contextMenu.reload", "Reload"), shortcut: "Ctrl+R" },
                        { id: "save", label: ChaSetI18n.tr("overlays.contextMenu.saveAs", "Save As..."), shortcut: "Ctrl+S" },
                        { id: "inspect", label: ChaSetI18n.tr("overlays.contextMenu.inspectElement", "Inspect Element"), shortcut: "F12" }
                    ]
                    onItemSelected: function(itemId) {
                        root.lastAction = itemId
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
                                text: ChaSetI18n.tr("overlays.contextMenu.rightClickAreaTitle", "Right Click Inside This Area")
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightSemibold
                            }

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: ChaSetI18n.tr("overlays.contextMenu.rightClickAreaDesc", "A native contextual popup will appear at pointer coordinates.")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                            }
                        }
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.lastAction === "idle" ? ChaSetI18n.tr("overlays.contextMenu.statusIdle", "Right-click the target area below") : ChaSetI18n.tr("overlays.contextMenu.statusSelected", "Action selected: {{id}}", { id: root.lastAction })
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
            { name: "items", type: "var[]", default: "[]", description: ChaSetI18n.tr("components.contextMenu.itemsDesc", "Array of menu item descriptors: { id, label, icon, shortcut, destructive, disabled }.") },
            { name: "menuWidth", type: "int", default: "180", description: ChaSetI18n.tr("components.contextMenu.menuWidthDesc", "Width of the context menu popup panel.") },
            { name: "customRadius", type: "int", default: "6", description: ChaSetI18n.tr("components.contextMenu.customRadiusDesc", "Corner radius of the context menu.") }
        ]
    }
}
