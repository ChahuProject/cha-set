// ChaSetActivityCard.qml — internal presentational shell for one activity-stack entry.
//
// Mirrors packages/react/src/activity-stack/ActivityCard.tsx 1:1. It is NOT a spec
// component: it owns no timers, no placement and no state, so the Task HUD and the
// Notification Stack can be written as thin adapters over the same box.
import QtQuick 6.10
import ChaSet

Item {
    id: root

    /** Identity of the entry. Kept for test parity with the React data-testids. */
    property string itemId: ""
    /** Accent vocabulary: neutral | success | warning | danger. */
    property string tone: "neutral"
    /** Status glyph fed to ChaSetStatusIcon when no vector icon overrides it. */
    property string statusKey: "queued"
    /** When set, a registry vector icon replaces the status glyph. */
    property string iconName: ""
    property string title: ""
    property string detail: ""
    /** Trailing readout on the title row, e.g. an elapsed time. */
    property string meta: ""
    /** Determinate progress ratio. Any negative value renders no bar. */
    property real progress: -1
    /** Renders the sweeping bar of a step whose duration is unknown. */
    property bool indeterminate: false
    /** Renders the dismiss control when true. */
    property bool dismissible: false
    property string dismissLabel: ""
    /** Draws the focus ring used by the stack's arrow-key traversal. */
    property bool focused: false
    /** Drives the enter/exit opacity; flipped by the stack, never assigned directly. */
    property bool revealed: true
    /** Inline trailing actions: [{ id, label, variant }]. */
    property var actions: []
    /** Enter/exit travel, driven by the stack. */
    property real slideOffset: 0
    /** Enter/exit travel on the perpendicular axis, for side-anchored stacks. */
    property real slideOffsetX: 0

    signal dismissRequested()
    signal actionTriggered(string actionId)

    /** Declarative trailing action row (the Repeater below drives `actions`). */
    default property alias actionsData: actionsRow.data

    readonly property color amber: "#f59e0b"

    /** Glyph colour derived from the tone. */
    readonly property color accentColor: root.tone === "warning" ? root.amber
        : root.tone === "danger" ? ThemeTokens.danger
        : root.tone === "success" ? ThemeTokens.accent
        : ThemeTokens.subduedText

    /** Determinate fill and top rail. Neutral and success share the primary accent. */
    readonly property color fillColor: root.tone === "warning" ? root.amber
        : root.tone === "danger" ? ThemeTokens.danger
        : ThemeTokens.accent

    readonly property color cardBorder: root.tone === "neutral"
        ? Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.8)
        : root.tone === "danger"
            ? Qt.rgba(ThemeTokens.danger.r, ThemeTokens.danger.g, ThemeTokens.danger.b, 0.5)
            : Qt.rgba(root.accentColor.r, root.accentColor.g, root.accentColor.b, 0.4)

    readonly property color glyphBackground: root.tone === "neutral"
        ? Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.8)
        : Qt.rgba(root.accentColor.r, root.accentColor.g, root.accentColor.b, 0.1)

    readonly property color glyphBorder: root.tone === "neutral"
        ? Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.5)
        : Qt.rgba(root.accentColor.r, root.accentColor.g, root.accentColor.b, 0.25)

    readonly property bool hasProgress: root.indeterminate || root.progress >= 0
    readonly property real ratio: Math.max(0, Math.min(1, root.progress < 0 ? 0 : root.progress))
    readonly property bool hasActions: (root.actions && root.actions.length > 0) || actionsRow.children.length > 1

    // `bg-card/95` + `text-card-foreground`, declared as an explicit pair so the card
    // is self-contained and never inherits an ambient foreground.
    readonly property color surface: Qt.rgba(ThemeTokens.panel.r, ThemeTokens.panel.g, ThemeTokens.panel.b, 0.95)
    readonly property color onSurface: ThemeTokens.text

    readonly property int horizontalPadding: ThemeTokens.dp(14)
    readonly property int verticalPadding: ThemeTokens.dp(14)
    readonly property int rowGap: ThemeTokens.dp(12)
    readonly property int glyphFrameSize: ThemeTokens.dp(36)
    readonly property int dismissSize: ThemeTokens.dp(24)

    readonly property int middleWidth: Math.max(
        0,
        root.width - root.horizontalPadding * 2 - root.glyphFrameSize - root.rowGap
            - (root.dismissible ? root.dismissSize + root.rowGap : 0))

    implicitWidth: ThemeTokens.dp(352)
    implicitHeight: body.implicitHeight + root.verticalPadding * 2
    width: implicitWidth
    height: implicitHeight

    opacity: root.revealed ? 1 : 0
    Behavior on opacity {
        enabled: ThemeTokens.animationsEnabled
        NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: ThemeTokens.easeStandard }
    }
    Behavior on slideOffset {
        enabled: ThemeTokens.animationsEnabled
        NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: ThemeTokens.easeStandard }
    }
    Behavior on slideOffsetX {
        enabled: ThemeTokens.animationsEnabled
        NumberAnimation { duration: ThemeTokens.motionMedium; easing.type: ThemeTokens.easeStandard }
    }
    transform: Translate { x: root.slideOffsetX; y: root.slideOffset }

    // Soft drop shadow (React `shadow-lg`), kept inside the card bounds so nothing clips.
    Rectangle {
        anchors.fill: cardBox
        anchors.topMargin: ThemeTokens.dp(3)
        anchors.leftMargin: ThemeTokens.dp(1)
        anchors.rightMargin: ThemeTokens.dp(1)
        radius: cardBox.radius
        color: Qt.rgba(0, 0, 0, ThemeTokens.dark ? 0.35 : 0.08)
        z: -1
    }

    // Rounded bordered surface. `clip` mirrors React's `overflow-hidden`, which keeps the
    // tone rail inside the corner radius.
    Rectangle {
        id: cardBox
        anchors.fill: parent
        radius: ThemeTokens.dp(12)
        color: root.surface
        border.width: 1
        border.color: root.cardBorder
        clip: true

        // Top rail: repeats the tone without adding a second border. Inset past the
        // corner radius because Qt's clip rectangle is square.
        Rectangle {
            visible: root.tone !== "neutral"
            anchors.top: parent.top
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.leftMargin: ThemeTokens.dp(12)
            anchors.rightMargin: ThemeTokens.dp(12)
            height: 1
            radius: height / 2
            opacity: 0.6
            color: root.fillColor
        }

        Column {
            id: body
            anchors.left: parent.left
            anchors.right: parent.right
            anchors.top: parent.top
            anchors.leftMargin: root.horizontalPadding
            anchors.rightMargin: root.horizontalPadding
            anchors.topMargin: root.verticalPadding
            spacing: root.rowGap

            Item {
                id: topRow
                width: parent.width
                height: Math.max(glyphFrame.height, middle.height, dismissBtn.visible ? dismissBtn.height : 0)

                Rectangle {
                    id: glyphFrame
                    width: root.glyphFrameSize
                    height: root.glyphFrameSize
                    radius: height / 2
                    color: root.glyphBackground
                    border.width: 1
                    border.color: root.glyphBorder
                    anchors.left: parent.left
                    anchors.verticalCenter: parent.verticalCenter

                    ChaSetStatusIcon {
                        visible: root.iconName === ""
                        anchors.centerIn: parent
                        size: 16
                        status: root.statusKey
                        overrideColor: root.accentColor
                    }

                    ChaSetIcon {
                        visible: root.iconName !== ""
                        anchors.centerIn: parent
                        name: root.iconName
                        size: 16
                        color: root.accentColor
                    }
                }

                Column {
                    id: middle
                    width: root.middleWidth
                    spacing: ThemeTokens.dp(2)
                    anchors.left: glyphFrame.right
                    anchors.leftMargin: root.rowGap
                    anchors.verticalCenter: parent.verticalCenter

                    Item {
                        id: titleRow
                        width: parent.width
                        height: Math.max(titleText.implicitHeight, metaText.height)

                        Text {
                            id: titleText
                            anchors.left: parent.left
                            anchors.verticalCenter: parent.verticalCenter
                            width: parent.width - (metaText.visible ? metaText.width + ThemeTokens.dp(8) : 0)
                            text: root.title
                            color: root.onSurface
                            font.pixelSize: Typography.sizeBody
                            font.weight: Typography.weightSemibold
                            font.family: Typography.familySans
                            elide: Text.ElideRight
                            maximumLineCount: 1
                        }

                        Text {
                            id: metaText
                            visible: root.meta !== ""
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            text: root.meta
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeMicro
                            font.family: Typography.familySans
                        }
                    }

                    Text {
                        id: detailText
                        width: parent.width
                        visible: root.detail !== ""
                        text: root.detail
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                        font.family: Typography.familySans
                        elide: Text.ElideRight
                        maximumLineCount: 1
                    }
                }

                Rectangle {
                    id: dismissBtn
                    width: root.dismissSize
                    height: root.dismissSize
                    radius: height / 2
                    visible: root.dismissible
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    color: dismissHover.hovered
                        ? Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.7)
                        : "transparent"

                    Behavior on color {
                        enabled: ThemeTokens.animationsEnabled
                        ColorAnimation { duration: ThemeTokens.motionShort; easing.type: ThemeTokens.easeStandard }
                    }

                    ChaSetIcon {
                        anchors.centerIn: parent
                        name: "x"
                        size: 14
                        color: dismissHover.hovered ? root.onSurface : ThemeTokens.subduedText
                    }

                    Accessible.role: Accessible.Button
                    Accessible.name: root.dismissLabel !== "" ? root.dismissLabel : ("Dismiss " + root.itemId)

                    HoverHandler {
                        id: dismissHover
                        cursorShape: Qt.PointingHandCursor
                    }

                    TapHandler {
                        onTapped: root.dismissRequested()
                    }
                }
            }

            // Determinate track, or the shimmering sweep of an unknown duration.
            Rectangle {
                id: progressTrack
                visible: root.hasProgress
                width: parent.width
                height: ThemeTokens.dp(3)
                radius: height / 2
                color: Qt.rgba(ThemeTokens.panelRaised.r, ThemeTokens.panelRaised.g, ThemeTokens.panelRaised.b, 0.4)
                clip: true

                Rectangle {
                    visible: !root.indeterminate
                    height: parent.height
                    radius: height / 2
                    width: parent.width * root.ratio
                    color: root.fillColor

                    Behavior on width {
                        enabled: ThemeTokens.animationsEnabled
                        NumberAnimation { duration: ThemeTokens.motionDuration(300); easing.type: ThemeTokens.easeStandard }
                    }
                }

                Rectangle {
                    id: shimmerBar
                    visible: root.indeterminate
                    height: parent.height
                    width: parent.width * 0.36
                    x: -width
                    gradient: Gradient {
                        orientation: Gradient.Horizontal
                        GradientStop { position: 0.0; color: "transparent" }
                        GradientStop { position: 0.5; color: ThemeTokens.accent }
                        GradientStop { position: 1.0; color: "transparent" }
                    }

                    SequentialAnimation on x {
                        loops: Animation.Infinite
                        running: ThemeTokens.animationsEnabled && shimmerBar.visible
                        NumberAnimation {
                            from: -shimmerBar.width
                            to: progressTrack.width
                            duration: 1600
                            easing.type: ThemeTokens.easeStandard
                        }
                    }
                }
            }

            // Trailing action row, right-packed so button order is preserved.
            Item {
                id: actionsHost
                visible: root.hasActions
                width: parent.width
                implicitHeight: actionsRow.implicitHeight
                height: implicitHeight

                Row {
                    id: actionsRow
                    anchors.right: parent.right
                    anchors.verticalCenter: parent.verticalCenter
                    spacing: ThemeTokens.dp(8)

                    Repeater {
                        model: root.actions

                        delegate: ChaSetButton {
                            required property var modelData
                            size: "xs"
                            variant: (modelData && modelData.variant) ? modelData.variant : "outline"
                            text: (modelData && modelData.label) ? modelData.label : ""
                            onClicked: root.actionTriggered(modelData && modelData.id ? modelData.id : "")
                        }
                    }
                }
            }
        }
    }

    // Focus ring for the stack's roving traversal (React `focus-visible:ring-2`).
    Rectangle {
        anchors.fill: cardBox
        anchors.margins: -ThemeTokens.dp(2)
        radius: cardBox.radius + ThemeTokens.dp(2)
        color: "transparent"
        border.width: 2
        border.color: ThemeTokens.focus
        visible: root.focused
    }
}
