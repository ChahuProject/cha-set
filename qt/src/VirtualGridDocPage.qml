// VirtualGridDocPage.qml — Living Documentation for ChaSetVirtualGrid
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Virtual Grid"
    description: ChaSetI18n.tr("components.virtualGrid.description", "2D responsive windowed grid virtualizer for massive cards, matrix data, and dynamic layouts.")

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.virtualGrid.sandboxTitle", "Virtual Grid Sandbox")
        stageHeight: 360
        reactCode: `<VirtualGrid
  items={items}
  minColumnWidthRem={10}
  gapRem={0.75}
  estimateSize={96}
  renderCard={(item) => <Card>{item.title}</Card>}
/>`
        qtCode: `ChaSetVirtualGrid {
    width: 360
    height: 240
    cellWidth: 168
    cellHeight: 96
    model: 1000
    delegate: Item {
        // ...card delegate...
    }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                width: ThemeTokens.dp(360)
                spacing: ThemeTokens.dp(12)

                DocText {
                    anchors.horizontalCenter: parent.horizontalCenter
                    text: ChaSetI18n.tr("desktopComposite.virtualGrid.hint", "Rendering 1,000 Grid Cards with Responsive Recycling:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(8)

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualGrid.btnTop", "Top (#1)")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualGrid.scrollToIndex(0)
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualGrid.btn20", "Card #20")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualGrid.scrollToIndex(19)
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualGrid.btn500", "Card #500")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualGrid.scrollToIndex(499)
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualGrid.btnBottom1000", "Bottom (#1,000)")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualGrid.scrollToIndex(999)
                    }
                }

                ChaSetVirtualGrid {
                    id: virtualGrid
                    width: ThemeTokens.dp(360)
                    height: ThemeTokens.dp(220)
                    cellWidth: 168
                    cellHeight: 96
                    model: 1000

                    delegate: Item {
                        width: virtualGrid.effectiveCellWidth
                        height: virtualGrid.effectiveCellHeight

                        Rectangle {
                            anchors.fill: parent
                            anchors.margins: ThemeTokens.dp(4)
                            color: ThemeTokens.panel
                            border.color: ThemeTokens.border
                            border.width: 1
                            radius: ThemeTokens.dp(6)

                            Column {
                                anchors.centerIn: parent
                                spacing: ThemeTokens.dp(4)

                                DocText {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: ChaSetI18n.tr("desktopComposite.virtualGrid.assetLabel", "Asset #{{index}}", { index: index + 1 })
                                    color: ThemeTokens.text
                                    font.pixelSize: Typography.sizeSmall
                                    font.weight: Typography.weightSemibold
                                }

                                DocText {
                                    anchors.horizontalCenter: parent.horizontalCenter
                                    text: "1920x1080 • PNG"
                                    color: ThemeTokens.subduedText
                                    font.pixelSize: Typography.sizeMicro
                                    font.family: Typography.familyMono
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

ChaSetVirtualGrid {
    width: parent.width
    height: 400
    rows: 1000
    columns: 50
    rowHeight: 32
    columnWidth: 100
}`
        reactCode: `import { VirtualGrid } from '@chahu/cha-set';

<VirtualGrid rowCount={1000} columnCount={50} rowHeight={32} columnWidth={100} />`
    }

    DocMarkdown {
        width: parent.width
        docId: "virtual-grid"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "virtual-grid"
        section: "props"
    }
}
