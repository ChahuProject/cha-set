// ChaSetShortcut.qml — Cross-Stack Menu & Layout Shortcut Item
// Semantic shortcut presenter for DropdownMenu, ContextMenu, and command search
import QtQuick 6.10
import ChaSet

ChaSetKbd {
    id: root

    property string value: ""
    shortcut: value.length > 0 ? value : ""
    variant: "subtle"
    size: "xs"
    compact: "auto"
}
