// SplitterHandleDocPage.qml — Living Documentation for ChaSetSplitterHandle
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Splitter Handle"
    description: ChaSetI18n.tr("components.splitterHandle.description", "Edge resize handle with reference item coordinate stabilization, min/max clamping, and keyboard navigation.")

    property real sidebarWidth: 200
    property real bottomHeight: 120

    ComponentPreview {
        id: heroPreview
        title: ChaSetI18n.tr("desktopComposite.splitterHandle.sandboxTitle", "Splitter Handle Sandbox")
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
                width: Math.min(parent.width - ThemeTokens.dp(48), ThemeTokens.dp(520))
                height: ThemeTokens.dp(220)
                color: ThemeTokens.background
                radius: ThemeTokens.dp(6)
                border.color: ThemeTokens.border
                border.width: 1
                clip: true

                Row {
                    anchors.fill: parent
                    // Inset by the outer 1px border ring: the sidebar pane is
                    // an opaque square Rectangle that would otherwise paint
                    // over the border and rounded corners (occlusion fix).
                    // The edge:right visual line stays inset from the frame
                    // via its own dp(6) top/bottom margins (no T-junction).
                    anchors.margins: 1

                    Rectangle {
                        id: sidebarBox
                        width: root.sidebarWidth
                        height: parent.height
                        color: ThemeTokens.panel
                        topLeftRadius: ThemeTokens.dp(5)
                        topRightRadius: 0
                        bottomLeftRadius: ThemeTokens.dp(5)
                        bottomRightRadius: 0

                        Column {
                            anchors.centerIn: parent
                            spacing: 6

                            DocText {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: ChaSetI18n.tr("surfaces.splitterHandle.sidebar")
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
                                text: ChaSetI18n.tr("surfaces.splitterHandle.mainContent")
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeBody
                            }

                            DocText {
                                anchors.horizontalCenter: parent.horizontalCenter
                                text: ChaSetI18n.tr("surfaces.splitterHandle.focusHint")
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
                    width: Math.min(parent.width, ThemeTokens.dp(440))
                    height: ThemeTokens.dp(180)
                    implicitHeight: ThemeTokens.dp(180)
                    color: ThemeTokens.background
                    radius: ThemeTokens.dp(6)
                    border.color: ThemeTokens.border
                    border.width: 1
                    clip: true

                    Item {
                        anchors.fill: parent
                        // Inset by the outer 1px border ring so the bottom
                        // pane never covers the border or corners.
                        anchors.margins: 1

                        Rectangle {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.top: parent.top
                            anchors.bottom: bottomBox.top
                            color: "transparent"

                            DocText {
                                anchors.centerIn: parent
                                text: ChaSetI18n.tr("surfaces.splitterHandle.editorCanvasArea")
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
                            topLeftRadius: 0
                            topRightRadius: 0
                            bottomLeftRadius: ThemeTokens.dp(5)
                            bottomRightRadius: ThemeTokens.dp(5)

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
                                    text: ChaSetI18n.tr("surfaces.splitterHandle.terminalConsole")
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