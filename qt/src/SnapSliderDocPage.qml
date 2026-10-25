// SnapSliderDocPage.qml — Living Documentation for ChaSetSnapSlider
import QtQuick
import QtQuick.Controls
import QtQuick.Layouts
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

    DocMarkdown {
        width: parent.width
        docId: "snap-slider"
        section: "animations"
    }

    DocMarkdown {
        width: parent.width
        docId: "snap-slider"
        section: "keyboard"
    }

    DocMarkdown {
        width: parent.width
        docId: "snap-slider"
        section: "props"
    }
}
