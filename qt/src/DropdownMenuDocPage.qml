// DropdownMenuDocPage.qml — Living Documentation for ChaSetDropdownMenu
import QtQuick
import QtQuick.Controls
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
        reactCode: `<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Options ▾</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuGroup>
      <DropdownMenuLabel>Account Settings</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem tooltip="View account profile">
        Profile
        <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem tooltip="Manage billing and invoices">
        Billing
        <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
      </DropdownMenuItem>
      <DropdownMenuItem tooltip="View keyboard navigation shortcuts">
        Keyboard shortcuts
        <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuGroup>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive" tooltip="Sign out of current account">
      Log out
      <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`
        qtCode: `ChaSetDropdownMenu {
    open: menuOpen
    items: [
        { id: "profile", label: "Profile", shortcut: "⌘P", tooltip: "View account profile" },
        { id: "billing", label: "Billing", shortcut: "⌘B", tooltip: "Manage billing and invoices" },
        { id: "settings", label: "Settings", shortcut: "⌘S", tooltip: "View keyboard navigation shortcuts" },
        { id: "logout", label: "Log out", destructive: true, tooltip: "Sign out of current account" }
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
                        { id: "profile", label: ChaSetI18n.tr("overlays.dropdownMenu.profile", "Profile"), shortcut: "⌘P", tooltip: ChaSetI18n.tr("overlays.dropdownMenu.profileTooltip", "View account profile") },
                        { id: "billing", label: ChaSetI18n.tr("overlays.dropdownMenu.billing", "Billing"), shortcut: "⌘B", tooltip: ChaSetI18n.tr("overlays.dropdownMenu.billingTooltip", "Manage billing and invoices") },
                        { id: "settings", label: ChaSetI18n.tr("overlays.dropdownMenu.settings", "Settings"), shortcut: "⌘S", tooltip: ChaSetI18n.tr("overlays.dropdownMenu.shortcutsTooltip", "View keyboard navigation shortcuts") },
                        { id: "logout", label: ChaSetI18n.tr("overlays.dropdownMenu.logout", "Log out"), destructive: true, tooltip: ChaSetI18n.tr("overlays.dropdownMenu.logoutTooltip", "Sign out of current account") }
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



    DocMarkdown {
        width: parent.width
        docId: "dropdown-menu"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "dropdown-menu"
        section: "props"
    }
}
