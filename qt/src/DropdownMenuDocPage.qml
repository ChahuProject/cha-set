// DropdownMenuDocPage.qml — Living Documentation for ChaSetDropdownMenu
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Dropdown Menu"
    description: ChaSetI18n.tr("components.dropdownMenu.description", "Displays a menu to the user triggered by a button, supporting items, labels, separators, shortcuts, and destructive actions.")

    property string lastAction: "None"

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
            text: ChaSetI18n.tr("desktopComposite.dropdownMenu.overviewDesc", "Click the trigger below to open the dropdown menu. Keyboard navigation and shortcuts are fully supported.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.dropdownMenu.sandboxTitle", "Dropdown Menu Sandbox")
        reactCode: `<DropdownMenu items={items}>
  <Button variant="outline">Options ▾</Button>
</DropdownMenu>`
        qtCode: `ChaSetDropdownMenu {
    open: menuOpen
    items: [
        { id: "profile", label: "Profile", shortcut: "⌘P" },
        { id: "settings", label: "Settings", shortcut: "⌘S" },
        { id: "delete", label: "Delete", destructive: true }
    ]
    onItemSelected: function(id) { console.log(id) }

    ChaSetButton {
        text: "Options ▾"
        variant: "outline"
        onClicked: parent.open = !parent.open
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)

                ChaSetDropdownMenu {
                    id: demoMenu
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: ThemeTokens.dp(120)
                    height: ThemeTokens.dp(32)
                    items: [
                        { id: "profile", label: ChaSetI18n.tr("overlays.dropdownMenu.profile", "Profile"), shortcut: "⌘P" },
                        { id: "billing", label: ChaSetI18n.tr("overlays.dropdownMenu.billing", "Billing"), shortcut: "⌘B" },
                        { id: "settings", label: ChaSetI18n.tr("overlays.dropdownMenu.settings", "Settings"), shortcut: "⌘S" },
                        { id: "logout", label: ChaSetI18n.tr("overlays.dropdownMenu.logout", "Log out"), destructive: true }
                    ]
                    onItemSelected: function(itemId) {
                        root.lastAction = itemId
                    }

                    ChaSetButton {
                        anchors.fill: parent
                        text: ChaSetI18n.tr("overlays.dropdownMenu.options", "Options ▾")
                        variant: "outline"
                        onClicked: demoMenu.open = !demoMenu.open
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.lastAction === "None" ? ChaSetI18n.tr("overlays.dropdownMenu.actionNone", "Action: None") : ChaSetI18n.tr("overlays.dropdownMenu.actionSelected", "Action: Selected: {{id}}", { id: root.lastAction })
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

ChaSetDropdownMenu {
    items: [
        { id: "profile", label: "Profile", shortcut: "⌘P" },
        { id: "settings", label: "Settings", shortcut: "⌘," }
    ]
}`
        reactCode: `import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, Button } from '@chahu/cha-set';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => {}}>Profile</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => {}}>Settings</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`
    }



    ComponentReference {
        name: "DropdownMenu"
        componentId: "dropdown-menu"
        propsModel: [
            { name: "open", type: "bool", default: "false", description: ChaSetI18n.tr("components.dropdownMenu.openDescQt", "Whether the menu popup is currently open.") },
            { name: "items", type: "var[]", default: "[]", description: ChaSetI18n.tr("components.dropdownMenu.itemsDescQt", "Array of menu item descriptors: { id, label, icon, shortcut, destructive, disabled }.") },
            { name: "menuWidth", type: "int", default: "180", description: ChaSetI18n.tr("components.dropdownMenu.menuWidthDesc", "Width dimension of the popup menu panel.") },
            { name: "customRadius", type: "int", default: "6", description: ChaSetI18n.tr("components.dropdownMenu.customRadiusDesc", "Corner radius of the menu panel.") }
        ]
    }
}
