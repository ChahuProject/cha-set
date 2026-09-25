// VirtualGridDocPage.qml — Living Documentation for ChaSetVirtualGrid
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Virtual Grid"
    description: "2D windowed grid virtualizer for high-performance visualization of massive visual card and thumbnail matrices."

    ComponentPreview {
        title: "Virtual Grid Sandbox"
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
                    text: "Rendering 1,000 Grid Cards with Responsive Recycling:"
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(8)

                    ChaSetButton {
                        text: "Top (#1)"
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualGrid.scrollToIndex(0)
                    }

                    ChaSetButton {
                        text: "Card #20"
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualGrid.scrollToIndex(19)
                    }

                    ChaSetButton {
                        text: "Card #500"
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualGrid.scrollToIndex(499)
                    }

                    ChaSetButton {
                        text: "Bottom (#1,000)"
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
                                    text: "Asset #" + (index + 1)
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

    ComponentReference {
        name: "VirtualGrid"
        componentId: "virtual-grid"
        propsModel: [
            { name: "model", type: "var", default: "null", description: "Number of grid items or data array." },
            { name: "cellWidth", type: "int", default: "160", description: "Width of each grid slot cell." },
            { name: "cellHeight", type: "int", default: "120", description: "Height of each grid slot cell." },
            { name: "minColumnWidthRem", type: "real", default: "12", description: "Minimum column width guideline." },
            { name: "gapRem", type: "real", default: "0.75", description: "Grid gap spacing guideline." },
            { name: "estimateSize", type: "int", default: "180", description: "Estimated cell height for virtual calculation." },
            { name: "overscan", type: "int", default: "4", description: "Buffer rows rendered outside visible bounds." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the grid container." },
            { name: "scrollToIndex(index)", type: "function", default: "function", description: "Scrolls the virtual grid to the target card index." }
        ]
    }
}
