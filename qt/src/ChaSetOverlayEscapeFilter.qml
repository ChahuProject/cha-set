// ChaSetOverlayEscapeFilter.qml — Optional window-level Escape consumer.
//
// Library overlays already consume Escape themselves through a window-level
// Shortcut (see each component's `Shortcut { sequence: "Escape" }`), so mounting
// this filter is NOT required for them. It exists for hosts that want a single
// choke point — including for their own bespoke Popups that are not ChaSet
// components — so that Escape never leaks into product key bindings.
//
// Use a Shortcut (not Keys) on purpose: Shortcut is dispatched by the window's
// shortcut map and does not require focus, which is the whole point — the
// failing overlays are exactly the ones that never take focus.
import QtQuick 6.10
import ChaSet

Item {
    id: filter

    Shortcut {
        sequence: "Escape"
        autoRepeat: false
        enabled: ChaSetOverlayHub.count > 0 && !ChaSetOverlayHub.escapeSuspended
        onActivated: ChaSetOverlayHub.dismissTop("escape")
    }
}
