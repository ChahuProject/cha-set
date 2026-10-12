// ChaSetAlertDialog.qml — Cross-Stack Alert Dialog Component
// Backward-compatibility wrapper around ChaSetDialog with variant: "alert"
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

ChaSetDialog {
    id: root
    variant: "alert"
    destructive: true
    title: ChaSetI18n.tr("components.alertDialog.title", "Are you absolutely sure?")
    description: ChaSetI18n.tr("components.alertDialog.description", "This action cannot be undone. This will permanently delete your account and remove your data.")
    confirmText: ChaSetI18n.tr("components.alertDialog.confirmText", "Continue")
    cancelText: ChaSetI18n.tr("common.cancel", "Cancel")
}
