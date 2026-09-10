// RangeSliderDocPage.qml — Living Documentation for ChaSetRangeSlider
import QtQuick 6.10
import QtQuick.Controls 6.10
import ChaSet

DocLayout {
    id: root
    category: "Interactive Controls"
    pageTitle: "Range Slider"
    description: "Dual-thumb slider control for selecting continuous or stepped numeric min-max intervals with collision prevention."
    tocItems: [
        { id: "preview", title: "Interactive Preview" },
        { id: "installation", title: "Installation" },
        { id: "keyboard", title: "Keyboard Navigation" },
        { id: "props", title: "API Reference" }
    ]

    property real minPrice: 25.0
    property real maxPrice: 75.0

    ComponentPreview {
        title: "Range Slider Preview"
        reactCode: `<RangeSlider
  min={0}
  max={100}
  step={1}
  value={[minPrice, maxPrice]}
  onValueChange={([min, max]) => {
    setMinPrice(min);
    setMaxPrice(max);
  }}
/>`
        qtCode: `ChaSetRangeSlider {
    from: 0
    to: 100
    firstValue: 25
    secondValue: 75
    onValuesChanged: function(f, s) { console.log(f, s) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: 16
                width: 280

                ChaSetRangeSlider {
                    width: parent.width
                    from: 0
                    to: 100
                    firstValue: root.minPrice
                    secondValue: root.maxPrice
                    onValuesChanged: function(f, s) {
                        root.minPrice = f
                        root.maxPrice = s
                    }
                }

                Row {
                    anchors.horizontalCenter: parent.horizontalCenter
                    spacing: 12

                    Text {
                        text: "Selected Interval: [" + Math.round(root.minPrice) + " - " + Math.round(root.maxPrice) + "]"
                        color: ThemeTokens.text
                        font.pixelSize: 12
                        font.family: "monospace"
                    }
                }
            }
        }
    }

    CodeBlock {
        title: "Installation"
        code: "import ChaSet 1.0\n\nChaSetRangeSlider { from: 0; to: 100 }"
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
            { name: "disabled", type: "bool", default: "false", description: "Whether the range slider interaction is disabled." }
        ]
    }
}
