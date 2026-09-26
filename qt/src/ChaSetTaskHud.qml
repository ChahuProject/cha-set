// ChaSetTaskHud.qml — floating HUD for background executions (Qt Quick).
//
// A thin adapter over ChaSetActivityStack, mirroring
// packages/react/src/task-hud/TaskHud.tsx: it maps a task onto an activity card and
// holds the one piece of state the stack does not — the grace period an emptied HUD
// lingers for, so the last card fades out instead of vanishing the moment the final
// job reports success.
import QtQuick 6.10
import ChaSet

ChaSetActivityStack {
    id: root

    // ---- Contract ---------------------------------------------------------

    /** Background executions, oldest first. A JS array or a ListModel. */
    property var tasks: []
    /** Grace period an emptied HUD stays on screen before fading out (ms). */
    property int autoHideDelay: 600
    /** Keeps the HUD mounted even while no task is running. */
    property bool forceVisible: false
    /** Renders cancel controls on running tasks flagged cancellable. */
    property bool cancelEnabled: true
    /** Renders the per-card dismiss control. */
    property bool dismissEnabled: true

    /** Emitted when a cancellable running task's Cancel control is pressed. */
    signal cancelled(string taskId)

    label: "Task Progress HUD"
    summaryLabel: "进行中"
    entries: {
        var _revision = root._revision
        return root.buildEntries()
    }

    /** Bumped whenever the input list or the grace period changes. */
    property int _revision: 0
    /** Frozen last-frame snapshot, replayed while the grace period lapses. */
    property var _snapshot: []
    /** True once the grace period has lapsed and the HUD may play its exit. */
    property bool _cleared: false

    onTasksChanged: root.sync()
    onForceVisibleChanged: root.sync()
    onAutoHideDelayChanged: root.sync()

    // `tasks` is an array (mirroring the React contract), so any change arrives as a
    // new identity and is caught by onTasksChanged above.

    onActionTriggered: function (id, actionId) {
        if (actionId === "cancel") root.cancelled(id)
    }

    Timer {
        id: graceTimer
        repeat: false
        interval: Math.max(0, root.autoHideDelay)
        onTriggered: {
            root._cleared = true
            root._revision++
        }
    }

    // ---- Input normalisation ---------------------------------------------

    function taskCount() {
        var source = root.tasks
        if (!source) return 0
        if (typeof source.count === "number") return source.count
        if (typeof source.length === "number") return source.length
        return 0
    }

    function taskAt(index) {
        var source = root.tasks
        if (!source) return null
        if (typeof source.get === "function") return source.get(index)
        return source[index]
    }

    function liveTasks() {
        var out = []
        var count = root.taskCount()
        for (var i = 0; i < count; i++) out.push(root.taskAt(i))
        return out
    }

    /** Mirror of React's `source`: live list, frozen snapshot, or empty. */
    function effectiveTasks() {
        if (root.taskCount() > 0 || root.forceVisible) return root.liveTasks()
        if (root._cleared) return []
        return root._snapshot ? root._snapshot : []
    }

    function sync() {
        if (root.taskCount() > 0) root._snapshot = root.liveTasks()
        if (root.taskCount() > 0 || root.forceVisible) {
            graceTimer.stop()
            root._cleared = false
        } else {
            graceTimer.restart()
        }
        root._revision++
    }

    // ---- Status presentation (mirrors STATUS_PRESENTATION) ----------------

    function normalizeStatus(raw) {
        if (raw === undefined || raw === null || raw === "") return "running"
        if (typeof raw === "number") {
            if (raw === 1) return "success"
            if (raw === 2) return "warning"
            if (raw === 3) return "error"
            return "running"
        }
        var value = String(raw).toLowerCase()
        if (value === "failure" || value === "failed") return "error"
        if (value === "completed" || value === "done") return "success"
        if (value === "pending" || value === "idle") return "queued"
        if (value === "canceled") return "cancelled"
        return value
    }

    function statusKeyFor(status) {
        if (status === "success") return "success"
        if (status === "warning") return "warning"
        if (status === "error") return "failure"
        if (status === "cancelled") return "cancelled"
        if (status === "running") return "running"
        return "queued"
    }

    function toneFor(status) {
        if (status === "success") return "success"
        if (status === "warning") return "warning"
        if (status === "error") return "danger"
        return "neutral"
    }

    function formatElapsed(ms) {
        var seconds = Math.max(0, Math.floor(ms / 1000))
        var minutes = Math.floor(seconds / 60)
        var rest = seconds % 60
        if (minutes > 0) return minutes + "m " + (rest < 10 ? "0" + rest : String(rest)) + "s"
        return rest + "s"
    }

    // ---- Entry mapping ----------------------------------------------------

    function entryFor(task) {
        var status = root.normalizeStatus(task.status)
        var running = status === "running"
        var hasCounter = task.total !== undefined && task.total !== null
            && task.done !== undefined && task.done !== null
        var counter = hasCounter ? (task.done + "/" + task.total) : ""
        var detail = (task.detail !== undefined && task.detail !== null) ? String(task.detail) : ""
        if (counter !== "") detail = detail !== "" ? (detail + "  " + counter) : counter

        var elapsed = (typeof task.elapsedMs === "number" && task.elapsedMs > 0)
            ? root.formatElapsed(task.elapsedMs) : ""

        var cancellable = Boolean(task.cancellable) && running && root.cancelEnabled
        var actions = []
        if (cancellable) actions.push({ id: "cancel", label: "Cancel", variant: "ghost" })

        return {
            id: String(task.id),
            tone: root.toneFor(status),
            statusKey: root.statusKeyFor(status),
            iconName: "",
            title: (task.title !== undefined && task.title !== null) ? String(task.title) : "",
            detail: detail,
            meta: elapsed,
            progress: (typeof task.progress === "number") ? task.progress : -1,
            indeterminate: Boolean(task.indeterminate) && running,
            dismissible: root.dismissEnabled && !cancellable,
            dismissLabel: "Dismiss " + ((task.title !== undefined && task.title !== null) ? String(task.title) : ""),
            actions: actions
        }
    }

    function buildEntries() {
        var source = root.effectiveTasks()
        var out = []
        for (var i = 0; i < source.length; i++) {
            if (source[i]) out.push(root.entryFor(source[i]))
        }
        return out
    }
}
