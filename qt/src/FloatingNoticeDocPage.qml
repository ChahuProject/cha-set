// FloatingNoticeDocPage.qml — Living documentation for ChaSetFloatingNotice.
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Floating Notice"
    description: ChaSetI18n.tr("components.floatingNotice.description", "Floating stacked notice pill anchored to top or bottom with priority queueing, card-stack cycling, and extensible content.")

    property string demoPlacement: "top"
    property string demoGap: "auto"
    readonly property var effectiveDemoGap: root.demoGap === "auto" ? undefined : Number(root.demoGap)
    property var demoNotices: [
        {
            id: "n-1",
            title: ChaSetI18n.tr("overlays.floatingNotice.copiedTitle", "File path copied to clipboard"),
            description: "dunting-qt/qml/Main.qml",
            level: "default",
            duration: 5000,
            closable: true,
            priority: 0
        },
        {
            id: "n-2",
            title: ChaSetI18n.tr("overlays.floatingNotice.ratingTitle", "Rated 5 stars"),
            description: ChaSetI18n.tr("overlays.floatingNotice.demoFileDesc", "Image 001.png"),
            level: "info",
            duration: 5000,
            closable: true,
            priority: 10
        },
        {
            id: "n-3",
            title: ChaSetI18n.tr("overlays.floatingNotice.warningTitle", "Disk storage low"),
            description: ChaSetI18n.tr("overlays.floatingNotice.demoStorageDesc", "Under 10% remaining"),
            level: "warning",
            duration: 5000,
            closable: true,
            priority: 20
        }
    ]

    function addNotice(level, title, priority) {
        var arr = root.demoNotices.slice();
        arr.push({
            id: "notice-" + Date.now(),
            title: title,
            level: level,
            priority: (priority !== undefined) ? priority : 0,
            duration: 5000,
            closable: true
        });
        root.demoNotices = arr;
    }

    function resetNotices() {
        root.demoNotices = [
            {
                id: "r-1",
                title: ChaSetI18n.tr("overlays.floatingNotice.copiedTitle", "File path copied to clipboard"),
                level: "default",
                duration: 5000
            },
            {
                id: "r-2",
                title: ChaSetI18n.tr("overlays.floatingNotice.ratingTitle", "Rated 5 stars"),
                level: "info",
                duration: 5000,
                priority: 10
            }
        ];
    }

    function removeNotice(id) {
        var arr = [];
        for (var i = 0; i < root.demoNotices.length; i++) {
            if (String(root.demoNotices[i].id) !== String(id)) {
                arr.push(root.demoNotices[i]);
            }
        }
        root.demoNotices = arr;
    }

    // 1. Interactive Overview Preview
    ComponentPreview {
        width: parent.width
        title: ChaSetI18n.tr("overlays.floatingNotice.previewTitle", "Floating Notice Stack")
        stageHeight: 300
        reactCode: `<FloatingNotice
  notices={notices}
  placement="${root.demoPlacement}"${root.effectiveDemoGap !== undefined ? '\n  gap={' + root.effectiveDemoGap + '}' : ''}
  onDismiss={handleDismiss}
  pauseOnHover={true}
  zoomOnHover={true}
/>`
        qtCode: `ChaSetFloatingNotice {
    placement: "${root.demoPlacement}"${root.effectiveDemoGap !== undefined ? '\n    gap: ' + root.effectiveDemoGap : ''}
    notices: demoNotices
    pauseOnHover: true
    zoomOnHover: true
    onDismissed: function(id) { removeNotice(id) }
}`

        stageData: [
            Item {
                anchors.fill: parent

                // Top Controls Toolbar
                Row {
                    anchors.top: parent.top
                    anchors.left: parent.left
                    anchors.right: parent.right
                    anchors.margins: ThemeTokens.dp(16)
                    spacing: ThemeTokens.dp(8)
                    z: 10

                    ChaSetButton {
                        size: "sm"
                        variant: "outline"
                        text: ChaSetI18n.tr("overlays.floatingNotice.addCopy", "+ Copy Notice")
                        onClicked: root.addNotice("default", "Copied 3 files", 0)
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "outline"
                        text: ChaSetI18n.tr("overlays.floatingNotice.addRating", "+ Rating Notice")
                        onClicked: root.addNotice("info", "Rated 5 stars", 10)
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "outline"
                        text: ChaSetI18n.tr("overlays.floatingNotice.addError", "+ Error Alert")
                        onClicked: root.addNotice("error", "Operation failed", 30)
                    }

                    Item { width: ThemeTokens.dp(6); height: 1 }

                    Row {
                        spacing: ThemeTokens.dp(6)
                        anchors.verticalCenter: parent.verticalCenter

                        Text {
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("overlays.floatingNotice.gap", "Spacing:")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeSmall
                        }

                        ChaSetSegmentedControl {
                            options: [
                                { label: ChaSetI18n.tr("overlays.floatingNotice.gapAuto", "Auto"), value: "auto" },
                                { label: ChaSetI18n.tr("overlays.floatingNotice.gapCompact", "Compact (7dp)"), value: "7" },
                                { label: ChaSetI18n.tr("overlays.floatingNotice.gapRelaxed", "Relaxed (12dp)"), value: "12" },
                                { label: ChaSetI18n.tr("overlays.floatingNotice.gapSpacious", "Spacious (16dp)"), value: "16" }
                            ]
                            value: root.demoGap
                            onValueChanged: function(val) { root.demoGap = String(val) }
                        }
                    }

                    ChaSetSegmentedControl {
                        options: [
                            { label: ChaSetI18n.tr("overlays.floatingNotice.placementTop", "Top"), value: "top" },
                            { label: ChaSetI18n.tr("overlays.floatingNotice.placementBottom", "Bottom"), value: "bottom" }
                        ]
                        value: root.demoPlacement
                        onValueChanged: function(val) { root.demoPlacement = val }
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "ghost"
                        text: ChaSetI18n.tr("overlays.floatingNotice.reset", "Reset")
                        onClicked: root.resetNotices()
                    }
                }

                // Sandbox Notice Instance
                ChaSetFloatingNotice {
                    id: sandboxNotice
                    placement: root.demoPlacement
                    offset: 56
                    gap: root.effectiveDemoGap
                    notices: root.demoNotices
                    onDismissed: function(id) { root.removeNotice(id) }
                }

                Text {
                    anchors.bottom: parent.bottom
                    anchors.horizontalCenter: parent.horizontalCenter
                    anchors.bottomMargin: ThemeTokens.dp(8)
                    text: ChaSetI18n.tr("overlays.floatingNotice.sandboxHint", "Hover over the notice to pause expiry and zoom the stack, or hover a peeking card behind to raise it to the top in place.")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeNano
                }
            }
        ]
    }

    // 2. Anatomy Section
    DocAnatomy {
        property string sectionId: "anatomy"
        width: parent.width
        reactCode: `import { FloatingNotice } from '@chahu/cha-set';

<FloatingNotice
  notices={[
    { id: "1", title: "Copied path", level: "default" },
    { id: "2", title: "Rated 5 stars", level: "info", priority: 10 }
  ]}
  placement="top"
  pauseOnHover={true}
  zoomOnHover={true}
/>`
        qtCode: `import ChaSet

ChaSetFloatingNotice {
    placement: "top"
    pauseOnHover: true
    zoomOnHover: true
    notices: [
        { id: "1", title: ChaSetI18n.tr("overlays.floatingNotice.copiedTitle", "File path copied to clipboard"), level: "default" },
        { id: "2", title: ChaSetI18n.tr("overlays.floatingNotice.ratingTitle", "Rated 5 stars"), level: "info", priority: 10 }
    ]
}`
    }

    // 3. Animations Section
    Column {
        property string sectionId: "animations"
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: ChaSetI18n.tr("showcase.toc.animations", "Animations")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            width: parent.width
            wrap: true
            text: ChaSetI18n.tr("overlays.floatingNotice.animationsDesc", "Floating Notice utilizes shared motion tokens for micro-interactions: zoom-on-hover utilizes duration-short (120ms) ease-standard; notice cycling and indicator dots use duration-quick (90ms); dismiss transitions fade and slide out smoothly.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeSmall
        }
    }

    // 4. Keyboard Navigation Section
    Column {
        property string sectionId: "keyboard"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: ChaSetI18n.tr("showcase.toc.keyboard", "Keyboard Navigation")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        KeyboardShortcutsTable {
            width: parent.width
            componentId: "floating-notice"
            title: ""
        }
    }

    // 5. Props Reference Section
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
                { name: "notices", type: "var", default: "[]", description: ChaSetI18n.tr("components.floatingNotice.noticesDesc", "Array of notice items to display and queue.") },
                { name: "placement", type: "string", default: "\"top\"", description: ChaSetI18n.tr("components.floatingNotice.placementDesc", "Anchoring edge for the floating notice container.") },
                { name: "offset", type: "int", default: "16", description: ChaSetI18n.tr("components.floatingNotice.offsetDesc", "Inset from anchored viewport edge in logical dp.") },
                { name: "gap", type: "real", default: "undefined (adaptive)", description: ChaSetI18n.tr("components.floatingNotice.gapDesc", "Joint spacing between stacked notice cards in logical dp. Omit for adaptive spacing based on notice count.") },
                { name: "defaultDuration", type: "int", default: "3000", description: ChaSetI18n.tr("components.floatingNotice.defaultDurationDesc", "Fallback lifetime in ms before auto-dismiss.") },
                { name: "pauseOnHover", type: "bool", default: "true", description: ChaSetI18n.tr("components.floatingNotice.pauseOnHoverDesc", "Whether mouse hovering suspends cycling and expiry timers.") },
                { name: "zoomOnHover", type: "bool", default: "true", description: ChaSetI18n.tr("components.floatingNotice.zoomOnHoverDesc", "Whether hovering smoothly magnifies the notice by 1.05x.") },
                { name: "closable", type: "bool", default: "true", description: ChaSetI18n.tr("components.floatingNotice.closableDesc", "Whether items reveal a close dismiss button on hover.") },
                { name: "customDelegate", type: "Component", default: "null", description: ChaSetI18n.tr("components.floatingNotice.renderContentDesc", "Optional custom delegate component for notice content slots.") }
            ]
        }
    }
}
