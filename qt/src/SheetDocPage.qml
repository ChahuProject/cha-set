// SheetDocPage.qml — Living Documentation for ChaSetSheet
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Sheet"
    description: "Extends the dialog component to display content that complements the main screen via smooth sliding transitions from any viewport edge."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property string sheetSide: "right"

    ComponentPreview {
        title: "Sheet Preview"
        reactCode: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Right Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Edit profile</SheetTitle>
      <SheetDescription>Make changes to your profile here.</SheetDescription>
    </SheetHeader>
    <div className="grid gap-4 py-4">
      <Input defaultValue="Pedro Duarte" />
    </div>
  </SheetContent>
</Sheet>`
        qtCode: `ChaSetButton {
    text: "Open Sheet"
    variant: "outline"
    onClicked: sheet.open = true
}

ChaSetSheet {
    id: sheet
    side: "right"
    title: "Edit profile"
    description: "Make changes to your profile here."
    // ...content...
}`

        Item {
            anchors.fill: parent

            Row {
                anchors.centerIn: parent
                spacing: 12

                ChaSetButton {
                    text: "Open Right Sheet"
                    variant: "outline"
                    onClicked: {
                        root.sheetSide = "right"
                        demoSheet.open = true
                    }
                }

                ChaSetButton {
                    text: "Open Bottom Sheet"
                    variant: "outline"
                    onClicked: {
                        root.sheetSide = "bottom"
                        demoSheet.open = true
                    }
                }
            }

            ChaSetSheet {
                id: demoSheet
                side: root.sheetSide
                title: "Edit Account Profile"
                description: "Update your account handle and workspace configuration."

                Column {
                    anchors.fill: parent
                    spacing: 16

                    Column {
                        width: parent.width
                        spacing: 6
                        Text { text: "Display Name"; color: ThemeTokens.text; font.pixelSize: 12 }
                        ChaSetInput { width: parent.width; height: 32; text: "Alex Developer" }
                    }

                    Column {
                        width: parent.width
                        spacing: 6
                        Text { text: "Organization Role"; color: ThemeTokens.text; font.pixelSize: 12 }
                        ChaSetInput { width: parent.width; height: 32; text: "Staff Infrastructure Architect" }
                    }

                    Item { width: 1; height: 16 }

                    Row {
                        anchors.right: parent.right
                        spacing: 8
                        ChaSetButton {
                            text: "Save Changes"
                            variant: "default"
                            size: "sm"
                            onClicked: demoSheet.open = false
                        }
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetSheet { ... }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "sheet"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "open", type: "bool", default: "false", description: "Whether the sheet is currently open." },
            { name: "side", type: "string", default: "'right'", description: "The edge from which the sheet enters: 'top' | 'bottom' | 'left' | 'right'." },
            { name: "sheetSize", type: "int", default: "360", description: "Width (for left/right) or height (for top/bottom) of the sheet in pixels." },
            { name: "title", type: "string", default: "''", description: "Headline text in the sheet header." },
            { name: "description", type: "string", default: "''", description: "Subordinate description text in the header." }
        ]
    }
}
