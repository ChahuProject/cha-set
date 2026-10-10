// TableOfContentsDocPage.qml — Living Documentation for ChaSetTableOfContents
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Table of Contents"
    description: ChaSetI18n.tr("components.tableOfContents.description", "Hierarchical outline navigation tree with guide lines, active indicator, and banner offset support.")

    property bool showBanner: true
    property int bannerHeight: 40
    property string variant: "default"
    property string size: "default"
    property bool showTrack: true
    property string activeId: "architecture"

    readonly property var demoItems: [
        {
            id: "introduction",
            title: ChaSetI18n.tr("surfaces.tableOfContents.items.introduction"),
            level: 1,
            children: [
                { id: "motivation", title: ChaSetI18n.tr("surfaces.tableOfContents.items.motivation"), level: 2 },
                { id: "design-principles", title: ChaSetI18n.tr("surfaces.tableOfContents.items.designPrinciples"), level: 2 }
            ]
        },
        {
            id: "architecture",
            title: ChaSetI18n.tr("surfaces.tableOfContents.items.architecture"),
            level: 1,
            children: [
                {
                    id: "data-flow",
                    title: ChaSetI18n.tr("surfaces.tableOfContents.items.dataFlow"),
                    level: 2,
                    children: [
                        { id: "signals", title: ChaSetI18n.tr("surfaces.tableOfContents.items.signals"), level: 3 },
                        { id: "batching", title: ChaSetI18n.tr("surfaces.tableOfContents.items.batching"), level: 3 }
                    ]
                },
                { id: "boundary", title: ChaSetI18n.tr("surfaces.tableOfContents.items.boundary"), level: 2 }
            ]
        },
        {
            id: "implementation",
            title: ChaSetI18n.tr("surfaces.tableOfContents.items.implementation"),
            level: 1,
            children: [
                { id: "banner-offset", title: ChaSetI18n.tr("surfaces.tableOfContents.items.bannerOffset"), level: 2 },
                { id: "tree-rendering", title: ChaSetI18n.tr("surfaces.tableOfContents.items.treeRendering"), level: 2 }
            ]
        },
        {
            id: "changelog",
            title: ChaSetI18n.tr("surfaces.tableOfContents.items.changelog"),
            level: 1
        }
    ]

    function resetDemo() {
        root.showBanner = true;
        root.bannerHeight = 40;
        root.variant = "default";
        root.size = "default";
        root.showTrack = true;
        root.activeId = "architecture";
    }

    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("desktopComposite.tableOfContents.sandboxTitle", "Table of Contents Sandbox")
        // React's stage is `min-h-[18.75rem] p-8 …` and grows with its content;
        // this stage is a fixed height, so size it so the demo card (banner +
        // p-6 content row) fits without being clipped.
        stageHeight: 550
        reactCode: `<TableOfContents
  items={items}
  activeId="${root.activeId}"
  topOffset={${root.showBanner ? root.bannerHeight : 0}}
  targetOffset={${root.showBanner ? root.bannerHeight + 16 : 16}}
  variant="${root.variant}"
  size="${root.size}"
  showTrack={${root.showTrack}}
  onSelect={(item) => setActiveId(item.id)}
/>`
        qtCode: `ChaSetTableOfContents {
    items: demoItems
    activeId: "${root.activeId}"
    topOffset: ${root.showBanner ? root.bannerHeight : 0}
    targetOffset: ${root.showBanner ? root.bannerHeight + 16 : 16}
    variant: "${root.variant}"
    size: "${root.size}"
    showTrack: ${root.showTrack}
    onSelectItem: (item) => activeId = item.id
}`

        // Controls bar. Mirrors React's `flex flex-wrap items-center gap-4 text-xs`.
        // The bar's children live in a Flow, and a Flow positions its own
        // children: an anchor on a TOP-LEVEL item aborts the whole layout
        // ("QML Flow: Cannot specify anchors for items inside Flow"), which is
        // what stacked every control on the origin. Vertical centring therefore
        // sits on each row's inner children, as on the other living doc pages.
        controlsData: [
            Row {
                spacing: ThemeTokens.dp(8)
                DocText {
                    anchors.verticalCenter: parent.verticalCenter
                    text: ChaSetI18n.tr("surfaces.tableOfContents.topBanner", "Top Banner:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }
                ChaSetSwitch {
                    anchors.verticalCenter: parent.verticalCenter
                    checked: root.showBanner
                    onToggled: function(val) { root.showBanner = val; }
                }
            },
            Row {
                visible: root.showBanner
                spacing: ThemeTokens.dp(8)
                DocText {
                    anchors.verticalCenter: parent.verticalCenter
                    text: ChaSetI18n.tr("surfaces.tableOfContents.bannerHeight", "Banner Height:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }
                Item {
                    anchors.verticalCenter: parent.verticalCenter
                    width: ThemeTokens.dp(96)
                    height: ThemeTokens.dp(20)
                    ChaSetSlider {
                        anchors.fill: parent
                        min: 24
                        max: 80
                        step: 4
                        value: root.bannerHeight
                        onValueMoved: function(val) { root.bannerHeight = Math.round(val); }
                    }
                }
                DocText {
                    anchors.verticalCenter: parent.verticalCenter
                    text: String(root.bannerHeight)
                    color: ThemeTokens.text
                    font.family: Typography.familyMono
                    font.pixelSize: Typography.sizeSmall
                }
            },
            Row {
                spacing: ThemeTokens.dp(8)
                DocText {
                    anchors.verticalCenter: parent.verticalCenter
                    text: ChaSetI18n.tr("showcase.variant")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    value: root.variant
                    options: [
                        { label: ChaSetI18n.tr("common.default"), value: "default" },
                        { label: ChaSetI18n.tr("surfaces.tableOfContents.track"), value: "track" },
                        { label: ChaSetI18n.tr("surfaces.tableOfContents.flat"), value: "flat" }
                    ]
                    onValueSelected: function(val) { root.variant = String(val); }
                }
            },
            Row {
                spacing: ThemeTokens.dp(8)
                DocText {
                    anchors.verticalCenter: parent.verticalCenter
                    text: ChaSetI18n.tr("showcase.size")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    value: root.size
                    options: [
                        { label: ChaSetI18n.tr("common.default"), value: "default" },
                        { label: ChaSetI18n.tr("surfaces.tableOfContents.small"), value: "sm" }
                    ]
                    onValueSelected: function(val) { root.size = String(val); }
                }
            },
            Row {
                spacing: ThemeTokens.dp(8)
                DocText {
                    anchors.verticalCenter: parent.verticalCenter
                    text: ChaSetI18n.tr("surfaces.tableOfContents.showTrack")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }
                ChaSetSwitch {
                    anchors.verticalCenter: parent.verticalCenter
                    checked: root.showTrack
                    onToggled: function(val) { root.showTrack = val; }
                }
            },
            ChaSetButton {
                size: "sm"
                variant: "outline"
                icon: "rotate-ccw"
                text: ChaSetI18n.tr("common.reset")
                onClicked: function() { root.resetDemo(); }
            }
        ]

        // Stage Container
        // Stage. Mirrors React's `w-full max-w-xl mx-auto py-2` wrapper around a
        // `rounded-lg border border-border bg-card/60 overflow-hidden` card.
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Item {
                id: demoWrapper
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(64), ThemeTokens.dp(576))   // max-w-xl = 36rem
                implicitHeight: demoCard.implicitHeight + ThemeTokens.dp(16)              // py-2 → 8 + 8
                height: implicitHeight

                Rectangle {
                    id: demoCard
                    anchors.horizontalCenter: parent.horizontalCenter
                    anchors.verticalCenter: parent.verticalCenter
                    width: parent.width
                    implicitHeight: cardCol.implicitHeight
                    height: implicitHeight
                    color: Qt.rgba(ThemeTokens.panel.r, ThemeTokens.panel.g, ThemeTokens.panel.b, 0.6)
                    border.width: 1
                    border.color: ThemeTokens.border
                    radius: ThemeTokens.dp(8)
                    clip: true

                    Column {
                        id: cardCol
                        width: parent.width

                        // Announcement banner — React `bg-primary/10 border-b
                        // border-primary/20 px-4`, offset chip pushed right.
                        Rectangle {
                            id: bannerBox
                            visible: root.showBanner
                            width: parent.width
                            height: ThemeTokens.dp(root.bannerHeight)
                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.1)

                            Rectangle {
                                anchors.bottom: parent.bottom
                                width: parent.width
                                height: 1
                                color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.2)
                            }

                            Text {
                                anchors.left: parent.left
                                anchors.leftMargin: ThemeTokens.dp(16)
                                anchors.right: bannerChip.left
                                anchors.rightMargin: ThemeTokens.dp(8)
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("surfaces.tableOfContents.bannerText")
                                color: ThemeTokens.accent
                                font.family: Typography.familySans
                                font.pixelSize: Typography.sizeSmall
                                font.weight: Typography.weightSemibold
                                elide: Text.ElideRight
                            }

                            Rectangle {
                                id: bannerChip
                                anchors.right: parent.right
                                anchors.rightMargin: ThemeTokens.dp(16)
                                anchors.verticalCenter: parent.verticalCenter
                                width: bannerChipText.implicitWidth + ThemeTokens.dp(12)   // px-1.5
                                height: bannerChipText.implicitHeight + ThemeTokens.dp(4)  // py-0.5
                                radius: ThemeTokens.dp(4)
                                color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.2)

                                Text {
                                    id: bannerChipText
                                    anchors.centerIn: parent
                                    text: ChaSetI18n.tr("surfaces.tableOfContents.bannerOffsetChip", "Offset: {{offset}}", { "offset": root.bannerHeight })
                                    color: ThemeTokens.accent
                                    font.family: Typography.familyMono
                                    font.pixelSize: Typography.sizeMicro
                                }
                            }
                        }

                        // Content — React `p-6 flex flex-row gap-8 items-start`.
                        Item {
                            id: contentArea
                            width: parent.width
                            implicitHeight: contentRow.implicitHeight + ThemeTokens.dp(48)   // p-6 → 24 + 24

                            Row {
                                id: contentRow
                                anchors.horizontalCenter: parent.horizontalCenter
                                anchors.top: parent.top
                                anchors.topMargin: ThemeTokens.dp(24)
                                width: parent.width - ThemeTokens.dp(48)
                                height: implicitHeight
                                spacing: ThemeTokens.dp(32)                                  // gap-8

                                // flex-1 reading column
                                Rectangle {
                                    width: contentRow.width - ThemeTokens.dp(32) - ThemeTokens.dp(224)
                                    implicitHeight: readingCard.implicitHeight
                                    height: implicitHeight
                                    color: "transparent"

                                    // React `p-4 rounded-md border border-border/80 bg-background/50 space-y-2`
                                    Rectangle {
                                        id: readingCard
                                        width: parent.width
                                        implicitHeight: readingCol.implicitHeight + ThemeTokens.dp(32)   // p-4 → 16 + 16
                                        height: implicitHeight
                                        color: Qt.rgba(ThemeTokens.background.r, ThemeTokens.background.g, ThemeTokens.background.b, 0.5)
                                        border.width: 1
                                        border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.8)
                                        radius: ThemeTokens.dp(6)

                                        Column {
                                            id: readingCol
                                            anchors.horizontalCenter: parent.horizontalCenter
                                            anchors.verticalCenter: parent.verticalCenter
                                            width: parent.width - ThemeTokens.dp(32)
                                            spacing: ThemeTokens.dp(8)                                   // space-y-2

                                            Text {
                                                width: parent.width
                                                text: ChaSetI18n.tr("surfaces.tableOfContents.readingPaneTitle")
                                                color: ThemeTokens.text
                                                font.family: Typography.familySans
                                                font.pixelSize: Typography.sizeBody
                                                font.weight: Typography.weightSemibold
                                            }

                                            Text {
                                                width: parent.width
                                                text: ChaSetI18n.tr("surfaces.tableOfContents.activeOutlineTarget", "Active outline target: {{target}}", { "target": root.activeId })
                                                color: ThemeTokens.subduedText
                                                font.family: Typography.familySans
                                                font.pixelSize: Typography.sizeSmall
                                                wrapMode: Text.WordWrap
                                            }

                                            Text {
                                                width: parent.width
                                                text: ChaSetI18n.tr("desktopComposite.tableOfContents.readingPanePara", "Notice how the table of contents tree reflects the nested heading structure, and smoothly aligns with the top banner height offset.")
                                                color: ThemeTokens.subduedText
                                                font.family: Typography.familySans
                                                font.pixelSize: Typography.sizeSmall
                                                wrapMode: Text.WordWrap
                                            }
                                        }
                                    }
                                }

                                // `w-56 shrink-0 p-3` ToC card — React `rounded-md
                                // border border-border/60 bg-background/80`.
                                Rectangle {
                                    width: ThemeTokens.dp(224)
                                    implicitHeight: tocComp.implicitHeight + ThemeTokens.dp(24)   // p-3 → 12 + 12
                                    height: implicitHeight
                                    color: Qt.rgba(ThemeTokens.background.r, ThemeTokens.background.g, ThemeTokens.background.b, 0.8)
                                    border.width: 1
                                    border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.6)
                                    radius: ThemeTokens.dp(6)

                                    ChaSetTableOfContents {
                                        id: tocComp
                                        anchors.centerIn: parent
                                        width: parent.width - ThemeTokens.dp(24)
                                        items: root.demoItems
                                        activeId: root.activeId
                                        topOffset: root.showBanner ? root.bannerHeight : 0
                                        targetOffset: root.showBanner ? root.bannerHeight + 16 : 16
                                        variant: root.variant
                                        size: root.size
                                        showTrack: root.showTrack
                                        onSelectItem: function(item) {
                                            root.activeId = item.id;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

        // 2. Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetTableOfContents {\n    items: demoItems\n    activeId: currentSectionId\n    onSelectItem: (item) => scrollTo(item)\n}`
        reactCode: `import { TableOfContents, type TocItem } from '@chahu/cha-set';\n\n<TableOfContents\n  items={items}\n  activeId={activeId}\n  onSelect={(item) => scrollTo(item)}\n/>`
    }

    // 3. Footer Sections (Animations, Keyboard Navigation, Props Reference)
        // Animations
    Column {
        width: parent.width
        spacing: ThemeTokens.dp(8)

        DocText {
            text: ChaSetI18n.tr("showcase.animations", "Animations")
            font.pixelSize: Typography.sizeTitleSm
            font.weight: Typography.weightBold
            color: ThemeTokens.text
        }

        DocText {
            text: "State changes (hover, press, focus) animate over duration-quick with standard easing curves. Durations and easing resolve from theme tokens; prefers-reduced-motion zeroes them automatically (governed by ThemeTokens.animationsEnabled)."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentReference {
        name: "TableOfContents"
        componentId: "table-of-contents"
        propsModel: [
            {
                name: "items",
                type: "var (array)",
                defaultValue: "[]",
                description: ChaSetI18n.tr("components.tableOfContents.itemsDesc", "Hierarchical array of outline items with level and nested children.")
            },
            {
                name: "activeId",
                type: "string",
                defaultValue: '""',
                description: ChaSetI18n.tr("components.tableOfContents.activeIdDesc", "Currently active section ID.")
            },
            {
                name: "topOffset",
                type: "real",
                defaultValue: "0",
                description: ChaSetI18n.tr("components.tableOfContents.topOffsetDesc", "Top offset for sticky positioning, accommodating global announcement banners.")
            },
            {
                name: "targetOffset",
                type: "real",
                defaultValue: "0",
                description: ChaSetI18n.tr("components.tableOfContents.targetOffsetDesc", "Safety scroll offset ensuring headings are not occluded by top banners.")
            },
            {
                name: "variant",
                type: "string",
                defaultValue: '"default"',
                description: ChaSetI18n.tr("components.tableOfContents.variantDesc", "Visual styling variant of the table of contents container.")
            },
            {
                name: "size",
                type: "string",
                defaultValue: '"default"',
                description: ChaSetI18n.tr("components.tableOfContents.sizeDesc", "Size density and font scaling of the outline labels.")
            },
            {
                name: "showTrack",
                type: "bool",
                defaultValue: "true",
                description: ChaSetI18n.tr("components.tableOfContents.showTrackDesc", "Whether to render the vertical guide track and active indicator marker.")
            },
            {
                name: "showTitle",
                type: "bool",
                defaultValue: "true",
                description: ChaSetI18n.tr("components.tableOfContents.showTitleDesc", "Whether to display the header title label.")
            },
            {
                name: "title",
                type: "string",
                defaultValue: '"ON THIS PAGE"',
                description: ChaSetI18n.tr("components.tableOfContents.titleDesc", "Header title text displayed above outline items.")
            }
        ]
    }
    }
