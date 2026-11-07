// qt/src/FilterPopupDocPage.qml — Living Documentation for ChaSetFilterPopup
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
import ChaSet

DocLayout {
    id: root
    category: "Overlays & Feedback"
    pageTitle: "Filter Popup"
    description: ChaSetI18n.tr("components.filterPopup.description", "Multi-dimensional facet filtering popup with search, exclusions, ratings and shortcuts.")

    property string demoTab: "format"
    property string demoLogicMode: "and"

    property var formatModel: [
        { key: "jpg", label: ".jpg", count: 142, isChecked: true, isExcluded: false },
        { key: "png", label: ".png", count: 86, isChecked: false, isExcluded: false },
        { key: "svg", label: ".svg", count: 24, isChecked: false, isExcluded: false },
        { key: "exe", label: ".exe", count: 3, isChecked: false, isExcluded: true },
        { key: "json", label: ".json", count: 19, isChecked: false, isExcluded: false },
        { key: "psd", label: ".psd", count: 8, isChecked: false, isExcluded: false }
    ]

    property var ratingModel: [
        { key: 5, stars: 5, count: 28, isChecked: false, isExcluded: false },
        { key: 4, stars: 4, count: 45, isChecked: true, isExcluded: false },
        { key: 3, stars: 3, count: 19, isChecked: false, isExcluded: false },
        { key: 2, stars: 2, count: 6, isChecked: false, isExcluded: false },
        { key: 1, stars: 1, count: 2, isChecked: false, isExcluded: true },
        { key: 0, stars: 0, count: 120, isChecked: false, isExcluded: false }
    ]

    property var tagModel: [
        { key: "landscape", label: "风景", color: "#3b82f6", count: 54, isChecked: true, isExcluded: false },
        { key: "portrait", label: "人像", color: "#ec4899", count: 32, isChecked: false, isExcluded: false },
        { key: "architecture", label: "建筑", color: "#10b981", count: 18, isChecked: false, isExcluded: false },
        { key: "draft", label: "草稿", color: "#f59e0b", count: 9, isChecked: false, isExcluded: true },
        { key: "archive", label: "归档", color: "#6b7280", count: 75, isChecked: false, isExcluded: false }
    ]

    readonly property var currentItems: {
        if (demoTab === "format") return formatModel
        if (demoTab === "rating") return ratingModel
        return tagModel
    }

    readonly property string currentTitle: {
        if (demoTab === "format") return ChaSetI18n.tr("overlays.filterPopup.formatFilter", "Format Filter")
        if (demoTab === "rating") return ChaSetI18n.tr("overlays.filterPopup.ratingFilter", "Rating Filter")
        return ChaSetI18n.tr("overlays.filterPopup.tagFilter", "Tag Filter")
    }

    readonly property string currentIcon: {
        if (demoTab === "format") return "folder"
        if (demoTab === "rating") return "star"
        return "tag"
    }

    readonly property bool hasActive: {
        var list = currentItems
        if (!list) return false
        for (var i = 0; i < list.length; ++i) {
            if (list[i].isChecked || list[i].isExcluded) return true
        }
        return false
    }

    function toggleInclude(key) {
        var list = currentItems.slice()
        for (var i = 0; i < list.length; ++i) {
            if (list[i].key === key) {
                list[i] = Object.assign({}, list[i], {
                    isChecked: !list[i].isChecked,
                    isExcluded: false
                })
            }
        }
        if (demoTab === "format") formatModel = list
        else if (demoTab === "rating") ratingModel = list
        else tagModel = list
    }

    function toggleExclude(key) {
        var list = currentItems.slice()
        for (var i = 0; i < list.length; ++i) {
            if (list[i].key === key) {
                list[i] = Object.assign({}, list[i], {
                    isExcluded: !list[i].isExcluded,
                    isChecked: false
                })
            }
        }
        if (demoTab === "format") formatModel = list
        else if (demoTab === "rating") ratingModel = list
        else tagModel = list
    }

    function clearActive() {
        var list = currentItems.slice()
        for (var i = 0; i < list.length; ++i) {
            list[i] = Object.assign({}, list[i], {
                isChecked: false,
                isExcluded: false
            })
        }
        if (demoTab === "format") formatModel = list
        else if (demoTab === "rating") ratingModel = list
        else tagModel = list
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.filterPopup.sandboxTitle", "Filter Popup Sandbox")
        stageHeight: 380
        reactCode: `<FilterPopup
  open={${filterPopup.opened}}
  onOpenChange={setOpen}
  title="${root.currentTitle}"
  icon="${root.currentIcon}"
  items={items}
  hasActive={${root.hasActive}}
  showLogicToggle={${root.demoTab === "tag"}}
  logicMode="${root.demoLogicMode}"
  onLogicModeChange={setTagLogicMode}
  onClear={handleClear}
  onItemIncludeToggle={handleIncludeToggle}
  onItemExcludeToggle={handleExcludeToggle}
  trigger={
    <Button variant="outline" size="sm" className="gap-2">
      <span>${root.currentTitle}</span>
      {hasActive && <Badge size="xs" variant="secondary">Active</Badge>}
    </Button>
  }
/>`
        qtCode: `ChaSetFilterPopup {
    id: filterPopup
    title: "${root.currentTitle}"
    iconName: "${root.currentIcon}"
    items: currentItemsModel
    hasActive: ${root.hasActive}
    showLogicToggle: ${root.demoTab === "tag"}
    logicMode: "${root.demoLogicMode}"
    onItemIncludeToggled: (key) => handleIncludeToggle(key)
    onItemExcludeToggled: (key) => handleExcludeToggle(key)
    onClearRequested: () => handleClear()
}`

        controlsData: [
            Row {
                spacing: ThemeTokens.dp(16)

                Row {
                    spacing: ThemeTokens.dp(8)
                    DocText {
                        text: ChaSetI18n.tr("overlays.filterPopup.dimension", "Dimension:")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                        anchors.verticalCenter: parent.verticalCenter
                    }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        size: "sm"
                        value: root.demoTab
                        options: [
                            { label: ChaSetI18n.tr("overlays.filterPopup.format", "Format"), value: "format" },
                            { label: ChaSetI18n.tr("overlays.filterPopup.rating", "Rating"), value: "rating" },
                            { label: ChaSetI18n.tr("overlays.filterPopup.tag", "Tag"), value: "tag" }
                        ]
                        onValueSelected: function(val) { root.demoTab = String(val); }
                    }
                }

                Row {
                    spacing: ThemeTokens.dp(8)
                    ChaSetButton {
                        size: "sm"
                        variant: "outline"
                        text: ChaSetI18n.tr("overlays.filterPopup.clearDimension", "Clear Dimension")
                        enabled: root.hasActive
                        onClicked: root.clearActive()
                    }
                    ChaSetBadge {
                        visible: root.hasActive
                        text: ChaSetI18n.tr("overlays.filterPopup.filtered", "Filtered")
                        variant: "secondary"
                        anchors.verticalCenter: parent.verticalCenter
                    }
                }
            }
        ]

        Rectangle {
            id: previewStage
            anchors.fill: parent
            anchors.margins: ThemeTokens.dp(16)
            radius: ThemeTokens.dp(8)
            color: ThemeTokens.panelRaised
            border.width: 1
            border.color: ThemeTokens.border
            clip: true

            DocText {
                anchors.top: parent.top
                anchors.topMargin: ThemeTokens.dp(16)
                anchors.horizontalCenter: parent.horizontalCenter
                text: ChaSetI18n.tr("overlays.filterPopup.hint", "Click the button below to open the filter popup, or press printable characters to test quick search.")
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeMicro
            }

            ChaSetButton {
                id: triggerBtn
                anchors.centerIn: parent
                variant: "outline"
                size: "sm"
                text: root.currentTitle
                onClicked: {
                    if (filterPopup.opened) {
                        filterPopup.close()
                    } else {
                        filterPopup.open()
                    }
                }
            }

            ChaSetFilterPopup {
                id: filterPopup
                parent: previewStage
                x: Math.round(triggerBtn.x + (triggerBtn.width - width) / 2)
                y: Math.round(triggerBtn.y + triggerBtn.height + ThemeTokens.dp(6))
                title: root.currentTitle
                iconName: root.currentIcon
                items: root.currentItems
                validateFileName: root.demoTab === "format"
                hasActive: root.hasActive
                showLogicToggle: root.demoTab === "tag"
                logicMode: root.demoLogicMode
                onItemIncludeToggled: function(key) { root.toggleInclude(key); }
                onItemExcludeToggled: function(key) { root.toggleExclude(key); }
                onClearRequested: function() { root.clearActive(); }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        reactCode: `import { FilterPopup } from '@chahu/cha-set';

<FilterPopup
  title="Format Filter"
  icon="folder"
  items={items}
  onItemIncludeToggle={(key) => handleInclude(key)}
  onItemExcludeToggle={(key) => handleExclude(key)}
  trigger={<Button>Filter</Button>}
/>`
        qtCode: `import ChaSet

ChaSetFilterPopup {
    title: "格式筛选"
    iconName: "folder"
    items: itemsModel
    onItemIncludeToggled: (key) => handleInclude(key)
    onItemExcludeToggled: (key) => handleExclude(key)
}`
    }

    Column {
        property string sectionId: "animations"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: ChaSetI18n.tr("desktopComposite.filterPopup.animationsTitle", "Animations")
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.filterPopup.animationsDesc", "Fade and zoom scale transitions apply on popup entrance and exit with quick duration (90ms) and standard easing tokens. Micro-interactions for hover, checkbox states, and search expansions are animated smoothly and honor reduced motion preferences.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "filter-popup"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "filter-popup"
        section: "props"
    }
}
