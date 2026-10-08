// NotificationStackDocPage.qml — Living documentation for ChaSetNotificationStack.
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Notification Stack"
    description: ChaSetI18n.tr("components.notificationStack.description", "Floating, severity-coded notification stack with per-item lifetimes and inline actions.")
    tocItems: [
        { id: "overview", title: ChaSetI18n.tr("desktopComposite.notificationStack.overviewHeading", "Interactive Overview") },
        { id: "levels", title: ChaSetI18n.tr("desktopComposite.notificationStack.levelsTitle", "Levels & Actions") },
        { id: "anatomy", title: ChaSetI18n.tr("showcase.anatomy", "Anatomy") },
        { id: "animations", title: ChaSetI18n.tr("showcase.animations", "Animations") },
        { id: "keyboard", title: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation") },
        { id: "props", title: ChaSetI18n.tr("showcase.propsReference", "Props Reference") }
    ]

    ComponentPreview {
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.notificationStack.sandboxTitle", "Notification Stack Sandbox")
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
                    text: ChaSetI18n.tr("overlays.notificationStack.pushNotification", "Push Notification:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.notificationStack.levelInfo", "Info")
                    onClicked: root.push("info")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.notificationStack.levelSuccess", "Success")
                    onClicked: root.push("success")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.notificationStack.levelWarning", "Warning")
                    onClicked: root.push("warning")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.notificationStack.levelError", "Error")
                    onClicked: root.push("error")
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.notificationStack.clearAll", "Clear All")
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
                text: ChaSetI18n.tr("overlays.notificationStack.noNotifications", "No notifications queued. Push one to watch its lifetime countdown; hover the stack to suspend every countdown at once.")
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
        property string sectionTitle: ChaSetI18n.tr("desktopComposite.notificationStack.levelsTitle", "Levels & Actions")
        width: parent.width
        title: ChaSetI18n.tr("desktopComposite.notificationStack.levelsTitle", "Levels & Actions")
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
                    text: ChaSetI18n.tr("overlays.notificationStack.placement", "Placement:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeCaption
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    size: "sm"
                    value: root.levelPlacement
                    options: [
                        { label: ChaSetI18n.tr("overlays.taskHud.placementBottomRight", "Bottom Right"), value: "bottom-right" },
                        { label: ChaSetI18n.tr("overlays.taskHud.placementTopRight", "Top Right"), value: "top-right" },
                        { label: ChaSetI18n.tr("overlays.taskHud.placementBottomCenter", "Bottom Center"), value: "bottom-center" }
                    ]
                    onValueSelected: function(val) { root.levelPlacement = val }
                }
                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("overlays.notificationStack.resetActionLog", "Reset Action Log")
                    onClicked: root.actionReceipt = ""
                }
                DocText {
                    text: ChaSetI18n.tr("overlays.notificationStack.lastAction", "last action: {{receipt}}", { receipt: root.actionReceipt ? root.actionReceipt : ChaSetI18n.tr("overlays.notificationStack.noActionPressed", "(no action pressed yet)") })
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
            text: ChaSetI18n.tr("showcase.animations", "Animations")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.notificationStack.animationsDesc", "Motion tokens and lifetime contracts shared with the activity stack.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.notificationStack.animationsBullet1", "Notifications enter and exit over duration-medium (180ms) with the ease-standard curve, sliding through the anchored edge (Qt: ThemeTokens.motionMedium / ThemeTokens.easeStandard).")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.notificationStack.animationsBullet2", "Expiry is a remaining-time budget, not a bare timer: hovering the stack freezes every countdown mid-flight and releases it from the same remainder when the pointer leaves.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.notificationStack.animationsBullet3", "A duration of 0 pins a notification on screen until it is dismissed, which is what action-bearing messages use.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.notificationStack.animationsBullet4", "Every transition respects prefers-reduced-motion on Web and ThemeTokens.animationsEnabled in Qt, resolving durations to zero when motion is disabled.")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeSmall
        }
    }

    Column {
        property string sectionId: "keyboard"
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("desktopComposite.notificationStack.keyboardDesc", "The stack is a single tab stop: notification cards are roving-focus entries inside it.")
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
            text: ChaSetI18n.tr("showcase.propsReference", "Props Reference")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        PropsTable {
            width: parent.width
            title: ""
            propsModel: [
                { name: "notifications", type: "var", default: "[]", description: ChaSetI18n.tr("components.notificationStack.notificationsDesc", "Notifications to surface, oldest first; the newest card sits nearest the anchor.") },
                { name: "onDismissed", type: "(id: string) => void", default: "undefined", description: ChaSetI18n.tr("components.notificationStack.onDismissDesc", "Renders the per-card dismiss control and receives every auto-expiry.") },
                { name: "onActionTriggered", type: "(notificationId: string, actionId: string) => void", default: "undefined", description: ChaSetI18n.tr("components.notificationStack.onActionDesc", "Fired when an inline action button is pressed; the card stays until dismissed.") },
                { name: "placement", type: "string", default: "\"bottom-right\"", description: ChaSetI18n.tr("components.notificationStack.placementDesc", "Viewport anchor. Cards enter and exit through the anchored edge.") },
                { name: "offset", type: "int", default: "16", description: ChaSetI18n.tr("components.notificationStack.offsetDesc", "Inset from the anchored viewport edges, in logical units.") },
                { name: "maxVisible", type: "int", default: "4", description: ChaSetI18n.tr("components.notificationStack.maxVisibleDesc", "Cards rendered before the stack overflows into its \"show all\" pill.") },
                { name: "defaultDuration", type: "int", default: "5000", description: ChaSetI18n.tr("components.notificationStack.defaultDurationDesc", "Lifetime for items that do not state their own duration.") },
                { name: "pauseOnHover", type: "bool", default: "true", description: ChaSetI18n.tr("components.notificationStack.pauseOnHoverDesc", "Suspends every expiry countdown while the pointer rests on the stack.") },
                { name: "collapsible", type: "bool", default: "true", description: ChaSetI18n.tr("components.notificationStack.collapsibleDesc", "Offers the collapse-to-summary-row control.") },
                { name: "defaultCollapsed", type: "bool", default: "false", description: ChaSetI18n.tr("components.notificationStack.defaultCollapsedDesc", "Renders the stack collapsed on first paint.") },
                { name: "label", type: "string", default: "\"Notifications\"", description: ChaSetI18n.tr("components.notificationStack.labelDesc", "Accessible name of the live region.") }
            ]
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("components.notificationStack.itemFooterDesc", "Each notification carries id, title, an optional description, a level of info | success | warning | error, an optional duration, dismissible and a list of actions (id, label, variant).")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }
    }

    // ---- Demo state -------------------------------------------------------

    property string levelPlacement: "bottom-right"
    property string actionReceipt: ""
    property int _pushSeq: 1

    property var liveNotifications: [
        {
            id: "live-1",
            level: "info",
            title: ChaSetI18n.tr("overlays.notificationStack.syncStartedTitle", "Sync started"),
            description: ChaSetI18n.tr("overlays.notificationStack.syncStartedDesc", "Pulling 128 remote changes."),
            duration: 8000
        }
    ]

    property var levelNotifications: [
        {
            id: "level-info",
            level: "info",
            title: ChaSetI18n.tr("overlays.notificationStack.headsUpTitle", "Heads up"),
            description: ChaSetI18n.tr("overlays.notificationStack.headsUpDesc", "A new major version is available."),
            duration: 0
        },
        {
            id: "level-success",
            level: "success",
            title: ChaSetI18n.tr("overlays.notificationStack.buildPassedTitle", "Build passed"),
            description: ChaSetI18n.tr("overlays.notificationStack.buildPassedDesc", "All 318 contract checks green."),
            duration: 0
        },
        {
            id: "level-warning",
            level: "warning",
            title: ChaSetI18n.tr("overlays.notificationStack.quotaTitle", "Quota at 84%"),
            description: ChaSetI18n.tr("overlays.notificationStack.quotaDesc", "Storage usage is approaching the plan limit."),
            duration: 0,
            actions: [
                { id: "manage", label: ChaSetI18n.tr("overlays.notificationStack.actionManage", "Manage"), variant: "outline" },
                { id: "upgrade", label: ChaSetI18n.tr("overlays.notificationStack.actionUpgrade", "Upgrade"), variant: "default" }
            ]
        },
        {
            id: "level-error",
            level: "error",
            title: ChaSetI18n.tr("overlays.notificationStack.jobFailedTitle", "Job failed"),
            description: ChaSetI18n.tr("overlays.notificationStack.jobFailedDesc", "Compilation exited with code 1."),
            duration: 0,
            actions: [
                { id: "retry", label: ChaSetI18n.tr("overlays.notificationStack.actionRetry", "Retry"), variant: "outline" },
                { id: "logs", label: ChaSetI18n.tr("overlays.notificationStack.actionLogs", "View log"), variant: "ghost" }
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
            "info": {
                title: ChaSetI18n.tr("overlays.notificationStack.presetInfoTitle", "Index rebuilt"),
                description: ChaSetI18n.tr("overlays.notificationStack.presetInfoDesc", "Workspace symbols refreshed in 2.1s.")
            },
            "success": {
                title: ChaSetI18n.tr("overlays.notificationStack.presetSuccessTitle", "Deployment finished"),
                description: ChaSetI18n.tr("overlays.notificationStack.presetSuccessDesc", "Release 0.2.0 is live on staging.")
            },
            "warning": {
                title: ChaSetI18n.tr("overlays.notificationStack.presetWarningTitle", "Token expires soon"),
                description: ChaSetI18n.tr("overlays.notificationStack.presetWarningDesc", "Credentials expire in 3 days.")
            },
            "error": {
                title: ChaSetI18n.tr("overlays.notificationStack.presetErrorTitle", "Upload rejected"),
                description: ChaSetI18n.tr("overlays.notificationStack.presetErrorDesc", "Artifact exceeds the 50 MB limit.")
            }
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
