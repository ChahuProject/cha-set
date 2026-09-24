// VirtualListDocPage.qml — Living Documentation for ChaSetVirtualList
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Virtual List"
    description: "High-performance windowed virtualized list for handling 100k+ rows with native desktop wheel kinematics and delegate recycling."

    ComponentPreview {
        title: "Virtual List Sandbox"
        stageHeight: 380
        reactCode: `<VirtualList
  items={items}
  estimateSize={36}
  renderItem={(item) => (
    <div className="flex justify-between px-3 h-9">
      <span>{item.title}</span>
      <Badge>{item.tag}</Badge>
    </div>
  )}
/>`
        qtCode: `ChaSetVirtualList {
    width: 340
    height: 260
    model: 10000
    delegate: Rectangle {
        width: parent.width
        height: 36
        // ...delegate...
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
                    text: "Rendering 10,000 Virtual Items with Native Wheel Flicking:"
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
                        onClicked: virtualList.scrollToIndex(0)
                    }

                    ChaSetButton {
                        text: "Index #500"
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualList.scrollToIndex(500)
                    }

                    ChaSetButton {
                        text: "Index #5,000"
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualList.scrollToIndex(5000)
                    }

                    ChaSetButton {
                        text: "Bottom (#10,000)"
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualList.scrollToIndex(9999)
                    }
                }

                ChaSetVirtualList {
                    id: virtualList
                    width: ThemeTokens.dp(360)
                    height: ThemeTokens.dp(240)
                    model: 10000
                    delegate: Rectangle {
                        width: parent ? parent.width : 0
                        height: virtualList.effectiveItemHeight
                        color: index % 2 === 0 ? ThemeTokens.hover : "transparent"

                        DocText {
                            anchors.left: parent.left
                            anchors.leftMargin: ThemeTokens.dp(12)
                            anchors.right: badgeItem.left
                            anchors.rightMargin: ThemeTokens.dp(8)
                            anchors.verticalCenter: parent.verticalCenter
                            text: "Dataset Record #" + (index + 1)
                            color: ThemeTokens.text
                            font.pixelSize: Typography.sizeSmall
                            font.family: Typography.familyMono
                            elide: Text.ElideRight
                        }

                        ChaSetBadge {
                            id: badgeItem
                            anchors.right: parent.right
                            anchors.rightMargin: ThemeTokens.dp(12)
                            anchors.verticalCenter: parent.verticalCenter
                            text: index % 3 === 0 ? "Production" : "Staging"
                            variant: index % 3 === 0 ? "default" : "secondary"
                            size: "sm"
                        }
                    }
                }
            }
        }
    }

    DocAnatomy {
        width: parent.width
        qtCode: `import ChaSet

ChaSetVirtualList {
    width: parent.width
    height: 400
    count: 10000
    itemHeight: 36
}`
        reactCode: `import { VirtualList } from '@chahu/cha-set';

<VirtualList count={10000} itemHeight={36} renderItem={(index) => <div>Row {index}</div>} />`
    }



    "
        language: "qml"
    }

    ComponentReference {
        name: "VirtualList"
        componentId: "virtual-list"
        propsModel: [
            { name: "model", type: "var", default: "null", description: "List model count or array for delegate generation." },
            { name: "delegate", type: "Component", default: "null", description: "Visual delegate instantiated for visible rows." },
            { name: "itemHeight", type: "int", default: "36", description: "Default estimated height of each row." },
            { name: "estimateSize", type: "int", default: "36", description: "Estimated height of each item for virtual measurement." },
            { name: "gap", type: "int", default: "0", description: "Vertical spacing between adjacent items." },
            { name: "overscan", type: "int", default: "8", description: "Number of buffer items rendered beyond viewport bounds." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the list viewport container." },
            { name: "scrollToIndex(index)", type: "function", default: "function", description: "Programmatically scrolls to the target item index." }
        ]
    }
}
        ]
    }
}
