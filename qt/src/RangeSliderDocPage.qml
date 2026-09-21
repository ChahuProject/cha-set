// RangeSliderDocPage.qml — Living Documentation for ChaSetRangeSlider
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Range Slider"
    description: "Dual-thumb slider control for selecting continuous or stepped numeric min-max intervals with collision prevention."
    tocItems: [
        { id: "overview", title: "Interactive Overview" },
        { id: "variants", title: "Sizes & States" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "Props Reference" }
    ]

    property real minPrice: 20.0
    property real maxPrice: 80.0

    ComponentPreview {
        title: "Range Slider Sandbox"
        reactCode: `<RangeSlider
  min={0}
  max={100}
  step={1}
  value={range}
  onValueChange={setRange}
/>`
        qtCode: `ChaSetRangeSlider {
    from: 0
    to: 100
    firstValue: 20
    secondValue: 80
    showTooltip: true
    onValuesChanged: function(f, s) { console.log(f, s) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 20
                width: 280

                Item {
                    width: parent.width
                    height: 16
                    DocText {
                        anchors.left: parent.left
                        text: "Min: " + Math.round(root.minPrice)
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                        font.family: Typography.familyMono
                    }
                    DocText {
                        anchors.right: parent.right
                        text: "Max: " + Math.round(root.maxPrice)
                        color: ThemeTokens.subduedText
                        font.pixelSize: Typography.sizeSmall
                        font.family: Typography.familyMono
                    }
                }

                ChaSetRangeSlider {
                    width: parent.width
                    from: 0
                    to: 100
                    firstValue: root.minPrice
                    secondValue: root.maxPrice
                    showTooltip: true
                    onValuesChanged: function(f, s) {
                        root.minPrice = f
                        root.maxPrice = s
                    }
                }
            }
        }
    }

    ComponentPreview {
        title: "Sizes & States Preview"
        reactCode: `<RangeSlider size="default" defaultValue={[20, 80]} showTooltip />
<RangeSlider size="sm" defaultValue={[30, 70]} showTooltip />
<RangeSlider size="sm" defaultValue={[25, 75]} readOnly />
<RangeSlider size="sm" defaultValue={[10, 90]} disabled />`
        qtCode: `ChaSetRangeSlider { size: "default"; firstValue: 20; secondValue: 80; showTooltip: true }
ChaSetRangeSlider { size: "sm"; firstValue: 30; secondValue: 70; showTooltip: true }
ChaSetRangeSlider { size: "sm"; firstValue: 25; secondValue: 75; readOnly: true }
ChaSetRangeSlider { size: "sm"; firstValue: 10; secondValue: 90; enabled: false }`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16
                width: 280

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: "Default with Tooltips"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetRangeSlider { width: parent.width; size: "default"; firstValue: 20; secondValue: 80; showTooltip: true }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: "Compact sm Tier"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetRangeSlider { width: parent.width; size: "sm"; firstValue: 30; secondValue: 70; showTooltip: true }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: "Read Only"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetRangeSlider { width: parent.width; size: "sm"; firstValue: 25; secondValue: 75; readOnly: true }
                }

                Column {
                    spacing: 4
                    width: parent.width
                    DocText { text: "Disabled"; color: ThemeTokens.subduedText; font.pixelSize: Typography.sizeCaption }
                    ChaSetRangeSlider { width: parent.width; size: "sm"; firstValue: 10; secondValue: 90; enabled: false }
                }
            }
        }
    }

    ChaSetCodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetRangeSlider { from: 0; to: 100; showTooltip: true }"
        language: "qml"
    }

    KeyboardShortcutsTable {
        componentId: "range-slider"
    }

    PropsTable {
        title: "Props Reference"
        props: [
            { name: "from", type: "real", default: "0.0", description: "Minimum bounds value of the slider." },
            { name: "to", type: "real", default: "100.0", description: "Maximum bounds value of the slider." },
            { name: "firstValue", type: "real", default: "20.0", description: "Value represented by the first thumb." },
            { name: "secondValue", type: "real", default: "80.0", description: "Value represented by the second thumb." },
            { name: "stepSize", type: "real", default: "1.0", description: "Stepped granularity increment." },
            { name: "size", type: "string", default: "'default'", description: "Size variant: 'default' | 'sm'." },
            { name: "showTooltip", type: "bool", default: "false", description: "Whether to show floating value tooltips above thumbs." },
            { name: "readOnly", type: "bool", default: "false", description: "Prevents dragging while preserving normal opacity." },
            { name: "disabled", type: "bool", default: "false", description: "Whether the range slider interaction is disabled." },
            { name: "minStepsBetweenThumbs", type: "real", default: "0.0", description: "Minimum gap between the two thumbs." }
        ]
    }
}
