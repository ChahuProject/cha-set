// TableOfContentsDocPage.qml — Living Documentation for ChaSetTableOfContents
import QtQuick
import QtQuick.Controls
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

    function flattenDemoItems(items, parentDepth) {
        if (!items || !items.length) return [];
        var res = [];
        var d = parentDepth !== undefined ? parentDepth : 1;
        for (var i = 0; i < items.length; i++) {
            var it = items[i];
            if (!it) continue;
            var depth = (it.level !== undefined && it.level > 0) ? it.level : d;
            res.push({
                id: String(it.id),
                title: String(it.title),
                level: depth
            });
            if (it.children && it.children.length > 0) {
                var sub = flattenDemoItems(it.children, depth + 1);
                for (var j = 0; j < sub.length; j++) {
                    res.push(sub[j]);
                }
            }
        }
        return res;
    }

    readonly property var demoFlatItems: root.flattenDemoItems(root.demoItems, 1)

    function getSectionDesc(id) {
        var camel = id.replace(/-([a-z])/g, function(_, g) { return g.toUpperCase(); });
        return ChaSetI18n.tr("surfaces.tableOfContents.sections." + camel);
    }

    function scrollToSection(id) {
        for (var i = 0; i < sectionsRepeater.count; i++) {
            var delegateItem = sectionsRepeater.itemAt(i);
            if (delegateItem && delegateItem.sectionId === id) {
                readingScroll.isScrollingTo = true;
                var offset = (root.showBanner ? root.bannerHeight : 0) + 16;
                var targetY = Math.max(0, delegateItem.y - ThemeTokens.dp(offset));
                readingScroll.scrollToY(targetY, true);
                scrollResetTimer.restart();
                break;
            }
        }
    }

    Timer {
        id: scrollResetTimer
        interval: 350
        repeat: false
        onTriggered: {
            readingScroll.isScrollingTo = false;
        }
    }

    function resetDemo() {
        root.showBanner = true;
        root.bannerHeight = 40;
        root.variant = "default";
        root.size = "default";
        root.showTrack = true;
        root.activeId = "introduction";
        readingScroll.scrollToTop(true);
    }

    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("desktopComposite.tableOfContents.sandboxTitle", "Table of Contents Sandbox")
        // React's stage is `min-h-[18.75rem] p-8 …` and grows with its content;
        // this stage is a fixed height, so size it so the demo card (banner +
        // p-6 content row) fits without being clipped.
        stageHeight: 580
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
                width: Math.min(parent.width - ThemeTokens.dp(48), ThemeTokens.dp(640))   // max-w-2xl = 40rem
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

                        // Content — React `p-6 flex flex-row gap-6 items-start`.
                        Item {
                            id: contentArea
                            width: parent.width
                            implicitHeight: contentRow.height + ThemeTokens.dp(48)   // p-6 → 24 + 24

                            Row {
                                id: contentRow
                                anchors.horizontalCenter: parent.horizontalCenter
                                anchors.top: parent.top
                                anchors.topMargin: ThemeTokens.dp(24)
                                width: parent.width - ThemeTokens.dp(48)
                                height: Math.max(readingPaneCard.height, tocCard.implicitHeight)
                                spacing: ThemeTokens.dp(24)                                  // gap-6

                                // flex-1 scrollable reading column
                                Rectangle {
                                    id: readingPaneCard
                                    width: contentRow.width - ThemeTokens.dp(24) - ThemeTokens.dp(224)
                                    height: ThemeTokens.dp(360)
                                    color: Qt.rgba(ThemeTokens.background.r, ThemeTokens.background.g, ThemeTokens.background.b, 0.5)
                                    border.width: 1
                                    border.color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.8)
                                    radius: ThemeTokens.dp(6)
                                    clip: true

                                    Column {
                                        anchors.fill: parent

                                        // Reading pane top bar
                                        Rectangle {
                                            width: parent.width
                                            height: ThemeTokens.dp(36)
                                            color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.15)

                                            Rectangle {
                                                anchors.bottom: parent.bottom
                                                width: parent.width
                                                height: 1
                                                color: Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.6)
                                            }

                                            Text {
                                                anchors.left: parent.left
                                                anchors.leftMargin: ThemeTokens.dp(12)
                                                anchors.verticalCenter: parent.verticalCenter
                                                text: ChaSetI18n.tr("surfaces.tableOfContents.readingPaneTitle")
                                                color: ThemeTokens.text
                                                font.family: Typography.familySans
                                                font.pixelSize: Typography.sizeSmall
                                                font.weight: Typography.weightSemibold
                                            }

                                            ChaSetBadge {
                                                anchors.right: parent.right
                                                anchors.rightMargin: ThemeTokens.dp(12)
                                                anchors.verticalCenter: parent.verticalCenter
                                                variant: "outline"
                                                size: "sm"
                                                text: "#" + root.activeId
                                            }
                                        }

                                        // Scrollable reading viewport
                                        Item {
                                            width: parent.width
                                            height: parent.height - ThemeTokens.dp(36)

                                            ChaSetScrollArea {
                                                id: readingScroll
                                                anchors.fill: parent
                                                showVerticalScrollBar: true
                                                showHorizontalScrollBar: false
                                                smoothScroll: true

                                                property bool isScrollingTo: false

                                                onContentYChanged: {
                                                    if (isScrollingTo) return;
                                                    var offset = (root.showBanner ? root.bannerHeight : 0) + 24;
                                                    var curY = readingScroll.contentY;
                                                    var maxScroll = Math.max(0, readingScroll.contentHeight - readingScroll.availableHeight);

                                                    if (curY >= maxScroll - ThemeTokens.dp(16) && maxScroll > 0) {
                                                        var lastItem = root.demoFlatItems[root.demoFlatItems.length - 1];
                                                        if (lastItem && root.activeId !== lastItem.id) {
                                                            root.activeId = lastItem.id;
                                                        }
                                                        return;
                                                    }

                                                    var bestId = root.demoFlatItems[0] ? root.demoFlatItems[0].id : "";
                                                    for (var i = 0; i < sectionsRepeater.count; i++) {
                                                        var child = sectionsRepeater.itemAt(i);
                                                        if (child && child.sectionId) {
                                                            if (child.y <= curY + ThemeTokens.dp(offset)) {
                                                                bestId = child.sectionId;
                                                            }
                                                        }
                                                    }
                                                    if (bestId && root.activeId !== bestId) {
                                                        root.activeId = bestId;
                                                    }
                                                }

                                                Column {
                                                    id: sectionsCol
                                                    width: readingScroll.availableWidth - ThemeTokens.dp(24)
                                                    x: ThemeTokens.dp(12)
                                                    y: ThemeTokens.dp(12)
                                                    spacing: ThemeTokens.dp(10)
                                                    bottomPadding: ThemeTokens.dp(120)

                                                    Repeater {
                                                        id: sectionsRepeater
                                                        model: root.demoFlatItems

                                                        delegate: Rectangle {
                                                            id: sectionDelegate
                                                            required property var modelData
                                                            required property int index

                                                            readonly property string sectionId: modelData.id
                                                            readonly property int sectionLevel: modelData.level
                                                            readonly property bool isActive: root.activeId === sectionId

                                                            width: sectionsCol.width
                                                            implicitHeight: secInnerCol.implicitHeight + ThemeTokens.dp(20)
                                                            height: implicitHeight
                                                            radius: ThemeTokens.dp(6)
                                                            color: isActive ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.08) : Qt.rgba(ThemeTokens.panel.r, ThemeTokens.panel.g, ThemeTokens.panel.b, 0.4)
                                                            border.width: 1
                                                            border.color: isActive ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.3) : Qt.rgba(ThemeTokens.border.r, ThemeTokens.border.g, ThemeTokens.border.b, 0.4)

                                                            Column {
                                                                id: secInnerCol
                                                                anchors.horizontalCenter: parent.horizontalCenter
                                                                anchors.verticalCenter: parent.verticalCenter
                                                                width: parent.width - ThemeTokens.dp(20)
                                                                spacing: ThemeTokens.dp(6)

                                                                Item {
                                                                    width: parent.width
                                                                    height: Math.max(badgeComp.height, titleText.height)

                                                                    Row {
                                                                        id: titleRow
                                                                        anchors.left: parent.left
                                                                        anchors.leftMargin: (sectionLevel === 1) ? 0 : ((sectionLevel === 2) ? ThemeTokens.dp(12) : ThemeTokens.dp(24))
                                                                        anchors.right: hashText.left
                                                                        anchors.rightMargin: ThemeTokens.dp(8)
                                                                        anchors.verticalCenter: parent.verticalCenter
                                                                        spacing: ThemeTokens.dp(8)

                                                                        ChaSetBadge {
                                                                            id: badgeComp
                                                                            anchors.verticalCenter: parent.verticalCenter
                                                                            variant: (sectionLevel === 1) ? "default" : ((sectionLevel === 2) ? "secondary" : "outline")
                                                                            size: "sm"
                                                                            text: "H" + sectionLevel
                                                                        }

                                                                        Text {
                                                                            id: titleText
                                                                            anchors.verticalCenter: parent.verticalCenter
                                                                            text: modelData.title
                                                                            color: ThemeTokens.text
                                                                            font.family: Typography.familySans
                                                                            font.pixelSize: (sectionLevel === 1) ? Typography.sizeBody : Typography.sizeSmall
                                                                            font.weight: (sectionLevel === 1) ? Typography.weightSemibold : ((sectionLevel === 2) ? Typography.weightMedium : Typography.weightRegular)
                                                                            elide: Text.ElideRight
                                                                        }
                                                                    }

                                                                    Text {
                                                                        id: hashText
                                                                        anchors.right: parent.right
                                                                        anchors.verticalCenter: parent.verticalCenter
                                                                        text: "#" + sectionId
                                                                        color: Qt.rgba(ThemeTokens.subduedText.r, ThemeTokens.subduedText.g, ThemeTokens.subduedText.b, 0.6)
                                                                        font.family: Typography.familyMono
                                                                        font.pixelSize: Typography.sizeMicro
                                                                    }
                                                                }

                                                                Text {
                                                                    width: parent.width - ((sectionLevel === 1) ? 0 : ((sectionLevel === 2) ? ThemeTokens.dp(12) : ThemeTokens.dp(24)))
                                                                    x: (sectionLevel === 1) ? 0 : ((sectionLevel === 2) ? ThemeTokens.dp(12) : ThemeTokens.dp(24))
                                                                    text: root.getSectionDesc(sectionId)
                                                                    color: ThemeTokens.subduedText
                                                                    font.family: Typography.familySans
                                                                    font.pixelSize: Typography.sizeSmall
                                                                    wrapMode: Text.WordWrap
                                                                    lineHeight: 1.3
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }

                                // `w-56 shrink-0 p-3` ToC card — React `rounded-md
                                // border border-border/60 bg-background/80`.
                                Rectangle {
                                    id: tocCard
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
                                            root.scrollToSection(item.id);
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

    // 3. Footer Sections — prose is single-sourced from spec/content/table-of-contents/
    DocMarkdown {
        width: parent.width
        docId: "table-of-contents"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "table-of-contents"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "table-of-contents"
        section: "props"
    }
    }
