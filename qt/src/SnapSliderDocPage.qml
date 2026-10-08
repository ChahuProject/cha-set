// SnapSliderDocPage.qml — Living Documentation for ChaSetSnapSlider
import QtQuick 6.10
import QtQuick.Controls 6.10
import QtQuick.Layouts 6.10
import ChaSet

DocLayout {
    id: root
    category: "Forms & Inputs"
    pageTitle: "Snap Slider"
    description: ChaSetI18n.tr("components.snap-slider.description", "Stepped discrete slider that snaps to defined stops with ticks and label row.")
    property int demoIndex: 1
    readonly property var demoLabels: ["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]

    ComponentPreview {
        title: ChaSetI18n.tr("desktopComposite.snapSlider.sandboxTitle", "Snap Slider Sandbox")
        reactCode: `<SnapSlider
  count={5}
  labels={["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]}
  leftLabel="Slow"
  rightLabel="Fast"
  value={value}
  onChange={setValue}
/>`
        qtCode: `ChaSetSnapSlider {
    count: 5
    labels: ["0.5x", "1.0x", "1.5x", "2.0x", "3.0x"]
    leftLabel: "Slow"
    rightLabel: "Fast"
    currentIndex: 1
    onIndexChanged: function(idx) { console.log(idx) }
}`

        Item {
            anchors.fill: parent

            Column {
                anchors.centerIn: parent
                spacing: ThemeTokens.dp(20)
                width: ThemeTokens.dp(280)

                ChaSetSnapSlider {
                    width: parent.width
                    count: 5
                    labels: root.demoLabels
                    leftLabel: ChaSetI18n.tr("formsA.snapSlider.slow", "Slow")
                    rightLabel: ChaSetI18n.tr("formsA.snapSlider.fast", "Fast")
                    currentIndex: root.demoIndex
                    onIndexChanged: function(idx) {
                        root.demoIndex = idx
                    }
                }
            }
        }
    }

    DocAnatomy {
        sectionId: "anatomy"
        reactCode: `import { SnapSlider } from '@chahu/cha-set';

<SnapSlider stops={[0, 25, 50, 75, 100]} value={50} onChange={(v) => console.log(v)} />`
        qtCode: `import ChaSet

ChaSetSnapSlider {
    stops: [0, 25, 50, 75, 100]
    value: 50
}`
    }

    Item {
        id: animationsSection
        property string sectionId: "animations"
        width: parent ? parent.width : 0
        height: animCol.implicitHeight

        Column {
            id: animCol
            width: parent.width
            spacing: 8

            DocText {
                text: ChaSetI18n.tr("showcase.animations", "Animations")
                font.pixelSize: Typography.sizeTitleSm
                font.bold: true
                color: ThemeTokens.text
            }

            DocText {
                width: parent.width
                wrap: true
                text: ChaSetI18n.tr("desktopComposite.snapSlider.animationsDescQt", "Thumb hover and focus transitions animate over ThemeTokens.motionQuick (90ms) with ThemeTokens.easeStandard. Dragging tracks pointer without lag in 60fps.")
                color: ThemeTokens.subduedText
                font.pixelSize: Typography.sizeSmall
            }
        }
    }

    ComponentReference {
        name: "SnapSlider"
        componentId: "snap-slider"
        props: [
            { name: "currentIndex", type: "int", defaultVal: "0", description: ChaSetI18n.tr("components.snapSlider.currentIndexDesc", "Current selected stop index (aliased as value).") },
            { name: "count", type: "int", defaultVal: "5", description: ChaSetI18n.tr("components.snapSlider.countDescQt", "Total number of discrete snap stops.") },
            { name: "labels", type: "var", defaultVal: "[]", description: ChaSetI18n.tr("components.snapSlider.labelsDescQt", "List of labels for each stop.") },
            { name: "leftLabel", type: "string", defaultVal: '""', description: ChaSetI18n.tr("components.snapSlider.leftLabelDescQt", "Boundary label on the bottom-left edge.") },
            { name: "rightLabel", type: "string", defaultVal: '""', description: ChaSetI18n.tr("components.snapSlider.rightLabelDescQt", "Boundary label on the bottom-right edge.") },
            { name: "showTicks", type: "bool", defaultVal: "true", description: ChaSetI18n.tr("components.snapSlider.showTicksDescQt", "Displays tick mark indicators for stops.") },
            { name: "disabled", type: "bool", defaultVal: "false", description: ChaSetI18n.tr("components.snapSlider.disabledDescQt", "Disables interaction and dims opacity.") },
            { name: "readOnly", type: "bool", defaultVal: "false", description: ChaSetI18n.tr("components.snapSlider.readOnlyDescQt", "Prevents changes while maintaining contrast.") },
            { name: "size", type: "string", defaultVal: '"default"', description: ChaSetI18n.tr("components.snapSlider.sizeDescQt", "Density variant (\"default\" | \"sm\").") }
        ]
    }
}
