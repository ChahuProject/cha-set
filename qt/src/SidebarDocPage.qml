// SidebarDocPage.qml — Living Documentation for ChaSetSidebar
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Navigation"
    pageTitle: "Sidebar"
    description: "Composable, responsive and resizable desktop-grade sidebar navigation system supporting expanded, icon collapsed, and offcanvas modes."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property bool demoCollapsed: false
    property string demoVariant: "sidebar"
    property string demoCollapsible: "icon"

    ComponentPreview {
        title: "Sidebar Interactive Sandbox"
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

        Text {
            text: sidebar.collapsed ? "🍵" : "🍵 ChaSet Studio"
            color: ThemeTokens.text
            font.weight: Font.Bold
        }

        ChaSetButton {
            width: parent.width
            text: sidebar.collapsed ? "📊" : "Dashboard"
            variant: "default"
        }
    }
}`

        Item {
            anchors.fill: parent

            // Preview Container Box
            Rectangle {
                anchors.centerIn: parent
                width: Math.min(parent.width - 40, 680)
                height: 380
                color: ThemeTokens.background
                border.color: ThemeTokens.border
                radius: 8
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

                    Column {
                        anchors.fill: parent
                        anchors.margins: 12
                        spacing: 12

                        // Header Bar
                        Row {
                            width: parent.width
                            spacing: 8

                            Text {
                                text: "🍵"
                                font.pixelSize: 18
                                anchors.verticalCenter: parent.verticalCenter
                            }

                            Text {
                                visible: !demoSidebar.collapsed
                                text: "ChaSet Studio"
                                color: ThemeTokens.text
                                font.pixelSize: 14
                                font.weight: Font.Bold
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: 1
                            color: ThemeTokens.border
                        }

                        // Navigation Items
                        Column {
                            width: parent.width
                            spacing: 6

                            ChaSetButton {
                                width: parent.width
                                text: demoSidebar.collapsed ? "🏠" : "  🏠  Overview"
                                variant: "default"
                                size: "sm"
                            }

                            ChaSetButton {
                                width: parent.width
                                text: demoSidebar.collapsed ? "📂" : "  📂  Projects"
                                variant: "ghost"
                                size: "sm"
                            }

                            ChaSetButton {
                                width: parent.width
                                text: demoSidebar.collapsed ? "⚙️" : "  ⚙️  Preferences"
                                variant: "ghost"
                                size: "sm"
                            }
                        }

                        Item {
                            width: 1
                            height: parent.height - 230
                        }

                        // Footer Toggle Trigger
                        ChaSetButton {
                            width: parent.width
                            text: demoSidebar.collapsed ? "▶" : "◀ Collapse"
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

                        Text {
                            anchors.horizontalCenter: parent.horizontalCenter
                            text: "Main Viewport Inset"
                            color: ThemeTokens.text
                            font.pixelSize: 16
                            font.weight: Font.DemiBold
                        }

                        Row {
                            anchors.horizontalCenter: parent.horizontalCenter
                            spacing: 8

                            Text {
                                anchors.verticalCenter: parent.verticalCenter
                                text: "Sidebar Width:"
                                color: ThemeTokens.subduedText
                                font.pixelSize: 12
                            }

                            ChaSetBadge {
                                anchors.verticalCenter: parent.verticalCenter
                                variant: "outline"
                                text: "" + Math.round(demoSidebar.width)
                            }

                            ChaSetBadge {
                                anchors.verticalCenter: parent.verticalCenter
                                variant: demoSidebar.collapsed ? "secondary" : "default"
                                text: demoSidebar.collapsed ? "Collapsed" : "Expanded"
                            }
                        }

                        Row {
                            anchors.horizontalCenter: parent.horizontalCenter
                            spacing: 8

                            ChaSetButton {
                                text: demoSidebar.collapsed ? "Expand Sidebar" : "Collapse Sidebar"
                                variant: "outline"
                                size: "sm"
                                onClicked: demoSidebar.toggle()
                            }

                            ChaSetButton {
                                text: "Reset Width (220)"
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

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetSidebar {\n    sidebarWidth: 256\n    collapsible: \"icon\"\n    // content...\n}"
        language: "qml"
    }

    
    KeyboardShortcutsTable {
        componentId: "sidebar"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "sidebarWidth", type: "int", default: "256", description: "Expanded width of the sidebar bound." },
            { name: "minWidth", type: "int", default: "160", description: "Minimum draggable width limit." },
            { name: "maxWidth", type: "int", default: "400", description: "Maximum draggable width limit." },
            { name: "iconWidth", type: "int", default: "52", description: "Width when collapsed in icon mode." },
            { name: "collapsed", type: "bool", default: "false", description: "Whether the sidebar is currently collapsed." },
            { name: "side", type: "string", default: "'left'", description: "Dock side: 'left' | 'right'." },
            { name: "variant", type: "string", default: "'sidebar'", description: "Visual container variant: 'sidebar' | 'floating' | 'inset'." },
            { name: "collapsible", type: "string", default: "'icon'", description: "Collapse strategy: 'offcanvas' | 'icon' | 'none'." },
            { name: "resizable", type: "bool", default: "true", description: "Enables interactive edge dragging rail for dynamic resizing." }
        ]
    }
}
