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
    property string sheetSizePreset: "default"

    ComponentPreview {
        title: "Sheet Preview"
        reactCode: `<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Right Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right" size="default">
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
    size: "default"
    title: "Edit profile"
    description: "Make changes to your profile here."
    // ...content...
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 12

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 8

                    ChaSetButton {
                        text: "left"
                        variant: root.sheetSide === "left" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSide = "left"
                    }

                    ChaSetButton {
                        text: "right"
                        variant: root.sheetSide === "right" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSide = "right"
                    }

                    ChaSetButton {
                        text: "top"
                        variant: root.sheetSide === "top" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSide = "top"
                    }

                    ChaSetButton {
                        text: "bottom"
                        variant: root.sheetSide === "bottom" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSide = "bottom"
                    }
                }

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 8

                    ChaSetButton {
                        text: "sm"
                        variant: root.sheetSizePreset === "sm" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSizePreset = "sm"
                    }

                    ChaSetButton {
                        text: "default"
                        variant: root.sheetSizePreset === "default" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSizePreset = "default"
                    }

                    ChaSetButton {
                        text: "lg"
                        variant: root.sheetSizePreset === "lg" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSizePreset = "lg"
                    }

                    ChaSetButton {
                        text: "xl"
                        variant: root.sheetSizePreset === "xl" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSizePreset = "xl"
                    }
                }

                ChaSetButton {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Open " + root.sheetSide + " Sheet (" + root.sheetSizePreset + ")"
                    variant: "outline"
                    onClicked: demoSheet.open = true
                }
            }

            ChaSetSheet {
                id: demoSheet
                side: root.sheetSide
                size: root.sheetSizePreset
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

    ChaSetCodeBlock {
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
            { name: "size", type: "string", default: "'default'", description: "Preset drawer dimension sizing ('sm', 'default', 'lg', 'xl', 'full')." },
            { name: "customSheetSize", type: "int", default: "0", description: "Custom dimension override for width or height." },
            { name: "title", type: "string", default: "''", description: "Headline text in the sheet header." },
            { name: "description", type: "string", default: "''", description: "Subordinate description text in the header." },
            { name: "showCloseButton", type: "bool", default: "true", description: "Whether the header close button is displayed." },
            { name: "closeOnOverlayClick", type: "bool", default: "true", description: "Whether clicking outside dismisses the sheet." },
            { name: "closeOnEscape", type: "bool", default: "true", description: "Whether pressing Escape dismisses the sheet." }
        ]
    }
}
