// ViewportConstrainedContainerDocPage.qml — Living Documentation for ChaSetViewportConstrainedContainer
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Surfaces & Layout"
    pageTitle: "Viewport Constrained Container"
    description: "Container that dynamically bounds max-height based on available viewport space below the anchor, enabling smooth scrolling."

    ComponentPreview {
        title: "Viewport Constrained Container Sandbox"
        reactCode: `<ViewportConstrainedContainer maxHeight={240} margin={16}>
  <div className="p-3 flex flex-col gap-2">
    {items.map(item => <div key={item}>{item}</div>)}
  </div>
</ViewportConstrainedContainer>`
        qtCode: `ChaSetViewportConstrainedContainer {
    width: 260
    maxHeight: 220
    margin: 16

    Column {
        width: parent.width
        padding: 12
        spacing: 8
        Repeater {
            model: 12
            Rectangle {
                width: parent.width - 24
                height: 32
                radius: 4
                color: ThemeTokens.color("panelRaised")
                Text {
                    anchors.centerIn: parent
                    text: "Item #" + (index + 1)
                    color: ThemeTokens.text
                    font.pixelSize: 12
                }
            }
        }
    }
}`

        Item {
            anchors.fill: parent

            ChaSetViewportConstrainedContainer {
                anchors.horizontalCenter: parent.horizontalCenter
                anchors.top: parent.top
                anchors.topMargin: ThemeTokens.dp(24)
                width: ThemeTokens.dp(260)
                maxHeight: ThemeTokens.dp(220)
                margin: ThemeTokens.dp(16)

                Column {
                    width: parent.width
                    padding: ThemeTokens.dp(12)
                    spacing: ThemeTokens.dp(8)

                    Repeater {
                        model: 12
                        Rectangle {
                            width: parent ? parent.width - ThemeTokens.dp(24) : ThemeTokens.dp(200)
                            height: ThemeTokens.dp(32)
                            radius: ThemeTokens.dp(4)
                            color: ThemeTokens.color("panelRaised")
                            border.width: 1
                            border.color: ThemeTokens.border

                            DocText {
                                anchors.left: parent.left
                                anchors.leftMargin: ThemeTokens.dp(10)
                                anchors.verticalCenter: parent.verticalCenter
                                text: "Constrained Item #" + (index + 1)
                                color: ThemeTokens.text
                                font.pixelSize: Typography.sizeSmall
                            }

                            ChaSetBadge {
                                text: "Active"
                                variant: "outline"
                                anchors.right: parent.right
                                anchors.rightMargin: 8
                                anchors.verticalCenter: parent.verticalCenter
                            }
                        }
                    }
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        width: parent.width
        qtCode: `import ChaSet

ChaSetViewportConstrainedContainer {
    maxHeight: 400
}`
        reactCode: `import { ViewportConstrainedContainer } from '@chahu/cha-set';

<ViewportConstrainedContainer maxHeight={400}>
  <div className="p-4">Constrained content</div>
</ViewportConstrainedContainer>`
    }

    // Section: Variants & Limits
    Column {
        property string sectionId: "variants"
        width: parent.width
        spacing: ThemeTokens.dp(12)

        DocText {
            text: "Variants & Limits"
            font.pixelSize: Typography.sizeTitleSm
            font.bold: true
            color: ThemeTokens.text
        }

        DocText {
            text: "Configure custom numeric overrides, string-based bounds, or custom margin offsets."
            color: ThemeTokens.subduedText
            font.pixelSize: Typography.sizeBody
        }

        Grid {
            width: parent.width
            columns: 3
            spacing: ThemeTokens.dp(16)

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: ThemeTokens.dp(8)
                Column {
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Strict 150 Limit"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetViewportConstrainedContainer {
                        width: parent.width
                        maxHeight: 150
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: ThemeTokens.dp(8)
                Column {
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "Always Scroll Overflow"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetViewportConstrainedContainer {
                        width: parent.width
                        maxHeight: 150
                        overflow: "scroll"
                    }
                }
            }

            ChaSetCard {
                width: (parent.width - ThemeTokens.dp(32)) / 3
                customRadius: ThemeTokens.dp(8)
                Column {
                    anchors.fill: parent
                    anchors.margins: ThemeTokens.dp(14)
                    spacing: ThemeTokens.dp(8)
                    DocText { text: "High Margin (48)"; color: ThemeTokens.text; font.pixelSize: Typography.sizeSmall; font.weight: Typography.weightSemibold }
                    ChaSetViewportConstrainedContainer {
                        width: parent.width
                        maxHeight: 150
                        margin: 48
                    }
                }
            }
        }
    }

    ComponentReference {
        name: "ViewportConstrainedContainer"
        componentId: "viewport-constrained-container"
        propsModel: [
            { name: "maxHeight", type: "var", default: "undefined", description: "Optional upper bound on max-height." },
            { name: "minHeight", type: "var", default: "80", description: "Minimum allowable height lower bound." },
            { name: "margin", type: "real", default: "16", description: "Reserved margin between container bottom and viewport bottom." },
            { name: "overflow", type: "string", default: "'auto'", description: "Overflow behavior ('auto' | 'scroll')." },
            { name: "customRadius", type: "int", default: "6", description: "Corner radius of the container." },
            { name: "backgroundColor", type: "color", default: "ThemeTokens.panel", description: "Background surface fill color." },
            { name: "borderColor", type: "color", default: "ThemeTokens.border", description: "Border outline color." }
        ]
    }
}

