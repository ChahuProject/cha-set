// VirtualListDocPage.qml — Living Documentation for ChaSetVirtualList
import QtQuick
import QtQuick.Controls
import ChaSet

DocLayout {
    id: root
    category: "Desktop & Virtualization"
    pageTitle: "Virtual List"
    description: ChaSetI18n.tr("components.virtual-list.description", "High-performance windowed 100k+ row list powered by TanStack Virtual, rendering only DOM nodes visible in the active viewport.")

    Column {
        property string sectionId: "overview"
        width: parent.width
        spacing: 12

        DocText {
            text: ChaSetI18n.tr("desktopComposite.virtualList.overviewHeading", "Interactive Overview")
            color: ThemeTokens.text
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
        }

        DocText {
            text: ChaSetI18n.tr("desktopComposite.virtualList.renderingHint", "Rendering {{count}} virtual items smoothly at 60fps. Use the controls below to trigger programmatic scrolling or scroll rapidly to observe instant windowing.", { "count": "10,000" })
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
            wrapMode: TextEdit.WordWrap
            width: parent.width
        }
    }

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.virtualList.sandboxTitle", "Virtual List Sandbox")
        stageHeight: 380
        reactCode: `const listRef = useRef<VirtualListHandle>(null);

// Programmatic jump
listRef.current?.scrollToIndex(500, 'center');

<VirtualList
  ref={listRef}
  items={items}
  estimateSize={36}
  className="h-64 border rounded-md"
  renderItem={(item, index) => (
    <div className="flex items-center justify-between px-3 h-9 border-b border-border/50 text-xs">
      <span>{item.title}</span>
      <Badge size="sm">{item.tag}</Badge>
    </div>
  )}
/>`
        qtCode: `ChaSetVirtualList {
    id: virtualList
    width: 360
    height: 240
    model: 10000
    delegate: Rectangle {
        required property int index
        width: ListView.view.width
        height: virtualList.effectiveItemHeight
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
                    text: ChaSetI18n.tr("desktopComposite.virtualList.hint", "Rendering 10,000 Virtual Items with Native Wheel Flicking:")
                    color: ThemeTokens.subduedText
                    font.pixelSize: Typography.sizeSmall
                }

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: ThemeTokens.dp(8)

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualList.btnTop", "Top (#1)")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualList.scrollToIndex(0, "start")
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualList.btn500", "Index #500")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualList.scrollToIndex(500, "center")
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualList.btn2500", "Index #2,500")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualList.scrollToIndex(2500, "center")
                    }

                    ChaSetButton {
                        text: ChaSetI18n.tr("desktopComposite.virtualList.btnBottom", "Bottom (#10,000)")
                        variant: "outline"
                        size: "sm"
                        onClicked: virtualList.scrollToIndex(9999, "end")
                    }
                }

                ChaSetVirtualList {
                    id: virtualList
                    width: ThemeTokens.dp(360)
                    height: ThemeTokens.dp(240)
                    model: 10000
                    delegate: Rectangle {
                        required property int index
                        width: ListView.view ? ListView.view.width : (parent ? parent.width : virtualList.width)
                        height: virtualList.effectiveItemHeight > 0 ? virtualList.effectiveItemHeight : ThemeTokens.dp(36)
                        color: index % 2 === 0 ? ThemeTokens.hover : "transparent"

                        DocText {
                            anchors.left: parent.left
                            anchors.leftMargin: ThemeTokens.dp(12)
                            anchors.right: badgeItem.left
                            anchors.rightMargin: ThemeTokens.dp(8)
                            anchors.verticalCenter: parent.verticalCenter
                            text: ChaSetI18n.tr("desktopComposite.virtualList.itemTitle", "Dataset Item #{{index}}", { index: index + 1 })
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
                            text: index % 2 === 0 ? ChaSetI18n.tr("desktopComposite.virtualList.production", "Production") : ChaSetI18n.tr("desktopComposite.virtualList.staging", "Staging")
                            variant: index % 2 === 0 ? "secondary" : "outline"
                            size: "sm"
                        }

                        Rectangle {
                            anchors.left: parent.left
                            anchors.right: parent.right
                            anchors.bottom: parent.bottom
                            height: 1
                            color: ThemeTokens.border
                            opacity: 0.3
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

    DocMarkdown {
        width: parent.width
        docId: "virtual-list"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "virtual-list"
        section: "props"
    }
}
