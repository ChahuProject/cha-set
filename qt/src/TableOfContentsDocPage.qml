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
        stageHeight: 420
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

        controlsData: [
            Row {
                spacing: ThemeTokens.dp(8)
                anchors.verticalCenter: parent.verticalCenter
                DocText {
                    text: ChaSetI18n.tr("showcase.variant")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
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
                anchors.verticalCenter: parent.verticalCenter
                DocText {
                    text: ChaSetI18n.tr("showcase.size")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSegmentedControl {
                    anchors.verticalCenter: parent.verticalCenter
                    size: "sm"
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
                anchors.verticalCenter: parent.verticalCenter
                DocText {
                    text: ChaSetI18n.tr("surfaces.tableOfContents.showTrack")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                    anchors.verticalCenter: parent.verticalCenter
                }
                ChaSetSwitch {
                    anchors.verticalCenter: parent.verticalCenter
                    checked: root.showTrack
                    onToggled: function(val) { root.showTrack = val; }
                }
            },
            ChaSetButton {
                anchors.verticalCenter: parent.verticalCenter
                size: "sm"
                variant: "outline"
                text: ChaSetI18n.tr("common.reset")
                onClicked: function() { root.resetDemo(); }
            }
        ]

        // Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Rectangle {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(32), ThemeTokens.dp(620))
                implicitHeight: cardCol.implicitHeight
                height: implicitHeight
                color: ThemeTokens.panel
                border.width: 1
                border.color: ThemeTokens.border
                radius: ThemeTokens.dp(8)
                clip: true

                Column {
                    id: cardCol
                    width: parent.width

                    // Simulated Announcement Banner
                    Rectangle {
                        id: bannerBox
                        visible: root.showBanner
                        width: parent.width
                        height: ThemeTokens.dp(root.bannerHeight)
                        color: ThemeTokens.isDark ? "#1e293b" : "#f1f5f9"
                        border.width: 1
                        border.color: ThemeTokens.accent

                        Row {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.verticalCenter: parent.verticalCenter
                            anchors.leftMargin: ThemeTokens.dp(16)
                            anchors.rightMargin: ThemeTokens.dp(16)

                            Text {
                                text: ChaSetI18n.tr("surfaces.tableOfContents.bannerText")
                                color: ThemeTokens.accent
                                font.family: Typography.familySans
                                font.pixelSize: Typography.sizeCaption
                                font.weight: Typography.weightMedium
                            }
                        }
                    }

                    // Content Area (Item wrapper: Row has no padding prop,
                    // so apply manual ThemeTokens.dp(20) offsets around the Row)
                    Item {
                        width: parent.width
                        implicitHeight: contentRow.implicitHeight + ThemeTokens.dp(40)

                        Row {
                            id: contentRow
                            anchors.centerIn: parent
                            width: parent.width - ThemeTokens.dp(40)
                            height: implicitHeight
                            spacing: ThemeTokens.dp(24)

                        // Document Reading Pane
                        Rectangle {
                            width: parent.width - ThemeTokens.dp(244)
                            implicitHeight: ThemeTokens.dp(180)
                            color: ThemeTokens.panel
                            border.width: 1
                            border.color: ThemeTokens.border
                            radius: ThemeTokens.dp(6)

                            Column {
                                anchors.fill: parent
                                anchors.margins: ThemeTokens.dp(16)
                                spacing: ThemeTokens.dp(8)

                                Text {
                                    text: ChaSetI18n.tr("surfaces.tableOfContents.readingPaneTitle")
                                    color: ThemeTokens.text
                                    font.family: Typography.familySans
                                    font.pixelSize: Typography.sizeBody
                                    font.weight: Typography.weightSemibold
                                }

                                Text {
                                    text: ChaSetI18n.tr("surfaces.tableOfContents.activeOutlineTarget", "Active outline target: {{target}}", { "target": root.activeId })
                                    color: ThemeTokens.accent
                                    font.family: Typography.familyMono
                                    font.pixelSize: Typography.sizeSmall
                                }

                                Text {
                                    width: parent.width
                                    text: "Notice how the table of contents tree reflects the nested heading structure, and smoothly aligns with the top banner height offset."
                                    color: ThemeTokens.subduedText
                                    font.family: Typography.familySans
                                    font.pixelSize: Typography.sizeSmall
                                    wrapMode: Text.WordWrap
                                }
                            }
                        }

                        // TableOfContents Component
                        Rectangle {
                            width: ThemeTokens.dp(180)
                            implicitHeight: tocComp.implicitHeight + ThemeTokens.dp(16)
                            color: ThemeTokens.panel
                            border.width: 1
                            border.color: ThemeTokens.border
                            radius: ThemeTokens.dp(6)

                            ChaSetTableOfContents {
                                id: tocComp
                                anchors.top: parent.top
                                anchors.left: parent.left
                                anchors.right: parent.right
                                anchors.margins: ThemeTokens.dp(8)
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
