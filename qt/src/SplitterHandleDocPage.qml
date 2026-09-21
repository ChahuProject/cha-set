// SplitterHandleDocPage.qml — Living Documentation for ChaSetSplitterHandle
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Splitter Handle"
    description: "Edge resize handle with reference item coordinate stabilization, min/max clamping, and keyboard navigation."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "vertical", title: "Vertical Edge Handle" },
        { id: "installation", title: "Installation" },
        { id: "animations", title: "Animations" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property real sidebarWidth: 200
    property real bottomHeight: 120

    ComponentPreview {
        id: heroPreview
        title: "Splitter Handle Sandbox"
        reactCode: `<div className="flex h-64 border rounded overflow-hidden">
  <div style={{ width: \`\${sidebarWidth * 0.0625}rem\` }} className="relative bg-muted/30 p-4">
    Sidebar Content (\${sidebarWidth})
    <SplitterHandle
      edge="right"
      targetSize={sidebarWidth}
      minSize={140}
      maxSize={400}
      onSizeChanging={setSidebarWidth}
      onSizeChanged={setSidebarWidth}
    />
  </div>
  <div className="flex-1 p-4">
    Main Viewport Area
  </div>
</div>`
        qtCode: `Row {
    width: parent.width
    height: 260

    Rectangle {
        width: root.sidebarWidth
        height: parent.height
        color: ThemeTokens.card

        Text {
            anchors.centerIn: parent
            text: "Sidebar (" + root.sidebarWidth + ")"
            color: ThemeTokens.text
        }

        ChaSetSplitterHandle {
            edge: "right"
            targetSize: root.sidebarWidth
            minSize: 140
            maxSize: 400
            onSizeChanging: (newSize) => root.sidebarWidth = newSize
            onSizeChanged: (finalSize) => root.sidebarWidth = finalSize
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

                            DocText {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Sidebar"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
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
                            maxSize: 400
                            defaultSize: 200
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

                            DocText {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Main Content Viewport"
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                            }

                            DocText {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: "Focus handle and use arrow keys to resize"
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeCaption
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
                        text: "Current Width:"
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
                    text: "Reset to 200"
                    onClicked: root.sidebarWidth = 200
                }
            }
        ]
    }

    // Vertical Edge Handle
    DocText {
        text: "Vertical Edge Handle"
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

                DocText {
                    width: parent.width
                    wrapMode: TextEdit.Wrap
                    text: "Handles can also be attached to horizontal edges (top or bottom) for bottom console or drawer resizing."
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                Rectangle {
                    width: Math.min(parent.width, 440)
                    height: 180
                    implicitHeight: 180
                    color: ThemeTokens.background
                    radius: 6
                    border.color: ThemeTokens.border
                    border.width: 1
                    clip: true

                    Item {
                        anchors.fill: parent

                        Rectangle {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.top: parent.top
                            anchors.bottom: bottomBox.top
                            color: "transparent"

                            DocText {
                                anchors.centerIn: parent
                                text: "Editor / Log Canvas Area"
                                color: ThemeTokens.subduedText
                                font.pixelSize: Typography.sizeSmall
                            }
                        }

                        Rectangle {
                            id: bottomBox
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: root.bottomHeight
                            color: ThemeTokens.panel

                            ChaSetSplitterHandle {
                                edge: "top"
                                targetSize: root.bottomHeight
                                minSize: 60
                                maxSize: 180
                                defaultSize: 120
                                onSizeChanging: function(newSize) { root.bottomHeight = newSize; }
                                onSizeChanged: function(finalSize) { root.bottomHeight = finalSize; }
                            }

                            Row {
                                anchors.centerIn: parent
                                spacing: 8

                                DocText {
                                    anchors.verticalCenter: parent.verticalCenter
                                    text: "Terminal / Output Console"
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.bold: true
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

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetSplitterHandle { edge: \"right\" }"
        language: "qml"
    }

    // Animations Section
    Column {
        width: parent.width
        spacing: 12

        DocText {
            text: "Animations"
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: "Motion tokens and kinematic timing contracts for SplitterHandle edge indicators."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }

        DocText {
            text: "• Active indicator color and opacity transitions animate smoothly over ThemeTokens.motionQuick (150ms) using ThemeTokens.easeStandard curve."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
        DocText {
            text: "• Handle dragging kinematics are strictly un-animated for deterministic, 60fps real-time pointer tracking."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
        DocText {
            text: "• All transitions are guarded by ThemeTokens.animationsEnabled; when disabled, durations resolve to zero and animations stop."
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    // Keyboard Navigation
    DocText {
        text: "Keyboard Navigation"
        font.pixelSize: Typography.sizeTitleSm
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
