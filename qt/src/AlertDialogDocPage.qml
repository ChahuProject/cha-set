// AlertDialogDocPage.qml — Living Documentation for ChaSetAlertDialog
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Alert Dialog"
    description: "A modal dialog that interrupts the user with important content and expects a confirmation or cancellation action."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property string alertFeedback: "Dialog is idle."

    ComponentPreview {
        title: "Alert Dialog Preview"
        reactCode: `<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete Account</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Continue</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`
        qtCode: `ChaSetButton {
    text: "Delete Account"
    variant: "destructive"
    onClicked: alertDlg.open = true
}

ChaSetAlertDialog {
    id: alertDlg
    title: "Are you absolutely sure?"
    description: "This action cannot be undone. This will permanently delete your account."
    confirmText: "Delete"
    destructive: true
    onConfirmed: console.log("confirmed")
    onCancelled: console.log("cancelled")
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16

                ChaSetButton {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "Delete Deployment"
                    variant: "destructive"
                    onClicked: alertDlg.open = true
                }

                Text {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.alertFeedback
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                    font.family: "monospace"
                }
            }

            ChaSetAlertDialog {
                id: alertDlg
                title: "Are you sure you want to delete this deployment?"
                description: "This will terminate all active microservices in cluster 'us-east-1'. All runtime logs will be irreversibly purged."
                confirmText: "Yes, Delete"
                cancelText: "Cancel"
                destructive: true
                onConfirmed: root.alertFeedback = "Action confirmed: Deployment deleted."
                onCancelled: root.alertFeedback = "Action cancelled."
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetAlertDialog { ... }"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "alert-dialog"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "open", type: "bool", default: "false", description: "Whether the alert dialog modal is visible." },
            { name: "title", type: "string", default: "'Are you absolutely sure?'", description: "Dialog headline title." },
            { name: "description", type: "string", default: "''", description: "Explanatory content warning the user about action consequences." },
            { name: "confirmText", type: "string", default: "'Continue'", description: "Label for the confirmation button." },
            { name: "cancelText", type: "string", default: "'Cancel'", description: "Label for the cancellation button." },
            { name: "destructive", type: "bool", default: "true", description: "Whether the confirmation button should display in destructive styling." }
        ]
    }
}
