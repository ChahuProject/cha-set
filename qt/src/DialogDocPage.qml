// DialogDocPage.qml — Documentation and interactive sandbox for ChaSetDialog
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Dialog"
    description: ChaSetI18n.tr("components.dialog.description", "A modal window that interrupts the user with critical content and prompts for user action.")
    property int customRadius: 8
    property color cFg: ThemeTokens.text
    property color cMutedFg: ThemeTokens.subduedText
    property color cCard: ThemeTokens.panel
    property color cBorder: ThemeTokens.border
    property color cPrimary: ThemeTokens.accent
    property color cAccentBg: ThemeTokens.hover

    // Section 1: Interactive Overview
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
            text: ChaSetI18n.tr("desktopComposite.dialog.overviewDesc", "Experience full modal behavior with backdrop blur, keyboard ESC dismissal, and focus containment across Web and Desktop.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        id: heroPreview
        width: parent.width
        stageHeight: 200
        title: ChaSetI18n.tr("desktopComposite.dialog.sandboxTitle", "Dialog Sandbox")
        reactCode: `<Dialog open={open} onOpenChange={setOpen}>\n  <DialogTrigger asChild>\n    <Button variant="outline">Open Profile Dialog</Button>\n  </DialogTrigger>\n  <DialogContent size="sm">\n    <DialogHeader>\n      <DialogTitle>Edit profile</DialogTitle>\n      <DialogDescription>\n        Make changes to your profile here. Click save when you're done.\n      </DialogDescription>\n    </DialogHeader>\n    <div className="rounded-lg bg-muted/40 p-1 flex flex-col gap-0.5 my-2">\n      <SettingRow name="Name" size="sm" className="py-1.5 px-2.5">\n        <Input id="name" defaultValue="Alex Rivera" className="h-8 w-52 text-xs bg-background/80 shadow-2xs" />\n      </SettingRow>\n      <SettingRow name="Username" size="sm" className="py-1.5 px-2.5">\n        <Input id="username" defaultValue="@arivera" className="h-8 w-52 text-xs bg-background/80 shadow-2xs" />\n      </SettingRow>\n    </div>\n    <DialogFooter>\n      <DialogClose asChild>\n        <Button variant="outline" size="sm">Cancel</Button>\n      </DialogClose>\n      <Button size="sm" type="submit">Save changes</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`
        qtCode: `ChaSetDialog {\n    id: profileDialog\n    title: "Edit profile"\n    description: "Make changes to your profile here. Click save when you're done."\n    size: "sm"\n    dialogWidth: ThemeTokens.dp(400)\n    showCloseButton: true\n\n    Rectangle {\n        width: parent.width\n        implicitHeight: formCol.implicitHeight + ThemeTokens.dp(8)\n        height: implicitHeight\n        radius: ThemeTokens.dp(8)\n        color: ThemeTokens.panelRaised\n\n        Column {\n            id: formCol\n            width: parent.width\n            padding: ThemeTokens.dp(4)\n            spacing: ThemeTokens.dp(2)\n\n            ChaSetSettingRow {\n                width: parent.width - ThemeTokens.dp(8)\n                name: "Name"\n                size: "sm"\n                controlWidth: ThemeTokens.dp(210)\n                ChaSetInput {\n                    width: parent.width\n                    text: "Alex Rivera"\n                }\n            }\n\n            ChaSetSettingRow {\n                width: parent.width - ThemeTokens.dp(8)\n                name: "Username"\n                size: "sm"\n                controlWidth: ThemeTokens.dp(210)\n                ChaSetInput {\n                    width: parent.width\n                    text: "@arivera"\n                }\n            }\n        }\n    }\n\n    footer: Row {\n        anchors.right: parent.right\n        spacing: ThemeTokens.dp(8)\n        ChaSetButton {\n            size: "sm"\n            variant: "outline"\n            text: "Cancel"\n            onClicked: profileDialog.reject()\n        }\n        ChaSetButton {\n            size: "sm"\n            text: "Save changes"\n            onClicked: profileDialog.accept()\n        }\n    }\n}`

        stageData: [
            Column {
                anchors.centerIn: parent
                spacing: 14

                ChaSetButton {
                    text: ChaSetI18n.tr("overlays.dialog.openProfile", "Open Profile Dialog")
                    variant: "outline"
                    anchors.horizontalCenter: parent.horizontalCenter
                    onClicked: profileDialog.open = true
                }

                DocText {
                    text: ChaSetI18n.tr("overlays.dialog.currentProfile", "Current profile: {{name}} ({{username}})", { name: nameInput.text, username: usernameInput.text })
                    color: root.cMutedFg
                    font.pixelSize: Typography.sizeSmall
                    horizontalAlignment: Text.AlignHCenter
                    anchors.horizontalCenter: parent.horizontalCenter
                }
            }
        ]
    }

    // Section 2: Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetDialog {\n    open: dialogOpen\n    size: "default"\n    title: "Dialog Title"\n    description: "Dialog Description"\n    showCloseButton: true\n    onAccepted: dialogOpen = false\n    onRejected: dialogOpen = false\n}`
        reactCode: `import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose, Button } from '@chahu/cha-set';\n\n<Dialog>\n  <DialogTrigger asChild>\n    <Button>Open</Button>\n  </DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Dialog Title</DialogTitle>\n      <DialogDescription>Dialog Description</DialogDescription>\n    </DialogHeader>\n    <DialogFooter>\n      <DialogClose asChild>\n        <Button variant="outline">Cancel</Button>\n      </DialogClose>\n      <Button>Confirm</Button>\n    </DialogFooter>\n  </DialogContent>\n</Dialog>`
    }

    // Section 4: Examples & States
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("showcase.examplesAndStates", "Examples & States")
            color: root.cFg
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.dialog.examplesDesc", "Common modal dialog patterns: desktop draggable windows, confirmation dialogs, and alert notices.")
            color: root.cMutedFg
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 3
            spacing: ThemeTokens.dp(16)

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(16)
                    rightPadding: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)

                    DocText {
                        text: ChaSetI18n.tr("overlays.dialog.desktopDraggableTitle", "Desktop Draggable Modal")
                        color: root.cFg
                        font.pixelSize: Typography.sizeBody
                        font.weight: Typography.weightSemibold
                    }

                    DocText {
                        text: ChaSetI18n.tr("overlays.dialog.desktopDraggableDesc", "Draggable modal with size presets, auto-fitting height, and fixed footer.")
                        color: root.cMutedFg
                        font.pixelSize: Typography.sizeSmall
                        wrapMode: TextEdit.WordWrap
                        width: parent.width - ThemeTokens.dp(32)
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "outline"
                        text: ChaSetI18n.tr("overlays.dialog.openDraggableWindow", "Open Draggable Window")
                        onClicked: desktopDialog.open = true
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(16)
                    rightPadding: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)

                    DocText {
                        text: ChaSetI18n.tr("overlays.dialog.destructiveConfirmationTitle", "Destructive Confirmation")
                        color: root.cFg
                        font.pixelSize: Typography.sizeBody
                        font.weight: Typography.weightSemibold
                    }

                    DocText {
                        text: ChaSetI18n.tr("overlays.dialog.destructiveConfirmationDesc", "Dialog for destructive actions requiring explicit user confirmation.")
                        color: root.cMutedFg
                        font.pixelSize: Typography.sizeSmall
                        wrapMode: TextEdit.WordWrap
                        width: parent.width - ThemeTokens.dp(32)
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "destructive"
                        text: ChaSetI18n.tr("overlays.dialog.deleteAccount", "Delete Account")
                        onClicked: confirmDialog.open = true
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: 8
                Column {
                    width: parent.width
                    topPadding: ThemeTokens.dp(16)
                    bottomPadding: ThemeTokens.dp(16)
                    leftPadding: ThemeTokens.dp(16)
                    rightPadding: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)

                    DocText {
                        text: ChaSetI18n.tr("overlays.dialog.informationalNoticeTitle", "Informational Notice")
                        color: root.cFg
                        font.pixelSize: Typography.sizeBody
                        font.weight: Typography.weightSemibold
                    }

                    DocText {
                        text: ChaSetI18n.tr("overlays.dialog.informationalNoticeDesc", "Lightweight alert modal for system notices and scheduled maintenance.")
                        color: root.cMutedFg
                        font.pixelSize: Typography.sizeSmall
                        wrapMode: TextEdit.WordWrap
                        width: parent.width - ThemeTokens.dp(32)
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "secondary"
                        text: ChaSetI18n.tr("overlays.dialog.systemUpdateNotice", "System Update Notice")
                        onClicked: noticeDialog.open = true
                    }
                }
            }
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "dialog"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "dialog"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "dialog"
        section: "props"
    }

    // Profile Dialog Instance
    ChaSetDialog {
        id: profileDialog
        title: ChaSetI18n.tr("overlays.dialog.editProfileTitle", "Edit profile")
        description: ChaSetI18n.tr("overlays.dialog.editProfileDesc", "Make changes to your profile here. Click save when you're done.")
        size: "sm"
        dialogWidth: ThemeTokens.dp(400)

        Rectangle {
            id: formCard
            width: parent.width
            implicitHeight: formCol.implicitHeight + ThemeTokens.dp(8)
            height: implicitHeight
            radius: ThemeTokens.dp(8)
            color: ThemeTokens.panelRaised

            Column {
                id: formCol
                width: parent.width
                padding: ThemeTokens.dp(4)
                spacing: ThemeTokens.dp(2)

                ChaSetSettingRow {
                    width: parent.width - ThemeTokens.dp(8)
                    name: ChaSetI18n.tr("overlays.dialog.name", "Name")
                    size: "sm"
                    controlWidth: ThemeTokens.dp(210)
                    ChaSetInput {
                        id: nameInput
                        width: parent.width
                        text: ChaSetI18n.tr("desktopComposite.dialog.demoName", "Alex Rivera")
                    }
                }

                ChaSetSettingRow {
                    width: parent.width - ThemeTokens.dp(8)
                    name: ChaSetI18n.tr("overlays.dialog.username", "Username")
                    size: "sm"
                    controlWidth: ThemeTokens.dp(210)
                    ChaSetInput {
                        id: usernameInput
                        width: parent.width
                        text: "@arivera"
                    }
                }
            }
        }

        footer: Row {
            anchors.right: parent.right
            spacing: ThemeTokens.dp(8)

            ChaSetButton {
                size: "sm"
                variant: "outline"
                text: ChaSetI18n.tr("common.cancel", "Cancel")
                onClicked: profileDialog.reject()
            }

            ChaSetButton {
                size: "sm"
                text: ChaSetI18n.tr("common.saveChanges", "Save changes")
                onClicked: profileDialog.accept()
            }
        }
    }

    // Desktop Draggable Modal Instance
    ChaSetDialog {
        id: desktopDialog
        title: ChaSetI18n.tr("overlays.dialog.advancedDesktopTitle", "Advanced Desktop Tool")
        description: ChaSetI18n.tr("overlays.dialog.advancedDesktopDesc", "Drag the title bar or window body to reposition. Switch size presets from the top-right button.")
        dialogWidth: 520
        draggable: true

        DocText {
            text: ChaSetI18n.tr("overlays.dialog.fixedFooterDesc", "The bottom actions area is extracted as a fixed footer that stays pinned during vertical scrolling.")
            color: root.cMutedFg
            font.pixelSize: Typography.sizeSmall
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }

        Row {
            anchors.right: parent.right
            ChaSetButton {
                size: "sm"
                text: ChaSetI18n.tr("overlays.dialog.confirm", "Confirm")
                onClicked: desktopDialog.accept()
            }
        }
    }

    // Confirmation Destructive Dialog Instance
    ChaSetDialog {
        id: confirmDialog
        variant: "alert"
        destructive: true
        title: ChaSetI18n.tr("overlays.dialog.areYouSure", "Are you absolutely sure?")
        description: ChaSetI18n.tr("overlays.dialog.deleteAccountDesc", "This action cannot be undone. This will permanently delete your account.")
        confirmText: ChaSetI18n.tr("overlays.dialog.yesDeleteAccount", "Yes, delete account")
        cancelText: ChaSetI18n.tr("common.cancel", "Cancel")
        dialogWidth: 440
    }

    // Informational Notice Dialog Instance
    ChaSetDialog {
        id: noticeDialog
        title: ChaSetI18n.tr("overlays.dialog.scheduledMaintenance", "Scheduled Maintenance")
        description: ChaSetI18n.tr("overlays.dialog.maintenanceDesc", "The cloud service will be undergoing scheduled infrastructure updates tonight at 02:00 UTC.")
        dialogWidth: 440

        DocText {
            text: ChaSetI18n.tr("overlays.dialog.downtimeDesc", "Expected downtime is under 10 minutes. All data remains encrypted and safe.")
            color: root.cMutedFg
            font.pixelSize: Typography.sizeSmall
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }

        Row {
            anchors.right: parent.right
            ChaSetButton {
                size: "sm"
                text: ChaSetI18n.tr("overlays.dialog.understood", "Understood")
                onClicked: noticeDialog.accept()
            }
        }
    }
}
