// DialogDocPage.qml — Documentation and interactive sandbox for ChaSetDialog
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Components"
    pageTitle: "Dialog"
    description: "A modal window that interrupts the user with critical content and prompts for user action."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "installation", title: "Installation" },
        { id: "anatomy", title: "Anatomy" },
        { id: "examples", title: "Examples & States" },
        { id: "props", title: "Props Reference" }
    ]

    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    // Section 1: Interactive Overview
    ComponentPreview {
        id: heroPreview
        width: parent.width
        title: "Dialog Sandbox"
        reactCode: `<Dialog open={open} onOpenChange={setOpen}>\n  <DialogTrigger asChild>\n    <Button variant="outline">Open Profile Dialog</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Edit profile</DialogTitle>\n      <DialogDescription>\n        Make changes to your profile here. Click save when you're done.\n      </DialogDescription>\n    </DialogHeader>\n    <div className="grid gap-4 py-4">\n      <div className="grid grid-cols-4 items-center gap-4">\n        <label className="text-right text-sm">Name</label>\n        <Input className="col-span-3" defaultValue="Alex Rivera" />\n      </div>\n      <div className="grid grid-cols-4 items-center gap-4">\n        <label className="text-right text-sm">Username</label>\n        <Input className="col-span-3" defaultValue="@arivera" />\n      </div>\n    </div>\n    <DialogFooter>\n      <DialogClose asChild>\n        <Button variant="outline">Cancel</Button>\n      </DialogClose>\n      <Button>Save changes</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`
        qtCode: `ChaSetDialog {\n    id: profileDialog\n    title: "Edit profile"\n    description: "Make changes to your profile here. Click save when you're done."\n    dialogWidth: 480\n\n    Column {\n        width: parent.width\n        spacing: 12\n\n        Row {\n            spacing: 10\n            Text { text: "Name:"; width: 70; color: ThemeTokens.text }\n            ChaSetInput { width: 340; text: "Alex Rivera" }\n        }\n        Row {\n            spacing: 10\n            Text { text: "Username:"; width: 70; color: ThemeTokens.text }\n            ChaSetInput { width: 340; text: "@arivera" }\n        }\n    }\n\n    Row {\n        anchors.right: parent.right\n        spacing: 10\n        ChaSetButton {\n            variant: "outline"\n            text: "Cancel"\n            onClicked: profileDialog.reject()\n        }\n        ChaSetButton {\n            text: "Save changes"\n            onClicked: profileDialog.accept()\n        }\n    }\n}`

        stageData: [
            Column {
                anchors.centerIn: parent
                spacing: 14

                ChaSetButton {
                    text: "Open Profile Dialog"
                    variant: "outline"
                    anchors.horizontalCenter: parent.horizontalCenter
                    onClicked: profileDialog.open = true
                }

                Text {
                    text: "Current profile: " + nameInput.text + " (" + usernameInput.text + ")"
                    color: root.cMutedFg
                    font.pixelSize: 12
                    horizontalAlignment: Text.AlignHCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                }
            }
        ]
    }

    // Animations
    Column {
        width: parent.width
        spacing: 12

        Text { text: "Animations"; color: root.cFg; font.pixelSize: 18; font.weight: Font.Bold }

        Text { text: "Motion behavior and timing driven by ThemeTokens for the overlay and content on open and close."; color: root.cMutedFg; font.pixelSize: 13; wrapMode: Text.WordWrap; width: parent.width }

        Text { text: "• The root overlay and the card cross-fade between open and closed, with the card scaling subtly to emphasize entry."; color: root.cFg; font.pixelSize: 13; wrapMode: Text.WordWrap; width: parent.width }
        Text { text: "• Transitions use ThemeTokens.motionShort with the easeEntrance curve."; color: root.cFg; font.pixelSize: 13; wrapMode: Text.WordWrap; width: parent.width }
        Text { text: "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero and animations stop."; color: root.cFg; font.pixelSize: 13; wrapMode: Text.WordWrap; width: parent.width }
    }

    KeyboardShortcutsTable {
        componentId: "dialog"
    }

    // Section 2: Installation
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Installation"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "bash"
            code: "pnpm add @chahu/cha-set"
        }
    }

    // Section 3: Anatomy
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Anatomy"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Import and configure ChaSetDialog in your QML scene."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        ChaSetCodeBlock {
            width: parent.width
            language: "qml"
            code: `import ChaSet\n\nChaSetDialog {\n    id: myModal\n    title: "Dialog Title"\n    description: "Brief contextual description."\n\n    Text { text: "Dialog body content"; color: ThemeTokens.text }\n\n    Row {\n        anchors.right: parent.right\n        ChaSetButton { text: "Dismiss"; onClicked: myModal.closeDialog() }\n    }\n}`
        }
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Examples & States"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        Text {
            text: "Common modal dialog patterns: confirmation dialogs, forms, and informational notices."
            color: root.cMutedFg
            font.pixelSize: 13
        }

        Grid {
            width: parent.width
            columns: 2
            spacing: 16

            Rectangle {
                width: (parent.width - 16) / 2
                height: 130
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 16
                    spacing: 8

                    Text {
                        text: "Destructive Confirmation"
                        color: root.cFg
                        font.pixelSize: 13
                        font.weight: Font.DemiBold
                    }

                    Text {
                        text: "Dialog for destructive actions requiring explicit user confirmation."
                        color: root.cMutedFg
                        font.pixelSize: 12
                        wrapMode: Text.WordWrap
                        width: parent.width
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "destructive"
                        text: "Delete Account"
                        onClicked: confirmDialog.open = true
                    }
                }
            }

            Rectangle {
                width: (parent.width - 16) / 2
                height: 130
                radius: 8
                color: root.cCard
                border.color: root.cBorder

                Column {
                    anchors.fill: parent
                    anchors.margins: 16
                    spacing: 8

                    Text {
                        text: "Informational Notice"
                        color: root.cFg
                        font.pixelSize: 13
                        font.weight: Font.DemiBold
                    }

                    Text {
                        text: "Lightweight alert modal for system notices and scheduled maintenance."
                        color: root.cMutedFg
                        font.pixelSize: 12
                        wrapMode: Text.WordWrap
                        width: parent.width
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "secondary"
                        text: "System Update Notice"
                        onClicked: noticeDialog.open = true
                    }
                }
            }
        }
    }

    // Section 5: Props Reference
    Column {
        width: parent.width
        spacing: 12

        Text {
            text: "Props Reference"
            color: root.cFg
            font.pixelSize: 18
            font.weight: Font.Bold
        }

        PropsTable {
            width: parent.width
            propsModel: [
                {
                    name: "open",
                    type: "bool",
                    default: "false",
                    description: "Controls the visible / open state of the modal dialog."
                },
                {
                    name: "title",
                    type: "string",
                    default: "\"\"",
                    description: "Header title text displayed in prominent bold styling."
                },
                {
                    name: "description",
                    type: "string",
                    default: "\"\"",
                    description: "Header descriptive text displayed beneath the title."
                },
                {
                    name: "size",
                    type: "\"sm\" | \"default\" | \"lg\" | \"xl\" | \"full\"",
                    default: "\"default\"",
                    description: "Tiered size preset controlling modal card width."
                },
                {
                    name: "customRadius",
                    type: "int",
                    default: "8",
                    description: "Corner radius of the modal dialog card."
                },
                {
                    name: "dialogWidth",
                    type: "int",
                    default: "500",
                    description: "Explicit width of the dialog card override."
                },
                {
                    name: "showCloseButton",
                    type: "bool",
                    default: "true",
                    description: "Whether to render the close button in the top-right corner."
                },
                {
                    name: "showEscBadge",
                    type: "bool",
                    default: "false",
                    description: "Whether to display the ESC keyboard badge in the top-right header."
                },
                {
                    name: "closeOnOverlayClick",
                    type: "bool",
                    default: "true",
                    description: "Whether clicking the backdrop overlay dismisses the dialog."
                },
                {
                    name: "closeOnEscape",
                    type: "bool",
                    default: "true",
                    description: "Whether pressing Escape key dismisses the dialog."
                },
                {
                    name: "draggable",
                    type: "bool",
                    default: "true",
                    description: "Whether the dialog card can be dragged across the viewport."
                },
                {
                    name: "contentData",
                    type: "list<QtObject>",
                    default: "[]",
                    description: "Default property alias for body content elements."
                },
                {
                    name: "opened()",
                    type: "signal",
                    default: "—",
                    description: "Emitted when the modal has transitioned to open."
                },
                {
                    name: "closed()",
                    type: "signal",
                    default: "—",
                    description: "Emitted when the modal has closed."
                },
                {
                    name: "accepted()",
                    type: "signal",
                    default: "—",
                    description: "Emitted when the accept() function is invoked."
                },
                {
                    name: "rejected()",
                    type: "signal",
                    default: "—",
                    description: "Emitted when the reject() function or scrim / close button is triggered."
                }
            ]
        }
    }

    // Profile Dialog Instance
    ChaSetDialog {
        id: profileDialog
        title: "Edit profile"
        description: "Make changes to your profile here. Click save when you're done."
        dialogWidth: 480

        Column {
            width: parent.width
            spacing: 12

            Row {
                width: parent.width
                spacing: 10
                Text {
                    text: "Name"
                    width: 70
                    color: root.cFg
                    font.pixelSize: 13
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetInput {
                    id: nameInput
                    width: parent.width - 80
                    text: "Alex Rivera"
                }
            }

            Row {
                width: parent.width
                spacing: 10
                Text {
                    text: "Username"
                    width: 70
                    color: root.cFg
                    font.pixelSize: 13
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetInput {
                    id: usernameInput
                    width: parent.width - 80
                    text: "@arivera"
                }
            }
        }

        Row {
            anchors.right: parent.right
            spacing: 10

            ChaSetButton {
                size: "sm"
                variant: "outline"
                text: "Cancel"
                onClicked: profileDialog.reject()
            }

            ChaSetButton {
                size: "sm"
                text: "Save changes"
                onClicked: profileDialog.accept()
            }
        }
    }

    // Confirmation Destructive Dialog Instance
    ChaSetDialog {
        id: confirmDialog
        title: "Are you absolutely sure?"
        description: "This action cannot be undone. This will permanently delete your account."
        dialogWidth: 440

        Row {
            anchors.right: parent.right
            spacing: 10

            ChaSetButton {
                size: "sm"
                variant: "outline"
                text: "Cancel"
                onClicked: confirmDialog.reject()
            }

            ChaSetButton {
                size: "sm"
                variant: "destructive"
                text: "Yes, delete account"
                onClicked: confirmDialog.accept()
            }
        }
    }

    // Informational Notice Dialog Instance
    ChaSetDialog {
        id: noticeDialog
        title: "Scheduled Maintenance"
        description: "The cloud service will be undergoing scheduled infrastructure updates tonight at 02:00 UTC."
        dialogWidth: 440

        Text {
            text: "Expected downtime is under 10 minutes. All data remains encrypted and safe."
            color: root.cMutedFg
            font.pixelSize: 12
            wrapMode: Text.WordWrap
            width: parent.width
        }

        Row {
            anchors.right: parent.right
            ChaSetButton {
                size: "sm"
                text: "Understood"
                onClicked: noticeDialog.accept()
            }
        }
    }
}
