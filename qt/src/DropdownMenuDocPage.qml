// DropdownMenuDocPage.qml — Living Documentation for ChaSetDropdownMenu
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Dropdown Menu"
    description: "Displays a menu to the user triggered by a button with item groups, icons, shortcuts, and destructive actions."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "props", title: "API Reference" }
    ]

    property string lastAction: "None"

    ComponentPreview {
        title: "Dropdown Menu Preview"
        reactCode: `<DropdownMenu items={items}>
  <Button variant="outline">Options ▾</Button>
</DropdownMenu>`
        qtCode: `ChaSetDropdownMenu {
    open: menuOpen
    items: [
        { id: "profile", label: "Profile", icon: "👤", shortcut: "⌘P" },
        { id: "settings", label: "Settings", icon: "⚙️", shortcut: "⌘S" },
        { id: "delete", label: "Delete", icon: "🗑️", destructive: true }
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
                spacing: 16

                ChaSetDropdownMenu {
                    id: demoMenu
                    anchors.horizontalCenter: parent.horizontalCenter
                    width: 120
                    height: 32
                    items: [
                        { id: "profile", label: "Profile", icon: "👤", shortcut: "⌘P" },
                        { id: "billing", label: "Billing", icon: "💳", shortcut: "⌘B" },
                        { id: "settings", label: "Settings", icon: "⚙️", shortcut: "⌘S" },
                        { id: "logout", label: "Log Out", icon: "🚪", destructive: true }
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

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Action: " + root.lastAction
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                    font.family: "monospace"
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetDropdownMenu { ... }"
        language: "qml"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "open", type: "bool", default: "false", description: "Whether the menu popup is currently open." },
            { name: "items", type: "var[]", default: "[]", description: "Array of menu item descriptors: { id, label, icon, shortcut, destructive, disabled }." },
            { name: "menuWidth", type: "int", default: "180", description: "Width of the popup menu panel in pixels." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the menu panel." }
        ]
    }
}
