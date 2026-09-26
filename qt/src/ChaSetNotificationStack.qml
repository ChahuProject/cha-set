// ChaSetNotificationStack.qml — floating, severity-coded notification stack (Qt Quick).
//
// A thin adapter over ChaSetActivityStack, mirroring
// packages/react/src/notification-stack/NotificationStack.tsx: it shares every layout
// mechanic of the Task HUD and adds the one thing a notification has that a background
// task does not — a lifetime. Expiry is tracked as a remaining-time budget rather than a
// bare timer, so hovering a stack of toasts freezes each one mid-count instead of
// letting them expire underneath the user's cursor.
import QtQuick 6.10
import ChaSet

ChaSetActivityStack {
    id: root

    // ---- Contract ---------------------------------------------------------

    /** Notifications, oldest first. A JS array or a ListModel. */
    property var notifications: []
    /** Lifetime for items that do not state their own `duration` (ms). */
    property int defaultDuration: 5000
    /** Suspends every expiry countdown while the pointer rests on the stack. */
    property bool pauseOnHover: true
    /** Renders the per-card dismiss control on dismissible notifications. */
    property bool dismissEnabled: true

    label: "Notifications"
    maxVisible: 4
    entries: {
        var _revision = root._revision
        return root.buildEntries()
    }

    /** Bumped whenever the input list changes. */
    property int _revision: 0
    /** id -> remaining lifetime in ms. Zero marks a sticky notification. */
    property var _budgets: ({})
    property bool _hovered: false

    readonly property bool hasNotifications: root.notificationCount() > 0

    onNotificationsChanged: root.sync()
    onDefaultDurationChanged: root.sync()
    onHoverChanged: function (hovered) { root._hovered = hovered }

    // `notifications` is an array (mirroring the React contract), so any change arrives
    // as a new identity and is caught by onNotificationsChanged above.

    Timer {
        id: ticker
        interval: 100
        repeat: true
        running: root.hasNotifications && (root.pauseOnHover ? !root._hovered : true)
        onTriggered: root.tick(100)
    }

    // ---- Input normalisation ---------------------------------------------

    function notificationCount() {
        var source = root.notifications
        if (!source) return 0
        if (typeof source.count === "number") return source.count
        if (typeof source.length === "number") return source.length
        return 0
    }

    function notificationAt(index) {
        var source = root.notifications
        if (!source) return null
        if (typeof source.get === "function") return source.get(index)
        return source[index]
    }

    // ---- Lifetime budget --------------------------------------------------

    /** Arms a budget for every new notification and retires the ones that left. */
    function syncCountdowns() {
        var seen = {}
        var count = root.notificationCount()
        for (var i = 0; i < count; i++) {
            var item = root.notificationAt(i)
            if (!item) continue
            var id = String(item.id)
            seen[id] = true
            if (!root._budgets.hasOwnProperty(id)) {
                var declared = (item.duration !== undefined && item.duration !== null)
                    ? Number(item.duration) : root.defaultDuration
                root._budgets[id] = declared > 0 ? declared : 0
            }
        }
        var known = Object.keys(root._budgets)
        for (var j = 0; j < known.length; j++) {
            if (!seen.hasOwnProperty(known[j])) delete root._budgets[known[j]]
        }
    }

    /** Spends `step` ms of every running budget, expiring what reaches zero. */
    function tick(step) {
        var known = Object.keys(root._budgets)
        var expired = []
        for (var i = 0; i < known.length; i++) {
            var id = known[i]
            var remaining = root._budgets[id]
            if (remaining <= 0) continue
            remaining -= step
            root._budgets[id] = remaining > 0 ? remaining : 0
            if (remaining <= 0) expired.push(id)
        }
        for (var j = 0; j < expired.length; j++) {
            delete root._budgets[expired[j]]
            root.dismissed(expired[j])
        }
    }

    function sync() {
        root.syncCountdowns()
        root._revision++
    }

    // ---- Level presentation (mirrors LEVEL_TONE / LEVEL_ICON) -------------

    function levelTone(level) {
        if (level === "success") return "success"
        if (level === "warning") return "warning"
        if (level === "error") return "danger"
        return "neutral"
    }

    function levelIcon(level) {
        if (level === "success") return "check"
        if (level === "warning") return "alert-triangle"
        if (level === "error") return "x"
        return "info"
    }

    // ---- Entry mapping ----------------------------------------------------

    function entryFor(notification) {
        var level = (notification.level !== undefined && notification.level !== null)
            ? String(notification.level) : "info"
        var dismissible = (notification.dismissible !== undefined && notification.dismissible !== null)
            ? Boolean(notification.dismissible) : true

        var declared = notification.actions ? notification.actions : []
        var actions = []
        for (var i = 0; i < declared.length; i++) {
            actions.push({
                id: String(declared[i].id),
                label: String(declared[i].label),
                variant: declared[i].variant ? String(declared[i].variant) : "outline"
            })
        }

        var title = (notification.title !== undefined && notification.title !== null)
            ? String(notification.title) : ""

        return {
            id: String(notification.id),
            tone: root.levelTone(level),
            statusKey: "queued",
            iconName: root.levelIcon(level),
            title: title,
            detail: (notification.description !== undefined && notification.description !== null)
                ? String(notification.description) : "",
            meta: "",
            progress: -1,
            indeterminate: false,
            dismissible: dismissible && root.dismissEnabled,
            dismissLabel: "Dismiss " + title,
            actions: actions
        }
    }

    function buildEntries() {
        var out = []
        var count = root.notificationCount()
        for (var i = 0; i < count; i++) {
            var item = root.notificationAt(i)
            if (item) out.push(root.entryFor(item))
        }
        return out
    }
}
