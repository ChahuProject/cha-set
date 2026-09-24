// TableOfContentsDocPage.qml — Living Documentation for ChaSetTableOfContents
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Table of Contents"
    description: "Hierarchical outline navigation tree with guide lines, active indicator, and banner offset support."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "anatomy", title: "Anatomy" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property bool showBanner: true
    property int bannerHeight: 40
    property string variant: "default"
    property string size: "default"
    property bool showTrack: true
    property string activeId: "architecture"

    readonly property var demoItems: [
        {
            id: "introduction",
            title: "Introduction",
            level: 1,
            children: [
                { id: "motivation", title: "Motivation & Goals", level: 2 },
                { id: "design-principles", title: "Design Principles", level: 2 }
            ]
        },
        {
            id: "architecture",
            title: "System Architecture",
            level: 1,
            children: [
                {
                    id: "data-flow",
                    title: "Core Data Flow",
                    level: 2,
                    children: [
                        { id: "signals", title: "Reactive Signals", level: 3 },
                        { id: "batching", title: "Update Batching", level: 3 }
                    ]
                },
                { id: "boundary", title: "Platform Boundaries", level: 2 }
            ]
        },
        {
            id: "implementation",
            title: "Implementation Notes",
            level: 1,
            children: [
                { id: "banner-offset", title: "Banner Offset Handling", level: 2 },
                { id: "tree-rendering", title: "Tree & Track Rendering", level: 2 }
            ]
        },
        {
            id: "changelog",
            title: "Release Changelog",
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
        title: "Table of Contents Sandbox"
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
            {
                type: "switch",
                label: "Top Banner",
                value: root.showBanner,
                onChanged: function(val) { root.showBanner = val; }
            },
            {
                type: "segmented",
                label: "Variant",
                value: root.variant,
                options: [
                    { label: "Default", value: "default" },
                    { label: "Track", value: "track" },
                    { label: "Flat", value: "flat" }
                ],
                onChanged: function(val) { root.variant = val; }
            },
            {
                type: "segmented",
                label: "Size",
                value: root.size,
                options: [
                    { label: "Default", value: "default" },
                    { label: "Small", value: "sm" }
                ],
                onChanged: function(val) { root.size = val; }
            },
            {
                type: "switch",
                label: "Show Track",
                value: root.showTrack,
                onChanged: function(val) { root.showTrack = val; }
            },
            {
                type: "button",
                label: "Reset",
                icon: "rotate-ccw",
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
                                text: "Global System Announcement: Scheduled maintenance at 02:00 UTC"
                                color: ThemeTokens.accent
                                font.family: Typography.familySans
                                font.pixelSize: Typography.sizeCaption
                                font.weight: Typography.weightMedium
                            }
                        }
                    }

                    // Content Area
                    Row {
                        width: parent.width
                        padding: ThemeTokens.dp(20)
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
                                    text: "Document Reading Pane"
                                    color: ThemeTokens.text
                                    font.family: Typography.familySans
                                    font.pixelSize: Typography.sizeBody
                                    font.weight: Typography.weightSemibold
                                }

                                Text {
                                    text: "Active outline target: " + root.activeId
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

    // 2. Anatomy
    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet\n\nChaSetTableOfContents {\n    items: demoItems\n    activeId: currentSectionId\n    onSelectItem: (item) => scrollTo(item)\n}`
        reactCode: `import { TableOfContents, type TocItem } from '@chahu/cha-set';\n\n<TableOfContents\n  items={items}\n  activeId={activeId}\n  onSelect={(item) => scrollTo(item)}\n/>`
    }

    // 3. Footer Sections (Animations, Keyboard Navigation, Props Reference)
    DocFooterSections {
        width: parent.width
        componentId: "table-of-contents"
        propsModel: [
            {
                name: "items",
                type: "var (array)",
                defaultValue: "[]",
                description: "Hierarchical array of outline items with level and nested children."
            },
            {
                name: "activeId",
                type: "string",
                defaultValue: '""',
                description: "Currently active section ID."
            },
            {
                name: "topOffset",
                type: "real",
                defaultValue: "0",
                description: "Top offset for sticky positioning, accommodating global announcement banners."
            },
            {
                name: "targetOffset",
                type: "real",
                defaultValue: "0",
                description: "Safety scroll offset ensuring headings are not occluded by top banners."
            },
            {
                name: "variant",
                type: "string",
                defaultValue: '"default"',
                description: 'Visual styling variant ("default", "track", "flat").'
            },
            {
                name: "size",
                type: "string",
                defaultValue: '"default"',
                description: 'Size density and font scaling ("default", "sm").'
            },
            {
                name: "showTrack",
                type: "bool",
                defaultValue: "true",
                description: "Whether to render the vertical guide track and active indicator marker."
            },
            {
                name: "showTitle",
                type: "bool",
                defaultValue: "true",
                description: "Whether to display the header title label."
            },
            {
                name: "title",
                type: "string",
                defaultValue: '"ON THIS PAGE"',
                description: "Header title text displayed above outline items."
            }
        ]
    }
}
