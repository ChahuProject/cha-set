// DocumentTabsDocPage.qml — Living Documentation for ChaSetDocumentTabs & ChaSetTabItem
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Document Tabs"
    description: ChaSetI18n.tr("components.documentTabs.description", "Desktop workspace document tab strip container with smooth horizontal scroll, adaptive width, close actions, and shell chrome integration.")
    tocItems: [
        { id: "overview", title: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview") },
        { id: "width-modes", title: ChaSetI18n.tr("desktopComposite.documentTabs.widthModeTitle", "Width Modes (Adaptive vs Fixed)") },
        { id: "overflow-scroll", title: ChaSetI18n.tr("desktopComposite.documentTabs.overflowTitle", "Overflow & Smooth Kinematic Scrolling") },
        { id: "shell-chrome", title: ChaSetI18n.tr("desktopComposite.documentTabs.shellChromeTitle", "Frameless Title Bar Integration") },
        { id: "tab-item", title: ChaSetI18n.tr("desktopComposite.documentTabs.tabItemTitle", "ChaSetTabItem Atomic Micro-Interactions") },
        { id: "anatomy", title: ChaSetI18n.tr("showcase.anatomy", "Anatomy") },
        { id: "keyboard", title: ChaSetI18n.tr("showcase.keyboardNavigation", "Keyboard Navigation") },
        { id: "props", title: ChaSetI18n.tr("showcase.propsReference", "Props Reference") }
    ]

    // 1. Sandbox State
    property var tabsList: [
        { id: "readme", title: "README.md", canClose: false },
        { id: "main", title: "Main.qml", canClose: true },
        { id: "tabs", title: "DocumentTabs.tsx", canClose: true },
        { id: "tokens", title: "ThemeTokens.qml", canClose: true }
    ]
    property string activeTabId: "main"
    property int nextTabNum: 1

    function addTab() {
        var id = "new_" + root.nextTabNum;
        var title = ChaSetI18n.tr("desktopComposite.documentTabs.tabTitle", "Doc " + root.nextTabNum, { index: root.nextTabNum });
        var updated = root.tabsList.slice();
        updated.push({ id: id, title: title, canClose: true });
        root.tabsList = updated;
        root.activeTabId = id;
        root.nextTabNum += 1;
    }

    function removeTab(id) {
        var updated = [];
        for (var i = 0; i < root.tabsList.length; i++) {
            if (root.tabsList[i].id !== id) {
                updated.push(root.tabsList[i]);
            }
        }
        if (root.activeTabId === id && updated.length > 0) {
            root.activeTabId = updated[updated.length - 1].id;
        }
        root.tabsList = updated;
        root.lastItemEvent = ChaSetI18n.tr("desktopComposite.documentTabs.actionClosed", "Closed Tab: " + id, { id: id });
    }

    // 2. Width Mode State
    property bool isFixed: false
    property string modeActiveId: "t2"

    // 3. Overflow State
    property var overflowList: []
    property int overflowActiveIdx: 0

    function initOverflowList() {
        var list = [];
        for (var i = 1; i <= 20; i++) {
            list.push("File_" + i + ".cpp");
        }
        root.overflowList = list;
    }

    Component.onCompleted: {
        root.initOverflowList();
    }

    // 4. Shell Chrome State
    property string shellActiveId: "app"

    // 5. TabItem Micro-Interactions State
    property string itemActiveId: "normal"
    property string lastItemEvent: ChaSetI18n.tr("desktopComposite.documentTabs.actionIdle", "Idle")

    // -------------------------------------------------------------------------
    // 1. Interactive Overview / Sandbox
    // -------------------------------------------------------------------------
    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("showcase.interactiveOverview", "Interactive Overview")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.documentTabs.overviewDesc", "Desktop multi-document and workspace tab bar container with smooth close animations, pinned tabs, dynamic additions, and trailing action slots.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.documentTabs.sandboxTitle", "Document Tabs Sandbox")
        reactCode: `<DocumentTabs
  trailing={
    <Button size="sm" variant="ghost" onClick={handleAddTab}>
      <PlusIcon className="size-3.5" />
    </Button>
  }
>
  {tabs.map((tab) => (
    <TabItem
      key={tab.id}
      text={tab.title}
      selected={activeTab === tab.id}
      canClose={tab.canClose}
      onClick={() => setActiveTab(tab.id)}
      onClose={() => handleCloseTab(tab.id)}
    />
  ))}
</DocumentTabs>`
        qtCode: `ChaSetDocumentTabs {
    width: parent.width
    trailingItems: [
        ChaSetButton {
            size: "sm"
            variant: "ghost"
            icon: "plus"
            onClicked: root.addTab()
        }
    ]

    Repeater {
        model: root.tabsModel
        ChaSetTabItem {
            text: modelData.title
            selected: root.activeTabId === modelData.id
            canClose: modelData.canClose
            onClicked: root.activeTabId = modelData.id
            onCloseClicked: root.removeTab(modelData.id)
        }
    }
}`

        Item {
            anchors.fill: parent

            ChaSetCard {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(560))
                implicitHeight: sandboxCol.implicitHeight + ThemeTokens.dp(16)

                Column {
                    id: sandboxCol
                    width: parent.width
                    spacing: ThemeTokens.dp(16)

                    // Tab Bar Strip
                    Rectangle {
                        width: parent.width
                        height: ThemeTokens.dp(36)
                        color: ThemeTokens.panelRaised
                        radius: ThemeTokens.dp(6)
                        clip: true

                        ChaSetDocumentTabs {
                            anchors.fill: parent
                            trailingItems: [
                                ChaSetButton {
                                    size: "sm"
                                    variant: "ghost"
                                    icon: "plus"
                                    width: ThemeTokens.dp(28)
                                    height: ThemeTokens.dp(28)
                                    onClicked: root.addTab()
                                }
                            ]

                            Repeater {
                                model: root.tabsList
                                ChaSetTabItem {
                                    required property var modelData
                                    text: modelData.title
                                    selected: root.activeTabId === modelData.id
                                    canClose: modelData.canClose
                                    onClicked: root.activeTabId = modelData.id
                                    onCloseClicked: root.removeTab(modelData.id)
                                }
                            }
                        }
                    }

                    // Content Pane Area
                    Rectangle {
                        width: parent.width
                        height: ThemeTokens.dp(120)
                        color: ThemeTokens.panel
                        border.color: ThemeTokens.border
                        border.width: 1
                        radius: ThemeTokens.dp(6)

                        Column {
                            anchors.centerIn: parent
                            spacing: ThemeTokens.dp(8)

                            Row {
                                anchors.horizontalCenter: parent.horizontalCenter
                                spacing: ThemeTokens.dp(8)

                                ChaSetBadge {
                                    variant: "outline"
                                    text: ChaSetI18n.tr("desktopComposite.documentTabs.totalTabs", "Total Tabs: " + root.tabsList.length, { count: root.tabsList.length })
                                }
                                ChaSetBadge {
                                    variant: "secondary"
                                    text: ChaSetI18n.tr("desktopComposite.documentTabs.activeTab", "Active: " + root.activeTabId, { title: root.activeTabId })
                                }
                            }

                            DocText {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: root.tabsList.length > 0
                                      ? "Active document pane: " + root.activeTabId
                                      : "All tabs closed. Click + to add a document tab."
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
                            }
                        }
                    }
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // 2. Width Modes (Adaptive vs Fixed)
    // -------------------------------------------------------------------------
    Column {
        property string sectionId: "width-modes"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.documentTabs.widthModeTitle", "Width Modes (Adaptive vs Fixed)")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.documentTabs.widthModeDesc", "Switch between VS Code-style content-adaptive width and Chrome-style fixed width.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.documentTabs.widthModeTitle", "Width Modes (Adaptive vs Fixed)")
        reactCode: `<SegmentedControl
  value={widthMode}
  onValueChange={(val) => setWidthMode(val)}
  items={[
    { value: 'content', label: 'Adaptive (Content)' },
    { value: 'fixed', label: 'Fixed Width' },
  ]}
/>

<DocumentTabs>
  <TabItem text="Index" tabWidthMode={widthMode} />
  <TabItem text="UserProfileDialog.tsx" tabWidthMode={widthMode} />
  <TabItem text="ExtremelyLongFilenameForWidthTesting.qml" tabWidthMode={widthMode} />
</DocumentTabs>`
        qtCode: `ChaSetSegmentedControl {
    currentIndex: root.isFixed ? 1 : 0
    model: ["Content", "Fixed"]
    onCurrentIndexChanged: root.isFixed = (currentIndex === 1)
}

ChaSetDocumentTabs {
    width: parent.width
    ChaSetTabItem {
        text: "Index"
        tabWidthMode: root.isFixed ? "fixed" : "content"
    }
    ChaSetTabItem {
        text: "UserProfileDialog.tsx"
        tabWidthMode: root.isFixed ? "fixed" : "content"
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(560))
                spacing: ThemeTokens.dp(16)

                Row {
                    width: parent.width
                    DocText {
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("common.mode", "Mode:")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }
                    Item { width: ThemeTokens.dp(12); height: 1 }
                    ChaSetSegmentedControl {
                        anchors.verticalCenter: parent.verticalCenter
                        value: root.isFixed ? "fixed" : "content"
                        options: [
                            { label: ChaSetI18n.tr("desktopComposite.documentTabs.modeContent", "Adaptive Width (Content)"), value: "content" },
                            { label: ChaSetI18n.tr("desktopComposite.documentTabs.modeFixed", "Fixed Width"), value: "fixed" }
                        ]
                        onValueSelected: function(v) { root.isFixed = (String(v) === "fixed"); }
                    }
                }

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(42)
                    color: ThemeTokens.panelRaised
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: ThemeTokens.dp(6)
                    clip: true

                    ChaSetDocumentTabs {
                        anchors.fill: parent

                        ChaSetTabItem {
                            text: "Index.tsx"
                            tabWidthMode: root.isFixed ? "fixed" : "content"
                            selected: root.modeActiveId === "t1"
                            onClicked: root.modeActiveId = "t1"
                        }
                        ChaSetTabItem {
                            text: "UserProfileDialog.tsx"
                            tabWidthMode: root.isFixed ? "fixed" : "content"
                            selected: root.modeActiveId === "t2"
                            onClicked: root.modeActiveId = "t2"
                        }
                        ChaSetTabItem {
                            text: "CrossStackTypographyContractGateTestAssertion.qml"
                            tabWidthMode: root.isFixed ? "fixed" : "content"
                            selected: root.modeActiveId === "t3"
                            onClicked: root.modeActiveId = "t3"
                        }
                    }
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // 3. Overflow & Smooth Kinematic Scrolling
    // -------------------------------------------------------------------------
    Column {
        property string sectionId: "overflow-scroll"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.documentTabs.overflowTitle", "Overflow & Smooth Kinematic Scrolling")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.documentTabs.overflowDesc", "Simulate 20+ tabs under heavy load to verify horizontal wheel scrolling, boundary damping, and responsive clipping.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.documentTabs.overflowTitle", "Overflow & Smooth Kinematic Scrolling")
        reactCode: `<DocumentTabs>
  {overflowTabs.map((name, i) => (
    <TabItem
      key={i}
      text={name}
      selected={overflowActive === i}
      onClick={() => setOverflowActive(i)}
    />
  ))}
</DocumentTabs>`
        qtCode: `ChaSetDocumentTabs {
    width: parent.width
    Repeater {
        model: 20
        ChaSetTabItem {
            text: "File_" + (index + 1) + ".cpp"
            selected: root.overflowIndex === index
            onClicked: root.overflowIndex = index
        }
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(560))
                spacing: ThemeTokens.dp(16)

                Row {
                    width: parent.width
                    spacing: ThemeTokens.dp(8)

                    ChaSetButton {
                        size: "sm"
                        variant: "outline"
                        text: ChaSetI18n.tr("desktopComposite.documentTabs.addBatch", "Batch Add 15 Tabs")
                        onClicked: {
                            var extra = [];
                            for (var i = 1; i <= 15; i++) {
                                extra.push("Extra_" + (root.overflowList.length + i) + ".ts");
                            }
                            root.overflowList = root.overflowList.concat(extra);
                        }
                    }

                    ChaSetButton {
                        size: "sm"
                        variant: "ghost"
                        text: ChaSetI18n.tr("desktopComposite.documentTabs.resetTabs", "Reset Tabs")
                        onClicked: root.initOverflowList()
                    }

                    Item { width: ThemeTokens.dp(1); height: 1 }

                    ChaSetBadge {
                        anchors.verticalCenter: parent.verticalCenter
                        variant: "outline"
                        text: ChaSetI18n.tr("desktopComposite.documentTabs.totalTabs", "Total Tabs: " + root.overflowList.length, { count: root.overflowList.length })
                    }
                }

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(42)
                    color: ThemeTokens.panelRaised
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: ThemeTokens.dp(6)
                    clip: true

                    ChaSetDocumentTabs {
                        anchors.fill: parent

                        Repeater {
                            model: root.overflowList
                            ChaSetTabItem {
                                required property var modelData
                                required property int index
                                text: String(modelData)
                                selected: root.overflowActiveIdx === index
                                onClicked: root.overflowActiveIdx = index
                            }
                        }
                    }
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // 4. Frameless Title Bar Integration
    // -------------------------------------------------------------------------
    Column {
        property string sectionId: "shell-chrome"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.documentTabs.shellChromeTitle", "Frameless Title Bar Integration")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.documentTabs.shellChromeDesc", "Enable useShellChrome and transparent fill to embed the document tabs directly into the frameless native title bar.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.documentTabs.shellChromeTitle", "Frameless Title Bar Integration")
        reactCode: `<div className="flex items-center h-10 bg-muted/60 border-b border-border px-2">
  <ChaSetLogoIcon className="size-4 mr-2" />
  <DocumentTabs useShellChrome className="flex-1">
    <TabItem text="Editor.tsx" useShellChrome selected />
    <TabItem text="Config.json" useShellChrome />
  </DocumentTabs>
  <div className="flex items-center gap-1">
    {/* Window Controls */}
  </div>
</div>`
        qtCode: `ChaSetDocumentTabs {
    useShellChrome: true
    shellTabFill: "transparent"
    ChaSetTabItem {
        useShellChrome: true
        text: "Editor.qml"
        selected: true
    }
}`

        Item {
            anchors.fill: parent

            Rectangle {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(560))
                height: ThemeTokens.dp(160)
                color: ThemeTokens.panel
                border.color: ThemeTokens.border
                border.width: 1
                radius: ThemeTokens.dp(8)
                clip: true

                Column {
                    anchors.fill: parent

                    // Mock Frameless Title Bar Header
                    Rectangle {
                        width: parent.width
                        height: ThemeTokens.dp(38)
                        color: ThemeTokens.panelRaised
                        border.color: ThemeTokens.border
                        border.width: 1

                        Row {
                            anchors.fill: parent
                            anchors.leftMargin: ThemeTokens.dp(10)
                            anchors.rightMargin: ThemeTokens.dp(10)
                            spacing: ThemeTokens.dp(8)

                            ChaSetIcon {
                                anchors.verticalCenter: parent.verticalCenter
                                name: "chaset"
                                size: 16
                                color: ThemeTokens.accent
                            }

                            ChaSetDocumentTabs {
                                width: parent.width - ThemeTokens.dp(100)
                                height: parent.height
                                useShellChrome: true
                                shellTabFill: "transparent"

                                ChaSetTabItem {
                                    text: "Workspace.qml"
                                    useShellChrome: true
                                    selected: root.shellActiveId === "app"
                                    onClicked: root.shellActiveId = "app"
                                }
                                ChaSetTabItem {
                                    text: "Styles.css"
                                    useShellChrome: true
                                    selected: root.shellActiveId === "css"
                                    onClicked: root.shellActiveId = "css"
                                }
                                ChaSetTabItem {
                                    text: "Schema.json"
                                    useShellChrome: true
                                    selected: root.shellActiveId === "json"
                                    onClicked: root.shellActiveId = "json"
                                }
                            }

                            // Mock Caption Buttons
                            Row {
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: ThemeTokens.dp(6)

                                Rectangle {
                                    width: ThemeTokens.dp(10)
                                    height: ThemeTokens.dp(10)
                                    radius: ThemeTokens.dp(5)
                                    color: ThemeTokens.border
                                }
                                Rectangle {
                                    width: ThemeTokens.dp(10)
                                    height: ThemeTokens.dp(10)
                                    radius: ThemeTokens.dp(5)
                                    color: ThemeTokens.border
                                }
                                Rectangle {
                                    width: ThemeTokens.dp(10)
                                    height: ThemeTokens.dp(10)
                                    radius: ThemeTokens.dp(5)
                                    color: ThemeTokens.danger !== undefined ? ThemeTokens.danger : "#ef4444"
                                }
                            }
                        }
                    }

                    // Client Area
                    Item {
                        width: parent.width
                        height: parent.height - ThemeTokens.dp(38)

                        DocText {
                            anchors.centerIn: parent
                            text: ChaSetI18n.tr("desktopComposite.documentTabs.windowMockTitle", "Chahu Workspace Studio")
                            color: ThemeTokens.subduedText
                            font.pixelSize: Typography.sizeBody
                        }
                    }
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // 5. ChaSetTabItem Atomic Micro-Interactions
    // -------------------------------------------------------------------------
    Column {
        property string sectionId: "tab-item"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.documentTabs.tabItemTitle", "ChaSetTabItem Atomic Micro-Interactions")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.documentTabs.tabItemDesc", "Inspect TabItem standalone micro-interactions: close button hover highlight, long text tooltip, middle-click close, and right-click context menu.")
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.documentTabs.tabItemTitle", "ChaSetTabItem Atomic Micro-Interactions")
        reactCode: `<TabItem
  text="RegularDoc.tsx"
  selected={activeTab === 'normal'}
  onClick={() => setActiveTab('normal')}
  onClose={() => logEvent('Closed tab')}
  onMiddleClick={() => logEvent('Middle-clicked')}
  onContextMenu={(e) => logEvent('Context menu')}
/>`
        qtCode: `ChaSetTabItem {
    text: "RegularDoc.qml"
    selected: root.selected
    onCloseClicked: console.log("closeClicked")
    onMiddleClicked: console.log("middleClicked")
    onContextMenuRequested: console.log("contextMenuRequested")
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(560))
                spacing: ThemeTokens.dp(16)

                Rectangle {
                    width: parent.width
                    height: ThemeTokens.dp(64)
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    border.width: 1
                    radius: ThemeTokens.dp(8)

                    Row {
                        anchors.centerIn: parent
                        spacing: ThemeTokens.dp(12)

                        ChaSetTabItem {
                            text: ChaSetI18n.tr("desktopComposite.documentTabs.singleTabNormal", "RegularDoc.tsx")
                            selected: root.itemActiveId === "normal"
                            onClicked: {
                                root.itemActiveId = "normal";
                                root.lastItemEvent = ChaSetI18n.tr("desktopComposite.documentTabs.actionSelected", "Selected Tab: RegularDoc.tsx", { id: "RegularDoc.tsx" });
                            }
                            onCloseClicked: {
                                root.lastItemEvent = ChaSetI18n.tr("desktopComposite.documentTabs.actionClosed", "Closed Tab: RegularDoc.tsx", { id: "RegularDoc.tsx" });
                            }
                            onMiddleClicked: {
                                root.lastItemEvent = ChaSetI18n.tr("desktopComposite.documentTabs.actionMiddleClicked", "Middle-click Closed: RegularDoc.tsx", { id: "RegularDoc.tsx" });
                            }
                            onContextMenuRequested: function(mouse) {
                                root.lastItemEvent = ChaSetI18n.tr("desktopComposite.documentTabs.actionContextMenu", "Context Menu: RegularDoc.tsx", { id: "RegularDoc.tsx" });
                            }
                        }

                        ChaSetTabItem {
                            text: ChaSetI18n.tr("desktopComposite.documentTabs.singleTabPinned", "CoreConfig.json (Pinned)")
                            canClose: false
                            selected: root.itemActiveId === "pinned"
                            onClicked: {
                                root.itemActiveId = "pinned";
                                root.lastItemEvent = ChaSetI18n.tr("desktopComposite.documentTabs.actionSelected", "Selected Tab: CoreConfig.json", { id: "CoreConfig.json" });
                            }
                        }

                        ChaSetTabItem {
                            text: ChaSetI18n.tr("desktopComposite.documentTabs.singleTabLong", "ExtremelyLongFileNameForTooltipTruncationExample.tsx")
                            selected: root.itemActiveId === "long"
                            onClicked: {
                                root.itemActiveId = "long";
                                root.lastItemEvent = ChaSetI18n.tr("desktopComposite.documentTabs.actionSelected", "Selected Tab: LongFilename", { id: "LongFilename" });
                            }
                            onCloseClicked: {
                                root.lastItemEvent = ChaSetI18n.tr("desktopComposite.documentTabs.actionClosed", "Closed Tab: LongFilename", { id: "LongFilename" });
                            }
                        }
                    }
                }

                Row {
                    spacing: ThemeTokens.dp(8)
                    DocText {
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("desktopComposite.documentTabs.lastAction", "Last Event: " + root.lastItemEvent, { event: root.lastItemEvent })
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }
                }
            }
        }
    }

    // -------------------------------------------------------------------------
    // Anatomy
    // -------------------------------------------------------------------------
    DocAnatomy {
        id: anatomy
        width: parent.width
        reactCode: `import { DocumentTabs, TabItem } from '@chahu/cha-set';

<DocumentTabs>
  <TabItem text="Document.tsx" selected />
  <TabItem text="README.md" canClose={false} />
</DocumentTabs>`
        qtCode: `import ChaSet

ChaSetDocumentTabs {
    width: parent.width
    ChaSetTabItem {
        text: "Document.qml"
        selected: true
    }
    ChaSetTabItem {
        text: "README.md"
        canClose: false
    }
}`
    }

    // -------------------------------------------------------------------------
    // Keyboard Navigation & Props (Markdown-driven)
    // -------------------------------------------------------------------------
    DocMarkdown {
        width: parent.width
        docId: "document-tabs"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "document-tabs"
        section: "props"
    }
}
