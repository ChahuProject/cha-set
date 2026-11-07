// AlertDialogDocPage.qml — Living Documentation for ChaSetAlertDialog
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Alert Dialog"
    description: ChaSetI18n.tr("components.alertDialog.description", "Modal dialog that interrupts the user with important, critical, or destructive confirmations.")

    property string statusText: ""

    ComponentPreview {
        id: heroPreview
        width: parent ? parent.width : ThemeTokens.dp(500)
        stageHeight: ThemeTokens.dp(220)
        title: ChaSetI18n.tr("overlays.alertDialog.sandboxTitle", "Alert Dialog Sandbox")
        reactCode: `<AlertDialog open={open} onOpenChange={setOpen}>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">
      ${ChaSetI18n.tr("overlays.alertDialog.openAlertDialog", "Open Alert Dialog")}
    </Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        ${ChaSetI18n.tr("overlays.alertDialog.deleteDatabase", "Delete Database Permanently")}
      </AlertDialogTitle>
      <AlertDialogDescription>
        ${ChaSetI18n.tr("overlays.alertDialog.deleteDatabaseDesc", "This action cannot be undone. This database and all associated tables, indexes, and backups will be immediately eradicated.")}
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>
        ${ChaSetI18n.tr("overlays.alertDialog.cancel", "Cancel")}
      </AlertDialogCancel>
      <AlertDialogAction onClick={handleConfirm}>
        ${ChaSetI18n.tr("overlays.alertDialog.confirm", "Confirm Delete")}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`
        qtCode: `ChaSetAlertDialog {
    id: alertDialog
    title: "${ChaSetI18n.tr("overlays.alertDialog.deleteDatabase", "Delete Database Permanently")}"
    description: "${ChaSetI18n.tr("overlays.alertDialog.deleteDatabaseDesc", "This action cannot be undone. This database and all associated tables, indexes, and backups will be immediately eradicated.")}"
    confirmText: "${ChaSetI18n.tr("overlays.alertDialog.confirm", "Confirm Delete")}"
    cancelText: "${ChaSetI18n.tr("overlays.alertDialog.cancel", "Cancel")}"
    onConfirmed: {
        console.log("Database permanently removed")
    }
}`

        Column {
            anchors.centerIn: parent
            spacing: ThemeTokens.dp(16)

            ChaSetButton {
                variant: "destructive"
                text: ChaSetI18n.tr("overlays.alertDialog.openAlertDialog", "Open Alert Dialog")
                anchors.horizontalCenter: parent.horizontalCenter
                onClicked: alertPopup.open = true
            }

            Text {
                visible: root.statusText.length > 0
                text: root.statusText
                font.pixelSize: Typography.sizeSmall
                color: ThemeTokens.subduedText
                anchors.horizontalCenter: parent.horizontalCenter
            }
        }
    }

    ChaSetAlertDialog {
        id: alertPopup
        size: "sm"
        dialogWidth: ThemeTokens.dp(400)
        title: ChaSetI18n.tr("overlays.alertDialog.deleteDatabase", "Delete Database Permanently")
        description: ChaSetI18n.tr("overlays.alertDialog.deleteDatabaseDesc", "This action cannot be undone. This database and all associated tables, indexes, and backups will be immediately eradicated.")
        confirmText: ChaSetI18n.tr("overlays.alertDialog.confirm", "Confirm Delete")
        cancelText: ChaSetI18n.tr("overlays.alertDialog.cancel", "Cancel")
        onConfirmed: {
            root.statusText = ChaSetI18n.tr("overlays.alertDialog.statusMessage", "Database was permanently removed.")
            alertPopup.open = false
        }
        onCancelled: {
            alertPopup.open = false
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        reactCode: `import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
  Button
} from '@chahu/cha-set';

<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Item</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`
        qtCode: `import ChaSet

ChaSetAlertDialog {
    title: "Delete Item"
    description: "This action cannot be undone."
    confirmText: "Delete"
    cancelText: "Cancel"
    onConfirmed: console.log("confirmed")
}`
    }

    DocMarkdown {
        width: parent.width
        docId: "alert-dialog"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "alert-dialog"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "alert-dialog"
        section: "props"
    }
}
