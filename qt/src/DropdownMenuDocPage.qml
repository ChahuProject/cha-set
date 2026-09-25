// DropdownMenuDocPage.qml — Living Documentation for ChaSetDropdownMenu
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Dropdown Menu"
    description: "Displays a menu to the user triggered by a button with item groups, icons, shortcuts, and destructive actions."

    property string lastAction: "None"

    ComponentPreview {
        title: "Dropdown Menu Sandbox"
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
                        { id: "profile", label: "Profile", shortcut: "⌘P" },
                        { id: "billing", label: "Billing", shortcut: "⌘B" },
                        { id: "settings", label: "Settings", shortcut: "⌘S" },
                        { id: "logout", label: "Log Out", destructive: true }
                    ]
                    onItemSelected: function(itemId) {
                        root.lastAction = "Selected: " + itemId
                    }

                    ChaSetButton {
                        anchors.fill: parent
                        text: "Options ▾"
                        variant: "outline"
                        onClicked: demoMenu.open = !demoMenu.open
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Action: " + root.lastAction
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
            { name: "open", type: "bool", default: "false", description: "Whether the menu popup is currently open." },
            { name: "items", type: "var[]", default: "[]", description: "Array of menu item descriptors: { id, label, icon, shortcut, destructive, disabled }." },
            { name: "menuWidth", type: "int", default: "180", description: "Width dimension of the popup menu panel." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the menu panel." }
        ]
    }
}
