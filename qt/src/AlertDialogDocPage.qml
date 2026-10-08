// AlertDialogDocPage.qml — Living Documentation for ChaSetAlertDialog
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Alert Dialog"
    description: ChaSetI18n.tr("desktopComposite.alertDialog.pageDescription", "A modal dialog that interrupts the user with important content and requires confirmation.")

    property string alertFeedback: ChaSetI18n.tr("overlays.alertDialog.feedbackIdle", "Dialog is idle.")

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.alertDialog.sandboxTitle", "Alert Dialog Sandbox")
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

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 8

                    ChaSetButton {
                        text: "sm"
                        variant: alertDlg.size === "sm" ? "default" : "outline"
                        size: "sm"
                        onClicked: alertDlg.size = "sm"
                    }

                    ChaSetButton {
                        text: "default"
                        variant: alertDlg.size === "default" ? "default" : "outline"
                        size: "sm"
                        onClicked: alertDlg.size = "default"
                    }

                    ChaSetButton {
                        text: "lg"
                        variant: alertDlg.size === "lg" ? "default" : "outline"
                        size: "sm"
                        onClicked: alertDlg.size = "lg"
                    }
                }

                ChaSetButton {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: ChaSetI18n.tr("overlays.alertDialog.deleteDeployment", "Delete Deployment ({{size}})", { size: alertDlg.size })
                    variant: "destructive"
                    onClicked: alertDlg.open = true
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.alertFeedback
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                }
            }

            ChaSetAlertDialog {
                id: alertDlg
                title: ChaSetI18n.tr("overlays.alertDialog.deleteDeploymentTitle", "Are you sure you want to delete this deployment?")
                description: ChaSetI18n.tr("overlays.alertDialog.deleteDeploymentDesc", "This will terminate all active microservices in cluster 'us-east-1'. All runtime logs will be irreversibly purged.")
                confirmText: ChaSetI18n.tr("overlays.alertDialog.yesDelete", "Yes, Delete")
                cancelText: ChaSetI18n.tr("common.cancel", "Cancel")
                destructive: true
                onConfirmed: root.alertFeedback = ChaSetI18n.tr("overlays.alertDialog.feedbackConfirmed", "Action confirmed: Deployment deleted.")
                onCancelled: root.alertFeedback = ChaSetI18n.tr("overlays.alertDialog.feedbackCancelled", "Action cancelled.")
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetAlertDialog {
    id: alertDlg
    title: "Are you absolutely sure?"
    description: "This action cannot be undone."
    confirmText: "Continue"
    cancelText: "Cancel"
    onConfirmed: console.log("Confirmed")
}`
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
  Button,
} from '@chahu/cha-set';

<AlertDialog>
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
    }

    ComponentReference {
        name: "AlertDialog"
        componentId: "alert-dialog"
        propsModel: [
            { name: "open", type: "bool", default: "false", description: ChaSetI18n.tr("components.alertDialog.openDesc", "Controlled open state.") },
            { name: "size", type: "string", default: "'default'", description: ChaSetI18n.tr("components.alertDialog.sizeDesc", "Preset maximum width container sizing for AlertDialogContent.") },
            { name: "title", type: "string", default: "'Are you absolutely sure?'", description: ChaSetI18n.tr("components.alertDialog.titleDesc", "Dialog headline title.") },
            { name: "description", type: "string", default: "''", description: ChaSetI18n.tr("components.alertDialog.descriptionDesc", "Explanatory content warning the user about action consequences.") },
            { name: "confirmText", type: "string", default: "'Continue'", description: ChaSetI18n.tr("components.alertDialog.confirmTextDesc", "Label for the confirmation button.") },
            { name: "cancelText", type: "string", default: "'Cancel'", description: ChaSetI18n.tr("components.alertDialog.cancelTextDesc", "Label for the cancellation button.") },
            { name: "destructive", type: "bool", default: "true", description: ChaSetI18n.tr("components.alertDialog.destructiveDesc", "Whether the confirmation button should display in destructive styling.") },
            { name: "actionVariant", type: "string", default: "'destructive'", description: ChaSetI18n.tr("components.alertDialog.variantDesc", "Button variant styling for AlertDialogAction.") },
            { name: "closeOnOverlayClick", type: "bool", default: "false", description: ChaSetI18n.tr("components.alertDialog.closeOnOverlayClickDesc", "Whether clicking the backdrop overlay automatically dismisses the dialog.") },
            { name: "closeOnEscape", type: "bool", default: "true", description: ChaSetI18n.tr("components.alertDialog.closeOnEscapeDesc", "Whether pressing the Escape key dismisses the dialog.") }
        ]
    }
}
