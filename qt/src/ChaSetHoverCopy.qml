// ChaSetHoverCopy.qml — Hover-dim overlay + background-free centered glyph
// (capability layer). The whole overlay reads as one big button: hovering
// reveals a dim scrim with a semi-transparent centered icon (no button
// chrome), and tapping anywhere on the overlay copies. The glyph auto-fits
// inside the wrapped content and never overflows it.
// Implements docs/architecture/hover-copy.md sections 3-4 exactly.
// Zero assumptions about wrapped content: arbitrary children are hosted in
// contentHost via the default property alias; the root hugs them.
import QtQuick
import ChaSet

Item {
    id: root

    // Shared contract mirrors spec/components/hover-copy.ts (hoverCopyDefaults).
    property string text: ""
    property real dim: 0.45
    property string radius: "md"            // "none" | "sm" | "md" | "lg" | "full"
    property string icon: "copy"            // semantic ChaSetIcon name
    property string copiedIcon: "check"     // semantic ChaSetIcon name
    property int resetTime: 1000            // ms, logic timer (NOT affected by animationsEnabled)
    property bool disabled: false
    property bool forceHover: false         // deterministic test hook

    // State machine vocabulary: "idle" | "hovered" | "copied".
    // Mutable backing store; the readonly alias below is the public/test surface.
    property string _state: "idle"
    readonly property string state: _state

    // Input modality flags (re-checked by the restore timer per #7/#8).
    property bool _hovered: false           // mouse hover modality (HoverHandler)
    property bool _pinned: false            // touch-tap pinned reveal (#3)
    property bool _buttonFocused: false     // keyboard focus-within equivalence (#2)
    readonly property bool _revealed: root._state !== "idle"
    // Effective icon resolved off the name: line — the icon-spec gate scans
    // the literals on a ChaSetIcon `name:` line, and a ternary would smuggle
    // the state string in as a phantom icon name.
    readonly property string effectiveIcon: root._state === "copied" ? root.copiedIcon : root.icon

    // Radius semantic mapping mirroring hoverCopyRadiusMap
    // (spec/components/hover-copy.ts) bit-for-bit:
    // none -> 0, sm -> 4, md -> 6, lg -> 8, full -> pill (height / 2).
    readonly property real _effectiveRadius: {
        if (root.radius === "none")
            return 0
        if (root.radius === "sm")
            return ThemeTokens.dp(4)
        if (root.radius === "md")
            return ThemeTokens.dp(6)
        if (root.radius === "lg")
            return ThemeTokens.dp(8)
        // "full" -> pill, computed at runtime
        return root.height / 2
    }

    signal copiedToClipboard(string text)
    signal copyFailed(string reason)

    // Explicit geometry (0x0-collapse red line): the root hugs whatever the
    // wrapped content measures. Content must carry an intrinsic size (the
    // preset badge does); fill-anchored content would collapse to zero.
    implicitWidth: Math.max(0, contentHost.childrenRect.x + contentHost.childrenRect.width)
    implicitHeight: Math.max(0, contentHost.childrenRect.y + contentHost.childrenRect.height)
    width: implicitWidth
    height: implicitHeight

    default property alias content: contentHost.children

    Item {
        id: contentHost
        anchors.fill: parent
    }

    // Dim scrim: full-bleed black overlay at alpha dim. Visual only by itself;
    // the whole-overlay copy trigger is the TapHandler below, active while
    // revealed — tapping anywhere on the scrim copies (same as the button).
    Rectangle {
        id: scrim
        anchors.fill: parent
        radius: root._effectiveRadius
        color: Qt.rgba(0, 0, 0, root.dim)
        opacity: root._revealed ? 1.0 : 0.0
        visible: opacity > 0
        z: 1

        Behavior on opacity {
            enabled: ThemeTokens.animationsEnabled && !root.forceHover && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }

        TapHandler {
            id: scrimTap
            enabled: root._revealed && !root.disabled
            onTapped: root.copy()
        }
    }

    // Big-button trigger: background-free, fills the overlay with an inset
    // margin so it never overflows the wrapped content. Present only while
    // revealed (idle = not visible/clickable). The centered glyph is the only
    // visible affordance — no surface, no border, no shadow.
    Item {
        id: copyBtn
        anchors.fill: parent
        anchors.margins: ThemeTokens.dp(4)
        z: 2
        opacity: root._revealed ? 1.0 : 0.0
        visible: opacity > 0
        enabled: visible && !root.disabled
        activeFocusOnTab: enabled

        // Glyph size in logical units (ChaSetIcon scales via ThemeTokens.dp
        // internally): matches React's min(1.5rem, max(0.75rem, 55%)) with a
        // floor of 12 logical px and cap of 24 logical px (1.5rem = 24px).
        readonly property int glyphSize: Math.max(12, Math.min(24,
            Math.round(Math.min(root.width, root.height)
                / Math.max(0.25, ThemeTokens.uiScale) * 0.6)))

        onActiveFocusChanged: {
            root._buttonFocused = copyBtn.activeFocus
            if (copyBtn.activeFocus)
                root._enterHovered()
            else
                root._maybeIdle()
        }

        Keys.onReturnPressed: function(event) {
            event.accepted = true
            root.copy()
        }
        Keys.onSpacePressed: function(event) {
            event.accepted = true
            root.copy()
        }

        Behavior on opacity {
            enabled: ThemeTokens.animationsEnabled && !root.forceHover && (typeof harnessMode === "undefined" || harnessMode === "")
            NumberAnimation { duration: ThemeTokens.motionQuick; easing.type: ThemeTokens.easeStandard }
        }

        ChaSetIcon {
            id: copyIcon
            anchors.centerIn: parent
            name: root.effectiveIcon
            size: copyBtn.glyphSize
            // White-on-dim-scrim overlay idiom (same approach as dialog
            // scrims): semi-transparent at rest, solid on success feedback.
            // theme-adaptive:allow overlay-icon - white glyph on black dim scrim (functional contrast, both modes).
            color: "white"
            opacity: root.state === "copied" ? 1.0 : 0.65

            Behavior on scale {
                enabled: ThemeTokens.animationsEnabled && !root.forceHover && (typeof harnessMode === "undefined" || harnessMode === "")
                NumberAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
            }
        }

        // NOTE: no HoverHandler here on purpose. Cursor affordance for the
        // whole overlay is owned solely by the state-aware revealHover below
        // (Arrow while idle, PointingHand while revealed), so deeper content
        // keeps its own cursor (e.g. selectable text keeps IBeam under an
        // idle overlay) exactly as before the background-free redesign.
        // A topmost PointingHand handler here would win over deeper handlers
        // within the probe window and break cursor-conformance raycasting.
        TapHandler {
            id: btnTap
            enabled: copyBtn.enabled
            onTapped: root.copy()
        }
    }

    // Reveal handler (#1): mouse hover over the wrapper. It is the sole owner
    // of the overlay cursor affordance — Arrow while idle, PointingHand while
    // revealed (the whole overlay is the copy trigger then). Deeper content
    // handlers (e.g. IBeam over selectable text) keep precedence by depth.
    HoverHandler {
        id: revealHover
        enabled: !root.disabled
        cursorShape: (root._revealed && !root.disabled) ? Qt.PointingHandCursor : Qt.ArrowCursor
        onHoveredChanged: {
            root._hovered = revealHover.hovered
            if (revealHover.hovered) {
                // Mouse takeover unpins a touch reveal.
                root._pinned = false
                root._enterHovered()
            } else {
                root._maybeIdle()
            }
        }
    }

    // Touch fallback (#3): first tap on content pins the overlay open when no
    // hover modality is active; the second tap anywhere on the overlay
    // (scrim or centered glyph) copies (#5).
    TapHandler {
        id: touchTap
        enabled: !root.disabled
        onTapped: {
            if (root.disabled)
                return
            if (root._hovered || revealHover.hovered)
                return
            if (root._state === "copied")
                return
            root._pinned = true
            root._enterHovered()
        }
    }

    // Restore timer (#7/#8): logic timer, never gated on animationsEnabled.
    // Immediately hides the overlay (restores to idle) once copied feedback completes.
    Timer {
        id: resetTimer
        interval: root.resetTime
        repeat: false
        onTriggered: {
            root._pinned = false
            root._state = "idle"
        }
    }

    onDisabledChanged: {
        if (root.disabled) {
            // Transition #11: any state -> idle, overlay out, button inert.
            resetTimer.stop()
            root._pinned = false
            root._hovered = false
            root._buttonFocused = false
            root._state = "idle"
        } else {
            root._maybeIdle()
        }
    }

    onForceHoverChanged: {
        if (root.forceHover) {
            root._enterHovered()
        } else {
            root._maybeIdle()
        }
    }

    function _enterHovered() {
        if (root.disabled)
            return
        if (root._state === "copied")
            return
        root._state = "hovered"
    }

    function _maybeIdle() {
        // Transition #9: pointer-leave during copied is ignored — never
        // truncate the success feedback; the restore timer decides (#7/#8).
        if (root._state === "copied")
            return
        if (root.disabled) {
            root._state = "idle"
            return
        }
        if (root._hovered || root._pinned || root._buttonFocused || root.forceHover)
            root._state = "hovered"
        else
            root._state = "idle"
    }

    // Copy activation (#5/#6/#10/#12). Also the programmatic/C++ entry point.
    function copy() {
        if (root.disabled)
            return
        // Transition #6: empty text is a silent no-op — no clipboard, no signal.
        if (root.text.length === 0)
            return
        try {
            if (typeof ChaSetClipboard !== "undefined" && ChaSetClipboard.setText) {
                ChaSetClipboard.setText(root.text)
            }
            // Transition #10: re-copy while copied restarts the timer.
            root._state = "copied"
            resetTimer.restart()
            root.copiedToClipboard(root.text)
        } catch (e) {
            // Transition #12: failure keeps hovered (no false check).
            root._state = "hovered"
            root.copyFailed(String(e))
        }
    }
}
