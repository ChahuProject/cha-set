// SplitterHandleDocPage.qml — Living Documentation for ChaSetSplitterHandle
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Layout & Surface"
    pageTitle: "Splitter Handle"
    description: "Edge resize handle with reference item coordinate stabilization, min/max clamping, and keyboard navigation."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "vertical", title: "Vertical Edge (Bottom Panel)" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property real sidebarWidth: 220
    property real bottomHeight: 100

    ComponentPreview {
        id: heroPreview
        title: "Interactive Sandbox"
        reactCode: `<div className="flex h-64 border rounded overflow-hidden">
  <div style={{ width: ${Math.round(root.sidebarWidth)} }} className="bg-muted/30 p-4">
    Sidebar (${Math.round(root.sidebarWidth)}px)
  </div>
  <SplitterHandle
    edge="right"
    targetSize={${Math.round(root.sidebarWidth)}}
    minSize={140}
    maxSize={380}
    onSizeChanging={setSidebarWidth}
  />
  <div className="flex-1 p-4">Main Content</div>
</div>`
        qtCode: `Row {
    width: parent.width
    height: 240

    Rectangle {
        width: root.sidebarWidth
        height: parent.height
        color: ThemeTokens.panel

        ChaSetSplitterHandle {
            edge: "right"
            targetSize: root.sidebarWidth
            minSize: 140
            maxSize: 380
            onSizeChanging: (newSize) => root.sidebarWidth = newSize
        }
    }

    Rectangle {
        width: parent.width - root.sidebarWidth
        height: parent.height
        color: ThemeTokens.background
    }
}`

        // Stage Container
        Rectangle {
            anchors.fill: parent
            color: "transparent"

            Rectangle {
                anchors.centerIn: parent
                width: Math.min(parent.width - 48, 520)
                height: 220
                color: ThemeTokens.background
                radius: 6
                border.color: ThemeTokens.border
                border.width: 1
                clip: true

                Row {
                    anchors.fill: parent

                    Rectangle {
                        id: sidebarBox
                        width: root.sidebarWidth
                        height: parent.height
                        color: ThemeTokens.panel

                        Column {
                            anchors.centerIn: parent
                            spacing: 6

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Sidebar Panel"
                                color: ThemeTokens.text
                                font.pixelSize: 13
                                font.bold: true
                            }

                            ChaSetBadge {
                                anchors.horizontalCenter: parent.horizontalCenter
                                variant: "secondary"
                                text: "" + Math.round(root.sidebarWidth)
                            }
                        }

                        ChaSetSplitterHandle {
                            edge: "right"
                            targetSize: root.sidebarWidth
                            minSize: 140
                            maxSize: 360
                            defaultSize: 220
                            onSizeChanging: function(newSize) { root.sidebarWidth = newSize; }
                            onSizeChanged: function(finalSize) { root.sidebarWidth = finalSize; }
                        }
                    }

                    Rectangle {
                        width: parent.width - root.sidebarWidth
                        height: parent.height
                        color: "transparent"

                        Column {
                            anchors.centerIn: parent
                            spacing: 4

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Main Content Viewport"
                                color: ThemeTokens.text
                                font.pixelSize: 13
                            }

                            Text {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Focus handle and use Left/Right arrows or drag border"
                                color: ThemeTokens.subduedText
                                font.pixelSize: 11
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
                    Text {
                        anchors.verticalCenter: parent.verticalCenter
                        text: "Width:"
                        color: ThemeTokens.subduedText
                        font.pixelSize: 12
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
                    text: "Reset to 220"
                    onClicked: root.sidebarWidth = 220
                }
            }
        ]
    }

    // Vertical Edge (Bottom Panel)
    Text {
        text: "Vertical Edge (Bottom Panel)"
        font.pixelSize: 18
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

                Text {
                    width: parent.width
                    wrapMode: Text.Wrap
                    text: "Handles can also be attached to top or bottom edges to control vertical drawers or console panes."
                    color: ThemeTokens.subduedText
                    font.pixelSize: 12
                }

                Rectangle {
                    width: Math.min(parent.width, 440)
                    height: 180
                    color: ThemeTokens.background
                    radius: 6
                    border.color: ThemeTokens.border
                    border.width: 1
                    clip: true

                    Column {
                        anchors.fill: parent

                        Rectangle {
                            width: parent.width
                            height: parent.height - root.bottomHeight
                            color: "transparent"

                            Text {
                                anchors.centerIn: parent
                                text: "Editor Canvas"
                                color: ThemeTokens.subduedText
                                font.pixelSize: 12
                            }
                        }

                        Rectangle {
                            width: parent.width
                            height: root.bottomHeight
                            color: ThemeTokens.panel

                            ChaSetSplitterHandle {
                                edge: "top"
                                targetSize: root.bottomHeight
                                minSize: 50
                                maxSize: 130
                                defaultSize: 90
                                onSizeChanging: function(newSize) { root.bottomHeight = newSize; }
                                onSizeChanged: function(finalSize) { root.bottomHeight = finalSize; }
                            }

                            Row {
                                anchors.centerIn: parent
                                spacing: 8

                                Text {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: "Console"
                                    color: ThemeTokens.text
                                    font.pixelSize: 12
                                }

                                ChaSetBadge {
                                    anchors.verticalCenter: parent.verticalCenter
                                    variant: "secondary"
                                    text: "" + Math.round(root.bottomHeight)
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    // Keyboard Navigation
    Text {
        text: "Keyboard Navigation"
        font.pixelSize: 18
        font.bold: true
        color: ThemeTokens.text
    }

    KeyboardShortcutsTable {
        componentId: "splitter-handle"
    }

    // Props Reference
    PropsTable {
        title: "Props Reference"
        props: [
            { name: "edge", type: "string", default: "'left'", description: "Which edge of the target panel the resize handle controls ('left', 'right', 'top', 'bottom')." },
            { name: "targetSize", type: "real", default: "200", description: "Current size (width or height) of the target element being resized." },
            { name: "minSize", type: "real", default: "100", description: "Minimum allowed size bound." },
            { name: "maxSize", type: "real", default: "1000", description: "Maximum allowed size bound." },
            { name: "defaultSize", type: "real", default: "minSize", description: "Size restored when double-clicked or Enter is pressed." },
            { name: "liveUpdate", type: "bool", default: "true", description: "Whether size updates fire continuously during drag." },
            { name: "hitThickness", type: "real", default: "6", description: "Interactive mouse hit test zone thickness." },
            { name: "visualThickness", type: "real", default: "1", description: "Resting visible hairline thickness." },
            { name: "activeVisualThickness", type: "real", default: "2", description: "Highlighted visible hairline thickness when hovered or dragged." },
            { name: "disabled", type: "bool", default: "false", description: "Whether handle resizing is disabled." }
        ]
    }
}
