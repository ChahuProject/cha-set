// ChaSetOverlayHub.qml — Cross-Stack Overlay Registry Singleton
//
// Single source of truth for "which floating layers are open right now".
// Hosts read `count` to suppress product-level key bindings while any overlay is
// visible, and library components register themselves so that Escape always
// dismisses exactly the topmost layer and never leaks through to the host.
//
// Why a registry instead of deriving state from the QML focus chain:
// overlays that declare `focus: false` (or simply do not hold focus) are invisible
// to focus-chain sniffing, so the host wrongly concludes "no overlay is open" and
// lets Escape fall through to a product action. Registration is explicit and
// therefore reliable regardless of focus.
pragma Singleton
import QtQuick 6.10

QtObject {
    id: hub

    // Open overlays in open order — the last entry is the topmost layer.
    // Reassigned (never mutated in place) so QML bindings on `count` / `top` re-evaluate.
    property var _stack: []

    readonly property int count: _stack.length
    readonly property var top: _stack.length > 0 ? _stack[_stack.length - 1] : null

    // Recorder-style components temporarily take Escape back (e.g. keybinding capture)
    // so that pressing Escape cancels the recording instead of closing the host overlay.
    property bool escapeSuspended: false

    signal changed()

    function register(overlay) {
        if (!overlay) return;
        var i = _stack.indexOf(overlay);
        var next = _stack.slice();
        if (i >= 0) next.splice(i, 1);
        next.push(overlay);
        _stack = next;
        changed();
    }

    function unregister(overlay) {
        if (!overlay) return;
        var i = _stack.indexOf(overlay);
        if (i < 0) return;
        var next = _stack.slice();
        next.splice(i, 1);
        _stack = next;
        changed();
    }

    // True only for the topmost overlay — this is what keeps Escape from closing
    // a lower layer while a nested menu/popover is showing.
    function isTop(overlay) {
        return !!overlay && top === overlay;
    }

    // An overlay participates in Escape dismissal unless it explicitly opts out.
    function canEscape(overlay) {
        if (!overlay) return false;
        var v = overlay.closeOnEscape;
        return (typeof v === "undefined") ? true : !!v;
    }

    function _forceClose(overlay, reason) {
        if (!overlay) return false;
        try {
            if (typeof overlay.close === "function") {
                overlay.close(reason);
                return true;
            }
        } catch (e) {
            // fall through to the `open` property route
        }
        try {
            if (typeof overlay.open !== "undefined") {
                overlay.open = false;
                return true;
            }
        } catch (e2) {
            // ignore — nothing we can do for this overlay
        }
        return false;
    }

    // Dismisses ONLY the topmost overlay. Returns true when a layer was closed.
    function dismissTop(reason) {
        var t = top;
        if (!t) return false;
        if (!canEscape(t)) return false;
        unregister(t);
        return _forceClose(t, reason);
    }

    // Dismisses every Escape-participating overlay, topmost first.
    // Used by host-side "close all popups" paths so they stop maintaining
    // a hand-written list of every popup in the app.
    function dismissAll(reason) {
        var closed = 0;
        var list = _stack.slice();
        for (var i = list.length - 1; i >= 0; --i) {
            var o = list[i];
            if (!canEscape(o)) continue;
            unregister(o);
            if (_forceClose(o, reason)) closed += 1;
        }
        return closed;
    }
}
