// SheetDocPage.qml — Living Documentation for ChaSetSheet
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Sheet"
    description: ChaSetI18n.tr("components.sheet.description", "Extends the dialog component to display content that slides in from any screen edge (top, right, bottom, left).")

    property string sheetSide: "right"
    property string sheetSizePreset: "default"

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.sheet.sandboxTitle", "Sheet Sandbox")
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
                        text: ChaSetI18n.tr("overlays.sheet.sideLeft", "Left")
                        variant: root.sheetSide === "left" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSide = "left"
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("overlays.sheet.sideRight", "Right")
                        variant: root.sheetSide === "right" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSide = "right"
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("overlays.sheet.sideTop", "Top")
                        variant: root.sheetSide === "top" ? "default" : "outline"
                        size: "sm"
                        onClicked: root.sheetSide = "top"
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("overlays.sheet.sideBottom", "Bottom")
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
                    text: ChaSetI18n.tr("overlays.sheet.openSheetQt", "Open {{side}} Sheet ({{size}})", { side: root.sheetSide, size: root.sheetSizePreset })
                    variant: "outline"
                    onClicked: demoSheet.open = true
                }
            }

            ChaSetSheet {
                id: demoSheet
                side: root.sheetSide
                size: root.sheetSizePreset
                title: ChaSetI18n.tr("overlays.sheet.editAccountProfileTitle", "Edit Account Profile")
                description: ChaSetI18n.tr("overlays.sheet.editAccountProfileDesc", "Update your account handle and workspace configuration.")

                Column {
                    anchors.fill: parent
                    spacing: 16

                    Column {
                        width: parent.width
                        spacing: 6
                        DocText { text: ChaSetI18n.tr("overlays.sheet.displayName", "Display Name"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                        ChaSetInput { width: parent.width; height: 32; text: ChaSetI18n.tr("desktopComposite.sheet.demoName", "Alex Developer") }
                    }

                    Column {
                        width: parent.width
                        spacing: 6
                        DocText { text: ChaSetI18n.tr("overlays.sheet.organizationRole", "Organization Role"); color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall }
                        ChaSetInput { width: parent.width; height: 32; text: ChaSetI18n.tr("desktopComposite.sheet.demoRole", "Staff Infrastructure Architect") }
                    }

                    Item { width: 1; height: 16 }

                    Row {
                        anchors.right: parent.right
                        spacing: 8
                        ChaSetButton {
                            text: ChaSetI18n.tr("common.saveChanges", "Save Changes")
                            variant: "default"
                            size: "sm"
                            onClicked: demoSheet.open = false
                        }
                    }
                }
            }
        }
    }

        DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetSheet {
    side: "right"
    title: "Sheet Title"
    description: "Drawer content description."
}`
        reactCode: `import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, Button } from '@chahu/cha-set';

<Sheet>
  <SheetTrigger asChild>
    <Button variant="outline">Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Sheet Title</SheetTitle>
      <SheetDescription>Drawer content description.</SheetDescription>
    </SheetHeader>
  </SheetContent>
</Sheet>`
    }

    // Animations
    Column {
        width: parent.width
        spacing: 12

        DocText { text: ChaSetI18n.tr("showcase.animations", "Animations"); color: ThemeTokens.text; font.pixelSize: Typography.sizeTitleSm; font.weight: Typography.weightBold }

        DocText { text: ChaSetI18n.tr("desktopComposite.sheet.animationsDescQt", "Motion behavior and timing driven by ThemeTokens for the backdrop and sliding panel."); color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }

        DocText { text: ChaSetI18n.tr("desktopComposite.sheet.animationsBullet1Qt", "The panel translates along its entry edge while the backdrop cross-fades its opacity."); color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: ChaSetI18n.tr("desktopComposite.sheet.animationsBullet2Qt", "Transitions use ThemeTokens.motionMedium with the easeEmphasized curve for a deliberate slide."); color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
        DocText { text: ChaSetI18n.tr("desktopComposite.sheet.animationsBullet3Qt", "All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero and animations stop."); color: ThemeTokens.text; font.pixelSize: Typography.sizeBody; wrapMode: TextEdit.WordWrap; width: parent.width }
    }

    ComponentReference {
        name: "Sheet"
        componentId: "sheet"
        propsModel: [
            { name: "open", type: "bool", default: "false", description: ChaSetI18n.tr("components.sheet.openDescQt", "Whether the sheet is currently open.") },
            { name: "side", type: "string", default: "'right'", description: ChaSetI18n.tr("components.sheet.sideDescQt", "The edge from which the sheet enters: 'top' | 'bottom' | 'left' | 'right'.") },
            { name: "size", type: "string", default: "'default'", description: ChaSetI18n.tr("components.sheet.sizeDescQt", "Preset drawer dimension sizing ('sm', 'default', 'lg', 'xl', 'full').") },
            { name: "customSheetSize", type: "int", default: "0", description: ChaSetI18n.tr("components.sheet.customSheetSizeDesc", "Custom dimension override for width or height.") },
            { name: "title", type: "string", default: "''", description: ChaSetI18n.tr("components.sheet.titleDesc", "Headline text in the sheet header.") },
            { name: "description", type: "string", default: "''", description: ChaSetI18n.tr("components.sheet.descriptionDesc", "Subordinate description text in the header.") },
            { name: "showCloseButton", type: "bool", default: "true", description: ChaSetI18n.tr("components.sheet.showCloseButtonDescQt", "Whether the header close button is displayed.") },
            { name: "closeOnOverlayClick", type: "bool", default: "true", description: ChaSetI18n.tr("components.sheet.closeOnOverlayClickDescQt", "Whether clicking outside dismisses the sheet.") },
            { name: "closeOnEscape", type: "bool", default: "true", description: ChaSetI18n.tr("components.sheet.closeOnEscapeDesc", "Whether pressing Escape dismisses the sheet.") }
        ]
    }
}
