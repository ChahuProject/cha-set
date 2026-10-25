// HoverCopyDocPage.qml — Living Documentation for ChaSetHoverCopy / ChaSetCopyableBadge
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Base Primitives"
    pageTitle: "Hover Copy"
    description: ChaSetI18n.tr("components.hover-copy.description", "Hover-dim overlay with centered copy button; clicking anywhere on the overlay copies.")

    tocItems: [
        { id: "overview", title: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview") },
        { id: "installation", title: ChaSetI18n.tr("showcase.installation", "Installation") },
        { id: "preset", title: ChaSetI18n.tr("components.hover-copy.presetTitle", "CopyableBadge Preset") },
        { id: "playground", title: ChaSetI18n.tr("components.hover-copy.playgroundTitle", "Timing & Dim Controls") },
        { id: "animations", title: ChaSetI18n.tr("showcase.animations", "Animations") },
        { id: "keyboard", title: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation") },
        { id: "props", title: ChaSetI18n.tr("showcase.propsReference", "Props Reference") }
    ]

    property string copyStatus: ChaSetI18n.tr("components.hover-copy.hoverHint", "Hover the card, then click anywhere on the overlay to copy.")
    property string playgroundRadius: "md"
    property real playgroundDim: 0.45
    property int playgroundResetTime: 1000
    property bool playgroundDisabled: false
    // Demo payloads stay byte-identical across locales: plain properties,
    // never raw quoted literals on visible text bindings.
    readonly property string demoToken: "sk-chaset-demo-token-9182"
    readonly property string resetTarget: "sk-chaset-reset-2048"

    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("components.hover-copy.overviewDesc", "Hover any wrapped content to reveal a dim scrim with a centered copy button. Click anywhere on the overlay to copy the configured text payload.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("showcase.previewTitles.Hover to reveal", "Hover to reveal")
        reactCode: `<HoverCopy text="sk-chaset-demo-token-9182">\n  <Card className="w-64 p-4">\n    <p className="text-sm font-medium text-card-foreground">Order #1024</p>\n    <p className="text-xs text-muted-foreground">cha-set / dev-2049</p>\n  </Card>\n</HoverCopy>`
        qtCode: `ChaSetHoverCopy {\n    text: "sk-chaset-demo-token-9182"\n    radius: "md"\n    onCopiedToClipboard: (txt) => console.log("Copied:", txt)\n\n    ChaSetCard {\n        width: ThemeTokens.dp(256)\n\n        ChaSetCardContent {\n            Column {\n                spacing: ThemeTokens.dp(4)\n                Text { text: "Order #1024" }\n                Text { text: "cha-set / dev-2049" }\n            }\n        }\n    }\n}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(16)

                ChaSetHoverCopy {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.demoToken
                    radius: "md"
                    onCopiedToClipboard: function(txt) {
                        root.copyStatus = ChaSetI18n.tr("components.hover-copy.copiedSuccess", "Successfully copied: {{text}}", { "text": txt })
                    }

                    ChaSetCard {
                        width: ThemeTokens.dp(256)

                        ChaSetCardContent {
                            Column {
                                spacing: ThemeTokens.dp(4)
                                width: parent.width

                                DocText {
                                    text: "Order #1024"
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.weight: Typography.weightMedium
                                }

                                DocText {
                                    text: "cha-set / dev-2049"
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: Typography.sizeMicro
                                }
                            }
                        }
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: root.copyStatus
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    font.family: Typography.familyMono
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "installation"
        pageTitle: ChaSetI18n.tr("showcase.installation", "Installation")
        width: parent.width
        qtCode: `import ChaSet

ChaSetHoverCopy {
    text: "sk-chaset-demo-token-9182"
    radius: "md"
    onCopiedToClipboard: (txt) => console.log("Copied:", txt)
}`
        reactCode: `import { HoverCopy, CopyableBadge } from '@chahu/cha-set';

<HoverCopy text="sk-chaset-demo-token-9182" radius="md">
  <Card className="w-64 p-4">...</Card>
</HoverCopy>`
    }

    Column {
        property string sectionId: "preset"
        property string sectionTitle: ChaSetI18n.tr("components.hover-copy.presetTitle", "CopyableBadge Preset")
        width: parent.width
        spacing: ThemeTokens.dp(12)

        ComponentPreview {
            title: ChaSetI18n.tr("showcase.previewTitles.CopyableBadge preset", "CopyableBadge preset")
            reactCode: `<CopyableBadge text="ORDER-1024">ORDER-1024</CopyableBadge>`
            qtCode: `ChaSetCopyableBadge {\n    text: "ORDER-1024"\n}`

            Item {
                anchors.fill: parent

                Column {
                    anchors.centerIn: parent
                    spacing: ThemeTokens.dp(12)

                    DocText {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: ChaSetI18n.tr("components.hover-copy.presetDesc", "Pill-radius badge with hover copy attached. The label defaults to the copied text.")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }

                    ChaSetCopyableBadge {
                        anchors.horizontalCenter: parent.horizontalCenter
                        text: "ORDER-1024"
                    }
                }
            }
        }
    }

    Column {
        property string sectionId: "playground"
        property string sectionTitle: ChaSetI18n.tr("components.hover-copy.playgroundTitle", "Timing & Dim Controls")
        width: parent.width
        spacing: ThemeTokens.dp(12)

        ComponentPreview {
            title: ChaSetI18n.tr("showcase.previewTitles.Timing & Dim Controls", "Timing & Dim Controls")
            stageHeight: 200
            reactCode: `const [resetTime, setResetTime] = useState(1000);\nconst [dim, setDim] = useState(0.45);\nconst [radius, setRadius] = useState<'none' | 'sm' | 'md' | 'lg' | 'full'>('md');\n\n<HoverCopy text="sk-chaset-reset-2048" resetTime={resetTime} dim={dim} radius={radius} disabled={disabled}>\n  <code className="text-xs font-mono">sk-chaset-reset-2048</code>\n</HoverCopy>`
            qtCode: `ChaSetHoverCopy {\n    text: "sk-chaset-reset-2048"\n    radius: "md"\n    dim: 0.45\n    resetTime: 1000\n    onCopiedToClipboard: (txt) => console.log("Copied:", txt)\n\n    Text {\n        text: "sk-chaset-reset-2048"\n        font.family: Typography.familyMono\n    }\n}`

            Item {
                anchors.fill: parent

                ChaSetHoverCopy {
                    anchors.centerIn: parent
                    text: root.resetTarget
                    radius: root.playgroundRadius
                    dim: root.playgroundDim
                    resetTime: root.playgroundResetTime
                    disabled: root.playgroundDisabled

                    Text {
                        color: ThemeTokens.text
                        font.family: Typography.familyMono
                        font.pixelSize: Typography.sizeSmall
                        text: root.resetTarget
                    }
                }
            }

            controlsData: [
                Row {
                    spacing: ThemeTokens.dp(8)
                    DocText {
                        text: ChaSetI18n.tr("components.hover-copy.radius", "Radius")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.playgroundRadius
                        options: [
                            { label: ChaSetI18n.tr("components.hover-copy.radiusNone", "none"), value: "none" },
                            { label: ChaSetI18n.tr("components.hover-copy.radiusSm", "sm"), value: "sm" },
                            { label: ChaSetI18n.tr("components.hover-copy.radiusMd", "md"), value: "md" },
                            { label: ChaSetI18n.tr("components.hover-copy.radiusLg", "lg"), value: "lg" },
                            { label: ChaSetI18n.tr("components.hover-copy.radiusFull", "full"), value: "full" }
                        ]
                        onValueSelected: function(v) { root.playgroundRadius = String(v) }
                    }
                },
                Row {
                    spacing: ThemeTokens.dp(8)
                    DocText {
                        text: ChaSetI18n.tr("components.hover-copy.restoreInterval", "Restore interval")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSlider {
                        anchors.verticalCenter: parent.verticalCenter
                        width: ThemeTokens.dp(160)
                        size: "sm"
                        value: root.playgroundResetTime
                        min: 400
                        max: 3000
                        step: 100
                        onValueMoved: function(val) { root.playgroundResetTime = Math.round(val) }
                    }
                    DocText {
                        text: root.playgroundResetTime.toString()
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                        font.family: Typography.familyMono
                        anchors.verticalCenter: parent.verticalCenter
                    }
                },
                Row {
                    spacing: ThemeTokens.dp(8)
                    DocText {
                        text: ChaSetI18n.tr("components.hover-copy.dimAmount", "Dim amount")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSlider {
                        anchors.verticalCenter: parent.verticalCenter
                        width: ThemeTokens.dp(160)
                        size: "sm"
                        value: root.playgroundDim
                        min: 0.1
                        max: 0.8
                        step: 0.05
                        onValueMoved: function(val) { root.playgroundDim = val }
                    }
                    DocText {
                        text: root.playgroundDim.toFixed(2)
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                        font.family: Typography.familyMono
                        anchors.verticalCenter: parent.verticalCenter
                    }
                },
                Row {
                    spacing: ThemeTokens.dp(8)
                    ChaSetCheckbox {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        label: ChaSetI18n.tr("components.hover-copy.disabled", "Disabled")
                        checked: root.playgroundDisabled
                        onToggled: function(val) { root.playgroundDisabled = val }
                    }
                }
            ]
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("showcase.previewTitles.Truncated display full copy", "Truncated display, full copy")
        reactCode: `<HoverCopy text="ORDER-2026-0417-PROD-HOTFIX">\n  <span className="block max-w-32 truncate text-sm text-foreground">ORDER-2026-0417-PROD-HOTFIX</span>\n</HoverCopy>`
        qtCode: `ChaSetHoverCopy {\n    text: "ORDER-2026-0417-PROD-HOTFIX"\n\n    Text {\n        width: ThemeTokens.dp(128)\n        elide: Text.ElideRight\n        text: "ORDER-2026-0417-PROD-HOTFIX"\n    }\n}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(8)

                ChaSetHoverCopy {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: "ORDER-2026-0417-PROD-HOTFIX"

                    Text {
                        width: ThemeTokens.dp(128)
                        elide: Text.ElideRight
                        maximumLineCount: 1
                        color: ThemeTokens.text
                        font.pixelSize: Typography.sizeSmall
                        text: "ORDER-2026-0417-PROD-HOTFIX"
                    }
                }

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: ChaSetI18n.tr("components.hover-copy.truncateHint", "Only the start fits on screen; copying grabs the complete identifier.")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }
            }
        }
    }

    Column {
        property string sectionId: "animations"
        property string sectionTitle: ChaSetI18n.tr("showcase.animations", "Animations")
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: ChaSetI18n.tr("showcase.animations", "Animations")
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            text: ChaSetI18n.tr("components.hover-copy.animationsDesc", "Overlay reveal and icon swap animate with ThemeTokens.motionQuick and ThemeTokens.motionShort using ThemeTokens.easeStandard. Setting ThemeTokens.animationsEnabled to false makes every transition instant; the restore timer is a logic timer and is never shortened.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "hover-copy"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "hover-copy"
        section: "props"
    }
}
