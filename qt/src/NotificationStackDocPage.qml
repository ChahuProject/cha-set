// NotificationStackDocPage.qml — Living documentation for ChaSetNotificationStack.
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Notification Stack"
    description: "Floating, severity-coded notification stack with per-item lifetimes and inline actions."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "levels", title: "Levels & Actions" },
        { id: "anatomy", title: "Anatomy" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    ComponentPreview {
        width: parent.width
        title: "Notification Stack Sandbox"
        stageHeight: 380
        reactCode: `const [items, setItems] = useState<NotificationItem[]>([]);

<NotificationStack
  notifications={items}
  defaultDuration={5000}
  pauseOnHover
  onDismiss={(id) => setItems((prev) => prev.filter((item) => item.id !== id))}
/>`
        qtCode: `ChaSetNotificationStack {
    notifications: demoNotifications
    defaultDuration: 5000
    pauseOnHover: true
    onDismissed: function(id) { removeNotification(id) }
}`

        controlsData: [
            Row {
                spacing: 8
                DocText {
                    text: "Push Notification:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Info"
                    onClicked: root.push("info")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Success"
                    onClicked: root.push("success")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Warning"
                    onClicked: root.push("warning")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Error"
                    onClicked: root.push("error")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Clear All"
                    onClicked: root.clearNotifications()
                }
            }
        ]

        Rectangle {
            id: feedSandbox
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(16)
            radius: ThemeTokens.dp(12)
            color: Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.2)
            border.width: 1
            border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.7)

            Text {
                anchors.left: parent.left
                anchors.right: parent.right
                anchors.top: parent.top
                anchors.margins: ThemeTokens.dp(12)
                visible: root.liveNotifications.length === 0
                wrapMode: Text.WordWrap
                text: "No notifications queued. Push one to watch its lifetime countdown; hover the stack to suspend every countdown at once."
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
                font.family: Typography.familySans
            }

            ChaSetNotificationStack {
                id: feedStack
                anchorItem: feedSandbox
                notifications: root.liveNotifications
                defaultDuration: 5000
                pauseOnHover: true
                onDismissed: function(id) { root.removeNotification(id) }
            }
        }
    }

    ComponentPreview {
        property string sectionId: "levels"
        property string sectionTitle: "Levels & Actions"
        width: parent.width
        title: "Levels & Actions"
        stageHeight: 380
        reactCode: `<NotificationStack
  notifications={notifications}
  placement="bottom-right"
  maxVisible={4}
  collapsible
  onAction={(notificationId, actionId) => runAction(notificationId, actionId)}
/>`
        qtCode: `ChaSetNotificationStack {
    notifications: levelNotifications
    placement: "bottom-right"
    maxVisible: 4
    collapsible: true
    onActionTriggered: function(notificationId, actionId) { runAction(notificationId, actionId) }
}`

        controlsData: [
            Row {
                spacing: 16
                DocText {
                    text: "Placement:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    size: "sm"
                    value: root.levelPlacement
                    options: [
                        { label: "Bottom Right", value: "bottom-right" },
                        { label: "Top Right", value: "top-right" },
                        { label: "Bottom Center", value: "bottom-center" }
                    ]
                    onValueSelected: function(val) { root.levelPlacement = val }
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: "Reset Action Log"
                    onClicked: root.actionReceipt = "(no action pressed yet)"
                }
                DocText {
                    text: "last action: " + root.actionReceipt
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
            }
        ]

        Rectangle {
            id: levelsSandbox
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(16)
            radius: ThemeTokens.dp(12)
            color: Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.2)
            border.width: 1
            border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.7)

            ChaSetNotificationStack {
                id: levelsStack
                anchorItem: levelsSandbox
                notifications: root.levelNotifications
                placement: root.levelPlacement
                defaultDuration: 0
                onActionTriggered: function(notificationId, actionId) {
                    root.actionReceipt = notificationId + " / " + actionId
                }
            }
        }
    }

    DocAnatomy {
        property string sectionId: "anatomy"
        width: parent.width
        reactCode: `import { NotificationStack } from '@chahu/cha-set';

<NotificationStack
  notifications={notifications}
  onDismiss={(id) => removeNotification(id)}
  onAction={(id, actionId) => runAction(id, actionId)}
/>`
        qtCode: `import ChaSet

ChaSetNotificationStack {
    notifications: demoNotifications
    onDismissed: function(id) { removeNotification(id) }
    onActionTriggered: function(id, actionId) { runAction(id, actionId) }
}`
    }

    Column {
        property string sectionId: "animations"
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: "Animations"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Motion tokens and lifetime contracts shared with the activity stack."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Notifications enter and exit over ThemeTokens.motionMedium (180ms) with the ThemeTokens.easeStandard curve, sliding through the anchored edge."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Expiry is a remaining-time budget, not a bare timer: hovering the stack freezes every countdown mid-flight and releases it from the same remainder when the pointer leaves."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: "A duration of 0 pins a notification on screen until it is dismissed, which is what action-bearing messages use."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Every transition is guarded by ThemeTokens.animationsEnabled, which resolves durations to zero when motion is disabled."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }
    }

    Column {
        property string sectionId: "keyboard"
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: "Keyboard Navigation"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: "The stack is a single tab stop: notification cards are roving-focus entries inside it."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }

        KeyboardShortcutsTable {
            width: parent.width
            componentId: "notification-stack"
            title: ""
        }
    }

    Column {
        property string sectionId: "props"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: "Props Reference"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        PropsTable {
            width: parent.width
            title: ""
            propsModel: [
                { name: "notifications", type: "var", default: "[]", description: "Notifications to surface, oldest first; the newest card sits nearest the anchor." },
                { name: "onDismissed", type: "(id: string) => void", default: "undefined", description: "Renders the per-card dismiss control and receives every auto-expiry." },
                { name: "onActionTriggered", type: "(notificationId: string, actionId: string) => void", default: "undefined", description: "Fired when an inline action button is pressed; the card stays until dismissed." },
                { name: "placement", type: "string", default: "\"bottom-right\"", description: "Viewport anchor. Cards enter and exit through the anchored edge." },
                { name: "offset", type: "int", default: "16", description: "Inset from the anchored viewport edges, in logical units." },
                { name: "maxVisible", type: "int", default: "4", description: "Cards rendered before the stack overflows into its \"show all\" pill." },
                { name: "defaultDuration", type: "int", default: "5000", description: "Lifetime for items that do not state their own duration." },
                { name: "pauseOnHover", type: "bool", default: "true", description: "Suspends every expiry countdown while the pointer rests on the stack." },
                { name: "collapsible", type: "bool", default: "true", description: "Offers the collapse-to-summary-row control." },
                { name: "defaultCollapsed", type: "bool", default: "false", description: "Renders the stack collapsed on first paint." },
                { name: "label", type: "string", default: "\"Notifications\"", description: "Accessible name of the live region." }
            ]
        }

        DocText {
            width: parent.width
            wrap: true
            text: "Each notification carries id, title, an optional description, a level of info | success | warning | error, an optional duration, dismissible and a list of actions (id, label, variant)."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }
    }

    // ---- Demo state -------------------------------------------------------

    property string levelPlacement: "bottom-right"
    property string actionReceipt: "(no action pressed yet)"
    property int _pushSeq: 1

    property var liveNotifications: [
        {
            id: "live-1",
            level: "info",
            title: "Sync started",
            description: "Pulling 128 remote changes.",
            duration: 8000
        }
    ]

    property var levelNotifications: [
        {
            id: "level-info",
            level: "info",
            title: "Heads up",
            description: "A new major version is available.",
            duration: 0
        },
        {
            id: "level-success",
            level: "success",
            title: "Build passed",
            description: "All 318 contract checks green.",
            duration: 0
        },
        {
            id: "level-warning",
            level: "warning",
            title: "Quota at 84%",
            description: "Storage usage is approaching the plan limit.",
            duration: 0,
            actions: [
                { id: "manage", label: "Manage", variant: "outline" },
                { id: "upgrade", label: "Upgrade", variant: "default" }
            ]
        },
        {
            id: "level-error",
            level: "error",
            title: "Job failed",
            description: "Compilation exited with code 1.",
            duration: 0,
            actions: [
                { id: "retry", label: "Retry", variant: "outline" },
                { id: "logs", label: "View log", variant: "ghost" }
            ]
        }
    ]

    function copyList(list) {
        var out = []
        for (var i = 0; i < list.length; i++) out.push(list[i])
        return out
    }

    function push(level) {
        var presets = {
            "info": { title: "Index rebuilt", description: "Workspace symbols refreshed in 2.1s." },
            "success": { title: "Deployment finished", description: "Release 0.2.0 is live on staging." },
            "warning": { title: "Token expires soon", description: "Credentials expire in 3 days." },
            "error": { title: "Upload rejected", description: "Artifact exceeds the 50 MB limit." }
        }
        var preset = presets[level]
        if (!preset) return
        var list = root.copyList(root.liveNotifications)
        list.push({
            id: "live-" + (root._pushSeq++) + "-" + Date.now(),
            level: level,
            title: preset.title,
            description: preset.description,
            duration: 6000
        })
        root.liveNotifications = list
    }

    function clearNotifications() {
        root.liveNotifications = []
    }

    function removeNotification(notificationId) {
        var list = []
        for (var i = 0; i < root.liveNotifications.length; i++) {
            if (String(root.liveNotifications[i].id) !== String(notificationId)) {
                list.push(root.liveNotifications[i])
            }
        }
        root.liveNotifications = list
    }
}
