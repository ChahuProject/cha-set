// SidebarDocPage.qml — Living Documentation for ChaSetSidebar
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Sidebar"
    description: ChaSetI18n.tr("components.sidebar.description", "Composable, responsive and resizable desktop-grade sidebar navigation system supporting icon-collapse, offcanvas drawers, and custom rem sizing.")

    property bool demoCollapsed: false
    property string demoVariant: "sidebar"
    property string demoCollapsible: "icon"
    property string activeItem: "dashboard"

    readonly property var navItemsModel: [
        { "id": "dashboard", "icon": "home", "label": ChaSetI18n.tr("surfaces.sidebar.dashboard"), "group": "overview", "badge": "" },
        { "id": "projects", "icon": "folder", "label": ChaSetI18n.tr("surfaces.sidebar.projects"), "group": "overview", "badge": "12" },
        { "id": "analytics", "icon": "chart", "label": ChaSetI18n.tr("surfaces.sidebar.analytics"), "group": "overview", "badge": "" },
        { "id": "diagnostics", "icon": "sliders", "label": ChaSetI18n.tr("surfaces.sidebar.diagnostics"), "group": "configuration", "badge": "OK" },
        { "id": "settings", "icon": "settings", "label": ChaSetI18n.tr("surfaces.sidebar.preferences"), "group": "configuration", "badge": "" }
    ]

    function getCurrentLabel() {
        for (var i = 0; i < navItemsModel.length; i++) {
            if (navItemsModel[i].id === root.activeItem) {
                return navItemsModel[i].label;
            }
        }
        return ChaSetI18n.tr("surfaces.sidebar.dashboard");
    }

    function getCurrentIcon() {
        for (var i = 0; i < navItemsModel.length; i++) {
            if (navItemsModel[i].id === root.activeItem) {
                return navItemsModel[i].icon;
            }
        }
        return "home";
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.sidebar.sandboxTitle", "Sidebar Sandbox")
        stageHeight: 480
        reactCode: `<SidebarProvider defaultOpen={true}>
  <Sidebar collapsible="icon" variant="sidebar">
    <SidebarHeader className="border-b border-border/50 p-2">
      <div className="flex items-center justify-between px-2">
        <span className="font-semibold text-sm">ChaSet Studio</span>
        <SidebarTrigger tooltip={false} />
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <HomeIcon />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FolderIcon />
                <span>Projects</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter className="border-t border-border/50 p-2">
      <Badge variant="outline">v0.2.0 Desktop</Badge>
    </SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset className="p-4">
    <SidebarTrigger />
    <main>Content Area</main>
  </SidebarInset>
</SidebarProvider>`
        qtCode: `ChaSetSidebar {
    id: sidebar
    collapsed: ${demoCollapsed}
    variant: "${demoVariant}"
    collapsible: "${demoCollapsible}"
    sidebarWidth: 240

    // Header Bar with Brand & Trigger
    Row {
        spacing: ThemeTokens.dp(8)
        ChaSetIcon { name: "chaset"; size: 18; color: ThemeTokens.accent }
        DocText { text: "ChaSet Studio"; font.weight: Font.Bold }
    }

    // Navigation Items
    Column {
        spacing: ThemeTokens.dp(4)
        ChaSetButton { icon: "home"; text: "Dashboard"; variant: "ghost" }
        ChaSetButton { icon: "folder"; text: "Projects"; variant: "ghost" }
        ChaSetButton { icon: "chart"; text: "Analytics"; variant: "ghost" }
        ChaSetButton { icon: "settings"; text: "Preferences"; variant: "ghost" }
    }
}`

        Item {
            anchors.fill: parent

            // Preview Container Box (Self-contained, theme-adaptive dark/light)
            Rectangle {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(32), ThemeTokens.dp(720))
                height: ThemeTokens.dp(440)
                color: ThemeTokens.background
                border.color: ThemeTokens.border
                border.width: 1
                radius: ThemeTokens.dp(12)
                clip: true

                // Embedded Demo Sidebar
                ChaSetSidebar {
                    id: demoSidebar
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    anchors.left: parent.left
                    sidebarWidth: 220
                    collapsed: root.demoCollapsed
                    variant: root.demoVariant
                    collapsible: root.demoCollapsible
                    onToggled: function(isCollapsed) {
                        root.demoCollapsed = isCollapsed
                    }

                    Item {
                        anchors.fill: parent

                        // Header Bar
                        Item {
                            id: sidebarHeaderBar
                            anchors.top: parent.top
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: ThemeTokens.dp(48)

                            Row {
                                anchors.left: parent.left
                                anchors.leftMargin: ThemeTokens.dp(12)
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: ThemeTokens.dp(8)

                                Rectangle {
                                    width: ThemeTokens.dp(28)
                                    height: ThemeTokens.dp(28)
                                    radius: ThemeTokens.dp(6)
                                    color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.12)
                                    anchors.verticalCenter: parent.verticalCenter

                                    ChaSetIcon {
                                        name: "chaset"
                                        size: 16
                                        color: ThemeTokens.accent
                                        anchors.centerIn: parent
                                    }
                                }

                                Column {
                                    visible: !demoSidebar.collapsed
                                    anchors.verticalCenter: parent.verticalCenter
                                    spacing: 1

                                    DocText {
                                        text: "ChaSet Studio"
                                        color: ThemeTokens.text
                                        font.pixelSize: Typography.sizeSmall
                                        font.weight: Typography.weightBold
                                    }

                                    DocText {
                                        text: ChaSetI18n.tr("surfaces.sidebar.proWorkspace")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                    }
                                }
                            }

                            ChaSetButton {
                                visible: !demoSidebar.collapsed
                                anchors.right: parent.right
                                anchors.rightMargin: ThemeTokens.dp(8)
                                anchors.verticalCenter: parent.verticalCenter
                                icon: "panel-left"
                                variant: "ghost"
                                size: "sm"
                                onClicked: demoSidebar.toggle()
                            }
                        }

                        Rectangle {
                            id: sidebarHeaderSep
                            anchors.top: sidebarHeaderBar.bottom
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: 1
                            color: ThemeTokens.border
                        }

                        // Navigation Items Column
                        Flickable {
                            id: navFlickable
                            anchors.top: sidebarHeaderSep.bottom
                            anchors.bottom: sidebarFooterSep.top
                            anchors.left: parent.left
                            anchors.right: parent.right
                            contentHeight: navCol.height + ThemeTokens.dp(16)
                            clip: true

                            Column {
                                id: navCol
                                anchors.top: parent.top
                                anchors.topMargin: ThemeTokens.dp(8)
                                anchors.left: parent.left
                                anchors.right: parent.right
                                anchors.leftMargin: ThemeTokens.dp(6)
                                anchors.rightMargin: ThemeTokens.dp(6)
                                spacing: ThemeTokens.dp(4)

                                // Group 1: Overview
                                DocText {
                                    visible: !demoSidebar.collapsed
                                    text: ChaSetI18n.tr("surfaces.sidebar.overview")
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: Typography.sizeCaption
                                    font.weight: Typography.weightBold
                                    leftPadding: ThemeTokens.dp(8)
                                    topPadding: ThemeTokens.dp(4)
                                    bottomPadding: ThemeTokens.dp(2)
                                }

                                Repeater {
                                    model: [root.navItemsModel[0], root.navItemsModel[1], root.navItemsModel[2]]

                                    delegate: Item {
                                        required property var modelData
                                        required property int index

                                        width: navCol.width
                                        height: ThemeTokens.dp(32)

                                        readonly property bool isSelected: root.activeItem === modelData.id

                                        Rectangle {
                                            id: navItemBg
                                            anchors.fill: parent
                                            radius: ThemeTokens.dp(6)
                                            color: isSelected
                                                ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.12)
                                                : (itemHover.hovered ? ThemeTokens.hoverOverlay : "transparent")
                                            border.color: isSelected ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.3) : "transparent"
                                            border.width: isSelected ? 1 : 0

                                            // Left active indicator pill
                                            Rectangle {
                                                visible: isSelected
                                                anchors.left: parent.left
                                                anchors.leftMargin: 2
                                                anchors.verticalCenter: parent.verticalCenter
                                                width: 3
                                                height: ThemeTokens.dp(16)
                                                radius: 1.5
                                                color: ThemeTokens.accent
                                            }

                                            Row {
                                                anchors.left: parent.left
                                                anchors.leftMargin: demoSidebar.collapsed ? (parent.width - ThemeTokens.dp(18)) / 2 : ThemeTokens.dp(10)
                                                anchors.right: parent.right
                                                anchors.rightMargin: ThemeTokens.dp(8)
                                                anchors.verticalCenter: parent.verticalCenter
                                                spacing: ThemeTokens.dp(8)

                                                ChaSetIcon {
                                                    name: modelData.icon
                                                    size: 16
                                                    color: isSelected ? ThemeTokens.accent : ThemeTokens.text
                                                    anchors.verticalCenter: parent.verticalCenter
                                                }

                                                DocText {
                                                    visible: !demoSidebar.collapsed
                                                    text: modelData.label
                                                    color: isSelected ? ThemeTokens.accent : ThemeTokens.text
                                                    font.pixelSize: Typography.sizeSmall
                                                    font.weight: isSelected ? Typography.weightMedium : Typography.weightRegular
                                                    anchors.verticalCenter: parent.verticalCenter
                                                }

                                                Item {
                                                    visible: !demoSidebar.collapsed && modelData.badge !== ""
                                                    width: badgeComp.width
                                                    height: parent.height
                                                    anchors.verticalCenter: parent.verticalCenter

                                                    ChaSetBadge {
                                                        id: badgeComp
                                                        anchors.verticalCenter: parent.verticalCenter
                                                        variant: isSelected ? "default" : "secondary"
                                                        text: modelData.badge
                                                    }
                                                }
                                            }

                                            HoverHandler {
                                                id: itemHover
                                                cursorShape: Qt.PointingHandCursor
                                            }

                                            TapHandler {
                                                onTapped: {
                                                    root.activeItem = modelData.id
                                                }
                                            }
                                        }
                                    }
                                }

                                // Group 2: Configuration
                                DocText {
                                    visible: !demoSidebar.collapsed
                                    text: ChaSetI18n.tr("surfaces.sidebar.configuration")
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: Typography.sizeCaption
                                    font.weight: Typography.weightBold
                                    leftPadding: ThemeTokens.dp(8)
                                    topPadding: ThemeTokens.dp(8)
                                    bottomPadding: ThemeTokens.dp(2)
                                }

                                Repeater {
                                    model: [root.navItemsModel[3], root.navItemsModel[4]]

                                    delegate: Item {
                                        required property var modelData
                                        required property int index

                                        width: navCol.width
                                        height: ThemeTokens.dp(32)

                                        readonly property bool isSelected: root.activeItem === modelData.id

                                        Rectangle {
                                            anchors.fill: parent
                                            radius: ThemeTokens.dp(6)
                                            color: isSelected
                                                ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.12)
                                                : (itemHover2.hovered ? ThemeTokens.hoverOverlay : "transparent")
                                            border.color: isSelected ? Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.3) : "transparent"
                                            border.width: isSelected ? 1 : 0

                                            Rectangle {
                                                visible: isSelected
                                                anchors.left: parent.left
                                                anchors.leftMargin: 2
                                                anchors.verticalCenter: parent.verticalCenter
                                                width: 3
                                                height: ThemeTokens.dp(16)
                                                radius: 1.5
                                                color: ThemeTokens.accent
                                            }

                                            Row {
                                                anchors.left: parent.left
                                                anchors.leftMargin: demoSidebar.collapsed ? (parent.width - ThemeTokens.dp(18)) / 2 : ThemeTokens.dp(10)
                                                anchors.right: parent.right
                                                anchors.rightMargin: ThemeTokens.dp(8)
                                                anchors.verticalCenter: parent.verticalCenter
                                                spacing: ThemeTokens.dp(8)

                                                ChaSetIcon {
                                                    name: modelData.icon
                                                    size: 16
                                                    color: isSelected ? ThemeTokens.accent : ThemeTokens.text
                                                    anchors.verticalCenter: parent.verticalCenter
                                                }

                                                DocText {
                                                    visible: !demoSidebar.collapsed
                                                    text: modelData.label
                                                    color: isSelected ? ThemeTokens.accent : ThemeTokens.text
                                                    font.pixelSize: Typography.sizeSmall
                                                    font.weight: isSelected ? Typography.weightMedium : Typography.weightRegular
                                                    anchors.verticalCenter: parent.verticalCenter
                                                }

                                                Item {
                                                    visible: !demoSidebar.collapsed && modelData.badge !== ""
                                                    width: badgeComp2.width
                                                    height: parent.height
                                                    anchors.verticalCenter: parent.verticalCenter

                                                    ChaSetBadge {
                                                        id: badgeComp2
                                                        anchors.verticalCenter: parent.verticalCenter
                                                        variant: "outline"
                                                        text: modelData.badge
                                                    }
                                                }
                                            }

                                            HoverHandler {
                                                id: itemHover2
                                                cursorShape: Qt.PointingHandCursor
                                            }

                                            TapHandler {
                                                onTapped: {
                                                    root.activeItem = modelData.id
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        Rectangle {
                            id: sidebarFooterSep
                            anchors.bottom: sidebarFooterBar.top
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: 1
                            color: ThemeTokens.border
                        }

                        // Footer User / Status Area
                        Item {
                            id: sidebarFooterBar
                            anchors.bottom: parent.bottom
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: ThemeTokens.dp(44)

                            Row {
                                anchors.left: parent.left
                                anchors.leftMargin: demoSidebar.collapsed ? (parent.width - ThemeTokens.dp(24)) / 2 : ThemeTokens.dp(12)
                                anchors.verticalCenter: parent.verticalCenter
                                spacing: ThemeTokens.dp(8)

                                Rectangle {
                                    width: ThemeTokens.dp(24)
                                    height: ThemeTokens.dp(24)
                                    radius: ThemeTokens.dp(12)
                                    color: ThemeTokens.panel
                                    border.color: ThemeTokens.border
                                    border.width: 1
                                    anchors.verticalCenter: parent.verticalCenter

                                    DocText {
                                        anchors.centerIn: parent
                                        text: "CS"
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeCaption
                                        font.weight: Typography.weightBold
                                    }
                                }

                                Column {
                                    visible: !demoSidebar.collapsed
                                    anchors.verticalCenter: parent.verticalCenter
                                    spacing: 1

                                    DocText {
                                        text: ChaSetI18n.tr("surfaces.sidebar.desktopVersion")
                                        color: ThemeTokens.text
                                        font.pixelSize: Typography.sizeSmall
                                        font.weight: Typography.weightMedium
                                    }

                                    Row {
                                        spacing: 4
                                        Rectangle {
                                            width: 6
                                            height: 6
                                            radius: 3
                                            color: Qt.rgba(16/255, 185/255, 129/255, 1.0)
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.sidebar.online")
                                            color: ThemeTokens.subduedText
                                            font.pixelSize: Typography.sizeCaption
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                // Inset Content Page (Right Side)
                Rectangle {
                    id: mainInsetArea
                    anchors.left: demoSidebar.right
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    color: ThemeTokens.background
                    clip: true

                    // Top Bar
                    Item {
                        id: insetTopBar
                        anchors.top: parent.top
                        anchors.left: parent.left
                        anchors.right: parent.right
                        height: ThemeTokens.dp(48)

                        Row {
                            anchors.left: parent.left
                            anchors.leftMargin: ThemeTokens.dp(14)
                            anchors.verticalCenter: parent.verticalCenter
                            spacing: ThemeTokens.dp(8)

                            ChaSetButton {
                                icon: "panel-left"
                                variant: "ghost"
                                size: "sm"
                                anchors.verticalCenter: parent.verticalCenter
                                onClicked: demoSidebar.toggle()
                            }

                            DocText {
                                text: ChaSetI18n.tr("surfaces.sidebar.studioBreadcrumb")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                                anchors.verticalCenter: parent.verticalCenter
                            }

                            Row {
                                spacing: 4
                                anchors.verticalCenter: parent.verticalCenter

                                ChaSetIcon {
                                    name: root.getCurrentIcon()
                                    size: 14
                                    color: ThemeTokens.accent
                                    anchors.verticalCenter: parent.verticalCenter
                                }

                                DocText {
                                    text: root.getCurrentLabel()
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.weight: Typography.weightBold
                                    anchors.verticalCenter: parent.verticalCenter
                                }
                            }
                        }

                        Row {
                            anchors.right: parent.right
                            anchors.rightMargin: ThemeTokens.dp(14)
                            anchors.verticalCenter: parent.verticalCenter
                            spacing: ThemeTokens.dp(8)

                            ChaSetBadge {
                                anchors.verticalCenter: parent.verticalCenter
                                variant: "outline"
                                text: ChaSetI18n.tr("surfaces.sidebar.selectedView") + " " + root.activeItem
                            }

                            ChaSetBadge {
                                anchors.verticalCenter: parent.verticalCenter
                                variant: demoSidebar.collapsed ? "secondary" : "default"
                                text: demoSidebar.collapsed ? ChaSetI18n.tr("surfaces.sidebar.collapsed") : ChaSetI18n.tr("surfaces.sidebar.expanded")
                            }
                        }

                        Rectangle {
                            anchors.bottom: parent.bottom
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: 1
                            color: ThemeTokens.border
                        }
                    }

                    // Content View Area
                    Flickable {
                        anchors.top: insetTopBar.bottom
                        anchors.bottom: parent.bottom
                        anchors.left: parent.left
                        anchors.right: parent.right
                        anchors.margins: ThemeTokens.dp(14)
                        contentHeight: contentCol.height + ThemeTokens.dp(16)
                        clip: true

                        Column {
                            id: contentCol
                            width: parent.width
                            spacing: ThemeTokens.dp(12)

                            // Dashboard View
                            Column {
                                visible: root.activeItem === "dashboard"
                                width: parent.width
                                spacing: ThemeTokens.dp(12)

                                // KPI Stat Cards Row
                                Row {
                                    width: parent.width
                                    spacing: ThemeTokens.dp(8)

                                    Rectangle {
                                        width: (parent.width - ThemeTokens.dp(16)) / 3
                                        height: ThemeTokens.dp(72)
                                        radius: ThemeTokens.dp(8)
                                        color: ThemeTokens.card
                                        border.color: ThemeTokens.border
                                        border.width: 1

                                        Column {
                                            anchors.fill: parent
                                            anchors.margins: ThemeTokens.dp(10)
                                            spacing: 4

                                            DocText {
                                                text: ChaSetI18n.tr("surfaces.sidebar.activeProjects")
                                                color: ThemeTokens.subduedText
                                                font.pixelSize: Typography.sizeCaption
                                            }

                                            Item {
                                                width: parent.width
                                                height: ThemeTokens.dp(24)
                                                DocText {
                                                    anchors.left: parent.left
                                                    anchors.verticalCenter: parent.verticalCenter
                                                    text: "12"
                                                    color: ThemeTokens.text
                                                    font.pixelSize: Typography.sizeHeading
                                                    font.weight: Typography.weightBold
                                                }
                                                ChaSetBadge {
                                                    anchors.right: parent.right
                                                    anchors.verticalCenter: parent.verticalCenter
                                                    variant: "secondary"
                                                    text: "+2"
                                                }
                                            }
                                        }
                                    }

                                    Rectangle {
                                        width: (parent.width - ThemeTokens.dp(16)) / 3
                                        height: ThemeTokens.dp(72)
                                        radius: ThemeTokens.dp(8)
                                        color: ThemeTokens.card
                                        border.color: ThemeTokens.border
                                        border.width: 1

                                        Column {
                                            anchors.fill: parent
                                            anchors.margins: ThemeTokens.dp(10)
                                            spacing: 4

                                            DocText {
                                                text: ChaSetI18n.tr("surfaces.sidebar.buildTime")
                                                color: ThemeTokens.subduedText
                                                font.pixelSize: Typography.sizeCaption
                                            }

                                            Item {
                                                width: parent.width
                                                height: ThemeTokens.dp(24)
                                                DocText {
                                                    anchors.left: parent.left
                                                    anchors.verticalCenter: parent.verticalCenter
                                                    text: "1.2s"
                                                    color: ThemeTokens.text
                                                    font.pixelSize: Typography.sizeHeading
                                                    font.weight: Typography.weightBold
                                                }
                                                ChaSetBadge {
                                                    anchors.right: parent.right
                                                    anchors.verticalCenter: parent.verticalCenter
                                                    variant: "outline"
                                                    text: ChaSetI18n.tr("surfaces.sidebar.cached")
                                                }
                                            }
                                        }
                                    }

                                    Rectangle {
                                        width: (parent.width - ThemeTokens.dp(16)) / 3
                                        height: ThemeTokens.dp(72)
                                        radius: ThemeTokens.dp(8)
                                        color: ThemeTokens.card
                                        border.color: ThemeTokens.border
                                        border.width: 1

                                        Column {
                                            anchors.fill: parent
                                            anchors.margins: ThemeTokens.dp(10)
                                            spacing: 4

                                            DocText {
                                                text: ChaSetI18n.tr("surfaces.sidebar.memoryUsage")
                                                color: ThemeTokens.subduedText
                                                font.pixelSize: Typography.sizeCaption
                                            }

                                            Item {
                                                width: parent.width
                                                height: ThemeTokens.dp(24)
                                                DocText {
                                                    anchors.left: parent.left
                                                    anchors.verticalCenter: parent.verticalCenter
                                                    text: "42 MB"
                                                    color: ThemeTokens.text
                                                    font.pixelSize: Typography.sizeHeading
                                                    font.weight: Typography.weightBold
                                                }
                                                ChaSetBadge {
                                                    anchors.right: parent.right
                                                    anchors.verticalCenter: parent.verticalCenter
                                                    variant: "secondary"
                                                    text: ChaSetI18n.tr("surfaces.sidebar.lightweight")
                                                }
                                            }
                                        }
                                    }
                                }

                                // Interactive Sandbox Controls Card
                                Rectangle {
                                    width: parent.width
                                    height: ThemeTokens.dp(130)
                                    radius: ThemeTokens.dp(8)
                                    color: ThemeTokens.card
                                    border.color: ThemeTokens.border
                                    border.width: 1

                                    Column {
                                        anchors.fill: parent
                                        anchors.margins: ThemeTokens.dp(12)
                                        spacing: ThemeTokens.dp(8)

                                        Row {
                                            spacing: 6
                                            ChaSetIcon {
                                                name: "sliders"
                                                size: 14
                                                color: ThemeTokens.accent
                                                anchors.verticalCenter: parent.verticalCenter
                                            }
                                            DocText {
                                                text: ChaSetI18n.tr("desktopComposite.sidebar.sandboxTitle")
                                                color: ThemeTokens.text
                                                font.weight: Typography.weightBold
                                                font.pixelSize: Typography.sizeSmall
                                                anchors.verticalCenter: parent.verticalCenter
                                            }
                                        }

                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.sidebar.dragHint")
                                            color: ThemeTokens.subduedText
                                            font.pixelSize: Typography.sizeCaption
                                            wrapMode: Text.WordWrap
                                            width: parent.width
                                        }

                                        Rectangle {
                                            width: parent.width
                                            height: 1
                                            color: ThemeTokens.border
                                        }

                                        Row {
                                            width: parent.width
                                            spacing: ThemeTokens.dp(12)

                                            Row {
                                                spacing: 6
                                                anchors.verticalCenter: parent.verticalCenter
                                                DocText {
                                                    text: ChaSetI18n.tr("surfaces.sidebar.collapsibleMode")
                                                    color: ThemeTokens.subduedText
                                                    font.pixelSize: Typography.sizeSmall
                                                    anchors.verticalCenter: parent.verticalCenter
                                                }

                                                ChaSetSegmentedControl {
                                                    size: "sm"
                                                    value: root.demoCollapsible
                                                    options: [
                                                        { "label": ChaSetI18n.tr("surfaces.sidebar.icon"), "value": "icon" },
                                                        { "label": ChaSetI18n.tr("surfaces.sidebar.offcanvas"), "value": "offcanvas" },
                                                        { "label": ChaSetI18n.tr("surfaces.sidebar.none"), "value": "none" }
                                                    ]
                                                    onValueChanged: {
                                                        root.demoCollapsible = value
                                                    }
                                                }
                                            }

                                            Row {
                                                spacing: 6
                                                anchors.verticalCenter: parent.verticalCenter

                                                ChaSetButton {
                                                    size: "sm"
                                                    variant: "outline"
                                                    text: demoSidebar.collapsed ? ChaSetI18n.tr("surfaces.sidebar.expandSidebar") : ChaSetI18n.tr("surfaces.sidebar.collapseSidebar")
                                                    onClicked: demoSidebar.toggle()
                                                }

                                                ChaSetButton {
                                                    size: "sm"
                                                    variant: "ghost"
                                                    text: ChaSetI18n.tr("surfaces.sidebar.resetWidth220")
                                                    onClicked: {
                                                        demoSidebar.sidebarWidth = 220
                                                        demoSidebar.collapsed = false
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            // Projects View
                            Column {
                                visible: root.activeItem === "projects"
                                width: parent.width
                                spacing: ThemeTokens.dp(8)

                                Rectangle {
                                    width: parent.width
                                    height: ThemeTokens.dp(56)
                                    radius: ThemeTokens.dp(8)
                                    color: ThemeTokens.card
                                    border.color: ThemeTokens.border
                                    border.width: 1

                                    Row {
                                        anchors.fill: parent
                                        anchors.margins: ThemeTokens.dp(12)
                                        spacing: ThemeTokens.dp(10)

                                        Rectangle {
                                            width: ThemeTokens.dp(32)
                                            height: ThemeTokens.dp(32)
                                            radius: ThemeTokens.dp(6)
                                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.12)
                                            anchors.verticalCenter: parent.verticalCenter
                                            DocText {
                                                anchors.centerIn: parent
                                                text: "CS"
                                                color: ThemeTokens.accent
                                                font.weight: Typography.weightBold
                                                font.pixelSize: Typography.sizeSmall
                                            }
                                        }

                                        Column {
                                            anchors.verticalCenter: parent.verticalCenter
                                            spacing: 2
                                            DocText {
                                                text: "cha-set-core"
                                                color: ThemeTokens.text
                                                font.weight: Typography.weightBold
                                                font.pixelSize: Typography.sizeSmall
                                            }
                                            DocText {
                                                text: ChaSetI18n.tr("surfaces.sidebar.coreDesc")
                                                color: ThemeTokens.subduedText
                                                font.pixelSize: Typography.sizeCaption
                                            }
                                        }

                                        Item { width: 1; height: 1 }

                                        ChaSetBadge {
                                            anchors.right: parent.right
                                            anchors.verticalCenter: parent.verticalCenter
                                            variant: "outline"
                                            text: ChaSetI18n.tr("surfaces.sidebar.coreVersion")
                                        }
                                    }
                                }

                                Rectangle {
                                    width: parent.width
                                    height: ThemeTokens.dp(56)
                                    radius: ThemeTokens.dp(8)
                                    color: ThemeTokens.card
                                    border.color: ThemeTokens.border
                                    border.width: 1

                                    Row {
                                        anchors.fill: parent
                                        anchors.margins: ThemeTokens.dp(12)
                                        spacing: ThemeTokens.dp(10)

                                        Rectangle {
                                            width: ThemeTokens.dp(32)
                                            height: ThemeTokens.dp(32)
                                            radius: ThemeTokens.dp(6)
                                            color: Qt.rgba(ThemeTokens.accent.r, ThemeTokens.accent.g, ThemeTokens.accent.b, 0.12)
                                            anchors.verticalCenter: parent.verticalCenter
                                            DocText {
                                                anchors.centerIn: parent
                                                text: "QT"
                                                color: ThemeTokens.accent
                                                font.weight: Typography.weightBold
                                                font.pixelSize: Typography.sizeSmall
                                            }
                                        }

                                        Column {
                                            anchors.verticalCenter: parent.verticalCenter
                                            spacing: 2
                                            DocText {
                                                text: "qt-desktop-shell"
                                                color: ThemeTokens.text
                                                font.weight: Typography.weightBold
                                                font.pixelSize: Typography.sizeSmall
                                            }
                                            DocText {
                                                text: ChaSetI18n.tr("surfaces.sidebar.qtShellDesc")
                                                color: ThemeTokens.subduedText
                                                font.pixelSize: Typography.sizeCaption
                                            }
                                        }

                                        ChaSetBadge {
                                            anchors.right: parent.right
                                            anchors.verticalCenter: parent.verticalCenter
                                            variant: "secondary"
                                            text: ChaSetI18n.tr("surfaces.sidebar.qtShellVersion")
                                        }
                                    }
                                }
                            }

                            // Analytics View
                            Rectangle {
                                visible: root.activeItem === "analytics"
                                width: parent.width
                                height: ThemeTokens.dp(96)
                                radius: ThemeTokens.dp(8)
                                color: ThemeTokens.card
                                border.color: ThemeTokens.border
                                border.width: 1

                                Column {
                                    anchors.fill: parent
                                    anchors.margins: ThemeTokens.dp(12)
                                    spacing: ThemeTokens.dp(6)

                                    Row {
                                        spacing: 6
                                        ChaSetIcon {
                                            name: "chart"
                                            size: 14
                                            color: ThemeTokens.accent
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.sidebar.analyticsTitle")
                                            color: ThemeTokens.text
                                            font.weight: Typography.weightBold
                                            font.pixelSize: Typography.sizeSmall
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                    }

                                    DocText {
                                        text: ChaSetI18n.tr("surfaces.sidebar.analyticsDesc")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeSmall
                                        wrapMode: Text.WordWrap
                                        width: parent.width
                                    }
                                }
                            }

                            // Diagnostics View
                            Rectangle {
                                visible: root.activeItem === "diagnostics"
                                width: parent.width
                                height: ThemeTokens.dp(110)
                                radius: ThemeTokens.dp(8)
                                color: ThemeTokens.card
                                border.color: ThemeTokens.border
                                border.width: 1

                                Column {
                                    anchors.fill: parent
                                    anchors.margins: ThemeTokens.dp(12)
                                    spacing: ThemeTokens.dp(8)

                                    Row {
                                        spacing: 6
                                        ChaSetIcon {
                                            name: "sliders"
                                            size: 14
                                            color: ThemeTokens.accent
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.sidebar.diagTitle")
                                            color: ThemeTokens.text
                                            font.weight: Typography.weightBold
                                            font.pixelSize: Typography.sizeSmall
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                    }

                                    Row {
                                        spacing: 6
                                        ChaSetIcon { name: "check"; size: 14; color: Qt.rgba(16/255, 185/255, 129/255, 1.0) }
                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.sidebar.diagThemeGate")
                                            color: ThemeTokens.subduedText
                                            font.pixelSize: Typography.sizeCaption
                                            font.family: "monospace"
                                        }
                                    }

                                    Row {
                                        spacing: 6
                                        ChaSetIcon { name: "check"; size: 14; color: Qt.rgba(16/255, 185/255, 129/255, 1.0) }
                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.sidebar.diagZeroPx")
                                            color: ThemeTokens.subduedText
                                            font.pixelSize: Typography.sizeCaption
                                            font.family: "monospace"
                                        }
                                    }
                                }
                            }

                            // Preferences View
                            Rectangle {
                                visible: root.activeItem === "settings"
                                width: parent.width
                                height: ThemeTokens.dp(88)
                                radius: ThemeTokens.dp(8)
                                color: ThemeTokens.card
                                border.color: ThemeTokens.border
                                border.width: 1

                                Column {
                                    anchors.fill: parent
                                    anchors.margins: ThemeTokens.dp(12)
                                    spacing: ThemeTokens.dp(6)

                                    Row {
                                        spacing: 6
                                        ChaSetIcon {
                                            name: "settings"
                                            size: 14
                                            color: ThemeTokens.accent
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                        DocText {
                                            text: ChaSetI18n.tr("surfaces.sidebar.prefsTitle")
                                            color: ThemeTokens.text
                                            font.weight: Typography.weightBold
                                            font.pixelSize: Typography.sizeSmall
                                            anchors.verticalCenter: parent.verticalCenter
                                        }
                                    }

                                    DocText {
                                        text: ChaSetI18n.tr("surfaces.sidebar.prefsDesc")
                                        color: ThemeTokens.subduedText
                                        font.pixelSize: Typography.sizeSmall
                                        wrapMode: Text.WordWrap
                                        width: parent.width
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetSidebar {
    width: 240
}`
        reactCode: `import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from '@chahu/cha-set';

<Sidebar>
  <SidebarHeader>App Name</SidebarHeader>
  <SidebarContent>Navigation items...</SidebarContent>
  <SidebarFooter>User Profile</SidebarFooter>
</Sidebar>`
    }

    DocMarkdown {
        width: parent.width
        docId: "sidebar"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "sidebar"
        section: "props"
    }
}
