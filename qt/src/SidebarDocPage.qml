// SidebarDocPage.qml — Living Documentation for ChaSetSidebar
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Sidebar"
    description: ChaSetI18n.tr("components.sidebar.description", "Composable, responsive and resizable desktop-grade sidebar navigation system supporting icon-collapse, offcanvas drawers, and custom rem sizing.")

    property bool demoCollapsed: false
    property string demoVariant: "sidebar"
    property string demoCollapsible: "icon"

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.sidebar.sandboxTitle", "Sidebar Sandbox")
        stageHeight: 420
        reactCode: `<SidebarProvider defaultOpen={true}>
  <Sidebar collapsible="icon" variant="sidebar">
    <SidebarHeader>
      <div className="flex items-center gap-2 p-2">
        <span className="font-semibold">ChaSet Studio</span>
      </div>
    </SidebarHeader>
    <SidebarContent>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton isActive><span>Dashboard</span></SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton><span>Settings</span></SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarContent>
    <SidebarFooter>
      <SidebarTrigger />
    </SidebarFooter>
  </Sidebar>
</SidebarProvider>`
        qtCode: `ChaSetSidebar {
    id: sidebar
    collapsed: ${demoCollapsed}
    variant: "${demoVariant}"
    collapsible: "${demoCollapsible}"
    sidebarWidth: 240

    Column {
        anchors.fill: parent
        anchors.margins: 12
        spacing: 12

        Row {
            spacing: 8
            ChaSetIcon { name: "logo"; size: 16 }
            Text {
                visible: !sidebar.collapsed
                text: "ChaSet Studio"
                color: ThemeTokens.text
                font.weight: Font.Bold
            }
        }

        ChaSetButton {
            width: parent.width
            icon: "chart"
            text: sidebar.collapsed ? "" : "Dashboard"
            variant: "default"
        }
    }
}`

        Item {
            anchors.fill: parent

            // Preview Container Box
            Rectangle {
                anchors.centerIn: parent
                width: Math.min(parent.width - ThemeTokens.dp(40), ThemeTokens.dp(680))
                height: ThemeTokens.dp(380)
                color: ThemeTokens.background
                border.color: ThemeTokens.border
                radius: ThemeTokens.dp(8)
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
                        anchors.margins: ThemeTokens.dp(12)

                        // Header Bar
                        Row {
                            id: sidebarHeaderBar
                            anchors.top: parent.top
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: ThemeTokens.dp(24)
                            spacing: ThemeTokens.dp(8)

                            ChaSetIcon {
                                name: "logo"
                                size: ThemeTokens.dp(20)
                                color: ThemeTokens.accent
                                anchors.verticalCenter: parent.verticalCenter
                            }

                            DocText {
                                visible: !demoSidebar.collapsed
                                text: "ChaSet Studio"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                                font.weight: Typography.weightBold
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }

                        Rectangle {
                            id: sidebarSepLine
                            anchors.top: sidebarHeaderBar.bottom
                            anchors.topMargin: 12
                            anchors.left: parent.left
                            anchors.right: parent.right
                            height: 1
                            color: ThemeTokens.border
                        }

                        // Navigation Items
                        ChaSetButton {
                            id: navBtnOverview
                            anchors.top: sidebarSepLine.bottom
                            anchors.topMargin: 12
                            anchors.left: parent.left
                            anchors.right: parent.right
                            icon: "home"
                            text: demoSidebar.collapsed ? "" : ChaSetI18n.tr("surfaces.sidebar.overview")
                            variant: "default"
                            size: "sm"
                        }

                        ChaSetButton {
                            id: navBtnProjects
                            anchors.top: navBtnOverview.bottom
                            anchors.topMargin: 6
                            anchors.left: parent.left
                            anchors.right: parent.right
                            icon: "folder"
                            text: demoSidebar.collapsed ? "" : ChaSetI18n.tr("surfaces.sidebar.projects")
                            variant: "ghost"
                            size: "sm"
                        }

                        ChaSetButton {
                            id: navBtnPreferences
                            anchors.top: navBtnProjects.bottom
                            anchors.topMargin: 6
                            anchors.left: parent.left
                            anchors.right: parent.right
                            icon: "settings"
                            text: demoSidebar.collapsed ? "" : ChaSetI18n.tr("surfaces.sidebar.preferences")
                            variant: "ghost"
                            size: "sm"
                        }

                        // Footer Toggle Trigger
                        ChaSetButton {
                            id: navBtnFooter
                            anchors.bottom: parent.bottom
                            anchors.left: parent.left
                            anchors.right: parent.right
                            text: demoSidebar.collapsed ? ChaSetI18n.tr("surfaces.sidebar.expand") : ChaSetI18n.tr("surfaces.sidebar.collapse")
                            variant: "outline"
                            size: "sm"
                            onClicked: {
                                demoSidebar.toggle()
                            }
                        }
                    }
                }

                // Inset Content Page
                Rectangle {
                    anchors.left: demoSidebar.right
                    anchors.right: parent.right
                    anchors.top: parent.top
                    anchors.bottom: parent.bottom
                    anchors.margins: 12
                    color: ThemeTokens.panel
                    border.color: ThemeTokens.border
                    radius: 6

                    Column {
                        anchors.centerIn: parent
                        spacing: 12

                        DocText {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: ChaSetI18n.tr("surfaces.sidebar.mainViewportInset")
                            color: ThemeTokens.text
                            font.pixelSize: Typography.sizeHeading
                            font.weight: Typography.weightSemibold
                        }

                        Row {
                            anchors.horizontalCenter: parent.horizontalCenter
                            spacing: 8

                            DocText {
                                anchors.verticalCenter: parent.verticalCenter
                                text: ChaSetI18n.tr("surfaces.sidebar.sidebarWidth")
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                            }

                            ChaSetBadge {
                                anchors.verticalCenter: parent.verticalCenter
                                variant: "outline"
                                text: "" + Math.round(demoSidebar.width)
                            }

                            ChaSetBadge {
                                anchors.verticalCenter: parent.verticalCenter
                                variant: demoSidebar.collapsed ? "secondary" : "default"
                                text: demoSidebar.collapsed ? ChaSetI18n.tr("surfaces.sidebar.collapsed") : ChaSetI18n.tr("surfaces.sidebar.expanded")
                            }
                        }

                        Row {
                            anchors.horizontalCenter: parent.horizontalCenter
                            spacing: 8

                            ChaSetButton {
                                text: demoSidebar.collapsed ? ChaSetI18n.tr("surfaces.sidebar.expandSidebar") : ChaSetI18n.tr("surfaces.sidebar.collapseSidebar")
                                variant: "outline"
                                size: "sm"
                                onClicked: demoSidebar.toggle()
                            }

                            ChaSetButton {
                                text: ChaSetI18n.tr("surfaces.sidebar.resetWidth220")
                                variant: "ghost"
                                size: "sm"
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

    
    ComponentReference {
        name: "Sidebar"
        componentId: "sidebar"
        propsModel: [
            { name: "sidebarWidth", type: "int", default: "256", description: ChaSetI18n.tr("components.sidebar.sidebarWidthDesc", "Expanded width of the sidebar bound.") },
            { name: "minWidth", type: "int", default: "160", description: ChaSetI18n.tr("components.sidebar.minWidthDesc", "Minimum draggable width limit.") },
            { name: "maxWidth", type: "int", default: "400", description: ChaSetI18n.tr("components.sidebar.maxWidthDesc", "Maximum draggable width limit.") },
            { name: "iconWidth", type: "int", default: "52", description: ChaSetI18n.tr("components.sidebar.iconWidthDesc", "Width when collapsed in icon mode.") },
            { name: "collapsed", type: "bool", default: "false", description: ChaSetI18n.tr("components.sidebar.collapsedDesc", "Whether the sidebar is currently collapsed.") },
            { name: "side", type: "string", default: "'left'", description: ChaSetI18n.tr("components.sidebar.sideDesc", "Docking side for the sidebar layout.") },
            { name: "variant", type: "string", default: "'sidebar'", description: ChaSetI18n.tr("components.sidebar.variantDesc", "Visual container styling variant.") },
            { name: "collapsible", type: "string", default: "'icon'", description: ChaSetI18n.tr("components.sidebar.collapsibleDesc", "Collapsing behavior mode when closed on desktop.") },
            { name: "resizable", type: "bool", default: "true", description: ChaSetI18n.tr("components.sidebar.resizableDesc", "Enables interactive edge dragging rail for dynamic resizing.") }
        ]
    }
}
