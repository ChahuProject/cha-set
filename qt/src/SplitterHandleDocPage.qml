// SplitterHandleDocPage.qml — Living Documentation for ChaSetSplitterHandle
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Splitter Handle"
    description: ChaSetI18n.tr("components.splitterHandle.description", "Edge resize handle with reference item coordinate stabilization, min/max clamping, and keyboard navigation.")

    property real sidebarWidth: 240
    property real bottomHeight: 120
    property string selectedNavId: "button"

    readonly property var navItems: {
        var list = [];
        if (ShowcaseData && ShowcaseData.navigation) {
            for (var i = 0; i < ShowcaseData.navigation.length; i++) {
                var cat = ShowcaseData.navigation[i];
                if (cat && cat.items) {
                    for (var j = 0; j < cat.items.length; j++) {
                        list.push(cat.items[j]);
                        if (list.length >= 16) return list;
                    }
                }
            }
        }
        return list;
    }

    readonly property var featureCards: (ShowcaseData && ShowcaseData.featureCards) ? ShowcaseData.featureCards.slice(0, 6) : []

    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("desktopComposite.splitterHandle.sandboxTitle", "Splitter Handle Sandbox")
        reactCode: `<div className="flex h-72 border border-border rounded-md overflow-hidden bg-card">
  {/* Resizable Sidebar with ScrollArea */}
  <div
    style={{ width: \`\${sidebarWidth * 0.0625}rem\` }}
    className="relative bg-muted/30 flex flex-col shrink-0 min-w-0"
  >
    <div className="p-3 border-b border-border/50 flex items-center justify-between text-xs font-medium shrink-0">
      <span className="truncate">Sidebar</span>
      <Badge variant="secondary">{sidebarWidth}</Badge>
    </div>
    <ScrollArea className="flex-1 min-h-0 w-full" showVerticalScrollBar showHorizontalScrollBar={false}>
      <div className="p-2 space-y-1">
        {navItems.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className="px-2.5 py-1.5 text-xs rounded hover:bg-accent/50 cursor-pointer truncate"
          >
            {item.title}
          </div>
        ))}
      </div>
    </ScrollArea>
    <SplitterHandle
      edge="right"
      targetSize={sidebarWidth}
      minSize={140}
      maxSize={400}
      defaultSize={200}
      onSizeChanging={setSidebarWidth}
      onSizeChanged={setSidebarWidth}
    />
  </div>

  {/* Main Viewport Area with ScrollArea */}
  <div className="flex-1 min-w-0 flex flex-col bg-background">
    <div className="p-3 border-b border-border/50 flex items-center justify-between text-xs shrink-0">
      <span className="font-semibold text-foreground">Main Viewport</span>
      <Badge variant="outline">Scrollable</Badge>
    </div>
    <ScrollArea className="flex-1 min-h-0 w-full" showVerticalScrollBar showHorizontalScrollBar={false}>
      <div className="p-4 space-y-3">
        {featureCards.map((card) => (
          <div key={card.id} className="p-3 border border-border/60 rounded-md bg-card">
            <div className="font-medium text-xs text-foreground">{card.title}</div>
            <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
</div>`
        qtCode: `Row {
    anchors.fill: parent

    // Resizable Sidebar with ChaSetScrollArea
    Rectangle {
        width: root.sidebarWidth
        height: parent.height
        color: ThemeTokens.panel
        clip: true

        ChaSetScrollArea {
            anchors.fill: parent
            anchors.topMargin: 36
            contentWidth: width
            contentHeight: sidebarCol.implicitHeight

            Column {
                id: sidebarCol
                width: parent.width
                // Navigation items list...
            }
        }

        ChaSetSplitterHandle {
            edge: "right"
            targetSize: root.sidebarWidth
            minSize: 140
            maxSize: 400
            defaultSize: 200
            onSizeChanging: (newSize) => root.sidebarWidth = newSize
            onSizeChanged: (finalSize) => root.sidebarWidth = finalSize
        }
    }

    // Main Viewport Area with ChaSetScrollArea
    Rectangle {
        width: parent.width - root.sidebarWidth
        height: parent.height
        color: ThemeTokens.background
        clip: true

        ChaSetScrollArea {
            anchors.fill: parent
            anchors.topMargin: 36
            contentWidth: width
            contentHeight: mainCol.implicitHeight

            Column {
                id: mainCol
                width: parent.width
                // Feature cards list...
            }
        }
    }
}`

        // Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Rectangle {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(48), ThemeTokens.dp(560))
                height: ThemeTokens.dp(260)
                color: ThemeTokens.background
                radius: ThemeTokens.dp(6)
                border.color: ThemeTokens.border
                border.width: 1
                clip: true

                Row {
                    anchors.fill: parent
                    anchors.margins: 1

                    // Left Resizable Sidebar
                    Rectangle {
                        id: sidebarBox
                        width: root.sidebarWidth
                        height: parent.height
                        color: ThemeTokens.panel
                        topLeftRadius: ThemeTokens.dp(5)
                        topRightRadius: 0
                        bottomLeftRadius: ThemeTokens.dp(5)
                        bottomRightRadius: 0
                        clip: true

                        // Sidebar Header
                        Rectangle {
                            id: sidebarHeader
                            anchors.top: parent.top
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: ThemeTokens.dp(36)
                            color: "transparent"

                            Rectangle {
                                anchors.bottom: parent.bottom
                                anchors.left: parent.left
                                anchors.right: parent.right
                                height: 1
                                color: ThemeTokens.border
                            }

                            Row {
                                anchors.fill: parent
                                anchors.leftMargin: ThemeTokens.dp(10)
                                anchors.rightMargin: ThemeTokens.dp(10)
                                spacing: ThemeTokens.dp(6)

                                DocText {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: ChaSetI18n.tr("surfaces.splitterHandle.sidebar")
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.bold: true
                                    elide: Text.ElideRight
                                    width: Math.max(ThemeTokens.dp(40), sidebarBox.width - ThemeTokens.dp(70))
                                }

                                ChaSetBadge {
                                    anchors.verticalCenter: parent.verticalCenter
                                    variant: "secondary"
                                    text: "" + Math.round(root.sidebarWidth)
                                }
                            }
                        }

                        // ChaSetScrollArea for Navigation Items
                        ChaSetScrollArea {
                            anchors.top: sidebarHeader.bottom
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            contentWidth: width
                            contentHeight: sidebarCol.implicitHeight + ThemeTokens.dp(16)

                            Column {
                                id: sidebarCol
                                x: ThemeTokens.dp(6)
                                y: ThemeTokens.dp(6)
                                width: Math.max(0, parent.width - ThemeTokens.dp(12))
                                spacing: ThemeTokens.dp(4)

                                Repeater {
                                    model: root.navItems
                                    delegate: Rectangle {
                                        id: navItemDelegate
                                        required property var modelData
                                        required property int index
                                        width: sidebarCol.width
                                        height: ThemeTokens.dp(28)
                                        radius: ThemeTokens.dp(4)
                                        color: (root.selectedNavId === modelData.id) ? ThemeTokens.selection : (itemMouseArea.containsMouse ? ThemeTokens.hover : "transparent")

                                        MouseArea {
                                            id: itemMouseArea
                                            anchors.fill: parent
                                            hoverEnabled: true
                                            cursorShape: Qt.PointingHandCursor
                                            onClicked: root.selectedNavId = navItemDelegate.modelData.id
                                        }

                                        Row {
                                            anchors.fill: parent
                                            anchors.leftMargin: ThemeTokens.dp(8)
                                            anchors.rightMargin: ThemeTokens.dp(8)
                                            spacing: ThemeTokens.dp(6)

                                            ChaSetIcon {
                                                anchors.verticalCenter: parent.verticalCenter
                                                name: "file-text"
                                                size: 12
                                                color: (root.selectedNavId === navItemDelegate.modelData.id) ? ThemeTokens.accent : ThemeTokens.subduedText
                                            }

                                            DocText {
                                                anchors.verticalCenter: parent.verticalCenter
                                                text: navItemDelegate.modelData.title || ""
                                                color: (root.selectedNavId === navItemDelegate.modelData.id) ? ThemeTokens.text : ThemeTokens.subduedText
                                                font.pixelSize: Typography.sizeCaption
                                                font.bold: root.selectedNavId === navItemDelegate.modelData.id
                                                elide: Text.ElideRight
                                                width: parent.width - ThemeTokens.dp(30)
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        ChaSetSplitterHandle {
                            edge: "right"
                            targetSize: root.sidebarWidth
                            minSize: 140
                            maxSize: 400
                            defaultSize: 200
                            onSizeChanging: function(newSize) { root.sidebarWidth = newSize; }
                            onSizeChanged: function(finalSize) { root.sidebarWidth = finalSize; }
                        }
                    }

                    // Right Main Viewport Area
                    Rectangle {
                        width: parent.width - root.sidebarWidth
                        height: parent.height
                        color: ThemeTokens.background
                        clip: true

                        // Viewport Header
                        Rectangle {
                            id: mainHeader
                            anchors.top: parent.top
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: ThemeTokens.dp(36)
                            color: ThemeTokens.card

                            Rectangle {
                                anchors.bottom: parent.bottom
                                anchors.left: parent.left
                                anchors.right: parent.right
                                height: 1
                                color: ThemeTokens.border
                            }

                            Row {
                                anchors.fill: parent
                                anchors.leftMargin: ThemeTokens.dp(12)
                                anchors.rightMargin: ThemeTokens.dp(12)
                                spacing: ThemeTokens.dp(8)

                                DocText {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: ChaSetI18n.tr("surfaces.splitterHandle.mainContent")
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.bold: true
                                }

                                ChaSetBadge {
                                    anchors.verticalCenter: parent.verticalCenter
                                    variant: "outline"
                                    text: ChaSetI18n.tr("surfaces.splitterHandle.scrollable")
                                }
                            }
                        }

                        // ChaSetScrollArea for Main Content
                        ChaSetScrollArea {
                            anchors.top: mainHeader.bottom
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            contentWidth: width
                            contentHeight: mainCol.implicitHeight + ThemeTokens.dp(24)

                            Column {
                                id: mainCol
                                x: ThemeTokens.dp(12)
                                y: ThemeTokens.dp(12)
                                width: Math.max(0, parent.width - ThemeTokens.dp(24))
                                spacing: ThemeTokens.dp(8)

                                // Intro Card
                                Rectangle {
                                    width: mainCol.width
                                    height: introCol.implicitHeight + ThemeTokens.dp(16)
                                    radius: ThemeTokens.dp(6)
                                    color: ThemeTokens.panel
                                    border.color: ThemeTokens.border
                                    border.width: 1

                                    Column {
                                        id: introCol
                                        anchors.fill: parent
                                        anchors.margins: ThemeTokens.dp(8)
                                        spacing: ThemeTokens.dp(4)

                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.splitterHandle.fluidLayoutTitle")
                                            color: ThemeTokens.text
                                            font.pixelSize: Typography.sizeCaption
                                            font.bold: true
                                        }

                                        DocText {
                                            width: parent.width
                                            text: ChaSetI18n.tr("surfaces.splitterHandle.fluidLayoutDesc")
                                            color: ThemeTokens.subduedText
                                            font.pixelSize: Typography.sizeCaption
                                            wrapMode: Text.WordWrap
                                        }
                                    }
                                }

                                // Feature Cards Repeater
                                Repeater {
                                    model: root.featureCards
                                    delegate: Rectangle {
                                        id: cardDelegate
                                        required property var modelData
                                        required property int index
                                        width: mainCol.width
                                        height: cardInnerCol.implicitHeight + ThemeTokens.dp(16)
                                        radius: ThemeTokens.dp(6)
                                        color: ThemeTokens.card
                                        border.color: ThemeTokens.border
                                        border.width: 1

                                        Column {
                                            id: cardInnerCol
                                            anchors.fill: parent
                                            anchors.margins: ThemeTokens.dp(8)
                                            spacing: ThemeTokens.dp(4)

                                            Row {
                                                width: parent.width
                                                spacing: ThemeTokens.dp(6)

                                                DocText {
                                                    text: cardDelegate.modelData.title || ""
                                                    color: ThemeTokens.text
                                                    font.pixelSize: Typography.sizeCaption
                                                    font.bold: true
                                                    elide: Text.ElideRight
                                                    width: parent.width - ThemeTokens.dp(50)
                                                }

                                                ChaSetBadge {
                                                    variant: "secondary"
                                                    text: cardDelegate.modelData.badge || "Core"
                                                }
                                            }

                                            DocText {
                                                width: parent.width
                                                text: cardDelegate.modelData.desc || ""
                                                color: ThemeTokens.subduedText
                                                font.pixelSize: Typography.sizeCaption
                                                wrapMode: Text.WordWrap
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

        controlsData: [
            Row {
                spacing: 16

                Row {
                    spacing: 8
                    anchors.verticalCenter: parent.verticalCenter
                    DocText {
                        anchors.verticalCenter: parent.verticalCenter
                        text: ChaSetI18n.tr("surfaces.splitterHandle.currentWidth")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }
                    ChaSetBadge {
                        anchors.verticalCenter: parent.verticalCenter
                        variant: "outline"
                        text: "" + Math.round(root.sidebarWidth)
                    }
                }

                ChaSetButton {
                    size: "sm"
                    variant: "outline"
                    text: ChaSetI18n.tr("surfaces.splitterHandle.reset200")
                    onClicked: root.sidebarWidth = 200
                }
            }
        ]
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetSplitterHandle {
    orientation: Qt.Horizontal
}`
        reactCode: `import { SplitterHandle } from '@chahu/cha-set';

<SplitterHandle orientation="horizontal" onDrag={(delta) => console.log(delta)} />`
    }

    // Vertical Edge Handle
    DocText {
        text: ChaSetI18n.tr("desktopComposite.splitterHandle.verticalTitle", "Vertical Edge Handle")
        font.pixelSize: Typography.sizeTitleSm
        font.bold: true
        color: ThemeTokens.text
    }

    ChaSetCard {
        width: parent.width

        ChaSetCardContent {
            topPadding: 16
            bottomPadding: 16
            horizontalPadding: 16

            Column {
                spacing: 12
                width: parent.width
                height: implicitHeight

                Flow {
                    width: parent.width
                    spacing: 6
                    DocText {
                        text: ChaSetI18n.tr("desktopComposite.splitterHandle.horizontalPrefix", "Handles can also be attached to horizontal edges (")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }
                    ChaSetCopyableBadge {
                        size: "sm"
                        text: "top"
                    }
                    DocText {
                        text: ChaSetI18n.tr("common.or", "or")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }
                    ChaSetCopyableBadge {
                        size: "sm"
                        text: "bottom"
                    }
                    DocText {
                        text: ChaSetI18n.tr("desktopComposite.splitterHandle.horizontalSuffix", ") for bottom console or drawer resizing.")
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                    }
                }

                Rectangle {
                    width: Math.min(parent.width, ThemeTokens.dp(480))
                    height: ThemeTokens.dp(220)
                    implicitHeight: ThemeTokens.dp(220)
                    color: ThemeTokens.background
                    radius: ThemeTokens.dp(6)
                    border.color: ThemeTokens.border
                    border.width: 1
                    clip: true

                    Item {
                        anchors.fill: parent
                        anchors.margins: 1

                        // Top Canvas Editor Area with ScrollArea
                        Rectangle {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.top: parent.top
                            anchors.bottom: bottomBox.top
                            color: "transparent"
                            clip: true

                            Rectangle {
                                id: editorHeader
                                anchors.top: parent.top
                                anchors.left: parent.left
                                anchors.right: parent.right
                                height: ThemeTokens.dp(26)
                                color: "transparent"

                                Row {
                                    anchors.fill: parent
                                    anchors.leftMargin: ThemeTokens.dp(8)
                                    anchors.rightMargin: ThemeTokens.dp(8)
                                    spacing: ThemeTokens.dp(6)

                                    DocText {
                                        anchors.verticalCenter: parent.verticalCenter
                                        text: ChaSetI18n.tr("surfaces.splitterHandle.editorCanvasArea")
                                        color: ThemeTokens.text
                                        font.pixelSize: Typography.sizeCaption
                                        font.bold: true
                                    }

                                    ChaSetBadge {
                                        anchors.verticalCenter: parent.verticalCenter
                                        variant: "outline"
                                        text: ChaSetI18n.tr("surfaces.splitterHandle.canvasBadge")
                                    }
                                }
                            }

                            ChaSetScrollArea {
                                anchors.top: editorHeader.bottom
                                anchors.left: parent.left
                                anchors.right: parent.right
                                anchors.bottom: parent.bottom
                                contentWidth: width
                                contentHeight: codeBlockItem.implicitHeight + ThemeTokens.dp(8)

                                ChaSetCodeBlock {
                                    id: codeBlockItem
                                    anchors.top: parent.top
                                    anchors.left: parent.left
                                    anchors.right: parent.right
                                    anchors.margins: ThemeTokens.dp(4)
                                    code: "import ChaSet\n\nChaSetSplitterHandle {\n    edge: \"top\"\n    targetSize: 120\n}"
                                    language: "qml"
                                }
                            }
                        }

                        // Bottom Terminal Console Area with ScrollArea
                        Rectangle {
                            id: bottomBox
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: root.bottomHeight
                            color: ThemeTokens.panel
                            topLeftRadius: 0
                            topRightRadius: 0
                            bottomLeftRadius: ThemeTokens.dp(5)
                            bottomRightRadius: ThemeTokens.dp(5)
                            clip: true

                            ChaSetSplitterHandle {
                                edge: "top"
                                targetSize: root.bottomHeight
                                minSize: 60
                                maxSize: 180
                                defaultSize: 120
                                onSizeChanging: function(newSize) { root.bottomHeight = newSize; }
                                onSizeChanged: function(finalSize) { root.bottomHeight = finalSize; }
                            }

                            Rectangle {
                                id: consoleHeader
                                anchors.top: parent.top
                                anchors.left: parent.left
                                anchors.right: parent.right
                                height: ThemeTokens.dp(26)
                                color: "transparent"

                                Row {
                                    anchors.fill: parent
                                    anchors.leftMargin: ThemeTokens.dp(8)
                                    anchors.rightMargin: ThemeTokens.dp(8)
                                    spacing: ThemeTokens.dp(6)

                                    DocText {
                                        anchors.verticalCenter: parent.verticalCenter
                                        text: ChaSetI18n.tr("surfaces.splitterHandle.terminalConsole")
                                        color: ThemeTokens.text
                                        font.pixelSize: Typography.sizeCaption
                                        font.bold: true
                                    }

                                    ChaSetBadge {
                                        anchors.verticalCenter: parent.verticalCenter
                                        variant: "secondary"
                                        text: "" + Math.round(root.bottomHeight)
                                    }
                                }
                            }

                            ChaSetScrollArea {
                                anchors.top: consoleHeader.bottom
                                anchors.left: parent.left
                                anchors.right: parent.right
                                anchors.bottom: parent.bottom
                                contentWidth: width
                                contentHeight: consoleLogsCol.implicitHeight + ThemeTokens.dp(12)

                                Column {
                                    id: consoleLogsCol
                                    anchors.fill: parent
                                    anchors.leftMargin: ThemeTokens.dp(8)
                                    anchors.rightMargin: ThemeTokens.dp(8)
                                    spacing: ThemeTokens.dp(2)

                                    DocText {
                                        text: ChaSetI18n.tr("surfaces.splitterHandle.logBuildStarted")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                        font.family: Typography.familyMono
                                    }
                                    DocText {
                                        text: ChaSetI18n.tr("surfaces.splitterHandle.logSchemasLoaded")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                        font.family: Typography.familyMono
                                    }
                                    DocText {
                                        text: ChaSetI18n.tr("surfaces.splitterHandle.logClamped")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                        font.family: Typography.familyMono
                                    }
                                    DocText {
                                        text: ChaSetI18n.tr("surfaces.splitterHandle.logReady")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                        font.family: Typography.familyMono
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    DocMarkdown {
        width: parent.width
        docId: "splitter-handle"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "splitter-handle"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "splitter-handle"
        section: "props"
    }
}